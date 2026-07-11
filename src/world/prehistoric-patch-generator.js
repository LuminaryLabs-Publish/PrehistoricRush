function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hash(x, z, seed = 1) {
  let value = Math.imul(x | 0, 374761393) ^ Math.imul(z | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function matrixFromScaleTranslation(scaleX, scaleY, scaleZ, x, y, z) {
  return [
    scaleX, 0, 0, 0,
    0, scaleY, 0, 0,
    0, 0, scaleZ, 0,
    x, y, z, 1
  ];
}

function matrixFromYRotationScaleTranslation(rotation, scaleX, scaleY, scaleZ, x, y, z) {
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  return [
    cosine * scaleX, 0, -sine * scaleX, 0,
    0, scaleY, 0, 0,
    sine * scaleZ, 0, cosine * scaleZ, 0,
    x, y, z, 1
  ];
}

function createRouteSampler(samples) {
  if (!Array.isArray(samples) || samples.length === 0) throw new TypeError("Patch generator requires route samples.");

  function nearest(x, z, hintIndex = 0, radius = samples.length) {
    const start = Math.max(0, hintIndex - radius);
    const end = Math.min(samples.length - 1, hintIndex + radius);
    let bestIndex = start;
    let bestDistanceSq = Infinity;
    for (let index = start; index <= end; index += 1) {
      const point = samples[index];
      const dx = x - point.x;
      const dz = z - point.z;
      const distanceSq = dx * dx + dz * dz;
      if (distanceSq < bestDistanceSq) {
        bestDistanceSq = distanceSq;
        bestIndex = index;
      }
    }
    const point = samples[bestIndex];
    return {
      index: bestIndex,
      x: point.x,
      z: point.z,
      width: point.width,
      distance: Math.sqrt(bestDistanceSq)
    };
  }

  function classify(distance, width) {
    if (distance <= width) return "path";
    if (distance <= width + 1.8) return "edge";
    if (distance <= width + 3.2) return "verge";
    return "forest";
  }

  return { samples, nearest, classify };
}

export function createPrehistoricPatchGenerator(options = {}) {
  const config = {
    seed: Number(options.config?.seed ?? 238991),
    chunk: Number(options.config?.chunk ?? 56),
    segments: Number(options.config?.segments ?? 30),
    trees: Number(options.config?.trees ?? 7),
    grass: Number(options.config?.grass ?? 70),
    shardsPerPatch: Number(options.config?.shardsPerPatch ?? 2)
  };
  const treeTypes = options.treeTypes ?? [];
  const route = createRouteSampler(options.routeSamples ?? []);
  const spacing = config.chunk / config.segments;

  function noise(x, z) {
    return Math.sin((x + config.seed) * 0.019) * 1.6 +
      Math.cos((z - config.seed) * 0.022) * 1.3 +
      Math.sin((x + z) * 0.008) * 2.6 +
      Math.cos((x - z) * 0.006) * 1.7;
  }

  function sampleHeight(x, z, hintIndex) {
    const nearest = route.nearest(x, z, hintIndex, 120);
    return {
      y: noise(x, z) - Math.max(0, 1 - nearest.distance / (nearest.width + 2.4)) * 0.34,
      nearest
    };
  }

  return function generatePatch(request = {}) {
    const chunkX = Number(request.x);
    const chunkZ = Number(request.z);
    const patchId = request.patchId ?? `${chunkX}:${chunkZ}`;
    const minX = chunkX * config.chunk - config.chunk * 0.5;
    const minZ = chunkZ * config.chunk - config.chunk * 0.5;
    const maxX = minX + config.chunk;
    const maxZ = minZ + config.chunk;
    const centerX = chunkX * config.chunk;
    const centerZ = chunkZ * config.chunk;
    const centerNearest = route.nearest(centerX, centerZ, 0, route.samples.length);
    const vertexSide = config.segments + 1;
    const vertexCount = vertexSide * vertexSide;
    const heights = new Float32Array(vertexCount);
    const colors = new Float32Array(vertexCount * 3);
    const normals = new Float32Array(vertexCount * 3);

    for (let z = 0; z < vertexSide; z += 1) {
      for (let x = 0; x < vertexSide; x += 1) {
        const index = z * vertexSide + x;
        const worldX = minX + x * spacing;
        const worldZ = minZ + z * spacing;
        const sample = sampleHeight(worldX, worldZ, centerNearest.index);
        const region = route.classify(sample.nearest.distance, sample.nearest.width);
        const color = region === "path"
          ? [0.36, 0.25, 0.13]
          : region === "edge"
            ? [0.34, 0.36, 0.16]
            : region === "verge"
              ? [0.18, 0.39, 0.18]
              : [0.11, 0.29, 0.13];
        heights[index] = sample.y;
        colors[index * 3] = color[0];
        colors[index * 3 + 1] = color[1];
        colors[index * 3 + 2] = color[2];
      }
    }

    for (let z = 0; z < vertexSide; z += 1) {
      for (let x = 0; x < vertexSide; x += 1) {
        const index = z * vertexSide + x;
        const left = heights[z * vertexSide + Math.max(0, x - 1)];
        const right = heights[z * vertexSide + Math.min(vertexSide - 1, x + 1)];
        const down = heights[Math.max(0, z - 1) * vertexSide + x];
        const up = heights[Math.min(vertexSide - 1, z + 1) * vertexSide + x];
        const nx = left - right;
        const ny = spacing * 2;
        const nz = down - up;
        const length = Math.hypot(nx, ny, nz) || 1;
        normals[index * 3] = nx / length;
        normals[index * 3 + 1] = ny / length;
        normals[index * 3 + 2] = nz / length;
      }
    }

    const trees = treeTypes.map(() => ({ trunks: [], crowns: [] }));
    const grass = [[], [], []];
    const colliders = [];
    const pickups = [];

    for (let index = 0; index < config.trees; index += 1) {
      const x = chunkX * config.chunk + (hash(chunkX * 31 + index, chunkZ * 17, 11) - 0.5) * config.chunk;
      const z = chunkZ * config.chunk + (hash(chunkX * 19, chunkZ * 23 + index, 13) - 0.5) * config.chunk;
      const sample = sampleHeight(x, z, centerNearest.index);
      if (sample.nearest.distance < sample.nearest.width + 5.5) continue;
      const typeIndex = Math.floor(hash(chunkX + index, chunkZ - index, 41) * treeTypes.length) % treeTypes.length;
      const type = treeTypes[typeIndex];
      const height = type[0] + hash(chunkX, chunkZ, index + 47) * (type[1] - type[0]);
      const radius = type[2] * (0.82 + hash(index, chunkX, 61) * 0.42);
      const crownRadius = type[3];
      const crownHeight = type[4];
      const crownY = sample.y + height * 0.78;
      const treeId = `tree-${chunkX}-${chunkZ}-${index}`;
      trees[typeIndex].trunks.push({
        id: `${treeId}:trunk`,
        matrix: matrixFromScaleTranslation(radius, height, radius, x, sample.y + height * 0.5, z),
        bounds: { min: [x - radius, sample.y, z - radius], max: [x + radius, sample.y + height, z + radius] },
        metadata: { treeId, cellId: patchId, typeIndex }
      });
      trees[typeIndex].crowns.push({
        id: `${treeId}:crown`,
        matrix: matrixFromScaleTranslation(crownRadius, crownHeight, crownRadius, x, crownY, z),
        bounds: {
          min: [x - crownRadius, crownY - crownHeight * 0.5, z - crownRadius],
          max: [x + crownRadius, crownY + crownHeight * 0.5, z + crownRadius]
        },
        metadata: { treeId, cellId: patchId, typeIndex }
      });
      colliders.push({ id: treeId, x, y: sample.y, z, radius: radius * 1.3, shape: "ball", tags: ["hazard", "tree"] });
    }

    for (let index = 0; index < config.grass; index += 1) {
      const x = chunkX * config.chunk + (hash(chunkX * 71 + index, chunkZ * 37, 79) - 0.5) * config.chunk;
      const z = chunkZ * config.chunk + (hash(chunkX * 43, chunkZ * 59 + index, 83) - 0.5) * config.chunk;
      const sample = sampleHeight(x, z, centerNearest.index);
      const region = route.classify(sample.nearest.distance, sample.nearest.width);
      if (region === "path") continue;
      const layerIndex = region === "edge"
        ? 0
        : region === "verge"
          ? (hash(index, chunkX, 89) > 0.48 ? 1 : 2)
          : (hash(index, chunkZ, 97) > 0.28 ? 1 : 0);
      const layer = [
        { h: 0.26, w: 0.46 },
        { h: 0.78, w: 0.72 },
        { h: 1.28, w: 0.9 }
      ][layerIndex];
      const routeScale = region === "edge" ? 0.22 : region === "verge" ? 0.72 : 1;
      const rotation = hash(index, chunkZ, 109) * Math.PI;
      grass[layerIndex].push({
        id: `grass-${chunkX}-${chunkZ}-${index}`,
        matrix: matrixFromYRotationScaleTranslation(rotation, layer.w, layer.h * routeScale, layer.w, x, sample.y, z)
      });
    }

    for (let index = 0; index < config.shardsPerPatch; index += 1) {
      const offset = Math.floor((hash(chunkX, chunkZ, index + 149) * 2 - 1) * 40);
      const routeIndex = clamp(centerNearest.index + offset, 0, route.samples.length - 1);
      const point = route.samples[routeIndex];
      const x = point.x + (hash(index, chunkX, 151) * 2 - 1) * Math.min(point.width * 0.65, 2.1);
      const z = point.z;
      if (x < minX || x > maxX || z < minZ || z > maxZ) continue;
      const y = sampleHeight(x, z, routeIndex).y + 1.15;
      pickups.push({ id: `${chunkX}:${chunkZ}:${index}`, x, y, z, radius: 1.1 });
    }

    return {
      id: patchId,
      key: request.cacheKey,
      x: chunkX,
      z: chunkZ,
      seed: `${request.worldSeed}:${patchId}`,
      terrain: { heights, colors, normals, segments: config.segments },
      trees,
      grass,
      pickups,
      colliders,
      bounds: { min: [minX, -16, minZ], max: [maxX, 72, maxZ] }
    };
  };
}

export function collectPatchTransferables(patch) {
  return [
    patch?.terrain?.heights?.buffer,
    patch?.terrain?.colors?.buffer,
    patch?.terrain?.normals?.buffer
  ].filter(Boolean);
}
