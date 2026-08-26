import assert from "node:assert/strict";
import { createDrunkRouteGenerator } from "../src/domains/prehistoric-rush/kits/drunk-route-generator.js";
import {
  DEFAULT_PREHISTORIC_WORLD_ID,
  getPrehistoricRushWorldRecipe
} from "../src/domains/prehistoric-rush/world-recipes.js";

const route = createDrunkRouteGenerator();
assert.deepEqual(route.snapshot(), {
  id: "drunk-route-generator",
  seed: 238991,
  controlPointCount: 260,
  sampleCount: 2072,
  pathHalfWidth: 3.1,
  vergeWidth: 3.2,
  search: { monotonicZ: true, fullSearchCalls: 0, fullSearchVisits: 0 }
});

const start = route.nearest(0, -18, 0, 120);
assert.equal(start.index, 0);
assert.equal(start.distance, 0);
assert.equal(route.classify(0, 3.1), "path");
assert.equal(route.classify(4, 3.1), "edge");
assert.equal(route.classify(6, 3.1), "verge");
assert.equal(route.classify(7, 3.1), "forest");

assert.equal(DEFAULT_PREHISTORIC_WORLD_ID, "jurassic-valley");
const recipe = getPrehistoricRushWorldRecipe();
assert.deepEqual({
  id: recipe.id,
  revision: recipe.revision,
  seed: recipe.seed,
  terrain: recipe.terrain,
  route: recipe.route,
  runtime: recipe.runtime
}, {
  id: "jurassic-valley",
  revision: 1,
  seed: 238991,
  terrain: { profile: "valley-forest", relief: 0.56, roughness: 0.46, plains: 0.28 },
  route: { segmentLength: 18, sampleSpacing: 2.5, pathHalfWidth: 3.1, vergeWidth: 3.2 },
  runtime: { trees: 7, grass: 96, groundCover: 36, goalDistance: 3600 }
});

console.log("P0 world boundary baseline: ok");
