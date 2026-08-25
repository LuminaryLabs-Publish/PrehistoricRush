import { NEXUS_COMMIT, RUNTIME_URLS } from "./shared/runtime-versions.js";
import { loadPlayerCharacterProfile } from "./shared/player-character-store.js";
import { getPrehistoricRushWorldRecipe, resolvePrehistoricRushWorldId } from "./domains/prehistoric-rush/world-recipes.js";
import { createPrehistoricRushCoreKits } from "./domains/prehistoric-rush/core-assembly.js";
import { createPrehistoricRushCourseImplementation } from "./domains/prehistoric-rush/course-implementation.js";
import { createPrehistoricRushWorldImplementation } from "./domains/prehistoric-rush/world-implementation.js";
import { installPrehistoricRushPlayerActor } from "./domains/prehistoric-rush/player-actor-binding.js";
import { createPrehistoricRushPlayerImplementation } from "./domains/prehistoric-rush/player-implementation.js";
import { createPrehistoricRushGameplayImplementation } from "./domains/prehistoric-rush/gameplay-implementation.js";
import { createPrehistoricRushRenderingImplementation } from "./domains/prehistoric-rush/rendering-implementation.js";
import { resolvePlayableRacerProfile } from "./racers/racer-catalog.js";

const startupStartedAt = performance.now();
const app = document.querySelector("#app") ?? document.body;
app.innerHTML = `<section data-race-screen="true" style="position:fixed;inset:0;background:#101b13;color:#f3e7ba;font:14px system-ui,sans-serif;overflow:hidden"><div id="prehistoric-render-host" data-race-renderer="true" style="position:absolute;inset:0"></div><aside data-race-hud="true" style="position:absolute;left:18px;top:18px;z-index:4;padding:12px 14px;border-radius:12px;background:#09110bcc;min-width:230px;pointer-events:none"><strong style="color:#ffd37a">Prehistoric Rush</strong><div id="prehistoric-status" data-race-status="true" style="margin-top:7px;line-height:1.45">Loading Nexus World…</div></aside></section>`;
const host = document.querySelector("#prehistoric-render-host");
const statusNode = document.querySelector("#prehistoric-status");
const diagnosticFoundationOnly = new URLSearchParams(globalThis.location?.search ?? "").get("diagnostic") === "foundation";
const setLoading = (progress, detail) => {
  const percent = Math.max(0, Math.min(100, Math.round(Number(progress || 0) * 100)));
  statusNode.textContent = `${detail} · ${percent}% · ${diagnosticFoundationOnly ? "Foundation diagnostic" : "production world"}`;
};

setLoading(0.04, "Loading Nexus semantic domains");
const [Nexus, Actor, Spatial, Interaction, SimulationRuntime, Motion, Physics, World, FoundationSampling, Presentation, Graphics, Animation, Render, Compute, CreatureModule, THREE] = await Promise.all([
  import(RUNTIME_URLS.nexus),
  import(RUNTIME_URLS.nexusActor),
  import(RUNTIME_URLS.nexusSpatial),
  import(RUNTIME_URLS.nexusInteraction),
  import(RUNTIME_URLS.nexusSimulationRuntime),
  import(RUNTIME_URLS.nexusMotion),
  import(RUNTIME_URLS.nexusPhysics),
  import(RUNTIME_URLS.nexusWorld),
  import(RUNTIME_URLS.nexusFoundationSampling),
  import(RUNTIME_URLS.nexusPresentation),
  import(RUNTIME_URLS.nexusGraphics),
  import(RUNTIME_URLS.nexusAnimation),
  import(RUNTIME_URLS.nexusRender),
  import(RUNTIME_URLS.nexusCompute),
  import(RUNTIME_URLS.creatureKit),
  import(RUNTIME_URLS.three)
]);
if (typeof Compute.createComputeHost !== "function" || typeof Compute.createJavaScriptComputeProvider !== "function") {
  throw new Error("Nexus Compute Host is unavailable from NexusEngine/main.");
}

