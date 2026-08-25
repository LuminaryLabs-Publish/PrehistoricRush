import { projectPrehistoricRushLandforms } from "./world-landform-projection.js";

const clone = (value) => value === undefined ? undefined : structuredClone(value);
const ELEVATION_CACHE_LIMIT = 32768;
const TERRAIN_SEGMENTS_PER_CELL = 16;
const TERRAIN_ACTIVE_RADIUS = 2;
const TERRAIN_PREWARM_SLICE_BUDGET = 12;

export function createElevationCacheSampler(sample, { limit = ELEVATION_CACHE_LIMIT } = {}) {
  if (typeof sample !== "function") throw new TypeError("Elevation cache sampler requires a sample function.");
  const maximum = Math.max(256, Math.floor(Number(limit) || ELEVATION_CACHE_LIMIT));
  const cache = new Map();
  let hits = 0;
  let misses = 0;
  function keyFor(x, z) {
    const nx = Number(x);
    const nz = Number(z);
    return `${nx === 0 ? 0 : nx}:${nz === 0 ? 0 : nz}`;
  }
  return Object.freeze({
    sample(x, z) {
      const key = keyFor(x, z);
      if (cache.has(key)) { hits += 1; return cache.get(key); }
      const value = sample(Number(x), Number(z));
      misses += 1;
      cache.set(key, value);
      if (cache.size > maximum) cache.delete(cache.keys().next().value);
      return value;
    },
    snapshot() { return Object.freeze({ size: cache.size, limit: maximum, hits, misses }); },
    clear() { cache.clear(); }
  });
}

export function createTerrainTransitionPrewarmer(sample, {
  cellSize = 96,
  segmentsPerCell = TERRAIN_SEGMENTS_PER_CELL,
  activeRadius = TERRAIN_ACTIVE_RADIUS
} = {}) {
  if (typeof sample !== "function") throw new TypeError("Terrain transition prewarmer requires a sample function.");
  const size = Math.max(1, Number(cellSize) || 96);
  const segments = Math.max(1, Math.floor(Number(segmentsPerCell) || TERRAIN_SEGMENTS_PER_CELL));
  const radius = Math.max(0, Math.floor(Number(activeRadius) || TERRAIN_ACTIVE_RADIUS));
  const step = size / segments;
  const gridIntervals = segments * (radius * 2 + 1);
  const gridSize = gridIntervals + 1;
  let queue = [];
  let cursor = 0;
  let generation = 0;
  let completedSamples = 0;

  function boundsFor(cx, cz) {
    const minX = (cx - radius) * size;
    const minZ = (cz - radius) * size;
    const maxX = minX + gridIntervals * step;
    const maxZ = minZ + gridIntervals * step;
    return { minX, minZ, maxX, maxZ };
  }

  function queueTransition(fromCx, fromCz, toCx, toCz) {
    const from = boundsFor(Number(fromCx), Number(fromCz));
    const to = boundsFor(Number(toCx), Number(toCz));
    const next = [];
    for (let zIndex = 0; zIndex < gridSize; zIndex += 1) {
      const z = to.minZ + zIndex * step;
      for (let xIndex = 0; xIndex < gridSize; xIndex += 1) {
        const x = to.minX + xIndex * step;
        if (x >= from.minX && x <= from.maxX && z >= from.minZ && z <= from.maxZ) continue;
        next.push([x, z]);
      }
    }
    queue = next;
    cursor = 0;
    generation += 1;
    return Object.freeze({ generation, pending: queue.length });
  }

  function drain(maximum = TERRAIN_PREWARM_SLICE_BUDGET) {
    const limit = Math.max(1, Math.floor(Number(maximum) || TERRAIN_PREWARM_SLICE_BUDGET));
    let processed = 0;
    while (cursor < queue.length && processed < limit) {
      const [x, z] = queue[cursor];
      sample(x, z);
      cursor += 1;
      processed += 1;
      completedSamples += 1;
    }
    return Object.freeze({ processed, pending: Math.max(0, queue.length - cursor), complete: cursor >= queue.length, generation });
  }

  return Object.freeze({
    queueTransition,
    drain,
    snapshot() {
      return Object.freeze({
        generation,
        queuedSamples: queue.length,
        completedSamples,
        pending: Math.max(0, queue.length - cursor),
        step,
        gridSize
      });
    },
    clear() { queue = []; cursor = 0; generation += 1; }
  });
}

function semanticFeature(recipe, family, index, type, definition, priority = 100) {
  return Object.freeze({
    id: `${recipe.id}:${family}:${String(index).padStart(2, "0")}:${type}`,
    type,
    seed: `${recipe.seed}:${family}:${index}:${type}`,
    priority,
    lifecycle: "registered",
    definition: Object.freeze(definition),
    metadata: Object.freeze({ source: "prehistoric-rush-world-recipe", family, worldId: recipe.id, recipeRevision: recipe.revision })
  });
}

