import { NEXUS_COMMIT, RUNTIME_URLS } from "./shared/runtime-versions.js";
import { loadPlayerCharacterProfile } from "./shared/player-character-store.js";
import { getPrehistoricRushWorldRecipe, resolvePrehistoricRushWorldId } from "./domains/prehistoric-rush/world-recipes.js";
import { createPrehistoricRushCoreKits } from "./domains/prehistoric-rush/core-assembly.js";
import { createPrehistoricRushCourseImplementation } from "./domains/prehistoric-rush/course-implementation.js";
import { createPrehistoricRushWorldImplementation } from "./domains/prehistoric-rush/world-implementation.js";
import { installPrehistoricRushPlayerActor } from "./domains/prehistoric-rush/player-actor-binding.js";
import { createPrehistoricRushPlayerImplementation } from "./domains/prehistoric-rush/player-implementation.js";
import { createPrehistoricRushGameplayImplementation } from "./domains/prehistoric-rush/gameplay-implementation.js";
import {
  createPrehistoricRushRenderSurface,
  createPrehistoricRushRenderingImplementation
} from "./domains/prehistoric-rush/rendering-implementation.js";
import { installPrehistoricRushStartupAssets } from "./domains/prehistoric-rush/startup-asset-policy.js";
import { resolvePlayableRacerProfile } from "./racers/racer-catalog.js";
import { createRacerCharacterProfile, getRacerRosterDetails } from "./racers/racer-roster.js";
import { loadSelectedRacerId, saveSelectedRacerId } from "./racers/racer-selection-store.js";

const startupStartedAt = performance.now();
const app = document.querySelector("#app") ?? document.body;
app.innerHTML = `<section data-race-screen="true" style="position:fixed;inset:0;background:#101b13;color:#f3e7ba;font:14px system-ui,sans-serif;overflow:hidden"><div id="prehistoric-render-host" data-race-renderer="true" style="position:absolute;inset:0"></div><aside data-race-hud="true" style="position:absolute;inset:0;z-index:4;pointer-events:none"><span id="prehistoric-racer-badge" style="position:absolute;left:24px;top:20px;color:#f3e7ba;font-size:16px;font-weight:900;letter-spacing:.08em;text-transform:uppercase"></span><div id="prehistoric-status" data-race-status="true" style="position:absolute;left:24px;top:48px;line-height:1.45">Loading Nexus World…</div><div id="prehistoric-stamina" aria-label="Stamina" style="position:absolute;left:50%;bottom:24px;display:flex;gap:5px;transform:translateX(-50%);width:132px;height:7px"><span data-stamina-segment="0" style="flex:1;border-radius:999px;background:#ffffff35"></span><span data-stamina-segment="1" style="flex:1;border-radius:999px;background:#ffffff35"></span><span data-stamina-segment="2" style="flex:1;border-radius:999px;background:#ffffff35"></span></div></aside><div style="position:absolute;right:18px;bottom:18px;z-index:4;padding:8px 11px;border-radius:999px;background:#07100bc4;color:#e8dfc0;font:800 10px system-ui;letter-spacing:.05em;text-transform:uppercase;pointer-events:none">A/D steer · W boost · Space jump · E ability</div></section>`;
const host = document.querySelector("#prehistoric-render-host");
document.querySelector('[data-race-screen="true"] > div:last-child').textContent = "A/D steer · W boost · Space jump";
const statusNode = document.querySelector("#prehistoric-status");
const racerBadge = document.querySelector("#prehistoric-racer-badge");
const staminaSegments = [...document.querySelectorAll("[data-stamina-segment]")];
const diagnosticFoundationOnly = new URLSearchParams(globalThis.location?.search ?? "").get("diagnostic") === "foundation";
const setLoading = (progress, detail) => {
  const percent = Math.max(0, Math.min(100, Math.round(Number(progress || 0) * 100)));
  statusNode.textContent = `${detail} · ${percent}% · ${diagnosticFoundationOnly ? "Foundation diagnostic" : "production world"}`;
};

function markStartup(id, phase) {
  globalThis.performance?.mark?.(`prehistoric-rush:${id}:${phase}`);
}

function measureStartup(id, work) {
  markStartup(id, "start");
  try { return work(); }
  finally {
    markStartup(id, "end");
    globalThis.performance?.measure?.(`prehistoric-rush:${id}`, `prehistoric-rush:${id}:start`, `prehistoric-rush:${id}:end`);
  }
}

async function measureStartupAsync(id, work) {
  markStartup(id, "start");
  try { return await work(); }
  finally {
    markStartup(id, "end");
    globalThis.performance?.measure?.(`prehistoric-rush:${id}`, `prehistoric-rush:${id}:start`, `prehistoric-rush:${id}:end`);
  }
}

