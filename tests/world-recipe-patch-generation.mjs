import assert from "node:assert/strict";
import { createPrehistoricWorldPatchGenerator } from "../src/world/prehistoric-world-patch-generator.js";
import { getPrehistoricRushWorldRecipe } from "../src/domains/prehistoric-rush/world-recipes.js";

const routeSamples = Array.from({ length: 9 }, (_, index) => ({
  x: 0,
  z: index * 18,
  width: 3.1
}));
const vegetation = {
  selectSpecies() { return null; },
  createInstanceDescriptor() { throw new Error("unexpected vegetation instance"); },
  selectGroundCoverSpecies() { return null; }
};

function make(worldId) {
  const worldRecipe = getPrehistoricRushWorldRecipe(worldId);
  return createPrehistoricWorldPatchGenerator({
    worldRecipe,
    routeSamples,
    vegetation,
    treeTypes: [],
    groundCoverArchetypes: [],
    config: {
      seed: worldRecipe.seed,
      chunk: 56,
      segments: 32,
      trees: 0,
      grass: 0,
      groundCover: 0,
      shardsPerPatch: 0
    }
  })({ x: 2, z: 3, patchId: "2:3", worldSeed: String(worldRecipe.seed) });
}

const jurassic = make("jurassic-valley");
const desert = make("desert-plains");
const volcanic = make("volcanic-highlands");

assert.equal(jurassic.worldRecipe.id, "jurassic-valley");
assert.equal(desert.worldRecipe.id, "desert-plains");
assert.equal(volcanic.worldRecipe.id, "volcanic-highlands");
assert.notDeepEqual(Array.from(jurassic.terrain.heights.slice(0, 32)), Array.from(desert.terrain.heights.slice(0, 32)));
assert.notDeepEqual(Array.from(desert.terrain.heights.slice(0, 32)), Array.from(volcanic.terrain.heights.slice(0, 32)));
assert.notDeepEqual(Array.from(jurassic.terrain.colors.slice(0, 24)), Array.from(desert.terrain.colors.slice(0, 24)));
assert.match(desert.terrain.materialRevision, /desert-plains/);
assert.match(volcanic.vegetationDensityPolicy, /volcanic-highlands/);
assert.equal(jurassic.terrain.heights.buffer instanceof ArrayBuffer, true);
assert.equal(jurassic.terrain.normals.buffer instanceof ArrayBuffer, true);

console.log("world recipe patch generation: ok");
