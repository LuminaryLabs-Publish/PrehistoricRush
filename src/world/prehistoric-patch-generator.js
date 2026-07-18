import { PREHISTORIC_GROUND_COVER_ARCHETYPES } from "../shared/prehistoric-foliage-card-recipes.js";
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

function macroField(x, z, scale = 0.01) {
  const broad = Math.sin(x * scale + z * scale * 0.63) * 0.5 + 0.5;
  const cross = Math.cos(z * scale * 0.77 - x * scale * 0.41) * 0.5 + 0.5;
  const detail = Math.sin((x - z) * scale * 1.91) * 0.5 + 0.5;
  return clamp(broad * 0.48 + cross * 0.34 + detail * 0.18, 0, 1);
}

function matrixFromYRotationScaleTranslation(rotation, scaleX, scaleY, scaleZ, x, y, z) {
  return matrixFromEulerScaleTranslation(0, rotation, 0, scaleX, scaleY, scaleZ, x, y, z);
}

function matrixFromEulerScaleTranslation(rotationX, rotationY, rotationZ, scaleX, scaleY, scaleZ, x, y, z) {
  const a = Math.cos(rotationX);
  const b = Math.sin(rotationX);
  const c = Math.cos(rotationY);
  const d = Math.sin(rotationY);
  const e = Math.cos(rotationZ);
  const f = Math.sin(rotationZ);
  const m11 = c * e;
  const m12 = -c * f;
  const m13 = d;
  const m21 = b * d * e + a * f;
  const m22 = -b * d * f + a * e;
  const m23 = -b * c;
  const m31 = -a * d * e + b * f;
  const m32 = a * d * f + b * e;
  const m33 = a * c;
  return [
    m11 * scaleX, m21 * scaleX, m31 * scaleX, 0,
    m12 * scaleY, m22 * scaleY, m32 * scaleY, 0,
    m13 * scaleZ, m23 * scaleZ, m33 * scaleZ, 0,
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
    return { index: bestIndex, x: point.x, z: point.z, width: point.width, distance: Math.sqrt(bestDistanceSq) };
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
  const moistSoil = [0.16, 0.27, 0.14];
  const leafLitter = [0.34, 0.29, 0.16];
  const moss = [0.16, 0.42, 0.20];
  const pathWeight = 1 - smoothstep(width - 0.35, width + 1.45, distance);
  const edgeWeight = 1 - smoothstep(width + 0.5, width + 3.0, distance);
  const vergeWeight = 1 - smoothstep(width + 2.1, width + 6.2, distance);
  const broad = Math.sin(worldX * 0.021 + worldZ * 0.012) * 0.5 + Math.cos(worldZ * 0.017 - worldX * 0.009) * 0.5;
  const stylizedVariation = broad * 0.035;
  const forestMask = 1 - pathWeight;
  const litterWeight = smoothstep(0.56, 0.82, macroField(worldX + 47, worldZ - 31, 0.017)) * forestMask * 0.22;
  const moistureWeight = smoothstep(0.6, 0.88, macroField(worldX - 73, worldZ + 59, 0.012)) * forestMask * 0.18;
  const mossWeight = smoothstep(0.68, 0.92, macroField(worldX + 11, worldZ + 97, 0.025)) * forestMask * 0.12;
  let color = mixColor(forest, verge, vergeWeight);
  color = mixColor(color, edge, edgeWeight);
  color = mixColor(color, path, pathWeight);
  color = mixColor(color, leafLitter, litterWeight);
  color = mixColor(color, moistSoil, moistureWeight);
  color = mixColor(color, moss, mossWeight);
  return color.map((channel, index) => clamp(channel + stylizedVariation * (index === 1 ? 0.72 : 1), 0, 1));
}

function vegetationEnvironment(x, z, y, nearest, normalY) {
  return {
    moisture: clamp(0.5 + Math.sin(x * 0.011 + z * 0.007) * 0.27 + Math.cos(z * 0.019) * 0.18, 0, 1),
    elevation: clamp((y + 10) / 28, 0, 1),
    slope: clamp(1 - normalY, 0, 1),
    temperature: clamp(0.66 - y / 90 + Math.sin(z * 0.004) * 0.08, 0, 1),
    cluster: clamp(0.5 + Math.sin(x * 0.017 + z * 0.013) * 0.28 + Math.cos(x * 0.009 - z * 0.014) * 0.22, 0, 1),
    biome: nearest.distance < nearest.width + 12 ? "route-forest" : "deep-forest"
  };
}

function treeDensity(environment, x, z) {
  return clamp(0.5 + environment.cluster * 0.32 + macroField(x, z, 0.008) * 0.22, 0.42, 0.98);
}

function groundCoverDensity(environment, x, z) {
  return clamp(0.18 + environment.cluster * 0.42 + environment.moisture * 0.24 + macroField(x, z, 0.021) * 0.2, 0.12, 0.98);
}

function grassDensity(environment, x, z) {
  return clamp(0.15 + environment.cluster * 0.38 + environment.moisture * 0.24 + macroField(x, z, 0.03) * 0.24, 0.1, 0.96);
}

function normalYAt(x, z) {
  return clamp(0.72 + Math.cos(x * 0.031 - z * 0.027) * 0.24, 0, 1);
}

export function createPrehistoricPatchGenerator(options = {}) {
  const config = {
    seed: Number(options.config?.seed ?? 238991),
    chunk: Number(options.config?.chunk ?? 56),
    segments: PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.sourceResolution,
    trees: Number(options.config?.trees ?? 7),
    grass: Number(options.config?.grass ?? 96),
    groundCover: Number(options.config?.groundCover ?? 36),
    shardsPerPatch: Number(options.config?.shardsPerPatch ?? 2)
  };
  const treeTypes = options.treeTypes ?? [];
  const groundCoverArchetypes = options.groundCoverArchetypes ?? PREHISTORIC_GROUND_COVER_ARCHETYPES;
  const groundCoverById = new Map(groundCoverArchetypes.map((entry) => [entry.id, entry]));
  const vegetation = options.vegetation;
  if (!vegetation || typeof vegetation.selectSpecies !== "function" || typeof vegetation.createInstanceDescriptor !== "function") {
    throw new TypeError("Patch generator requires the Object Vegetation placement API.");
  }
  if (config.groundCover > 0 && typeof vegetation.selectGroundCoverSpecies !== "function") {
    throw new TypeError("Patch generator ground cover requires selectGroundCoverSpecies().");
  }
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
    return { y: noise(x, z) - Math.max(0, 1 - nearest.distance / (nearest.width + 2.4)) * 0.34, nearest };
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
    const groundCover = [];
    const colliders = [];
    const pickups = [];

    for (let index = 0; index < config.trees; index += 1) {
      const x = chunkX * config.chunk + (hash(chunkX * 31 + index, chunkZ * 17, 11) - 0.5) * config.chunk;
      const z = chunkZ * config.chunk + (hash(chunkX * 19, chunkZ * 23 + index, 13) - 0.5) * config.chunk;
      const sample = sampleHeight(x, z, centerNearest.index);
      if (sample.nearest.distance < sample.nearest.width + 5.5 || treeTypes.length === 0) continue;
      const environment = vegetationEnvironment(x, z, sample.y, sample.nearest, normalYAt(x, z));
      if (hash(chunkX * 113 + index, chunkZ * 127, 191) > treeDensity(environment, x, z)) continue;
      const treeId = `tree-${chunkX}-${chunkZ}-${index}`;
      const instanceSeed = `${config.seed}:${patchId}:tree:${index}`;
      const species = vegetation.selectSpecies(environment, instanceSeed);
      if (!species) continue;
      const routeClearance = sample.nearest.distance - sample.nearest.width;
      const averageHeight = Number(species.metadata?.averageHeight ?? 0);
      const shape = String(species.metadata?.shape ?? "");
      const routeFriendly = /cycad|fern|short-palm|horsetail/.test(shape);
      if (routeClearance < 9 && averageHeight > 32 && !routeFriendly) continue;
      const typeIndex = Number(species.metadata?.typeIndex);
      const type = treeTypes[typeIndex];
      if (!type || !trees[typeIndex]) throw new RangeError(`Vegetation species ${species.id} has invalid typeIndex ${typeIndex}.`);
      const instance = vegetation.createInstanceDescriptor({
        id: treeId,
        speciesId: species.id,
        seed: instanceSeed,
        position: [x, sample.y, z],
        environment,
        metadata: { patchId, typeIndex, kind: "tree" }
      });
      const variation = instance.variation;
      const yawRadians = Number(variation.yawDegrees ?? 0) * Math.PI / 180;
      const leanXRadians = Number(variation.leanXDegrees ?? 0) * Math.PI / 180;
      const leanZRadians = Number(variation.leanZDegrees ?? 0) * Math.PI / 180;
      const baseHeight = type[0] + hash(chunkX, chunkZ, index + 47) * (type[1] - type[0]);
      const height = baseHeight * variation.uniformScale * variation.heightScale;
      const radius = type[2] * variation.uniformScale * (0.9 + hash(index, chunkX, 61) * 0.2);
      const crownHeight = type[3] * variation.uniformScale * variation.heightScale;
      const crownRadius = type[4] * variation.uniformScale * variation.crownScale;
      const visualGroundY = sample.y - variation.groundSink;
      const crownY = visualGroundY + height * 0.78;
      const leanMargin = Math.sin(5 * Math.PI / 180) * height;
      const enrichedVariation = {
        ...variation,
        yawRadians,
        leanXRadians,
        leanZRadians,
        groundPosition: [x, visualGroundY, z],
        speciesId: species.id,
        averageHeight: species.metadata?.averageHeight,
        barkColor: species.metadata?.barkColor,
        foliageColor: species.metadata?.foliageColor,
        barkTexture: species.metadata?.barkTexture,
        foliageTexture: species.metadata?.foliageTexture,
        foliageCardFamily: species.metadata?.foliageCardFamily
      };
      const sharedMetadata = { treeId, cellId: patchId, typeIndex, speciesId: species.id, vegetationInstance: instance, variation: enrichedVariation };
      trees[typeIndex].trunks.push({
        id: `${treeId}:trunk`,
        matrix: matrixFromEulerScaleTranslation(leanXRadians, yawRadians, leanZRadians, radius, height, radius, x, visualGroundY + height * 0.5, z),
        bounds: { min: [x - radius - leanMargin, visualGroundY, z - radius - leanMargin], max: [x + radius + leanMargin, visualGroundY + height, z + radius + leanMargin] },
        metadata: sharedMetadata
      });
      trees[typeIndex].crowns.push({
        id: `${treeId}:crown`,
        matrix: matrixFromEulerScaleTranslation(leanXRadians * 0.35, yawRadians, leanZRadians * 0.35, crownRadius, crownHeight, crownRadius, x, crownY, z),
        bounds: { min: [x - crownRadius - leanMargin * 0.35, crownY - crownHeight * 0.5, z - crownRadius - leanMargin * 0.35], max: [x + crownRadius + leanMargin * 0.35, crownY + crownHeight * 0.5, z + crownRadius + leanMargin * 0.35] },
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
        metadata: { speciesId: species.id, vegetationInstanceId: instance.id, visualGroundSink: variation.groundSink }
      });
    }

    for (let index = 0; index < config.groundCover; index += 1) {
      const x = chunkX * config.chunk + (hash(chunkX * 83 + index, chunkZ * 47, 167) - 0.5) * config.chunk;
      const z = chunkZ * config.chunk + (hash(chunkX * 53, chunkZ * 89 + index, 173) - 0.5) * config.chunk;
      const sample = sampleHeight(x, z, centerNearest.index);
      const region = route.classify(sample.nearest.distance, sample.nearest.width);
      if (region === "path") continue;
      const environment = vegetationEnvironment(x, z, sample.y, sample.nearest, normalYAt(x, z));
      const admission = hash(index, chunkX * 17 + chunkZ, 179);
      if (hash(chunkX * 137 + index, chunkZ * 139, 193) > groundCoverDensity(environment, x, z)) continue;
      if (region === "edge" && admission < 0.55) continue;
      if (region === "verge" && admission < 0.18) continue;
      const id = `ground-cover-${chunkX}-${chunkZ}-${index}`;
      const seed = `${config.seed}:${patchId}:ground-cover:${index}`;
      const species = vegetation.selectGroundCoverSpecies(environment, seed);
      if (!species) continue;
      const archetype = groundCoverById.get(species.id);
      if (!archetype) throw new RangeError(`Unknown ground-cover archetype: ${species.id}.`);
      const instance = vegetation.createInstanceDescriptor({
        id,
        speciesId: species.id,
        seed,
        position: [x, sample.y, z],
        environment,
        metadata: { patchId, kind: "ground-cover" }
      });
      const variation = instance.variation;
      const yaw = Number(variation.yawDegrees ?? 0) * Math.PI / 180;
      const leanX = Number(variation.leanXDegrees ?? 0) * Math.PI / 180;
      const leanZ = Number(variation.leanZDegrees ?? 0) * Math.PI / 180;
      const height = archetype.averageHeight * variation.uniformScale * variation.heightScale;
      const width = archetype.averageWidth * variation.uniformScale * variation.crownScale;
      const visualGroundY = sample.y - variation.groundSink;
      const family = archetype.familyId;
      groundCover.push({
        id,
        speciesId: species.id,
        familyId: family,
        matrix: matrixFromEulerScaleTranslation(leanX, yaw, leanZ, width, height, width, x, visualGroundY, z),
        bounds: { min: [x - width * 0.5, visualGroundY, z - width * 0.5], max: [x + width * 0.5, visualGroundY + height, z + width * 0.5] },
        tint: variation.tint,
        wind: {
          amplitude: Number(species.metadata?.wind?.amplitude ?? 0.1),
          frequency: Number(species.metadata?.wind?.frequency ?? 0.72),
          stiffness: Number(species.metadata?.wind?.stiffness ?? 0.68),
          phase: hash(chunkX * 97 + index, chunkZ * 101, 181) * Math.PI * 2
        },
        vegetationInstance: instance,
        metadata: { patchId, region, environment, visualGroundSink: variation.groundSink, densityPolicy: "production-patches-v1" }
      });
    }

    for (let index = 0; index < config.grass; index += 1) {
      const x = chunkX * config.chunk + (hash(chunkX * 71 + index, chunkZ * 37, 79) - 0.5) * config.chunk;
      const z = chunkZ * config.chunk + (hash(chunkX * 43, chunkZ * 59 + index, 83) - 0.5) * config.chunk;
      const sample = sampleHeight(x, z, centerNearest.index);
      const region = route.classify(sample.nearest.distance, sample.nearest.width);
      if (region === "path") continue;
      const environment = vegetationEnvironment(x, z, sample.y, sample.nearest, normalYAt(x, z));
      if (hash(chunkX * 149 + index, chunkZ * 151, 197) > grassDensity(environment, x, z)) continue;
      const layerIndex = region === "edge" ? 0 : region === "verge" ? (hash(index, chunkX, 89) > 0.48 ? 1 : 2) : (hash(index, chunkZ, 97) > 0.28 ? 1 : 0);
      const layer = [{ h: 0.26, w: 0.46 }, { h: 0.78, w: 0.72 }, { h: 1.28, w: 0.9 }][layerIndex];
      const routeScale = region === "edge" ? 0.22 : region === "verge" ? 0.72 : 1;
      const rotation = hash(index, chunkZ, 109) * Math.PI;
      grass[layerIndex].push({
        id: `grass-${chunkX}-${chunkZ}-${index}`,
        matrix: matrixFromYRotationScaleTranslation(rotation, layer.w, layer.h * routeScale, layer.w, x, sample.y, z),
        metadata: { region, environment, densityPolicy: "production-patches-v1" }
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
      terrain: { heights, colors, normals, segments: config.segments, mapping: "world-space", materialRevision: "stylized-high-fidelity-v4-production-jungle" },
      trees,
      groundCover,
      grass,
      pickups,
      colliders,
      vegetationRevision: options.foliageAtlasRevision ?? "prehistoric-foliage-cards-v2",
      vegetationDensityPolicy: "production-patches-v1",
      bounds: { min: [minX, -16, minZ], max: [maxX, 80, maxZ] }
    };
  };
}

export function collectPatchTransferables(patch) {
  return [patch?.terrain?.heights?.buffer, patch?.terrain?.colors?.buffer, patch?.terrain?.normals?.buffer].filter(Boolean);
}
