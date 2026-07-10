export function createSurfaceTraversalDomainKit(config = {}) {
  const multipliers = {
    path: Number(config.path ?? 1),
    edge: Number(config.edge ?? 0.88),
    verge: Number(config.verge ?? 0.68),
    forest: Number(config.forest ?? 0.42)
  };
  const response = Number(config.response ?? 4.8);
  const state = { region: "path", multiplier: 1, targetMultiplier: 1 };

  function update(region, dt) {
    state.region = region;
    state.targetMultiplier = multipliers[region] ?? multipliers.forest;
    const alpha = 1 - Math.exp(-response * Math.max(0, dt));
    state.multiplier += (state.targetMultiplier - state.multiplier) * alpha;
    return state;
  }

  return {
    id: "surface-traversal-domain-kit",
    update,
    getState: () => ({ ...state }),
    snapshot: () => ({ id: "surface-traversal-domain-kit", multipliers, response, state: { ...state } })
  };
}
