export function createGrassWindDomainKit(config = {}) {
  const state = {
    direction: config.direction ?? [0.75, 0.25],
    strength: Number(config.strength ?? 0.22),
    speed: Number(config.speed ?? 1.45),
    gust: 0
  };
  return {
    id: "grass-wind-domain-kit",
    update(time) {
      state.gust = 0.5 + 0.5 * Math.sin(time * 0.37) * Math.sin(time * 0.11 + 1.2);
      return { ...state };
    },
    snapshot() { return { id: this.id, state: { ...state } }; }
  };
}
