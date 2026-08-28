import assert from "node:assert/strict";
import { createElevationCacheSampler } from "../src/domains/prehistoric-rush/world-implementation.js";
import {
  projectVegetationPatchToFoundation,
  sampleFoundationTerrainNormal
} from "../src/domains/prehistoric-rush/rendering-implementation.js";

let expensiveCalls = 0;
const sampler = createElevationCacheSampler((x, z) => {
  expensiveCalls += 1;
  return x * 0.25 + z * 0.5;
});

const grid = 81;
for (let z = 0; z < grid; z += 1) for (let x = 0; x < grid; x += 1) sampler.sample(-192 + x * 6, -192 + z * 6);
assert.equal(expensiveCalls, 6561, "first 81x81 terrain grid should sample every point once");

for (let z = 0; z < grid; z += 1) for (let x = 0; x < grid; x += 1) sampler.sample(-192 + x * 6, -192 + z * 6);
assert.equal(expensiveCalls, 6561, "rebuilding the same terrain grid must perform zero additional expensive elevation evaluations");

for (let z = 0; z < grid; z += 1) for (let x = 0; x < grid; x += 1) sampler.sample(-96 + x * 6, -192 + z * 6);
assert.equal(expensiveCalls, 6561 + 16 * 81, "moving one 96-unit cell should evaluate only the newly exposed 16-column strip");

const snapshot = sampler.snapshot();
assert.equal(snapshot.misses, expensiveCalls);
assert.equal(snapshot.hits, 6561 + 65 * 81);

const planarWorld = { sampleElevation(x, z) { return x * 0.25 + z * 0.5 - 45.8; } };
const sharedLeft = sampleFoundationTerrainNormal(planarWorld, 96, 48, 6);
const sharedRight = sampleFoundationTerrainNormal(planarWorld, 96, 48, 6);
assert.deepEqual(sharedLeft, sharedRight, "adjacent terrain patches must derive identical normals at a shared Foundation coordinate");
assert.ok(Math.abs(Math.hypot(...sharedLeft) - 1) < 1e-12, "Foundation terrain normals must be normalized");

const treeVariation = { groundPosition: [12, 0.5, 8], groundSink: 0.25 };
const patch = {
  trees: [{
    trunks: [{ id: "tree:trunk", matrix: Array(16).fill(0), bounds: { min: [10, 0.5, 6], max: [14, 20.5, 10] }, metadata: { treeId: "tree", variation: treeVariation } }],
    crowns: [{ id: "tree:crown", matrix: Array(16).fill(0), bounds: { min: [7, 15.5, 3], max: [17, 30.5, 13] }, metadata: { treeId: "tree", variation: treeVariation } }]
  }],
  groundCover: [{ matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 0.2, 6, 1], bounds: { min: [4, 0.2, 5], max: [6, 2.2, 7] }, metadata: { visualGroundSink: 0.1 } }],
  grass: [{ matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 7, 0.3, 9, 1] }],
  colliders: [{ x: 12, y: 0.75, z: 8 }],
  pickups: [{ x: 3, y: 1.4, z: 4 }]
};
patch.trees[0].trunks[0].matrix[13] = 10.5;
patch.trees[0].crowns[0].matrix[13] = 23;
projectVegetationPatchToFoundation(planarWorld, patch);
const treeGround = planarWorld.sampleElevation(12, 8) - 0.25;
assert.equal(treeVariation.groundPosition[1], treeGround, "tree metadata must use authoritative Foundation elevation");
assert.equal(patch.trees[0].trunks[0].bounds.min[1], treeGround, "tree bounds must be rebased with the instance");
assert.equal(patch.grass[0].matrix[13], planarWorld.sampleElevation(7, 9), "grass must sit on Foundation elevation");
assert.equal(patch.colliders[0].y, planarWorld.sampleElevation(12, 8), "tree collider elevation must follow Foundation");
assert.equal(patch.pickups[0].y, planarWorld.sampleElevation(3, 4) + 1.15, "pickup clearance must follow Foundation");
const projectedTreeY = patch.trees[0].trunks[0].matrix[13];
projectVegetationPatchToFoundation(planarWorld, patch);
assert.equal(patch.trees[0].trunks[0].matrix[13], projectedTreeY, "Foundation projection must be idempotent");
console.log(JSON.stringify({ status: "PASS", expensiveCalls, cache: snapshot }, null, 2));
