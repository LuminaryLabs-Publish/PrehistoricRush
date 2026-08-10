const freeze = (value) => Object.freeze(value);

export const PREHISTORIC_TREE_ART_DIRECTION_REVISION = "chunky-prehistoric-canopy-v1";

const SPECIES_FOLIAGE_TARGETS = freeze({
  "giant-fern-tree": freeze({ near: 72, medium: 26 }),
  "tower-conifer": freeze({ near: 84, medium: 30 }),
  "understory-cycad": freeze({ near: 64, medium: 22 }),
  "broad-canopy": freeze({ near: 96, medium: 34 }),
  "moss-column": freeze({ near: 78, medium: 28 }),
  "layered-araucaria": freeze({ near: 88, medium: 31 }),
  "fan-cycad": freeze({ near: 68, medium: 24 }),
  "ginkgo-crown-tree": freeze({ near: 92, medium: 32 }),
  "marsh-horsetail-tower": freeze({ near: 64, medium: 22 }),
  "forked-ghostwood": freeze({ near: 64, medium: 22 }),
  "tall-prehistoric-palm": freeze({ near: 72, medium: 26 }),
  "short-jungle-palm": freeze({ near: 68, medium: 24 })
});

export const PREHISTORIC_TREE_ART_DIRECTION = freeze({
  canopy: freeze({
    coreRatio: 0.30,
    shellRatio: 0.50,
    fringeRatio: 0.20,
    mediumDensity: 0.35,
    coreRadius: freeze([0.12, 0.48]),
    shellRadius: freeze([0.46, 0.95]),
    fringeRadius: freeze([0.62, 0.94]),
    coreTint: freeze([0.74, 0.82, 0.74]),
    shellTint: freeze([0.94, 1.02, 0.90]),
    fringeTint: freeze([0.88, 1.04, 0.82])
  }),
  trunk: freeze({
    radialSegments: 14,
    longitudinalSegments: 10,
    taper: 0.58,
    curvature: 0.035,
    irregularity: 0.075,
    baseFlare: 1.75
  }),
  roots: freeze({
    depthScale: 0.055,
    spreadScale: 3.2,
    radialSegments: 12,
    longitudinalSegments: 6,
    flattening: 0.32,
    buttressStrength: 0.72
  }),
  branch: freeze({
    primaryRadialSegments: 8,
    secondaryRadialSegments: 6,
    longitudinalSegments: 4
  }),
  bark: freeze({
    roughness: 0.88,
    clearcoat: 0.015,
    clearcoatRoughness: 0.94,
    groundAoHeight: 1.5,
    groundAoMinimum: 0.42,
    rootMossMix: 0.22,
    broadVariation: 0.16
  }),
  foliage: freeze({
    interiorLightMinimum: 0.58,
    exteriorLightMaximum: 1.18,
    shadeMinimum: 0.68,
    transmissionStrength: 0.24
  }),
  validation: freeze({
    crownCoverage: freeze({
      radialNear: 0.34,
      radialMedium: 0.18,
      nonRadialNear: 0.42,
      nonRadialMedium: 0.24
    }),
    minimumClusters: freeze({
      radialNear: 18,
      radialMedium: 10,
      nonRadialNear: 28,
      nonRadialMedium: 14
    })
  })
});

export function getPrehistoricTreeFoliageTargets(archetypeOrId) {
  const id = typeof archetypeOrId === "string" ? archetypeOrId : archetypeOrId?.id;
  const fallbackNear = Math.max(64, Math.floor(Number(archetypeOrId?.heroCardCount ?? 64)));
  const target = SPECIES_FOLIAGE_TARGETS[id];
  return target ?? freeze({ near: fallbackNear, medium: Math.max(22, Math.round(fallbackNear * PREHISTORIC_TREE_ART_DIRECTION.canopy.mediumDensity)) });
}

export function isPrehistoricRadialTree(archetype) {
  return /palm|cycad|fern/.test(`${archetype?.shape ?? ""}:${archetype?.foliageCardFamily ?? ""}`);
}

export function getPrehistoricTreeStructureIntent(archetype) {
  const radial = isPrehistoricRadialTree(archetype);
  return freeze({
    roots: freeze({
      kind: "root-flare",
      count: radial ? 5 : 6,
      depth: archetype.averageHeight * PREHISTORIC_TREE_ART_DIRECTION.roots.depthScale,
      spread: archetype.trunkRadius * PREHISTORIC_TREE_ART_DIRECTION.roots.spreadScale,
      baseFlare: PREHISTORIC_TREE_ART_DIRECTION.trunk.baseFlare
    }),
    trunk: freeze({
      radius: archetype.trunkRadius,
      taper: PREHISTORIC_TREE_ART_DIRECTION.trunk.taper,
      radialSegments: PREHISTORIC_TREE_ART_DIRECTION.trunk.radialSegments,
      heightSegments: PREHISTORIC_TREE_ART_DIRECTION.trunk.longitudinalSegments,
      curvature: PREHISTORIC_TREE_ART_DIRECTION.trunk.curvature,
      irregularity: PREHISTORIC_TREE_ART_DIRECTION.trunk.irregularity
    })
  });
}

export default PREHISTORIC_TREE_ART_DIRECTION;
