import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES
} from "./tree-archetype-catalog.js";
import {
  FOLIAGE_ATLAS_COLUMNS,
  FOLIAGE_ATLAS_ROWS,
  FOLIAGE_ATLAS_REVISION,
  PREHISTORIC_FOLIAGE_CARD_FAMILIES,
  PREHISTORIC_GROUND_COVER_ARCHETYPES,
  createTreeFoliageCardPlacements,
  foliageFamilyIdForArchetype,
  getPrehistoricFoliageCardFamily
} from "./prehistoric-foliage-card-recipes.js";

function speciesBounds(archetype) {
  const halfWidth = Math.max(archetype.crownRadius, archetype.trunkRadius) * 1.08;
  return {
    min: [-halfWidth, 0, -halfWidth],
    max: [halfWidth, archetype.averageHeight + archetype.crownHeight * 0.45, halfWidth]
  };
}

function groundCoverBounds(archetype) {
  const halfWidth = archetype.averageWidth * 0.5;
  return {
    min: [-halfWidth, 0, -halfWidth],
    max: [halfWidth, archetype.averageHeight, halfWidth]
  };
}

function atlasUvRect(family) {
  const [column, row] = family.atlasCell;
  return [
    column / FOLIAGE_ATLAS_COLUMNS,
    (FOLIAGE_ATLAS_ROWS - 1 - row) / FOLIAGE_ATLAS_ROWS,
    1 / FOLIAGE_ATLAS_COLUMNS,
    1 / FOLIAGE_ATLAS_ROWS
  ];
}

function cardFamilyInput(family, color, accentColor, metadata = {}) {
  return {
    id: family.id,
    kind: family.kind,
    atlas: {
      assetId: FOLIAGE_ATLAS_REVISION,
      frameId: family.id,
      uvRect: atlasUvRect(family),
      resolution: [1024, 512],
      alphaChannel: "a",
      metadata: { product: "prehistoric-rush", atlasRevision: FOLIAGE_ATLAS_REVISION }
    },
    size: family.size,
    alphaCutoff: family.alphaCutoff,
    doubleSided: true,
    translucency: family.translucency,
    roughness: family.roughness,
    normalStrength: 0.48,
    color: { base: color, accent: accentColor, dry: 0xb9a66a, shade: 0x476c43 },
    wind: family.wind,
    metadata: { ...metadata, product: "prehistoric-rush" }
  };
}

