import {
  loadPlayerCharacterProfile,
  patchPlayerCharacterProfile,
  resetPlayerCharacterProfile,
  subscribePlayerCharacterProfile
} from "../shared/player-character-store.js";
import { RUNTIME_URLS } from "../shared/runtime-versions.js";
import { createCharacterPreviewTransition } from "../character-creator/character-preview-transition.js";

const PLATFORM_CENTER_Y = -0.25;
const PLATFORM_HEIGHT = 0.22;
const PLATFORM_TOP_Y = PLATFORM_CENTER_Y + PLATFORM_HEIGHT * 0.5;
const REFERENCE_CHARACTER_HEIGHT = 1.4;
const root = document.querySelector("#app") ?? document.body;
let draft = loadPlayerCharacterProfile();
let saveTimer = 0;
let previewTransition = null;
let disposeShowcase = () => {};

Object.assign(document.body.style, {
  margin: "0",
  minHeight: "100vh",
  background: "linear-gradient(180deg,#102d1d 0,#07150d 72%)",
  color: "#fff3c8",
  fontFamily: "system-ui,sans-serif"
});

root.innerHTML = `
  <style>
    * { box-sizing: border-box; }
    .creator-shell { width:min(920px,100%); margin:0 auto; padding:22px 18px 40px; }
    .creator-header { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; margin-bottom:16px; }
    .eyebrow { margin:0 0 4px; color:#8fd487; font-size:12px; font-weight:900; letter-spacing:.13em; text-transform:uppercase; }
    h1 { margin:0; font-size:clamp(34px,6vw,58px); line-height:.95; letter-spacing:-.045em; }
    .tagline { margin:8px 0 0; color:#bfd0bb; font-size:15px; }
    .nav { display:flex; gap:8px; flex-wrap:wrap; }
    .button { display:inline-flex; align-items:center; justify-content:center; min-height:42px; padding:0 16px; border-radius:999px; color:#fff3c8; text-decoration:none; font-weight:850; background:#ffffff14; }
    .button.primary { background:#ffd37a; color:#241803; }
    .creator-card { padding:14px; border:1px solid #ffffff14; border-radius:26px; background:#06110bdd; box-shadow:0 28px 70px #0007; }
    .preview-head { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:2px 4px 12px; }
    .preview-head h2 { margin:0; font-size:18px; }
    .status { color:#9ec79b; font-size:12px; font-weight:750; }
    #preview { position:relative; width:100%; height:clamp(360px,54vh,520px); overflow:hidden; border-radius:20px; background:radial-gradient(circle at 50% 30%,#294b34,#0b1710 72%); }
    #preview canvas { display:block; width:100%; height:100%; }
    .settings { margin-top:14px; padding:18px; border-radius:20px; background:#ffffff08; border:1px solid #ffffff0f; }
    .settings-title { margin:0 0 14px; font-size:18px; }
    .controls { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px 22px; }
    .control { display:grid; grid-template-columns:1fr auto; gap:7px 12px; align-items:center; }
    .control span { font-weight:750; }
    .control output { color:#a8d59d; font-size:13px; font-variant-numeric:tabular-nums; }
    .control input[type="range"] { grid-column:1/-1; width:100%; accent-color:#79bf68; }
    .colors { grid-column:1/-1; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
    .color-control { display:flex; align-items:center; justify-content:space-between; gap:12px; min-height:50px; padding:8px 10px 8px 14px; border-radius:14px; background:#0003; font-weight:750; }
    .color-control input { width:42px; height:34px; padding:0; border:0; border-radius:10px; background:none; cursor:pointer; }
    .actions { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:16px; }
    #reset-profile { border:0; border-radius:999px; padding:10px 15px; background:#ffffff12; color:#fff3c8; font-weight:800; cursor:pointer; }
    #reset-profile:hover { background:#ffffff1e; }
    @media (max-width:680px) {
      .creator-header { align-items:stretch; flex-direction:column; }
      .nav { width:100%; }
      .button { flex:1; }
      .controls { grid-template-columns:1fr; }
      .colors { grid-column:1; }
      #preview { height:390px; }
    }
  </style>
  <main class="creator-shell">
    <header class="creator-header">
      <div>
        <p class="eyebrow">Prehistoric Rush</p>
        <h1>Raptor Creator</h1>
        <p class="tagline">Shape. Color. Play.</p>
      </div>
      <nav class="nav" aria-label="Creator navigation">
        <a class="button" href="./menu.html">Menu</a>
        <a class="button primary" href="./game.html">Play</a>
      </nav>
    </header>
    <section class="creator-card">
      <div class="preview-head">
        <h2>Preview</h2>
        <span id="preview-status" class="status">Loading</span>
      </div>
      <div id="preview" aria-label="Live procedural raptor preview"></div>
      <section class="settings">
        <h2 class="settings-title">Customize</h2>
        <div id="controls" class="controls"></div>
        <div class="actions">
          <span id="save-status" class="status">Saved</span>
          <button id="reset-profile" type="button">Reset</button>
        </div>
      </section>
    </section>
  </main>
`;

