export function createDinoMaterialDomainKit(config = {}) {
  const state = {
    id: "dino-material-domain-kit",
    descriptor: {
      entityId: config.entityId ?? "dino",
      version: "dino-material-v1",
      palette: {
        skin: config.skin ?? 0x77bd57,
        underbelly: config.underbelly ?? 0xd8c16d,
        ridge: config.ridge ?? 0x24552d,
        claw: config.claw ?? 0x172118,
        eye: config.eye ?? 0x0b1114,
        eyeGlow: config.eyeGlow ?? 0x62d7ff,
        outline: config.outline ?? 0x112513
      },
      style: {
        flatShaded: true,
        outlineScale: 1.045,
        highContrastBrow: true,
        visibleBellyMask: true
      }
    }
  };

  return {
    id: state.id,
    kind: "dino-material-domain",
    install({ eventBus }) {
      eventBus.emit("dino.material.ready", state.descriptor);
      return this;
    },
    getDescriptor() {
      return structuredClone(state.descriptor);
    },
    snapshot() {
      return { id: state.id, descriptor: state.descriptor };
    }
  };
}
