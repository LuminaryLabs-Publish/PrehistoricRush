import assert from "node:assert/strict";
import {
  createPrehistoricVegetationGeneratorOptions,
  createPrehistoricVegetationRuntime,
  registerPrehistoricVegetationCatalog
} from "../src/shared/prehistoric-vegetation-domain.js";
import {
  createPrehistoricTreeFidelityAssetRuntime
} from "../src/shared/prehistoric-tree-fidelity-runtime.js";
import {
  createVegetationTreeFidelityProvider,
  replaceTreeFidelityProviderWithVegetation
} from "../src/shared/vegetation-tree-fidelity-provider.js";
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
  replaceTreeFidelityProviderWithVegetation
})) {
  assert.equal(typeof value, "function", `${name} resolves through the product module graph`);
}

assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 10);
assert.equal(PREHISTORIC_TREE_TYPES.length, 10);
assert.doesNotThrow(() => structuredClone({
  archetypes: PREHISTORIC_TREE_ARCHETYPES,
  treeTypes: PREHISTORIC_TREE_TYPES
}));

console.log("vegetation product module imports passed");