const controls = document.querySelector("#controls");
const preview = document.querySelector("#preview");
const previewStatus = document.querySelector("#preview-status");
const saveStatus = document.querySelector("#save-status");
const definitions = [
  ["Size", "proportions", "bodyScale", 0.55, 1.35, 0.01],
  ["Body", "proportions", "bodyLength", 0.85, 2.2, 0.01],
  ["Tail", "proportions", "tailLength", 0.8, 3.2, 0.01],
  ["Legs", "proportions", "legLength", 0.45, 1.35, 0.01]
];

function controlMarkup() {
  const sliders = definitions.map(([label, group, key, min, max, step]) => `
    <label class="control">
      <span>${label}</span>
      <output data-output="${group}.${key}"></output>
      <input data-group="${group}" data-key="${key}" type="range" min="${min}" max="${max}" step="${step}">
    </label>
  `).join("");
  return `
    ${sliders}
    <div class="colors">
      <label class="color-control">Skin<input data-color="skin" type="color"></label>
      <label class="color-control">Belly<input data-color="underbelly" type="color"></label>
    </div>
  `;
}

controls.innerHTML = controlMarkup();

function readValue(group, key) {
  return draft.creature.preset[group][key];
}

function renderControls() {
  const preset = draft.creature.preset;
  for (const input of controls.querySelectorAll("input[data-group]")) {
    const value = readValue(input.dataset.group, input.dataset.key);
    input.value = String(value);
    const output = controls.querySelector(`[data-output="${input.dataset.group}.${input.dataset.key}"]`);
    if (output) output.textContent = Number(value).toFixed(2);
  }
  for (const input of controls.querySelectorAll("input[data-color]")) input.value = preset.material[input.dataset.color];
}

function updateDraft(patch) {
  draft = {
    ...draft,
    creature: {
      ...draft.creature,
      preset: { ...draft.creature.preset, ...patch }
    }
  };
  renderControls();
  previewTransition?.setTargetProfile(draft);
  saveStatus.textContent = "Saving";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    draft = patchPlayerCharacterProfile({ creature: { preset: patch } });
    previewTransition?.setTargetProfile(draft);
    saveStatus.textContent = "Saved";
    renderControls();
  }, 160);
}

controls.addEventListener("input", (event) => {
  const input = event.target;
  if (input.dataset.group && input.dataset.key) {
    updateDraft({
      [input.dataset.group]: {
        ...draft.creature.preset[input.dataset.group],
        [input.dataset.key]: Number(input.value)
      }
    });
  } else if (input.dataset.color) {
    updateDraft({
      material: {
        ...draft.creature.preset.material,
        [input.dataset.color]: input.value
      }
    });
  }
});

document.querySelector("#reset-profile").addEventListener("click", () => {
  clearTimeout(saveTimer);
  draft = resetPlayerCharacterProfile();
  previewTransition?.setTargetProfile(draft);
  saveStatus.textContent = "Reset";
  renderControls();
});

subscribePlayerCharacterProfile(({ source, profile }) => {
  if (source === "local") return;
  draft = profile;
  previewTransition?.setTargetProfile(draft);
  saveStatus.textContent = "Updated";
  renderControls();
});

