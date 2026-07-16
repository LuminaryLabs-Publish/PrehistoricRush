import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
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

const menuSource = readFileSync(new URL("../src/pages/menu.js", import.meta.url), "utf8");
const gameSource = readFileSync(new URL("../src/game.js", import.meta.url), "utf8");
const runtimeSource = readFileSync(new URL("../src/game-runtime-lod.js", import.meta.url), "utf8");
const adapterSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");
const layerSource = readFileSync(new URL("../src/render/three-tree-fidelity-layer.js", import.meta.url), "utf8");

assert.match(menuSource, /requestBundle\(TREE_FIDELITY_BUNDLE_ID/);
assert.match(gameSource, /trackAssetPreparation/);
assert.match(gameSource, /await prepareTreeAssetsBeforeGame\(\)/);
assert.match(runtimeSource, /treeFidelityPackages/);
assert.match(runtimeSource, /presentFirstFrame/);
assert.match(runtimeSource, /startup\.enter/);
assert.match(adapterSource, /createThreeTreeFidelityLayer/);
assert.match(layerSource, /projectedPixels/);
assert.match(layerSource, /multi-angle|billboards/);
assert.match(layerSource, /suppressLegacyTreeMeshes/);

console.log("tree fidelity asset and renderer contract passed");
