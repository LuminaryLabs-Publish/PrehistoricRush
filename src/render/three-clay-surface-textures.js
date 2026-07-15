function hash32(x, y, seed) {
  let value = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return (value ^ (value >>> 16)) >>> 0;
}

function seededRandom(seed = 1) {
  let state = hash32(seed, seed ^ 0x9e3779b9, 17) || 1;
  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

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

function context2d(canvas) {
  const context = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
  if (!context) throw new Error("Could not create a 2D canvas context for clay textures.");
  return context;
}

function buildHeightCanvas(size, seed) {
  const canvas = createCanvas(size);
  const context = context2d(canvas);
  const image = context.createImageData(size, size);
  const data = image.data;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const offset = (y * size + x) * 4;
      const wave = Math.sin(x * 0.041 + y * 0.009) +
        Math.sin(y * 0.037 - x * 0.007) +
        Math.sin((x + y) * 0.018) * 0.7 +
        Math.sin((x * 2 - y) * 0.0105) * 0.45;
      const grain = (hash32(x, y, seed) / 4294967295 - 0.5) * 5;
      const value = Math.max(0, Math.min(255, Math.round(128 + wave * 4.2 + grain)));
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
    const brighten = random() > 0.48;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, brighten ? "rgba(255,255,255,.10)" : "rgba(0,0,0,.10)");
    gradient.addColorStop(0.55, brighten ? "rgba(255,255,255,.035)" : "rgba(0,0,0,.035)");
    gradient.addColorStop(1, "rgba(128,128,128,0)");
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }
  return canvas;
}

function buildNormalCanvas(heightCanvas, strength) {
  const size = heightCanvas.width;
  const source = context2d(heightCanvas).getImageData(0, 0, size, size).data;
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
      let nx = -dx;
      let ny = -dy;
      let nz = 1;
      const length = Math.hypot(nx, ny, nz) || 1;
      nx /= length;
      ny /= length;
      nz /= length;
      const offset = (y * size + x) * 4;
      target[offset] = Math.round((nx * 0.5 + 0.5) * 255);
      target[offset + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      target[offset + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      target[offset + 3] = 255;
    }
  }
  context.putImageData(output, 0, 0);
  return canvas;
}

function buildRoughnessCanvas(heightCanvas, seed) {
  const size = heightCanvas.width;
  const source = context2d(heightCanvas).getImageData(0, 0, size, size).data;
  const canvas = createCanvas(size);
  const context = context2d(canvas);
  const output = context.createImageData(size, size);
  const target = output.data;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const offset = (y * size + x) * 4;
      const height = source[offset] - 128;
      const grain = (hash32(x, y, seed ^ 0x5bd1e995) / 4294967295 - 0.5) * 18;
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
  texture.anisotropy = anisotropy;
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
