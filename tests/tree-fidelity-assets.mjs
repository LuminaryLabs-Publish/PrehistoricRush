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
import {
  FOLIAGE_ATLAS_REVISION,
  PREHISTORIC_FOLIAGE_CARD_FAMILIES,
  PREHISTORIC_GROUND_COVER_ARCHETYPES
} from "../src/shared/prehistoric-foliage-card-recipes.js";
import { NEXUS_COMMIT } from "../src/shared/runtime-versions.js";

assert.equal(TREE_FIDELITY_BUNDLE_ID, "prehistoric-tree-fidelity");
assert.equal(TREE_FIDELITY_MANIFEST_ASSET_ID, "prehistoric-tree-fidelity-manifest");
assert.equal(TREE_FIDELITY_PROVIDER_ID, "prehistoric-tree-fidelity-provider");
assert.equal(TREE_FIDELITY_PACKAGE_VERSION, "5");
assert.equal(FOLIAGE_ATLAS_REVISION, "prehistoric-foliage-cards-v1");
assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 12);
assert.equal(PREHISTORIC_TREE_TYPES.length, PREHISTORIC_TREE_ARCHETYPES.length);
assert.equal(PREHISTORIC_FOLIAGE_CARD_FAMILIES.length, 8);
assert.equal(PREHISTORIC_GROUND_COVER_ARCHETYPES.length, 6);
assert.ok(PREHISTORIC_TREE_ARCHETYPES.every((tree) => tree.id && tree.maxHeight > tree.minHeight && tree.crownRadius > 0 && tree.averageHeight > 0));
assert.ok(PREHISTORIC_TREE_TYPES.every((tree) => Object.isFrozen(tree) && tree.length === 7));
assert.equal(new Set(PREHISTORIC_TREE_ARCHETYPES.map((tree) => tree.shape)).size, 12);
assert.equal(new Set(PREHISTORIC_TREE_ARCHETYPES.map((tree) => tree.foliageColor)).size, 12);
assert.match(NEXUS_COMMIT, /^[0-9a-f]{40}$/, "PrehistoricRush pins an immutable foliage-card-enabled NexusEngine revision");

const catalogSource = readFileSync(new URL("../src/shared/tree-archetype-catalog.js", import.meta.url), "utf8");
const cardRecipeSource = readFileSync(new URL("../src/shared/prehistoric-foliage-card-recipes.js", import.meta.url), "utf8");
const vegetationSource = readFileSync(new URL("../src/shared/prehistoric-vegetation-domain.js", import.meta.url), "utf8");
const composedFidelitySource = readFileSync(new URL("../src/shared/prehistoric-tree-fidelity-runtime.js", import.meta.url), "utf8");
const providerSource = readFileSync(new URL("../src/shared/vegetation-tree-fidelity-provider.js", import.meta.url), "utf8");
const assetSource = readFileSync(new URL("../src/shared/tree-fidelity-assets.js", import.meta.url), "utf8");
const imageSource = readFileSync(new URL("../src/shared/tree-fidelity-runtime-images.js", import.meta.url), "utf8");
const atlasSource = readFileSync(new URL("../src/render/prehistoric-foliage-atlas.js", import.meta.url), "utf8");
const lushLayerSource = readFileSync(new URL("../src/render/three-lush-foliage-layer.js", import.meta.url), "utf8");
const groundLayerSource = readFileSync(new URL("../src/render/three-ground-cover-layer.js", import.meta.url), "utf8");
const generatorSource = readFileSync(new URL("../src/world/prehistoric-patch-generator.js", import.meta.url), "utf8");
const workerSource = readFileSync(new URL("../src/workers/prehistoric-patch-worker.js", import.meta.url), "utf8");
const menuSource = readFileSync(new URL("../src/pages/menu.js", import.meta.url), "utf8");
const gameSource = readFileSync(new URL("../src/game.js", import.meta.url), "utf8");
const runtimeSource = readFileSync(new URL("../src/game-runtime-lod.js", import.meta.url), "utf8");
const adapterSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");
const layerSource = readFileSync(new URL("../src/render/three-tree-fidelity-layer.js", import.meta.url), "utf8");

assert.match(catalogSource, /tall-prehistoric-palm/);
assert.match(catalogSource, /short-jungle-palm/);
assert.match(catalogSource, /attachPrehistoricTreeFoliageSprites/);
assert.match(catalogSource, /createPalmWood/);
assert.match(catalogSource, /foliageCardFamily/);
assert.match(cardRecipeSource, /PREHISTORIC_FOLIAGE_CARD_FAMILIES/);
assert.match(cardRecipeSource, /PREHISTORIC_GROUND_COVER_ARCHETYPES/);
assert.match(cardRecipeSource, /createTreeFoliageCardPlacements/);

assert.match(vegetationSource, /vegetation\.registerSpecies/);
assert.match(vegetationSource, /tree\.register/);
assert.match(vegetationSource, /foliage\.register/);
assert.match(vegetationSource, /cardFamilies/);
assert.match(vegetationSource, /selectGroundCoverSpecies/);
assert.match(vegetationSource, /groundCoverSpecies/);
assert.match(vegetationSource, /objectBridge\.registerSpeciesObject/);
assert.match(vegetationSource, /createCoreObjectDomain\(\{ shape: false, fidelity: false \}\)/);
assert.match(vegetationSource, /selectSpecies\(environment, seed\)/);
assert.match(vegetationSource, /createInstanceDescriptor\(input\)/);