function yieldStartupFrame() {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    globalThis.requestAnimationFrame?.(finish);
    globalThis.setTimeout?.(finish, 16);
  });
}

setLoading(0.04, "Loading Nexus semantic domains");
const [Nexus, Runtime, Actor, Spatial, Interaction, SimulationRuntime, Motion, Physics, Asset, ObjectDomain, World, FoundationSampling, Presentation, Graphics, Animation, Render, Compute, CreatureModule, THREE] = await measureStartupAsync("domainImports", () => Promise.all([
  import(RUNTIME_URLS.nexus),
  import(RUNTIME_URLS.nexusRuntime),
  import(RUNTIME_URLS.nexusActor),
  import(RUNTIME_URLS.nexusSpatial),
  import(RUNTIME_URLS.nexusInteraction),
  import(RUNTIME_URLS.nexusSimulationRuntime),
  import(RUNTIME_URLS.nexusMotion),
  import(RUNTIME_URLS.nexusPhysics),
  import(RUNTIME_URLS.nexusAsset),
  import(RUNTIME_URLS.nexusObject),
  import(RUNTIME_URLS.nexusWorld),
  import(RUNTIME_URLS.nexusFoundationSampling),
  import(RUNTIME_URLS.nexusPresentation),
  import(RUNTIME_URLS.nexusGraphics),
  import(RUNTIME_URLS.nexusAnimation),
  import(RUNTIME_URLS.nexusRender),
  import(RUNTIME_URLS.nexusCompute),
  import(RUNTIME_URLS.creatureKit),
  import(RUNTIME_URLS.three)
]));
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
const modules = { Nexus, Runtime, Actor, Spatial, Interaction, Simulation, Asset, Object: ObjectDomain, World, Presentation, Graphics, Animation, Render };
const worldRecipe = getPrehistoricRushWorldRecipe(resolvePrehistoricRushWorldId());
const requestedRacerId = loadSelectedRacerId(globalThis.location);
const racerProfile = resolvePlayableRacerProfile(requestedRacerId);
saveSelectedRacerId(racerProfile.id);
const rosterDetails = getRacerRosterDetails(racerProfile.id);
const playerProfile = createRacerCharacterProfile(racerProfile, loadPlayerCharacterProfile());
racerBadge.textContent = racerProfile.displayName;
racerBadge.style.color = rosterDetails.accent;
const coreKits = createPrehistoricRushCoreKits(modules);
const rootKit = coreKits.pop();
const kits = [
  ...coreKits,
  CreatureModule.createProceduralCreatureBodyKit({ seed: worldRecipe.seed, creatures: [playerProfile.creature], requires: [] }),
  ...(typeof World.createRouteFieldKit === "function" ? [World.createRouteFieldKit()] : []),
  rootKit
];
const engine = measureStartup("engineConstruction", () => Nexus.createEngine({ kits }));
globalThis.PrehistoricRushEngine = engine;
const startup = engine.n.startup;
if (!startup?.launch || !engine.n.runtime?.recordInstallation) throw new Error("Nexus Runtime Lifecycle and Core Startup did not install.");
startup.launch({
  launchId: `prehistoric-rush:${worldRecipe.id}:${racerProfile.id}`,
  projectId: "prehistoric-rush",
  continuation: { mode: "new" },
  preparations: [
    { id: "engine", label: "Nexus domains", required: true, weight: 1 },
    { id: "renderer", label: "Renderer and canvas", required: true, weight: 1 },
    { id: "playable-assets", label: "Four playable asset groups", required: true, weight: 1 },
    { id: "course", label: "Race route", required: true, weight: 0.5 },
    { id: "world", label: "World semantics", required: true, weight: 1 },
    { id: "player", label: "Player and gameplay", required: true, weight: 1 },
    { id: "foundation", label: "Visible Foundation presentation", required: true, weight: 2 }
  ],
  metadata: { nexusCommit: NEXUS_COMMIT, worldId: worldRecipe.id, racerId: racerProfile.id }
});
const domainImportMeasure = performance.getEntriesByName("prehistoric-rush:domainImports", "measure").at(-1);
engine.n.runtime.recordInstallation({
  id: "prehistoric-rush-domain-imports",
  status: "ready",
  durationMs: domainImportMeasure?.duration ?? null
});
startup.working("engine", 1, "Registering Nexus domains");
startup.ready("engine", { runtimeStatus: engine.n.runtime.getStatus() }, "Nexus domains registered");

const failActiveStartup = (error, source) => {
  if (startup.getDescriptor().status !== "starting") return;
  startup.fail({ code: "prehistoric-rush.startup.failed", message: error?.message ?? String(error), source, retryable: true });
};
const onStartupError = (event) => failActiveStartup(event?.error ?? new Error(String(event?.message ?? "Unknown startup error")), "window.error");
const onStartupRejection = (event) => failActiveStartup(event?.reason ?? new Error("Unhandled startup rejection"), "unhandledrejection");
globalThis.addEventListener?.("error", onStartupError);
globalThis.addEventListener?.("unhandledrejection", onStartupRejection);

