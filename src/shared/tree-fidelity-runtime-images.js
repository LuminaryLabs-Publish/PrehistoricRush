function imageFromSource(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Tree fidelity impostor atlas could not be decoded."));
    image.src = source;
    if (typeof image.decode === "function") image.decode().then(() => resolve(image), () => {});
  });
}

async function decodeAtlas(atlas) {
  if (!atlas?.assetId || atlas.runtimeImage) return atlas?.runtimeImage ?? null;
  const source = String(atlas.assetId);
  let image = null;
  if (typeof createImageBitmap === "function" && typeof fetch === "function") {
    const response = await fetch(source);
    if (!response.ok && !source.startsWith("data:")) throw new Error(`Tree fidelity atlas request failed: ${response.status}`);
    image = await createImageBitmap(await response.blob());
  } else {
    image = await imageFromSource(source);
  }
  atlas.runtimeImage = image;
  return image;
}

export async function hydrateTreeFidelityRuntimeImages(runtime, options = {}) {
  if (!runtime?.assets || !Array.isArray(runtime.packageIds)) {
    throw new TypeError("hydrateTreeFidelityRuntimeImages requires a tree fidelity asset runtime.");
  }
  const atlases = [];
  for (const assetId of runtime.packageIds) {
    const packageValue = runtime.assets.getValue(assetId);
    for (const formId of ["far", "horizon"]) {
      const atlas = packageValue?.forms?.[formId]?.atlas;
      if (atlas) atlases.push(atlas);
    }
  }
  let completed = 0;
  for (const atlas of atlases) {
    await decodeAtlas(atlas);
    completed += 1;
    options.onProgress?.(completed / Math.max(1, atlases.length), `Decoding tree atlas ${completed}/${atlases.length}`);
  }
  return Object.freeze({ decoded: completed, total: atlases.length });
}

export default hydrateTreeFidelityRuntimeImages;
