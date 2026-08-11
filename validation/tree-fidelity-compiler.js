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
const COMPILED_FRAME_SIZE = 128;

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

async function atlasBlob(source) {
  const value = String(source ?? "");
  if (!value) throw new Error("Tree Fidelity atlas has no asset source.");
  const response = await fetch(value);
  if (!response.ok && !value.startsWith("data:")) {
    throw new Error(`Tree Fidelity compiler could not read atlas ${value}: ${response.status}`);
  }
  return response.blob();
}

async function compileAtlas(source, metadata = {}) {
  const blob = await atlasBlob(source);
  const image = await createImageBitmap(blob, { premultiplyAlpha: "none" });
  const sourceFrameSize = Math.max(1, Number(metadata.frameSize) || 256);
  const targetFrameSize = Math.min(sourceFrameSize, COMPILED_FRAME_SIZE);
  const scale = targetFrameSize / sourceFrameSize;
  if (scale >= 0.999) {
    image.close?.();
    return { dataUrl: await blobToDataUrl(blob), frameSize: sourceFrameSize, scale: 1 };
  }
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = typeof OffscreenCanvas === "function"
    ? new OffscreenCanvas(width, height)
    : Object.assign(document.createElement("canvas"), { width, height });
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("Tree Fidelity compiler could not create atlas downscale context.");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  image.close?.();
  const outputBlob = typeof canvas.convertToBlob === "function"
    ? await canvas.convertToBlob({ type: "image/png" })
    : await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Tree atlas PNG encoding failed.")), "image/png"));
  return { dataUrl: await blobToDataUrl(outputBlob), frameSize: targetFrameSize, scale };
}

function applyCompiledAtlasMetadata(atlas, compiled, sourceFrameSize) {
  if (!atlas) return;
  atlas.assetId = compiled.dataUrl;
  atlas.metadata = {
    ...(atlas.metadata ?? {}),
    sourceFrameSize,
    frameSize: compiled.frameSize,
    compiledScale: compiled.scale,
    compiledAsset: true
  };
  delete atlas.metadata.width;
  delete atlas.metadata.height;
  delete atlas.runtimeImage;
}

async function serializePackages(runtime) {
  const packages = [];
  for (let index = 0; index < runtime.packageIds.length; index += 1) {
    const assetId = runtime.packageIds[index];
    const value = structuredClone(runtime.assets.getValue(assetId));
    if (!value?.archetypeId) throw new Error(`Compiled asset ${assetId} has no portable package value.`);
    const farAtlas = value.forms?.far?.atlas;
    const horizonAtlas = value.forms?.horizon?.atlas;
    const source = farAtlas?.assetId ?? horizonAtlas?.assetId;
    const sourceFrameSize = Math.max(1, Number(farAtlas?.metadata?.frameSize ?? horizonAtlas?.metadata?.frameSize) || 256);
    const compiled = await compileAtlas(source, farAtlas?.metadata ?? horizonAtlas?.metadata ?? {});
    applyCompiledAtlasMetadata(farAtlas, compiled, sourceFrameSize);
    applyCompiledAtlasMetadata(horizonAtlas, compiled, sourceFrameSize);
    packages.push({ assetId, value });
    update(0.9 + (index + 1) / runtime.packageIds.length * 0.09, `Serializing ${index + 1}/${runtime.packageIds.length} compiled tree packages`);
  }
  return packages;
}

function fullyReusedPrebuilt(usage) {
  return Number(usage?.packageHits ?? 0) === PREHISTORIC_TREE_ARCHETYPES.length
    && Number(usage?.manifestHits ?? 0) >= 1
    && Number(usage?.runtimeFallbackPackages ?? 0) === 0
    && Number(usage?.runtimeFallbackManifest ?? 0) === 0;
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
  const prebuiltUsage = structuredClone(runtime.prebuiltFidelityUsage ?? null);
  const reusedPrebuilt = fullyReusedPrebuilt(prebuiltUsage);
  const packages = reusedPrebuilt ? [] : await serializePackages(runtime);
  const result = {
    schema: PREBUILT_TREE_FIDELITY_SCHEMA,
    packageVersion: String(TREE_FIDELITY_PACKAGE_VERSION),
    providerRevision: BOUNDED_TREE_FIDELITY_PROVIDER_REVISION,
    growthRevision: runtime.treeGrowthRevision,
    growthDigest: runtime.treeGrowthDigest,
    foliageAtlasRevision: runtime.foliageAtlasRevision,
    speciesCount: PREHISTORIC_TREE_ARCHETYPES.length,
    compiledFrameSize: COMPILED_FRAME_SIZE,
    reusedPrebuilt,
    elapsedMs: performance.now() - startedAt,
    prebuiltUsage,
    receipt: structuredClone(receipt),
    packages
  };
  globalThis.__PREHISTORIC_TREE_COMPILER_RESULT__ = result;
  globalThis.__PREHISTORIC_TREE_COMPILER_READY__ = true;
  update(1, reusedPrebuilt ? "Matching compiled tree assets reused" : `Tree Fidelity compiler ready · ${packages.length} packages`);
} catch (error) {
  globalThis.__PREHISTORIC_TREE_COMPILER_ERROR__ = error?.stack || error?.message || String(error);
  update(0, globalThis.__PREHISTORIC_TREE_COMPILER_ERROR__);
  throw error;
}
