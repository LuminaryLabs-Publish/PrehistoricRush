import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  PREHISTORIC_TREE_ARCHETYPES,
  TREE_FIDELITY_PACKAGE_VERSION
} from "../src/shared/tree-archetype-catalog.js";
import { PREHISTORIC_GROUND_COVER_ARCHETYPES } from "../src/shared/prehistoric-foliage-card-recipes.js";
import {
  getPrehistoricTreeCrownCoverageMinimum,
  validatePrehistoricTreeCrownCoverage
} from "../src/shared/prehistoric-tree-growth-compute.js";
import { NEXUS_COMMIT } from "../src/shared/runtime-versions.js";

assert.equal(NEXUS_COMMIT, "06305727778d579ca18309221e60c3e41bd066c7");
assert.equal(TREE_FIDELITY_PACKAGE_VERSION, "5");
assert.equal(PREHISTORIC_TREE_ARCHETYPES.length, 12);
assert.equal(PREHISTORIC_GROUND_COVER_ARCHETYPES.length, 6);

assert.equal(getPrehistoricTreeCrownCoverageMinimum("radial-frond", "near"), 0.34);
assert.equal(getPrehistoricTreeCrownCoverageMinimum("radial-frond", "medium"), 0.18);
assert.equal(getPrehistoricTreeCrownCoverageMinimum("umbrella", "near"), 0.42);
assert.equal(getPrehistoricTreeCrownCoverageMinimum("umbrella", "medium"), 0.24);
assert.equal(validatePrehistoricTreeCrownCoverage({ algorithm: { kind: "radial-frond" }, quality: "near", metrics: { crownCoverage: 0.35 } }).valid, true);
assert.equal(validatePrehistoricTreeCrownCoverage({ algorithm: { kind: "radial-frond" }, quality: "medium", metrics: { crownCoverage: 0.19 } }).valid, true);
assert.equal(validatePrehistoricTreeCrownCoverage({ algorithm: { kind: "radial-frond" }, quality: "near", metrics: { crownCoverage: 0.339 } }).valid, false);
assert.equal(validatePrehistoricTreeCrownCoverage({ algorithm: { kind: "umbrella" }, quality: "near", metrics: { crownCoverage: 0.419 } }).valid, false);

const computeSource = readFileSync(new URL("../src/shared/prehistoric-tree-growth-compute.js", import.meta.url), "utf8");
const runtimeSource = readFileSync(new URL("../src/shared/prehistoric-tree-fidelity-runtime.js", import.meta.url), "utf8");
const providerSource = readFileSync(new URL("../src/shared/vegetation-tree-fidelity-provider.js", import.meta.url), "utf8");
const boundedProviderSource = readFileSync(new URL("../src/shared/bounded-tree-fidelity-provider.js", import.meta.url), "utf8");
const naturalGeometrySource = readFileSync(new URL("../src/render/prehistoric-natural-tree-geometry.js", import.meta.url), "utf8");
const foliageGeometrySource = readFileSync(new URL("../src/render/prehistoric-foliage-card-geometry.js", import.meta.url), "utf8");
const treeLayerSource = readFileSync(new URL("../src/render/three-tree-fidelity-layer.js", import.meta.url), "utf8");
const foliageLayerSource = readFileSync(new URL("../src/render/three-lush-foliage-layer.js", import.meta.url), "utf8");
const groundSource = readFileSync(new URL("../src/render/three-production-ground-layer.js", import.meta.url), "utf8");
const adapterSource = readFileSync(new URL("../src/render/three-patch-stream-lod-adapter.js", import.meta.url), "utf8");

