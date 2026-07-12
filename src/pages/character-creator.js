import {
  loadPlayerCharacterProfile,
  patchPlayerCharacterProfile,
  resetPlayerCharacterProfile,
  subscribePlayerCharacterProfile
} from "../shared/player-character-store.js";
import { RUNTIME_URLS } from "../shared/runtime-versions.js";
import { createCharacterPreviewTransition } from "../character-creator/character-preview-transition.js";

const root = document.querySelector("#app") ?? document.body;
let draft = loadPlayerCharacterProfile();
let saveTimer = 0;
let previewTransition = null;
let disposeShowcase = () => {};

Object.assign(document.body.style, {
  margin: "0",
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0a160f,#183322 55%,#09110c)",
  color: "#fff3c8",
  fontFamily: "system-ui,sans-serif"
});

root.innerHTML = `
  <main style="min-height:100vh;padding:24px;box-sizing:border-box">
    <section style="max-width:1180px;margin:0 auto">
      <header style="display:flex;justify-content:space-between;gap:18px;align-items:flex-start;flex-wrap:wrap;margin-bottom:22px">
        <div>
          <p style="margin:0 0 6px;color:#8fd487;font-weight:800;letter-spacing:.12em;text-transform:uppercase">Prehistoric Rush</p>
          <h1 style="margin:0;font-size:clamp(34px,6vw,64px)">Character Creator</h1>
          <p style="color:#c9d7c4;max-width:700px">The showcase and game use the same procedural creature generator and skinned-mesh adapter.</p>
        </div>
        <nav style="display:flex;gap:10px;flex-wrap:wrap">
          <a href="./menu.html" style="padding:11px 16px;border-radius:999px;background:#ffffff18;color:#fff3c8;text-decoration:none;font-weight:800">Menu</a>
          <a href="./game.html" style="padding:11px 16px;border-radius:999px;background:#ffd37a;color:#211704;text-decoration:none;font-weight:900">Play Raptor</a>
        </nav>
      </header>

      <div style="display:grid;grid-template-columns:minmax(360px,1.35fr) minmax(320px,1fr);gap:18px" id="creator-grid">
        <section style="padding:18px;border-radius:24px;background:#07110cdd;border:1px solid #ffffff18">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px">
            <h2 style="margin:0">Live 3D Showcase</h2>
            <span id="preview-status" style="color:#a9c8a4;font-size:13px">Loading generator…</span>
          </div>
          <div id="preview" style="position:relative;min-height:520px;height:min(62vh,680px);border-radius:20px;overflow:hidden;background:radial-gradient(circle at 50% 30%,#294b34,#0b1710 72%)"></div>
          <pre id="profile-json" style="white-space:pre-wrap;word-break:break-word;max-height:190px;overflow:auto;background:#0005;padding:14px;border-radius:14px;color:#bde5b7;font-size:11px;margin:14px 0 0"></pre>
        </section>

        <section style="padding:22px;border-radius:24px;background:#07110cdd;border:1px solid #ffffff18">
          <div id="controls" style="display:grid;gap:20px"></div>
          <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-top:22px;flex-wrap:wrap">
            <span id="save-status" style="color:#a9c8a4">Saved</span>
            <button id="reset-profile" type="button" style="padding:10px 16px;border:0;border-radius:999px;background:#5d2b26;color:#fff3e5;font-weight:800;cursor:pointer">Reset Defaults</button>
          </div>
        </section>
      </div>
    </section>
  </main>
`;

const controls = document.querySelector("#controls");
const preview = document.querySelector("#preview");
const previewStatus = document.querySelector("#preview-status");
const profileJson = document.querySelector("#profile-json");
const saveStatus = document.querySelector("#save-status");

const definitions = [
  ["Body Scale", "proportions", "bodyScale", 0.55, 1.35, 0.01, false],
  ["Body Length", "proportions", "bodyLength", 0.85, 2.2, 0.01, false],
  ["Tail Length", "proportions", "tailLength", 0.8, 3.2, 0.01, false],
  ["Leg Length", "proportions", "legLength", 0.45, 1.35, 0.01, false],
  ["Head Forward", "proportions", "headForward", 0.65, 1.7, 0.01, false],
  ["Stride Swing", "animation", "strideSwing", 0.25, 1.5, 0.01, false],
  ["Tail Follow", "animation", "tailFollow", 0, 0.35, 0.01, false],
  ["Radial Segments", "topology", "radialSegments", 6, 18, 1, true],
  ["Tail Segments", "topology", "tailSegments", 3, 14, 1, true]
];

