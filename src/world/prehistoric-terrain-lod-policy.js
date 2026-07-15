const FAR_DISTANCE = 1_000_000_000;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export const PREHISTORIC_TERRAIN_LOD_POLICY_INPUT = Object.freeze({
  id: "prehistoric-rush-terrain-lod",
  revision: 1,
  selection: "quadtree-distance",
  patchSize: 56,
  sourceResolution: 64,
  levels: Object.freeze([
    Object.freeze({ id: "near", maxDistance: 30, resolution: 64 }),
    Object.freeze({ id: "medium", maxDistance: 68, resolution: 32 }),
    Object.freeze({ id: "far", maxDistance: FAR_DISTANCE, resolution: 16 })
  ]),
  crackPolicy: Object.freeze({
    mode: "skirts",
    skirtDepth: 3.5,
    stitchBorders: true
  }),
  morphPolicy: Object.freeze({
    mode: "geomorph",
    durationSeconds: 0.32,
    hysteresisDistance: 7,
    easing: "smoothstep"
  }),
  materialPolicy: Object.freeze({
    mapping: "world-space",
    tileSize: 11,
    textureResolution: Object.freeze({ width: 2048, height: 2048 }),
    textures: Object.freeze({
      normal: Object.freeze({
        id: "prehistoric-terrain-clay-normal-2k",
        kind: "renderer-generated",
        width: 2048,
        height: 2048,
        channel: "rgb",
        colorSpace: "linear"
      }),
      roughness: Object.freeze({
        id: "prehistoric-terrain-clay-roughness-2k",
        kind: "renderer-generated",
        width: 2048,
        height: 2048,
        channel: "g",
        colorSpace: "linear"
      })
    }),
    blendInputs: Object.freeze(["world-position", "route-distance", "surface-noise", "slope"]),
    metadata: Object.freeze({ artDirection: "simple-shiny-clay" })
  }),
  metadata: Object.freeze({ product: "PrehistoricRush", rendererNeutral: true })
});

function mergePolicyInput(overrides = {}) {
  return {
    ...PREHISTORIC_TERRAIN_LOD_POLICY_INPUT,
    ...overrides,
    levels: overrides.levels ?? PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.levels,
    crackPolicy: {
      ...PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.crackPolicy,
      ...(overrides.crackPolicy ?? {})
    },
    morphPolicy: {
      ...PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.morphPolicy,
      ...(overrides.morphPolicy ?? {})
    },
    materialPolicy: {
      ...PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.materialPolicy,
      ...(overrides.materialPolicy ?? {}),
      textures: {
        ...PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.materialPolicy.textures,
        ...(overrides.materialPolicy?.textures ?? {})
      }
    }
  };
}

export function createPrehistoricTerrainLodPolicy(NexusEngine, overrides = {}) {
  if (typeof NexusEngine?.createTerrainLodPolicyDescriptor !== "function") {
    throw new TypeError("Pinned NexusEngine module is missing createTerrainLodPolicyDescriptor().");
  }
  return NexusEngine.createTerrainLodPolicyDescriptor(mergePolicyInput(overrides));
}

function distanceToBounds(focus, bounds) {
  const x = finite(focus?.x, 0);
  const z = finite(focus?.z ?? focus?.y, 0);
  const minimum = bounds?.minimum ?? bounds?.min ?? [];
  const maximum = bounds?.maximum ?? bounds?.max ?? [];
  const minX = finite(bounds?.minX ?? minimum[0], 0);
  const minZ = finite(bounds?.minZ ?? minimum[2] ?? minimum[1], 0);
  const maxX = finite(bounds?.maxX ?? maximum[0], minX);
  const maxZ = finite(bounds?.maxZ ?? maximum[2] ?? maximum[1], minZ);
  const dx = x < minX ? minX - x : x > maxX ? x - maxX : 0;
  const dz = z < minZ ? minZ - z : z > maxZ ? z - maxZ : 0;
  return Math.hypot(dx, dz);
}

export function selectPrehistoricTerrainLodLevel(policy, query = {}) {
  const levels = policy?.levels ?? PREHISTORIC_TERRAIN_LOD_POLICY_INPUT.levels;
  const distance = distanceToBounds(query.focus ?? query.position, query.bounds ?? query.patchBounds);
  let index = levels.findIndex((level) => distance <= finite(level.maxDistance, FAR_DISTANCE));
  if (index < 0) index = levels.length - 1;

  const previousIndex = levels.findIndex((level) => level.id === query.previousLevelId);
  const hysteresis = Math.max(0, finite(policy?.morphPolicy?.hysteresisDistance, 0));
  if (previousIndex >= 0 && index !== previousIndex) {
    if (index > previousIndex && distance <= finite(levels[previousIndex].maxDistance, FAR_DISTANCE) + hysteresis) {
      index = previousIndex;
    } else if (index < previousIndex && distance >= finite(levels[index].maxDistance, FAR_DISTANCE) - hysteresis) {
      index = previousIndex;
    }
  }

  index = clamp(index, 0, levels.length - 1);
  const level = levels[index];
  return Object.freeze({
    levelId: level.id,
    levelIndex: index,
    resolution: level.resolution,
    quadtreeDepth: level.quadtreeDepth ?? Math.log2((policy?.sourceResolution ?? 64) / level.resolution),
    distance,
    morphDurationSeconds: Math.max(0, finite(policy?.morphPolicy?.durationSeconds, 0.32)),
    skirtDepth: Math.max(0, finite(policy?.crackPolicy?.skirtDepth, 3.5))
  });
}
