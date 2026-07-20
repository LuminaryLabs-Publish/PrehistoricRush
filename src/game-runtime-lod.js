import { createPrehistoricRushKitGraph } from "./domains/prehistoric-rush/prehistoric-rush-domain-kit.js";
import { createPrehistoricPatchGenerator } from "./world/prehistoric-patch-generator.js";
import { PREHISTORIC_TERRAIN_LOD_POLICY_INPUT } from "./world/prehistoric-terrain-lod-policy.js";
import {
  createPrehistoricVegetationGeneratorOptions,
  createPrehistoricVegetationRuntime
} from "./shared/prehistoric-vegetation-domain.js";
import { FOLIAGE_ATLAS_REVISION } from "./shared/prehistoric-foliage-card-recipes.js";
import { loadPlayerCharacterProfile } from "./shared/player-character-store.js";
import { PREHISTORIC_TREE_TYPES } from "./shared/tree-fidelity-assets.js";
import {
  KITS_COMMIT,
  NEXUS_COMMIT,
  PROTOKITS_COMMIT,
  RUNTIME_URLS
} from "./shared/runtime-versions.js";
import { createThreePatchStreamLodAdapter } from "./render/three-patch-stream-lod-adapter.js";

const CDN = RUNTIME_URLS;
const cfg = {
  seed: 238991,
  chunk: PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.patchSize,
  segments: PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.sourceResolution,
  trees: 7,
  grass: 96,
  groundCover: 36,
  goal: 3600
};
const STREAM = {
  activeRadius: 2,
  retainRadius: 4,
  prefetchDistance: 5,
  cacheLimit: 128,
  startupGenerationBudget: 4,
  startupActivationBudget: 4,
  generationBudget: 2,
  activationBudget: 2,
  visualPrefetchActivationBudget: 3,
  visualPrefetchCapacity: 12,
  startupSimulationRadius: 1,
  startupVisualRows: 4,
  startupTimeoutMs: 45000
};
const TREE_BATCH_CAPACITY = 256;
const VEGETATION_DENSITY_POLICY = "production-patches-v1";
const STREAM_PRIORITY_POLICY_ID = "prehistoric-runner-forward-v1";
const treeTypes = PREHISTORIC_TREE_TYPES;

const load = async (url) => {
  try {
    return await import(url);
  } catch (error) {
    console.warn("module import failed", url, error);
    return null;
  }
};

function percentile(values, amount) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.max(0, Math.min(sorted.length - 1, Math.ceil(sorted.length * amount) - 1));
  return sorted[index];
}

function createPatchTimingDiagnostics() {
  const generation = [];
  const adoption = [];
  const maximumSamples = 64;

  function record(target, value) {
    const duration = Math.max(0, Number(value) || 0);
    target.push(duration);
    if (target.length > maximumSamples) target.splice(0, target.length - maximumSamples);
  }

  return Object.freeze({
    recordGeneration(value) {
      record(generation, value);
    },
    recordAdoption(value) {
      record(adoption, value);
    },
    getSnapshot(maximumSpeed = 0) {
      const generationP95Ms = percentile(generation, 0.95);
      const adoptionP95Ms = percentile(adoption, 0.95);
      const patchReadyP95Seconds = (generationP95Ms + adoptionP95Ms) / 1000;
      const requiredLeadDistance = Math.max(0, Number(maximumSpeed) || 0) * patchReadyP95Seconds * 1.5;
      const recommendedPrefetchDistance = Math.max(
        3,
        Math.min(6, Math.ceil(requiredLeadDistance / cfg.chunk) || STREAM.prefetchDistance)
      );
      return Object.freeze({
        sampleCount: Math.min(generation.length, adoption.length || generation.length),
        generationP95Ms,
        adoptionP95Ms,
        patchReadyP95Seconds,
        requiredLeadDistance,
        recommendedPrefetchDistance,
        configuredPrefetchDistance: STREAM.prefetchDistance
      });
    }
  });
}

