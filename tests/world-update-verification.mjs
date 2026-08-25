import assert from "node:assert/strict";
import {
  FOUNDATION_FOREST_GENERATION_BUDGET,
  FOUNDATION_FOREST_RADIUS,
  FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  FOUNDATION_TERRAIN_PATCH_SIZE,
  FOUNDATION_TERRAIN_RETAIN_RADIUS,
  createCenteredPatchPlan,
  selectMissingPatchBatch
} from "../src/domains/prehistoric-rush/rendering-streaming-policy.js";

const start = { x: 0, z: 0 };
const advanced = { x: 192, z: 384 };
const terrainStart = createCenteredPatchPlan(start, {
  size: FOUNDATION_TERRAIN_PATCH_SIZE,
  radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  prefix: "foundation-terrain"
});
const terrainAdvanced = createCenteredPatchPlan(advanced, {
  size: FOUNDATION_TERRAIN_PATCH_SIZE,
  radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  prefix: "foundation-terrain"
});
const forestStart = createCenteredPatchPlan(start, {
  size: FOUNDATION_TERRAIN_PATCH_SIZE,
  radius: FOUNDATION_FOREST_RADIUS,
  prefix: "foundation-forest"
});
const forestAdvanced = createCenteredPatchPlan(advanced, {
  size: FOUNDATION_TERRAIN_PATCH_SIZE,
  radius: FOUNDATION_FOREST_RADIUS,
  prefix: "foundation-forest"
});

const terrainTargetCount = (FOUNDATION_TERRAIN_ACTIVE_RADIUS * 2 + 1) ** 2;
assert.equal(terrainStart.length, terrainTargetCount, "initial world focus must resolve the complete terrain working set");
assert.equal(terrainAdvanced.length, terrainTargetCount, "advanced world focus must resolve the complete terrain working set");
assert.notDeepEqual(terrainAdvanced.map((entry) => entry.id), terrainStart.map((entry) => entry.id), "world focus movement must change the active terrain plan");
assert.equal(new Set(terrainAdvanced.map((entry) => entry.id)).size, terrainTargetCount, "advanced terrain plan must not duplicate patches");
assert.equal(forestStart.length, 25, "initial world focus must resolve the complete 5x5 forest target");
assert.equal(forestAdvanced.length, 25, "advanced world focus must resolve the complete 5x5 forest target");
assert.notDeepEqual(forestAdvanced.map((entry) => entry.id), forestStart.map((entry) => entry.id), "world focus movement must change the forest plan");
assert.ok(FOUNDATION_TERRAIN_RETAIN_RADIUS > FOUNDATION_TERRAIN_ACTIVE_RADIUS, "terrain must retain a safety ring outside the active working set");

const firstBatch = selectMissingPatchBatch(forestStart, [], FOUNDATION_FOREST_GENERATION_BUDGET);
const secondBatch = selectMissingPatchBatch(forestStart, firstBatch.map((entry) => entry.id), FOUNDATION_FOREST_GENERATION_BUDGET);
assert.equal(firstBatch.length, FOUNDATION_FOREST_GENERATION_BUDGET, "forest updates must respect the bounded generation budget");
assert.equal(secondBatch.length, FOUNDATION_FOREST_GENERATION_BUDGET, "forest updates must continue admitting missing patches");
assert.ok(secondBatch.every((entry) => !firstBatch.some((first) => first.id === entry.id)), "forest updates must not regenerate an admitted patch");

const repeatedTerrain = createCenteredPatchPlan(advanced, {
  size: FOUNDATION_TERRAIN_PATCH_SIZE,
  radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  prefix: "foundation-terrain"
});
assert.strictEqual(repeatedTerrain, terrainAdvanced, "same streaming cell must reuse its cached plan instead of rebuilding it");

const nearBoundaryIdle = createCenteredPatchPlan({ x: 40, z: 70, yaw: 0, speed: 0 }, {
  size: FOUNDATION_TERRAIN_PATCH_SIZE,
  radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  prefix: "predictive-terrain"
});
const nearBoundaryRunning = createCenteredPatchPlan({ x: 40, z: 70, yaw: 0, speed: 26 }, {
  size: FOUNDATION_TERRAIN_PATCH_SIZE,
  radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  prefix: "predictive-terrain"
});
assert.notStrictEqual(nearBoundaryRunning, nearBoundaryIdle, "running focus must preload the next streaming cell before the player reaches the boundary");
assert.ok(nearBoundaryRunning.some((entry) => entry.z > Math.max(...nearBoundaryIdle.map((entry) => entry.z))), "predictive terrain must extend the working set in the travel direction");

console.log("world update verification: ok", {
  terrainTargetCount,
  activeRadius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  retainRadius: FOUNDATION_TERRAIN_RETAIN_RADIUS,
  forestTarget: forestAdvanced.length,
  generationBudget: FOUNDATION_FOREST_GENERATION_BUDGET
});
