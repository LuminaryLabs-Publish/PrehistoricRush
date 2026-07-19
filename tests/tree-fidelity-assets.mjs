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
import { PREHISTORIC_TREE_GROWTH_REVISION } from "../src/shared/prehistoric-tree-growth-compute.js";
import { NEXUS_COMMIT } from "../src/shared/runtime-versions.js";

assert.equal(TREE_FIDELITY_BUNDLE_ID, "prehistoric-tree-fidelity");
assert.equal(TREE_FIDELITY_MANIFEST_ASSET_ID, "prehistoric-tree-fidelity-manifest");
assert.equal(TREE_FIDELITY_PROVIDER_ID, "prehistoric-tree-fidelity-provider");
assert.equal(TREE_FIDELITY_PACKAGE_VERSION, "5");
assert.equal(FOLIAGE_ATLAS_REVISION, "prehistoric-foliage-cards-v2");
assert.equal(PREHISTORIC_TREE_GROWTH_REVISION, "natural-growth-v1");
assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 12);
assert.equal(PREHISTORIC_TREE_TYPES.length, PREHISTORIC_TREE_ARCHETYPES.length);
assert.equal(PREHISTORIC_FOLIAGE_CARD_FAMILIES.length, 8);
assert.equal(PREHISTORIC_GROUND_COVER_ARCHETYPES.length, 6);
assert.ok(PREHISTORIC_TREE_ARCHETYPES.every((tree) => tree.id && tree.maxHeight > tree.minHeight && tree.crownRadius > 0 && tree.averageHeight > 0));
assert.ok(PREHISTORIC_TREE_TYPES.every((tree) => Object.isFrozen(tree) && tree.length === 7));
assert.equal(new Set(PREHISTORIC_TREE_ARCHETYPES.map((tree) => tree.shape)).size, 12);
assert.equal(new Set(PREHISTORIC_TREE_ARCHETYPES.map((tree) => tree.foliageColor)).size, 12);
assert.equal(NEXUS_COMMIT, "06305727778d579ca18309221e60c3e41bd066c7");

const vegetationSource = readFileSync(new URL("../src/shared/prehistoric-vegetation-domain.js", import.meta.url), "utf8");
const composedFidelitySource = readFileSync(new URL("../src/shared/prehistoric-tree-fidelity-runtime.js", import.meta.url), "utf8");
const providerSource = readFileSync(new URL("../src/shared/vegetation-tree-fidelity-provider.js", import.meta.url), "utf8");
const computeSource = readFileSync(new URL("../src/shared/prehistoric-tree-growth-compute.js", import.meta.url), "utf8");
const naturalGeometrySource = readFileSync(new URL("../src/render/prehistoric-natural-tree-geometry.js", import.meta.url), "utf8");
const imageSource = readFileSync(new URL("../src/shared/tree-fidelity-runtime-images.js", import.meta.url), "utf8");
const atlasSource = readFileSync(new URL("../src/render/prehistoric-foliage-atlas.js", import.meta.url), "utf8");
const lushLayerSource = readFileSync(new URL("../src/render/three-lush-foliage-layer.js", import.meta.url), "utf8");
const groundLayerSource = readFileSync(new URL("../src/render/three-ground-cover-layer.js", import.meta.url), "utf8");
const productionGroundSource = readFileSync(new URL("../src/render/three-production-ground-layer.js", import.meta.url), "utf8");
const generatorSource = readFileSync(new URL("../src/world/prehistoric-patch-generator.js", import.meta.url), "utf8");
const workerSource = readFileSync(new URL("../src/workers/prehistoric-patch-worker.js", import.meta.url), "utf8");
const menuSource = readFileSync(new URL("../src/pages/menu.js", import.meta.url), "utf8");
const gameSource = readFileSync(new URL("../src/game.js", import.meta.url), "utf8");
const runtimeSource = readFileSync(new URL("../src/game-runtime-lod.js", import.meta.url), "utf8");
const adapterSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");
const treeLayerSource = readFileSync(new URL("../src/render/three-tree-fidelity-layer.js", import.meta.url), "utf8");

assert.match(vegetationSource, /vegetation\.registerSpecies/);
assert.match(vegetationSource, /tree\.register/);
assert.match(vegetationSource, /foliage\.register/);
assert.match(vegetationSource, /selectGroundCoverSpecies/);
assert.match(vegetationSource, /objectBridge\.registerSpeciesObject/);

assert.match(computeSource, /createGrowthComputeDescriptors/);
assert.match(computeSource, /preparePrehistoricTreeGrowthPlans/);
assert.match(computeSource, /shadingBuffer/);
assert.match(composedFidelitySource, /createCoreComputeDomain/);
assert.match(composedFidelitySource, /preparePrehistoricTreeGrowthPlans/);
assert.match(composedFidelitySource, /treeGrowthDigest/);
assert.match(composedFidelitySource, /object-vegetation-natural-growth-v4-single-authority/);
assert.match(composedFidelitySource, /singleVisualAuthority: true/);

