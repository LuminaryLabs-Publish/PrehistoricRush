const deepFreeze = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const entry of Object.values(value)) deepFreeze(entry);
  return Object.freeze(value);
};

export const DEFAULT_PREHISTORIC_WORLD_ID = "jurassic-valley";

const recipes = [
  {
    id: "jurassic-valley",
    name: "Jurassic Valley",
    description: "Dense valley forest, broad running corridors, and the current Prehistoric Rush balance.",
    revision: 1,
    seed: 238991,
    terrain: { profile: "valley-forest", relief: 0.56, roughness: 0.46, plains: 0.28 },
    hydrology: { moisture: 0.68, drainage: 0.54, permanentWater: 0.18 },
    ecology: { profile: "lush-valley", canopy: 0.76, groundCover: 0.72 },
    route: { segmentLength: 18, sampleSpacing: 2.5, pathHalfWidth: 3.1, vergeWidth: 3.2 },
    runtime: { trees: 7, grass: 96, groundCover: 36, goalDistance: 3600 },
    presentation: {
      terrainColor: [0.18, 0.39, 0.18],
      terrainColorMix: 0,
      atmosphere: {
        background: 0x8eb8a0,
        fogColor: 0x86ad98,
        fogDensity: 0.0062,
        exposure: 1.08,
        skyLight: 0xe1f2cf,
        groundLight: 0x2c3d25,
        sunColor: 0xffdda0
      }
    }
  },
  {
    id: "desert-plains",
    name: "Desert Plains",
    description: "Open arid running country with sparse vegetation, wide routes, and long sight lines.",
    revision: 1,
    seed: 881204,
    terrain: { profile: "desert-plains", relief: 0.24, roughness: 0.20, plains: 0.78, mesas: 0.16 },
    hydrology: { moisture: 0.12, drainage: 0.72, permanentWater: 0.03 },
    ecology: { profile: "arid-scrub", canopy: 0.18, groundCover: 0.28 },
    route: { segmentLength: 24, sampleSpacing: 3.1, pathHalfWidth: 3.8, vergeWidth: 4.4 },
    runtime: { trees: 3, grass: 42, groundCover: 18, goalDistance: 4200 },
    presentation: {
      terrainColor: [0.58, 0.43, 0.24],
      terrainColorMix: 0.52,
      atmosphere: {
        background: 0xd2b486,
        fogColor: 0xc6a97d,
        fogDensity: 0.0032,
        exposure: 1.16,
        skyLight: 0xffe5bc,
        groundLight: 0x6a5132,
        sunColor: 0xffc96f
      }
    }
  },
  {
    id: "swamp-basin",
    name: "Swamp Basin",
    description: "Low wet basin with dense cover, tighter routes, and heavy atmospheric depth.",
    revision: 1,
    seed: 517733,
    terrain: { profile: "swamp-basin", relief: 0.18, roughness: 0.30, basin: 0.72 },
    hydrology: { moisture: 0.92, drainage: 0.22, permanentWater: 0.54 },
    ecology: { profile: "wetland-forest", canopy: 0.88, groundCover: 0.94 },
    route: { segmentLength: 14, sampleSpacing: 2.0, pathHalfWidth: 2.9, vergeWidth: 4.2 },
    runtime: { trees: 9, grass: 120, groundCover: 60, goalDistance: 3300 },
    presentation: {
      terrainColor: [0.16, 0.28, 0.18],
      terrainColorMix: 0.34,
      atmosphere: {
        background: 0x6f8d78,
        fogColor: 0x647d6c,
        fogDensity: 0.0105,
        exposure: 0.98,
        skyLight: 0xb9d2b4,
        groundLight: 0x26362b,
        sunColor: 0xe5d79e
      }
    }
  },
  {
    id: "volcanic-highlands",
    name: "Volcanic Highlands",
    description: "Rough highland terrain, thin vegetation, narrow routes, and ash-heavy light.",
    revision: 1,
    seed: 940117,
    terrain: { profile: "volcanic-highlands", relief: 0.86, roughness: 0.82, ridges: 0.64 },
    hydrology: { moisture: 0.24, drainage: 0.84, permanentWater: 0.06 },
    ecology: { profile: "highland-scrub", canopy: 0.26, groundCover: 0.22 },
    route: { segmentLength: 15, sampleSpacing: 2.3, pathHalfWidth: 2.6, vergeWidth: 2.8 },
    runtime: { trees: 4, grass: 50, groundCover: 14, goalDistance: 3800 },
    presentation: {
      terrainColor: [0.25, 0.24, 0.22],
      terrainColorMix: 0.62,
      atmosphere: {
        background: 0x716f69,
        fogColor: 0x66645f,
        fogDensity: 0.0078,
        exposure: 0.94,
        skyLight: 0xc7c1b4,
        groundLight: 0x34302c,
        sunColor: 0xffb46b
      }
    }
  },
  {
    id: "coastal-jungle",
    name: "Coastal Jungle",
    description: "Bright humid jungle with heavy vegetation and longer flowing coastal routes.",
    revision: 1,
    seed: 326118,
    terrain: { profile: "coastal-jungle", relief: 0.42, roughness: 0.38, coastalShelf: 0.58 },
    hydrology: { moisture: 0.84, drainage: 0.48, permanentWater: 0.36 },
    ecology: { profile: "coastal-canopy", canopy: 0.84, groundCover: 0.86 },
    route: { segmentLength: 21, sampleSpacing: 2.7, pathHalfWidth: 3.4, vergeWidth: 4.0 },
    runtime: { trees: 8, grass: 110, groundCover: 48, goalDistance: 3900 },
    presentation: {
      terrainColor: [0.24, 0.46, 0.31],
      terrainColorMix: 0.24,
      atmosphere: {
        background: 0x82b8ad,
        fogColor: 0x79a99d,
        fogDensity: 0.0055,
        exposure: 1.11,
        skyLight: 0xdaf1df,
        groundLight: 0x29453a,
        sunColor: 0xffdf9c
      }
    }
  }
].map(deepFreeze);

export const PREHISTORIC_WORLD_RECIPES = Object.freeze(recipes);

const WORLD_RECIPE_BY_ID = new Map(PREHISTORIC_WORLD_RECIPES.map((recipe) => [recipe.id, recipe]));

export function getPrehistoricRushWorldRecipe(id = DEFAULT_PREHISTORIC_WORLD_ID) {
  return WORLD_RECIPE_BY_ID.get(String(id ?? "")) ?? WORLD_RECIPE_BY_ID.get(DEFAULT_PREHISTORIC_WORLD_ID);
}

export function resolvePrehistoricRushWorldId(locationLike = globalThis.location) {
  try {
    const url = new URL(locationLike?.href ?? String(locationLike ?? ""), "http://prehistoric-rush.local/");
    return getPrehistoricRushWorldRecipe(url.searchParams.get("world")).id;
  } catch {
    return DEFAULT_PREHISTORIC_WORLD_ID;
  }
}

export function createPrehistoricRushWorldRuntimeConfig(recipeInput, terrainPolicy) {
  const recipe = getPrehistoricRushWorldRecipe(recipeInput?.id ?? recipeInput);
  return Object.freeze({
    worldId: recipe.id,
    worldRevision: recipe.revision,
    seed: recipe.seed,
    chunk: Number(terrainPolicy.patchSize),
    segments: Number(terrainPolicy.sourceResolution),
    trees: Number(recipe.runtime.trees),
    grass: Number(recipe.runtime.grass),
    groundCover: Number(recipe.runtime.groundCover),
    goal: Number(recipe.runtime.goalDistance)
  });
}
