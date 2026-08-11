import {
  TREE_FIDELITY_PACKAGE_VERSION,
  TREE_FIDELITY_PROVIDER_ID
} from "./tree-fidelity-assets.js";
import { createVegetationTreeFidelityProvider } from "./vegetation-tree-fidelity-provider.js";
import { setPrehistoricTreeFidelityCapturePlanResolver } from "../render/prehistoric-natural-tree-geometry.js";

export const BOUNDED_TREE_FIDELITY_PROVIDER_REVISION = "object-vegetation-natural-growth-v7-prebuilt-first";
export const PREBUILT_TREE_FIDELITY_SCHEMA = "prehistoric-rush.prebuilt-tree-fidelity-manifest/1";
export const PREBUILT_TREE_FIDELITY_ROOT_URL = new URL("../../assets/tree-fidelity/", import.meta.url).href;

function expectedPrebuiltIdentity(runtime) {
  return Object.freeze({
    packageVersion: String(TREE_FIDELITY_PACKAGE_VERSION),
    providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
    growthRevision: String(runtime?.treeGrowthRevision ?? ""),
    growthDigest: String(runtime?.treeGrowthDigest ?? ""),
    foliageAtlasRevision: String(runtime?.foliageAtlasRevision ?? "")
  });
}

export function matchesPrebuiltTreeFidelityManifest(manifest, runtime) {
  if (!manifest || manifest.schema !== PREBUILT_TREE_FIDELITY_SCHEMA) return false;
  const expected = expectedPrebuiltIdentity(runtime);
  return String(manifest.packageVersion ?? "") === expected.packageVersion
    && String(manifest.providerRevision ?? "") === expected.providerRevision
    && String(manifest.growthRevision ?? "") === expected.growthRevision
    && String(manifest.growthDigest ?? "") === expected.growthDigest
    && String(manifest.foliageAtlasRevision ?? "") === expected.foliageAtlasRevision
    && Array.isArray(manifest.packages)
    && manifest.packages.length === 12;
}

function normalizePrebuiltAtlasUrls(packageValue) {
  for (const formId of ["far", "horizon"]) {
    const atlas = packageValue?.forms?.[formId]?.atlas;
    const source = atlas?.assetId;
    if (!source || /^(?:data:|blob:|https?:)/i.test(String(source))) continue;
    atlas.assetId = new URL(String(source), PREBUILT_TREE_FIDELITY_ROOT_URL).href;
  }
  return packageValue;
}

