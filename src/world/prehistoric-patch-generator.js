import { PREHISTORIC_TERRAIN_LOD_POLICY_INPUT } from "./prehistoric-terrain-lod-policy.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function smoothstep(edge0, edge1, value) {
  if (edge0 === edge1) return value < edge0 ? 0 : 1;
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function hash(x, z, seed = 1) {
  let value = Math.imul(x | 0, 374761393) ^ Math.imul(z | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function fieldNoise(x, z, seed, scale) {
  const first = Math.sin((x + seed * 11.7) * scale + Math.cos(z * scale * 0.63));
  const second = Math.cos((z - seed * 7.3) * scale * 1.37 - Math.sin(x * scale * 0.52));
  return clamp(0.5 + first * 0.27 + second * 0.23, 0, 1);
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

function mixColor(left, right, amount) {
  const t = clamp(amount, 0, 1);
  return [
    left[0] + (right[0] - left[0]) * t,
    left[1] + (right[1] - left[1]) * t,
    left[2] + (right[2] - left[2]) * t
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

function surfaceColor(worldX, worldZ, distance, width) {
  const path = [0.54, 0.39, 0.20];
  const edge = [0.43, 0.50, 0.22];
  const verge = [0.28, 0.49, 0.22];
  const forest = [0.18, 0.39, 0.18];
  const pathWeight = 1 - smoothstep(width - 0.35, width + 1.45, distance);
  const edgeWeight = 1 - smoothstep(width + 0.5, width + 3.0, distance);
  const vergeWeight = 1 - smoothstep(width + 2.1, width + 6.2, distance);
  const broad = Math.sin(worldX * 0.021 + worldZ * 0.012) * 0.5 + Math.cos(worldZ * 0.017 - worldX * 0.009) * 0.5;
  const stylizedVariation = broad * 0.035;

  let color = mixColor(forest, verge, vergeWeight);
  color = mixColor(color, edge, edgeWeight);
  color = mixColor(color, path, pathWeight);
  return color.map((channel, index) => clamp(channel + stylizedVariation * (index === 1 ? 0.72 : 1), 0, 1));
}

function treeMetadata(type, typeIndex) {
  return type?.[6] ?? { id: `tree-type-${typeIndex}`, typeIndex, distributionWeight: 1, ecology: {} };
}

function chooseTreeType(treeTypes, x, z, terrainY, chunkX, chunkZ, index, seed) {
  if (!treeTypes.length) return 0;
  const moisture = fieldNoise(x, z, seed + 113, 0.017);
  const elevation = clamp((terrainY + 10) / 28, 0, 1);
  const scores = treeTypes.map((type, typeIndex) => {
    const metadata = treeMetadata(type, typeIndex);
    const ecology = metadata.ecology ?? {};
    const moisturePreference = Number(ecology.moisture ?? 0.5);
    const elevationPreference = Number(ecology.elevation ?? 0.5);
    const clusterScale = Number(ecology.clusterScale ?? 0.018);
    const clusterStrength = clamp(Number(ecology.clusterStrength ?? 0.7), 0, 1);
    const moistureFit = 0.22 + (1 - Math.abs(moisture - moisturePreference)) * 0.78;
    const elevationFit = 0.3 + (1 - Math.abs(elevation - elevationPreference)) * 0.7;
    const cluster = fieldNoise(x + typeIndex * 137, z - typeIndex * 89, seed + typeIndex * 41, clusterScale);
    const clusterFit = 1 - clusterStrength * 0.58 + cluster * clusterStrength * 1.15;
    return Math.max(0.0001, Number(metadata.distributionWeight ?? 1) * moistureFit * elevationFit * clusterFit);
  });
  const total = scores.reduce((sum, value) => sum + value, 0);
  let cursor = hash(chunkX * 101 + index, chunkZ * 79 - index, seed + 509) * total;
  for (let typeIndex = 0; typeIndex < scores.length; typeIndex += 1) {
    cursor -= scores[typeIndex];
    if (cursor <= 0) return typeIndex;
  }
  return scores.length - 1;
}

function treeVariation(chunkX, chunkZ, index, typeIndex, x, z, seed) {
  const yawRadians = hash(chunkX * 37 + index, chunkZ * 53 - typeIndex, seed + 601) * Math.PI * 2;
  const leanXDegrees = hash(index * 71 + typeIndex, chunkX * 17, seed + 607) * 10 - 5;
  const leanZDegrees = hash(index * 43 - typeIndex, chunkZ * 29, seed + 613) * 10 - 5;
  const uniformScale = 0.84 + hash(chunkX * 19 + index, chunkZ * 23 + typeIndex, seed + 617) * 0.34;
  const heightScale = 0.92 + hash(index * 31, chunkX - chunkZ, seed + 619) * 0.2;
  const crownScale = 0.9 + hash(index * 47, chunkZ + typeIndex, seed + 631) * 0.2;
  const groundSink = 0.1 + hash(Math.floor(x * 10), Math.floor(z * 10), seed + 641) * 0.4;
  const hueShift = hash(index * 59, typeIndex * 67, seed + 643) * 0.1 - 0.05;
  const roughnessAdd = hash(index * 73, chunkX + chunkZ, seed + 647) * 0.12 - 0.06;
  const valueShift = hash(index * 83, typeIndex * 89, seed + 653) * 0.16 - 0.08;
  const tint = [
    clamp(1 + valueShift + hueShift * 0.7, 0.78, 1.18),
    clamp(1 + valueShift * 0.75, 0.78, 1.18),
    clamp(1 + valueShift - hueShift * 0.7, 0.78, 1.18)
  ];
  return {
    yawRadians,
    yawDegrees: yawRadians * 180 / Math.PI,
    leanXRadians: leanXDegrees * Math.PI / 180,
    leanZRadians: leanZDegrees * Math.PI / 180,
    leanXDegrees,
    leanZDegrees,
    uniformScale,
    heightScale,
    crownScale,
    groundSink,
    hueShift,
    roughnessAdd,
    valueShift,
    tint
  };
}

export function createPrehistoricPatchGenerator(options = {}) {
  const config = {
    seed: Number(options.config?.seed ?? 238991),
    chunk: Number(options.config?.chunk ?? 56),
    segments: PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.sourceResolution,
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
        const color = surfaceColor(worldX, worldZ, sample.nearest.distance, sample.nearest.width);
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
        const normalY = ny / length;
        normals[index * 3] = nx / length;
        normals[index * 3 + 1] = normalY;
        normals[index * 3 + 2] = nz / length;
        const slopeShade = 0.92 + normalY * 0.08;
        colors[index * 3] = clamp(colors[index * 3] * slopeShade, 0, 1);
        colors[index * 3 + 1] = clamp(colors[index * 3 + 1] * slopeShade, 0, 1);
        colors[index * 3 + 2] = clamp(colors[index * 3 + 2] * slopeShade, 0, 1);
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
      if (sample.nearest.distance < sample.nearest.width + 5.5 || treeTypes.length === 0) continue;
      const typeIndex = chooseTreeType(treeTypes, x, z, sample.y, chunkX, chunkZ, index, config.seed);
      const type = treeTypes[typeIndex];
      const metadata = treeMetadata(type, typeIndex);
      const variation = treeVariation(chunkX, chunkZ, index, typeIndex, x, z, config.seed);
      const baseHeight = type[0] + hash(chunkX, chunkZ, index + 47) * (type[1] - type[0]);
      const height = baseHeight * variation.uniformScale * variation.heightScale;
      const radius = type[2] * variation.uniformScale * (0.9 + hash(index, chunkX, 61) * 0.2);
      const crownHeight = type[3] * variation.uniformScale * variation.heightScale;
      const crownRadius = type[4] * variation.uniformScale * variation.crownScale;
      const visualGroundY = sample.y - variation.groundSink;
      const crownY = visualGroundY + height * 0.78;
      const treeId = `tree-${chunkX}-${chunkZ}-${index}`;
      const leanMargin = Math.sin(5 * Math.PI / 180) * height;
      variation.groundPosition = [x, visualGroundY, z];
      variation.speciesId = metadata.id;
      variation.averageHeight = metadata.averageHeight;
      variation.barkColor = metadata.barkColor;
      variation.foliageColor = metadata.foliageColor;
      variation.barkTexture = metadata.barkTexture;
      variation.foliageTexture = metadata.foliageTexture;

      const sharedMetadata = { treeId, cellId: patchId, typeIndex, speciesId: metadata.id, variation };
      trees[typeIndex].trunks.push({
        id: `${treeId}:trunk`,
        matrix: matrixFromYRotationScaleTranslation(variation.yawRadians, radius, height, radius, x, visualGroundY + height * 0.5, z),
        bounds: {
          min: [x - radius - leanMargin, visualGroundY, z - radius - leanMargin],
          max: [x + radius + leanMargin, visualGroundY + height, z + radius + leanMargin]
        },
        metadata: sharedMetadata
      });
      trees[typeIndex].crowns.push({
        id: `${treeId}:crown`,
        matrix: matrixFromYRotationScaleTranslation(variation.yawRadians, crownRadius, crownHeight, crownRadius, x, crownY, z),
        bounds: {
          min: [x - crownRadius - leanMargin * 0.35, crownY - crownHeight * 0.5, z - crownRadius - leanMargin * 0.35],
          max: [x + crownRadius + leanMargin * 0.35, crownY + crownHeight * 0.5, z + crownRadius + leanMargin * 0.35]
        },
        metadata: sharedMetadata
      });
      colliders.push({
        id: treeId,
        x,
        y: sample.y,
        z,
        radius: radius * 1.3,
        shape: "ball",
        tags: ["hazard", "tree"],
        metadata: { speciesId: metadata.id, visualGroundSink: variation.groundSink }
      });
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
      terrain: {
        heights,
        colors,
        normals,
        segments: config.segments,
        mapping: "world-space",
        materialRevision: "stylized-high-fidelity-v2"
      },
      trees,
      grass,
      pickups,
      colliders,
      bounds: { min: [minX, -16, minZ], max: [maxX, 80, maxZ] }
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
