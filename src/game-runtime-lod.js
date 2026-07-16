import { createPrehistoricRushKitGraph } from "./domains/prehistoric-rush/prehistoric-rush-domain-kit.js";
import { createPrehistoricPatchGenerator } from "./world/prehistoric-patch-generator.js";
import { PREHISTORIC_TERRAIN_LOD_POLICY_INPUT } from "./world/prehistoric-terrain-lod-policy.js";
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
  grass: 70,
  goal: 3600
};
const STREAM = {
  activeRadius: 2,
  retainRadius: 4,
  prefetchDistance: 2,
  cacheLimit: 96,
  activationBudget: 1,
  generationBudget: 2
};
const TREE_BATCH_CAPACITY = 256;
const treeTypes = PREHISTORIC_TREE_TYPES;

const load = async (url) => {
  try {
    return await import(url);
  } catch (error) {
    console.warn("module import failed", url, error);
    return null;
  }
};

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
  panel.append(status, button);
  root.append(host, panel);
  return { host, status, button };
}

function createWorkerExecutor(PatchModule, generatorOptions) {
  if (typeof Worker !== "function" || typeof PatchModule.createMessageWorkerExecutor !== "function") {
    return { executor: null, worker: null };
  }
  try {
    const worker = new Worker(new URL("./workers/prehistoric-patch-worker.js", import.meta.url), { type: "module" });
    worker.postMessage({ type: "init-patch-worker", payload: generatorOptions });
    return { executor: PatchModule.createMessageWorkerExecutor(worker), worker };
  } catch (error) {
    console.warn("patch worker unavailable; using deferred synchronous generation", error);
    return { executor: null, worker: null };
  }
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
  if (typeof NexusEngine.selectTerrainLodLevel !== "function") {
    throw new Error("Pinned NexusEngine module does not expose terrain LOD selection.");
  }
  if (Rapier.init) await Rapier.init();
  if (typeof RapierKit.createRapierPhysicsProvider !== "function") {
    throw new Error("Pinned Rapier ProtoKit does not expose createRapierPhysicsProvider().");
  }

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

  const generatorOptions = {
    config: { ...cfg, shardsPerPatch: 2 },
    treeTypes,
    routeSamples: game.route.samples
  };
  const generator = createPrehistoricPatchGenerator(generatorOptions);
  const workerState = createWorkerExecutor(PatchModule, generatorOptions);
  const controller = patchControllers.create({
    id: "prehistoric-rush-world",
    worldSeed: String(cfg.seed),
    generatorVersion: "prehistoric-patch-v4-object-fidelity",
    patchSize: cfg.chunk,
    activeRadius: STREAM.activeRadius,
    retainRadius: STREAM.retainRadius,
    prefetchDistance: STREAM.prefetchDistance,
    cacheLimit: STREAM.cacheLimit,
    activationBudget: STREAM.activationBudget,
    generationBudget: STREAM.generationBudget,
    terrainSettingsHash: `segments-${terrainLodPolicy.sourceResolution}-lod-${terrainLodPolicy.revision}`,
    vegetationSettingsHash: `trees-${cfg.trees}-grass-${cfg.grass}-fidelity-${treeFidelityGenerationDigest}`,
    generator,
    executor: workerState.executor
  });
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
    treeTypes,
    treeFidelityPackages,
    treeBatchCapacity: TREE_BATCH_CAPACITY,
    terrainLodPolicy,
    selectTerrainLodLevel: NexusEngine.selectTerrainLodLevel
  });
  const input = { left: false, right: false, boost: false };

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

  function updateStreaming(state, primeCenter = false) {
    const forward = { x: Math.sin(state.yaw), z: Math.cos(state.yaw) };
    controller.setFocus({
      position: { x: state.x + cfg.chunk * 0.5, z: state.z + cfg.chunk * 0.5 },
      velocity: { x: forward.x * state.speed, z: forward.z * state.speed },
      forward
    });
    controller.update();
    adapter.releasePatches(controller.takeReleasedPatchIds());
    if (primeCenter) {
      const centerX = Math.floor((state.x + cfg.chunk * 0.5) / cfg.chunk);
      const centerZ = Math.floor((state.z + cfg.chunk * 0.5) / cfg.chunk);
      controller.generateSync(centerX, centerZ);
    }
    controller.pump({ maximum: workerState.worker ? STREAM.generationBudget : 1 });
    for (const patch of controller.takeReadyPatches({ maximum: STREAM.activationBudget })) adapter.activatePatch(patch, state);
    adapter.view.patchStats = controller.getStats();
  }

  game.start();
  updateStreaming(game.getState(), true);
  adapter.resetCamera(game.getState(), "initial-run");

  const start = () => {
    game.start();
    adapter.refreshDynamicContent(game.getState());
    updateStreaming(game.getState(), true);
    adapter.resetCamera(game.getState(), "run-restart");
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
      if (treeFidelityView?.generationDigest !== treeFidelityGenerationDigest) {
        throw new Error("Presented tree fidelity generation does not match the startup asset generation.");
      }
      treeAssetRuntime.startup.presentFirstFrame({
        frameId: `prehistoric-rush:frame:${engine.clock?.frame ?? 1}`,
        presentationId: "prehistoric-rush-game",
        backend: "webgl2",
        receipt: {
          treeFidelityGenerationDigest,
          treeFidelityGenerationIds,
          treeFidelityPackageCount: treeFidelityPackages.length,
          treeCount: treeFidelityView.treeCount,
          formCounts: structuredClone(treeFidelityView.counts),
          transitioning: treeFidelityView.transitioning
        }
      });
      treeAssetRuntime.startup.enter({ inputReady: true });
      startupFrameAcknowledged = true;
    }
    const progress = Math.min(1, state.distance / cfg.goal);
    const patchStats = adapter.view.patchStats;
    const lod = adapter.view.terrainLod;
    const treeLod = adapter.view.treeFidelity?.counts ?? { near: 0, medium: 0, far: 0, horizon: 0 };
    ui.status.innerHTML = `<b style="color:#ffd37a">Prehistoric Rush</b><br>${state.status}<div style="height:7px;background:#ffffff22;margin:8px 0"><div style="height:100%;width:${(progress * 100).toFixed(1)}%;background:#84d778"></div></div>${Math.floor(state.distance)}m / ${cfg.goal}m · ${state.shards} shards<br>${state.speed.toFixed(1)} m/s · ${state.region} × ${state.surfaceMultiplier.toFixed(2)}<br><small>tick ${engine.getLastTickCommit()?.revision ?? 0} · patches ${patchStats.active}/${patchStats.desiredActive} · terrain ${lod.counts.near}/${lod.counts.medium}/${lod.counts.far} · trees ${treeLod.near}/${treeLod.medium}/${treeLod.far}/${treeLod.horizon} · ${workerState.worker ? "worker" : "fallback"}</small>`;
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
    versions: { nexus: NEXUS_COMMIT, kits: KITS_COMMIT, protokits: PROTOKITS_COMMIT },
    getState: () => ({
      game: game.snapshot(),
      tick: engine.getLastTickCommit(),
      simulation: engine.coreSimulation.getCommittedFrame(),
      physics: engine.corePhysics.getFrame(),
      patchStreaming: controller.getSnapshot(),
      camera: cameraFollow.getSnapshot(),
      composition: engine.gameComposer,
      scene: engine.coreScene?.getSceneHostDescriptor?.(),
      playerProfile: { profileId: playerProfile.profileId, revision: playerProfile.revision },
      playerBody: { id: playerBody.id, contentHash: playerBody.contentHash, topology: playerBody.topology },
      patchOwnership: { ...adapter.view.ownership },
      terrainLod: {
        policy: terrainLodPolicy,
        view: structuredClone(adapter.view.terrainLod)
      },
      treeFidelity: structuredClone(adapter.view.treeFidelity),
      treeFidelityGenerationDigest,
      assetStartup: treeAssetRuntime?.startup?.getDescriptor?.() ?? null,
      renderer: "three-patch-quadtree-object-shape-fidelity-v12"
    })
  };
  requestAnimationFrame(loop);
}

main().catch((error) => {
  console.error(error);
  document.body.textContent = `Could not start PrehistoricRush: ${error.message}`;
});