const computeProviders = [Compute.createJavaScriptComputeProvider({ id: "prehistoric-rush-javascript-compute", priority: 10 })];
let webgpuAdapter = null;
if (globalThis.navigator?.gpu && typeof Compute.createWebGPUComputeProvider === "function") {
  try {
    webgpuAdapter = await globalThis.navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
    if (webgpuAdapter) computeProviders.unshift(Compute.createWebGPUComputeProvider({ id: "prehistoric-rush-webgpu-compute", adapter: webgpuAdapter, priority: 100, awaitCompletion: false }));
  } catch {
    webgpuAdapter = null;
  }
}
const computeHost = Compute.createComputeHost({ id: "prehistoric-rush-compute-host", providers: computeProviders });
const computeSelection = computeHost.selectProvider({ preferredBackends: ["webgpu", "javascript"], allowFallback: true });

setLoading(0.12, "Composing Prehistoric Rush");
const Simulation = Object.freeze({ ...SimulationRuntime, ...Motion, ...Physics });
const modules = { Nexus, Actor, Spatial, Interaction, Simulation, World, Presentation, Graphics, Animation, Render };
const worldRecipe = getPrehistoricRushWorldRecipe(resolvePrehistoricRushWorldId());
const requestedRacerId = new URLSearchParams(globalThis.location?.search ?? "").get("racer");
const racerProfile = resolvePlayableRacerProfile(requestedRacerId ?? undefined);
const playerProfile = loadPlayerCharacterProfile();
const coreKits = createPrehistoricRushCoreKits(modules);
const rootKit = coreKits.pop();
const kits = [
  ...coreKits,
  CreatureModule.createProceduralCreatureBodyKit({ seed: worldRecipe.seed, creatures: [playerProfile.creature], requires: [] }),
  ...(typeof World.createRouteFieldKit === "function" ? [World.createRouteFieldKit()] : []),
  rootKit
];
const engine = Nexus.createEngine({ kits });

if (!engine.n.world.getWorldDefinition(worldRecipe.id)) engine.n.world.registerWorld({
  id: worldRecipe.id,
  seed: String(worldRecipe.seed),
  focus: { position: { x: 0, y: 0, z: 0 } },
  partition: World.createUniformGridPartition({ id: `${worldRecipe.id}:foundation-grid`, cellSize: 96, radius: 4 }),
  surface: World.createFlatWorldSurface({ id: `${worldRecipe.id}:surface` }),
  providers: [],
  settings: { recipeId: worldRecipe.id, recipeRevision: worldRecipe.revision }
});

setLoading(0.2, "Projecting Jurassic world features");
const course = createPrehistoricRushCourseImplementation({ engine, config: { seed: worldRecipe.seed, ...worldRecipe.route } });
const world = createPrehistoricRushWorldImplementation({ engine, World, FoundationSampling, recipe: worldRecipe, cellSize: 96 });
installPrehistoricRushPlayerActor(engine, { profile: racerProfile });
const player = createPrehistoricRushPlayerImplementation({ engine, course, world, profile: racerProfile });
const gameplay = createPrehistoricRushGameplayImplementation({ player, course, world, goalDistance: worldRecipe.runtime.goalDistance });
const creatureApi = engine.n.proceduralCreatureBody;
if (!creatureApi?.get || !creatureApi?.createPose) throw new Error("Procedural racer body service did not install.");
const playerBody = creatureApi.get(playerProfile.creature.id);
if (!playerBody) throw new Error(`Procedural racer body is unavailable: ${playerProfile.creature.id}.`);
const racerPresentation = Object.freeze({
  racerId: racerProfile.id,
  bodyDescriptor: playerBody,
  ...racerProfile.presentation
});

const rendering = await createPrehistoricRushRenderingImplementation(THREE, {
  host, world, course, gameplay, creatureApi, racerPresentation, diagnosticFoundationOnly,
  onProgress(progress, detail) { setLoading(0.22 + progress * 0.74, detail); }
});
const framing = engine.n.cameraFraming.create({
  id: `prehistoric-rush-${racerProfile.id}`,
  padding: racerProfile.camera.padding,
  minimumDistance: racerProfile.camera.minimumDistance,
  maximumDistance: racerProfile.camera.maximumDistance,
  smoothTime: racerProfile.camera.smoothTime
});
document.body.dataset.racerId = racerProfile.id;

let left = false;
let right = false;
let boost = false;
let lastSteer = 0;
let lastBoost = false;
const frameHooks = new Set();
const addFrameHook = (hook) => {
  if (typeof hook !== "function") throw new TypeError("Frame hook must be a function.");
  frameHooks.add(hook);
  return () => frameHooks.delete(hook);
};

addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space", "KeyE"].includes(event.code)) event.preventDefault();
  if (["KeyA", "ArrowLeft"].includes(event.code)) left = true;
  if (["KeyD", "ArrowRight"].includes(event.code)) right = true;
  if (["KeyW", "ArrowUp"].includes(event.code)) boost = true;
  if (event.code === "Space") gameplay.setInput({ jump: true });
  if (event.code === "KeyE") gameplay.setInput({ ability: true });
  if (event.code === "Enter") gameplay.start();
});
addEventListener("keyup", (event) => {
  if (["KeyA", "ArrowLeft"].includes(event.code)) left = false;
  if (["KeyD", "ArrowRight"].includes(event.code)) right = false;
  if (["KeyW", "ArrowUp"].includes(event.code)) boost = false;
});
addEventListener("blur", () => {
  left = false; right = false; boost = false;
  lastSteer = 0; lastBoost = false;
  gameplay.setInput({ steer: 0, boost: false });
});
addEventListener("resize", () => {
  rendering.camera.aspect = innerWidth / innerHeight;
  rendering.camera.updateProjectionMatrix();
  rendering.renderer.setSize(innerWidth, innerHeight);
});

const subjectBounds = { min: [0, 0, 0], max: [0, 0, 0] };
const cameraRequest = {
  subjectBounds,
  viewport: { width: innerWidth, height: innerHeight },
  camera: {
    projection: "perspective",
    verticalFov: racerProfile.camera.verticalFov,
    preferredDirection: [...racerProfile.camera.preferredDirection]
  },
  deltaTime: 1 / 60
};
function cameraFrame(state, dt) {
  const lookAhead = Number(state.speed ?? 0) * racerProfile.camera.lookAheadSeconds;
  const centerX = state.x + Math.sin(state.yaw) * lookAhead;
  const centerZ = state.z + Math.cos(state.yaw) * lookAhead;
  subjectBounds.min[0] = centerX - racerProfile.camera.halfWidth;
  subjectBounds.min[1] = state.y;
  subjectBounds.min[2] = centerZ - racerProfile.camera.halfDepth;
  subjectBounds.max[0] = centerX + racerProfile.camera.halfWidth;
  subjectBounds.max[1] = state.y + racerProfile.camera.height;
  subjectBounds.max[2] = centerZ + racerProfile.camera.halfDepth;
  cameraRequest.viewport.width = innerWidth;
  cameraRequest.viewport.height = innerHeight;
  cameraRequest.camera.preferredDirection[0] = -Math.sin(state.yaw);
  cameraRequest.camera.preferredDirection[2] = -Math.cos(state.yaw);
  cameraRequest.deltaTime = dt;
  return framing.update(cameraRequest);
}

world.focus({ x: 0, y: 0, z: 0 });
let worldFocusCell = "0:0";
let last = performance.now();
let lastHudAt = -Infinity;
let lastDatasetStatus = "";
let lastDatasetDistanceBucket = -1;
const HUD_INTERVAL_MS = 200;

function updateHud(now, state) {
  if (now - lastHudAt < HUD_INTERVAL_MS) return;
  lastHudAt = now;
  const presentation = rendering.snapshot();
  statusNode.textContent = `${racerProfile.displayName} · ${worldRecipe.name} · ${state.status} · ${Math.floor(state.distance)}m / ${worldRecipe.runtime.goalDistance}m · ${state.shards} shards · ${state.speed.toFixed(1)} m/s · ${state.region} · Nexus Foundation · ${presentation.terrainPatchCount} terrain cells · ${computeSelection?.backend ?? "cpu"} compute${diagnosticFoundationOnly ? " · diagnostic terrain only" : ` · ${presentation.treeCount} trees · ${presentation.grassCount} grass`}`;
}

function updateAutomationDataset(state) {
  const distanceBucket = Math.floor(state.distance);
  if (state.status !== lastDatasetStatus) {
    document.body.dataset.raceStatus = state.status;
    lastDatasetStatus = state.status;
  }
  if (distanceBucket !== lastDatasetDistanceBucket) {
    document.body.dataset.raceDistance = String(state.distance);
    lastDatasetDistanceBucket = distanceBucket;
  }
}