function shell() {
  const root = document.querySelector("#app") ?? document.body;
  root.innerHTML = "";
  Object.assign(document.body.style, {
    margin: 0,
    overflow: "hidden",
    background: "#09130d",
    color: "#fff8dc",
    fontFamily: "system-ui,sans-serif"
  });
  const host = document.createElement("section");
  const panel = document.createElement("aside");
  const status = document.createElement("div");
  const button = document.createElement("button");
  const loading = document.createElement("section");
  const loadingCard = document.createElement("div");
  const loadingTitle = document.createElement("strong");
  const loadingTrack = document.createElement("div");
  const loadingFill = document.createElement("div");
  const loadingLabel = document.createElement("p");

  Object.assign(host.style, { position: "fixed", inset: 0 });
  Object.assign(panel.style, {
    position: "fixed",
    top: "14px",
    left: "16px",
    minWidth: "292px",
    padding: "12px 14px",
    borderRadius: "16px",
    background: "rgba(7,14,9,.72)",
    zIndex: 4
  });
  Object.assign(button.style, {
    marginTop: "10px",
    padding: "9px 14px",
    borderRadius: "999px",
    background: "#ffd37a",
    fontWeight: 800
  });
  Object.assign(loading.style, {
    position: "fixed",
    inset: 0,
    zIndex: 8,
    display: "grid",
    placeItems: "center",
    background: "rgba(5,15,9,.9)",
    pointerEvents: "auto"
  });
  Object.assign(loadingCard.style, {
    width: "min(440px,calc(100vw - 40px))",
    textAlign: "center"
  });
  Object.assign(loadingTitle.style, {
    display: "block",
    fontSize: "24px",
    marginBottom: "12px"
  });
  Object.assign(loadingTrack.style, {
    height: "8px",
    borderRadius: "999px",
    background: "#ffffff1f",
    overflow: "hidden"
  });
  Object.assign(loadingFill.style, {
    height: "100%",
    width: "0%",
    background: "#69a94d",
    transition: "width 120ms linear"
  });
  Object.assign(loadingLabel.style, {
    color: "#c1cfbc",
    margin: "14px 0 0"
  });

  loadingTitle.textContent = "Preparing route corridor";
  loadingLabel.textContent = "Generating terrain 0 / 21";
  loadingTrack.append(loadingFill);
  loadingCard.append(loadingTitle, loadingTrack, loadingLabel);
  loading.append(loadingCard);
  panel.append(status, button);
  root.append(host, panel, loading);

  return {
    host,
    status,
    button,
    showLoading() {
      loading.style.display = "grid";
    },
    updateLoading(progress, detail) {
      loadingFill.style.width = `${Math.max(0, Math.min(1, Number(progress) || 0)) * 100}%`;
      loadingLabel.textContent = String(detail ?? "Preparing route corridor");
    },
    hideLoading() {
      loading.style.display = "none";
    }
  };
}

function createWorkerExecutor(PatchModule, serializableGeneratorOptions, timings) {
  if (typeof Worker !== "function" || typeof PatchModule.createMessageWorkerExecutor !== "function") {
    return { executor: null, worker: null };
  }
  try {
    const worker = new Worker(new URL("./workers/prehistoric-patch-worker.js", import.meta.url), { type: "module" });
    worker.postMessage({ type: "init-patch-worker", payload: serializableGeneratorOptions });
    const baseExecutor = PatchModule.createMessageWorkerExecutor(worker);
    return {
      worker,
      executor: Object.freeze({
        async run(request) {
          const startedAt = performance.now();
          try {
            return await baseExecutor.run(request);
          } finally {
            timings.recordGeneration(performance.now() - startedAt);
          }
        },
        dispose() {
          baseExecutor.dispose?.();
        }
      })
    };
  } catch (error) {
    console.warn("patch worker unavailable; using deferred synchronous generation", error);
    return { executor: null, worker: null };
  }
}

function runnerPatchPriority(context) {
  if (context.reason === "active" && context.distance <= STREAM.startupSimulationRadius) {
    return context.distance + (context.forwardDot < -0.25 ? 1 : 0);
  }
  if (context.reason === "prefetch") {
    return 3 + Math.max(0, context.step - 1) * 0.75 + context.lateralDistance * 0.5;
  }
  const behindPenalty = context.forwardDot < 0 ? 4 + Math.abs(context.forwardDot) * 2 : 0;
  return 7
    + context.distance * 2
    - Math.max(0, context.forwardDot)
    + context.lateralDistance
    + behindPenalty;
}