function stagedBounds(localBounds, mesh) {
  const minimum = localBounds.min.map((value, index) => value * [mesh.scale.x, mesh.scale.y, mesh.scale.z][index]);
  const maximum = localBounds.max.map((value, index) => value * [mesh.scale.x, mesh.scale.y, mesh.scale.z][index]);
  const centerX = (minimum[0] + maximum[0]) * 0.5 + mesh.position.x;
  const centerZ = (minimum[2] + maximum[2]) * 0.5 + mesh.position.z;
  const horizontalRadius = Math.hypot(maximum[0] - minimum[0], maximum[2] - minimum[2]) * 0.5;
  return {
    minimum: [centerX - horizontalRadius, Math.min(minimum[1], maximum[1]) + mesh.position.y, centerZ - horizontalRadius],
    maximum: [centerX + horizontalRadius, Math.max(minimum[1], maximum[1]) + mesh.position.y, centerZ + horizontalRadius]
  };
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
    NexusEngine?.createCoreCameraFramingKit,
    SeedModule?.createSeedKit,
    CreatureModule?.createProceduralCreatureBodyKit,
    THREE?.WebGLRenderer
  ];
  if (required.some((entry) => typeof entry !== "function")) throw new Error("Preview modules did not load.");

  const engine = NexusEngine.createRealtimeGame({
    kits: [
      ...NexusEngine.createCoreCreatureDomain(),
      ...NexusEngine.createCoreCharacterDomain(),
      ...NexusEngine.createCoreMotionDomain(),
      NexusEngine.createCoreCameraFramingKit(),
      SeedModule.createSeedKit({ seed: draft.creature.seed }),
      CreatureModule.createProceduralCreatureBodyKit({ creatures: [draft.creature] })
    ]
  });
  const creatureApi = engine.n.proceduralCreatureBody;
  const cameraFraming = engine.n.cameraFraming;
  if (!creatureApi || !cameraFraming) throw new Error("Character preview composition did not install.");
  const framingController = cameraFraming.create({
    id: "character-creator",
    padding: 1.18,
    smoothTime: 0.16,
    minimumDistance: 2,
    maximumDistance: 30,
    teleportThreshold: 12
  });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x102318);
  scene.fog = new THREE.Fog(0x102318, 10, 32);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.03, 70);
  const cameraDirection = new THREE.Vector3(0.72, 0.32, 1).normalize();
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  preview.replaceChildren(renderer.domElement);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(4.25, 4.45, PLATFORM_HEIGHT, 64),
    new THREE.MeshStandardMaterial({ color: 0x304d31, roughness: 0.9 })
  );
  platform.position.y = PLATFORM_CENTER_Y;
  platform.receiveShadow = true;
  scene.add(platform);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.4, 0.025, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0x9fbd73 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = PLATFORM_TOP_Y + 0.01;
  scene.add(ring);

  scene.add(new THREE.HemisphereLight(0xc8dfc0, 0x162018, 2.1));
  const key = new THREE.DirectionalLight(0xffe0aa, 3.2);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x76b8ff, 1.5);
  rim.position.set(-5, 4, -4);
  scene.add(rim);

  previewTransition = createCharacterPreviewTransition({
    THREE,
    scene,
    engine,
    creatureApi,
    initialProfile: draft,
    platformTopY: PLATFORM_TOP_Y
  });

  const resize = () => {
    const width = Math.max(1, preview.clientWidth);
    const height = Math.max(1, preview.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(preview);
  resize();

  let running = true;
  let last = performance.now();
  let turn = 0;

  function updateCameraFrame(dt) {
    const mesh = previewTransition?.getMesh();
    const resolved = previewTransition?.getCharacter();
    const localBounds = resolved?.creature?.presentation?.metadata?.bounds;
    if (!mesh || !localBounds || !resolved?.creature) return;
    const bounds = stagedBounds(localBounds, mesh);
    const height = Math.max(0.001, bounds.maximum[1] - bounds.minimum[1]);
    const [minimumFov, maximumFov] = resolved.creature.presentation.fovRange;
    const desiredFov = THREE.MathUtils.clamp(
      42 - Math.log2(height / REFERENCE_CHARACTER_HEIGHT) * 5,
      minimumFov,
      maximumFov
    );
    const alpha = 1 - Math.exp(-5 * Math.max(0, dt));
    camera.fov += (desiredFov - camera.fov) * alpha;
    const framing = framingController.update({
      subjectBounds: bounds,
      viewport: { width: Math.max(1, preview.clientWidth), height: Math.max(1, preview.clientHeight) },
      camera: {
        projection: "perspective",
        verticalFov: camera.fov,
        preferredDirection: cameraDirection.toArray(),
        nearPadding: 0.25,
        farPadding: 10
      },
      padding: resolved.creature.presentation.framingPadding,
      deltaTime: dt
    });
    camera.position.fromArray(framing.position);
    camera.near = framing.near;
    camera.far = framing.far;
    camera.lookAt(...framing.target);
    camera.updateProjectionMatrix();
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    turn += dt * 0.22;
    previewTransition.update(dt, {
      speed: 8,
      time: now / 1000,
      turn: Math.sin(now / 1800) * 0.08,
      jump: 0,
      resistance: 0
    }, turn);
    updateCameraFrame(dt);
    renderer.render(scene, camera);
    const state = previewTransition.getState();
    previewStatus.textContent = state.mode === "settled" ? "Ready" : "Updating";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  disposeShowcase = () => {
    running = false;
    observer.disconnect();
    previewTransition?.dispose();
    previewTransition = null;
    platform.geometry.dispose();
    platform.material.dispose();
    ring.geometry.dispose();
    ring.material.dispose();
    renderer.dispose();
  };
}

renderControls();
startShowcase().catch((error) => {
  console.error(error);
  previewStatus.textContent = "Unavailable";
  preview.innerHTML = `<p style="padding:24px;color:#ffb6a9">${error.message}</p>`;
});
addEventListener("beforeunload", () => disposeShowcase(), { once: true });