assert.match(composedFidelitySource, /createCoreVegetationDomain/);
assert.match(composedFidelitySource, /registerPrehistoricVegetationCatalog/);
assert.match(composedFidelitySource, /vegetationTree\.createFidelityProfile/);
assert.match(composedFidelitySource, /object-vegetation-foliage-cards-v2/);
assert.match(composedFidelitySource, /FOLIAGE_ATLAS_REVISION/);
assert.match(menuSource, /prehistoric-tree-fidelity-runtime\.js/);
assert.match(gameSource, /prehistoric-tree-fidelity-runtime\.js/);

assert.match(assetSource, /createCoreObjectKit/);
assert.match(assetSource, /createCoreObjectShapeKit/);
assert.match(assetSource, /createCoreCaptureKit/);
assert.match(assetSource, /createCoreObjectFidelityKit/);
assert.match(assetSource, /createReferenceObjectShapeProvider/);
assert.match(assetSource, /createObjectShapeFidelityAdapterKit/);
assert.match(providerSource, /tree-fidelity-package\/5/);
assert.match(providerSource, /treeStructureHash/);
assert.match(providerSource, /foliageDescriptorHash/);
assert.match(providerSource, /foliageAtlasRevision/);
assert.match(providerSource, /wood-mesh-plus-foliage-cards/);
assert.match(providerSource, /createPrehistoricTreeObject/);

assert.match(imageSource, /createImageBitmap/);
assert.match(imageSource, /opaqueBoundsPixels/);
assert.match(imageSource, /opaqueAspect/);
assert.match(imageSource, /uvRect/);
assert.match(atlasSource, /CanvasTexture/);
assert.match(atlasSource, /drawBroadleaf/);
assert.match(atlasSource, /drawPalm/);
assert.match(atlasSource, /drawFern/);
assert.match(lushLayerSource, /alphaTest: family\.alphaCutoff/);
assert.match(lushLayerSource, /foliageWind/);
assert.match(lushLayerSource, /nearCards/);
assert.match(groundLayerSource, /patch\.groundCover/);
assert.match(groundLayerSource, /crossedGeometry/);

assert.match(generatorSource, /crownHeight = type\[3\]/);
assert.match(generatorSource, /crownRadius = type\[4\]/);
assert.match(generatorSource, /vegetation\.selectSpecies/);
assert.match(generatorSource, /selectGroundCoverSpecies/);
assert.match(generatorSource, /groundCover\.push/);
assert.match(generatorSource, /groundCover: Number/);
assert.doesNotMatch(generatorSource, /function chooseTreeType|function treeVariation/);
assert.match(workerSource, /createPrehistoricVegetationRuntime\(NexusEngine\)/);
assert.match(workerSource, /createPrehistoricVegetationGeneratorOptions/);
assert.match(runtimeSource, /prehistoric-patch-v6-lush-foliage-cards/);
assert.match(runtimeSource, /FOLIAGE_ATLAS_REVISION/);
assert.match(runtimeSource, /groundCover: 36/);
assert.match(runtimeSource, /lushVegetationFrameAck/);
assert.match(runtimeSource, /treeFidelityGenerationDigest/);
assert.match(runtimeSource, /exactImpostorFrameAck/);
assert.match(runtimeSource, /presentFirstFrame/);
assert.match(runtimeSource, /startup\.enter/);

assert.match(menuSource, /requestBundle\(TREE_FIDELITY_BUNDLE_ID/);
assert.match(menuSource, /unregisterProvider\(TREE_FIDELITY_PROVIDER_ID/);
assert.match(gameSource, /trackAssetPreparation/);
assert.match(gameSource, /hydrateTreeFidelityRuntimeImages/);
assert.match(gameSource, /tree-fidelity-runtime-images/);
assert.match(gameSource, /await prepareTreeAssetsBeforeGame\(\)/);
assert.match(gameSource, /unregisterProvider\(TREE_FIDELITY_PROVIDER_ID/);
assert.match(adapterSource, /createPrehistoricFoliageAtlas/);
assert.match(adapterSource, /createThreeLushFoliageLayer/);
assert.match(adapterSource, /createThreeGroundCoverLayer/);
assert.match(adapterSource, /applyLushJungleAtmosphere/);
assert.match(adapterSource, /lushVegetationFrameAck/);
assert.match(layerSource, /createAtlasTexture/);
assert.match(layerSource, /frameRect/);
assert.match(layerSource, /resolveTreeImpostorBlend/);
assert.match(layerSource, /ambientLift/);
assert.match(layerSource, /entered rendering without valid decoded image data/);
assert.match(layerSource, /exactFrameAck/);
assert.match(layerSource, /horizon/);
assert.match(layerSource, /suppressLegacyTreeMeshes/);
assert.match(layerSource, /frustumCulled = false/);

console.log("tree fidelity, alpha-cutout foliage cards, ground cover, Object Vegetation, startup, and renderer contracts passed");
