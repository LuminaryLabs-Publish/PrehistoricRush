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
  tablet: "./assets/menu/velociraptor-classification-tablet.webp"
});
const TRACK = Object.freeze({
  lanes: 4,
  innerRadius: 12,
  outerRadius: 22,
  zScale: 0.66,
  selectedLane: 1,
  startAngle: Math.PI / 2
});
const TRACK_LANE_WIDTH = (TRACK.outerRadius - TRACK.innerRadius) / TRACK.lanes;
const RUNNER_RADIUS = TRACK.innerRadius + TRACK_LANE_WIDTH * (TRACK.selectedLane + 0.5);
const PLATFORM_TOP_Y = 0.075;
const validationStartsOffTrack = new URLSearchParams(globalThis.location.search).get("offtrack") === "1";
let selectedWorldId = resolvePrehistoricRushWorldId(globalThis.location);
let activeProfile = loadPlayerCharacterProfile();
let previewTransition = null;
let previewRuntime = null;
let disposeShowcase = () => {};

Object.assign(document.body.style, {
  margin: "0",
  minHeight: "100vh",
  overflow: "hidden",
  background: "#07100b",
  color: "#fff5d5",
  fontFamily: "Inter,ui-sans-serif,system-ui,sans-serif"
});

root.innerHTML = `
<style>
*{box-sizing:border-box}button,a{font:inherit}.menu-shell{position:fixed;inset:0;isolation:isolate;overflow:hidden;background:#07100b}.scene{position:absolute;inset:0;z-index:0}.scene canvas{display:block;width:100%;height:100%}.shade{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,#02070475 0%,transparent 23%,transparent 62%,#020704a8 100%),linear-gradient(90deg,#0207048c 0%,transparent 24%,transparent 76%,#02070459 100%)}.topbar{position:absolute;z-index:3;left:clamp(18px,3vw,48px);right:clamp(18px,3vw,48px);top:clamp(18px,3vw,42px);display:flex;align-items:flex-start;justify-content:space-between;gap:16px;pointer-events:none}.brand{margin:0;color:#fff1ca;font-size:clamp(34px,5vw,76px);font-weight:1000;letter-spacing:-.07em;line-height:.79;text-transform:uppercase;text-shadow:0 6px 24px #000d}.brand span{display:block;color:#e96c2c;text-shadow:0 5px 0 #723114,0 9px 26px #000d}.scene-status{padding:9px 12px;border:1px solid #f1dfac42;border-radius:999px;background:#07100bd1;color:#e7dfc5;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;backdrop-filter:blur(12px)}.controls{position:absolute;z-index:4;left:clamp(14px,2.5vw,38px);right:clamp(14px,2.5vw,38px);bottom:clamp(14px,2.5vw,32px);display:grid;grid-template-columns:minmax(240px,330px) minmax(310px,1fr) minmax(190px,300px);align-items:end;gap:clamp(10px,1.6vw,22px)}.panel{border:1px solid #f4dfaa38;background:#07100bd9;box-shadow:0 18px 45px #0009;backdrop-filter:blur(14px)}.character-panel{min-height:92px;padding:10px;display:grid;grid-template-columns:70px minmax(0,1fr) auto;gap:11px;align-items:center;border-radius:18px}.portrait{width:70px;height:70px;border-radius:12px;overflow:hidden;border:1px solid #d9bf7a61;background:#172118}.portrait img{width:100%;height:100%;object-fit:cover;object-position:50% 24%;transform:scale(1.15)}.character-copy{min-width:0}.character-copy strong,.character-copy span{display:block}.character-copy strong{font-size:14px;text-transform:uppercase}.character-copy span{margin-top:3px;color:#9eb394;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.customize{align-self:stretch;display:grid;place-items:center;padding:0 10px;border-radius:11px;background:#ffffff0b;color:#f3e7c5;text-decoration:none;font-size:11px;font-weight:900;text-transform:uppercase}.world-panel{min-height:74px;padding:11px 14px;border-radius:18px;text-align:center}.world-name{margin:0 0 7px;color:#fff0c7;font-size:14px;font-weight:950;letter-spacing:.08em;text-transform:uppercase}.world-buttons{display:flex;justify-content:center;gap:6px;overflow-x:auto;scrollbar-width:none}.world-buttons::-webkit-scrollbar{display:none}.world-button{flex:0 0 auto;border:1px solid #ffffff1e;border-radius:999px;padding:7px 10px;background:#ffffff0a;color:#b9c8b4;cursor:pointer;font-size:10px;font-weight:850}.world-button[aria-pressed="true"]{border-color:#dbbd70;background:#a57f2d35;color:#fff1c9}.start-race{min-height:76px;display:grid;place-items:center;padding:0 20px;border:2px solid #d4bd77;border-radius:20px;background:linear-gradient(180deg,#65b53f,#277b29);box-shadow:inset 0 0 0 4px #153e1c,0 18px 45px #0009;color:white;text-decoration:none;text-align:center;font-size:clamp(18px,2vw,28px);font-weight:1000;letter-spacing:.03em;text-transform:uppercase;text-shadow:0 3px 0 #17441c}.error{position:absolute;z-index:5;left:50%;top:50%;display:none;max-width:min(520px,calc(100vw - 32px));transform:translate(-50%,-50%);padding:14px 17px;border:1px solid #e9987970;border-radius:14px;background:#24120feb;color:#ffe0d0;font-size:13px;box-shadow:0 20px 60px #000b}.error[data-visible="true"]{display:block}@media(max-width:880px){.controls{grid-template-columns:minmax(220px,1fr) minmax(170px,.7fr)}.world-panel{grid-column:1/-1;grid-row:1}.character-panel{grid-column:1;grid-row:2}.start-race{grid-column:2;grid-row:2}.brand{font-size:clamp(32px,8vw,58px)}}@media(max-width:580px){.topbar{top:14px;left:14px;right:14px}.brand{font-size:34px}.scene-status{font-size:9px;padding:7px 9px}.controls{left:10px;right:10px;bottom:10px;grid-template-columns:1fr 142px;gap:8px}.world-panel{min-height:58px;padding:8px 9px}.world-name{margin-bottom:4px;font-size:11px}.world-button{padding:5px 7px;font-size:9px}.character-panel{min-height:70px;padding:7px;grid-template-columns:54px minmax(0,1fr)}.portrait{width:54px;height:54px}.character-copy strong{font-size:11px}.customize{display:none}.start-race{min-height:68px;border-radius:16px;font-size:17px;padding:0 10px}}
</style>
<main class="menu-shell" aria-label="Prehistoric Rush main menu">
  <div id="menu-scene" class="scene" aria-label="Animated prehistoric oval racing circuit"></div>
  <div class="shade"></div>
  <header class="topbar">
    <h1 class="brand">Prehistoric<span>Rush</span></h1>
    <div id="scene-status" class="scene-status">Building circuit</div>
  </header>
  <footer class="controls">
    <section class="panel character-panel" aria-label="Selected character">
      <div class="portrait"><img src="${CHARACTER.tablet}" alt="${CHARACTER.name}"></div>
      <div class="character-copy"><strong>${CHARACTER.name}</strong><span>${CHARACTER.className}</span></div>
      <a class="customize" href="./charactercreator.html">Customize</a>
    </section>
    <section class="panel world-panel" aria-label="Select race world">
      <p id="world-name" class="world-name">Jurassic Circuit</p>
      <div id="world-selector" class="world-buttons"></div>
    </section>
    <a id="start-run" class="start-race" href="./game.html">Start Race</a>
  </footer>
  <div id="menu-error" class="error" role="status">The live circuit could not start. Reload the page or continue to the race.</div>
</main>`;

