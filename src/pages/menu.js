import { loadPlayerCharacterProfile, subscribePlayerCharacterProfile } from "../shared/player-character-store.js";
import { RUNTIME_URLS } from "../shared/runtime-versions.js";
import { createCharacterPreviewTransition } from "../character-creator/character-preview-transition.js";
import {
  PREHISTORIC_WORLD_RECIPES,
  getPrehistoricRushWorldRecipe,
  resolvePrehistoricRushWorldId
} from "../domains/prehistoric-rush/world-recipes.js";

const root = document.querySelector("#app") ?? document.body;
const CHARACTER = Object.freeze({
  name: "Velociraptor",
  className: "Speed / Traversal",
  special: "Swing",
  tablet: "./assets/menu/velociraptor-classification-tablet.webp"
});
const FOREST_REFERENCE = "./assets/menu/prehistoric-forest-reference.webp";
const PLATFORM_TOP_Y = 0.035;
let selectedWorldId = resolvePrehistoricRushWorldId(globalThis.location);
let activeProfile = loadPlayerCharacterProfile();
let previewTransition = null;
let previewRuntime = null;
let disposeShowcase = () => {};

Object.assign(document.body.style, {
  margin: "0",
  minHeight: "100vh",
  background: "#07100b",
  color: "#fff5d5",
  fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif"
});

