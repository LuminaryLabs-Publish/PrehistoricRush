import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import * as THREE from "three";
import { PREHISTORIC_TREE_ARCHETYPES } from "../src/shared/tree-archetype-catalog.js";
import { createThreePrebuiltTreeModel } from "../src/render/three-prebuilt-tree-model.js";
import { createThreeTreeFidelityLayer, resolveTreeFidelityThresholds } from "../src/render/three-tree-fidelity-layer.js";

globalThis.ProgressEvent ??= class ProgressEvent extends Event {
  constructor(type, options = {}) {
    super(type);
    this.lengthComputable = Boolean(options.lengthComputable);
    this.loaded = options.loaded ?? 0;
    this.total = options.total ?? 0;
  }
};

const loaderModuleUrl = new URL("../node_modules/three/examples/jsm/loaders/GLTFLoader.js", import.meta.url).href;
const renderSources = [];
let firstModel = null;

for (const archetype of PREHISTORIC_TREE_ARCHETYPES) {
  const bytes = await readFile(new URL(`../assets/models/trees/${archetype.id}.glb`, import.meta.url));
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const model = await createThreePrebuiltTreeModel(THREE, buffer, { loaderModuleUrl });
  const position = model.geometry.getAttribute("position");
  const normal = model.geometry.getAttribute("normal");
  const color = model.geometry.getAttribute("color");
  assert.ok(model.sourceMeshCount > 0, `${archetype.id} factory GLB must contain source meshes`);
  assert.ok(position?.count > 0, `${archetype.id} factory GLB must contain combined vertices`);
  assert.equal(position.count, normal.count, `${archetype.id} combined normals must match vertices`);
  assert.equal(position.count, color.count, `${archetype.id} combined colors must match vertices`);
  assert.ok(model.bounds.height > 0 && model.bounds.width > 0 && model.bounds.depth > 0, `${archetype.id} bounds must be positive`);
  assert.equal(model.bounds.min[1], 0, `${archetype.id} factory model must be grounded`);
  assert.ok(model.geometry.boundingSphere?.radius > 0, `${archetype.id} combined geometry must have bounds`);
  renderSources.push({ id: archetype.id, sourceMeshCount: model.sourceMeshCount, vertices: position.count });
  if (!firstModel) firstModel = model;
  else model.geometry.dispose();
}

