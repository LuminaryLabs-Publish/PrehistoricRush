import assert from "node:assert/strict";
import {
  FOLIAGE_ATLAS_REVISION,
  PREHISTORIC_FOLIAGE_CARD_FAMILIES,
  PREHISTORIC_GROUND_COVER_ARCHETYPES,
  createTreeFoliageCardPlacements
} from "../src/shared/prehistoric-foliage-card-recipes.js";
import { PREHISTORIC_TREE_ARCHETYPES } from "../src/shared/tree-archetype-catalog.js";

const FAMILY_IDS = new Set(PREHISTORIC_FOLIAGE_CARD_FAMILIES.map((entry) => entry.id));
const SUPPORTED_TREE_MODES = new Set([
  "frond-burst",
  "branch-cluster",
  "canopy-shell",
  "crown-tier",
  "dangling-edge"
]);

function inRange(value, range) {
  return Number(value) >= Number(range[0]) && Number(value) <= Number(range[1]);
}

function reviewTree(archetype) {
  const near = createTreeFoliageCardPlacements(archetype, "near");
  const repeated = createTreeFoliageCardPlacements(archetype, "near");
  const medium = createTreeFoliageCardPlacements(archetype, "medium");
  assert.deepEqual(near, repeated, `${archetype.id} foliage generation is deterministic`);
  assert.ok(near.length >= medium.length, `${archetype.id} reduces foliage at medium fidelity`);
  assert.ok(medium.length >= 3, `${archetype.id} retains a readable medium silhouette`);

  const modes = new Set();
  for (const placement of near) {
    assert.ok(FAMILY_IDS.has(placement.familyId), `${archetype.id} references registered family ${placement.familyId}`);
    assert.ok(SUPPORTED_TREE_MODES.has(placement.mode), `${archetype.id} uses supported placement mode ${placement.mode}`);
    assert.equal(placement.position.length, 3, `${archetype.id} placement has a 3D anchor`);
    assert.equal(placement.rotation.length, 3, `${archetype.id} placement has a 3D orientation`);
    assert.equal(placement.scale.length, 2, `${archetype.id} placement has card dimensions`);
    assert.ok(placement.scale[0] > 0 && placement.scale[1] > 0, `${archetype.id} cards have positive dimensions`);
    assert.ok(Math.hypot(placement.position[0], placement.position[2]) <= archetype.crownRadius * 1.2 + 0.001, `${archetype.id} cards remain inside the crown envelope`);
    assert.ok(placement.position[1] >= -0.01 && placement.position[1] <= archetype.averageHeight + archetype.crownHeight * 0.75, `${archetype.id} cards remain within the vertical growth envelope`);
    assert.ok(placement.wind.amplitude >= 0 && placement.wind.frequency >= 0, `${archetype.id} cards carry valid wind intent`);
    assert.ok(Number.isFinite(placement.seed), `${archetype.id} cards carry deterministic seed data`);
    modes.add(placement.mode);
  }

  const token = `${archetype.shape}:${archetype.foliageCardFamily}`;
  const radial = /palm|fern|cycad/.test(token);
  if (radial) assert.ok(modes.has("frond-burst"), `${archetype.id} resolves to a radial frond structure`);
  else if (/spire|araucaria|needle|horsetail|whorl/.test(token)) assert.ok(modes.has("crown-tier"), `${archetype.id} resolves to a tiered crown structure`);
  else assert.ok(modes.has("branch-cluster") || modes.has("canopy-shell"), `${archetype.id} resolves to branch-supported canopy clusters`);
  if (!radial && Number(archetype.hangingFoliage ?? 0) > 0.08) assert.ok(modes.has("dangling-edge"), `${archetype.id} realizes declared hanging foliage`);

  return Object.freeze({
    id: archetype.id,
    shape: archetype.shape,
    familyId: archetype.foliageCardFamily,
    nearCards: near.length,
    mediumCards: medium.length,
    modes: Object.freeze([...modes].sort()),
    crownRadius: archetype.crownRadius,
    averageHeight: archetype.averageHeight
  });
}

function reviewGroundCover(archetype) {
  assert.ok(FAMILY_IDS.has(archetype.familyId), `${archetype.id} references registered family ${archetype.familyId}`);
  assert.ok(archetype.averageHeight > 0 && archetype.averageWidth > 0, `${archetype.id} has positive production dimensions`);
  assert.ok(Number.isInteger(archetype.crossedPlanes) && archetype.crossedPlanes >= 2, `${archetype.id} uses enough crossed planes for volume`);
  assert.ok(archetype.distributionWeight > 0, `${archetype.id} has a non-zero ecological weight`);
  for (const key of ["moisture", "elevation", "slope", "clusterStrength"]) {
    assert.ok(Number(archetype.ecology[key]) >= 0 && Number(archetype.ecology[key]) <= 1, `${archetype.id} ecology.${key} is normalized`);
  }
  for (const key of ["yawDegrees", "leanXDegrees", "leanZDegrees", "uniformScale", "heightScale", "crownScale", "groundSink", "hueShift", "roughnessAdd", "valueShift"]) {
    assert.ok(Array.isArray(archetype.variation[key]) && archetype.variation[key].length === 2, `${archetype.id} variation.${key} is a range`);
    assert.ok(inRange(archetype.variation[key][0], archetype.variation[key]) && inRange(archetype.variation[key][1], archetype.variation[key]), `${archetype.id} variation.${key} is ordered`);
  }
  return Object.freeze({
    id: archetype.id,
    familyId: archetype.familyId,
    averageHeight: archetype.averageHeight,
    averageWidth: archetype.averageWidth,
    crossedPlanes: archetype.crossedPlanes,
    moisture: archetype.ecology.moisture,
    slope: archetype.ecology.slope
  });
}

assert.equal(FOLIAGE_ATLAS_REVISION, "prehistoric-foliage-cards-v2");
assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 12);
assert.equal(PREHISTORIC_GROUND_COVER_ARCHETYPES.length, 6);

const treeReviews = PREHISTORIC_TREE_ARCHETYPES.map(reviewTree);
const groundCoverReviews = PREHISTORIC_GROUND_COVER_ARCHETYPES.map(reviewGroundCover);
assert.equal(new Set(treeReviews.map((entry) => `${entry.shape}:${entry.familyId}`)).size >= 9, true, "the tree catalog exposes distinct production silhouettes");
assert.equal(new Set(groundCoverReviews.map((entry) => entry.id)).size, groundCoverReviews.length);
assert.doesNotThrow(() => structuredClone({ treeReviews, groundCoverReviews }));

console.log("vegetation heuristic generate-review-test loop passed", {
  treeCount: treeReviews.length,
  groundCoverCount: groundCoverReviews.length,
  trees: treeReviews,
  groundCover: groundCoverReviews
});
