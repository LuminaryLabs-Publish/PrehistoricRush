import { TREE_FIDELITY_PROVIDER_ID } from "./tree-fidelity-assets.js";
import { createVegetationTreeFidelityProvider } from "./vegetation-tree-fidelity-provider.js";

export const BOUNDED_TREE_FIDELITY_PROVIDER_REVISION = "object-vegetation-natural-growth-v5-bounded-transients";

export function resetTreeFidelityTransientBuildState(runtime) {
  const capture = runtime?.engine?.n?.coreCapture ?? runtime?.engine?.coreCapture ?? null;
  const fidelity = runtime?.engine?.n?.objectFidelity ?? runtime?.engine?.objectFidelity ?? null;
  const captureBefore = capture?.getSnapshot?.() ?? null;
  const fidelityBefore = fidelity?.getSnapshot?.() ?? null;
  const receipt = {
    captureResultsReleased: Object.keys(captureBefore?.results ?? {}).length,
    fidelityFormsReleased: Object.keys(fidelityBefore?.forms ?? {}).length,
    fidelityBuildsReleased: Object.keys(fidelityBefore?.builds ?? {}).length,
    fidelityPackagesReleased: Object.keys(fidelityBefore?.activePackages ?? {}).length
  };
  fidelity?.reset?.();
  capture?.reset?.();
  return Object.freeze(receipt);
}

export function createBoundedVegetationTreeFidelityProvider(NexusEngine, THREE, runtime, options = {}) {
  const provider = createVegetationTreeFidelityProvider(NexusEngine, THREE, runtime, options);
  return {
    ...provider,
    version: "5.2.0",
    metadata: {
      ...(provider.metadata ?? {}),
      providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
      transientBuildState: "reset-after-portable-package"
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
          transientReset
        }
      };
    },
    dispose() {
      provider.dispose?.();
    }
  };
}

export function replaceTreeFidelityProviderWithBoundedVegetation(NexusEngine, THREE, runtime, options = {}) {
  runtime.assets.unregisterProvider(TREE_FIDELITY_PROVIDER_ID);
  runtime.assets.registerProvider(createBoundedVegetationTreeFidelityProvider(NexusEngine, THREE, runtime, options));
  return runtime;
}

export default createBoundedVegetationTreeFidelityProvider;
