import assert from "node:assert/strict";
import {
  createPrehistoricVegetationGeneratorOptions,
  createPrehistoricVegetationRuntime,
  registerPrehistoricVegetationCatalog
} from "../src/shared/prehistoric-vegetation-domain.js";
import { createPrehistoricTreeFidelityAssetRuntime } from "../src/shared/prehistoric-tree-fidelity-runtime.js";
import {
  createVegetationTreeFidelityProvider,
  replaceTreeFidelityProviderWithVegetation
} from "../src/shared/vegetation-tree-fidelity-provider.js";
import {
  PREHISTORIC_TREE_GROWTH_REVISION,
  preparePrehistoricTreeGrowthPlans,
  validatePrehistoricTreeGrowthPlans
} from "../src/shared/prehistoric-tree-growth-compute.js";
import {
  FOLIAGE_ATLAS_REVISION,
  PREHISTORIC_FOLIAGE_CARD_FAMILIES,
  PREHISTORIC_GROUND_COVER_ARCHETYPES,
  createTreeFoliageCardPlacements
} from "../src/shared/prehistoric-foliage-card-recipes.js";
import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES
} from "../src/shared/tree-archetype-catalog.js";

for (const [name, value] of Object.entries({
  createPrehistoricVegetationGeneratorOptions,
  createPrehistoricVegetationRuntime,
  registerPrehistoricVegetationCatalog,
  createPrehistoricTreeFidelityAssetRuntime,
  createVegetationTreeFidelityProvider,
  replaceTreeFidelityProviderWithVegetation,
  preparePrehistoricTreeGrowthPlans,
  validatePrehistoricTreeGrowthPlans,
  createTreeFoliageCardPlacements
})) {
  assert.equal(typeof value, "function", `${name} resolves through the product module graph`);
}

assert.equal(PREHISTORIC_TREE_GROWTH_REVISION, "natural-growth-v1");
assert.equal(FOLIAGE_ATLAS_REVISION, "prehistoric-foliage-cards-v2");
assert.equal(PREHISTORIC_FOLIAGE_CARD_FAMILIES.length, 8);
assert.equal(PREHISTORIC_GROUND_COVER_ARCHETYPES.length, 6);
assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 12);
assert.equal(PREHISTORIC_TREE_TYPES.length, 12);
assert.doesNotThrow(() => structuredClone({
  archetypes: PREHISTORIC_TREE_ARCHETYPES,
  treeTypes: PREHISTORIC_TREE_TYPES,
  cardFamilies: PREHISTORIC_FOLIAGE_CARD_FAMILIES,
  groundCover: PREHISTORIC_GROUND_COVER_ARCHETYPES
}));

console.log("natural-growth vegetation product module imports passed");
