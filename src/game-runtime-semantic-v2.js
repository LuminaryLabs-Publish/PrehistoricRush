import { RUNTIME_URLS } from "./shared/runtime-versions.js";
import { getPrehistoricRushWorldRecipe, resolvePrehistoricRushWorldId } from "./domains/prehistoric-rush/world-recipes.js";
import { createPrehistoricRushCourseDomainKit } from "./domains/prehistoric-rush/course-domain-kit.js";
import { createPrehistoricRushCoreKits } from "./domains/prehistoric-rush/core-assembly.js";
import { createPrehistoricRushWorldImplementation } from "./domains/prehistoric-rush/world-implementation.js";
import { installPrehistoricRushPlayerActor } from "./domains/prehistoric-rush/player-actor-binding.js";
import { createPrehistoricRushPlayerImplementation } from "./domains/prehistoric-rush/player-implementation.js";
import { createPrehistoricRushGameplayImplementation } from "./domains/prehistoric-rush/gameplay-implementation.js";
import { createPrehistoricRushRenderingImplementation } from "./domains/prehistoric-rush/rendering-implementation.js";

const app = document.querySelector("#app") ?? document.body;
app.innerHTML = `<section style="position:fixed;inset:0;background:#101b13;color:#f3e7ba;font:14px system-ui,sans-serif;overflow:hidden"><div id="prehistoric-render-host" style="position:absolute;inset:0"></div><aside style="position:absolute;left:18px;top:18px;z-index:4;padding:12px 14px;border-radius:12px;background:#09110bcc;min-width:210px;pointer-events:none"><strong style="color:#ffd37a">Prehistoric Rush</strong><div id="prehistoric-status" style="margin-top:7px;line-height:1.45">Loading Nexus World…</div></aside></section>`;
const host = document.querySelector("#prehistoric-render-host");
const statusNode = document.querySelector("#prehistoric-status");

const [Nexus, Actor, Spatial, Interaction, SimulationRuntime, Motion, Physics, World, Presentation, Graphics, Animation, Render, THREE] = await Promise.all([
  import(RUNTIME_URLS.nexus),
  import(RUNTIME_URLS.nexusActor),
  import(RUNTIME_URLS.nexusSpatial),
  import(RUNTIME_URLS.nexusInteraction),
  import(RUNTIME_URLS.nexusSimulationRuntime),
  import(RUNTIME_URLS.nexusMotion),
  import(RUNTIME_URLS.nexusPhysics),
  import(RUNTIME_URLS.nexusWorld),
  import(RUNTIME_URLS.nexusPresentation),
  import(RUNTIME_URLS.nexusGraphics),
  import(RUNTIME_URLS.nexusAnimation),
  import(RUNTIME_URLS.nexusRender),
  import(RUNTIME_URLS.three)
]);
const Simulation = Object.freeze({ ...SimulationRuntime, ...Motion, ...Physics });
const modules = { Nexus, Actor, Spatial, Interaction, Simulation, World, Presentation, Graphics, Animation, Render };
const worldRecipe = getPrehistoricRushWorldRecipe(resolvePrehistoricRushWorldId());
const coreKits = createPrehistoricRushCoreKits(modules);
const rootKit = coreKits.pop();
const kits = [...coreKits, ...(typeof World.createRouteFieldKit === "function" ? [World.createRouteFieldKit()] : []), rootKit, createPrehistoricRushCourseDomainKit(Nexus, { seed: worldRecipe.seed, ...worldRecipe.route })];
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

const course = engine.n.prehistoricRushCourse;
const world = createPrehistoricRushWorldImplementation({ engine, World, recipe: worldRecipe, cellSize: 96 });
installPrehistoricRushPlayerActor(engine);
const player = createPrehistoricRushPlayerImplementation({ engine, course, world });
const gameplay = createPrehistoricRushGameplayImplementation({ player, goalDistance: worldRecipe.runtime.goalDistance });
const rendering = createPrehistoricRushRenderingImplementation(THREE, { host, world });
const framing = engine.n.cameraFraming.create({ id: "prehistoric-rush-player", padding: 4.8, minimumDistance: 10, maximumDistance: 18, smoothTime: 0.12 });

