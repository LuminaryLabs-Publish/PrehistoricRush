import assert from "node:assert/strict";
import fs from "node:fs";
import {
  FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  FOUNDATION_TERRAIN_PATCH_SIZE,
  createCenteredPatchPlan,
  getFoundationTerrainStreamingOwner,
  setFoundationTerrainStreamingOwner
} from "../src/domains/prehistoric-rush/rendering-streaming-policy.js";

const options = { size: FOUNDATION_TERRAIN_PATCH_SIZE, radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS, prefix: "foundation-terrain" };
const anchor = { x: 48, z: 48, yaw: 0, speed: 24 };
const anchorPlan = createCenteredPatchPlan(anchor, options).map((entry) => entry.id);

setFoundationTerrainStreamingOwner("webgpu", anchor);
assert.equal(getFoundationTerrainStreamingOwner().owner, "webgpu");
const farWhileGPUOwnsTerrain = createCenteredPatchPlan({ x: 960, z: 960, yaw: 0, speed: 24 }, options).map((entry) => entry.id);
assert.deepEqual(farWhileGPUOwnsTerrain, anchorPlan, "Three.js terrain plan must remain anchored while WebGPU owns dense terrain");

setFoundationTerrainStreamingOwner("webgl2");
assert.equal(getFoundationTerrainStreamingOwner().owner, "webgl2");
const farAfterFallback = createCenteredPatchPlan({ x: 960, z: 960, yaw: 0, speed: 24 }, options).map((entry) => entry.id);
assert.notDeepEqual(farAfterFallback, anchorPlan, "WebGL terrain streaming must resume after GPU ownership ends");

const gpuSource = fs.readFileSync(new URL("../src/domains/prehistoric-rush/gpu-native-world-scene.js", import.meta.url), "utf8");
const start = gpuSource.indexOf("async function ensureHeightfield(state)");
const end = gpuSource.indexOf("async function ensureTreeGeometry", start);
assert.ok(start >= 0 && end > start, "GPU heightfield function must exist");
const ensureHeightfieldSource = gpuSource.slice(start, end);
const boundsIndex = ensureHeightfieldSource.indexOf("const bounds = centeredBounds(state)");
const keyGuardIndex = ensureHeightfieldSource.indexOf("if (heightfieldKey === bounds.key)");
const buildIndex = ensureHeightfieldSource.indexOf("buildHeightfield(world, bounds)");
assert.ok(boundsIndex >= 0 && keyGuardIndex > boundsIndex && buildIndex > keyGuardIndex, "GPU terrain must check the cell key before building the heightfield");

const sharedSource = fs.readFileSync(new URL("../src/game-runtime-shared-gpu-v3.js", import.meta.url), "utf8");
assert.match(sharedSource, /setFoundationTerrainStreamingOwner\("webgpu", terrainAnchor\)/, "GPU handoff must freeze hidden Three.js terrain streaming");
assert.match(sharedSource, /setFoundationTerrainStreamingOwner\("webgl2"\)/, "GPU teardown must restore WebGL terrain streaming");

console.log("terrain render owner contract: ok", {
  anchoredPatchCount: anchorPlan.length,
  gpuPlanFrozen: true,
  fallbackRestored: true,
  keyGuardBeforeHeightfieldBuild: true
});
