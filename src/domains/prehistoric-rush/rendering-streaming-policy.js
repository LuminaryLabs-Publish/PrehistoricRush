export const FOUNDATION_TERRAIN_PATCH_SIZE = 96;
export const FOUNDATION_TERRAIN_ACTIVE_RADIUS = 2;
export const FOUNDATION_TERRAIN_RETAIN_RADIUS = 3;
export const FOUNDATION_TERRAIN_PATCH_SEGMENTS = 16;
export const FOUNDATION_FOREST_RADIUS = 2;
export const FOUNDATION_FOREST_GENERATION_BUDGET = 1;

const PLAN_CACHE_LIMIT = 128;
const DEFAULT_LOOKAHEAD_SECONDS = 1.5;
const MAX_LOOKAHEAD_PATCH_FRACTION = 0.75;
const planCache = new Map();
let foundationTerrainOwner = "webgl2";
let foundationTerrainAnchor = null;

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeTerrainAnchor(position = {}) {
  return Object.freeze({
    x: finiteNumber(position.x),
    z: finiteNumber(position.z),
    yaw: finiteNumber(position.yaw),
    speed: Math.max(0, finiteNumber(position.speed)),
    streamingLookaheadSeconds: Math.max(0, finiteNumber(position.streamingLookaheadSeconds, DEFAULT_LOOKAHEAD_SECONDS))
  });
}

export function setFoundationTerrainStreamingOwner(owner = "webgl2", position = null) {
  foundationTerrainOwner = owner === "webgpu" ? "webgpu" : "webgl2";
  foundationTerrainAnchor = foundationTerrainOwner === "webgpu" ? normalizeTerrainAnchor(position ?? {}) : null;
  return Object.freeze({ owner: foundationTerrainOwner, anchor: foundationTerrainAnchor });
}

export function getFoundationTerrainStreamingOwner() {
  return Object.freeze({ owner: foundationTerrainOwner, anchor: foundationTerrainAnchor });
}

function streamingFocus(position = {}, size) {
  const x = finiteNumber(position.x);
  const z = finiteNumber(position.z);
  const yaw = finiteNumber(position.yaw);
  const speed = Math.max(0, finiteNumber(position.speed));
  const requestedLookahead = Math.max(0, finiteNumber(position.streamingLookaheadSeconds, DEFAULT_LOOKAHEAD_SECONDS));
  const lookahead = Math.min(size * MAX_LOOKAHEAD_PATCH_FRACTION, speed * requestedLookahead);
  return {
    x: x + Math.sin(yaw) * lookahead,
    z: z + Math.cos(yaw) * lookahead,
    lookahead
  };
}

function cachePlan(key, entries) {
  planCache.set(key, entries);
  if (planCache.size <= PLAN_CACHE_LIMIT) return entries;
  const oldest = planCache.keys().next().value;
  planCache.delete(oldest);
  return entries;
}

export function createCenteredPatchPlan(position = {}, options = {}) {
  const size = Math.max(1, Number(options.size ?? FOUNDATION_TERRAIN_PATCH_SIZE));
  const radius = Math.max(0, Math.floor(Number(options.radius ?? 0)));
  const prefix = String(options.prefix ?? "patch");
  const planPosition = prefix === "foundation-terrain" && foundationTerrainOwner === "webgpu" && foundationTerrainAnchor
    ? foundationTerrainAnchor
    : position;
  const focus = streamingFocus(planPosition, size);
  const centerX = Math.floor(focus.x / size);
  const centerZ = Math.floor(focus.z / size);
  const cacheKey = `${prefix}:${size}:${radius}:${centerX}:${centerZ}`;
  const cached = planCache.get(cacheKey);
  if (cached) return cached;

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
  return cachePlan(cacheKey, Object.freeze(entries));
}

export function selectMissingPatchBatch(plan = [], existingIds = [], maximum = FOUNDATION_FOREST_GENERATION_BUDGET) {
  const existing = existingIds instanceof Set ? existingIds : new Set(existingIds);
  const limit = Math.max(0, Math.floor(Number(maximum ?? 0)));
  if (limit === 0) return Object.freeze([]);
  const missing = [];
  for (const entry of plan) {
    if (existing.has(entry.id)) continue;
    missing.push(entry);
    if (missing.length >= limit) break;
  }
  return Object.freeze(missing);
}
