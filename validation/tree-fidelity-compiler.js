import { RUNTIME_URLS } from "../src/shared/runtime-versions.js";
import {
  PREHISTORIC_TREE_ARCHETYPES,
  TREE_FIDELITY_BUNDLE_ID,
  TREE_FIDELITY_PACKAGE_VERSION,
  createPrehistoricTreeFidelityAssetRuntime
} from "../src/shared/prehistoric-tree-fidelity-runtime.js";
import {
  BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
  PREBUILT_TREE_FIDELITY_SCHEMA
} from "../src/shared/bounded-tree-fidelity-provider.js";

const status = document.querySelector("#status");
const progress = document.querySelector("#progress");
const startedAt = performance.now();

globalThis.__PREHISTORIC_TREE_COMPILER_READY__ = false;
globalThis.__PREHISTORIC_TREE_COMPILER_ERROR__ = null;
globalThis.__PREHISTORIC_TREE_COMPILER_RESULT__ = null;

function update(value, detail) {
  if (progress) progress.value = Math.max(0, Math.min(1, Number(value) || 0));
  if (status) status.textContent = detail ?? "Compiling tree Fidelity assets…";
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not serialize tree atlas blob."));
    reader.readAsDataURL(blob);
  });
}

async function serializableAtlasSource(source) {
  const value = String(source ?? "");
  if (!value) throw new Error("Tree Fidelity atlas has no asset source.");
  if (value.startsWith("data:")) return value;
  const response = await fetch(value);
  if (!response.ok) throw new Error(`Tree Fidelity compiler could not read atlas ${value}: ${response.status}`);
  return blobToDataUrl(await response.blob());
}

async function serializePackages(runtime) {
  const packages = [];
  for (let index = 0; index < runtime.packageIds.length; index += 1) {
    const assetId = runtime.packageIds[index];
    const value = structuredClone(runtime.assets.getValue(assetId));
    if (!value?.archetypeId) throw new Error(`Compiled asset ${assetId} has no portable package value.`);
    const source = value.forms?.far?.atlas?.assetId ?? value.forms?.horizon?.atlas?.assetId;
    const dataUrl = await serializableAtlasSource(source);
    if (value.forms?.far?.atlas) value.forms.far.atlas.assetId = dataUrl;
    if (value.forms?.horizon?.atlas) value.forms.horizon.atlas.assetId = dataUrl;
    packages.push({ assetId, value });
    update(0.9 + (index + 1) / runtime.packageIds.length * 0.09, `Serializing ${index + 1}/${runtime.packageIds.length} compiled tree packages`);
  }
  return packages;
}

try {
  const [NexusEngine, THREE] = await Promise.all([
    import(RUNTIME_URLS.nexus),
    import(RUNTIME_URLS.three)
  ]);
  update(0.02, "Preparing Nexus tree compiler runtime");
  const runtime = await createPrehistoricTreeFidelityAssetRuntime(NexusEngine, THREE, {
    startup: true,
    cache: false
  });
  runtime.startup.launch({
    launchId: `prehistoric-rush:tree-compiler:${Date.now()}`,
    projectId: "prehistoric-rush-tree-compiler",
    preparations: []
  });
  const receipt = await NexusEngine.trackAssetPreparation({
    startup: runtime.startup,
    assets: runtime.assets,
    preparationId: "tree-fidelity-compiler",
    bundleId: TREE_FIDELITY_BUNDLE_ID,
    label: "Compiled tree Fidelity package",
    required: true,
    weight: 1,
    requestOptions: {
      priority: "required",
      onProgress(value, detail) {
        update(0.03 + value * 0.86, detail);
      }
    }
  });
  const packages = await serializePackages(runtime);
  const result = {
    schema: PREBUILT_TREE_FIDELITY_SCHEMA,
    packageVersion: String(TREE_FIDELITY_PACKAGE_VERSION),
    providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
    growthRevision: runtime.treeGrowthRevision,
    growthDigest: runtime.treeGrowthDigest,
    foliageAtlasRevision: runtime.foliageAtlasRevision,
    speciesCount: PREHISTORIC_TREE_ARCHETYPES.length,
    elapsedMs: performance.now() - startedAt,
    prebuiltUsage: structuredClone(runtime.prebuiltFidelityUsage ?? null),
    receipt: structuredClone(receipt),
    packages
  };
  globalThis.__PREHISTORIC_TREE_COMPILER_RESULT__ = result;
  globalThis.__PREHISTORIC_TREE_COMPILER_READY__ = true;
  update(1, `Tree Fidelity compiler ready · ${packages.length} packages`);
} catch (error) {
  globalThis.__PREHISTORIC_TREE_COMPILER_ERROR__ = error?.stack || error?.message || String(error);
  update(0, globalThis.__PREHISTORIC_TREE_COMPILER_ERROR__);
  throw error;
}
