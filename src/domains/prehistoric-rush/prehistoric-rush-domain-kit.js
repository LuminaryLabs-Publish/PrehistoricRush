import { createDrunkRouteGenerator } from "./kits/drunk-route-generator.js";
import { PLAYER_RAPTOR_ID, PLAYER_RAPTOR_PRESET } from "../../presets/player-raptor.js";

const DEFAULT_SURFACE_MULTIPLIERS = Object.freeze({ path: 1, edge: 0.88, verge: 0.68, forest: 0.42 });

function requireFactories(source, names, label) {
  const missing = names.filter((name) => typeof source?.[name] !== "function");
  if (missing.length) throw new TypeError(`${label} is missing required factories: ${missing.join(", ")}`);
}

export function createPrehistoricRushKitGraph(NexusEngine, NexusEngineKits, config = {}) {
  requireFactories(NexusEngine, [
    "createCoreInputKit",
    "createCoreSpatialKit",
    "createCoreSceneKit",
    "createCorePhysicsKit",
    "createCoreMotionKit",
    "createCoreCameraKit",
    "createCoreAnimationKit",
    "createCoreGraphicsKit",
    "createCoreSkyboxKit",
    "createCoreUIKit",
    "createCoreDiagnosticsKit",
    "createCoreCompositionKit",
    "defineDomainServiceKit",
    "defineResource",
    "defineEvent"
  ], "Pinned NexusEngine module");
  requireFactories(NexusEngineKits, [
    "createSeedKit",
    "createProceduralCreatureBodyKit",
    "createInstancedRenderBatchKit"
  ], "Pinned NexusEngine-Kits module");

  const {
    createCoreInputKit,
    createCoreSpatialKit,
    createCoreSceneKit,
    createCorePhysicsKit,
    createCoreMotionKit,
    createCoreCameraKit,
    createCoreAnimationKit,
    createCoreGraphicsKit,
    createCoreSkyboxKit,
    createCoreUIKit,
    createCoreDiagnosticsKit,
    createCoreCompositionKit
  } = NexusEngine;
  const {
    createSeedKit,
    createProceduralCreatureBodyKit,
    createInstancedRenderBatchKit
  } = NexusEngineKits;

  return [
    createCoreInputKit({ actions: { jump: {}, boost: {}, start: {}, retry: {} }, bindings: { steer: { kind: "axis" } } }),
    createCoreSpatialKit(),
    createCoreSceneKit({
      allowDirectTransitions: true,
      initialSceneId: "menu",
      scenes: [
        { id: "menu", kind: "web-three-scene", exits: { start: { id: "start", to: "game", enabled: true } } },
        { id: "game", kind: "web-three-scene", exits: { fail: { id: "fail", to: "run-over", enabled: true }, win: { id: "win", to: "win", enabled: true } } },
        { id: "run-over", kind: "web-three-scene", exits: { retry: { id: "retry", to: "game", enabled: true } } },
        { id: "win", kind: "web-three-scene", exits: { retry: { id: "retry", to: "game", enabled: true } } }
      ]
    }),
    createCorePhysicsKit(),
    createCoreMotionKit(),
    createCoreCameraKit(),
    createCoreAnimationKit(),
    createCoreGraphicsKit(),
    createCoreSkyboxKit({ presetId: "clear-day" }),
    createCoreUIKit(),
    createCoreDiagnosticsKit(),
    createCoreCompositionKit(),
    createSeedKit({ seed: config.seed ?? 238991 }),
    createProceduralCreatureBodyKit({ creatures: [PLAYER_RAPTOR_PRESET] }),
    createInstancedRenderBatchKit(),
    createPrehistoricRushDomainKit(NexusEngine, config)
  ];
}