function controlMarkup() {
  const numeric = definitions.map(([label, group, key, min, max, step]) => `
    <label style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center">
      <span>${label}</span>
      <output data-output="${group}.${key}" style="color:#a9d79e"></output>
      <input data-group="${group}" data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" style="grid-column:1/-1;width:100%">
    </label>
  `).join("");
  return `
    <div style="display:grid;gap:15px">
      <h2 style="margin:0">Body, Motion, and Topology</h2>
      ${numeric}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <label style="display:grid;gap:8px">Skin Color<input data-color="skin" type="color" style="width:100%;height:48px;border:0;background:none"></label>
      <label style="display:grid;gap:8px">Underbelly<input data-color="underbelly" type="color" style="width:100%;height:48px;border:0;background:none"></label>
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
    const definition = definitions.find((item) => item[1] === input.dataset.group && item[2] === input.dataset.key);
    const output = controls.querySelector(`[data-output="${input.dataset.group}.${input.dataset.key}"]`);
    if (output) output.textContent = definition?.[6] ? String(Math.round(value)) : Number(value).toFixed(2);
  }
  for (const input of controls.querySelectorAll("input[data-color]")) input.value = preset.material[input.dataset.color];
  profileJson.textContent = JSON.stringify(draft, null, 2);
}

function updateDraft(patch) {
  draft = {
    ...draft,
    creature: {
      ...draft.creature,
      preset: {
        ...draft.creature.preset,
        ...patch
      }
    }
  };
  renderControls();
  previewTransition?.setTargetProfile(draft);
  saveStatus.textContent = "Saving…";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    draft = patchPlayerCharacterProfile({ creature: { preset: patch } });
    saveStatus.textContent = `Saved revision ${draft.revision}`;
    previewTransition?.setTargetProfile(draft);
    renderControls();
  }, 160);
}

controls.addEventListener("input", (event) => {
  const input = event.target;
  if (input.dataset.group && input.dataset.key) {
    const definition = definitions.find((item) => item[1] === input.dataset.group && item[2] === input.dataset.key);
    const value = definition?.[6] ? Math.round(Number(input.value)) : Number(input.value);
    updateDraft({
      [input.dataset.group]: {
        ...draft.creature.preset[input.dataset.group],
        [input.dataset.key]: value
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
  saveStatus.textContent = `Reset to revision ${draft.revision}`;
  renderControls();
});

subscribePlayerCharacterProfile(({ source, profile }) => {
  if (source === "local") return;
  draft = profile;
  previewTransition?.setTargetProfile(draft);
  saveStatus.textContent = `Updated from ${source}`;
  renderControls();
});

async function startShowcase() {
  const [NexusEngine, SeedModule, CreatureModule, THREE] = await Promise.all([
    import(RUNTIME_URLS.nexus),
    import(RUNTIME_URLS.seedKit),
    import(RUNTIME_URLS.creatureKit),
    import(RUNTIME_URLS.three)
  ]);
  if (!NexusEngine?.createRealtimeGame || !SeedModule?.createSeedKit || !CreatureModule?.createProceduralCreatureBodyKit || !THREE?.WebGLRenderer) {
    throw new Error("Required procedural preview modules did not load.");
  }

  const engine = NexusEngine.createRealtimeGame({
    kits: [
      SeedModule.createSeedKit({ seed: draft.creature.seed }),
      CreatureModule.createProceduralCreatureBodyKit({ creatures: [draft.creature] })
    ]
  });
  const creatureApi = engine.n.proceduralCreatureBody;
  if (!creatureApi) throw new Error("Procedural creature body service did not install.");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x102318);
  scene.fog = new THREE.Fog(0x102318, 10, 24);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
  camera.position.set(4.6, 2.7, 6.7);
  camera.lookAt(0, 0.75, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  preview.replaceChildren(renderer.domElement);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(3.3, 3.5, 0.24, 64),
    new THREE.MeshStandardMaterial({ color: 0x304d31, roughness: 0.88 })
  );
  platform.position.y = -0.25;
  platform.receiveShadow = true;
  scene.add(platform);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.65, 0.025, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0x9fbd73 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.115;
  scene.add(ring);

  scene.add(new THREE.HemisphereLight(0xc8dfc0, 0x162018, 2.1));
  const key = new THREE.DirectionalLight(0xffe0aa, 3.3);
  key.position.set(4, 7, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x76b8ff, 1.6);
  rim.position.set(-5, 4, -4);
  scene.add(rim);

  previewTransition = createCharacterPreviewTransition({
    THREE,
    scene,
    creatureApi,
    initialProfile: draft
  });
  previewTransition.getMesh().position.y = 0;

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

  let last = performance.now();
  let animationFrame = 0;
  const animate = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const time = now / 1000;
    previewTransition.update(dt, {
      speed: 8,
      time,
      turn: Math.sin(time * 0.45) * 0.18,
      jump: 0,
      resistance: 0
    }, time * 0.24);
    const state = previewTransition.getState();
    previewStatus.textContent = `${state.mode} · target ${state.targetRevision} · applied ${state.appliedRevision}`;
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(animate);
  };
  animationFrame = requestAnimationFrame(animate);

  disposeShowcase = () => {
    cancelAnimationFrame(animationFrame);
    observer.disconnect();
    previewTransition?.dispose();
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
  previewStatus.textContent = "Preview failed";
  preview.innerHTML = `<p style="padding:24px;color:#ffb6a9">Could not start procedural showcase: ${error.message}</p>`;
});
addEventListener("beforeunload", () => disposeShowcase(), { once: true });