assert.equal(renderSources.length, 12);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 500);
camera.position.set(0, 4, 8);
const renderer = { domElement: { height: 720 } };
const portableGeometry = { positions: [0, 0, 0, 1, 0, 0, 0, 1, 0], indices: [0, 1, 2], attributes: {} };
const atlas = { assetId: "factory-test-atlas", runtimeImage: { width: 1, height: 1 } };
const packageValue = {
  archetypeId: renderSources[0].id,
  growth: { digest: "factory-test-growth" },
  source: { bounds: { min: [-1, 0, -1], size: [2, 6, 2], width: 2, height: 6, depth: 2 } },
  prebuiltTree: firstModel,
  forms: {
    near: { geometry: portableGeometry, minimumProjectedSize: 0 },
    medium: { geometry: portableGeometry, minimumProjectedSize: -1 },
    far: { atlas, frames: [], minimumProjectedSize: -2 },
    horizon: { atlas, frames: [], minimumProjectedSize: -3 }
  },
  change: { duration: 0, hysteresis: 0, stableSelectionFrames: 1 },
  material: { foliageColor: "#5f8f52" }
};
assert.deepEqual(
  resolveTreeFidelityThresholds(packageValue),
  { near: 0, medium: -1, far: -2 },
  "factory GLBs must use the same semantic projected LOD thresholds as other tree forms"
);
assert.deepEqual(
  resolveTreeFidelityThresholds({ forms: { near: { minimumProjectedSize: 300 }, medium: { minimumProjectedSize: 84 }, far: { minimumProjectedSize: 12 } } }, 3),
  { near: 900, medium: 252, far: 36 },
  "performance quality must be able to move expensive mesh LODs farther from software rendering"
);
const layer = createThreeTreeFidelityLayer(THREE, {
  scene,
  camera,
  renderer,
  treeTypes: [{ id: packageValue.archetypeId, foliageColor: "#5f8f52" }],
  packages: [packageValue],
  capacity: 8
});
layer.activatePatch({ id: "factory-test-patch", trees: [{ trunks: [{ id: "trunk", bounds: { min: [-10, 0, -10], max: [10, 30, 10] }, metadata: { treeId: "factory-test-tree", variation: { groundPosition: [0, 0, 0], uniformScale: 1.1, heightScale: 1.05, crownScale: 0.95 } } }], crowns: [{ id: "crown", bounds: { min: [-15, 30, -15], max: [15, 60, 15] }, metadata: { treeId: "factory-test-tree", variation: { groundPosition: [0, 0, 0], uniformScale: 1.1, heightScale: 1.05, crownScale: 0.95 } } }] }] });
layer.update({}, 1 / 60);
assert.equal(layer.view.prebuiltPackageCount, 1, "tree fidelity must retain the prebuilt package as the active source");
assert.equal(layer.view.factoryBatchCount, 2, "near and medium factory geometry must use two instanced batches");
assert.equal(layer.view.factorySourceMeshCount, firstModel.sourceMeshCount, "batch telemetry must retain the source mesh count");
assert.equal(scene.children.filter((object) => object.userData.treeRenderSource === "factory-glb").length, 2, "factory tree parts must be collapsed into batched meshes");
assert.equal(layer.view.counts.near, 1, "the active tree must render through the factory near batch");
const factoryNear = scene.children.find((object) => object.userData.treeRenderSource === "factory-glb" && object.name.endsWith("-near"));
const instanceMatrix = new THREE.Matrix4();
const instancePosition = new THREE.Vector3();
const instanceQuaternion = new THREE.Quaternion();
const instanceScale = new THREE.Vector3();
factoryNear.getMatrixAt(0, instanceMatrix);
instanceMatrix.decompose(instancePosition, instanceQuaternion, instanceScale);
assert.ok(Math.abs(instanceScale.x * firstModel.bounds.width - 30) < 1e-5, "factory width must match the authoritative semantic instance bounds");
assert.ok(Math.abs(instanceScale.y * firstModel.bounds.height - 60) < 1e-5, "factory height must match the authoritative semantic instance bounds");
assert.ok(Math.abs(instanceScale.z * firstModel.bounds.depth - 30) < 1e-5, "factory depth must match the authoritative semantic instance bounds");
layer.dispose();
firstModel.geometry.dispose();

const proxyScene = new THREE.Scene();
const proxyLayer = createThreeTreeFidelityLayer(THREE, {
  scene: proxyScene,
  camera,
  renderer,
  treeTypes: [PREHISTORIC_TREE_ARCHETYPES[0]],
  packages: [],
  capacity: 4
});
proxyLayer.activatePatch({ id: "proxy-test-patch", trees: [{ trunks: [{ id: "proxy-trunk", bounds: { min: [-1, 0, -1], max: [1, 3, 1] }, metadata: { treeId: "proxy-test-tree", variation: { groundPosition: [0, 0, 0] } } }], crowns: [{ id: "proxy-crown", bounds: { min: [-2, 3, -2], max: [2, 7, 2] }, metadata: { treeId: "proxy-test-tree", variation: { groundPosition: [0, 0, 0] } } }] }] });
proxyLayer.update({}, 1 / 60);
assert.equal(proxyLayer.view.suppressedLegacyMeshes, 0, "tree fidelity proxies must not be mistaken for legacy meshes");
const proxyNear = proxyScene.children.find((object) => object.name.endsWith("-near"));
assert.equal(proxyNear.visible, true, "generic near-tree proxies must remain visible until factory packages upgrade them");
assert.equal(proxyNear.count, 1, "generic proxy batch must contain the active tree");
assert.equal(proxyLayer.view.treeCount, 1, "proxy fallback must keep the generated patch active");
proxyLayer.dispose();
console.log("factory tree GLB loader and combined batch geometry passed", renderSources);