root.innerHTML = `
<style>
*{box-sizing:border-box}body{overflow-x:hidden}.shell{min-height:100vh;padding:clamp(18px,2.4vw,34px);display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:18px;position:relative;isolation:isolate;overflow:hidden}.shell:before{content:"";position:absolute;inset:0;z-index:-2;background:linear-gradient(90deg,#06110bf2 0%,#07120ba8 34%,#07120b22 72%),url("${FOREST_REFERENCE}") center/cover no-repeat;filter:saturate(1.08) brightness(.8);transform:scale(1.015)}.shell:after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(180deg,#0002 0%,transparent 32%,#06100bc7 100%);pointer-events:none}.header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.eyebrow{margin:0 0 4px;color:#83c66b;font-size:12px;font-weight:950;letter-spacing:.18em;text-transform:uppercase}.title{margin:0;font-size:clamp(34px,5vw,68px);line-height:.86;letter-spacing:-.055em;text-transform:uppercase;text-shadow:0 5px 22px #000b}.status{padding:9px 12px;border-radius:999px;background:#06110bd9;border:1px solid #ffffff24;color:#c9d9c4;font-size:12px;font-weight:800;white-space:nowrap}.layout{min-height:0;display:grid;grid-template-columns:minmax(250px,32%) minmax(0,1fr);gap:clamp(18px,2.6vw,38px);align-items:stretch}.tablet-col{min-height:0;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:10px}.tablet-wrap{min-height:0;display:grid;place-items:center;padding:8px 0}.tablet{display:block;width:auto;max-width:100%;height:min(68vh,690px);max-height:100%;object-fit:contain;filter:drop-shadow(0 28px 36px #000a)}.pager{display:flex;align-items:center;justify-content:center;gap:10px;color:#b9cbb5;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.pager button{width:36px;height:36px;border-radius:50%;border:1px solid #ffffff2b;background:#0c1a11cc;color:#d9e7d4;font-size:18px}.pager button:disabled{opacity:.35}.preview-stage{position:relative;min-height:520px;border-radius:30px;overflow:hidden;border:1px solid #ffffff24;background:linear-gradient(180deg,#0000000d,#07100b63),url("${FOREST_REFERENCE}") center/cover no-repeat;box-shadow:0 30px 70px #0008,inset 0 0 100px #02090566}.preview-stage:after{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;box-shadow:inset 0 0 95px #02090570}.preview{position:absolute;inset:0;z-index:1}.preview canvas{display:block;width:100%;height:100%}.preview-head{position:absolute;top:18px;left:18px;right:18px;z-index:4;display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.character-tag,.world-tag{padding:10px 12px;border-radius:14px;background:#06110bd8;border:1px solid #ffffff1f;backdrop-filter:blur(10px)}.character-tag strong,.world-tag strong{display:block;font-size:13px}.character-tag span,.world-tag span{display:block;margin-top:2px;color:#a9c0a2;font-size:11px}.ability{position:absolute;right:18px;bottom:18px;z-index:4;padding:10px 14px;border-radius:999px;background:#355d36e6;border:1px solid #9bce80aa;box-shadow:0 10px 30px #0008;font-weight:950;text-transform:uppercase;letter-spacing:.08em}.footer{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:end}.worlds{min-width:0;padding:12px 14px;border-radius:18px;background:#06110bcf;border:1px solid #ffffff18;backdrop-filter:blur(12px)}.worlds-title{margin:0 0 8px;color:#95be88;font-size:11px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.world-buttons{display:flex;flex-wrap:wrap;gap:7px}.world-button{border:1px solid #ffffff1e;border-radius:999px;padding:8px 10px;background:#ffffff0a;color:#d3dfce;font:800 12px system-ui;cursor:pointer}.world-button[aria-pressed="true"]{border-color:#a7d58d;background:#6b9e502b;color:#e9f5df}.world-detail{margin-top:7px;color:#9fae9b;font-size:11px;line-height:1.35}.actions{display:flex;gap:9px;align-items:center;justify-content:flex-end;flex-wrap:wrap}.action{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 17px;border-radius:999px;text-decoration:none;font-weight:950;white-space:nowrap}.action.secondary{background:#1e3825db;color:#e9f5e4;border:1px solid #7daf6780}.action.primary{background:#f3cb77;color:#241903;box-shadow:0 11px 28px #0007}.live-error{position:absolute;inset:auto 18px 18px 18px;z-index:5;display:none;padding:10px 12px;border-radius:12px;background:#2a1512db;border:1px solid #e9987970;color:#ffd9ca;font-size:12px}@media(max-width:860px){.shell{grid-template-rows:auto auto auto}.layout{grid-template-columns:1fr;}.tablet-col{grid-template-columns:minmax(0,210px) 1fr;grid-template-rows:1fr;align-items:center}.tablet{height:auto;max-height:330px}.pager{justify-content:flex-start}.preview-stage{min-height:480px}.footer{grid-template-columns:1fr}.actions{justify-content:stretch}.action{flex:1}}@media(max-width:560px){.header{align-items:flex-start}.status{display:none}.tablet-col{grid-template-columns:1fr}.tablet{max-height:300px}.pager{justify-content:center}.preview-stage{min-height:430px;border-radius:22px}.footer{gap:10px}.worlds{padding:10px}.action{width:100%;flex-basis:100%}}
</style>
<main class="shell">
  <header class="header">
    <div><p class="eyebrow">Character Select</p><h1 class="title">Prehistoric<br>Rush</h1></div>
    <div id="preview-status" class="status">Preparing live preview…</div>
  </header>
  <section class="layout">
    <aside class="tablet-col" aria-label="${CHARACTER.name} classification tablet">
      <div class="tablet-wrap"><img class="tablet" src="${CHARACTER.tablet}" alt="${CHARACTER.name} classification tablet"></div>
      <div class="pager"><button disabled aria-label="Previous character">‹</button><span>01 / 01 · ${CHARACTER.name}</span><button disabled aria-label="Next character">›</button></div>
    </aside>
    <section id="preview-stage" class="preview-stage" aria-label="Live ${CHARACTER.name} procedural track preview">
      <div id="character-preview" class="preview"></div>
      <div class="preview-head"><div class="character-tag"><strong>${CHARACTER.name}</strong><span>${CHARACTER.className}</span></div><div class="world-tag"><strong id="preview-world-name">Jurassic Valley</strong><span>Procedural preview track</span></div></div>
      <div class="ability">${CHARACTER.special}</div>
      <div id="live-error" class="live-error">Live 3D preview unavailable. The selected race world is still available below.</div>
    </section>
  </section>
  <footer class="footer">
    <section class="worlds" aria-labelledby="worlds-title"><p id="worlds-title" class="worlds-title">Preview / Race World</p><div id="world-selector" class="world-buttons"></div><div id="world-detail" class="world-detail"></div></section>
    <nav class="actions" aria-label="Character actions"><a class="action secondary" href="./charactercreator.html">Customize</a><a id="start-run" class="action primary" href="./game.html">Race as ${CHARACTER.name}</a></nav>
  </footer>
</main>`;

const preview = document.querySelector("#character-preview");
const previewStatus = document.querySelector("#preview-status");
const previewWorldName = document.querySelector("#preview-world-name");
const liveError = document.querySelector("#live-error");
const worldSelector = document.querySelector("#world-selector");
const worldDetail = document.querySelector("#world-detail");
const startRun = document.querySelector("#start-run");

const setPreviewStatus = (text, error = false) => {
  previewStatus.textContent = text;
  previewStatus.style.borderColor = error ? "#e9987970" : "#ffffff24";
};

