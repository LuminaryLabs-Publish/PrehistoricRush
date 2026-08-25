import assert from "node:assert/strict";
import {
  FOUNDATION_FOREST_GENERATION_BUDGET,
  FOUNDATION_FOREST_RADIUS,
  FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  FOUNDATION_TERRAIN_PATCH_SIZE,
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

assert.equal(terrainStart.length, 9, "initial world focus must resolve a complete 3x3 terrain ring");
assert.equal(terrainAdvanced.length, 9, "advanced world focus must resolve a complete 3x3 terrain ring");
assert.notDeepEqual(terrainAdvanced.map((entry) => entry.id), terrainStart.map((entry) => entry.id), "world focus movement must change the active terrain plan");
assert.equal(new Set(terrainAdvanced.map((entry) => entry.id)).size, 9, "advanced terrain plan must not duplicate patches");
assert.equal(forestStart.length, 25, "initial world focus must resolve the complete 5x5 forest target");
assert.equal(forestAdvanced.length, 25, "advanced world focus must resolve the complete 5x5 forest target");
assert.notDeepEqual(forestAdvanced.map((entry) => entry.id), forestStart.map((entry) => entry.id), "world focus movement must change the forest plan");

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
assert.deepEqual(repeatedTerrain, terrainAdvanced, "same world focus must reproduce the same terrain plan");
console.log("world update verification: ok", {
  terrainStart: terrainStart.map((entry) => entry.id),
  terrainAdvanced: terrainAdvanced.map((entry) => entry.id),
  forestTarget: forestAdvanced.length,
  generationBudget: FOUNDATION_FOREST_GENERATION_BUDGET
});