function primaryAxes(forward) {
  if (Math.abs(forward.x) >= Math.abs(forward.z)) {
    const direction = Math.sign(forward.x) || 1;
    return { forward: { x: direction, z: 0 }, side: { x: 0, z: 1 } };
  }
  const direction = Math.sign(forward.z) || 1;
  return { forward: { x: 0, z: direction }, side: { x: 1, z: 0 } };
}

function startupPatchTargets(focus) {
  const simulationPatchIds = [];
  for (let offsetZ = -STREAM.startupSimulationRadius; offsetZ <= STREAM.startupSimulationRadius; offsetZ += 1) {
    for (let offsetX = -STREAM.startupSimulationRadius; offsetX <= STREAM.startupSimulationRadius; offsetX += 1) {
      simulationPatchIds.push(`${focus.center.x + offsetX}:${focus.center.z + offsetZ}`);
    }
  }

  const axes = primaryAxes(focus.forward);
  const visualPatchIds = [];
  for (let row = 1; row <= STREAM.startupVisualRows; row += 1) {
    const distance = STREAM.activeRadius + row;
    for (let side = -1; side <= 1; side += 1) {
      const x = focus.center.x + axes.forward.x * distance + axes.side.x * side;
      const z = focus.center.z + axes.forward.z * distance + axes.side.z * side;
      visualPatchIds.push(`${x}:${z}`);
    }
  }

  return Object.freeze({
    simulationPatchIds: Object.freeze(simulationPatchIds),
    visualPatchIds: Object.freeze(visualPatchIds)
  });
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

async function main() {
  const ui = shell();
  const playerProfile = loadPlayerCharacterProfile();
  const treeAssetRuntime = globalThis.PrehistoricRushTreeAssetRuntime ?? null;
  const treeFidelityPackages = treeAssetRuntime?.packageIds
    ?.map((assetId) => treeAssetRuntime.assets.getValue(assetId))
    .filter(Boolean) ?? [];
  if (treeFidelityPackages.length !== treeTypes.length) {
    throw new Error(`Tree fidelity package count ${treeFidelityPackages.length} does not match tree archetype count ${treeTypes.length}.`);
  }
  const treeFidelityGenerationIds = treeFidelityPackages.map((entry) => entry.generation?.id).filter(Boolean);
  if (treeFidelityGenerationIds.length !== treeFidelityPackages.length) {
    throw new Error("Tree fidelity package generation identity is incomplete.");
  }
  const treeFidelityGenerationDigest = treeFidelityGenerationIds.join("|");

  const [NexusEngine, SeedModule, CreatureModule, BatchModule, PatchModule, CameraModule, THREE, Rapier, RapierKit] = await Promise.all([
    load(CDN.nexus),
    load(CDN.seedKit),
    load(CDN.creatureKit),
    load(CDN.batchKit),
    load(CDN.patchKit),
    load(CDN.cameraKit),
    load(CDN.three),
    load(CDN.rapier),
    load(CDN.rapierKit)
  ]);
  if (!NexusEngine || !SeedModule || !CreatureModule || !BatchModule || !PatchModule || !CameraModule || !THREE || !Rapier || !RapierKit) {
    throw new Error("Required pinned runtime module failed to load.");
  }
  if (typeof NexusEngine.selectTerrainLodLevel !== "function" || typeof NexusEngine.createCoreVegetationDomain !== "function") {
    throw new Error("Pinned NexusEngine module does not expose terrain LOD and Object Vegetation.");
  }
  if (Rapier.init) await Rapier.init();
  if (typeof RapierKit.createRapierPhysicsProvider !== "function") {
    throw new Error("Pinned Rapier ProtoKit does not expose createRapierPhysicsProvider().");
  }

  const vegetationRuntime = createPrehistoricVegetationRuntime(NexusEngine);
  const allVegetationSpecies = vegetationRuntime.vegetation.listSpecies();
  const vegetationCatalogDigest = allVegetationSpecies.map((species) => species.contentHash).join("|");
  const NexusEngineKits = { ...SeedModule, ...CreatureModule, ...BatchModule, ...PatchModule, ...CameraModule };
  const engine = NexusEngine.createRealtimeGame({
    kits: createPrehistoricRushKitGraph(NexusEngine, NexusEngineKits, {
      seed: cfg.seed,
      goalDistance: cfg.goal,
      playerCreature: playerProfile.creature,
      terrainLod: {
        patchSize: cfg.chunk,
        sourceResolution: cfg.segments
      }
    })
  });
  const game = engine.n.prehistoricRush;
  const instanceBatches = engine.n.instancedRenderBatch;
  const patchControllers = engine.n.seededWorldPatchController;
  const cameraFollows = engine.n.cameraSmoothFollow;
  const terrainLodPolicy = engine.n.prehistoricRushTerrainLod?.getPolicy?.();
  if (!game || !instanceBatches || !patchControllers || !cameraFollows || !terrainLodPolicy || !engine.corePhysics || !engine.coreSimulation || !engine.n.coreGraphics) {
    throw new Error("PrehistoricRush terrain LOD composition did not install.");
  }

  engine.corePhysics.setProvider(RapierKit.createRapierPhysicsProvider({
    rapier: Rapier,
    gravity: { x: 0, y: -34, z: 0 }
  }));

  const playerBody = game.getPlayerBody();
  engine.corePhysics.syncBodies([{
    id: "dino",
    kind: "kinematic",
    collision: playerBody.collision,
    transform: {
      position: {
        x: 0,
        y: Number(playerBody.collision?.centerY ?? 0),
        z: 0
      }
    },
    tags: ["player", "dino"]
  }]);

  const serializableGeneratorOptions = {
    config: { ...cfg, shardsPerPatch: 2 },
    routeSamples: game.route.samples
  };
  const generatorOptions = {
    ...serializableGeneratorOptions,
    ...createPrehistoricVegetationGeneratorOptions(vegetationRuntime)
  };
  const timings = createPatchTimingDiagnostics();
  const baseGenerator = createPrehistoricPatchGenerator(generatorOptions);
  const timedGenerator = (request) => {
    const startedAt = performance.now();
    try {
      return baseGenerator(request);
    } finally {
      timings.recordGeneration(performance.now() - startedAt);
    }
  };
  const workerState = createWorkerExecutor(PatchModule, serializableGeneratorOptions, timings);
  const controller = patchControllers.create({
    id: "prehistoric-rush-world",
    worldSeed: String(cfg.seed),
    generatorVersion: "prehistoric-patch-v7-production-forest",
    patchSize: cfg.chunk,
    activeRadius: STREAM.activeRadius,
    retainRadius: STREAM.retainRadius,
    prefetchDistance: STREAM.prefetchDistance,
    cacheLimit: STREAM.cacheLimit,
    activationBudget: STREAM.activationBudget,
    generationBudget: STREAM.generationBudget,
    priorityPolicyId: STREAM_PRIORITY_POLICY_ID,
    priorityPolicy: runnerPatchPriority,
    terrainSettingsHash: `segments-${terrainLodPolicy.sourceResolution}-lod-${terrainLodPolicy.revision}`,
    vegetationSettingsHash: `trees-${cfg.trees}-grass-${cfg.grass}-ground-${cfg.groundCover}-catalog-${vegetationCatalogDigest}-foliage-${FOLIAGE_ATLAS_REVISION}-density-${VEGETATION_DENSITY_POLICY}-fidelity-${treeFidelityGenerationDigest}`,
    generator: timedGenerator,
    executor: workerState.executor
  });
  for (const method of ["takeReadyPrefetchPatches", "promotePrefetchPatch", "getForwardReadiness"]) {
    if (typeof controller[method] !== "function") throw new Error(`Pinned patch controller is missing ${method}().`);
  }

  const cameraFollow = cameraFollows.create({
    id: "prehistoric-rush-player-camera",
    positionSmoothTime: 0.22,
    lookSmoothTime: 0.14,
    maximumPositionSpeed: 45,
    maximumLookSpeed: 65,
    rotationSharpness: 12,
    maximumDeltaTime: 1 / 30,
    teleportThreshold: 24
  });
  const adapter = createThreePatchStreamLodAdapter(THREE, {
    game,
    corePhysics: engine.corePhysics,
    ui,
    instanceBatches,
    cameraFollow,
    config: cfg,
    stream: STREAM,
    treeTypes: vegetationRuntime.catalog.treeTypes,
    treeFidelityPackages,
    treeBatchCapacity: TREE_BATCH_CAPACITY,
    foliageCardCapacity: 8192,
    groundCoverCapacity: 2400,
    visualPrefetchCapacity: STREAM.visualPrefetchCapacity,
    terrainLodPolicy,
    selectTerrainLodLevel: NexusEngine.selectTerrainLodLevel
  });
  const input = { left: false, right: false, boost: false };
  let worldPreparing = false;
  let startupStreamingReceipt = null;

  game.setPickupSampler((state) => adapter.view.pickups
    .filter((pickup) => Math.hypot(pickup.x - state.x, pickup.z - state.z) < pickup.radius + 0.4)
    .map((pickup) => pickup.id));
  game.setCollisionSampler((state) => {
    if (state.jumpHeight >= 1.05) return null;
    const collider = adapter.view.colliders.find((candidate) =>
      Math.hypot(candidate.x - state.x, candidate.z - state.z) < candidate.radius + Number(playerBody.collision?.radius ?? 0.32)
    );
    return collider ? { kind: "tree-impact", colliderId: collider.id, source: "fallback-collision" } : null;
  });

  function focusStreaming(state) {
    const forward = { x: Math.sin(state.yaw), z: Math.cos(state.yaw) };
    return controller.setFocus({
      position: { x: state.x + cfg.chunk * 0.5, z: state.z + cfg.chunk * 0.5 },
      velocity: { x: forward.x * state.speed, z: forward.z * state.speed },
      forward
    });
  }

  function adoptEntry(action, entry, state) {
    const startedAt = performance.now();
    try {
      action(entry, state);
    } finally {
      timings.recordAdoption(performance.now() - startedAt);
    }
  }

  function updateStreaming(state, options = {}) {
    focusStreaming(state);
    controller.update();
    adapter.releasePatches(controller.takeReleasedPatchIds());

    const allowedActiveIds = Array.isArray(options.activePatchIds) ? new Set(options.activePatchIds) : null;
    for (const patchId of controller.getDesiredActivePatchIds()) {
      if (allowedActiveIds && !allowedActiveIds.has(patchId)) continue;
      const promoted = controller.promotePrefetchPatch(patchId);
      if (promoted) adoptEntry(adapter.promotePrefetchPatch, promoted, state);
    }

    const generationConcurrency = workerState.worker
      ? Number(options.generationBudget ?? STREAM.generationBudget)
      : 1;
    const availableGenerationSlots = Math.max(0, generationConcurrency - controller.getStats().inflight);
    if (availableGenerationSlots > 0) {
      controller.pump({ maximum: availableGenerationSlots });
    }

    const activeEntries = controller.takeReadyPatches({
      maximum: Number(options.activationBudget ?? STREAM.activationBudget),
      ...(options.activePatchIds ? { patchIds: options.activePatchIds } : {})
    });
    for (const entry of activeEntries) adoptEntry(adapter.activatePatch, entry, state);

    const availableVisualSlots = Math.max(
      0,
      STREAM.visualPrefetchCapacity - Number(adapter.view.presentationPrefetch?.count ?? 0)
    );
    const visualMaximum = Math.min(
      availableVisualSlots,
      Number(options.visualPrefetchActivationBudget ?? STREAM.visualPrefetchActivationBudget)
    );
    if (visualMaximum > 0) {
      const prefetchedEntries = controller.takeReadyPrefetchPatches({
        maximum: visualMaximum,
        ...(options.visualPatchIds ? { patchIds: options.visualPatchIds } : {})
      });
      for (const entry of prefetchedEntries) adoptEntry(adapter.prefetchPatch, entry, state);
    }

    adapter.view.patchStats = controller.getStats();
    return adapter.view.patchStats;
  }

  async function prepareStartupWorld(state) {
    ui.showLoading();
    const focus = focusStreaming(state);
    const targets = startupPatchTargets(focus);
    const startedAt = performance.now();

    for (;;) {
      updateStreaming(state, {
        activePatchIds: targets.simulationPatchIds,
        visualPatchIds: targets.visualPatchIds,
        generationBudget: STREAM.startupGenerationBudget,
        activationBudget: STREAM.startupActivationBudget,
        visualPrefetchActivationBudget: STREAM.visualPrefetchActivationBudget
      });
      adapter.render(state, 0);

      const activePatchIds = new Set(controller.getActivePatchIds());
      const simulationReady = targets.simulationPatchIds.filter((patchId) => activePatchIds.has(patchId)).length;
      const forward = controller.getForwardReadiness({ patchIds: targets.visualPatchIds });
      const visualReady = forward.ready;
      const generated = targets.simulationPatchIds.filter((patchId) => controller.hasPatch(patchId)).length + forward.generated;
      const collisionReady = targets.simulationPatchIds.every((patchId) => adapter.ownership.activePatches.has(patchId));
      const rendererReady = [...targets.simulationPatchIds, ...targets.visualPatchIds]
        .every((patchId) => adapter.isVisualPatchActive(patchId));
      const required = targets.simulationPatchIds.length + targets.visualPatchIds.length;
      const ready = simulationReady + visualReady;
      const progress = ready / required;
      const forwardBufferedMeters = Math.floor(visualReady / 3) * cfg.chunk;

      let detail = `Generating terrain ${generated} / ${required}`;
      if (generated >= required && simulationReady < targets.simulationPatchIds.length) {
        detail = `Preparing collision ${simulationReady} / ${targets.simulationPatchIds.length}`;
      } else if (simulationReady >= targets.simulationPatchIds.length && visualReady < targets.visualPatchIds.length) {
        detail = `Building distant forest ${visualReady} / ${targets.visualPatchIds.length}`;
      } else if (collisionReady && rendererReady) {
        detail = "Ready";
      }
      ui.updateLoading(progress, detail);

      if (
        simulationReady === targets.simulationPatchIds.length
        && visualReady === targets.visualPatchIds.length
        && collisionReady
        && rendererReady
      ) {
        const receipt = Object.freeze({
          simulationReady,
          simulationRequired: targets.simulationPatchIds.length,
          visualReady,
          visualRequired: targets.visualPatchIds.length,
          forwardBufferedMeters,
          collisionReady,
          rendererReady,
          simulationPatchIds: targets.simulationPatchIds,
          visualPatchIds: targets.visualPatchIds,
          timing: timings.getSnapshot(state.speed)
        });
        ui.hideLoading();
        return receipt;
      }

      if (performance.now() - startedAt > STREAM.startupTimeoutMs) {
        throw new Error(
          `Route corridor preparation timed out: simulation ${simulationReady}/${targets.simulationPatchIds.length}, visual ${visualReady}/${targets.visualPatchIds.length}.`
        );
      }
      await nextFrame();
    }
  }

  async function beginRun(reason) {
    if (worldPreparing) return;
    worldPreparing = true;
    input.left = false;
    input.right = false;
    input.boost = false;
    game.start();
    try {
      const state = game.getState();
      startupStreamingReceipt = await prepareStartupWorld(state);
      adapter.refreshDynamicContent(state);
      adapter.resetCamera(state, reason);
    } finally {
      worldPreparing = false;
    }
  }

  await beginRun("initial-run");

  const start = () => {
    if (!worldPreparing) void beginRun("run-restart");
  };
  ui.button.onclick = () => game.getState().status === "game" ? game.setInput({ jump: true }) : start();
  addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) event.preventDefault();
    if (event.code === "Enter") start();
    if (["KeyA", "ArrowLeft"].includes(event.code)) input.left = true;
    if (["KeyD", "ArrowRight"].includes(event.code)) input.right = true;
    if (["KeyW", "ArrowUp"].includes(event.code)) input.boost = true;
    if (event.code === "Space") game.getState().status === "game" ? game.setInput({ jump: true }) : start();
  });
  addEventListener("keyup", (event) => {
    if (["KeyA", "ArrowLeft"].includes(event.code)) input.left = false;
    if (["KeyD", "ArrowRight"].includes(event.code)) input.right = false;
    if (["KeyW", "ArrowUp"].includes(event.code)) input.boost = false;
  });
  addEventListener("blur", () => {
    input.left = false;
    input.right = false;
    input.boost = false;
    game.setInput({ steer: 0, boost: false, jump: false });
  });
  addEventListener("resize", () => {
    adapter.camera.aspect = innerWidth / innerHeight;
    adapter.camera.updateProjectionMatrix();
    adapter.renderer.setSize(innerWidth, innerHeight);
  });

  let last = performance.now();
  let startupFrameAcknowledged = false;
  function loop(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    if (worldPreparing) {
      requestAnimationFrame(loop);
      return;
    }

    game.setInput({ steer: (input.left ? 1 : 0) - (input.right ? 1 : 0), boost: input.boost });
    engine.tick(dt);
    const state = game.getState();
    const committed = game.getCommittedFrame();
    const collectedPickupIds = committed?.accepted?.pickupIds ?? [];
    if (collectedPickupIds.length > 0) adapter.refreshDynamicContent(state, collectedPickupIds);
    updateStreaming(state);

    adapter.render(state, dt);
    if (!startupFrameAcknowledged && treeAssetRuntime?.startup) {
      const treeFidelityView = adapter.view.treeFidelity;
      const exactFrameAck = treeFidelityView?.exactFrameAck;
      const lushFrameAck = adapter.view.lushVegetationFrameAck;
      if (treeFidelityView?.generationDigest !== treeFidelityGenerationDigest) {
        throw new Error("Presented tree fidelity generation does not match the startup asset generation.");
      }
      if (!exactFrameAck || exactFrameAck.generationDigest !== treeFidelityGenerationDigest) {
        throw new Error("Presented tree impostors do not have an exact generation-bound frame acknowledgement.");
      }
      if (!lushFrameAck || lushFrameAck.foliageAtlasRevision !== FOLIAGE_ATLAS_REVISION) {
        throw new Error("Presented foliage cards do not match the admitted foliage atlas revision.");
      }
      if (
        !startupStreamingReceipt
        || startupStreamingReceipt.simulationReady !== startupStreamingReceipt.simulationRequired
        || startupStreamingReceipt.visualReady !== startupStreamingReceipt.visualRequired
        || !startupStreamingReceipt.collisionReady
        || !startupStreamingReceipt.rendererReady
      ) {
        throw new Error("The playable frame was presented before the route corridor was ready.");
      }
      treeAssetRuntime.startup.presentFirstFrame({
        frameId: `prehistoric-rush:frame:${engine.clock?.frame ?? 1}`,
        presentationId: "prehistoric-rush-game",
        backend: "webgl2",
        receipt: {
          treeFidelityGenerationDigest,
          treeFidelityGenerationIds,
          vegetationCatalogDigest,
          vegetationSpeciesCount: allVegetationSpecies.length,
          treeSpeciesCount: vegetationRuntime.catalog.species.length,
          groundCoverSpeciesCount: vegetationRuntime.catalog.groundCoverSpecies.length,
          foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
          vegetationDensityPolicy: VEGETATION_DENSITY_POLICY,
          treeFidelityPackageCount: treeFidelityPackages.length,
          treeCount: treeFidelityView.treeCount,
          formCounts: structuredClone(treeFidelityView.counts),
          foliageCards: (adapter.view.lushFoliage?.nearCards ?? 0) + (adapter.view.lushFoliage?.mediumCards ?? 0),
          productionForest: structuredClone(adapter.view.productionForest),
          groundCoverCount: adapter.view.groundCover?.count ?? 0,
          transitioning: treeFidelityView.transitioning,
          exactImpostorFrameAck: structuredClone(exactFrameAck),
          lushVegetationFrameAck: structuredClone(lushFrameAck),
          startupStreaming: structuredClone(startupStreamingReceipt)
        }
      });
      treeAssetRuntime.startup.enter({ inputReady: true });
      startupFrameAcknowledged = true;
    }
    const progress = Math.min(1, state.distance / cfg.goal);
    const patchStats = adapter.view.patchStats;
    const lod = adapter.view.terrainLod;
    const treeLod = adapter.view.treeFidelity?.counts ?? { near: 0, medium: 0, far: 0, horizon: 0 };
    const foliageCards = (adapter.view.lushFoliage?.nearCards ?? 0) + (adapter.view.lushFoliage?.mediumCards ?? 0);
    const productionCanopies = adapter.view.productionForest?.canopyGroups ?? 0;
    const groundCover = adapter.view.groundCover?.count ?? 0;
    const timing = timings.getSnapshot(state.speed);
    ui.status.innerHTML = `<b style="color:#ffd37a">Prehistoric Rush</b><br>${state.status}<div style="height:7px;background:#ffffff22;margin:8px 0"><div style="height:100%;width:${(progress * 100).toFixed(1)}%;background:#84d778"></div></div>${Math.floor(state.distance)}m / ${cfg.goal}m · ${state.shards} shards<br>${state.speed.toFixed(1)} m/s · ${state.region} × ${state.surfaceMultiplier.toFixed(2)}<br><small>tick ${engine.getLastTickCommit()?.revision ?? 0} · patches ${patchStats.active}/${patchStats.desiredActive} + ${patchStats.presentationPrefetched} visual · forward ${patchStats.forwardBufferedMeters}m · p95 ${timing.patchReadyP95Seconds.toFixed(2)}s · terrain ${lod.counts.near}/${lod.counts.medium}/${lod.counts.far} · trees ${treeLod.near}/${treeLod.medium}/${treeLod.far}/${treeLod.horizon} · leaf cards ${foliageCards} · canopy groups ${productionCanopies} · floor ${groundCover} · species ${allVegetationSpecies.length} · ${workerState.worker ? "worker" : "fallback"}</small>`;
    ui.button.textContent = state.status === "game" ? "Jump" : state.status === "run-over" ? "Retry" : state.status === "win" ? "Run Again" : "Start Rush";
    requestAnimationFrame(loop);
  }

  globalThis.PrehistoricRushHost = {
    engine,
    physics: engine.corePhysics,
    adapter,
    patchController: controller,
    cameraFollow,
    treeAssets: treeAssetRuntime,
    vegetation: vegetationRuntime,
    versions: { nexus: NEXUS_COMMIT, kits: KITS_COMMIT, protokits: PROTOKITS_COMMIT },
    getState: () => ({
      game: game.snapshot(),
      tick: engine.getLastTickCommit(),
      simulation: engine.coreSimulation.getCommittedFrame(),
      physics: engine.corePhysics.getFrame(),
      patchStreaming: controller.getSnapshot(),
      streamingReadiness: startupStreamingReceipt,
      patchTiming: timings.getSnapshot(game.getState().speed),
      camera: cameraFollow.getSnapshot(),
      composition: engine.gameComposer,
      scene: engine.coreScene?.getSceneHostDescriptor?.(),
      playerProfile: { profileId: playerProfile.profileId, revision: playerProfile.revision },
      playerBody: { id: playerBody.id, contentHash: playerBody.contentHash, topology: playerBody.topology },
      patchOwnership: { ...adapter.view.ownership },
      presentationPrefetch: structuredClone(adapter.view.presentationPrefetch),
      terrainLod: {
        policy: terrainLodPolicy,
        view: structuredClone(adapter.view.terrainLod)
      },
      vegetation: {
        species: allVegetationSpecies,
        trees: vegetationRuntime.tree.list(),
        foliage: vegetationRuntime.foliage.list(),
        catalogDigest: vegetationCatalogDigest,
        foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
        densityPolicy: VEGETATION_DENSITY_POLICY
      },
      treeFidelity: structuredClone(adapter.view.treeFidelity),
      lushFoliage: structuredClone(adapter.view.lushFoliage),
      groundCover: structuredClone(adapter.view.groundCover),
      productionForest: structuredClone(adapter.view.productionForest),
      jungleAtmosphere: structuredClone(adapter.view.jungleAtmosphere),
      treeFidelityGenerationDigest,
      assetStartup: treeAssetRuntime?.startup?.getDescriptor?.() ?? null,
      renderer: "three-patch-quadtree-two-tier-streaming-v17"
    })
  };
  requestAnimationFrame(loop);
}

main().catch((error) => {
  console.error(error);
  document.body.textContent = `Could not start PrehistoricRush: ${error.message}`;
});