function seededRandom(seed) {
  let state = Math.abs(Number(seed) || 1) >>> 0;
  return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function disposeObject3D(group) {
  group.traverse((object) => {
    object.geometry?.dispose?.();
    if (Array.isArray(object.material)) object.material.forEach((material) => material?.dispose?.());
    else object.material?.dispose?.();
  });
  group.clear();
}

function createTrackGeometry(THREE, recipe) {
  const segments = 28;
  const halfWidth = Math.max(2.5, Number(recipe.route.pathHalfWidth) * .9);
  const positions = [];
  const indices = [];
  for (let i = 0; i <= segments; i += 1) {
    const z = 9 - i * 1.05;
    const bend = Math.sin((i + recipe.seed % 11) * .23) * .72 + Math.sin(i * .08) * .42;
    positions.push(bend - halfWidth, 0, z, bend + halfWidth, 0, z);
    if (i < segments) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createShowcaseWorld(THREE, recipe) {
  const group = new THREE.Group();
  const random = seededRandom(recipe.seed);
  const terrainColor = new THREE.Color(...recipe.presentation.terrainColor);
  const trackColor = recipe.id === "desert-plains" ? 0xb8844e : 0x98683b;
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3922, roughness: 1 });
  const canopyMat = new THREE.MeshStandardMaterial({ color: 0x4f8d3d, roughness: .92 });
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x676d66, roughness: 1 });
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x4e8c41, roughness: .95, side: THREE.DoubleSide });
  const vineMat = new THREE.MeshStandardMaterial({ color: 0x527f42, roughness: .9 });

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(34, 38), new THREE.MeshStandardMaterial({ color: terrainColor, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -.04, -7);
  ground.receiveShadow = true;
  group.add(ground);

  const track = new THREE.Mesh(createTrackGeometry(THREE, recipe), new THREE.MeshStandardMaterial({ color: trackColor, roughness: .96 }));
  track.position.y = -.005;
  track.receiveShadow = true;
  group.add(track);

  for (let i = 0, count = Math.round(14 + recipe.ecology.canopy * 18); i < count; i += 1) {
    const side = i % 2 ? 1 : -1;
    const z = 7 - random() * 30;
    const x = side * (4.2 + random() * 7.3);
    const height = 4.2 + random() * 4.8;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.3 + random() * .2, .45 + random() * .3, height, 7), trunkMat);
    trunk.position.set(x, height * .5, z);
    trunk.castShadow = true;
    group.add(trunk);
    const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry(1.25 + random(), 0), canopyMat);
    canopy.scale.set(1 + random() * .35, 1.1 + random() * .55, 1 + random() * .35);
    canopy.position.set(x + (random() - .5) * .5, height + .35, z + (random() - .5) * .5);
    canopy.castShadow = true;
    group.add(canopy);
  }

  for (let i = 0, count = 8 + Math.round(recipe.terrain.roughness * 12); i < count; i += 1) {
    const side = random() < .5 ? -1 : 1;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.3 + random() * .55, 0), rockMat);
    rock.scale.y = .55 + random() * .5;
    rock.position.set(side * (3.7 + random() * 7.4), .25, 7 - random() * 29);
    rock.rotation.set(random(), random(), random());
    rock.castShadow = rock.receiveShadow = true;
    group.add(rock);
  }

  for (let i = 0, count = 18 + Math.round(recipe.ecology.groundCover * 34); i < count; i += 1) {
    const side = random() < .5 ? -1 : 1;
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(.34 + random() * .28, .8 + random() * .55, 5), foliageMat);
    leaf.position.set(side * (3.5 + random() * 7.8), .3, 7 - random() * 29);
    leaf.rotation.z = (random() - .5) * .35;
    group.add(leaf);
  }

  for (const [x, z] of [[-1.8, -5.5], [1.6, -11]]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x - 2.6, 5.5, z - .5), new THREE.Vector3(x - 1.1, 4.1, z),
      new THREE.Vector3(x, 2.8, z + .25), new THREE.Vector3(x + 1.15, 4.15, z),
      new THREE.Vector3(x + 2.5, 5.45, z - .5)
    ]);
    const vine = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, .055, 6, false), vineMat);
    vine.castShadow = true;
    group.add(vine);
  }
  return group;
}

function applyRecipePresentation(THREE, scene, renderer, recipe) {
  const a = recipe.presentation.atmosphere;
  scene.fog = new THREE.FogExp2(a.fogColor, Math.max(.018, a.fogDensity * 4));
  renderer.toneMappingExposure = Math.max(.95, Math.min(1.2, a.exposure));
}

