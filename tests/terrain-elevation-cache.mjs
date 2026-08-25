import assert from "node:assert/strict";
import { createElevationCacheSampler } from "../src/domains/prehistoric-rush/world-implementation.js";

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
console.log(JSON.stringify({ status: "PASS", expensiveCalls, cache: snapshot }, null, 2));