export function createPrehistoricRushDomainKit(NexusEngine, config = {}) {
  const { defineDomainServiceKit, defineResource, defineEvent } = NexusEngine;
  const route = createDrunkRouteGenerator({
    seed: config.seed ?? 238991,
    segmentLength: config.segmentLength ?? 18,
    sampleSpacing: config.sampleSpacing ?? 2.5,
    pathHalfWidth: config.pathHalfWidth ?? 3.1,
    vergeWidth: config.vergeWidth ?? 3.2
  });
  const multipliers = { ...DEFAULT_SURFACE_MULTIPLIERS, ...(config.surfaceMultipliers ?? {}) };
  const goalDistance = Number(config.goalDistance ?? 3600);
  const baseSpeed = Number(config.baseSpeed ?? 16);
  const maxSpeed = Number(config.maxSpeed ?? 26);
  const boostSpeed = Number(config.boostSpeed ?? 31);
  const turnRate = Number(config.turnRate ?? 2.25);
  const gravity = Number(config.gravity ?? 34);
  const jumpImpulse = Number(config.jumpImpulse ?? 13.5);
  let engineRef = null;
  let heightSampler = () => 0;

  const resources = {
    RunState: defineResource("prehistoric-rush.run-state"),
    InputState: defineResource("prehistoric-rush.input-state")
  };
  const events = {
    RunStarted: defineEvent("prehistoric-rush.run-started"),
    RunFailed: defineEvent("prehistoric-rush.run-failed"),
    RunWon: defineEvent("prehistoric-rush.run-won"),
    ShardCollected: defineEvent("prehistoric-rush.shard-collected")
  };

  function initialRunState() {
    return {
      runId: 0,
      status: "menu",
      x: 0,
      y: 0,
      z: 0,
      yaw: 0,
      speed: baseSpeed,
      verticalVelocity: 0,
      jumpHeight: 0,
      grounded: true,
      elapsed: 0,
      distance: 0,
      routeIndex: 0,
      routeProgress: 0,
      region: "path",
      surfaceMultiplier: 1,
      shards: 0,
      collectedShardIds: [],
      lastCollision: null
    };
  }

  function transition(toSceneId, transitionId, payload = {}) {
    engineRef?.coreScene?.requestTransition?.({ transitionId, toSceneId, direct: true, payload });
  }

  function system(world) {
    const state = world.getResource(resources.RunState);
    const input = world.getResource(resources.InputState);
    if (!state || !input || state.status !== "game") return;
    const dt = Math.max(0, Math.min(0.05, world.__nexusClock?.delta ?? 1 / 60));
    state.elapsed += dt;
    state.yaw += Number(input.steer ?? 0) * turnRate * dt;
    const nearest = route.nearest(state.x, state.z, state.routeIndex, 120);
    state.routeIndex = nearest.index;
    state.routeProgress = nearest.progress;
    state.region = route.classify(nearest.distance, nearest.width);
    const targetMultiplier = multipliers[state.region] ?? multipliers.forest;
    state.surfaceMultiplier += (targetMultiplier - state.surfaceMultiplier) * (1 - Math.exp(-4.8 * dt));
    const desiredSpeed = (input.boost ? boostSpeed : maxSpeed) * state.surfaceMultiplier;
    state.speed += (desiredSpeed - state.speed) * Math.min(1, dt * 2.6);
    if (input.jump && state.grounded) {
      state.verticalVelocity = jumpImpulse;
      state.grounded = false;
    }
    state.verticalVelocity -= gravity * dt;
    state.jumpHeight = Math.max(0, state.jumpHeight + state.verticalVelocity * dt);
    if (state.jumpHeight === 0) {
      state.verticalVelocity = 0;
      state.grounded = true;
    }
    const dx = Math.sin(state.yaw) * state.speed * dt;
    const dz = Math.cos(state.yaw) * state.speed * dt;
    state.x += dx;
    state.z += dz;
    state.distance += Math.hypot(dx, dz);
    state.y = heightSampler(state.x, state.z);
    input.jump = false;
    if (state.distance >= goalDistance) {
      state.status = "win";
      world.emit(events.RunWon, { runId: state.runId, distance: state.distance });
      transition("win", `run:${state.runId}:win`, { distance: state.distance, shards: state.shards });
    }
  }

  return defineDomainServiceKit({
    id: "prehistoric-rush-domain-kit",
    domain: "prehistoric-rush",
    apiName: "prehistoricRush",
    version: "0.4.0",
    stability: "game",
    services: ["run", "route", "surface", "score", "outcome", "player-creature"],
    requires: ["n:procedural-creatures:body"],
    resources,
    events,
    systems: [{ phase: "simulate", name: "PrehistoricRushRunSystem", system }],
    initWorld({ world }) {
      world.setResource(resources.RunState, initialRunState());
      world.setResource(resources.InputState, { steer: 0, boost: false, jump: false });
    },
    createApi({ engine, world }) {
      engineRef = engine;
      const creatureBody = engine.n.proceduralCreatureBody;
      if (!creatureBody?.has?.(PLAYER_RAPTOR_ID)) creatureBody?.create?.(PLAYER_RAPTOR_PRESET);
      const getState = () => world.getResource(resources.RunState);
      const getInput = () => world.getResource(resources.InputState);
      return {
        route,
        config: {
          goalDistance,
          baseSpeed,
          maxSpeed,
          boostSpeed,
          turnRate,
          gravity,
          jumpImpulse,
          surfaceMultipliers: { ...multipliers }
        },
        getPlayerBody: () => creatureBody.get(PLAYER_RAPTOR_ID),
        createPlayerPose: (state = {}) => creatureBody.createPose(PLAYER_RAPTOR_ID, state),
        setHeightSampler(nextSampler) {
          if (typeof nextSampler !== "function") throw new TypeError("setHeightSampler expects a function.");
          heightSampler = nextSampler;
        },
        setInput(patch = {}) {
          Object.assign(getInput(), patch);
        },
        start() {
          const previous = getState();
          const next = initialRunState();
          next.runId = Number(previous?.runId ?? 0) + 1;
          next.status = "game";
          world.setResource(resources.RunState, next);
          world.setResource(resources.InputState, { steer: 0, boost: false, jump: false });
          world.emit(events.RunStarted, { runId: next.runId });
          transition("game", `run:${next.runId}:start`);
          return { ...next, collectedShardIds: [] };
        },
        fail(collision = {}) {
          const state = getState();
          if (!state || state.status !== "game") return state;
          state.status = "run-over";
          state.lastCollision = { ...collision };
          world.emit(events.RunFailed, { runId: state.runId, collision: state.lastCollision });
          transition("run-over", `run:${state.runId}:fail`, { collision: state.lastCollision });
          return state;
        },
        collectShard(shardId) {
          const state = getState();
          if (!state || state.collectedShardIds.includes(shardId)) return false;
          state.collectedShardIds.push(shardId);
          state.shards += 1;
          world.emit(events.ShardCollected, { runId: state.runId, shardId, shards: state.shards });
          return true;
        },
        getState: () => ({ ...getState(), collectedShardIds: [...getState().collectedShardIds] }),
        getInput: () => ({ ...getInput() }),
        snapshot: () => ({
          run: { ...getState(), collectedShardIds: [...getState().collectedShardIds] },
          route: route.snapshot(),
          playerCreature: creatureBody.getSnapshot()
        })
      };
    },
    metadata: {
      gameMode: true,
      composes: [
        "core-input",
        "core-spatial",
        "core-scene",
        "core-physics",
        "core-motion",
        "core-camera",
        "core-animation",
        "core-graphics",
        "core-skybox",
        "core-ui",
        "core-diagnostics",
        "core-composition",
        "seed-kit",
        "procedural-creature-body-kit",
        "instanced-render-batch-kit"
      ],
      nestedKits: ["drunk-route-generator"]
    }
  });
}