function loop(now) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  const steer = (left ? 1 : 0) - (right ? 1 : 0);
  if (steer !== lastSteer || boost !== lastBoost) {
    gameplay.setInput({ steer, boost });
    lastSteer = steer;
    lastBoost = boost;
  }
  gameplay.tick(dt);
  engine.tick(dt);
  const state = gameplay.readState();
  const nextWorldFocusCell = `${Math.floor(state.x / world.cellSize)}:${Math.floor(state.z / world.cellSize)}`;
  if (nextWorldFocusCell !== worldFocusCell) {
    world.focus({ x: state.x, y: state.y, z: state.z });
    worldFocusCell = nextWorldFocusCell;
  }
  updateAutomationDataset(state);
  rendering.draw(state, cameraFrame(state, dt), dt);
  for (const hook of frameHooks) {
    try { hook({ now, dt, state, camera: rendering.camera }); }
    catch (error) { console.warn("PrehistoricRush frame hook failed:", error); }
  }
  updateHud(now, state);
  requestAnimationFrame(loop);
}

const initial = gameplay.readState();
rendering.draw(initial, cameraFrame(initial, 1 / 60), 1 / 60);
updateAutomationDataset(initial);
updateHud(performance.now(), initial);
const startupMs = performance.now() - startupStartedAt;
const getState = () => {
  const presentation = rendering.snapshot();
  const worldState = world.snapshot();
  const coreWorld = worldState.coreWorld ?? {};
  const playerSnapshot = player.snapshot();
  return {
    racer: {
      id: racerProfile.id,
      displayName: racerProfile.displayName,
      activeAbility: racerProfile.abilities.active,
      passiveAbility: racerProfile.abilities.passive,
      availability: racerProfile.availability
    },
    game: gameplay.snapshot(),
    player: playerSnapshot,
    world: worldState,
    course: course.snapshot(),
    tick: engine.getLastTickCommit(),
    simulation: engine.n.simulation?.getCommittedFrame?.() ?? null,
    rendering: presentation,
    compute: { selected: computeSelection, providers: computeHost.listProviders(), webgpuAdapterReady: Boolean(webgpuAdapter) },
    performance: { startupMs, startupBudgetMs: 60000, withinStartupBudget: startupMs < 60000 },
    streamingReadiness: {
      foundationReady: true,
      rendererReady: presentation.terrainPatchCount >= 9,
      terrainPatchCount: presentation.terrainPatchCount,
      vegetationRequired: !diagnosticFoundationOnly,
      vegetationReady: diagnosticFoundationOnly || presentation.treeFidelityPackageCount === 12,
      backgroundForestPending: diagnosticFoundationOnly ? 0 : Math.max(0, presentation.forestTargetPatchCount - presentation.activeForestPatches)
    },
    worldUpdate: {
      worldId: worldState.recipe.id,
      worldRevision: worldState.recipe.revision,
      focus: worldState.focus ?? coreWorld.focus ?? null,
      focusCell: worldFocusCell,
      focusUpdateCount: worldState.focusUpdateCount ?? 0,
      terrainPatchIds: presentation.terrainPatchIds,
      activeForestPatchIds: presentation.activeForestPatchIds,
      streamingHoleCount: Math.max(0, 9 - presentation.terrainPatchCount),
      playerWorldPosition: playerSnapshot
    },
    treeFidelity: { disabled: diagnosticFoundationOnly, packageCount: presentation.treeFidelityPackageCount, counts: presentation.treeFidelityCounts, treeCount: presentation.treeCount },
    lushFoliage: { disabled: diagnosticFoundationOnly, grassCount: presentation.grassCount, activeForestPatches: presentation.activeForestPatches },
    vegetation: { enabled: presentation.vegetationEnabled },
    playerPresentation: presentation.playerPresentation,
    camera: { x: rendering.camera.position.x, y: rendering.camera.position.y, z: rendering.camera.position.z },
    assetStartup: { mode: diagnosticFoundationOnly ? "foundation-diagnostic" : "prebuilt-tree-fidelity" },
    versions: { nexus: "main", nexusValidatedCommit: NEXUS_COMMIT }
  };
};
globalThis.PrehistoricRushHost = Object.freeze({
  engine,
  course,
  world,
  player,
  gameplay,
  rendering,
  computeHost,
  worldRecipe,
  racerProfile,
  playerProfile,
  playerBody,
  addFrameHook,
  getState
});
requestAnimationFrame(loop);