const preview = document.querySelector("#menu-scene");
const sceneStatus = document.querySelector("#scene-status");
const menuError = document.querySelector("#menu-error");
const worldSelector = document.querySelector("#world-selector");
const worldName = document.querySelector("#world-name");
const startRun = document.querySelector("#start-run");

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

function seededRandom(seed) {
  let state = Math.abs(Number(seed) || 1) >>> 0;
  return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function disposeObject3D(group) {
  const geometries = new Set();
  const materials = new Set();
  group.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (Array.isArray(object.material)) object.material.forEach((material) => materials.add(material));
    else if (object.material) materials.add(object.material);
  });
  geometries.forEach((geometry) => geometry.dispose?.());
  materials.forEach((material) => material.dispose?.());
  group.clear();
}

function ellipsePoints(THREE, radius, y = 0, count = 128) {
  return Array.from({ length: count }, (_, index) => {
    const angle = index / count * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius * TRACK.zScale);
  });
}

function createEllipseTube(THREE, radius, tubeRadius, material, y = 0.04) {
  const curve = new THREE.CatmullRomCurve3(ellipsePoints(THREE, radius, y), true, "centripetal");
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 192, tubeRadius, 5, true), material);
}

function createTrackLane(THREE, innerRadius, outerRadius, color) {
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 192, 1);
  geometry.rotateX(-Math.PI / 2);
  geometry.scale(1, 1, TRACK.zScale);
  const lane = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0 }));
  lane.receiveShadow = true;
  return lane;
}

