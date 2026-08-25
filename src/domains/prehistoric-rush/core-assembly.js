export function createPrehistoricRushCoreKits(modules) {
  const { Nexus, Actor, Spatial, Interaction, Simulation, World, Presentation, Graphics, Animation, Render } = modules;
  const root = Nexus.defineDomainServiceKit({
    id: "prehistoric-rush-root-domain-kit",
    domain: "prehistoric-rush",
    domainPath: "n:prehistoric-rush",
    apiName: "prehistoricRush",
    version: "2.0.0",
    stability: "game",
    services: ["identity"],
    createApi: () => Object.freeze({ id: "prehistoric-rush", version: "2.0.0" })
  });
  return [
    ...(Nexus.createCompositionDomain?.() ?? []),
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
    World.createWorldDomain(),
    World.createSceneKit({ allowDirectTransitions: true, initialSceneId: "game", scenes: [{ id: "game", kind: "web-three-scene" }] }),
    ...(Presentation.createPresentationDomain?.() ?? []),
    Graphics.createGraphicsKit(),
    Animation.createAnimationKit(),
    ...(Render.createRenderDomain?.() ?? []),
    root
  ];
}
