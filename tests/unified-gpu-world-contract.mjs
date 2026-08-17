import assert from "node:assert/strict";
import { createPrehistoricRushGPUWorldScene } from "../src/domains/prehistoric-rush/gpu-native-world-scene.js";

const resources = new Map();
const gpuHost = {
  async ensureResource(descriptor, data = null) { resources.set(descriptor.id, { ...descriptor, data }); return descriptor; },
  getDeviceDescriptor() { return { id: "synthetic-shared-device" }; },
  getResource(id) { return resources.get(id) ?? null; },
  listResources() { return [...resources.values()]; },
  evictResource(id) { resources.delete(id); return true; }
};
const computeCalls = [];
const computeHost = { async executeGraph(request, profile) { computeCalls.push({ request, profile }); return { status: "completed" }; } };
const frameCalls = [];
const frameExecutor = {
  async initialize(options) { this.options = options; },
  async executeFrame(request) { frameCalls.push(request); return { passCount: request.passes.length, submissionCount: 1, zeroCopy: true, gpuDeviceId: "synthetic-shared-device" }; }
};

const canvas = { width: 0, height: 0, dataset: {}, style: {}, remove() {} };
globalThis.document = { createElement(type) { assert.equal(type, "canvas"); return canvas; } };
globalThis.innerWidth = 1280;
globalThis.innerHeight = 720;
globalThis.devicePixelRatio = 1;
const hostElement = { clientWidth: 1280, clientHeight: 720, prepend(value) { assert.strictEqual(value, canvas); } };
const matrix = { elements: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1], clone() { return { elements: [...this.elements], multiply() { return this; } }; } };
const camera = { projectionMatrix: matrix, matrixWorldInverse: matrix, position: { x: 0, y: 8, z: 0 }, updateMatrixWorld() {} };
const geometry = { positions: [-1,0,0, 1,0,0, 0,2,0], indices: [0,1,2], attributes: { normal: { values: [0,0,1, 0,0,1, 0,0,1], itemSize: 3 }, color: { values: [0.3,0.5,0.2, 0.3,0.5,0.2, 0.3,0.5,0.2], itemSize: 3 } } };
const packageValue = { archetypeId: "synthetic-tree", source: { bounds: { size: [2,2,2] } }, forms: { near: { geometry }, medium: { geometry } } };
const variation = { groundPosition: [5, 0, 5], yawRadians: 0, tint: [1, 0.95, 0.9] };
const patch = { id: "foundation-forest:0:0", trees: [{ trunks: [{ id: "t", bounds: { min: [4,0,4], max: [6,2,6] }, metadata: { variation } }], crowns: [{ id: "c", bounds: { min: [3,1,3], max: [7,5,7] }, metadata: { variation } }] }], grass: [] };
const rendering = {
  camera,
  getDenseWorldPresentation() { return { revision: 1, terrainPatchCount: 9, forestPatchCount: 1, treePackageCount: 1, treeCount: 1, treePackages: [packageValue], forestPatches: [patch] }; }
};
const world = { sampleElevation(x, z) { return Math.sin(x * 0.01) + Math.cos(z * 0.01); } };
const contributions = [
  { semanticId: "synthetic:terrain" },
  { semanticId: "synthetic:ecology" },
  { semanticId: "synthetic:ground" }
];

const scene = await createPrehistoricRushGPUWorldScene({ hostElement, world, recipe: { id: "synthetic", seed: "seed" }, gpuHost, computeHost, frameExecutor, rendering, contributions });
const snapshot = scene.snapshot();
assert.equal(snapshot.active, true);
assert.equal(snapshot.sharedDeviceId, "synthetic-shared-device");
assert.equal(snapshot.sharedDepth, true);
assert.equal(snapshot.singleCanvas, true);
assert.equal(snapshot.singleFrameSubmission, true);
assert.equal(snapshot.zeroCopy, true);
assert.equal(snapshot.gpuCulling, true);
assert.equal(snapshot.gpuLod, true);
assert.equal(snapshot.indirectDraw, true);
assert.equal(snapshot.gpuReadbackBytes, 0);
assert.equal(snapshot.treeSpeciesCount, 1);
assert.equal(snapshot.treeCount, 1);
assert.equal(snapshot.passCount, 4, "terrain + near tree + medium tree + ground cover share one frame");
assert.equal(frameCalls.length, 1);
assert.equal(frameCalls[0].passes.length, 4);
assert.equal(new Set(frameCalls[0].passes.map((pass) => pass.depthStencilAttachment?.resourceId)).size, 1, "every dense pass shares one depth resource");
assert.equal(frameCalls[0].passes.at(-1).draw.indirect.resourceId.includes("grass-args"), true);
assert.equal(computeCalls.length, 1);
assert.equal(computeCalls[0].profile.requiredBackend, "webgpu");
assert.deepEqual(computeCalls[0].request.executionOrder, ["grass-reset", "grass-generate", "tree-reset", "tree-cull"]);
assert.ok(resources.has("prehistoric-rush:gpu-world:tree-visible"));
assert.ok(resources.has("prehistoric-rush:gpu-world:depth"));
console.log(JSON.stringify({ status: "PASS", passCount: snapshot.passCount, sharedDepth: snapshot.sharedDepth, treeCount: snapshot.treeCount, zeroCopy: snapshot.zeroCopy, gpuReadbackBytes: snapshot.gpuReadbackBytes }, null, 2));
scene.dispose();