assert.match(providerSource, /createPrehistoricNaturalTreeObject/);
assert.doesNotMatch(providerSource, /createPrehistoricTreeObject/);
assert.match(providerSource, /portableWoodGeometryFromObject/);
assert.match(providerSource, /foliageCard/);
assert.match(providerSource, /TREE_GROWTH_PACKAGE_SCHEMA/);
assert.match(providerSource, /growthDigest/);
assert.match(providerSource, /natural-wood-mesh-plus-compute-foliage-cards/);
assert.match(providerSource, /computePreparedShading: true/);
assert.match(providerSource, /singleVisualAuthority: true/);

assert.match(naturalGeometrySource, /createPrehistoricNaturalTreeObject/);
assert.match(naturalGeometrySource, /attachPrehistoricTreeFoliageMeshes/);
assert.doesNotMatch(naturalGeometrySource, /new THREE\.Sprite/);
assert.match(naturalGeometrySource, /MeshPhysicalMaterial/);

assert.match(imageSource, /createImageBitmap/);
assert.match(imageSource, /opaqueBoundsPixels/);
assert.match(imageSource, /opaqueAspect/);
assert.match(imageSource, /uvRect/);
assert.match(atlasSource, /CanvasTexture/);
assert.match(atlasSource, /drawBroadleaf/);
assert.match(atlasSource, /drawPalm/);
assert.match(atlasSource, /drawFern/);

assert.match(lushLayerSource, /authority\.getPresentationRecords/);
assert.doesNotMatch(lushLayerSource, /createTreeFoliageCardPlacements/);
assert.match(lushLayerSource, /foliageShade/);
assert.match(lushLayerSource, /shadingBuffer/);
assert.match(lushLayerSource, /MeshPhysicalMaterial/);
assert.match(groundLayerSource, /patch\.groundCover/);
assert.match(groundLayerSource, /groundCoverGeometry/);
assert.match(productionGroundSource, /treePresentationRetired: true/);
assert.doesNotMatch(productionGroundSource, /patch\.trees/);
assert.match(productionGroundSource, /GRASS_VARIANT_COUNT = 6/);
assert.match(productionGroundSource, /production-ground-detail/);

assert.match(generatorSource, /crownHeight = type\[3\]/);
assert.match(generatorSource, /crownRadius = type\[4\]/);
assert.match(generatorSource, /vegetation\.selectSpecies/);
assert.match(generatorSource, /selectGroundCoverSpecies/);
assert.match(generatorSource, /groundCover\.push/);
assert.match(generatorSource, /treeDensity/);
assert.match(generatorSource, /groundCoverDensity/);
assert.match(generatorSource, /grassDensity/);
assert.doesNotMatch(generatorSource, /function chooseTreeType|function treeVariation/);
assert.match(workerSource, /createPrehistoricVegetationRuntime\(NexusEngine\)/);
assert.match(workerSource, /createPrehistoricVegetationGeneratorOptions/);
assert.match(runtimeSource, /treeFidelityGenerationDigest/);
assert.match(runtimeSource, /lushVegetationFrameAck/);

assert.match(menuSource, /requestBundle\(TREE_FIDELITY_BUNDLE_ID/);
assert.match(gameSource, /trackAssetPreparation/);
assert.match(gameSource, /hydrateTreeFidelityRuntimeImages/);
assert.match(gameSource, /await prepareTreeAssetsBeforeGame\(\)/);
assert.match(adapterSource, /createPrehistoricFoliageAtlas/);
assert.match(adapterSource, /createThreeLushFoliageLayer/);
assert.match(adapterSource, /createThreeGroundCoverLayer/);
assert.match(adapterSource, /createThreeProductionGroundLayer/);
assert.doesNotMatch(adapterSource, /createThreeProductionForestLayer/);
assert.match(adapterSource, /authority: treeFidelity/);
assert.match(adapterSource, /singleTreeAuthority/);
assert.match(adapterSource, /productionCanopyGroups: 0/);
assert.match(treeLayerSource, /getPresentationRecords/);
assert.match(treeLayerSource, /presentationAuthority: "object-fidelity-natural-growth"/);
assert.match(treeLayerSource, /growthDigest/);
assert.match(treeLayerSource, /resolveTreeImpostorBlend/);
assert.match(treeLayerSource, /exactFrameAck/);

console.log("single-authority natural-growth tree fidelity, compute shading, ground cover, startup, and renderer contracts passed");
