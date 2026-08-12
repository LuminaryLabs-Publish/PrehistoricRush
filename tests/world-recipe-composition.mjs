import assert from "node:assert/strict";
import {
  DEFAULT_PREHISTORIC_WORLD_ID,
  PREHISTORIC_WORLD_RECIPES,
  createPrehistoricRushWorldRuntimeConfig,
  getPrehistoricRushWorldRecipe,
  resolvePrehistoricRushWorldId
} from "../src/domains/prehistoric-rush/world-recipes.js";

assert.equal(PREHISTORIC_WORLD_RECIPES.length, 5, "PrehistoricRush should expose exactly five world recipes.");
assert.equal(new Set(PREHISTORIC_WORLD_RECIPES.map((recipe) => recipe.id)).size, 5, "World recipe ids must be unique.");
assert.equal(new Set(PREHISTORIC_WORLD_RECIPES.map((recipe) => recipe.seed)).size, 5, "World recipe seeds must be unique.");

for (const recipe of PREHISTORIC_WORLD_RECIPES) {
  assert.ok(recipe.name);
  assert.ok(recipe.description);
  assert.ok(recipe.revision >= 1);
  assert.ok(recipe.runtime.goalDistance > 0);
  assert.ok(recipe.route.segmentLength > 0);
  assert.ok(recipe.presentation.atmosphere);
  assert.equal(recipe.presentation.terrainColor.length, 3);
  assert.ok(recipe.presentation.terrainColorMix >= 0 && recipe.presentation.terrainColorMix <= 1);
}

assert.equal(getPrehistoricRushWorldRecipe("missing-world").id, DEFAULT_PREHISTORIC_WORLD_ID);
assert.equal(
  resolvePrehistoricRushWorldId({ href: "https://example.test/game.html?world=swamp-basin" }),
  "swamp-basin"
);
assert.equal(
  resolvePrehistoricRushWorldId({ href: "https://example.test/game.html?world=missing-world" }),
  DEFAULT_PREHISTORIC_WORLD_ID
);

const desert = getPrehistoricRushWorldRecipe("desert-plains");
const runtime = createPrehistoricRushWorldRuntimeConfig(desert, { patchSize: 56, sourceResolution: 32 });
assert.deepEqual(runtime, {
  worldId: "desert-plains",
  worldRevision: 1,
  seed: desert.seed,
  chunk: 56,
  segments: 32,
  trees: desert.runtime.trees,
  grass: desert.runtime.grass,
  groundCover: desert.runtime.groundCover,
  goal: desert.runtime.goalDistance
});

console.log("world recipe composition: ok");
