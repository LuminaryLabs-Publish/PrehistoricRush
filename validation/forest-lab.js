import { RUNTIME_URLS } from "../src/shared/runtime-versions.js";
import { PREHISTORIC_TREE_ARCHETYPES } from "../src/shared/tree-archetype-catalog.js";
import { FOLIAGE_ATLAS_REVISION } from "../src/shared/prehistoric-foliage-card-recipes.js";
import { createPrehistoricVegetationRuntime } from "../src/shared/prehistoric-vegetation-domain.js";
import {
  PREHISTORIC_TREE_GROWTH_REVISION,
  preparePrehistoricTreeGrowthPlans,
  validatePrehistoricTreeGrowthPlans
} from "../src/shared/prehistoric-tree-growth-compute.js";
import { createPrehistoricNaturalTreeObject } from "../src/render/prehistoric-natural-tree-geometry.js";

const status = document.querySelector("#status");
const app = document.querySelector("#app");
const params = new URLSearchParams(location.search);
const initialScene = params.get("scene") || "tree-lab";

const [NexusEngine, THREE] = await Promise.all([
  import(RUNTIME_URLS.nexus),
  import(RUNTIME_URLS.three)
]);

function createGrowthLabRuntime() {
  if (typeof NexusEngine.createCoreComputeDomain !== "function") throw new TypeError("Pinned NexusEngine is missing createCoreComputeDomain().");
  const vegetationRuntime = createPrehistoricVegetationRuntime(NexusEngine);
  for (const kit of NexusEngine.createCoreComputeDomain()) vegetationRuntime.engine.installKit(kit);
  return {
    engine: vegetationRuntime.engine,
    vegetationCatalog: vegetationRuntime.catalog
  };
}

const baseRuntime = createGrowthLabRuntime();
const growthPlans = await preparePrehistoricTreeGrowthPlans(NexusEngine, baseRuntime);
const growthValidation = validatePrehistoricTreeGrowthPlans(growthPlans);
if (!growthValidation.valid) throw new Error(`Forest lab growth validation failed: ${growthValidation.errors.join("; ")}`);
const treeGrowthDigest = NexusEngine.hashFidelityValue(
  PREHISTORIC_TREE_ARCHETYPES.map((archetype) => ({
    speciesId: archetype.id,
    revision: growthPlans[archetype.id]?.revision,
    near: growthPlans[archetype.id]?.near,
    medium: growthPlans[archetype.id]?.medium
  }))
);
const runtime = Object.freeze({
  ...baseRuntime,
  growthPlans,
  growthValidation,
  treeGrowthDigest,
  treeGrowthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
  foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
});

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(1.5, globalThis.devicePixelRatio || 1));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
app.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8eb8a0);
scene.fog = new THREE.FogExp2(0x86ad98, 0.0048);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 1000);

const hemisphere = new THREE.HemisphereLight(0xd8efdb, 0x263725, 1.4);
scene.add(hemisphere);
const sun = new THREE.DirectionalLight(0xffe1a1, 3.2);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -90;
sun.shadow.camera.right = 90;
sun.shadow.camera.top = 90;
sun.shadow.camera.bottom = -90;
scene.add(sun);

const root = new THREE.Group();
root.name = "validation-scene-root";
scene.add(root);

const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x526b3e, roughness: 0.96, metalness: 0 });

function addGround(size = 220) {
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1);
  const mesh = new THREE.Mesh(geometry, groundMaterial);
  mesh.rotation.x = -Math.PI * 0.5;
  mesh.receiveShadow = true;
  mesh.userData.validationGround = true;
  root.add(mesh);
  return mesh;
}

function clearRoot() {
  while (root.children.length) {
    const child = root.children.pop();
    child.traverse?.((object) => {
      if (object.geometry && !object.userData.validationGround) object.geometry.dispose?.();
      if (object.material && object.material !== groundMaterial) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) material.dispose?.();
      }
    });
  }
}

function planFor(archetype, quality = "near") {
  return runtime.growthPlans[archetype.id]?.[quality];
}

