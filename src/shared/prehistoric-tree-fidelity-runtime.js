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

const VEGETATION_PROVIDER_REVISION = "object-vegetation-foliage-cards-v2";
const packageAssetId = (archetype) => `prehistoric-tree-fidelity:${archetype.id}`;

function rebindVegetationAssetDescriptors(runtime) {
  const packageIds = PREHISTORIC_TREE_ARCHETYPES.map((archetype) => packageAssetId(archetype));
  for (const archetype of PREHISTORIC_TREE_ARCHETYPES) {
    runtime.assets.registerAsset({
      id: packageAssetId(archetype),
      type: "tree-fidelity-package",
      version: `${TREE_FIDELITY_PACKAGE_VERSION}-${VEGETATION_PROVIDER_REVISION}`,
      providerId: TREE_FIDELITY_PROVIDER_ID,
      metadata: {
        kind: "package",
        archetypeId: archetype.id,
        speciesId: archetype.id,
        shape: archetype.shape,
        foliageCardFamily: archetype.foliageCardFamily,
        packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
        providerRevision: VEGETATION_PROVIDER_REVISION,
        foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
        vegetationDomain: "n:object:vegetation"
      }
    });
  }
  runtime.assets.registerAsset({
    id: TREE_FIDELITY_MANIFEST_ASSET_ID,
    type: "tree-fidelity-manifest",
    version: `${TREE_FIDELITY_PACKAGE_VERSION}-${VEGETATION_PROVIDER_REVISION}`,
    providerId: TREE_FIDELITY_PROVIDER_ID,
    dependencies: packageIds,
    metadata: {
      kind: "manifest",
      packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
      providerRevision: VEGETATION_PROVIDER_REVISION,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
      vegetationDomain: "n:object:vegetation"
    }
  });
  runtime.assets.registerBundle({
    id: TREE_FIDELITY_BUNDLE_ID,
    version: `${TREE_FIDELITY_PACKAGE_VERSION}-${VEGETATION_PROVIDER_REVISION}`,
    assets: [TREE_FIDELITY_MANIFEST_ASSET_ID],
    metadata: {
      purpose: "PrehistoricRush Object Vegetation, alpha-cutout foliage cards, Shape, Capture, and Fidelity tree package.",
      packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
      providerRevision: VEGETATION_PROVIDER_REVISION,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
      vegetationDomain: "n:object:vegetation",
      speciesCount: PREHISTORIC_TREE_ARCHETYPES.length
    }
  });
  return packageIds;
}

export async function createPrehistoricTreeFidelityAssetRuntime(NexusEngine, THREE, options = {}) {
  if (typeof NexusEngine.createCoreVegetationDomain !== "function") {
    throw new TypeError("Pinned NexusEngine is missing createCoreVegetationDomain().");
  }
  const runtime = await createBaseTreeFidelityRuntime(NexusEngine, THREE, options);
  for (const kit of NexusEngine.createCoreVegetationDomain()) runtime.engine.installKit(kit);
  const vegetationCatalog = registerPrehistoricVegetationCatalog(NexusEngine, runtime.engine);
  const semanticFidelityProfiles = vegetationCatalog.treeStructures.map((tree) =>
    runtime.engine.n.vegetationTree.createFidelityProfile(tree, {
      id: `prehistoric-tree-fidelity-profile:${tree.speciesId}`,
      version: Number(TREE_FIDELITY_PACKAGE_VERSION),
      shapeBuilderId: "object-shape-form",
      captureProviderId: "prehistoric-tree-capture-provider",
      nearPixels: 360,
      mediumPixels: 150,
      mediumMaximumPixels: 410,
      farPixels: 18,
      farMaximumPixels: 175,
      horizonPixels: 26,
      transitionDuration: 0.35,
      hysteresis: 0.16,
      stableFrames: 2,
      capturePadding: 0.05,
      metadata: { product: "prehistoric-rush", foliageAtlasRevision: FOLIAGE_ATLAS_REVISION }
    })
  );
  const composed = {
    ...runtime,
    vegetation: runtime.engine.n.vegetation,
    vegetationTree: runtime.engine.n.vegetationTree,
    vegetationFoliage: runtime.engine.n.vegetationFoliage,
    vegetationEcology: runtime.engine.n.vegetationEcology,
    vegetationObjectBridge: runtime.engine.n.vegetationObjectBridge,
    vegetationCatalog,
    semanticFidelityProfiles,
    vegetationProviderRevision: VEGETATION_PROVIDER_REVISION,
    foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
  };
  replaceTreeFidelityProviderWithVegetation(NexusEngine, THREE, composed, options);
  composed.packageIds = rebindVegetationAssetDescriptors(composed);
  return Object.freeze(composed);
}

export default createPrehistoricTreeFidelityAssetRuntime;