function createTree(THREE, group, materials, x, z, height, canopyScale = 1) {
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(height * 0.055, height * 0.085, height, 7), materials.trunk);
  trunk.position.set(x, height * 0.5, z);
  trunk.castShadow = true;
  group.add(trunk);
  for (let tier = 0; tier < 3; tier += 1) {
    const canopy = new THREE.Mesh(new THREE.DodecahedronGeometry((1.25 - tier * 0.16) * canopyScale, 0), materials.canopy);
    canopy.scale.set(1.25, 0.8, 1.1);
    canopy.position.set(x + (tier - 1) * 0.3, height * (0.72 + tier * 0.12), z + (tier % 2 ? 0.28 : -0.18));
    canopy.castShadow = true;
    group.add(canopy);
  }
}

function createShowcaseWorld(THREE, recipe) {
  const group = new THREE.Group();
  const random = seededRandom(recipe.seed);
  const terrainColor = new THREE.Color(...recipe.presentation.terrainColor);
  const dirtPalette = recipe.id === "desert-plains"
    ? [0xa9703f, 0xb77b46, 0xa36b3d, 0xb9844f]
    : [0x92552f, 0x9e6035, 0x8b4e2d, 0xa36639];
  const materials = {
    trunk: new THREE.MeshStandardMaterial({ color: 0x51331e, roughness: 1 }),
    canopy: new THREE.MeshStandardMaterial({ color: recipe.id === "desert-plains" ? 0x718642 : 0x39783a, roughness: 0.95 }),
    rock: new THREE.MeshStandardMaterial({ color: 0x62645d, roughness: 1 }),
    fern: new THREE.MeshStandardMaterial({ color: 0x4f8d43, roughness: 0.96, side: THREE.DoubleSide }),
    marker: new THREE.MeshStandardMaterial({ color: 0xd7c7a0, roughness: 1 })
  };

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(84, 62), new THREE.MeshStandardMaterial({ color: terrainColor, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.08;
  ground.receiveShadow = true;
  group.add(ground);

  const infieldGeometry = new THREE.CircleGeometry(TRACK.innerRadius - 0.35, 128);
  infieldGeometry.rotateX(-Math.PI / 2);
  infieldGeometry.scale(1, 1, TRACK.zScale);
  const infield = new THREE.Mesh(infieldGeometry, new THREE.MeshStandardMaterial({ color: terrainColor.clone().offsetHSL(0, 0.06, 0.035), roughness: 1 }));
  infield.position.y = -0.005;
  infield.receiveShadow = true;
  group.add(infield);

  for (let laneIndex = 0; laneIndex < TRACK.lanes; laneIndex += 1) {
    const inner = TRACK.innerRadius + laneIndex * TRACK_LANE_WIDTH;
    group.add(createTrackLane(THREE, inner, inner + TRACK_LANE_WIDTH, dirtPalette[laneIndex]));
  }

  for (let lineIndex = 0; lineIndex <= TRACK.lanes; lineIndex += 1) {
    const radius = TRACK.innerRadius + lineIndex * TRACK_LANE_WIDTH;
    const divider = createEllipseTube(THREE, radius, lineIndex === 0 || lineIndex === TRACK.lanes ? 0.12 : 0.075, materials.marker);
    divider.castShadow = true;
    group.add(divider);
  }

  for (let markerIndex = 0; markerIndex < 15; markerIndex += 1) {
    const radius = TRACK.innerRadius + markerIndex / 14 * (TRACK.outerRadius - TRACK.innerRadius);
    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.13, 0.5), materials.marker);
    marker.position.set(0, 0.08, radius * TRACK.zScale);
    marker.castShadow = marker.receiveShadow = true;
    group.add(marker);
  }

  for (let treeIndex = 0; treeIndex < 30; treeIndex += 1) {
    const angle = treeIndex / 30 * Math.PI * 2 + (random() - 0.5) * 0.12;
    const radius = TRACK.outerRadius + 4.5 + random() * 8;
    createTree(
      THREE,
      group,
      materials,
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * TRACK.zScale,
      4.5 + random() * 5,
      0.8 + random() * 0.65
    );
  }

  for (let itemIndex = 0; itemIndex < 32; itemIndex += 1) {
    const angle = random() * Math.PI * 2;
    const radius = Math.sqrt(random()) * (TRACK.innerRadius - 2.2);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius * TRACK.zScale;
    if (itemIndex % 4 === 0) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35 + random() * 0.8, 0), materials.rock);
      rock.scale.y = 0.55 + random() * 0.5;
      rock.position.set(x, 0.25, z);
      rock.rotation.set(random(), random(), random());
      rock.castShadow = true;
      group.add(rock);
    } else {
      const fern = new THREE.Mesh(new THREE.ConeGeometry(0.3 + random() * 0.32, 0.75 + random() * 0.8, 5), materials.fern);
      fern.position.set(x, 0.35, z);
      fern.rotation.z = (random() - 0.5) * 0.25;
      group.add(fern);
    }
  }

  for (const side of [-1, 1]) {
    const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(5.5, 1), materials.rock);
    cliff.scale.set(1.4, 1.8, 1.1);
    cliff.position.set(side * 28, 6.2, -18);
    cliff.rotation.y = side * 0.35;
    cliff.castShadow = true;
    group.add(cliff);
  }

  return group;
}