function addTree(archetype, x, z, options = {}) {
  const quality = options.quality === "medium" ? "medium" : "near";
  const tree = createPrehistoricNaturalTreeObject(THREE, archetype, planFor(archetype, quality));
  tree.position.set(x, Number(options.y ?? 0), z);
  tree.rotation.y = Number(options.yaw ?? 0);
  const scale = Number(options.scale ?? 1);
  tree.scale.setScalar(scale);
  if (options.mode === "roots") {
    tree.traverse((object) => {
      if (object.userData?.foliageCard) object.visible = false;
      if (/branch/.test(object.userData?.vegetationRole ?? "")) object.visible = false;
    });
  }
  if (options.mode === "foliage") {
    tree.traverse((object) => {
      if (object.userData?.vegetationRole && object.userData.vegetationRole !== "bounds-proxy") object.visible = object.userData.foliageCard === true;
    });
  }
  root.add(tree);
  return tree;
}

function seededUnit(seed) {
  let value = seed >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return (value >>> 0) / 4294967295;
}

function setCamera(position, target) {
  camera.position.set(...position);
  camera.lookAt(...target);
}

function configureCommon() {
  scene.fog.density = 0.0048;
  scene.background.setHex(0x8eb8a0);
  hemisphere.intensity = 1.4;
  sun.intensity = 3.2;
  sun.position.set(-35, 64, 28);
  sun.target.position.set(0, 12, -20);
  scene.add(sun.target);
}

function buildTreeLab() {
  addGround(180);
  PREHISTORIC_TREE_ARCHETYPES.forEach((archetype, index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    addTree(archetype, (column - 1.5) * 28, -row * 38, { scale: 0.72, yaw: index * 0.43 });
  });
  setCamera([0, 34, 78], [0, 24, -34]);
}

function buildRootLab() {
  addGround(130);
  const ids = ["broad-canopy", "giant-fern-tree", "moss-column", "forked-ghostwood"];
  ids.forEach((id, index) => {
    const archetype = PREHISTORIC_TREE_ARCHETYPES.find((entry) => entry.id === id);
    addTree(archetype, (index - 1.5) * 18, 0, { mode: "roots", scale: 0.82, yaw: index * 0.7 });
  });
  setCamera([0, 8, 42], [0, 5, 0]);
}

function buildFoliageLab() {
  addGround(140);
  const ids = ["broad-canopy", "ginkgo-crown-tree", "giant-fern-tree", "layered-araucaria"];
  ids.forEach((id, index) => {
    const archetype = PREHISTORIC_TREE_ARCHETYPES.find((entry) => entry.id === id);
    addTree(archetype, (index - 1.5) * 22, -4, { mode: "foliage", scale: 0.78, yaw: index * 0.4 });
  });
  setCamera([0, 28, 52], [0, 25, -4]);
}

function buildCanopyLab() {
  addGround(180);
  const archetype = PREHISTORIC_TREE_ARCHETYPES.find((entry) => entry.id === "broad-canopy");
  const positions = [[0,-14],[-18,-22],[18,-22],[-9,-42],[11,-45],[0,-62]];
  positions.forEach(([x,z], index) => addTree(archetype, x, z, { scale: 0.9 + (index % 3) * 0.05, yaw: index * 0.73 }));
  setCamera([0, 10, 42], [0, 22, -36]);
}

function buildLodLab() {
  addGround(280);
  const archetype = PREHISTORIC_TREE_ARCHETYPES.find((entry) => entry.id === "broad-canopy");
  [16, 48, 88, 138].forEach((distance, index) => {
    addTree(archetype, (index - 1.5) * 16, -distance, { quality: index < 2 ? "near" : "medium", scale: 0.86, yaw: index * 0.55 });
  });
  setCamera([0, 9, 32], [0, 19, -72]);
}

function buildBacklightLab() {
  addGround(160);
  const ids = ["broad-canopy", "ginkgo-crown-tree", "giant-fern-tree"];
  ids.forEach((id, index) => {
    const archetype = PREHISTORIC_TREE_ARCHETYPES.find((entry) => entry.id === id);
    addTree(archetype, (index - 1) * 20, -18 - index * 5, { scale: 0.9, yaw: index * 0.5 });
  });
  sun.position.set(0, 36, -72);
  sun.intensity = 4.4;
  hemisphere.intensity = 0.9;
  setCamera([0, 13, 44], [0, 23, -24]);
}