function vegetationSpeciesInput(archetype, typeIndex) {
  return {
    id: archetype.id,
    family: "prehistoric-tree",
    kind: "tree",
    rooted: true,
    bounds: speciesBounds(archetype),
    pivot: [0, 0, 0],
    groundAnchor: [0, 0, 0],
    growthStages: ["seed", "growing", "mature", "damaged", "dead"],
    defaultLifecycleState: "mature",
    parts: [
      {
        id: "trunk",
        kind: "trunk",
        regions: ["bark"],
        geometry: { provider: "core-object-shape", descriptorId: `${archetype.id}:trunk-shape` },
        material: { provider: "core-graphics", descriptorId: `${archetype.id}:bark-material` },
        collision: { provider: "core-physics", descriptorId: `${archetype.id}:trunk-collision` }
      },
      {
        id: "branches",
        parentId: "trunk",
        kind: "branch-structure",
        regions: ["bark"],
        geometry: { provider: "core-object-shape", descriptorId: `${archetype.id}:branch-shape` },
        material: { provider: "core-graphics", descriptorId: `${archetype.id}:bark-material` }
      },
      {
        id: "canopy",
        parentId: "branches",
        kind: "canopy",
        regions: ["foliage"],
        geometry: { provider: "core-object-vegetation", descriptorId: `${archetype.id}:foliage-placement` },
        material: { provider: "core-graphics", descriptorId: `${archetype.id}:foliage-card-material` }
      }
    ],
    ecology: {
      moisture: archetype.ecology.moisture,
      elevation: archetype.ecology.elevation,
      slope: archetype.ecology.slope ?? 0.42,
      temperature: archetype.ecology.temperature ?? 0.62,
      moistureTolerance: archetype.ecology.moistureTolerance ?? 0.52,
      elevationTolerance: archetype.ecology.elevationTolerance ?? 0.58,
      slopeTolerance: archetype.ecology.slopeTolerance ?? 0.7,
      temperatureTolerance: archetype.ecology.temperatureTolerance ?? 0.65,
      clusterScale: archetype.ecology.clusterScale,
      clusterStrength: archetype.ecology.clusterStrength,
      distributionWeight: archetype.distributionWeight
    },
    variation: {
      yawDegrees: [0, 360],
      leanXDegrees: [-5, 5],
      leanZDegrees: [-5, 5],
      uniformScale: [0.84, 1.18],
      heightScale: [0.92, 1.12],
      crownScale: [0.9, 1.1],
      groundSink: [0.1, 0.5],
      hueShift: [-0.05, 0.05],
      roughnessAdd: [-0.06, 0.06],
      valueShift: [-0.08, 0.08]
    },
    environmentResponse: {
      wind: { mode: "rooted-tree", trunkStiffness: 0.92, canopyAmplitude: 0.12 },
      moisture: "ecology-driven"
    },
    references: {
      shape: { provider: "core-object-shape", descriptorId: `prehistoric-tree-source-shape:${archetype.id}` },
      material: { provider: "core-graphics", descriptorId: `${archetype.id}:materials` },
      collision: { provider: "core-physics", descriptorId: `${archetype.id}:collision` },
      fidelity: { provider: "core-object-fidelity", descriptorId: `prehistoric-tree-fidelity-profile:${archetype.id}` },
      capture: { provider: "core-capture", descriptorId: `${archetype.id}:capture` }
    },
    metadata: {
      product: "prehistoric-rush",
      typeIndex,
      label: archetype.label,
      shape: archetype.shape,
      minHeight: archetype.minHeight,
      maxHeight: archetype.maxHeight,
      averageHeight: archetype.averageHeight,
      trunkRadius: archetype.trunkRadius,
      crownHeight: archetype.crownHeight,
      crownRadius: archetype.crownRadius,
      barkColor: archetype.barkColor,
      foliageColor: archetype.foliageColor,
      accentColor: archetype.accentColor,
      barkTexture: archetype.barkTexture,
      foliageTexture: archetype.foliageTexture,
      foliageCardFamily: archetype.foliageCardFamily,
      heroCardCount: archetype.heroCardCount,
      mediumCardCount: archetype.mediumCardCount,
      canopyLayers: archetype.canopyLayers,
      hangingFoliage: archetype.hangingFoliage,
      textureScale: archetype.textureScale,
      textureStrength: archetype.textureStrength,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
    }
  };
}

function treeInput(archetype) {
  const foliageId = `${archetype.id}:foliage`;
  const nearCards = createTreeFoliageCardPlacements(archetype, "near");
  return {
    id: `${archetype.id}:tree-structure`,
    speciesId: archetype.id,
    shape: archetype.shape,
    averageHeight: archetype.averageHeight,
    averageWidth: archetype.crownRadius * 2,
    roots: { kind: "root-flare", depth: archetype.averageHeight * 0.06, spread: archetype.trunkRadius * 2.4 },
    trunk: { radius: archetype.trunkRadius, taper: 0.68, radialSegments: 10, heightSegments: 4 },
    branches: {
      kind: archetype.shape,
      levels: /horsetail|cycad|palm/.test(archetype.shape) ? 0 : 3,
      primaryCount: /umbrella|ginkgo|ghostwood/.test(archetype.shape) ? 3 : 5,
      secondaryCount: /spire|araucaria/.test(archetype.shape) ? 14 : 8,
      forkProbability: archetype.shape.includes("fork") ? 0.8 : 0.34
    },
    canopy: {
      id: `${archetype.id}:canopy-composition`,
      kind: /palm|cycad|fern/.test(archetype.shape) ? "radial-frond-burst" : /spire|araucaria/.test(archetype.shape) ? "tiered-canopy" : "layered-card-canopy",
      height: archetype.crownHeight,
      radius: archetype.crownRadius,
      foliageIds: [foliageId],
      clusterCount: nearCards.length,
      layerCount: archetype.canopyLayers,
      edgeIrregularity: /palm|cycad|fern/.test(archetype.shape) ? 0.22 : 0.48,
      hangingFoliage: archetype.hangingFoliage,
      deadwood: archetype.shape === "forked-ghostwood" ? 0.42 : 0.04,
      anchors: []
    },
    foliage: {
      ids: [foliageId],
      compositionId: `${archetype.id}:canopy-composition`,
      nearDensity: 1,
      mediumDensity: Math.max(0.28, archetype.mediumCardCount / Math.max(1, archetype.heroCardCount)),
      windScale: /palm|fern|cycad/.test(archetype.shape) ? 1.25 : 1
    },
    collision: { kind: "trunk", radius: archetype.trunkRadius, height: archetype.averageHeight },
    fidelity: { quality: "high", near: "wood-plus-alpha-cards", medium: "wood-plus-reduced-cards", far: "multi-angle-impostor", horizon: "single-impostor" },
    metadata: { product: "prehistoric-rush", archetypeId: archetype.id, foliageAtlasRevision: FOLIAGE_ATLAS_REVISION }
  };
}

