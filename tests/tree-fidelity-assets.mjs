import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES,
  TREE_FIDELITY_BUNDLE_ID,
  TREE_FIDELITY_MANIFEST_ASSET_ID,
  TREE_FIDELITY_PACKAGE_VERSION,
  TREE_FIDELITY_PROVIDER_ID
} from "../src/shared/tree-fidelity-assets.js";
import { NEXUS_COMMIT } from "../src/shared/runtime-versions.js";

assert.equal(TREE_FIDELITY_BUNDLE_ID, "prehistoric-tree-fidelity");
assert.equal(TREE_FIDELITY_MANIFEST_ASSET_ID, "prehistoric-tree-fidelity-manifest");
assert.equal(TREE_FIDELITY_PROVIDER_ID, "prehistoric-tree-fidelity-provider");
assert.equal(TREE_FIDELITY_PACKAGE_VERSION, "3");
assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 5);
assert.equal(PREHISTORIC_TREE_TYPES.length, PREHISTORIC_TREE_ARCHETYPES.length);
assert.ok(PREHISTORIC_TREE_ARCHETYPES.every((tree) => tree.id && tree.maxHeight > tree.minHeight && tree.crownRadius > 0));
assert.ok(PREHISTORIC_TREE_TYPES.every((tree) => Object.isFrozen(tree) && tree.length === 6));
assert.equal(NEXUS_COMMIT, "80146b8947e0877e26b851563bd17f5cdfcbf38a");

const assetSource = readFileSync(new URL("../src/shared/tree-fidelity-assets.js", import.meta.url), "utf8");
const imageSource = readFileSync(new URL("../src/shared/tree-fidelity-runtime-images.js", import.meta.url), "utf8");
const menuSource = readFileSync(new URL("../src/pages/menu.js", import.meta.url), "utf8");
const gameSource = readFileSync(new URL("../src/game.js", import.meta.url), "utf8");
const runtimeSource = readFileSync(new URL("../src/game-runtime-lod.js", import.meta.url), "utf8");
const adapterSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");
const layerSource = readFileSync(new URL("../src/render/three-tree-fidelity-layer.js", import.meta.url), "utf8");

assert.match(assetSource, /createCoreObjectKit/);
assert.match(assetSource, /createCoreObjectShapeKit/);
assert.match(assetSource, /createCoreCaptureKit/);
assert.match(assetSource, /createCoreObjectFidelityKit/);
assert.match(assetSource, /createReferenceObjectShapeProvider/);
assert.match(assetSource, /createObjectShapeFidelityAdapterKit/);
assert.match(assetSource, /objectFidelity\.requestBuild/);
assert.match(assetSource, /generationId/);
assert.match(imageSource, /createImageBitmap/);
assert.match(imageSource, /runtimeImage/);
assert.match(menuSource, /requestBundle\(TREE_FIDELITY_BUNDLE_ID/);
assert.match(menuSource, /unregisterProvider\(TREE_FIDELITY_PROVIDER_ID/);
assert.match(gameSource, /trackAssetPreparation/);
assert.match(gameSource, /hydrateTreeFidelityRuntimeImages/);
assert.match(gameSource, /tree-fidelity-runtime-images/);
assert.match(gameSource, /await prepareTreeAssetsBeforeGame\(\)/);
assert.match(gameSource, /unregisterProvider\(TREE_FIDELITY_PROVIDER_ID/);
assert.match(runtimeSource, /treeFidelityGenerationDigest/);
assert.match(runtimeSource, /exactImpostorFrameAck/);
assert.match(runtimeSource, /presentFirstFrame/);
assert.match(runtimeSource, /startup\.enter/);
assert.match(adapterSource, /createThreeTreeFidelityLayer/);
assert.match(layerSource, /projectedPixels/);
assert.match(layerSource, /retainWithHysteresis/);
assert.match(layerSource, /patchDitherMaterial/);
assert.match(layerSource, /resolveTreeImpostorFrame/);
assert.match(layerSource, /frameElevationDegrees/);
assert.match(layerSource, /atlasCell/);
assert.match(layerSource, /runtimeImage/);
assert.match(layerSource, /entered rendering before atlas decoding completed/);
assert.match(layerSource, /exactFrameAck/);
assert.match(layerSource, /horizon/);
assert.match(layerSource, /suppressLegacyTreeMeshes/);
assert.match(layerSource, /frustumCulled = false/);

console.log("tree fidelity domains, assets, startup, exact frames, decoded images, renderer, and transition contract passed");
