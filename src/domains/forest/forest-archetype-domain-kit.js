export function createForestArchetypeDomainKit() {
  const archetypes = [
    { id: "ancient-broadleaf", minHeight: 34, maxHeight: 58, trunkRadius: 2.5, crownRadius: 10.5, crownHeight: 18, tint: 0x214f28 },
    { id: "giant-conifer", minHeight: 38, maxHeight: 68, trunkRadius: 1.8, crownRadius: 7.5, crownHeight: 26, tint: 0x173c26 },
    { id: "prehistoric-cycad", minHeight: 14, maxHeight: 24, trunkRadius: 1.25, crownRadius: 7.2, crownHeight: 5, tint: 0x2d6638 },
    { id: "twisted-canopy", minHeight: 28, maxHeight: 48, trunkRadius: 2.1, crownRadius: 9.2, crownHeight: 15, tint: 0x315a2d },
    { id: "dead-giant", minHeight: 30, maxHeight: 52, trunkRadius: 2.35, crownRadius: 3.5, crownHeight: 9, tint: 0x5d4933 }
  ];
  return {
    id: "forest-archetype-domain-kit",
    archetypes,
    get(index) { return archetypes[Math.abs(index) % archetypes.length]; },
    snapshot() { return { id: this.id, archetypes }; }
  };
}
