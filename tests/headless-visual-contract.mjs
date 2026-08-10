import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  PREHISTORIC_TREE_ART_DIRECTION,
  PREHISTORIC_TREE_ART_DIRECTION_REVISION,
  getPrehistoricTreeFoliageTargets,
  isPrehistoricRadialTree
} from "../src/shared/prehistoric-tree-art-direction.js";
import {
  createTreeFoliageCardPlacements
} from "../src/shared/prehistoric-foliage-card-recipes.js";
import { PREHISTORIC_TREE_ARCHETYPES } from "../src/shared/tree-archetype-catalog.js";

assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 12, "visual contract must cover all 12 tree species");
assert.equal(PREHISTORIC_TREE_ART_DIRECTION_REVISION, "chunky-prehistoric-canopy-v1");
assert.equal(
  PREHISTORIC_TREE_ART_DIRECTION.canopy.coreRatio +
    PREHISTORIC_TREE_ART_DIRECTION.canopy.shellRatio +
    PREHISTORIC_TREE_ART_DIRECTION.canopy.fringeRatio,
  1,
  "canopy zones must partition the authored crown"
);

for (const archetype of PREHISTORIC_TREE_ARCHETYPES) {
  const targets = getPrehistoricTreeFoliageTargets(archetype);
  const near = createTreeFoliageCardPlacements(archetype, "near");
  const medium = createTreeFoliageCardPlacements(archetype, "medium");
  assert.equal(near.length, targets.near, `${archetype.id} near placement count`);
  assert.equal(medium.length, targets.medium, `${archetype.id} medium placement count`);
  assert.ok(targets.near >= 64 && targets.near <= 96, `${archetype.id} near target stays in art budget`);
  assert.ok(targets.medium >= 22, `${archetype.id} medium target stays readable`);
  assert.ok(targets.medium / targets.near >= 0.32 && targets.medium / targets.near <= 0.38, `${archetype.id} medium density stays near 35%`);

  for (const placement of [...near, ...medium]) {
    assert.equal(placement.position.length, 3);
    assert.equal(placement.rotation.length, 3);
    assert.equal(placement.scale.length, 2);
    assert.ok([...placement.position, ...placement.rotation, ...placement.scale].every(Number.isFinite), `${archetype.id} placement must be finite`);
    assert.ok(placement.scale.every((value) => value > 0), `${archetype.id} card scale must be positive`);
  }

  const nearCrownTop = Math.max(...near.map((placement) => placement.position[1] + placement.scale[1] * 0.5));
  const nearCrownRadius = Math.max(...near.map((placement) => Math.hypot(placement.position[0], placement.position[2]) + placement.scale[0] * 0.5));
  assert.ok(
    nearCrownTop >= archetype.averageHeight * 0.96,
    `${archetype.id} crown must visually reach the tree top: ${nearCrownTop.toFixed(2)} < ${(archetype.averageHeight * 0.96).toFixed(2)}`
  );
  assert.ok(
    nearCrownRadius >= archetype.crownRadius * 0.82,
    `${archetype.id} crown must occupy its authored silhouette radius: ${nearCrownRadius.toFixed(2)} < ${(archetype.crownRadius * 0.82).toFixed(2)}`
  );

  if (isPrehistoricRadialTree(archetype)) {
    assert.ok(near.every((placement) => placement.mode === "radial-frond"), `${archetype.id} keeps radial-frond identity`);
  } else if (!/spire|araucaria|needle|horsetail|whorl/.test(`${archetype.shape}:${archetype.foliageCardFamily}`)) {
    const modes = new Set(near.map((placement) => placement.mode));
    assert.ok(modes.has("canopy-core"), `${archetype.id} requires canopy core`);
    assert.ok(modes.has("canopy-shell"), `${archetype.id} requires canopy shell`);
    assert.ok(modes.has("canopy-fringe") || modes.has("hanging-edge"), `${archetype.id} requires canopy fringe`);
  }
}

const naturalGeometrySource = await readFile(new URL("../src/render/prehistoric-natural-tree-geometry.js", import.meta.url), "utf8");
assert.match(naturalGeometrySource, /createOrganicSegmentGeometry/);
assert.match(naturalGeometrySource, /groundAoHeight/);
assert.doesNotMatch(naturalGeometrySource, /new THREE\.CylinderGeometry\(segment\.radiusEnd/);

console.log(JSON.stringify({
  status: "PASS",
  species: PREHISTORIC_TREE_ARCHETYPES.length,
  artDirection: PREHISTORIC_TREE_ART_DIRECTION_REVISION,
  nearRange: [64, 96],
  mediumDensity: PREHISTORIC_TREE_ART_DIRECTION.canopy.mediumDensity,
  crownTopMinimum: 0.96,
  silhouetteRadiusMinimum: 0.82
}, null, 2));