function buildRacingLineLab() {
  addGround(260);
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 230),
    new THREE.MeshStandardMaterial({ color: 0x816f50, roughness: 1 })
  );
  path.rotation.x = -Math.PI * 0.5;
  path.position.z = -85;
  path.position.y = 0.015;
  path.receiveShadow = true;
  root.add(path);
  for (let i = 0; i < 18; i += 1) {
    const archetype = PREHISTORIC_TREE_ARCHETYPES[(i * 5 + 3) % PREHISTORIC_TREE_ARCHETYPES.length];
    const side = i % 2 ? 1 : -1;
    addTree(archetype, side * (8.5 + seededUnit(238991 + i) * 7), -10 - i * 10.5, {
      quality: i > 10 ? "medium" : "near",
      scale: 0.68 + seededUnit(991823 + i) * 0.32,
      yaw: seededUnit(81821 + i) * Math.PI * 2
    });
  }
  setCamera([0, 4.2, 24], [0, 4.4, -88]);
}

function buildFullGameSeed() {
  addGround(340);
  for (let i = 0; i < 36; i += 1) {
    const a = seededUnit(238991 + i * 17);
    const b = seededUnit(991238 + i * 29);
    const archetype = PREHISTORIC_TREE_ARCHETYPES[Math.floor(a * PREHISTORIC_TREE_ARCHETYPES.length) % PREHISTORIC_TREE_ARCHETYPES.length];
    const side = i % 2 ? 1 : -1;
    addTree(archetype, side * (10 + a * 34), -8 - i * 6.2, {
      quality: i > 16 ? "medium" : "near",
      scale: 0.58 + b * 0.5,
      yaw: a * Math.PI * 2
    });
  }
  scene.fog.density = 0.0062;
  setCamera([0, 7, 28], [0, 8, -94]);
}

const builders = {
  "tree-lab": buildTreeLab,
  "root-lab": buildRootLab,
  "foliage-lab": buildFoliageLab,
  "canopy-lab": buildCanopyLab,
  "lod-lab": buildLodLab,
  "backlight-lab": buildBacklightLab,
  "racing-line": buildRacingLineLab,
  "full-game-seed": buildFullGameSeed
};

function collectMetrics(sceneId) {
  let objects = 0;
  let woodMeshes = 0;
  let foliageCards = 0;
  let triangles = 0;
  root.traverse((object) => {
    objects += 1;
    if (object.userData?.naturalGrowth && object.userData?.vegetationRole && object.userData.vegetationRole !== "bounds-proxy") woodMeshes += 1;
    if (object.userData?.foliageCard) foliageCards += 1;
    const geometry = object.geometry;
    if (geometry?.index) triangles += Math.floor(geometry.index.count / 3);
    else if (geometry?.getAttribute?.("position")) triangles += Math.floor(geometry.getAttribute("position").count / 3);
  });
  return {
    scene: sceneId,
    speciesCount: PREHISTORIC_TREE_ARCHETYPES.length,
    objects,
    woodMeshes,
    foliageCards,
    triangles,
    runtimeKind: "nexus-vegetation-growth-source",
    growthRevision: runtime.treeGrowthRevision,
    growthDigest: runtime.treeGrowthDigest,
    foliageAtlasRevision: runtime.foliageAtlasRevision,
    growthValidation: runtime.growthValidation,
    species: PREHISTORIC_TREE_ARCHETYPES.map((archetype) => ({
      id: archetype.id,
      near: runtime.growthPlans[archetype.id].metrics.near,
      medium: runtime.growthPlans[archetype.id].metrics.medium
    }))
  };
}

export async function setForestLabScene(sceneId) {
  const builder = builders[sceneId] ?? builders["tree-lab"];
  clearRoot();
  configureCommon();
  builder();
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  root.updateMatrixWorld(true);
  renderer.render(scene, camera);
  const metrics = collectMetrics(sceneId);
  globalThis.__PREHISTORIC_FOREST_LAB_METRICS__ = metrics;
  globalThis.__PREHISTORIC_FOREST_LAB_SCENE__ = sceneId;
  status.innerHTML = `<strong>${sceneId}</strong><span>${metrics.foliageCards} source foliage cards · ${metrics.triangles.toLocaleString()} triangles</span>`;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  return metrics;
}

globalThis.__setForestLabScene = setForestLabScene;

addEventListener("resize", () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

let previous = performance.now();
function frame(now) {
  const delta = Math.min(0.05, Math.max(0, (now - previous) / 1000));
  previous = now;
  root.rotation.y += delta * 0.012;
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

await setForestLabScene(initialScene);
globalThis.__PREHISTORIC_FOREST_LAB_READY__ = true;
requestAnimationFrame(frame);