startup.working("renderer", 0, "Creating the WebGL canvas");
setLoading(startup.getDescriptor().progress, "Preparing renderer");
const renderSurface = measureStartup("rendererSurfaceCreation", () => createPrehistoricRushRenderSurface(THREE, { host }));
startup.ready("renderer", { canvas: true, backend: "webgl2" }, "Renderer and canvas ready");
await yieldStartupFrame();

startup.working("playable-assets", 0, "Loading playable assets: 0/4");
setLoading(startup.getDescriptor().progress, "Loading playable assets: 0/4");
const assetSession = installPrehistoricRushStartupAssets(engine, { Nexus, racerId: racerProfile.id, worldId: worldRecipe.id });
await measureStartupAsync("playableAssetGroups", () => assetSession.preparePlayable((progress) => {
  const completed = Math.min(4, Math.floor(progress * 4));
  startup.working("playable-assets", progress, `Loading playable assets: ${completed}/4`);
  setLoading(startup.getDescriptor().progress, `Loading playable assets: ${completed}/4`);
}));
startup.ready("playable-assets", { groupCount: 4, owner: "n:asset" }, "Loading playable assets: 4/4");
await yieldStartupFrame();

measureStartup("worldDefinitionRegistration", () => {
  if (!engine.n.world.getWorldDefinition(worldRecipe.id)) engine.n.world.registerWorld({
    id: worldRecipe.id,
    seed: String(worldRecipe.seed),
    focus: { position: { x: 0, y: 0, z: 0 } },
    partition: World.createUniformGridPartition({ id: `${worldRecipe.id}:foundation-grid`, cellSize: 96, radius: 4 }),
    surface: World.createFlatWorldSurface({ id: `${worldRecipe.id}:surface` }),
    providers: [],
    settings: { recipeId: worldRecipe.id, recipeRevision: worldRecipe.revision }
  });
});

startup.working("course", 0, "Preparing route");
setLoading(startup.getDescriptor().progress, "Preparing route");
const course = measureStartup("courseConstruction", () => createPrehistoricRushCourseImplementation({ engine, config: { seed: worldRecipe.seed, ...worldRecipe.route } }));
startup.ready("course", { sampleCount: course.snapshot?.().samples?.length ?? null }, "Route ready");
await yieldStartupFrame();

startup.working("world", 0, "Projecting Jurassic world features");
setLoading(startup.getDescriptor().progress, "Projecting Jurassic world features");
const world = measureStartup("worldConstruction", () => createPrehistoricRushWorldImplementation({ engine, World, FoundationSampling, recipe: worldRecipe, cellSize: 96 }));
startup.ready("world", { worldId: worldRecipe.id, revision: worldRecipe.revision }, "World semantics ready");
await yieldStartupFrame();

startup.working("player", 0, "Installing selected racer");
setLoading(startup.getDescriptor().progress, "Installing selected racer");
measureStartup("playerActorInstallation", () => installPrehistoricRushPlayerActor(engine, { profile: racerProfile }));
const player = measureStartup("playerConstruction", () => createPrehistoricRushPlayerImplementation({ engine, course, world, profile: racerProfile }));
startup.working("player", 0.7, "Preparing race rules");
const gameplay = measureStartup("gameplayConstruction", () => createPrehistoricRushGameplayImplementation({ player, course, world, goalDistance: worldRecipe.runtime.goalDistance }));
startup.ready("player", { racerId: racerProfile.id }, "Player and gameplay ready");
engine.n.prehistoricRush.bindCompute({ computeHost, selection: computeSelection });
await yieldStartupFrame();
const creatureApi = engine.n.proceduralCreatureBody;
if (!creatureApi?.get || !creatureApi?.createPose) throw new Error("Procedural racer body service did not install.");
const playerBody = creatureApi.get(playerProfile.creature.id);
if (!playerBody) throw new Error(`Procedural racer body is unavailable: ${playerProfile.creature.id}.`);
engine.n.prehistoricRush.bindSimulation({ course, world, player, gameplay, worldRecipe, racerProfile, playerProfile, playerBody });
const racerPresentation = Object.freeze({
  racerId: racerProfile.id,
  bodyDescriptor: playerBody,
  accent: rosterDetails.accent,
  ...racerProfile.presentation
});

