import assert from "node:assert/strict";
import { createPrehistoricRushGPUGroundCover } from "../src/domains/prehistoric-rush/gpu-native-ground-cover.js";

const previousDocument = globalThis.document;
const previousInnerWidth = globalThis.innerWidth;
const previousInnerHeight = globalThis.innerHeight;
const previousDevicePixelRatio = globalThis.devicePixelRatio;

const appended = [];
const removed = [];
const hostElement = {
  clientWidth: 1280,
  clientHeight: 720,
  append(node) { appended.push(node); }
};

globalThis.document = {
  createElement(type) {
    assert.equal(type, "canvas");
    return {
      width: 0,
      height: 0,
      dataset: {},
      style: {},
      remove() { removed.push(this); }
    };
  }
};
globalThis.innerWidth = 1280;
globalThis.innerHeight = 720;
globalThis.devicePixelRatio = 1;

const resources = new Map();
const evicted = [];
const gpuHost = {
  async ensureResource(descriptor, initialData = null) {
    const record = { ...descriptor, residency: "resident", state: "available", initialData };
    resources.set(descriptor.id, record);
    return record;
  },
  getResource(id) { return resources.get(id) ?? null; },
  listResources() { return [...resources.values()]; },
  getDeviceDescriptor() { return { id: "product-shared-device", backend: "webgpu" }; },
  evictResource(id) { evicted.push(id); resources.delete(id); return true; }
};

const computeCalls = [];
const computeHost = {
  async executeGraph(request, profile) {
    computeCalls.push({ request, profile });
    return { status: "completed", metadata: { gpuDeviceId: "product-shared-device", sharedGPUHost: true } };
  }
};

const renderCalls = [];
const renderProvider = {
  async initialize(options) { this.options = options; },
  async executePass(request) {
    renderCalls.push(request);
    return { status: "completed", gpuDeviceId: "product-shared-device", zeroCopy: true };
  }
};

const world = {
  sampleElevation(x, z) { return Math.sin(x * 0.01) * 2 + Math.cos(z * 0.01) * 3; }
};
const recipe = { id: "product-contract", seed: 18327 };

function fakeMatrix() {
  return {
    elements: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    clone() {
      return {
        multiply() { return fakeMatrix(); }
      };
    }
  };
}

try {
  const layer = await createPrehistoricRushGPUGroundCover({
    hostElement,
    world,
    recipe,
    gpuHost,
    computeHost,
    renderProvider
  });

  assert.equal(appended.length, 1, "GPU layer must publish exactly one WebGPU canvas");
  assert.equal(renderProvider.options.canvas, appended[0]);
  assert.equal(computeCalls.length, 1, "initial layer creation must generate the first GPU visibility set");
  assert.equal(computeCalls[0].profile.requiredBackend, "webgpu");
  assert.equal(computeCalls[0].profile.allowFallback, false);
  assert.deepEqual(computeCalls[0].request.executionOrder, ["reset", "generate"]);
  assert.ok(resources.has(layer.descriptor.resources.terrainHeights));
  assert.ok(resources.has(layer.descriptor.resources.grassVisible));
  assert.ok(resources.has(layer.descriptor.resources.grassIndirect));

  const camera = {
    projectionMatrix: fakeMatrix(),
    matrixWorldInverse: fakeMatrix(),
    updateMatrixWorld() {}
  };
  layer.scheduleFrame({ state: { x: 0, z: 0 }, camera });
  await new Promise((resolve) => setTimeout(resolve, 20));

  assert.equal(renderCalls.length, 1, "scheduled frame must submit through Nexus WebGPU Render");
  assert.equal(computeCalls.length, 2, "first scheduled frame must refresh GPU culling/LOD");
  const render = renderCalls[0];
  assert.equal(render.bindings[1].resourceId, layer.descriptor.resources.grassVisible);
  assert.equal(render.draw.indirect.resourceId, layer.descriptor.resources.grassIndirect);

  const snapshot = layer.snapshot();
  assert.equal(snapshot.active, true);
  assert.equal(snapshot.sharedDeviceId, "product-shared-device");
  assert.equal(snapshot.zeroCopy, true);
  assert.equal(snapshot.gpuCulling, true);
  assert.equal(snapshot.gpuLod, true);
  assert.equal(snapshot.indirectDraw, true);
  assert.equal(snapshot.gpuReadbackBytes, 0);
  assert.ok(snapshot.computeDispatches >= 4);
  assert.ok(snapshot.renderSubmissions >= 1);

  layer.dispose();
  assert.equal(removed.length, 1);
  assert.ok(evicted.includes(layer.descriptor.resources.grassVisible));
  assert.ok(evicted.includes(layer.descriptor.resources.grassIndirect));

  console.log(JSON.stringify({
    status: "PASS",
    sharedDeviceId: snapshot.sharedDeviceId,
    zeroCopy: snapshot.zeroCopy,
    gpuCulling: snapshot.gpuCulling,
    gpuLod: snapshot.gpuLod,
    indirectDraw: snapshot.indirectDraw,
    gpuReadbackBytes: snapshot.gpuReadbackBytes,
    computeDispatches: snapshot.computeDispatches,
    renderSubmissions: snapshot.renderSubmissions
  }, null, 2));
} finally {
  globalThis.document = previousDocument;
  globalThis.innerWidth = previousInnerWidth;
  globalThis.innerHeight = previousInnerHeight;
  globalThis.devicePixelRatio = previousDevicePixelRatio;
}