function projectWorldContent(recipe) {
  const ecology = Object.freeze([
    semanticFeature(recipe, "ecology", 0, "biome-region", { center: { x: 0, z: 650 }, radius: 2400, edgeWidth: 260, weight: 1, biome: "jurassic-rainforest", climateRules: { moisture: "high", temperature: "warm", canopy: "multi-layer" } }, 100),
    semanticFeature(recipe, "ecology", 1, "forest", { center: { x: 0, z: 700 }, radius: 2200, edgeWidth: 220, density: 0.94, communities: ["giant-fern-tree", "tower-conifer", "understory-cycad", "broad-canopy", "moss-column", "layered-araucaria", "fan-cycad", "ginkgo-crown-tree", "marsh-horsetail-tower", "forked-ghostwood", "tall-prehistoric-palm", "short-jungle-palm"] }, 110),
    semanticFeature(recipe, "ecology", 2, "habitat-patch", { center: { x: -210, z: 780 }, radius: 620, edgeWidth: 120, suitability: 0.92, speciesRules: { preference: ["fern", "cycad", "moss", "horsetail"] } }, 120)
  ]);
  const hydrology = Object.freeze([semanticFeature(recipe, "hydrology", 0, "wetland", { center: { x: 190, z: 920 }, radius: 360, edgeWidth: 110, saturation: 0.88 }, 130)]);
  const atmosphere = Object.freeze([
    semanticFeature(recipe, "atmosphere", 0, "fog-bank", { center: { x: 0, z: 760 }, radius: 2100, edgeWidth: 260, altitude: { minimum: -80, maximum: 170 }, humidity: 0.92, attenuation: 0.38, intensity: 0.38 }, 140),
    semanticFeature(recipe, "atmosphere", 1, "visibility-zone", { center: { x: 0, z: 760 }, radius: 2400, edgeWidth: 320, altitude: { minimum: -100, maximum: 600 }, range: 1150, attenuation: 0.24, intensity: 0.24 }, 141)
  ]);
  return Object.freeze({ ecology, hydrology, atmosphere });
}

