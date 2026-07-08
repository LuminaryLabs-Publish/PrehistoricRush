export function createHudDomainKit(config = {}) {
  const state = {
    id: "hud-domain-kit",
    descriptor: {
      version: "readability-hud-v1",
      targetDistance: config.targetDistance ?? 3600,
      layout: "title-progress-metrics-debug",
      showDebugLine: true
    }
  };

  function progress(distance = 0) {
    return Math.max(0, Math.min(1, distance / state.descriptor.targetDistance));
  }

  function render({ scene = "menu", distance = 0, speed = 0, shards = 0, best = 0, chunks = 0, heading = 0, rapier = false } = {}) {
    const ratio = progress(distance);
    return {
      title: "Prehistoric Rush",
      scene,
      progress: ratio,
      distance: Math.floor(distance),
      targetDistance: state.descriptor.targetDistance,
      speed: Number(speed).toFixed(1),
      shards,
      best: Math.floor(best),
      debug: `chunks ${chunks} / heading ${Math.round(heading)}° / Rapier ${rapier ? "on" : "fallback"}`
    };
  }

  return {
    id: state.id,
    kind: "hud-domain",
    install({ eventBus }) {
      eventBus.emit("hud.ready", state.descriptor);
      return this;
    },
    render,
    getDescriptor() {
      return structuredClone(state.descriptor);
    },
    snapshot() {
      return { id: state.id, descriptor: state.descriptor };
    }
  };
}
