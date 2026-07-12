import { createDrunkRouteGenerator } from "./kits/drunk-route-generator.js";
import { createPrehistoricRushResolutionPolicy } from "./prehistoric-rush-resolution-policy.js";
import { PLAYER_RAPTOR_ID, PLAYER_RAPTOR_PRESET } from "../../presets/player-raptor.js";

const DEFAULT_SURFACE_MULTIPLIERS = Object.freeze({ path: 1, edge: 0.88, verge: 0.68, forest: 0.42 });

function requireFactories(source, names, label) {
  const missing = names.filter((name) => typeof source?.[name] !== "function");
  if (missing.length) throw new TypeError(`${label} is missing required factories: ${missing.join(", ")}`);
}

function cloneRunState(state) {
  return {
    ...state,
    collectedShardIds: [...(state?.collectedShardIds ?? [])],
    lastCollision: state?.lastCollision ? { ...state.lastCollision } : null
  };
}

export function createPrehistoricRushKitGraph(NexusEngine, NexusEngineKits, config = {}) {
  requireFactories(NexusEngine, [
    "createCoreInputKit",
    "createCoreSpatialKit",
    "createCoreSceneKit",
    "createCorePhysicsKit",
    "createCoreSimulationKit",
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
    "createInstancedRenderBatchKit",
    "createSeededWorldPatchControllerKit",
    "createCameraSmoothFollowKit"
  ], "Pinned NexusEngine-Kits module");

  const {
    createCoreInputKit,
    createCoreSpatialKit,
    createCoreSceneKit,
    createCorePhysicsKit,
    createCoreSimulationKit,
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
    createInstancedRenderBatchKit,
    createSeededWorldPatchControllerKit,
    createCameraSmoothFollowKit
  } = NexusEngineKits;
  const playerCreature = config.playerCreature ?? PLAYER_RAPTOR_PRESET;
  const playerCreatureId = String(playerCreature.id ?? PLAYER_RAPTOR_ID);

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
    createCoreSimulationKit({ resolution: true }),
    createCoreMotionKit(),
    createCoreCameraKit(),
    createCoreAnimationKit(),
    createCoreGraphicsKit(),
    createCoreSkyboxKit({ presetId: "clear-day" }),
    createCoreUIKit(),
    createCoreDiagnosticsKit(),
    createCoreCompositionKit(),
    createSeedKit({ seed: config.seed ?? 238991 }),
    createProceduralCreatureBodyKit({ creatures: [playerCreature] }),
    createInstancedRenderBatchKit(),
    createSeededWorldPatchControllerKit(),
    createCameraSmoothFollowKit(),
    createPrehistoricRushDomainKit(NexusEngine, { ...config, playerCreature, playerCreatureId })
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
  let pickupSampler = () => [];
  let collisionSampler = () => null;
  let lastTransitionStepId = null;
  let playerCollisionCenterY = Number(config.playerCollisionCenterY ?? 0);
  const playerCreature = config.playerCreature ?? PLAYER_RAPTOR_PRESET;
  const playerCreatureId = String(config.playerCreatureId ?? playerCreature.id ?? PLAYER_RAPTOR_ID);

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

  function runSystem(world, tickContext) {
    const state = world.getResource(resources.RunState);
    const input = world.getResource(resources.InputState);
    if (!state || !input || state.status !== "game") return;
    const tick = tickContext ?? world.__nexusTickContext;
    if (!tick?.tickId) throw new Error("PrehistoricRush simulation requires TickContext.");

    const next = cloneRunState(state);
    const dt = Math.max(0, Math.min(0.05, tick.delta ?? 1 / 60));
    next.elapsed += dt;
    next.yaw += Number(input.steer ?? 0) * turnRate * dt;
    const nearest = route.nearest(next.x, next.z, next.routeIndex, 120);
    next.routeIndex = nearest.index;
    next.routeProgress = nearest.progress;
    next.region = route.classify(nearest.distance, nearest.width);
    const targetMultiplier = multipliers[next.region] ?? multipliers.forest;
    next.surfaceMultiplier += (targetMultiplier - next.surfaceMultiplier) * (1 - Math.exp(-4.8 * dt));
    const desiredSpeed = (input.boost ? boostSpeed : maxSpeed) * next.surfaceMultiplier;
    next.speed += (desiredSpeed - next.speed) * Math.min(1, dt * 2.6);
    if (input.jump && next.grounded) {
      next.verticalVelocity = jumpImpulse;
      next.grounded = false;
    }
    next.verticalVelocity -= gravity * dt;
    next.jumpHeight = Math.max(0, next.jumpHeight + next.verticalVelocity * dt);
    if (next.jumpHeight === 0) {
      next.verticalVelocity = 0;
      next.grounded = true;
    }
    const dx = Math.sin(next.yaw) * next.speed * dt;
    const dz = Math.cos(next.yaw) * next.speed * dt;
    next.x += dx;
    next.z += dz;
    next.distance += Math.hypot(dx, dz);
    next.y = heightSampler(next.x, next.z);
    input.jump = false;

    const pickupIds = Array.from(new Set((pickupSampler(next) ?? []).map(String)));
    engineRef.corePhysics.submitMotionRequests([{
      id: `${tick.tickId}:dino-motion`,
      bodyId: "dino",
      kind: "kinematic-target",
      position: {
        x: next.x,
        y: next.y + next.jumpHeight + playerCollisionCenterY,
        z: next.z
      },
      linearVelocity: { x: dx / Math.max(dt, 0.000001), y: next.verticalVelocity, z: dz / Math.max(dt, 0.000001) }
    }]);
    engineRef.coreSimulation.submitProposal({
      id: `${tick.tickId}:run-state`,
      source: "prehistoric-rush",
      type: "prehistoric-rush.run-state",
      order: 10,
      value: {
        previousState: cloneRunState(state),
        nextState: next,
        displacement: { x: dx, z: dz }
      }
    });
    engineRef.coreSimulation.submitProposal({
      id: `${tick.tickId}:pickups`,
      source: "prehistoric-rush",
      type: "prehistoric-rush.pickups",
      order: 20,
      value: { pickupIds }
    });
    engineRef.coreSimulation.submitProposal({
      id: `${tick.tickId}:goal`,
      source: "prehistoric-rush",
      type: "prehistoric-rush.goal",
      order: 30,
      value: { goalId: "finish-distance", reached: next.distance >= goalDistance }
    });
  }

  function cleanupSystem() {
    const frame = engineRef?.coreSimulation?.getCommittedFrame?.();
    if (!frame?.transition || frame.stepId === lastTransitionStepId) return;
    lastTransitionStepId = frame.stepId;
    transition(frame.transition.toSceneId, frame.transition.transitionId, frame.transition.payload ?? {});
  }

  return defineDomainServiceKit({
    id: "prehistoric-rush-domain-kit",
    domain: "prehistoric-rush",
    apiName: "prehistoricRush",
    version: "0.6.0",
    stability: "game",
    services: ["run", "route", "surface", "score", "outcome-policy", "player-creature"],
    requires: ["n:core-physics", "n:core-simulation", "n:procedural-creatures:body", "world:seeded-patch-controller"],
    resources,
    events,
    systems: [
      { phase: "simulate", name: "PrehistoricRushRunProposalSystem", system: runSystem },
      { phase: "cleanup", name: "PrehistoricRushCommittedTransitionSystem", system: cleanupSystem }
    ],
    initWorld({ world }) {
      world.setResource(resources.RunState, initialRunState());
      world.setResource(resources.InputState, { steer: 0, boost: false, jump: false });
    },
    createApi({ engine, world }) {
      engineRef = engine;
      const creatureBody = engine.n.proceduralCreatureBody;
      if (!creatureBody?.has?.(playerCreatureId)) creatureBody?.create?.(playerCreature);
      playerCollisionCenterY = Number(creatureBody.get(playerCreatureId)?.collision?.centerY ?? playerCollisionCenterY);
      const getState = () => world.getResource(resources.RunState);
      const getInput = () => world.getResource(resources.InputState);

      engine.coreSimulation.setResolutionPolicy(createPrehistoricRushResolutionPolicy({
        runStateResource: resources.RunState,
        events
      }));
      engine.coreSimulation.registerObservationSource({
        id: "core-physics",
        order: 100,
        observe({ tick }) {
          if (!engine.corePhysics.getProvider()) return [];
          return {
            id: `${tick.tickId}:physics`,
            source: "core-physics",
            type: "physics.frame",
            order: 100,
            value: engine.corePhysics.step(tick)
          };
        }
      });
      engine.coreSimulation.registerObservationSource({
        id: "prehistoric-rush-fallback-collision",
        order: 110,
        observe({ proposals, tick }) {
          const nextState = proposals.find((entry) => entry.type === "prehistoric-rush.run-state")?.value?.nextState;
          if (!nextState) return [];
          const collision = collisionSampler(nextState);
          if (!collision) return [];
          return {
            id: `${tick.tickId}:fallback-collision`,
            source: "prehistoric-rush-fallback-collision",
            type: "prehistoric-rush.fallback-collision",
            order: 110,
            value: { hit: true, ...collision }
          };
        }
      });

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
        getPlayerBody: () => creatureBody.get(playerCreatureId),
        createPlayerPose: (state = {}) => creatureBody.createPose(playerCreatureId, state),
        setHeightSampler(nextSampler) {
          if (typeof nextSampler !== "function") throw new TypeError("setHeightSampler expects a function.");
          heightSampler = nextSampler;
        },
        setPickupSampler(nextSampler) {
          if (typeof nextSampler !== "function") throw new TypeError("setPickupSampler expects a function.");
          pickupSampler = nextSampler;
        },
        setCollisionSampler(nextSampler) {
          if (typeof nextSampler !== "function") throw new TypeError("setCollisionSampler expects a function.");
          collisionSampler = nextSampler;
        },
        setInput(patch = {}) {
          Object.assign(getInput(), patch);
        },
        start() {
          const previous = getState();
          const next = initialRunState();
          next.runId = Number(previous?.runId ?? 0) + 1;
          next.status = "game";
          lastTransitionStepId = null;
          engine.coreSimulation.resetResolution();
          world.setResource(resources.RunState, next);
          world.setResource(resources.InputState, { steer: 0, boost: false, jump: false });
          world.emit(events.RunStarted, { runId: next.runId });
          transition("game", `run:${next.runId}:start`);
          return cloneRunState(next);
        },
        getState: () => cloneRunState(getState()),
        getInput: () => ({ ...getInput() }),
        getCommittedFrame: () => engine.coreSimulation.getCommittedFrame(),
        snapshot: () => ({
          run: cloneRunState(getState()),
          route: route.snapshot(),
          simulation: engine.coreSimulation.getCommittedFrame(),
          playerCreature: creatureBody.getSnapshot(),
          patchStreaming: engine.n.seededWorldPatchController?.getSnapshot?.()
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
        "core-simulation",
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
        "instanced-render-batch-kit",
        "seeded-world-patch-controller-kit",
        "camera-smooth-follow-kit"
      ],
      nestedKits: ["drunk-route-generator", "prehistoric-rush-resolution-policy"],
      rendererAgnosticOutcome: true
    }
  });
}