export function createPrehistoricRushWorldImplementation({ engine, World, FoundationSampling, recipe, cellSize = 96 } = {}) {
  if (!engine?.n?.world || !engine?.n?.worldFeature || !engine?.n?.worldFoundation) throw new TypeError("PrehistoricRush World requires Nexus World, World Feature, and World Foundation.");
  if (!recipe?.id) throw new TypeError("PrehistoricRush World requires a recipe.");
  if (typeof World?.createWorldCell !== "function") throw new TypeError("Nexus World createWorldCell() is required.");
  if (typeof FoundationSampling?.sampleFoundationElevation !== "function" || typeof FoundationSampling?.sampleFoundationChannel !== "function") throw new TypeError("PrehistoricRush World requires Nexus Foundation sampling utilities.");

  const coreWorld = engine.n.world;
  const worldFeature = engine.n.worldFeature;
  const foundation = engine.n.worldFoundation;
  const partitionId = `${recipe.id}:foundation-grid`;
  const size = Math.max(32, Number(cellSize));
  const projectedLandforms = projectPrehistoricRushLandforms(recipe);
  const content = projectWorldContent(recipe);
  const projectedFeatures = Object.freeze([...projectedLandforms, ...content.ecology, ...content.hydrology, ...content.atmosphere]);
  const featureIds = [];
  for (const descriptor of projectedFeatures) featureIds.push(worldFeature.registerFeature(descriptor).id);

  const samplers = Object.freeze(worldFeature.getSamplers());
  const cells = new Map();
  const resolvedCells = new Map();
  let focusUpdateCount = 0;
  let coreWorldSyncCount = 0;
  let coreWorldPrimed = false;
  let lastFocus = { x: 0, y: 0, z: 0 };
  let lastFocusCell = [0, 0];
  let travelDirection = [0, 1];
  let prewarmHandle = null;
  let prewarmToken = 0;

  function cellCoordinates(x, z) { return [Math.floor(Number(x) / size), Math.floor(Number(z) / size)]; }
  function createCell(x, z) {
    const [cx, cz] = cellCoordinates(x, z);
    const cacheKey = `${cx}:${cz}`;
    const cached = cells.get(cacheKey);
    if (cached) return cached;
    const cell = World.createWorldCell({ worldId: recipe.id, worldSeed: String(recipe.seed), partitionId, coordinates: [cx, cz], bounds: { minX: cx * size, minZ: cz * size, maxX: (cx + 1) * size, maxZ: (cz + 1) * size }, lod: 0, priority: 0 });
    cells.set(cacheKey, cell);
    return cell;
  }
  function resolveCell(cell) {
    const cached = resolvedCells.get(cell.id);
    if (cached) return cached;
    const existing = foundation.getResolvedCell(cell.id);
    if (existing) { resolvedCells.set(cell.id, existing); return existing; }
    const resolved = worldFeature.compileCell(cell, { foundation, baseFoundation: { elevation: 0, material: { kind: "prehistoric-rush-base-ground", worldId: recipe.id }, collision: { kind: "foundation-heightfield", worldId: recipe.id } } }).resolved;
    resolvedCells.set(cell.id, resolved);
    return resolved;
  }
  const elevationSampler = createElevationCacheSampler((x, z) => {
    const cell = createCell(x, z);
    const resolved = resolveCell(cell);
    return FoundationSampling.sampleFoundationElevation(resolved, { x, y: 0, z }, samplers);
  });
  const terrainPrewarmer = createTerrainTransitionPrewarmer((x, z) => elevationSampler.sample(x, z), { cellSize: size });

  function sampleElevation(x, z) { return elevationSampler.sample(x, z); }
  function sampleChannel(channel, x, z) {
    const cell = createCell(x, z);
    const resolved = resolveCell(cell);
    return FoundationSampling.sampleFoundationChannel(resolved, channel, { x: Number(x), y: 0, z: Number(z) }, samplers);
  }

  function cancelPrewarm() {
    prewarmToken += 1;
    if (prewarmHandle === null) return;
    if (typeof globalThis.cancelIdleCallback === "function") globalThis.cancelIdleCallback(prewarmHandle);
    else clearTimeout(prewarmHandle);
    prewarmHandle = null;
  }

  function schedulePrewarmWork() {
    const token = ++prewarmToken;
    const run = () => {
      if (token !== prewarmToken) return;
      const result = terrainPrewarmer.drain(TERRAIN_PREWARM_SLICE_BUDGET);
      if (result.complete) { prewarmHandle = null; return; }
      if (typeof globalThis.requestIdleCallback === "function") prewarmHandle = globalThis.requestIdleCallback(run, { timeout: 16 });
      else prewarmHandle = setTimeout(run, 0);
    };
    if (typeof globalThis.requestIdleCallback === "function") prewarmHandle = globalThis.requestIdleCallback(run, { timeout: 16 });
    else prewarmHandle = setTimeout(run, 0);
  }

  function queueNextTerrainTransition(cx, cz) {
    cancelPrewarm();
    const dx = Math.sign(Number(travelDirection[0]) || 0);
    const dz = Math.sign(Number(travelDirection[1]) || 0);
    const safeDx = dx === 0 && dz === 0 ? 0 : dx;
    const safeDz = dx === 0 && dz === 0 ? 1 : dz;
    terrainPrewarmer.queueTransition(cx, cz, cx + safeDx, cz + safeDz);
    schedulePrewarmWork();
  }

  function syncCoreWorld() {
    coreWorld.setFocus(recipe.id, { position: clone(lastFocus) });
    coreWorldSyncCount += 1;
    coreWorldPrimed = true;
    return coreWorld.updateWorld(recipe.id);
  }

  function focus(position = {}) {
    lastFocus = { x: Number(position.x ?? 0), y: Number(position.y ?? 0), z: Number(position.z ?? 0) };
    const nextFocusCell = cellCoordinates(lastFocus.x, lastFocus.z);
    const cellDx = nextFocusCell[0] - lastFocusCell[0];
    const cellDz = nextFocusCell[1] - lastFocusCell[1];
    if (cellDx !== 0 || cellDz !== 0) travelDirection = [Math.sign(cellDx), Math.sign(cellDz)];
    lastFocusCell = nextFocusCell;
    queueNextTerrainTransition(nextFocusCell[0], nextFocusCell[1]);
    focusUpdateCount += 1;
    if (!coreWorldPrimed) return syncCoreWorld();
    return null;
  }

  return Object.freeze({
    id: recipe.id, recipe: clone(recipe), cellSize: size, landforms: clone(projectedLandforms), ecology: clone(content.ecology), hydrology: clone(content.hydrology), atmosphere: clone(content.atmosphere),
    createCell,
    resolveCellAt(x, z) { const cell = createCell(x, z); return { cell: clone(cell), foundation: clone(resolveCell(cell)) }; },
    sampleElevation, sampleChannel, focus, syncCoreWorld,
    snapshot() {
      return {
        recipe: clone(recipe), landforms: clone(projectedLandforms), ecology: clone(content.ecology), hydrology: clone(content.hydrology), atmosphere: clone(content.atmosphere), featureIds: [...featureIds], focus: clone(lastFocus), focusUpdateCount, coreWorldSyncCount,
        coreWorld: coreWorld.getWorld(recipe.id), featureCount: worldFeature.listFeatures().length, cachedCellCount: cells.size, resolvedCellCount: resolvedCells.size,
        elevationCache: elevationSampler.snapshot(),
        terrainPrewarm: terrainPrewarmer.snapshot(),
        foundation: foundation.getSnapshot?.() ?? null
      };
    },
    dispose() {
      cancelPrewarm();
      terrainPrewarmer.clear();
      cells.clear();
      resolvedCells.clear();
      elevationSampler.clear();
      for (const id of featureIds) worldFeature.unregisterFeature(id);
    }
  });
}
