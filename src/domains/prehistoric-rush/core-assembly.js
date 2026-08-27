export function createPrehistoricRushCoreKits(modules) {
  const { Nexus, Runtime, Actor, Spatial, Interaction, Simulation, Asset, Object: ObjectDomain, World, Presentation, Graphics, Animation, Render } = modules;
  const root = Nexus.defineDomainServiceKit({
    id: "prehistoric-rush-root-domain-kit",
    domain: "prehistoric-rush",
    domainPath: "n:prehistoric-rush",
    apiName: "prehistoricRush",
    version: "2.0.0",
    stability: "game",
    services: ["identity", "product-composition", "live-snapshot", "frame-hooks"],
    metadata: {
      purpose: "Compose Prehistoric Rush runtime references without shadowing authoritative Nexus domain state.",
      owns: ["Prehistoric Rush product wiring", "game-owned frame hook registration"],
      doesNotOwn: ["startup readiness", "asset readiness", "World state", "gameplay state", "presentation state", "compute queues"]
    },
    createApi: () => {
      const bindings = new Map();
      const optionalPresentations = new Map();
      const frameHooks = new Set();
      let snapshotReader = null;

      function bindReferenceGroup(groupId, references = {}) {
        if (!references || typeof references !== "object" || Array.isArray(references)) {
          throw new TypeError(`Prehistoric Rush ${groupId} binding must be an object of runtime references.`);
        }
        const entries = Object.entries(references).filter(([, value]) => value !== undefined);
        if (entries.length === 0) throw new TypeError(`Prehistoric Rush ${groupId} binding requires at least one reference.`);
        const existing = bindings.get(groupId);
        if (existing) {
          const identical = entries.length === Object.keys(existing).length
            && entries.every(([key, value]) => existing[key] === value);
          if (identical) return existing;
          throw new Error(`Prehistoric Rush ${groupId} runtime references are already bound.`);
        }
        const bound = Object.freeze(Object.fromEntries(entries));
        bindings.set(groupId, bound);
        return bound;
      }

      const api = {
        id: "prehistoric-rush",
        version: "2.0.0",
        bindSimulation(references) { return bindReferenceGroup("simulation", references); },
        bindPresentation(references) { return bindReferenceGroup("presentation", references); },
        bindCompute(references) { return bindReferenceGroup("compute", references); },
        bindSnapshotReader(reader) {
          if (typeof reader !== "function") throw new TypeError("Prehistoric Rush snapshot reader must be a function.");
          if (snapshotReader && snapshotReader !== reader) throw new Error("Prehistoric Rush snapshot reader is already bound.");
          snapshotReader = reader;
          return reader;
        },
        bindOptionalPresentation(id, reference) {
          const key = String(id ?? "").trim();
          if (!key) throw new TypeError("Optional presentation requires a stable id.");
          if (!reference || typeof reference !== "object") throw new TypeError(`Optional presentation ${key} requires a live reference.`);
          const existing = optionalPresentations.get(key);
          if (existing && existing !== reference) throw new Error(`Optional presentation ${key} is already bound.`);
          optionalPresentations.set(key, reference);
          return reference;
        },
        getComponent(id) {
          const key = String(id);
          for (const group of bindings.values()) if (Object.hasOwn(group, key)) return group[key];
          return optionalPresentations.get(key) ?? null;
        },
        registerFrameHook(hook) {
          if (typeof hook !== "function") throw new TypeError("Frame hook must be a function.");
          frameHooks.add(hook);
          return () => frameHooks.delete(hook);
        },
        dispatchFrame(payload) {
          for (const hook of frameHooks) hook(payload);
        },
        getSnapshot() {
          if (snapshotReader) return snapshotReader();
          const simulation = bindings.get("simulation") ?? {};
          const presentation = bindings.get("presentation") ?? {};
          const compute = bindings.get("compute") ?? {};
          return Object.freeze({
            simulation: Object.freeze({
              course: simulation.course?.snapshot?.() ?? null,
              world: simulation.world?.snapshot?.() ?? null,
              player: simulation.player?.snapshot?.() ?? null,
              gameplay: simulation.gameplay?.snapshot?.() ?? null
            }),
            presentation: presentation.rendering?.snapshot?.() ?? null,
            compute: Object.freeze({
              selected: compute.selection ?? null,
              providers: compute.computeHost?.listProviders?.() ?? []
            }),
            optionalPresentations: Object.freeze(Object.fromEntries(
              [...optionalPresentations].map(([id, reference]) => [id, reference.snapshot?.() ?? null])
            ))
          });
        }
      };
      return Object.freeze(api);
    }
  });
  return [
    ...(Nexus.createCompositionDomain?.() ?? []),
    Runtime.createRuntimeLifecycleKit(),
    Runtime.createStartupKit(),
    Actor.createActorRegistryKit(),
    Actor.createCreatureKit(),
    Actor.createCharacterKit(),
    Actor.createPlayerKit(),
    Spatial.createSpatialKit(),
    Interaction.createInteractionKit(),
    Interaction.createInputKit({ actions: { jump: {}, boost: {}, ability: {}, start: {}, retry: {} }, bindings: { steer: { kind: "axis" } } }),
    Simulation.createSimulationKit({ resolution: true }),
    Simulation.createMotionKit(),
    Simulation.createPhysicsKit(),
    Asset.createAssetRegistryKit({
      id: "asset-registry-kit",
      domainPath: "n:asset",
      apiName: "asset",
      metadata: { product: "prehistoric-rush", singleOwner: true }
    }),
    ...ObjectDomain.createObjectDomain({ shape: false, fidelity: false }),
    World.createWorldDomain(),
    World.createSceneKit({ allowDirectTransitions: true, initialSceneId: "game", scenes: [{ id: "game", kind: "web-three-scene" }] }),
    ...(Presentation.createPresentationDomain?.() ?? []),
    Graphics.createGraphicsKit(),
    Animation.createAnimationKit(),
    ...(Render.createRenderDomain?.() ?? []),
    root
  ];
}
