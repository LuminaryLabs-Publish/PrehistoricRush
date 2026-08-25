import assert from "node:assert/strict";
import { createTerrainTransitionPrewarmer } from "../src/domains/prehistoric-rush/world-implementation.js";

let calls = 0;
const seen = new Set();
const prewarmer = createTerrainTransitionPrewarmer((x, z) => {
  calls += 1;
  seen.add(`${x}:${z}`);
  return x * 0.01 + z * 0.02;
});

const cardinal = prewarmer.queueTransition(0, 0, 0, 1);
assert.equal(cardinal.pending, 1296, "one-cell cardinal transition should expose exactly one 16x81 strip");
let maxSlice = 0;
while (prewarmer.snapshot().pending > 0) {
  const result = prewarmer.drain(12);
  maxSlice = Math.max(maxSlice, result.processed);
}
assert.equal(calls, 1296, "prewarmer should sample each newly exposed terrain point once");
assert.equal(seen.size, 1296, "prewarmer should not duplicate coordinates within a transition");
assert.ok(maxSlice <= 12, "terrain prewarm work must stay inside the per-slice budget");

calls = 0;
seen.clear();
const diagonal = prewarmer.queueTransition(0, 0, 1, 1);
assert.equal(diagonal.pending, 2336, "diagonal transition should expose two strips without duplicating their corner");
while (prewarmer.snapshot().pending > 0) prewarmer.drain(12);
assert.equal(calls, 2336);
assert.equal(seen.size, 2336);

console.log("terrain transition prewarm: ok", { cardinal: 1296, diagonal: 2336, maxSlice });
