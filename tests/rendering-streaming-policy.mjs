import assert from "node:assert/strict";
import {
  FOUNDATION_FOREST_GENERATION_BUDGET,
  FOUNDATION_FOREST_RADIUS,
  FOUNDATION_WORKER_STREAMING_POLICY,
  FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  FOUNDATION_TERRAIN_PATCH_SIZE,
  createCenteredPatchPlan,
  selectMissingPatchBatch
} from "../src/domains/prehistoric-rush/rendering-streaming-policy.js";

const terrain = createCenteredPatchPlan({ x: 0, z: 0 }, {
  size: FOUNDATION_TERRAIN_PATCH_SIZE,
  radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  prefix: "foundation-terrain"
});
assert.equal(terrain.length, 25, "playable startup resolves the configured 5x5 terrain ring");
assert.equal(terrain[0].id, "foundation-terrain:0:0", "nearest terrain cell is planned first");

const forest = createCenteredPatchPlan({ x: 0, z: 0 }, {
  size: FOUNDATION_TERRAIN_PATCH_SIZE,
  radius: FOUNDATION_FOREST_RADIUS,
  prefix: "foundation-forest"
});
assert.equal(forest.length, 25, "full local forest remains a 5x5 target");
const firstBatch = selectMissingPatchBatch(forest, [], FOUNDATION_FOREST_GENERATION_BUDGET);
assert.equal(firstBatch.length, FOUNDATION_WORKER_STREAMING_POLICY.activationBudget, "forest activation uses the centralized frame budget");
assert.equal(firstBatch[0].id, "foundation-forest:0:0", "forest fills from the player outward");
const secondBatch = selectMissingPatchBatch(forest, new Set(firstBatch.map((entry) => entry.id)), FOUNDATION_FOREST_GENERATION_BUDGET);
assert.equal(secondBatch.length, FOUNDATION_WORKER_STREAMING_POLICY.activationBudget);
assert.ok(secondBatch.every((entry) => !firstBatch.some((first) => first.id === entry.id)), "stream batches do not regenerate admitted cells");

console.log("PrehistoricRush rendering streaming policy passed.");