function foliageInput(archetype) {
  const family = getPrehistoricFoliageCardFamily(foliageFamilyIdForArchetype(archetype));
  const nearPlacements = createTreeFoliageCardPlacements(archetype, "near");
  const clusters = nearPlacements.map((placement, index) => ({
    id: `${archetype.id}:foliage-cluster:${index}`,
    familyId: placement.familyId,
    mode: placement.mode,
    count: 1,
    position: placement.position,
    rotation: placement.rotation,
    scale: [0.92, 1.08],
    extent: [placement.scale[0], placement.scale[1], Math.max(0.1, placement.scale[0] * 0.08)],
    density: 1,
    randomness: 0.22,
    windScale: 1,
    fidelity: { nearMultiplier: 1, mediumMultiplier: archetype.mediumCardCount / Math.max(1, archetype.heroCardCount), farMultiplier: 0 },
    metadata: { product: "prehistoric-rush", placementId: placement.id }
  }));
  return {
    id: `${archetype.id}:foliage`,
    speciesId: archetype.id,
    kind: family.kind,
    structure: { mode: archetype.shape, density: archetype.shape === "forked-ghostwood" ? 0.62 : 1 },
    card: { mode: "alpha-cutout", familyId: family.id, crossedPlanes: /palm|fern|cycad/.test(archetype.shape) ? 1 : 2, doubleSided: true, alphaCutoff: family.alphaCutoff },
    cardFamilies: [cardFamilyInput(family, archetype.foliageColor, archetype.accentColor, { speciesId: archetype.id })],
    clusters,
    density: archetype.shape === "forked-ghostwood" ? 0.64 : 1,
    translucency: family.translucency,
    wind: family.wind,
    seasonalColors: { default: archetype.foliageColor, accent: archetype.accentColor, dry: 0xb2a45d },
    materialRegions: ["foliage"],
    texture: { pattern: archetype.foliageTexture, scale: archetype.textureScale, strength: archetype.textureStrength, atlasRevision: FOLIAGE_ATLAS_REVISION },
    fidelity: {
      near: { mode: "alpha-cutout-cards", density: 1 },
      medium: { mode: "alpha-cutout-cards", density: archetype.mediumCardCount / Math.max(1, archetype.heroCardCount) },
      far: { mode: "captured-impostor" },
      horizon: { mode: "captured-impostor" }
    },
    metadata: { product: "prehistoric-rush", archetypeId: archetype.id, foliageAtlasRevision: FOLIAGE_ATLAS_REVISION }
  };
}