assert.match(computeSource, /grow-skeleton|createGrowthComputeDescriptors/);
assert.match(computeSource, /shadingBuffer/);
assert.match(computeSource, /allowInvalid: true/);
assert.match(computeSource, /GENERIC_CROWN_COVERAGE_ERROR/);
assert.match(computeSource, /getPrehistoricTreeCrownCoverageMinimum/);
assert.match(computeSource, /natural-growth-v5-efficient-crossed-geometry/);
assert.match(computeSource, /withAuthoredFoliage/);
assert.match(computeSource, /productAuthoredCanopy/);
assert.match(computeSource, /volumetricCrossedGeometry/);
assert.match(computeSource, /instanceEfficient/);
assert.match(runtimeSource, /preparePrehistoricTreeGrowthPlans/);
assert.match(runtimeSource, /treeGrowthDigest/);
assert.match(runtimeSource, /singleVisualAuthority: true/);
assert.match(runtimeSource, /BOUNDED_TREE_FIDELITY_PROVIDER_REVISION/);
assert.match(runtimeSource, /replaceTreeFidelityProviderWithBoundedVegetation/);

assert.match(providerSource, /createPrehistoricNaturalTreeObject/);
assert.doesNotMatch(providerSource, /createPrehistoricTreeObject/);
assert.match(providerSource, /portableWoodGeometryFromObject/);
assert.match(providerSource, /mesh\.userData\?\.foliageCard/);
assert.match(providerSource, /TREE_GROWTH_PACKAGE_SCHEMA/);
assert.match(providerSource, /growthDigest/);
assert.match(providerSource, /computePreparedShading: true/);
assert.match(providerSource, /singleVisualAuthority: true/);

assert.match(boundedProviderSource, /object-vegetation-natural-growth-v7-prebuilt-first/);
assert.match(boundedProviderSource, /prebuilt-first-runtime-fallback/);
assert.match(boundedProviderSource, /captureFoliagePlan: "medium"/);
assert.match(boundedProviderSource, /runtimeFoliagePlans: "near-and-medium-authoritative"/);
assert.match(boundedProviderSource, /runtime\?\.growthPlans\?\.\[archetype\.id\]\?\.medium/);
assert.match(boundedProviderSource, /fidelity\?\.reset\?\.\(\)/);
assert.match(boundedProviderSource, /capture\?\.reset\?\.\(\)/);
assert.doesNotMatch(boundedProviderSource, /getSnapshot\?\.\(\)/);

assert.match(foliageGeometrySource, /crossed-foliage-volume-v2-efficient/);
assert.match(foliageGeometrySource, /crossedPlanes/);
assert.match(naturalGeometrySource, /setPrehistoricTreeFidelityCapturePlanResolver/);
assert.match(naturalGeometrySource, /FIDELITY_CAPTURE_FOLIAGE_PLAN_RESOLVER/);
assert.match(naturalGeometrySource, /createPrehistoricFoliageCardGeometry/);
assert.match(naturalGeometrySource, /new THREE\.Mesh\(/);
assert.doesNotMatch(naturalGeometrySource, /new THREE\.Sprite\(/);
assert.match(naturalGeometrySource, /MeshPhysicalMaterial/);
assert.match(naturalGeometrySource, /createOrganicSegmentGeometry/);
assert.match(naturalGeometrySource, /segmentOverlap/);
assert.doesNotMatch(naturalGeometrySource, /new THREE\.CylinderGeometry\(segment\.radiusEnd/);

assert.match(treeLayerSource, /presentationAuthority: "object-fidelity-natural-growth"/);
assert.match(treeLayerSource, /getPresentationRecords/);
assert.match(treeLayerSource, /growthDigest/);
assert.match(treeLayerSource, /stableSelectionFrames/);

assert.match(foliageLayerSource, /authority\.getPresentationRecords\(\)/);
assert.doesNotMatch(foliageLayerSource, /createTreeFoliageCardPlacements/);
assert.doesNotMatch(foliageLayerSource, /projectedPixels/);
assert.match(foliageLayerSource, /createPrehistoricFoliageCardGeometry/);
assert.match(foliageLayerSource, /directInstanceWrites: true/);
assert.doesNotMatch(foliageLayerSource, /const buckets = new Map/);
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

console.log("Core skeleton growth, instance-efficient crossed canopy, prebuilt-first Fidelity, bounded transients, organic wood, direct foliage buffers, and single runtime LOD authority passed");
