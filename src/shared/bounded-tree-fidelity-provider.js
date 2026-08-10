import { TREE_FIDELITY_PROVIDER_ID } from "./tree-fidelity-assets.js";
import { createVegetationTreeFidelityProvider } from "./vegetation-tree-fidelity-provider.js";
import { setPrehistoricTreeFidelityCapturePlanResolver } from "../render/prehistoric-natural-tree-geometry.js";

export const BOUNDED_TREE_FIDELITY_PROVIDER_REVISION = "object-vegetation-natural-growth-v6-bounded-medium-capture";

export function resetTreeFidelityTransientBuildState(runtime) {
  const capture = runtime?.engine?.n?.coreCapture ?? runtime?.engine?.coreCapture ?? null;
  const fidelity = runtime?.engine?.n?.objectFidelity ?? runtime?.engine?.objectFidelity ?? null;
  const receipt = {
    fidelityReset: typeof fidelity?.reset === "function",
    captureReset: typeof capture?.reset === "function"
  };
  fidelity?.reset?.();
  capture?.reset?.();
  return Object.freeze(receipt);
}

export function createBoundedVegetationTreeFidelityProvider(NexusEngine, THREE, runtime, options = {}) {
  setPrehistoricTreeFidelityCapturePlanResolver((archetype, growthPlan) =>
    runtime?.growthPlans?.[archetype.id]?.medium ?? growthPlan
  );
  const provider = createVegetationTreeFidelityProvider(NexusEngine, THREE, runtime, options);
  return {
    ...provider,
    version: "6.0.0",
    metadata: {
      ...(provider.metadata ?? {}),
      providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
      transientBuildState: "reset-after-portable-package",
      captureFoliagePlan: "medium",
      runtimeFoliagePlans: "near-and-medium-authoritative"
    },
    async load(asset, context) {
      const result = await provider.load(asset, context);
      if (asset?.metadata?.kind !== "package") return result;
      const transientReset = resetTreeFidelityTransientBuildState(runtime);
      return {
        ...result,
        metadata: {
          ...(result.metadata ?? {}),
          providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
          captureFoliagePlan: "medium",
          transientReset
        }
      };
    },
    dispose() {
      provider.dispose?.();
      setPrehistoricTreeFidelityCapturePlanResolver(null);
    }
  };
}

export function replaceTreeFidelityProviderWithBoundedVegetation(NexusEngine, THREE, runtime, options = {}) {
  runtime.assets.unregisterProvider(TREE_FIDELITY_PROVIDER_ID);
  runtime.assets.registerProvider(createBoundedVegetationTreeFidelityProvider(NexusEngine, THREE, runtime, options));
  return runtime;
}

export default createBoundedVegetationTreeFidelityProvider;