function applyRecipePresentation(THREE, scene, renderer, recipe) {
  const atmosphere = recipe.presentation.atmosphere;
  scene.background = new THREE.Color(atmosphere.fogColor).offsetHSL(0.02, 0.08, 0.08);
  scene.fog = new THREE.FogExp2(atmosphere.fogColor, Math.max(0.006, atmosphere.fogDensity * 1.7));
  renderer.toneMappingExposure = clamp(atmosphere.exposure, 0.98, 1.22);
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
      url.searchParams.delete("offtrack");
      globalThis.history?.replaceState?.({}, "", url);
      renderWorldSelection();
      previewRuntime?.setWorld(recipe);
    });
    worldSelector.append(button);
  }
  const recipe = getPrehistoricRushWorldRecipe(selectedWorldId);
  startRun.href = `./game.html?world=${encodeURIComponent(recipe.id)}`;
  worldName.textContent = `${recipe.name} Circuit`;
}

async function startShowcase() {
  const [NexusEngine, SeedModule, CreatureModule, THREE] = await Promise.all([
    import(RUNTIME_URLS.nexus),
    import(RUNTIME_URLS.seedKit),
    import(RUNTIME_URLS.creatureKit),
    import(RUNTIME_URLS.three)
  ]);
  const required = [
    NexusEngine?.createRealtimeGame,
    NexusEngine?.createCoreCreatureDomain,
    NexusEngine?.createCoreCharacterDomain,
    NexusEngine?.createCoreMotionDomain,
    SeedModule?.createSeedKit,
    CreatureModule?.createProceduralCreatureBodyKit,
    THREE?.WebGLRenderer
  ];
  if (required.some((entry) => typeof entry !== "function")) throw new Error("Menu character modules did not load.");

  const engine = NexusEngine.createRealtimeGame({ kits: [
    ...NexusEngine.createCoreCreatureDomain(),
    ...NexusEngine.createCoreCharacterDomain(),
    ...NexusEngine.createCoreMotionDomain(),
    SeedModule.createSeedKit({ seed: activeProfile.creature.seed }),
    CreatureModule.createProceduralCreatureBodyKit({ creatures: [activeProfile.creature] })
  ] });
  const creatureApi = engine.n.proceduralCreatureBody;
  if (!creatureApi) throw new Error("Procedural character service did not install.");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.08, 180);
  camera.position.set(33, 30, 37);
  camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  preview.replaceChildren(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xfff0c7, 0x152515, 2.7));
  const sun = new THREE.DirectionalLight(0xffcc7b, 4.6);
  sun.position.set(18, 35, 16);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1536, 1536);
  sun.shadow.camera.left = sun.shadow.camera.bottom = -38;
  sun.shadow.camera.right = sun.shadow.camera.top = 38;
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x94c7ff, 1.1);
  rim.position.set(-22, 15, -20);
  scene.add(rim);

  let worldGroup = createShowcaseWorld(THREE, getPrehistoricRushWorldRecipe(selectedWorldId));
  scene.add(worldGroup);
  applyRecipePresentation(THREE, scene, renderer, getPrehistoricRushWorldRecipe(selectedWorldId));

  previewTransition = createCharacterPreviewTransition({
    THREE,
    scene,
    engine,
    creatureApi,
    initialProfile: activeProfile,
    platformTopY: PLATFORM_TOP_Y,
    morphSharpness: 8,
    poseSharpness: 17,
    placementSharpness: 14
  });

  const runner = {
    x: 0,
    z: RUNNER_RADIUS * TRACK.zScale,
    yaw: Math.PI / 2,
    speed: 7.4,
    laps: 0,
    lastAngle: TRACK.startAngle,
    wasOffTrack: false,
    recovered: false
  };

  function resetRunner(offTrack = false) {
    const radius = offTrack ? TRACK.outerRadius + 7 : RUNNER_RADIUS;
    runner.x = 0;
    runner.z = radius * TRACK.zScale;
    runner.yaw = Math.PI / 2;
    runner.laps = 0;
    runner.lastAngle = TRACK.startAngle;
    runner.wasOffTrack = offTrack;
    runner.recovered = false;
  }

  function shortestAngleDifference(target, current) {
    return Math.atan2(Math.sin(target - current), Math.cos(target - current));
  }

  function updateRunner(dt) {
    const normalizedZ = runner.z / TRACK.zScale;
    const radius = Math.hypot(runner.x, normalizedZ);
    const angle = Math.atan2(normalizedZ, runner.x);
    const targetX = Math.cos(angle) * RUNNER_RADIUS;
    const targetZ = Math.sin(angle) * RUNNER_RADIUS * TRACK.zScale;
    let tangentX = Math.sin(angle);
    let tangentZ = -Math.cos(angle) * TRACK.zScale;
    const tangentLength = Math.hypot(tangentX, tangentZ) || 1;
    tangentX /= tangentLength;
    tangentZ /= tangentLength;

    const laneError = Math.abs(radius - RUNNER_RADIUS);
    const outsideTrack = radius < TRACK.innerRadius || radius > TRACK.outerRadius;
    const correctionStrength = outsideTrack
      ? clamp(1.5 + laneError * 0.24, 1.5, 3.8)
      : clamp((laneError - 0.35) / TRACK_LANE_WIDTH, 0, 1.15);
    const returnX = targetX - runner.x;
    const returnZ = targetZ - runner.z;
    const returnLength = Math.hypot(returnX, returnZ) || 1;
    const desiredX = tangentX + returnX / returnLength * correctionStrength;
    const desiredZ = tangentZ + returnZ / returnLength * correctionStrength;
    const desiredYaw = Math.atan2(desiredX, desiredZ);
    const turnSharpness = outsideTrack ? 6.5 : 3.4;
    runner.yaw += shortestAngleDifference(desiredYaw, runner.yaw) * (1 - Math.exp(-turnSharpness * dt));
    runner.x += Math.sin(runner.yaw) * runner.speed * dt;
    runner.z += Math.cos(runner.yaw) * runner.speed * dt;

    const nextRadius = Math.hypot(runner.x, runner.z / TRACK.zScale);
    const nextOutsideTrack = nextRadius < TRACK.innerRadius || nextRadius > TRACK.outerRadius;
    if (nextOutsideTrack) runner.wasOffTrack = true;
    if (runner.wasOffTrack && !nextOutsideTrack && Math.abs(nextRadius - RUNNER_RADIUS) < TRACK_LANE_WIDTH) runner.recovered = true;
    if (!Number.isFinite(runner.x) || !Number.isFinite(runner.z) || nextRadius > TRACK.outerRadius + 28) resetRunner(false);

    if (runner.lastAngle < -2.5 && angle > 2.5) runner.laps += 1;
    runner.lastAngle = angle;
    document.body.dataset.menuRunnerX = runner.x.toFixed(3);
    document.body.dataset.menuRunnerZ = runner.z.toFixed(3);
    document.body.dataset.menuRunnerYaw = runner.yaw.toFixed(3);
    document.body.dataset.menuRunnerRegion = nextOutsideTrack ? "off-track" : "track";
    document.body.dataset.menuRunnerRecovered = String(runner.recovered);
    document.body.dataset.menuLaps = String(runner.laps);
  }

  resetRunner(validationStartsOffTrack);

  const resize = () => {
    const width = Math.max(1, preview.clientWidth);
    const height = Math.max(1, preview.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.fov = width < 700 ? 58 : 46;
    camera.position.set(width < 700 ? 35 : 33, width < 700 ? 34 : 30, width < 700 ? 41 : 37);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(preview);
  resize();

  let running = true;
  let last = performance.now();
  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    updateRunner(dt);
    const mesh = previewTransition.getMesh();
    if (mesh) {
      mesh.position.x = runner.x;
      mesh.position.z = runner.z;
    }
    previewTransition.update(dt, {
      speed: runner.speed,
      time: now / 1000,
      turn: clamp(shortestAngleDifference(runner.yaw, mesh?.rotation?.y ?? runner.yaw), -0.4, 0.4),
      jump: 0,
      resistance: document.body.dataset.menuRunnerRegion === "off-track" ? 0.18 : 0
    }, runner.yaw);
    renderer.render(scene, camera);
    sceneStatus.textContent = "Live circuit";
    document.body.dataset.menuStatus = "ready";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  previewRuntime = {
    setWorld(recipe) {
      scene.remove(worldGroup);
      disposeObject3D(worldGroup);
      worldGroup = createShowcaseWorld(THREE, recipe);
      scene.add(worldGroup);
      applyRecipePresentation(THREE, scene, renderer, recipe);
      resetRunner(false);
    },
    setProfile(profile) {
      previewTransition?.setTargetProfile(profile);
    }
  };

  disposeShowcase = () => {
    running = false;
    observer.disconnect();
    previewTransition?.dispose();
    previewTransition = null;
    scene.remove(worldGroup);
    disposeObject3D(worldGroup);
    renderer.dispose();
    previewRuntime = null;
  };
}

renderWorldSelection();
subscribePlayerCharacterProfile(({ profile }) => {
  activeProfile = profile;
  previewRuntime?.setProfile(profile);
});
startShowcase().catch((error) => {
  console.error(error);
  sceneStatus.textContent = "Circuit load failed";
  document.body.dataset.menuStatus = "error";
  preview.replaceChildren();
  menuError.dataset.visible = "true";
});
addEventListener("beforeunload", () => disposeShowcase(), { once: true });
