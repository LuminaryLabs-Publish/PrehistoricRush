export function createDinoFormDomainKit(config = {}) {
  const state = {
    id: "dino-form-domain-kit",
    descriptor: {
      entityId: config.entityId ?? "dino",
      version: "dino-form-v1",
      proportions: {
        hipScale: [1.35, 0.78, 0.95],
        torsoScale: [0.92, 0.56, 1.45],
        headScale: [0.9, 0.68, 1.14],
        tailSegments: 7,
        ridgePlateCount: 9,
        footLength: 0.62,
        thighRadius: 0.16,
        shinRadius: 0.1
      },
      silhouette: {
        forwardHead: true,
        longCounterbalanceTail: true,
        heavyHips: true,
        smallArms: true,
        readableFeet: true
      },
      featureSets: ["snout", "jaw", "brow", "eyes", "ridge-plates", "toe-claws"]
    }
  };

  return {
    id: state.id,
    kind: "dino-form-domain",
    install({ eventBus }) {
      eventBus.emit("dino.form.ready", state.descriptor);
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
