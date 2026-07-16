function imageFromSource(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve(image);
    };
    image.onload = finish;
    image.onerror = () => reject(new Error("Tree fidelity impostor atlas could not be decoded."));
    image.src = source;
    if (typeof image.decode === "function") image.decode().then(finish, () => {});
  });
}

function imageDimensions(image) {
  return {
    width: Number(image?.width ?? image?.naturalWidth ?? image?.videoWidth ?? 0),
    height: Number(image?.height ?? image?.naturalHeight ?? image?.videoHeight ?? 0)
  };
}

async function decodeAtlasSource(source) {
  if (typeof createImageBitmap === "function" && typeof fetch === "function") {
    const response = await fetch(source);
    if (!response.ok && !source.startsWith("data:")) throw new Error(`Tree fidelity atlas request failed: ${response.status}`);
    return createImageBitmap(await response.blob(), { premultiplyAlpha: "none", colorSpaceConversion: "default" });
  }
  return imageFromSource(source);
}

function createReadbackCanvas(image, width, height) {
  const canvas = typeof OffscreenCanvas === "function"
    ? new OffscreenCanvas(width, height)
    : document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Tree fidelity atlas requires a readable 2D canvas.");
  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return { canvas, context };
}

function computeOpaqueFrame(context, atlas, frame, atlasWidth, atlasHeight) {
  const frameSize = Math.max(1, Number(atlas.metadata?.frameSize) || 256);
  const columns = Math.max(1, Number(atlas.metadata?.columns) || Math.floor(atlasWidth / frameSize) || 1);
  const rows = Math.max(1, Number(atlas.metadata?.rows) || Math.floor(atlasHeight / frameSize) || 1);
  const cell = frame.atlasCell ?? [Number(frame.frameIndex ?? 0) % columns, Math.floor(Number(frame.frameIndex ?? 0) / columns)];
  const cellX = Math.max(0, Math.min(columns - 1, Math.floor(Number(cell[0]) || 0)));
  const cellY = Math.max(0, Math.min(rows - 1, Math.floor(Number(cell[1]) || 0)));
  const originX = cellX * frameSize;
  const originY = cellY * frameSize;
  const width = Math.min(frameSize, atlasWidth - originX);
  const height = Math.min(frameSize, atlasHeight - originY);
  const pixels = context.getImageData(originX, originY, width, height).data;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[(y * width + x) * 4 + 3] <= 8) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  if (maxX < minX || maxY < minY) {
    minX = 0;
    minY = 0;
    maxX = width - 1;
    maxY = height - 1;
  } else {
    const margin = 2;
    minX = Math.max(0, minX - margin);
    minY = Math.max(0, minY - margin);
    maxX = Math.min(width - 1, maxX + margin);
    maxY = Math.min(height - 1, maxY + margin);
  }
  const opaqueWidth = Math.max(1, maxX - minX + 1);
  const opaqueHeight = Math.max(1, maxY - minY + 1);
  const absoluteMinX = originX + minX;
  const absoluteMinY = originY + minY;
  frame.atlasCell = [cellX, cellY];
  frame.opaqueBoundsPixels = { minX, minY, maxX, maxY, width: opaqueWidth, height: opaqueHeight };
  frame.uvRect = [
    absoluteMinX / atlasWidth,
    absoluteMinY / atlasHeight,
    opaqueWidth / atlasWidth,
    opaqueHeight / atlasHeight
  ];
  frame.opaqueAspect = opaqueWidth / opaqueHeight;
  frame.opaqueCoverage = opaqueWidth * opaqueHeight / Math.max(1, width * height);
  frame.groundAnchorNormalized = [
    (minX + opaqueWidth * 0.5) / Math.max(1, width),
    (maxY + 1) / Math.max(1, height)
  ];
  return frame;
}

function enrichFormFrames(form, image) {
  if (!form?.atlas || !Array.isArray(form.frames)) return 0;
  const dimensions = imageDimensions(image);
  if (dimensions.width < 1 || dimensions.height < 1) throw new Error("Tree fidelity atlas decoded without valid dimensions.");
  const { context } = createReadbackCanvas(image, dimensions.width, dimensions.height);
  form.atlas.metadata = {
    ...(form.atlas.metadata ?? {}),
    width: dimensions.width,
    height: dimensions.height,
    opaqueBoundsRevision: 1
  };
  for (const frame of form.frames) computeOpaqueFrame(context, form.atlas, frame, dimensions.width, dimensions.height);
  return form.frames.length;
}

export async function hydrateTreeFidelityRuntimeImages(runtime, options = {}) {
  if (!runtime?.assets || !Array.isArray(runtime.packageIds)) {
    throw new TypeError("hydrateTreeFidelityRuntimeImages requires a tree fidelity asset runtime.");
  }
  const packageValues = runtime.packageIds.map((assetId) => runtime.assets.getValue(assetId)).filter(Boolean);
  const atlasImages = new Map();
  const uniqueSources = [];
  for (const packageValue of packageValues) {
    for (const formId of ["far", "horizon"]) {
      const atlas = packageValue?.forms?.[formId]?.atlas;
      if (!atlas?.assetId) continue;
      const source = String(atlas.assetId);
      if (!atlasImages.has(source)) {
        atlasImages.set(source, null);
        uniqueSources.push(source);
      }
    }
  }

  let completed = 0;
  for (const source of uniqueSources) {
    const image = await decodeAtlasSource(source);
    const dimensions = imageDimensions(image);
    if (dimensions.width < 1 || dimensions.height < 1) throw new Error("Tree fidelity atlas image has no usable pixel data.");
    atlasImages.set(source, image);
    completed += 1;
    options.onProgress?.(completed / Math.max(1, uniqueSources.length), `Decoding tree atlas ${completed}/${uniqueSources.length}`);
  }

  let frameCount = 0;
  for (const packageValue of packageValues) {
    const processedForms = new Set();
    for (const formId of ["far", "horizon"]) {
      const form = packageValue?.forms?.[formId];
      const atlas = form?.atlas;
      if (!atlas?.assetId) continue;
      const image = atlasImages.get(String(atlas.assetId));
      if (!image) throw new Error(`Tree fidelity atlas ${atlas.assetId} was not decoded.`);
      atlas.runtimeImage = image;
      const identity = `${atlas.assetId}:${form.frames?.map((entry) => entry.frameIndex).join(",")}`;
      if (processedForms.has(identity)) continue;
      processedForms.add(identity);
      frameCount += enrichFormFrames(form, image);
    }
  }

  return Object.freeze({ decoded: uniqueSources.length, total: uniqueSources.length, frames: frameCount });
}

export default hydrateTreeFidelityRuntimeImages;
