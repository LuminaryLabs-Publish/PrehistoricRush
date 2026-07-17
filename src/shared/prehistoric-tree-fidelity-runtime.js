import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES,
  TREE_FIDELITY_BUNDLE_ID,
  TREE_FIDELITY_MANIFEST_ASSET_ID,
  TREE_FIDELITY_PACKAGE_VERSION,
  TREE_FIDELITY_PROVIDER_ID,
  createPrehistoricTreeFidelityAssetRuntime as createBaseTreeFidelityRuntime
} from "./tree-fidelity-assets.js";
import { registerPrehistoricVegetationCatalog } from "./prehistoric-vegetation-domain.js";

export {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES,
  TREE_FIDELITY_BUNDLE_ID,
  TREE_FIDELITY_MANIFEST_ASSET_ID,
  TREE_FIDELITY_PACKAGE_VERSION,
  TREE_FIDELITY_PROVIDER_ID
};

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
      metadata: { product: "prehistoric-rush" }
    })
  );
  return Object.freeze({
    ...runtime,
    vegetation: runtime.engine.n.vegetation,
    vegetationTree: runtime.engine.n.vegetationTree,
    vegetationFoliage: runtime.engine.n.vegetationFoliage,
    vegetationEcology: runtime.engine.n.vegetationEcology,
    vegetationObjectBridge: runtime.engine.n.vegetationObjectBridge,
    vegetationCatalog,
    semanticFidelityProfiles
  });
}

export default createPrehistoricTreeFidelityAssetRuntime;
