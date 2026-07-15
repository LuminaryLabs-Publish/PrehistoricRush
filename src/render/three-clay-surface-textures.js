function createCanvas(size) {
  if (typeof document !== "undefined" && typeof document.createElement === "function") {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    return canvas;
  }
  if (typeof OffscreenCanvas === "function") return new OffscreenCanvas(size, size);
  throw new Error("Clay texture generation requires Canvas or OffscreenCanvas support.");
}

function context2d(canvas, readFrequently = false) {
  const context = canvas.getContext("2d", { alpha: false, willReadFrequently: readFrequently });
  if (!context) throw new Error("Could not create a 2D canvas context for clay textures.");
  return context;
}

function seededRandom(seed = 1) {
  let state = (Number(seed) || 1) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function drawWrappedBrush(context, size, x, y, radius, brighten) {
  for (const offsetX of [-size, 0, size]) {
    for (const offsetY of [-size, 0, size]) {
      const centerX = x + offsetX;
      const centerY = y + offsetY;
      if (centerX + radius < 0 || centerY + radius < 0 || centerX - radius > size || centerY - radius > size) continue;
      const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, brighten ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)");
      gradient.addColorStop(0.55, brighten ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.035)");
      gradient.addColorStop(1, "rgba(128,128,128,0)");
      context.fillStyle = gradient;
      context.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);
    }
  }
}

function buildHeightCanvas(size, seed) {
  const canvas = createCanvas(size);
  const context = context2d(canvas, true);
  const image = context.createImageData(size, size);
  const data = image.data;
  const phase = (Number(seed) % 8192) / 8192 * Math.PI * 2;
  const tau = Math.PI * 2;
  for (let y = 0; y < size; y += 1) {
    const v = y / size * tau;
    for (let x = 0; x < size; x += 1) {
      const u = x / size * tau;
      const offset = (y * size + x) * 4;
      const broad = Math.sin(u * 3 + v * 2 + phase) * 0.7 +
        Math.sin(u * 7 - v * 5 - phase * 0.7) * 0.42 +
        Math.sin(u * 13 + v * 11 + phase * 1.3) * 0.2;
      const grain = Math.sin(u * 37 + v * 29 + phase * 2.1) * 0.12 +
        Math.sin(u * 61 - v * 43 - phase * 1.7) * 0.07;
      const value = Math.max(0, Math.min(255, Math.round(128 + broad * 7 + grain * 8)));
      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;
      data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);

  const random = seededRandom(seed);
  for (let index = 0; index < 180; index += 1) {
    const x = random() * size;
    const y = random() * size;
    const radius = size * (0.004 + random() * 0.026);
    drawWrappedBrush(context, size, x, y, radius, random() > 0.48);
  }
  return canvas;
}

function buildNormalCanvas(heightCanvas, strength) {
  const size = heightCanvas.width;
  const source = context2d(heightCanvas, true).getImageData(0, 0, size, size).data;
  const canvas = createCanvas(size);
  const context = context2d(canvas);
  const output = context.createImageData(size, size);
  const target = output.data;
  const sample = (x, y) => {
    const wrappedX = (x + size) % size;
    const wrappedY = (y + size) % size;
    return source[(wrappedY * size + wrappedX) * 4] / 255;
  };
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (sample(x + 1, y) - sample(x - 1, y)) * strength;
      const dy = (sample(x, y + 1) - sample(x, y - 1)) * strength;
      const length = Math.hypot(dx, dy, 1) || 1;
      const offset = (y * size + x) * 4;
      target[offset] = Math.round((-dx / length * 0.5 + 0.5) * 255);
      target[offset + 1] = Math.round((-dy / length * 0.5 + 0.5) * 255);
      target[offset + 2] = Math.round((1 / length * 0.5 + 0.5) * 255);
      target[offset + 3] = 255;
    }
  }
  context.putImageData(output, 0, 0);
  return canvas;
}

function buildRoughnessCanvas(heightCanvas, seed) {
  const size = heightCanvas.width;
  const source = context2d(heightCanvas, true).getImageData(0, 0, size, size).data;
  const canvas = createCanvas(size);
  const context = context2d(canvas);
  const output = context.createImageData(size, size);
  const target = output.data;
  const phase = (Number(seed) % 4096) / 4096 * Math.PI * 2;
  const tau = Math.PI * 2;
  for (let y = 0; y < size; y += 1) {
    const v = y / size * tau;
    for (let x = 0; x < size; x += 1) {
      const u = x / size * tau;
      const offset = (y * size + x) * 4;
      const height = source[offset] - 128;
      const grain = Math.sin(u * 41 + v * 31 + phase) * 7 + Math.sin(u * 73 - v * 47 - phase) * 3;
      const value = Math.max(150, Math.min(238, Math.round(205 + height * 0.26 + grain)));
      target[offset] = value;
      target[offset + 1] = value;
      target[offset + 2] = value;
      target[offset + 3] = 255;
    }
  }
  context.putImageData(output, 0, 0);
  return canvas;
}

function upscale(source, size) {
  if (source.width === size && source.height === size) return source;
  const canvas = createCanvas(size);
  const context = context2d(canvas);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(source, 0, 0, size, size);
  return canvas;
}

function configureTexture(THREE, texture, anisotropy) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = Math.max(1, Math.min(8, anisotropy));
  if ("colorSpace" in texture && THREE.NoColorSpace != null) texture.colorSpace = THREE.NoColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createClaySurfaceTextures(THREE, options = {}) {
  if (typeof THREE?.CanvasTexture !== "function") throw new TypeError("Three.js CanvasTexture support is required.");
  const resolution = Math.max(256, Math.floor(Number(options.resolution ?? 2048)));
  const workingResolution = Math.min(resolution, Math.max(256, Math.floor(Number(options.workingResolution ?? 1024))));
  const seed = Math.floor(Number(options.seed ?? 238991));
  const maximumAnisotropy = Math.max(1, Math.floor(Number(options.maximumAnisotropy ?? 8)));
  const heightCanvas = buildHeightCanvas(workingResolution, seed);
  const normalCanvas = upscale(buildNormalCanvas(heightCanvas, Number(options.normalStrength ?? 8.5)), resolution);
  const roughnessCanvas = upscale(buildRoughnessCanvas(heightCanvas, seed), resolution);
  const normalMap = configureTexture(THREE, new THREE.CanvasTexture(normalCanvas), maximumAnisotropy);
  const roughnessMap = configureTexture(THREE, new THREE.CanvasTexture(roughnessCanvas), maximumAnisotropy);
  normalMap.name = options.normalId ?? "prehistoric-terrain-clay-normal-2k";
  roughnessMap.name = options.roughnessId ?? "prehistoric-terrain-clay-roughness-2k";
  return Object.freeze({
    resolution,
    workingResolution,
    normalMap,
    roughnessMap,
    dispose() {
      normalMap.dispose();
      roughnessMap.dispose();
    }
  });
}

export default createClaySurfaceTextures;