function groundCoverSpeciesInput(archetype, groundCoverIndex) {
  const family = getPrehistoricFoliageCardFamily(archetype.familyId);
  return {
    id: archetype.id,
    family: archetype.family,
    kind: "ground-cover",
    rooted: true,
    bounds: groundCoverBounds(archetype),
    pivot: [0, 0, 0],
    groundAnchor: [0, 0, 0],
    growthStages: ["growing", "mature", "damaged", "dead"],
    defaultLifecycleState: "mature",
    parts: [{
      id: "foliage",
      kind: family.kind,
      regions: ["foliage"],
      geometry: { provider: "core-object-vegetation", descriptorId: `${archetype.id}:placement` },
      material: { provider: "core-graphics", descriptorId: `${archetype.id}:foliage-card-material` }
    }],
    ecology: {
      ...archetype.ecology,
      moistureTolerance: 0.48,
      elevationTolerance: 0.52,
      slopeTolerance: archetype.id.includes("vine") ? 0.82 : 0.55,
      temperature: 0.62,
      temperatureTolerance: 0.7,
      distributionWeight: archetype.distributionWeight
    },
    variation: archetype.variation,
    environmentResponse: { wind: { mode: "rooted-ground-cover", amplitude: family.wind.amplitude }, moisture: "ecology-driven" },
    references: {
      material: { provider: "core-graphics", descriptorId: `${archetype.id}:foliage-card-material` },
      fidelity: { provider: "core-object-fidelity", descriptorId: `${archetype.id}:ground-cover-fidelity` }
    },
    metadata: {
      product: "prehistoric-rush",
      groundCoverIndex,
      label: archetype.label,
      familyId: archetype.familyId,
      averageHeight: archetype.averageHeight,
      averageWidth: archetype.averageWidth,
      crossedPlanes: archetype.crossedPlanes,
      color: archetype.color,
      accentColor: archetype.accentColor,
      wind: family.wind,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
    }
  };
}

function groundCoverFoliageInput(archetype) {
  const family = getPrehistoricFoliageCardFamily(archetype.familyId);
  return {
    id: `${archetype.id}:foliage`,
    speciesId: archetype.id,
    kind: family.kind,
    structure: { mode: "understory-clump", density: 1 },
    card: { mode: "alpha-cutout", familyId: family.id, crossedPlanes: archetype.crossedPlanes, doubleSided: true, alphaCutoff: family.alphaCutoff },
    cardFamilies: [cardFamilyInput(family, archetype.color, archetype.accentColor, { speciesId: archetype.id, groundCover: true })],
    clusters: [{
      id: `${archetype.id}:cluster`,
      familyId: family.id,
      mode: "understory-clump",
      count: archetype.crossedPlanes,
      position: [0, 0, 0],
      extent: [archetype.averageWidth, archetype.averageHeight, archetype.averageWidth],
      scale: [0.8, 1.2],
      density: 1,
      randomness: 0.46,
      windScale: 1,
      fidelity: { nearMultiplier: 1, mediumMultiplier: 0.55, farMultiplier: 0 }
    }],
    density: 1,
    translucency: family.translucency,
    wind: family.wind,
    seasonalColors: { default: archetype.color, accent: archetype.accentColor },
    materialRegions: ["foliage"],
    texture: { pattern: family.id, atlasRevision: FOLIAGE_ATLAS_REVISION },
    fidelity: { near: { mode: "crossed-cards", density: 1 }, medium: { mode: "crossed-cards", density: 0.55 }, far: { mode: "absent" }, horizon: { mode: "absent" } },
    metadata: { product: "prehistoric-rush", groundCover: true, foliageAtlasRevision: FOLIAGE_ATLAS_REVISION }
  };
}

