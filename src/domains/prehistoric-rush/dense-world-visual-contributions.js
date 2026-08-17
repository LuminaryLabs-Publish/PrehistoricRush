function requireFactory(value, name) {
  if (typeof value !== "function") throw new TypeError(`${name} must be a function.`);
  return value;
}

export function createPrehistoricRushDenseVisualContributions({ defineVisualContribution, composeVisualContributions, recipe = {}, denseState = {} } = {}) {
  const define = requireFactory(defineVisualContribution, "defineVisualContribution");
  const compose = requireFactory(composeVisualContributions, "composeVisualContributions");
  const worldId = String(recipe.id ?? "prehistoric-rush");
  const terrain = define({
    semanticId: `${worldId}:terrain:dense`,
    sourceDomain: "n:world:terrain",
    bounds: { scope: "active-streaming-window" },
    geometry: { ref: "n:world:foundation:heightfield" },
    material: { ref: "prehistoric-rush:terrain-surface" },
    generation: { patchCount: Number(denseState.terrainPatchCount ?? 9), authority: "n:world:foundation" },
    lodPolicy: { policy: "streaming-cell-resolution" },
    visibilityPolicy: { policy: "active-cell-window" },
    resourceRequirements: [{ capability: "storage" }, { capability: "depth" }]
  });
  const ecology = define({
    semanticId: `${worldId}:ecology:tree-fidelity`,
    sourceDomain: "n:world:feature:ecology",
    bounds: { scope: "forest-streaming-window" },
    geometry: { ref: "prehistoric-rush:tree-fidelity:portable-forms" },
    material: { ref: "prehistoric-rush:tree-fidelity:authored-materials" },
    transforms: { source: "forest-patch-contributions", count: Number(denseState.treeCount ?? 0) },
    generation: { packageCount: Number(denseState.treePackageCount ?? 0), patchCount: Number(denseState.forestPatchCount ?? 0) },
    lodPolicy: { policy: "projected-tree-fidelity", forms: ["near", "medium", "far", "horizon"] },
    visibilityPolicy: { policy: "bounds-and-distance" },
    resourceRequirements: [{ capability: "storage" }, { capability: "vertex" }, { capability: "indirect" }]
  });
  const ground = define({
    semanticId: `${worldId}:ecology:ground-cover`,
    sourceDomain: "n:world:feature:ecology",
    bounds: { scope: "active-streaming-window" },
    geometry: { ref: "prehistoric-rush:ground-cover:blade" },
    material: { ref: "prehistoric-rush:ground-cover:surface" },
    generation: { source: "ecology-density-rules" },
    lodPolicy: { policy: "distance-density" },
    visibilityPolicy: { policy: "distance-cull" },
    resourceRequirements: [{ capability: "storage" }, { capability: "indirect" }]
  });
  return compose(terrain, ecology, ground);
}
