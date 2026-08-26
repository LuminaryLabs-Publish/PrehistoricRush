import assert from "node:assert/strict";
import { buildGPUHeightfield, createGPUWorldLayerDescriptor } from "../src/domains/prehistoric-rush/gpu-native-ground-cover.js";
import {
  FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  FOUNDATION_TERRAIN_PATCH_SEGMENTS
} from "../src/domains/prehistoric-rush/rendering-streaming-policy.js";

const descriptor = createGPUWorldLayerDescriptor({ id: "prehistoric-rush", seed: 18327 });
assert.equal(descriptor.zeroCopy, true);
assert.equal(descriptor.gpuCulling, true);
assert.equal(descriptor.gpuLod, true);
assert.equal(descriptor.indirectDraw, true);
assert.equal(descriptor.gpuReadbackBytes, 0);
assert.equal(descriptor.terrainPatchCount, (FOUNDATION_TERRAIN_ACTIVE_RADIUS * 2 + 1) ** 2);
assert.ok(descriptor.grassCapacity >= 1024);
assert.ok(descriptor.resources.grassVisible.includes("grass-visible"));
assert.ok(descriptor.resources.grassIndirect.includes("grass-indirect"));

const world = { sampleElevation(x, z) { return x * 0.01 + z * 0.02; } };
const first = buildGPUHeightfield(world, { x: 0, z: 0 });
const second = buildGPUHeightfield(world, { x: 0, z: 0 });
const expectedGridSize = FOUNDATION_TERRAIN_PATCH_SEGMENTS * (FOUNDATION_TERRAIN_ACTIVE_RADIUS * 2 + 1) + 1;
assert.equal(first.gridSize, expectedGridSize);
assert.equal(first.heights.length, expectedGridSize * expectedGridSize);
assert.deepEqual([...first.heights], [...second.heights]);
assert.equal(first.bounds.key, "0:0");
assert.equal(buildGPUHeightfield(world, { x: 97, z: 0 }).bounds.key, "1:0");

console.log(JSON.stringify({
  status: "PASS",
  terrainPatchCount: descriptor.terrainPatchCount,
  heightSamples: first.heights.length,
  grassCapacity: descriptor.grassCapacity,
  zeroCopy: descriptor.zeroCopy,
  gpuCulling: descriptor.gpuCulling,
  gpuLod: descriptor.gpuLod,
  indirectDraw: descriptor.indirectDraw,
  readbackBytes: descriptor.gpuReadbackBytes
}, null, 2));
