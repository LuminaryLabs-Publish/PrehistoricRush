import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  FOLIAGE_ATLAS_REVISION,
  PREHISTORIC_FOLIAGE_CARD_FAMILIES,
  PREHISTORIC_GROUND_COVER_ARCHETYPES,
  createTreeFoliageCardPlacements,
  foliageFamilyIdForArchetype
} from "../src/shared/prehistoric-foliage-card-recipes.js";
import {
  PREHISTORIC_TREE_ARCHETYPES,
  TREE_FIDELITY_PACKAGE_VERSION
} from "../src/shared/tree-archetype-catalog.js";

assert.equal(FOLIAGE_ATLAS_REVISION, "prehistoric-foliage-cards-v1");
assert.equal(TREE_FIDELITY_PACKAGE_VERSION, "5");
assert.equal(PREHISTORIC_FOLIAGE_CARD_FAMILIES.length, 8);
assert.equal(new Set(PREHISTORIC_FOLIAGE_CARD_FAMILIES.map((family) => family.id)).size, 8);
assert.equal(new Set(PREHISTORIC_FOLIAGE_CARD_FAMILIES.map((family) => family.atlasCell.join(":"))).size, 8);
assert.ok(PREHISTORIC_FOLIAGE_CARD_FAMILIES.every((family) => family.alphaCutoff > 0 && family.alphaCutoff < 1));
assert.ok(PREHISTORIC_FOLIAGE_CARD_FAMILIES.every((family) => family.wind.amplitude >= 0));

assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 12);
for (const archetype of PREHISTORIC_TREE_ARCHETYPES) {
  assert.ok(foliageFamilyIdForArchetype(archetype));
  const near = createTreeFoliageCardPlacements(archetype, "near");
  const medium = createTreeFoliageCardPlacements(archetype, "medium");
  assert.ok(near.length >= medium.length && medium.length >= 3, `${archetype.id} has near and medium card forms`);
  assert.ok(near.every((card) => card.scale[0] > 0 && card.scale[1] > 0));
  assert.ok(near.every((card) => card.wind.amplitude >= 0));
}
assert.ok(PREHISTORIC_TREE_ARCHETYPES.some((tree) => tree.id === "tall-prehistoric-palm"));
assert.ok(PREHISTORIC_TREE_ARCHETYPES.some((tree) => tree.id === "short-jungle-palm"));
assert.equal(PREHISTORIC_GROUND_COVER_ARCHETYPES.length, 6);
assert.equal(new Set(PREHISTORIC_GROUND_COVER_ARCHETYPES.map((entry) => entry.familyId)).size >= 4, true);

const atlasSource = readFileSync(new URL("../src/render/prehistoric-foliage-atlas.js", import.meta.url), "utf8");
const treeSource = readFileSync(new URL("../src/shared/tree-archetype-catalog.js", import.meta.url), "utf8");
const treeLayerSource = readFileSync(new URL("../src/render/three-lush-foliage-layer.js", import.meta.url), "utf8");
const groundLayerSource = readFileSync(new URL("../src/render/three-ground-cover-layer.js", import.meta.url), "utf8");
const wrapperSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");
const atmosphereSource = readFileSync(new URL("../src/render/lush-jungle-atmosphere.js", import.meta.url), "utf8");

assert.match(atlasSource, /createPrehistoricFoliageAtlas/);
assert.match(atlasSource, /CanvasTexture/);
assert.match(atlasSource, /alphaTest/);
assert.match(atlasSource, /drawPalm/);
assert.match(atlasSource, /drawFern/);
assert.match(atlasSource, /drawBroadleaf/);
assert.match(treeSource, /attachPrehistoricTreeFoliageSprites/);
assert.match(treeSource, /createPalmWood/);
assert.doesNotMatch(treeSource, /new THREE\.IcosahedronGeometry\([^)]*\).*crown/s);
assert.match(treeLayerSource, /MeshStandardMaterial/);
assert.match(treeLayerSource, /alphaTest: family\.alphaCutoff/);
assert.match(treeLayerSource, /THREE\.DoubleSide/);
assert.match(treeLayerSource, /foliageWind/);
assert.match(treeLayerSource, /nearCards/);
assert.match(treeLayerSource, /mediumCards/);
assert.match(groundLayerSource, /patch\.groundCover/);
assert.match(groundLayerSource, /crossedGeometry/);
assert.match(wrapperSource, /createThreeLushFoliageLayer/);
assert.match(wrapperSource, /createThreeGroundCoverLayer/);
assert.match(wrapperSource, /createPrehistoricFoliageAtlas/);
assert.match(wrapperSource, /lushVegetationFrameAck/);
assert.match(atmosphereSource, /FogExp2/);
assert.match(atmosphereSource, /toneMappingExposure/);

console.log("alpha-cutout foliage cards, palms, ground cover, fidelity, and atmosphere contracts passed");
