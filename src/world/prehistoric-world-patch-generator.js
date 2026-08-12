import { createPrehistoricPatchGenerator } from "./prehistoric-patch-generator.js";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function macroField(x, z, scale, phase = 0) {
  const broad = Math.sin(x * scale + z * scale * 0.63 + phase) * 0.5 + 0.5;
  const cross = Math.cos(z * scale * 0.77 - x * scale * 0.41 - phase * 0.7) * 0.5 + 0.5;
  return broad * 0.58 + cross * 0.42;
}

function reshapeTerrain(patch, recipe, config) {
  const heights = patch?.terrain?.heights;
  const normals = patch?.terrain?.normals;
  const colors = patch?.terrain?.colors;
  if (!(heights instanceof Float32Array) || !(normals instanceof Float32Array) || !(colors instanceof Float32Array)) return patch;

  const terrain = recipe.terrain ?? {};
  const presentation = recipe.presentation ?? {};
  const segments = Number(patch.terrain.segments ?? config.segments);
  const side = segments + 1;
  const chunk = Number(config.chunk);
  const spacing = chunk / segments;
  const minX = Number(patch.x) * chunk - chunk * 0.5;
  const minZ = Number(patch.z) * chunk - chunk * 0.5;
  const relief = clamp(Number(terrain.relief ?? 0.56), 0, 1);
  const roughness = clamp(Number(terrain.roughness ?? 0.46), 0, 1);
  const heightScale = 0.4 + (relief / 0.56) * 0.6;
  const plains = clamp(Number(terrain.plains ?? 0), 0, 1);
  const ridges = clamp(Number(terrain.ridges ?? 0), 0, 1);
  const mesas = clamp(Number(terrain.mesas ?? 0), 0, 1);
  const basin = clamp(Number(terrain.basin ?? 0), 0, 1);
  const coastalShelf = clamp(Number(terrain.coastalShelf ?? 0), 0, 1);
  const phase = Number(recipe.seed ?? config.seed ?? 0) * 0.00001;

  function shapeHeight(baseY, worldX, worldZ) {
    const broad = macroField(worldX, worldZ, 0.0042, phase);
    const detail = macroField(worldX, worldZ, 0.019 + roughness * 0.009, phase * 1.7) - 0.5;
    const ridge = 1 - Math.abs(Math.sin(worldX * 0.0065 + worldZ * 0.0032 + phase));
    const mesaField = macroField(worldX + 91, worldZ - 47, 0.0034, phase * 0.4);
    const mesa = smoothMesa(mesaField);
    const shelf = macroField(worldX - 133, worldZ + 71, 0.0022, phase * 0.9);
    let y = Number(baseY) * heightScale;
    y *= 1 - plains * 0.34;
    y += detail * roughness * 1.45;
    y += ridge * ridges * 5.2;
    y += mesa * mesas * 4.6;
    y -= broad * basin * 2.8;
    y += (shelf - 0.5) * coastalShelf * 1.7;
    return y;
  }

  for (let z = 0; z < side; z += 1) {
    for (let x = 0; x < side; x += 1) {
      const index = z * side + x;
      const worldX = minX + x * spacing;
      const worldZ = minZ + z * spacing;
      heights[index] = shapeHeight(heights[index], worldX, worldZ);
    }
  }

  for (let z = 0; z < side; z += 1) {
    for (let x = 0; x < side; x += 1) {
      const index = z * side + x;
      const left = heights[z * side + Math.max(0, x - 1)];
      const right = heights[z * side + Math.min(side - 1, x + 1)];
      const down = heights[Math.max(0, z - 1) * side + x];
      const up = heights[Math.min(side - 1, z + 1) * side + x];
      const nx = left - right;
      const ny = spacing * 2;
      const nz = down - up;
      const length = Math.hypot(nx, ny, nz) || 1;
      normals[index * 3] = nx / length;
      normals[index * 3 + 1] = ny / length;
      normals[index * 3 + 2] = nz / length;
    }
  }

  function shiftEntry(entry, baseGroundY, worldX, worldZ) {
    const delta = shapeHeight(baseGroundY, worldX, worldZ) - baseGroundY;
    if (Array.isArray(entry?.matrix) && entry.matrix.length >= 16) entry.matrix[13] += delta;
    if (entry?.bounds?.min && entry?.bounds?.max) {
      entry.bounds.min[1] += delta;
      entry.bounds.max[1] += delta;
    }
    return delta;
  }

  const treeDeltas = new Map();
  const shiftedTreeMetadata = new Map();
  for (const family of patch.trees ?? []) {
    for (const entry of [...(family.trunks ?? []), ...(family.crowns ?? [])]) {
      const ground = entry?.metadata?.variation?.groundPosition;
      if (!Array.isArray(ground) || ground.length < 3) continue;
      const treeId = String(entry?.metadata?.treeId ?? entry.id);
      let delta = treeDeltas.get(treeId);
      if (delta === undefined) {
        const sink = Number(entry?.metadata?.variation?.groundSink ?? 0);
        const baseGroundY = Number(ground[1]) + sink;
        delta = shapeHeight(baseGroundY, Number(ground[0]), Number(ground[2])) - baseGroundY;
        treeDeltas.set(treeId, delta);
        shiftedTreeMetadata.set(treeId, entry.metadata);
      }
      if (Array.isArray(entry?.matrix) && entry.matrix.length >= 16) entry.matrix[13] += delta;
      if (entry?.bounds?.min && entry?.bounds?.max) {
        entry.bounds.min[1] += delta;
        entry.bounds.max[1] += delta;
      }
    }
  }
  for (const [treeId, metadata] of shiftedTreeMetadata) {
    const ground = metadata?.variation?.groundPosition;
    if (Array.isArray(ground) && ground.length >= 3) ground[1] += treeDeltas.get(treeId) ?? 0;
  }
  for (const entry of patch.groundCover ?? []) {
    if (!Array.isArray(entry?.matrix) || entry.matrix.length < 16) continue;
    const x = Number(entry.matrix[12]);
    const z = Number(entry.matrix[14]);
    const sink = Number(entry?.metadata?.visualGroundSink ?? 0);
    const baseGroundY = Number(entry.matrix[13]) + sink;
    shiftEntry(entry, baseGroundY, x, z);
  }
  for (const layer of patch.grass ?? []) {
    for (const entry of layer ?? []) {
      if (!Array.isArray(entry?.matrix) || entry.matrix.length < 16) continue;
      const x = Number(entry.matrix[12]);
      const z = Number(entry.matrix[14]);
      const baseGroundY = Number(entry.matrix[13]);
      shiftEntry(entry, baseGroundY, x, z);
    }
  }
  for (const collider of patch.colliders ?? []) {
    collider.y = shapeHeight(Number(collider.y), Number(collider.x), Number(collider.z));
  }
  for (const pickup of patch.pickups ?? []) {
    const clearance = 1.15;
    pickup.y = shapeHeight(Number(pickup.y) - clearance, Number(pickup.x), Number(pickup.z)) + clearance;
  }

  const target = presentation.terrainColor;
  const mix = clamp(Number(presentation.terrainColorMix ?? 0), 0, 1);
  if (Array.isArray(target) && target.length >= 3 && mix > 0) {
    for (let index = 0; index < colors.length; index += 3) {
      const luminance = colors[index] * 0.24 + colors[index + 1] * 0.68 + colors[index + 2] * 0.08;
      const contrast = clamp(0.62 + luminance * 0.76, 0.45, 1.35);
      colors[index] = clamp(colors[index] * (1 - mix) + Number(target[0]) * contrast * mix, 0, 1);
      colors[index + 1] = clamp(colors[index + 1] * (1 - mix) + Number(target[1]) * contrast * mix, 0, 1);
      colors[index + 2] = clamp(colors[index + 2] * (1 - mix) + Number(target[2]) * contrast * mix, 0, 1);
    }
  }

  patch.terrain.materialRevision = `prehistoric-world:${recipe.id}:r${recipe.revision}`;
  patch.vegetationDensityPolicy = `world-recipe-${recipe.id}-r${recipe.revision}`;
  patch.worldRecipe = { id: recipe.id, revision: recipe.revision, seed: recipe.seed };
  return patch;
}

function smoothMesa(value) {
  const t = clamp((value - 0.63) / 0.22, 0, 1);
  return t * t * (3 - 2 * t);
}

export function createPrehistoricWorldPatchGenerator(options = {}) {
  const recipe = options.worldRecipe;
  if (!recipe?.id) throw new TypeError("Prehistoric world patch generation requires a world recipe.");
  const base = createPrehistoricPatchGenerator(options);
  const config = {
    seed: Number(options.config?.seed ?? recipe.seed ?? 238991),
    chunk: Number(options.config?.chunk ?? 56),
    segments: Number(options.config?.segments ?? 64)
  };
  return (request = {}) => reshapeTerrain(base(request), recipe, config);
}

export default createPrehistoricWorldPatchGenerator;