startup.working("foundation", 0, "Committing visible Foundation terrain");
setLoading(startup.getDescriptor().progress, "Preparing starting area");
let foundationStartupProgressActive = true;
const rendering = await measureStartupAsync("rendererStartup", () => createPrehistoricRushRenderingImplementation(THREE, {
  host,
  world,
  course,
  gameplay,
  creatureApi,
  racerPresentation,
  renderSurface,
  assetSession,
  diagnosticFoundationOnly,
  Nexus,
  engine,
  onProgress(progress, detail) {
    // The renderer also reports optional fidelity changes after gameplay begins.
    // Core Startup only accepts preparation updates while a launch is active.
    if (!foundationStartupProgressActive) return;
    startup.working("foundation", progress, detail);
    setLoading(startup.getDescriptor().progress, detail);
  },
  onFidelityState(state) {
    if (state.error) console.warn(`Optional tree fidelity retained proxy presentation: ${state.error}`);
  }
}));
startup.ready("foundation", { terrainPatchCount: rendering.snapshot().terrainPatchCount }, "Visible Foundation terrain committed");
foundationStartupProgressActive = false;
engine.n.prehistoricRush.bindPresentation({ rendering, renderSurface, assetSession });
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

measureStartup("foundationFocusCommit", () => world.focus({ x: 0, y: 0, z: 0 }));
let worldFocusCell = "0:0";
let last = performance.now();
let lastHudAt = -Infinity;
let lastDatasetStatus = "";
let lastDatasetDistanceBucket = -1;
const HUD_INTERVAL_MS = 200;

function updateStaminaHud(now, state) {
  if (now - lastHudAt < HUD_INTERVAL_MS) return;
  lastHudAt = now;
  const capacity = Math.max(1, Number(racerProfile.stamina?.capacity ?? 100));
  const stamina = Math.max(0, Math.min(capacity, Number(state.stamina ?? 0)));
  const ratio = stamina / capacity;
  const phaseColor = ratio <= 0.01 ? "#e56b5d" : ratio < 0.99 ? "#e6b45c" : "#8fd694";
  staminaSegments.forEach((segment, index) => {
    const threshold = index / staminaSegments.length;
    const filled = ratio > threshold;
    segment.style.background = filled ? phaseColor : "#ffffff35";
    segment.style.opacity = filled ? "1" : "0.5";
  });
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
  updateStaminaHud(now, state);
  rendering.draw(state, cameraFrame(state, dt), dt);
  try { engine.n.prehistoricRush.dispatchFrame({ now, dt, state, camera: rendering.camera }); }
  catch (error) { console.warn("PrehistoricRush frame hook failed:", error); }
  requestAnimationFrame(loop);
}

const initial = gameplay.readState();
rendering.draw(initial, cameraFrame(initial, 1 / 60), 1 / 60);
updateAutomationDataset(initial);
updateStaminaHud(performance.now(), initial);
startup.presentFirstFrame({
  frameId: "prehistoric-rush:first-foundation-frame",
  presentationId: "prehistoric-rush:webgl2",
  backend: "webgl2",
  receipt: { terrainPatchCount: rendering.snapshot().terrainPatchCount }
});
startup.enter({ inputReady: true });
setLoading(1, "Ready to race");
statusNode.remove();
const startupMs = performance.now() - startupStartedAt;
const getState = () => {
  const presentation = rendering.snapshot();
  const worldState = world.snapshot();
  const coreWorld = worldState.coreWorld ?? {};
  const playerSnapshot = player.snapshot();
  const startupState = startup.getDescriptor();
  const assetState = assetSession.getSnapshot();
  const gpuPresentation = engine.n.prehistoricRush.getComponent("gpuNative");
  const gpuNative = gpuPresentation?.snapshot?.() ?? null;
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
    startup: startupState,
    readiness: {
      engineReady: startup.getPreparation("engine"),
      rendererReady: startup.getPreparation("renderer"),
      playableAssetsReady: startup.getPreparation("playable-assets"),
      playerReady: startup.getPreparation("player"),
      foundationVisible: startup.getPreparation("foundation"),
      playable: startupState.playable
    },
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
    gpuNative,
    camera: { x: rendering.camera.position.x, y: rendering.camera.position.y, z: rendering.camera.position.z },
    assetStartup: {
      mode: diagnosticFoundationOnly ? "foundation-diagnostic" : "progressive-four-group",
      owner: assetState.owner,
      persistentCache: assetState.persistentCache,
      requiredGroupCount: assetState.requiredGroupCount,
      required: assetState.required,
      optional: assetState.optional
    },
    versions: { nexus: "main", nexusValidatedCommit: NEXUS_COMMIT }
  };
};
engine.n.prehistoricRush.bindSnapshotReader(getState);
globalThis.addEventListener?.("pagehide", () => {
  globalThis.removeEventListener?.("error", onStartupError);
  globalThis.removeEventListener?.("unhandledrejection", onStartupRejection);
}, { once: true });
requestAnimationFrame(loop);
