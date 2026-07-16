import assert from "node:assert/strict";
import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES,
  TREE_FIDELITY_BUNDLE_ID,
  TREE_FIDELITY_MANIFEST_ASSET_ID,
  TREE_FIDELITY_PROVIDER_ID
} from "../src/shared/tree-fidelity-assets.js";
import { NEXUS_COMMIT } from "../src/shared/runtime-versions.js";

assert.equal(TREE_FIDELITY_BUNDLE_ID, "prehistoric-tree-fidelity");
assert.equal(TREE_FIDELITY_MANIFEST_ASSET_ID, "prehistoric-tree-fidelity-manifest");
assert.equal(TREE_FIDELITY_PROVIDER_ID, "prehistoric-tree-fidelity-provider");
assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 5);
assert.equal(PREHISTORIC_TREE_TYPES.length, PREHISTORIC_TREE_ARCHETYPES.length);
assert.ok(PREHISTORIC_TREE_ARCHETYPES.every((tree) => tree.id && tree.maxHeight > tree.minHeight && tree.crownRadius > 0));
assert.ok(PREHISTORIC_TREE_TYPES.every((tree) => Object.isFrozen(tree) && tree.length === 6));
assert.equal(NEXUS_COMMIT, "80146b8947e0877e26b851563bd17f5cdfcbf38a");

console.log("tree fidelity asset contract passed");
