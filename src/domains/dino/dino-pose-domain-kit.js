export function createDinoPoseDomainKit(config = {}) {
  const state = {
    id: "dino-pose-domain-kit",
    entityId: config.entityId ?? "dino",
    tuning: {
      legSwing: config.legSwing ?? 0.9,
      footLift: config.footLift ?? 0.18,
      hipBob: config.hipBob ?? 0.11,
      armSwing: config.armSwing ?? 0.35,
      tailSwing: config.tailSwing ?? 0.09,
      headCounterMotion: config.headCounterMotion ?? 0.07,
      jumpStretch: config.jumpStretch ?? 0.08
    },
    pose: {
      version: "dino-pose-v2-readability",
      phase: 0,
      speed: 0,
      turn: 0,
      jump: 0,
      hips: { bob: 0, yaw: 0 },
      chest: { pitch: -0.05, roll: 0 },
      head: { pitch: 0.08, yaw: 0 },
      tail: [],
      legs: { left: 0, right: 0, leftLift: 0, rightLift: 0 },
      arms: { left: -0.18, right: -0.18 }
    }
  };

  function update({ speed = 0, turn = 0, jump = 0, time = 0 } = {}) {
    const phase = time * Math.max(8, speed * 0.95);
    const stride = Math.sin(phase);
    const leftLift = Math.max(0, stride) * state.tuning.footLift;
    const rightLift = Math.max(0, -stride) * state.tuning.footLift;
    state.pose.phase = phase;
    state.pose.speed = speed;
    state.pose.turn = turn;
    state.pose.jump = jump;
    state.pose.hips = { bob: Math.abs(stride) * state.tuning.hipBob + jump * 0.12, yaw: 0 };
    state.pose.chest = { pitch: -0.05 + Math.abs(stride) * 0.04, roll: -turn * 0.08 };
    state.pose.head = { pitch: 0.08 - Math.abs(stride) * state.tuning.headCounterMotion, yaw: -turn * 0.14 };
    state.pose.legs = { left: stride * state.tuning.legSwing, right: -stride * state.tuning.legSwing, leftLift, rightLift };
    state.pose.arms = { left: -stride * state.tuning.armSwing - 0.18, right: stride * state.tuning.armSwing - 0.18 };
    state.pose.tail = Array.from({ length: 7 }, (_, i) => {
      const k = i / 6;
      return {
        yaw: -turn * (0.28 + k * 0.38) + Math.sin(time * 4 - i * 0.45) * (state.tuning.tailSwing + k * 0.04),
        pitch: Math.sin(time * 5 - i * 0.3) * 0.035
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
      return { id: state.id, tuning: state.tuning, pose: state.pose };
    }
  };
}
