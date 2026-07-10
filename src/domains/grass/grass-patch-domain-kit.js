export function createGrassPatchDomainKit() {
  const layers = {
    carpet: { height: 0.26, width: 0.46, planes: 2, density: 1 },
    main: { height: 0.78, width: 0.72, planes: 3, density: 0.58 },
    verge: { height: 1.28, width: 0.9, planes: 3, density: 0.22 }
  };
  return {
    id: "grass-patch-domain-kit",
    layers,
    scaleForRoute(distance, width) {
      if (distance < width) return 0;
      if (distance < width + 1.8) return 0.22;
      if (distance < width + 4.5) return 0.72;
      return 1;
    },
    snapshot() { return { id: this.id, layers }; }
  };
}
