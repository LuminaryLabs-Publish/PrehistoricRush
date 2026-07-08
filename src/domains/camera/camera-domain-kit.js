export function createCameraDomainKit(config = {}) {
  const state = {
    id: "camera-domain-kit",
    preset: {
      version: "close-third-person-v1",
      distance: config.distance ?? 7.2,
      height: config.height ?? 3.0,
      lookAhead: config.lookAhead ?? 10.5,
      lookHeight: config.lookHeight ?? 1.25,
      followSharpness: config.followSharpness ?? 8.5,
      turnLead: config.turnLead ?? 1.2
    }
  };

  return {
    id: state.id,
    kind: "camera-domain",
    install({ eventBus }) {
      eventBus.emit("camera.preset.ready", state.preset);
      return this;
    },
    getDescriptor() {
      return structuredClone(state.preset);
    },
    snapshot() {
      return { id: state.id, preset: state.preset };
    }
  };
}