export function registerPrehistoricVegetationCatalog(NexusEngine, engine) {
  const vegetation = engine.n.vegetation;
  const tree = engine.n.vegetationTree;
  const foliage = engine.n.vegetationFoliage;
  const objectBridge = engine.n.vegetationObjectBridge;
  if (!vegetation || !tree || !foliage || !objectBridge) {
    throw new Error("PrehistoricRush vegetation registration requires the NexusEngine Object Vegetation domain.");
  }

  const species = [];
  const treeStructures = [];
  const foliageDescriptors = [];
  const objects = [];
  PREHISTORIC_TREE_ARCHETYPES.forEach((archetype, typeIndex) => {
    const speciesDescriptor = vegetation.registerSpecies(vegetationSpeciesInput(archetype, typeIndex));
    const treeDescriptor = tree.register(treeInput(archetype));
    const foliageDescriptor = foliage.register(foliageInput(archetype));
    const objectDescriptor = objectBridge.registerSpeciesObject(speciesDescriptor.id, {
      id: `prehistoric-tree-object:${archetype.id}`,
      objectType: "vegetation:tree",
      metadata: {
        treeStructureId: treeDescriptor.id,
        foliageDescriptorId: foliageDescriptor.id,
        typeIndex,
        foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
      }
    });
    species.push(speciesDescriptor);
    treeStructures.push(treeDescriptor);
    foliageDescriptors.push(foliageDescriptor);
    objects.push(objectDescriptor);
  });

  const groundCoverSpecies = [];
  const groundCoverFoliageDescriptors = [];
  const groundCoverObjects = [];
  PREHISTORIC_GROUND_COVER_ARCHETYPES.forEach((archetype, groundCoverIndex) => {
    const speciesDescriptor = vegetation.registerSpecies(groundCoverSpeciesInput(archetype, groundCoverIndex));
    const foliageDescriptor = foliage.register(groundCoverFoliageInput(archetype));
    const objectDescriptor = objectBridge.registerSpeciesObject(speciesDescriptor.id, {
      id: `prehistoric-ground-cover-object:${archetype.id}`,
      objectType: "vegetation:ground-cover",
      collision: { provider: "none", descriptorId: `${archetype.id}:no-collision` },
      metadata: {
        foliageDescriptorId: foliageDescriptor.id,
        groundCoverIndex,
        foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
      }
    });
    groundCoverSpecies.push(speciesDescriptor);
    groundCoverFoliageDescriptors.push(foliageDescriptor);
    groundCoverObjects.push(objectDescriptor);
  });

  return Object.freeze({
    species: Object.freeze(species),
    treeStructures: Object.freeze(treeStructures),
    foliageDescriptors: Object.freeze(foliageDescriptors),
    objects: Object.freeze(objects),
    groundCoverSpecies: Object.freeze(groundCoverSpecies),
    groundCoverFoliageDescriptors: Object.freeze(groundCoverFoliageDescriptors),
    groundCoverObjects: Object.freeze(groundCoverObjects),
    cardFamilies: PREHISTORIC_FOLIAGE_CARD_FAMILIES,
    groundCoverArchetypes: PREHISTORIC_GROUND_COVER_ARCHETYPES,
    treeTypes: PREHISTORIC_TREE_TYPES,
    foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
  });
}

export function createPrehistoricVegetationRuntime(NexusEngine) {
  if (typeof NexusEngine.createCoreObjectDomain !== "function") {
    throw new TypeError("Pinned NexusEngine is missing createCoreObjectDomain().");
  }
  const engine = NexusEngine.createEngine({
    kits: NexusEngine.createCoreObjectDomain({ shape: false, fidelity: false })
  });
  const catalog = registerPrehistoricVegetationCatalog(NexusEngine, engine);
  const vegetation = engine.n.vegetation;
  return Object.freeze({
    engine,
    catalog,
    vegetation,
    ecology: engine.n.vegetationEcology,
    tree: engine.n.vegetationTree,
    foliage: engine.n.vegetationFoliage,
    objectBridge: engine.n.vegetationObjectBridge,
    placement: Object.freeze({
      listSpecies: () => vegetation.listSpecies(),
      selectSpecies(environment, seed) {
        return vegetation.selectSpecies(environment, seed, (species) => species.kind === "tree");
      },
      selectGroundCoverSpecies(environment, seed) {
        return vegetation.selectSpecies(environment, seed, (species) => species.kind === "ground-cover");
      },
      createInstanceDescriptor(input) {
        return vegetation.createInstanceDescriptor(input);
      }
    })
  });
}

export function createPrehistoricVegetationGeneratorOptions(runtime) {
  return Object.freeze({
    treeTypes: PREHISTORIC_TREE_TYPES,
    vegetation: runtime.placement,
    vegetationSpecies: runtime.catalog.species,
    groundCoverSpecies: runtime.catalog.groundCoverSpecies,
    groundCoverArchetypes: PREHISTORIC_GROUND_COVER_ARCHETYPES,
    foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
  });
}
