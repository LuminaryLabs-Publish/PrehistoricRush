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
assert.equal(TREE_FIDELITY_PACKAGE_VERSION, "4");
assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 10);
assert.equal(PREHISTORIC_TREE_TYPES.length, PREHISTORIC_TREE_ARCHETYPES.length);
assert.ok(PREHISTORIC_TREE_ARCHETYPES.every((tree) => tree.id && tree.maxHeight > tree.minHeight && tree.crownRadius > 0 && tree.averageHeight > 0));
assert.ok(PREHISTORIC_TREE_TYPES.every((tree) => Object.isFrozen(tree) && tree.length === 7));
assert.equal(new Set(PREHISTORIC_TREE_ARCHETYPES.map((tree) => tree.shape)).size, 10);
assert.equal(new Set(PREHISTORIC_TREE_ARCHETYPES.map((tree) => tree.foliageColor)).size, 10);
assert.match(NEXUS_COMMIT, /^[0-9a-f]{40}$/, "PrehistoricRush pins an immutable Vegetation-enabled NexusEngine revision");

const catalogSource = readFileSync(new URL("../src/shared/tree-archetype-catalog.js", import.meta.url), "utf8");
const vegetationSource = readFileSync(new URL("../src/shared/prehistoric-vegetation-domain.js", import.meta.url), "utf8");
const composedFidelitySource = readFileSync(new URL("../src/shared/prehistoric-tree-fidelity-runtime.js", import.meta.url), "utf8");
const assetSource = readFileSync(new URL("../src/shared/tree-fidelity-assets.js", import.meta.url), "utf8");
const imageSource = readFileSync(new URL("../src/shared/tree-fidelity-runtime-images.js", import.meta.url), "utf8");
const generatorSource = readFileSync(new URL("../src/world/prehistoric-patch-generator.js", import.meta.url), "utf8");
const workerSource = readFileSync(new URL("../src/workers/prehistoric-patch-worker.js", import.meta.url), "utf8");
const menuSource = readFileSync(new URL("../src/pages/menu.js", import.meta.url), "utf8");
const gameSource = readFileSync(new URL("../src/game.js", import.meta.url), "utf8");
const runtimeSource = readFileSync(new URL("../src/game-runtime-lod.js", import.meta.url), "utf8");
const adapterSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");
const layerSource = readFileSync(new URL("../src/render/three-tree-fidelity-layer.js", import.meta.url), "utf8");

assert.match(catalogSource, /layered-araucaria/);
assert.match(catalogSource, /fan-cycad/);
assert.match(catalogSource, /ginkgo-crown-tree/);
assert.match(catalogSource, /marsh-horsetail-tower/);
assert.match(catalogSource, /forked-ghostwood/);
assert.match(catalogSource, /patternedMaterial/);

assert.match(vegetationSource, /vegetation\.registerSpecies/);
assert.match(vegetationSource, /tree\.register/);
assert.match(vegetationSource, /foliage\.register/);
assert.match(vegetationSource, /objectBridge\.registerSpeciesObject/);
assert.match(vegetationSource, /createCoreObjectDomain\(\{ shape: false, fidelity: false \}\)/);
assert.match(vegetationSource, /selectSpecies\(environment, seed\)/);
assert.match(vegetationSource, /createInstanceDescriptor\(input\)/);

assert.match(composedFidelitySource, /createCoreVegetationDomain/);
assert.match(composedFidelitySource, /registerPrehistoricVegetationCatalog/);
assert.match(composedFidelitySource, /vegetationTree\.createFidelityProfile/);
assert.match(composedFidelitySource, /semanticFidelityProfiles/);
assert.match(menuSource, /prehistoric-tree-fidelity-runtime\.js/);
assert.match(gameSource, /prehistoric-tree-fidelity-runtime\.js/);

assert.match(assetSource, /createCoreObjectKit/);
assert.match(assetSource, /createCoreObjectShapeKit/);
assert.match(assetSource, /createCoreCaptureKit/);
assert.match(assetSource, /createCoreObjectFidelityKit/);
assert.match(assetSource, /createReferenceObjectShapeProvider/);
assert.match(assetSource, /createObjectShapeFidelityAdapterKit/);
assert.match(assetSource, /objectFidelity\.requestBuild/);
assert.match(assetSource, /sharedAtlas/);
assert.match(assetSource, /stableSelectionFrames: 2/);
assert.match(assetSource, /duration: 0\.35/);
assert.match(assetSource, /hysteresis: 0\.16/);
assert.match(assetSource, /generationId/);

assert.match(imageSource, /createImageBitmap/);
assert.match(imageSource, /opaqueBoundsPixels/);
assert.match(imageSource, /opaqueAspect/);
assert.match(imageSource, /uvRect/);
assert.match(generatorSource, /crownHeight = type\[3\]/);
assert.match(generatorSource, /crownRadius = type\[4\]/);
assert.match(generatorSource, /vegetation\.selectSpecies/);
assert.match(generatorSource, /vegetation\.createInstanceDescriptor/);
assert.doesNotMatch(generatorSource, /function chooseTreeType|function treeVariation/);
assert.match(workerSource, /createPrehistoricVegetationRuntime\(NexusEngine\)/);
assert.match(runtimeSource, /createPrehistoricVegetationRuntime\(NexusEngine\)/);
assert.match(runtimeSource, /prehistoric-patch-v5-vegetation-domain/);
assert.match(runtimeSource, /vegetationCatalogDigest/);
assert.match(runtimeSource, /vegetationSpeciesCount/);

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
assert.match(layerSource, /createAtlasTexture/);
assert.match(layerSource, /frameRect/);
assert.match(layerSource, /resolveTreeImpostorBlend/);
assert.match(layerSource, /ambientLift/);
assert.match(layerSource, /textureCount: layers\.length/);
assert.match(layerSource, /entered rendering without valid decoded image data/);
assert.match(layerSource, /exactFrameAck/);
assert.match(layerSource, /horizon/);
assert.match(layerSource, /suppressLegacyTreeMeshes/);
assert.match(layerSource, /frustumCulled = false/);

console.log("tree fidelity, Object Vegetation, shared atlas, startup, exact frames, and transition contract passed");