const playerVisual = new THREE.Group();
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x8b6d43, roughness: 0.9 });
const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 2.4), playerMaterial);
torso.position.y = 1.1;
playerVisual.add(torso);
const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 1.0), playerMaterial);
head.position.set(0, 1.5, 1.5);
playerVisual.add(head);
rendering.scene.add(playerVisual);

let left = false;
let right = false;
let boost = false;
addEventListener("keydown", (event) => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) event.preventDefault();
  if (["KeyA", "ArrowLeft"].includes(event.code)) left = true;
  if (["KeyD", "ArrowRight"].includes(event.code)) right = true;
  if (["KeyW", "ArrowUp"].includes(event.code)) boost = true;
  if (event.code === "Space") gameplay.setInput({ jump: true });
  if (event.code === "Enter") gameplay.start();
});
addEventListener("keyup", (event) => {
  if (["KeyA", "ArrowLeft"].includes(event.code)) left = false;
  if (["KeyD", "ArrowRight"].includes(event.code)) right = false;
  if (["KeyW", "ArrowUp"].includes(event.code)) boost = false;
});
addEventListener("blur", () => { left = false; right = false; boost = false; gameplay.setInput({ steer: 0, boost: false }); });
addEventListener("resize", () => { rendering.camera.aspect = innerWidth / innerHeight; rendering.camera.updateProjectionMatrix(); rendering.renderer.setSize(innerWidth, innerHeight); });

function cameraFrame(state, dt) {
  return framing.update({
    subjectBounds: { min: [state.x - 1.6, state.y, state.z - 1.6], max: [state.x + 1.6, state.y + 2.4, state.z + 1.6] },
    viewport: { width: innerWidth, height: innerHeight },
    camera: { projection: "perspective", verticalFov: 62, preferredDirection: [-Math.sin(state.yaw), 0.5, -Math.cos(state.yaw)] },
    deltaTime: dt
  });
}

world.focus({ x: 0, y: 0, z: 0 });
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  gameplay.setInput({ steer: (left ? 1 : 0) - (right ? 1 : 0), boost });
  gameplay.tick(dt);
  engine.tick(dt);
  const state = gameplay.getState();
  playerVisual.position.set(state.x, state.y + state.jumpHeight, state.z);
  playerVisual.rotation.y = state.yaw;
  rendering.draw(state, cameraFrame(state, dt));
  statusNode.innerHTML = `${worldRecipe.name}<br>${state.status} · ${Math.floor(state.distance)}m / ${worldRecipe.runtime.goalDistance}m<br>${state.speed.toFixed(1)} m/s · ${state.region}<br><small>Nexus Foundation terrain · vegetation OFF · ${world.landforms.length} landforms</small>`;
  requestAnimationFrame(loop);
}

const initial = gameplay.getState();
rendering.draw(initial, cameraFrame(initial, 1 / 60));
const getState = () => ({
  game: gameplay.snapshot(), player: player.snapshot(), world: world.snapshot(), course: course.snapshot(),
  tick: engine.getLastTickCommit(), simulation: engine.n.simulation?.getCommittedFrame?.() ?? null,
  rendering: rendering.snapshot(), streamingReadiness: { foundationReady: true, rendererReady: true, vegetationRequired: false },
  treeFidelity: { disabled: true, packageCount: 0, counts: { near: 0, medium: 0, far: 0, horizon: 0 }, exactFrameAck: null },
  lushFoliage: { disabled: true, overflow: 0, nearCards: 0, mediumCards: 0 }, vegetation: { enabled: false }, assetStartup: null,
  versions: { nexus: "main" }
});
globalThis.PrehistoricRushHost = Object.freeze({ engine, course, world, player, gameplay, rendering, worldRecipe, getState });
requestAnimationFrame(loop);
