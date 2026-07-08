export function createDinoPoseDomainKit(config = {}) {
  const state = {
    id: "dino-pose-domain-kit",
    entityId: config.entityId ?? "dino",
    pose: {
      version: "dino-pose-v1",
      phase: 0,
      speed: 0,
      turn: 0,
      jump: 0,
      hips: { bob: 0, yaw: 0 },
      chest: { pitch: -0.05, roll: 0 },
      head: { pitch: 0.08, yaw: 0 },
      tail: [],
      legs: { left: 0, right: 0 },
      arms: { left: -0.18, right: -0.18 }
    }
  };

  function update({ speed = 0, turn = 0, jump = 0, time = 0 } = {}) {
    const phase = time * Math.max(8, speed * 0.95);
    const stride = Math.sin(phase);
    state.pose.phase = phase;
    state.pose.speed = speed;
    state.pose.turn = turn;
    state.pose.jump = jump;
    state.pose.hips = { bob: Math.abs(stride) * 0.055 + jump * 0.12, yaw: 0 };
    state.pose.chest = { pitch: -0.05 + Math.abs(stride) * 0.025, roll: -turn * 0.06 };
    state.pose.head = { pitch: 0.08 - Math.abs(stride) * 0.03, yaw: -turn * 0.12 };
    state.pose.legs = { left: stride * 0.56, right: -stride * 0.56 };
    state.pose.arms = { left: -stride * 0.22 - 0.18, right: stride * 0.22 - 0.18 };
    state.pose.tail = Array.from({ length: 7 }, (_, i) => {
      const k = i / 6;
      return {
        yaw: -turn * (0.24 + k * 0.35) + Math.sin(time * 4 - i * 0.45) * (0.045 + k * 0.04),
        pitch: Math.sin(time * 5 - i * 0.3) * 0.025
      };
    });
    return state.pose;
  }

  return {
    id: state.id,
    kind: "dino-pose-domain",
    install({ eventBus }) {
      eventBus.on("runner.moved", ({ payload }) => {
        eventBus.emit("dino.pose.changed", update(payload));
      });
      eventBus.emit("dino.pose.ready", state.pose);
      return this;
    },
    update,
    getDescriptor() {
      return structuredClone(state.pose);
    },
    snapshot() {
      return { id: state.id, pose: state.pose };
    }
  };
}