function renderWorldSelection() {
  worldSelector.replaceChildren();
  for (const recipe of PREHISTORIC_WORLD_RECIPES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "world-button";
    button.setAttribute("aria-pressed", String(recipe.id === selectedWorldId));
    button.textContent = recipe.name;
    button.addEventListener("click", () => {
      selectedWorldId = recipe.id;
      const url = new URL(globalThis.location.href);
      url.searchParams.set("world", selectedWorldId);
      globalThis.history?.replaceState?.({}, "", url);
      renderWorldSelection();
      previewRuntime?.setWorld(recipe);
    });
    worldSelector.append(button);
  }
  const recipe = getPrehistoricRushWorldRecipe(selectedWorldId);
  startRun.href = `./game.html?world=${encodeURIComponent(recipe.id)}`;
  previewWorldName.textContent = recipe.name;
  worldDetail.textContent = `${recipe.description} · Seed ${recipe.seed}`;
}

async function startShowcase() {
  const [NexusEngine, SeedModule, CreatureModule, THREE] = await Promise.all([
    import(RUNTIME_URLS.nexus), import(RUNTIME_URLS.seedKit), import(RUNTIME_URLS.creatureKit), import(RUNTIME_URLS.three)
  ]);
  const required = [NexusEngine?.createRealtimeGame, NexusEngine?.createCoreCreatureDomain, NexusEngine?.createCoreCharacterDomain, NexusEngine?.createCoreMotionDomain, SeedModule?.createSeedKit, CreatureModule?.createProceduralCreatureBodyKit, THREE?.WebGLRenderer];
  if (required.some((entry) => typeof entry !== "function")) throw new Error("Character preview modules did not load.");

  const engine = NexusEngine.createRealtimeGame({ kits: [
    ...NexusEngine.createCoreCreatureDomain(), ...NexusEngine.createCoreCharacterDomain(), ...NexusEngine.createCoreMotionDomain(),
    SeedModule.createSeedKit({ seed: activeProfile.creature.seed }), CreatureModule.createProceduralCreatureBodyKit({ creatures: [activeProfile.creature] })
  ]});
  const creatureApi = engine.n.proceduralCreatureBody;
  if (!creatureApi) throw new Error("Procedural creature preview did not install.");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(43, 1, .03, 80);
  camera.position.set(5.1, 3.2, 8.6);
  camera.lookAt(0, 1.25, -1.5);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0x000000, 0);
  preview.replaceChildren(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xd9f0ce, 0x223422, 2.5));
  const sun = new THREE.DirectionalLight(0xffdda0, 4);
  sun.position.set(5, 9, 4); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); scene.add(sun);
  const rim = new THREE.DirectionalLight(0x8fc5ff, 1.2); rim.position.set(-7, 5, -5); scene.add(rim);

  let worldGroup = createShowcaseWorld(THREE, getPrehistoricRushWorldRecipe(selectedWorldId));
  scene.add(worldGroup);
  applyRecipePresentation(THREE, scene, renderer, getPrehistoricRushWorldRecipe(selectedWorldId));
  previewTransition = createCharacterPreviewTransition({ THREE, scene, engine, creatureApi, initialProfile: activeProfile, platformTopY: PLATFORM_TOP_Y, morphSharpness: 8, poseSharpness: 17, placementSharpness: 12 });

  const resize = () => {
    const width = Math.max(1, preview.clientWidth), height = Math.max(1, preview.clientHeight);
    renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize); observer.observe(preview); resize();

  let running = true, last = performance.now();
  function frame(now) {
    if (!running) return;
    const dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now;
    const time = now / 1000;
    previewTransition.update(dt, { speed: 8.2, time, turn: Math.sin(time * .85) * .045, jump: 0, resistance: 0 }, -.42 + Math.sin(time * .23) * .025);
    const mesh = previewTransition.getMesh();
    if (mesh) { mesh.position.x = .55; mesh.position.z = 1.35 + Math.sin(time * .7) * .08; }
    renderer.render(scene, camera);
    setPreviewStatus("Live character preview");
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  previewRuntime = {
    setWorld(recipe) { scene.remove(worldGroup); disposeObject3D(worldGroup); worldGroup = createShowcaseWorld(THREE, recipe); scene.add(worldGroup); applyRecipePresentation(THREE, scene, renderer, recipe); },
    setProfile(profile) { previewTransition?.setTargetProfile(profile); }
  };
  disposeShowcase = () => { running = false; observer.disconnect(); previewTransition?.dispose(); previewTransition = null; scene.remove(worldGroup); disposeObject3D(worldGroup); renderer.dispose(); previewRuntime = null; };
}

renderWorldSelection();
subscribePlayerCharacterProfile(({ profile }) => { activeProfile = profile; previewRuntime?.setProfile(profile); });
startShowcase().catch((error) => { console.error(error); setPreviewStatus("3D preview unavailable", true); preview.replaceChildren(); liveError.style.display = "block"; });
addEventListener("beforeunload", () => disposeShowcase(), { once: true });
