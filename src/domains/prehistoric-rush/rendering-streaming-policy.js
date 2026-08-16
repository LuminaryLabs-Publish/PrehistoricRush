export const FOUNDATION_TERRAIN_PATCH_SIZE = 96;
export const FOUNDATION_TERRAIN_ACTIVE_RADIUS = 1;
export const FOUNDATION_TERRAIN_RETAIN_RADIUS = 2;
export const FOUNDATION_TERRAIN_PATCH_SEGMENTS = 16;
export const FOUNDATION_FOREST_RADIUS = 2;
export const FOUNDATION_FOREST_GENERATION_BUDGET = 4;

export function createCenteredPatchPlan(position = {}, options = {}) {
  const size = Math.max(1, Number(options.size ?? FOUNDATION_TERRAIN_PATCH_SIZE));
  const radius = Math.max(0, Math.floor(Number(options.radius ?? 0)));
  const prefix = String(options.prefix ?? "patch");
  const centerX = Math.floor(Number(position.x ?? 0) / size);
  const centerZ = Math.floor(Number(position.z ?? 0) / size);
  const entries = [];
  for (let dz = -radius; dz <= radius; dz += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const x = centerX + dx;
      const z = centerZ + dz;
      entries.push(Object.freeze({
        id: `${prefix}:${x}:${z}`,
        x,
        z,
        distance: Math.max(Math.abs(dx), Math.abs(dz)),
        manhattan: Math.abs(dx) + Math.abs(dz)
      }));
    }
  }
  entries.sort((left, right) =>
    left.distance - right.distance
    || left.manhattan - right.manhattan
    || left.z - right.z
    || left.x - right.x);
  return Object.freeze(entries);
}

export function selectMissingPatchBatch(plan = [], existingIds = [], maximum = FOUNDATION_FOREST_GENERATION_BUDGET) {
  const existing = existingIds instanceof Set ? existingIds : new Set(existingIds);
  const limit = Math.max(0, Math.floor(Number(maximum ?? 0)));
  return Object.freeze(plan.filter((entry) => !existing.has(entry.id)).slice(0, limit));
}
