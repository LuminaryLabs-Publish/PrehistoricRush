import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createDrunkRouteGenerator } from "../src/domains/prehistoric-rush/kits/drunk-route-generator.js";
import { FOUNDATION_FOREST_GENERATION_BUDGET } from "../src/domains/prehistoric-rush/rendering-streaming-policy.js";

assert.equal(FOUNDATION_FOREST_GENERATION_BUDGET, 1, "forest streaming must admit one predictive patch per frame");

const route = createDrunkRouteGenerator();
function bruteNearest(x, z) {
  let bestIndex = 0;
  let bestDistanceSq = Infinity;
  for (let index = 0; index < route.samples.length; index += 1) {
    const dx = x - route.samples[index].x;
    const dz = z - route.samples[index].z;
    const distanceSq = dx * dx + dz * dz;
    if (distanceSq < bestDistanceSq) { bestDistanceSq = distanceSq; bestIndex = index; }
  }
  return { bestIndex, bestDistanceSq };
}

let probes = 0;
for (let sampleIndex = 120; sampleIndex < route.samples.length - 120; sampleIndex += 160) {
  const origin = route.samples[sampleIndex];
  for (const dz of [-160, 0, 160]) {
    for (const dx of [-160, 0, 160]) {
      const actual = route.nearest(origin.x + dx, origin.z + dz, 0, route.samples.length);
      const expected = bruteNearest(origin.x + dx, origin.z + dz);
      assert.equal(actual.index, expected.bestIndex, "accelerated full route search must match brute-force nearest index");
      assert.ok(Math.abs(actual.distance * actual.distance - expected.bestDistanceSq) < 1e-7, "accelerated route distance must match brute force");
      probes += 1;
    }
  }
}
const routeSnapshot = route.snapshot();
assert.equal(routeSnapshot.search.monotonicZ, true, "default route must support monotonic exact search acceleration");
const averageVisits = routeSnapshot.search.fullSearchVisits / Math.max(1, routeSnapshot.search.fullSearchCalls);
assert.ok(averageVisits < routeSnapshot.sampleCount / 4, "accelerated full route search should inspect less than one quarter of the route on average near the streaming corridor");

const worldSource = await readFile(new URL("../src/domains/prehistoric-rush/world-implementation.js", import.meta.url), "utf8");
const focusBody = worldSource.match(/function focus\(position = \{\}\) \{([\s\S]*?)\n  \}\n\n  return Object\.freeze/)?.[1] ?? "";
const syncBody = worldSource.match(/function syncCoreWorld\(\) \{([\s\S]*?)\n  \}\n\n  function focus/)?.[1] ?? "";
assert.ok(focusBody.includes("if (!coreWorldPrimed) return syncCoreWorld();"), "gameplay focus must only prime Core World once");
assert.ok(!focusBody.includes("coreWorld.updateWorld"), "gameplay boundary focus must not reconcile the Core World partition synchronously");
assert.ok(syncBody.includes("coreWorld.updateWorld(recipe.id)"), "explicit Core World synchronization must remain available outside the hot boundary path");

console.log("boundary streaming performance: ok", {
  forestGenerationBudget: FOUNDATION_FOREST_GENERATION_BUDGET,
  routeSamples: routeSnapshot.sampleCount,
  routeProbes: probes,
  averageFullSearchVisits: Number(averageVisits.toFixed(1)),
  coreWorldBoundaryReconcile: false
});
