import assert from "node:assert/strict";
import { createPrehistoricPatchGenerator } from "../src/world/prehistoric-patch-generator.js";
import { PREHISTORIC_TREE_ARCHETYPES, PREHISTORIC_TREE_TYPES } from "../src/shared/tree-archetype-catalog.js";
import { FOLIAGE_ATLAS_REVISION, PREHISTORIC_GROUND_COVER_ARCHETYPES } from "../src/shared/prehistoric-foliage-card-recipes.js";
import { createVegetationPlacementFixture } from "./helpers/vegetation-placement-fixture.mjs";

const routeSamples = Array.from({ length: 800 }, (_, index) => ({
  x: 0,
  z: (index - 400) * 3,
  width: 6
}));

const vegetation = createVegetationPlacementFixture(PREHISTORIC_TREE_ARCHETYPES, PREHISTORIC_GROUND_COVER_ARCHETYPES);
let deterministicMismatches = 0;
let invalidPlacements = 0;
let impossibleRouteBlocks = 0;
let totalTrees = 0;
let totalGroundCover = 0;
const species = new Set();

for (let seed = 0; seed < 256; seed += 1) {
  const config = { seed: 238991 + seed * 7919, chunk: 56, trees: 20, grass: 0, groundCover: 12, shardsPerPatch: 0 };
  const options = {
    config,
    treeTypes: PREHISTORIC_TREE_TYPES,
    groundCoverArchetypes: PREHISTORIC_GROUND_COVER_ARCHETYPES,
    vegetation,
    routeSamples,
    foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
  };
  const x = (seed % 7) - 3;
  const z = (Math.floor(seed / 7) % 9) - 4;
  const request = { x, z, patchId: `${x}:${z}`, worldSeed: `sweep-${seed}` };
  const patch = createPrehistoricPatchGenerator(options)(request);
  const repeated = createPrehistoricPatchGenerator(options)(request);

  try {
    assert.deepEqual(patch.trees, repeated.trees);
    assert.deepEqual(patch.groundCover, repeated.groundCover);
    assert.deepEqual(patch.colliders, repeated.colliders);
  } catch {
    deterministicMismatches += 1;
  }

  const colliderById = new Map(patch.colliders.map((entry) => [entry.id, entry]));
  for (const type of patch.trees) {
    for (const trunk of type.trunks) {
      totalTrees += 1;
      species.add(trunk.metadata.speciesId);
      const collider = colliderById.get(trunk.metadata.treeId);
      const bounds = trunk.bounds;
      const finite = collider && [collider.x, collider.y, collider.z, collider.radius, ...bounds.min, ...bounds.max].every(Number.isFinite);
      if (!finite || !(collider.radius > 0)) invalidPlacements += 1;
      const clearEdge = Math.abs(Number(collider.x)) - Number(collider.radius);
      if (clearEdge < 5.5) impossibleRouteBlocks += 1;
      if (collider) {
        assert.equal(collider.shape, "ball");
        assert.ok(collider.tags.includes("tree"));
        assert.ok(collider.tags.includes("hazard"));
      }
    }
  }

  for (const cover of patch.groundCover) {
    totalGroundCover += 1;
    if (!Array.isArray(cover.matrix) || cover.matrix.length !== 16 || !cover.matrix.every(Number.isFinite)) invalidPlacements += 1;
    if (colliderById.has(cover.id)) invalidPlacements += 1;
  }
}

assert.equal(deterministicMismatches, 0, "all seed-sweep patches replay identically");
assert.equal(invalidPlacements, 0, "all seed-sweep placements remain finite and contract-valid");
assert.equal(impossibleRouteBlocks, 0, "tree collision proxies stay outside the protected racing corridor");
assert.ok(totalTrees > 500, "seed sweep exercises a substantial tree population");
assert.ok(totalGroundCover > 300, "seed sweep exercises substantial ground cover");
assert.equal(species.size, 12, "seed sweep admits all 12 tree archetypes");

console.log(JSON.stringify({
  status: "PASS",
  seeds: 256,
  deterministicMismatches,
  invalidPlacements,
  impossibleRouteBlocks,
  totalTrees,
  totalGroundCover,
  speciesCount: species.size
}, null, 2));
