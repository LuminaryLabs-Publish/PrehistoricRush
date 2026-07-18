import assert from "node:assert/strict";
import { createPrehistoricPatchGenerator } from "../src/world/prehistoric-patch-generator.js";
import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES
} from "../src/shared/tree-archetype-catalog.js";
import {
  FOLIAGE_ATLAS_REVISION,
  PREHISTORIC_GROUND_COVER_ARCHETYPES
} from "../src/shared/prehistoric-foliage-card-recipes.js";
import { createVegetationPlacementFixture } from "./helpers/vegetation-placement-fixture.mjs";

const routeSamples = Array.from({ length: 600 }, (_, index) => ({
  x: 0,
  z: (index - 300) * 3,
  width: 6
}));
const options = {
  config: { seed: 238991, chunk: 56, trees: 20, grass: 0, groundCover: 20, shardsPerPatch: 0 },
  treeTypes: PREHISTORIC_TREE_TYPES,
  groundCoverArchetypes: PREHISTORIC_GROUND_COVER_ARCHETYPES,
  vegetation: createVegetationPlacementFixture(PREHISTORIC_TREE_ARCHETYPES, PREHISTORIC_GROUND_COVER_ARCHETYPES),
  routeSamples,
  foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
};
const generator = createPrehistoricPatchGenerator(options);
const repeatGenerator = createPrehistoricPatchGenerator(options);
const first = generator({ x: 3, z: -2, patchId: "3:-2", worldSeed: "fixture" });
const repeated = repeatGenerator({ x: 3, z: -2, patchId: "3:-2", worldSeed: "fixture" });
assert.deepEqual(first.trees, repeated.trees, "tree spawning is deterministic");
assert.deepEqual(first.groundCover, repeated.groundCover, "ground-cover spawning is deterministic");
assert.deepEqual(first.colliders, repeated.colliders, "tree collision spawning is deterministic");
assert.equal(first.vegetationDensityPolicy, "production-patches-v1");
assert.equal(first.vegetationRevision, FOLIAGE_ATLAS_REVISION);

const species = new Set();
const groundSpecies = new Set();
let treeCount = 0;
let groundCoverCount = 0;
for (let chunkX = -5; chunkX <= 5; chunkX += 1) {
  for (let chunkZ = -5; chunkZ <= 5; chunkZ += 1) {
    const patch = generator({ x: chunkX, z: chunkZ, patchId: `${chunkX}:${chunkZ}`, worldSeed: "fixture" });
    const colliderById = new Map(patch.colliders.map((collider) => [collider.id, collider]));
    for (const type of patch.trees) {
      for (const trunk of type.trunks) {
        treeCount += 1;
        const variation = trunk.metadata.variation;
        const instance = trunk.metadata.vegetationInstance;
        const collider = colliderById.get(trunk.metadata.treeId);
        species.add(trunk.metadata.speciesId);
        assert.ok(collider, "every visible tree retains one stable collision proxy");
        assert.equal(instance.schema, "nexus-vegetation-instance/1", "spawn output carries the Vegetation instance contract");
        assert.equal(instance.speciesId, trunk.metadata.speciesId);
        assert.ok(variation.yawDegrees >= 0 && variation.yawDegrees < 360);
        assert.ok(variation.leanXDegrees >= -5 && variation.leanXDegrees <= 5);
        assert.ok(variation.leanZDegrees >= -5 && variation.leanZDegrees <= 5);
        assert.ok(variation.uniformScale >= 0.84 && variation.uniformScale <= 1.18);
        assert.ok(variation.heightScale >= 0.92 && variation.heightScale <= 1.12);
        assert.ok(variation.crownScale >= 0.9 && variation.crownScale <= 1.1);
        assert.ok(variation.groundSink >= 0.1 && variation.groundSink <= 0.5);
        assert.ok(variation.hueShift >= -0.05 && variation.hueShift <= 0.05);
        assert.ok(variation.roughnessAdd >= -0.06 && variation.roughnessAdd <= 0.06);
        assert.equal(Number((collider.y - variation.groundPosition[1]).toFixed(6)), Number(variation.groundSink.toFixed(6)), "visual sinking does not move collision authority");
      }
    }
    for (const cover of patch.groundCover) {
      groundCoverCount += 1;
      groundSpecies.add(cover.speciesId);
      assert.equal(cover.vegetationInstance.schema, "nexus-vegetation-instance/1");
      assert.equal(cover.vegetationInstance.speciesId, cover.speciesId);
      assert.equal(cover.matrix.length, 16);
      assert.equal(cover.tint.length, 3);
      assert.ok(cover.wind.amplitude >= 0);
      assert.equal(cover.metadata.densityPolicy, "production-patches-v1");
      assert.equal(colliderById.has(cover.id), false, "decorative ground cover does not create collision proxies");
    }
  }
}

assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 12);
assert.equal(PREHISTORIC_TREE_TYPES.length, 12);
assert.equal(PREHISTORIC_GROUND_COVER_ARCHETYPES.length, 6);
assert.ok(treeCount > 300, "fixture exercises a clustered deterministic forest");
assert.ok(groundCoverCount > 300, "fixture exercises clustered domain-backed ground cover");
assert.equal(species.size, 12, "vegetation placement admits all tree species");
assert.equal(groundSpecies.size, 6, "vegetation placement admits all ground-cover species");
assert.equal(new Set(PREHISTORIC_TREE_ARCHETYPES.map((tree) => tree.shape)).size, 12, "each archetype has a distinct silhouette recipe");
assert.equal(new Set(PREHISTORIC_TREE_ARCHETYPES.map((tree) => tree.foliageColor)).size, 12, "each archetype has a distinct foliage palette");
assert.equal(new Set(PREHISTORIC_TREE_ARCHETYPES.map((tree) => tree.averageHeight)).size, 12, "each archetype owns a distinct average height");

console.log("tree and ground-cover diversity with production density variation passed");