function createPrebuiltLoader(runtime, usage) {
  let manifestPromise = null;
  const packagePromises = new Map();

  function packagePromise(entry) {
    const key = String(entry?.file ?? "");
    if (!key || !globalThis.fetch) return Promise.resolve(null);
    if (!packagePromises.has(key)) {
      usage.packagePrefetches += 1;
      packagePromises.set(key, (async () => {
        try {
          const response = await fetch(new URL(key, PREBUILT_TREE_FIDELITY_ROOT_URL), { cache: "force-cache" });
          if (!response.ok) return null;
          return normalizePrebuiltAtlasUrls(await response.json());
        } catch {
          return null;
        }
      })());
    }
    return packagePromises.get(key);
  }

  function primePackages(manifest) {
    for (const entry of manifest?.packages ?? []) packagePromise(entry);
  }

  async function loadManifest() {
    if (!globalThis.fetch) return null;
    if (!manifestPromise) {
      manifestPromise = (async () => {
        try {
          const response = await fetch(new URL("manifest.json", PREBUILT_TREE_FIDELITY_ROOT_URL), { cache: "no-cache" });
          if (!response.ok) return null;
          const manifest = await response.json();
          if (!matchesPrebuiltTreeFidelityManifest(manifest, runtime)) return null;
          primePackages(manifest);
          usage.parallelPackagePrefetch = true;
          return manifest;
        } catch {
          return null;
        }
      })();
    }
    return manifestPromise;
  }

  async function loadPackage(asset, context) {
    const manifest = await loadManifest();
    if (!manifest) return null;
    const archetypeId = String(asset?.metadata?.archetypeId ?? "");
    const entry = manifest.packages.find((candidate) => candidate.archetypeId === archetypeId);
    if (!entry?.file) return null;
    context?.updateProgress?.(0.12, 1, `Loading compiled ${entry.label ?? archetypeId}`);
    const portable = await packagePromise(entry);
    if (portable?.archetypeId !== archetypeId || portable?.growth?.digest !== entry.growthDigest) return null;
    context?.updateProgress?.(1, 1, `${entry.label ?? archetypeId} compiled fidelity ready`);
    return {
      portable,
      metadata: {
        archetypeId,
        speciesId: archetypeId,
        generationId: portable.generation?.id ?? null,
        growthDigest: portable.growth?.digest ?? null,
        fidelityPackageId: portable.generation?.fidelityPackageId ?? null,
        packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
        providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
        source: "prebuilt",
        runtimeGeneration: false,
        parallelPackagePrefetch: true
      }
    };
  }

  async function loadManifestAsset(asset) {
    const manifest = await loadManifest();
    if (!manifest) return null;
    return {
      portable: {
        schema: "prehistoric-rush.tree-fidelity-manifest/7",
        revision: asset.version,
        bundleId: runtime.bundleId,
        vegetationDomain: "n:object:vegetation",
        computeDomain: "n:compute",
        growthRevision: manifest.growthRevision,
        growthDigest: manifest.growthDigest,
        foliageAtlasRevision: manifest.foliageAtlasRevision,
        providerRevision: manifest.providerRevision,
        singleVisualAuthority: true,
        prebuilt: true,
        parallelPackagePrefetch: true,
        archetypes: manifest.packages.map((entry) => ({
          id: entry.archetypeId,
          label: entry.label,
          assetId: entry.assetId,
          growthDigest: entry.growthDigest
        }))
      },
      metadata: {
        kind: "manifest",
        packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
        providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
        growthRevision: manifest.growthRevision,
        growthDigest: manifest.growthDigest,
        foliageAtlasRevision: manifest.foliageAtlasRevision,
        source: "prebuilt",
        runtimeGeneration: false,
        parallelPackagePrefetch: true,
        singleVisualAuthority: true
      }
    };
  }

  return Object.freeze({ loadManifest, loadPackage, loadManifestAsset });
}

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
  const usage = runtime.prebuiltFidelityUsage ?? {
    packageHits: 0,
    manifestHits: 0,
    runtimeFallbackPackages: 0,
    runtimeFallbackManifest: 0,
    packagePrefetches: 0,
    parallelPackagePrefetch: false
  };
  runtime.prebuiltFidelityUsage = usage;
  const prebuilt = createPrebuiltLoader(runtime, usage);
  let fallbackProvider = null;

  function getFallbackProvider() {
    if (fallbackProvider) return fallbackProvider;
    setPrehistoricTreeFidelityCapturePlanResolver((archetype, growthPlan) =>
      runtime?.growthPlans?.[archetype.id]?.medium ?? growthPlan
    );
    fallbackProvider = createVegetationTreeFidelityProvider(NexusEngine, THREE, runtime, options);
    return fallbackProvider;
  }

  return {
    id: TREE_FIDELITY_PROVIDER_ID,
    version: "7.1.0",
    metadata: {
      purpose: "Load fingerprint-matched compiled tree Fidelity assets first, prefetch compiled packages in parallel, and generate bounded captures only as a fallback.",
      providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
      assetStrategy: "prebuilt-first-runtime-fallback",
      packageLoading: "parallel-prefetch",
      transientBuildState: "reset-after-portable-package",
      captureFoliagePlan: "medium",
      runtimeFoliagePlans: "near-and-medium-authoritative"
    },
    async load(asset, context) {
      const isManifest = asset?.metadata?.kind === "manifest";
      const compiled = isManifest
        ? await prebuilt.loadManifestAsset(asset)
        : await prebuilt.loadPackage(asset, context);
      if (compiled) {
        if (isManifest) usage.manifestHits += 1;
        else usage.packageHits += 1;
        return compiled;
      }

      if (isManifest) usage.runtimeFallbackManifest += 1;
      else usage.runtimeFallbackPackages += 1;
      const provider = getFallbackProvider();
      const result = await provider.load(asset, context);
      if (!isManifest) {
        const transientReset = resetTreeFidelityTransientBuildState(runtime);
        return {
          ...result,
          metadata: {
            ...(result.metadata ?? {}),
            providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
            captureFoliagePlan: "medium",
            source: "runtime-generated",
            runtimeGeneration: true,
            transientReset
          }
        };
      }
      return {
        ...result,
        metadata: {
          ...(result.metadata ?? {}),
          providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
          source: "runtime-generated",
          runtimeGeneration: true
        }
      };
    },
    dispose() {
      fallbackProvider?.dispose?.();
      fallbackProvider = null;
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
