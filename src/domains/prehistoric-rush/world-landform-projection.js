const clamp = (value, minimum = 0, maximum = 1) => Math.max(minimum, Math.min(maximum, Number(value) || 0));

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const entry of Object.values(value)) deepFreeze(entry);
  return Object.freeze(value);
}

function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = hashText(seed) || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function makePath({ centerX, startZ, endZ, points, amplitude, phase, frequency = 1 }) {
  return Array.from({ length: points }, (_, index) => {
    const t = index / Math.max(1, points - 1);
    return Object.freeze({
      x: centerX + Math.sin(phase + t * Math.PI * 2 * frequency) * amplitude,
      y: 0,
      z: startZ + (endZ - startZ) * t
    });
  });
}

function offsetPath(path, offset, phase = 0) {
  return path.map((point, index) => Object.freeze({
    x: point.x + offset + Math.sin(phase + index * 0.73) * Math.abs(offset) * 0.08,
    y: 0,
    z: point.z
  }));
}

function feature(recipe, index, type, definition, priority = 10) {
  return deepFreeze({
    id: `${recipe.id}:landform:${String(index).padStart(2, "0")}:${type}`,
    type,
    seed: `${recipe.seed}:${index}:${type}`,
    priority,
    lifecycle: "registered",
    definition,
    metadata: {
      source: "prehistoric-rush-world-recipe",
      worldId: recipe.id,
      recipeRevision: recipe.revision
    }
  });
}

export const PREHISTORIC_RUSH_LANDFORM_TYPES = Object.freeze([
  "valley",
  "ridge",
  "hill",
  "mountain",
  "cliff",
  "plateau",
  "pass"
]);

export function projectPrehistoricRushLandforms(recipe = {}) {
  if (!recipe?.id) throw new TypeError("PrehistoricRush landform projection requires a world recipe id.");
  const terrain = recipe.terrain ?? {};
  const relief = clamp(terrain.relief ?? 0.5);
  const roughness = clamp(terrain.roughness ?? 0.4);
  const plains = clamp(terrain.plains ?? 0.25);
  const ridges = clamp(terrain.ridges ?? relief * 0.45);
  const mesas = clamp(terrain.mesas ?? 0);
  const basin = clamp(terrain.basin ?? 0);
  const rng = createRng(`${recipe.id}:${recipe.seed}:${recipe.revision}`);
  const phase = rng() * Math.PI * 2;
  const centerX = (rng() - 0.5) * 90;
  const meander = 45 + roughness * 95;
  const valleyWidth = 520 + plains * 520 + (1 - roughness) * 140;
  const valleyDepth = 18 + relief * 52 + basin * 34;
  const spine = makePath({
    centerX,
    startZ: -520,
    endZ: 1780,
    points: 9,
    amplitude: meander,
    phase,
    frequency: 0.72 + roughness * 0.45
  });
  const ridgeOffset = valleyWidth * 0.58 + 85;
  const ridgeHeight = 32 + relief * 104 + ridges * 44;
  const ridgeWidth = 260 + (1 - roughness) * 240;
  const features = [
    feature(recipe, 0, "valley", {
      path: spine,
      width: valleyWidth,
      depth: valleyDepth,
      sharpness: 1.15 + roughness * 0.9,
      materialZones: []
    }, 5),
    feature(recipe, 1, "ridge", {
      path: offsetPath(spine, -ridgeOffset, phase * 0.7),
      width: ridgeWidth,
      height: ridgeHeight,
      sharpness: 1.9 + roughness * 1.7,
      materialZones: []
    }, 20),
    feature(recipe, 2, "ridge", {
      path: offsetPath(spine, ridgeOffset, phase * 1.1),
      width: ridgeWidth * (0.9 + rng() * 0.2),
      height: ridgeHeight * (0.86 + rng() * 0.24),
      sharpness: 1.9 + roughness * 1.7,
      materialZones: []
    }, 21)
  ];

  const hillCount = 2 + Math.round(roughness * 2);
  for (let index = 0; index < hillCount; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const z = 180 + index * 330 + rng() * 170;
    const x = centerX + side * (ridgeOffset * (0.72 + rng() * 0.55));
    features.push(feature(recipe, 3 + index, "hill", {
      center: { x, y: 0, z },
      radius: 180 + plains * 150 + rng() * 100,
      height: 24 + relief * 68 + rng() * 24,
      sharpness: 1.35 + roughness * 1.2
    }, 30 + index));
  }

  const mountainIndex = 3 + hillCount;
  features.push(feature(recipe, mountainIndex, "mountain", {
    path: makePath({
      centerX: centerX + (rng() > 0.5 ? -1 : 1) * (ridgeOffset + 250),
      startZ: 420,
      endZ: 1520,
      points: 5,
      amplitude: 120 + roughness * 110,
      phase: phase + 1.4,
      frequency: 0.65
    }),
    width: 520 + relief * 360,
    height: 70 + relief * 170,
    sharpness: 2 + roughness * 1.5,
    variation: Math.min(0.32, roughness * 0.28),
    materialZones: []
  }, 40));

  features.push(feature(recipe, mountainIndex + 1, "pass", {
    center: { x: spine[5].x, y: 0, z: spine[5].z },
    radius: 190 + plains * 150,
    width: 380 + plains * 260,
    cutDepth: 22 + relief * 58,
    sharpness: 1.6 + roughness,
    axis: { x: 1, z: 0 },
    saddleHeight: 0
  }, 50));

  if (mesas > 0.08) {
    features.push(feature(recipe, mountainIndex + 2, "plateau", {
      center: { x: centerX - ridgeOffset * 1.5, y: 0, z: 920 },
      radius: 300 + mesas * 360,
      height: 45 + mesas * 120,
      edgeWidth: 90 + (1 - roughness) * 130,
      sharpness: 1.4 + roughness
    }, 60));
  } else if (roughness > 0.56) {
    features.push(feature(recipe, mountainIndex + 2, "cliff", {
      path: offsetPath(spine.slice(3, 7), ridgeOffset * 0.92, phase + 0.9),
      width: 120 + roughness * 120,
      height: 38 + relief * 115,
      sharpness: 4 + roughness * 2,
      faceAngle: 76 + roughness * 10,
      materialZones: []
    }, 60));
  }

  return Object.freeze(features);
}

export function landformProjectionSignature(recipe) {
  return JSON.stringify(projectPrehistoricRushLandforms(recipe));
}
