import { projectPrehistoricRushLandforms } from "./world-landform-projection.js";

const clone = (value) => value === undefined ? undefined : structuredClone(value);

export function createPrehistoricRushWorldImplementation({ engine, World, recipe, cellSize = 96 } = {}) {
  if (!engine?.n?.world || !engine?.n?.worldFeature || !engine?.n?.worldFoundation) {
    throw new TypeError("PrehistoricRush World requires Nexus World, World Feature, and World Foundation.");
  }
  if (!recipe?.id) throw new TypeError("PrehistoricRush World requires a recipe.");
  if (typeof World?.createWorldCell !== "function") throw new TypeError("Nexus World createWorldCell() is required.");

  const coreWorld = engine.n.world;
  const worldFeature = engine.n.worldFeature;
  const foundation = engine.n.worldFoundation;
  const partitionId = `${recipe.id}:foundation-grid`;
  const size = Math.max(32, Number(cellSize));
  const projectedLandforms = projectPrehistoricRushLandforms(recipe);
  const featureIds = [];

  for (const descriptor of projectedLandforms) {
    const registered = worldFeature.registerFeature(descriptor);
    featureIds.push(registered.id);
  }

  function createCell(x, z) {
    const cx = Math.floor(Number(x) / size);
    const cz = Math.floor(Number(z) / size);
    return World.createWorldCell({
      worldId: recipe.id,
      worldSeed: String(recipe.seed),
      partitionId,
      coordinates: [cx, cz],
      bounds: {
        minX: cx * size,
        minZ: cz * size,
        maxX: (cx + 1) * size,
        maxZ: (cz + 1) * size
      },
      lod: 0,
      priority: 0
    });
  }

  function resolveCell(cell) {
    const current = foundation.getResolvedCell(cell.id);
    if (current) return current;
    return worldFeature.compileCell(cell, {
      foundation,
      baseFoundation: {
        elevation: 0,
        material: { kind: "prehistoric-rush-base-ground", worldId: recipe.id },
        collision: { kind: "foundation-heightfield", worldId: recipe.id }
      }
    }).resolved;
  }

  function sampleElevation(x, z) {
    const cell = createCell(x, z);
    resolveCell(cell);
    return foundation.sampleElevation(cell.id, { x: Number(x), y: 0, z: Number(z) }, worldFeature.getSamplers());
  }

  function sampleChannel(channel, x, z) {
    const cell = createCell(x, z);
    resolveCell(cell);
    return foundation.sampleChannel(cell.id, channel, { x: Number(x), y: 0, z: Number(z) }, worldFeature.getSamplers());
  }

  function focus(position = {}) {
    coreWorld.setFocus(recipe.id, { position: clone(position) });
    return coreWorld.updateWorld(recipe.id);
  }

  return Object.freeze({
    id: recipe.id,
    recipe: clone(recipe),
    cellSize: size,
    landforms: clone(projectedLandforms),
    createCell,
    resolveCellAt(x, z) {
      const cell = createCell(x, z);
      return { cell: clone(cell), foundation: clone(resolveCell(cell)) };
    },
    sampleElevation,
    sampleChannel,
    focus,
    snapshot() {
      return {
        recipe: clone(recipe),
        landforms: clone(projectedLandforms),
        featureIds: [...featureIds],
        coreWorld: coreWorld.getWorld(recipe.id),
        featureCount: worldFeature.listFeatures().length,
        foundation: foundation.getSnapshot?.() ?? null
      };
    },
    dispose() {
      for (const id of featureIds) worldFeature.unregisterFeature(id);
    }
  });
}
