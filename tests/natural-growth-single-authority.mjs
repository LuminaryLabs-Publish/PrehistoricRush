import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PREHISTORIC_TREE_ARCHETYPES,
  TREE_FIDELITY_PACKAGE_VERSION
} from "../src/shared/tree-archetype-catalog.js";
import { PREHISTORIC_GROUND_COVER_ARCHETYPES } from "../src/shared/prehistoric-foliage-card-recipes.js";
import { NEXUS_COMMIT } from "../src/shared/runtime-versions.js";

assert.equal(NEXUS_COMMIT, "06305727778d579ca18309221e60c3e41bd066c7");
assert.equal(TREE_FIDELITY_PACKAGE_VERSION, "5");
assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 12);
assert.equal(PREHISTORIC_GROUND_COVER_ARCHETYPES.length, 6);

const computeSource = readFileSync(new URL("../src/shared/prehistoric-tree-growth-compute.js", import.meta.url), "utf8");
const runtimeSource = readFileSync(new URL("../src/shared/prehistoric-tree-fidelity-runtime.js", import.meta.url), "utf8");
const providerSource = readFileSync(new URL("../src/shared/vegetation-tree-fidelity-provider.js", import.meta.url), "utf8");
const naturalGeometrySource = readFileSync(new URL("../src/render/prehistoric-natural-tree-geometry.js", import.meta.url), "utf8");
const treeLayerSource = readFileSync(new URL("../src/render/three-tree-fidelity-layer.js", import.meta.url), "utf8");
const foliageLayerSource = readFileSync(new URL("../src/render/three-lush-foliage-layer.js", import.meta.url), "utf8");
const groundSource = readFileSync(new URL("../src/render/three-production-ground-layer.js", import.meta.url), "utf8");
const adapterSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");

assert.match(computeSource, /grow-skeleton|createGrowthComputeDescriptors/);
assert.match(computeSource, /shadingBuffer/);
assert.match(runtimeSource, /preparePrehistoricTreeGrowthPlans/);
assert.match(runtimeSource, /treeGrowthDigest/);
assert.match(runtimeSource, /singleVisualAuthority: true/);
assert.match(runtimeSource, /object-vegetation-natural-growth-v4-single-authority/);

assert.match(providerSource, /createPrehistoricNaturalTreeObject/);
assert.doesNotMatch(providerSource, /createPrehistoricTreeObject/);
assert.match(providerSource, /portableWoodGeometryFromObject/);
assert.match(providerSource, /mesh\.userData\?\.foliageCard/);
assert.match(providerSource, /TREE_GROWTH_PACKAGE_SCHEMA/);
assert.match(providerSource, /growthDigest/);
assert.match(providerSource, /computePreparedShading: true/);
assert.match(providerSource, /singleVisualAuthority: true/);

assert.match(naturalGeometrySource, /new THREE\.Mesh\(/);
assert.doesNotMatch(naturalGeometrySource, /new THREE\.Sprite\(/);
assert.match(naturalGeometrySource, /MeshPhysicalMaterial/);
assert.match(naturalGeometrySource, /growthPlan\.foliageClusters/);

assert.match(treeLayerSource, /presentationAuthority: "object-fidelity-natural-growth"/);
assert.match(treeLayerSource, /getPresentationRecords/);
assert.match(treeLayerSource, /growthDigest/);
assert.match(treeLayerSource, /stableSelectionFrames/);

assert.match(foliageLayerSource, /authority\.getPresentationRecords\(\)/);
assert.doesNotMatch(foliageLayerSource, /createTreeFoliageCardPlacements/);
assert.doesNotMatch(foliageLayerSource, /projectedPixels/);
assert.match(foliageLayerSource, /shadingBuffer/);
assert.match(foliageLayerSource, /foliageShade/);
assert.match(foliageLayerSource, /MeshPhysicalMaterial/);
assert.match(foliageLayerSource, /computePreparedShading: true/);

assert.doesNotMatch(groundSource, /patch\.trees/);
assert.doesNotMatch(groundSource, /createBarkBatch|createCanopyBatch/);
assert.match(groundSource, /treePresentationRetired: true/);
assert.match(groundSource, /GRASS_VARIANT_COUNT = 6/);
assert.match(groundSource, /production-ground-detail/);

assert.match(adapterSource, /createThreeProductionGroundLayer/);
assert.doesNotMatch(adapterSource, /createThreeProductionForestLayer/);
assert.match(adapterSource, /authority: treeFidelity/);
assert.match(adapterSource, /singleTreeAuthority/);
assert.match(adapterSource, /productionCanopyGroups: 0/);
assert.match(adapterSource, /productionBranchesAndBark: 0/);

console.log("natural-growth capture, compute shading, single LOD authority, and ground-only production presentation passed");
