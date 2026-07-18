import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES,
  TREE_FIDELITY_BUNDLE_ID,
  TREE_FIDELITY_MANIFEST_ASSET_ID,
  TREE_FIDELITY_PACKAGE_VERSION,
  TREE_FIDELITY_PROVIDER_ID,
  createPrehistoricTreeFidelityAssetRuntime as createBaseTreeFidelityRuntime
} from "./tree-fidelity-assets.js";
import { FOLIAGE_ATLAS_REVISION } from "./prehistoric-foliage-card-recipes.js";
import {
  PREHISTORIC_TREE_GROWTH_REVISION,
  preparePrehistoricTreeGrowthPlans,
  validatePrehistoricTreeGrowthPlans
} from "./prehistoric-tree-growth-compute.js";
import { registerPrehistoricVegetationCatalog } from "./prehistoric-vegetation-domain.js";
import { replaceTreeFidelityProviderWithVegetation } from "./vegetation-tree-fidelity-provider.js";

export {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES,
  TREE_FIDELITY_BUNDLE_ID,
  TREE_FIDELITY_MANIFEST_ASSET_ID,
  TREE_FIDELITY_PACKAGE_VERSION,
  TREE_FIDELITY_PROVIDER_ID
};

const VEGETATION_PROVIDER_REVISION = "object-vegetation-natural-growth-v3";
const packageAssetId = (archetype) => `prehistoric-tree-fidelity:${archetype.id}`;

function descriptorVersion() {
  return `${TREE_FIDELITY_PACKAGE_VERSION}-${VEGETATION_PROVIDER_REVISION}-${PREHISTORIC_TREE_GROWTH_REVISION}`;
}

function rebindVegetationAssetDescriptors(runtime) {
  const packageIds = PREHISTORIC_TREE_ARCHETYPES.map((archetype) => packageAssetId(archetype));
  for (const archetype of PREHISTORIC_TREE_ARCHETYPES) {
    runtime.assets.registerAsset({
      id: packageAssetId(archetype),
      type: "tree-fidelity-package",
      version: descriptorVersion(),
      providerId: TREE_FIDELITY_PROVIDER_ID,
      metadata: {
        kind: "package",
        archetypeId: archetype.id,
        speciesId: archetype.id,
        shape: archetype.shape,
        foliageCardFamily: archetype.foliageCardFamily,
        packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
        providerRevision: VEGETATION_PROVIDER_REVISION,
        growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
        foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
        vegetationDomain: "n:object:vegetation",
        computeDomain: "n:compute"
      }
    });
  }
  runtime.assets.registerAsset({
    id: TREE_FIDELITY_MANIFEST_ASSET_ID,
    type: "tree-fidelity-manifest",
    version: descriptorVersion(),
    providerId: TREE_FIDELITY_PROVIDER_ID,
    dependencies: packageIds,
    metadata: {
      kind: "manifest",
      packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
      providerRevision: VEGETATION_PROVIDER_REVISION,
      growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
      vegetationDomain: "n:object:vegetation",
      computeDomain: "n:compute"
    }
  });
  runtime.assets.registerBundle({
    id: TREE_FIDELITY_BUNDLE_ID,
    version: descriptorVersion(),
    assets: [TREE_FIDELITY_MANIFEST_ASSET_ID],
    metadata: {
      purpose: "PrehistoricRush natural-growth Object Vegetation, compute-prepared alpha-cutout foliage cards, Shape, Capture, and Fidelity tree package.",
      packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
      providerRevision: VEGETATION_PROVIDER_REVISION,
      growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
      vegetationDomain: "n:object:vegetation",
      computeDomain: "n:compute",
      speciesCount: PREHISTORIC_TREE_ARCHETYPES.length
    }
  });
  return packageIds;
}

export async function createPrehistoricTreeFidelityAssetRuntime(NexusEngine, THREE, options = {}) {
  if (typeof NexusEngine.createCoreVegetationDomain !== "function") throw new TypeError("Pinned NexusEngine is missing createCoreVegetationDomain().");
  if (typeof NexusEngine.createCoreComputeDomain !== "function") throw new TypeError("Pinned NexusEngine is missing createCoreComputeDomain().");
  if (typeof NexusEngine.createNaturalTreeGrowthPlan !== "function") throw new TypeError("Pinned NexusEngine is missing natural Tree growth planning.");
  const runtime = await createBaseTreeFidelityRuntime(NexusEngine, THREE, options);
  for (const kit of NexusEngine.createCoreVegetationDomain()) runtime.engine.installKit(kit);
  for (const kit of NexusEngine.createCoreComputeDomain()) runtime.engine.installKit(kit);
  const vegetationCatalog = registerPrehistoricVegetationCatalog(NexusEngine, runtime.engine);
  const growthPlans = await preparePrehistoricTreeGrowthPlans(NexusEngine, { ...runtime, vegetationCatalog });
  const growthValidation = validatePrehistoricTreeGrowthPlans(growthPlans);
  if (!growthValidation.valid) throw new Error(`Prehistoric tree growth validation failed: ${growthValidation.errors.join("; ")}`);
  const semanticFidelityProfiles = vegetationCatalog.treeStructures.map((tree) =>
    runtime.engine.n.vegetationTree.createFidelityProfile(tree, {
      id: `prehistoric-tree-fidelity-profile:${tree.speciesId}`,
      version: Number(TREE_FIDELITY_PACKAGE_VERSION),
      shapeBuilderId: "object-shape-form",
      captureProviderId: "prehistoric-tree-capture-provider",
      nearPixels: 300,
      mediumPixels: 84,
      mediumMaximumPixels: 330,
      farPixels: 12,
      farMaximumPixels: 105,
      horizonPixels: 18,
      transitionDuration: 0.32,
      hysteresis: 0.14,
      stableFrames: 3,
      capturePadding: 0.04,
      metadata: {
        product: "prehistoric-rush",
        foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
        growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
        singleVisualAuthority: true
      }
    })
  );
  const composed = {
    ...runtime,
    vegetation: runtime.engine.n.vegetation,
    vegetationTree: runtime.engine.n.vegetationTree,
    vegetationFoliage: runtime.engine.n.vegetationFoliage,
    vegetationEcology: runtime.engine.n.vegetationEcology,
    vegetationObjectBridge: runtime.engine.n.vegetationObjectBridge,
    compute: runtime.engine.n.coreCompute,
    vegetationCatalog,
    growthPlans,
    growthValidation,
    semanticFidelityProfiles,
    vegetationProviderRevision: VEGETATION_PROVIDER_REVISION,
    treeGrowthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
    foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
  };
  replaceTreeFidelityProviderWithVegetation(NexusEngine, THREE, composed, options);
  composed.packageIds = rebindVegetationAssetDescriptors(composed);
  return Object.freeze(composed);
}

export default createPrehistoricTreeFidelityAssetRuntime;
