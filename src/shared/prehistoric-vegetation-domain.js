import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES
} from "./tree-archetype-catalog.js";

function speciesBounds(archetype) {
  const halfWidth = Math.max(archetype.crownRadius, archetype.trunkRadius) * 1.08;
  return {
    min: [-halfWidth, 0, -halfWidth],
    max: [halfWidth, archetype.averageHeight + archetype.crownHeight * 0.45, halfWidth]
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
        id: "canopy",
        parentId: "trunk",
        kind: "canopy",
        regions: ["foliage"],
        geometry: { provider: "core-object-shape", descriptorId: `${archetype.id}:canopy-shape` },
        material: { provider: "core-graphics", descriptorId: `${archetype.id}:foliage-material` }
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
      wind: { mode: "rooted-tree", trunkStiffness: 0.92, canopyAmplitude: 0.08 },
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
      textureScale: archetype.textureScale,
      textureStrength: archetype.textureStrength
    }
  };
}

function treeInput(archetype) {
  return {
    id: `${archetype.id}:tree-structure`,
    speciesId: archetype.id,
    shape: archetype.shape,
    averageHeight: archetype.averageHeight,
    averageWidth: archetype.crownRadius * 2,
    roots: { kind: "root-flare", depth: archetype.averageHeight * 0.06, spread: archetype.trunkRadius * 2.4 },
    trunk: { radius: archetype.trunkRadius, taper: 0.68, radialSegments: 10, heightSegments: 3 },
    branches: { kind: archetype.shape, levels: archetype.shape === "horsetail" ? 0 : 3, forkProbability: archetype.shape.includes("fork") ? 0.8 : 0.34 },
    canopy: { kind: archetype.foliageTexture, height: archetype.crownHeight, radius: archetype.crownRadius, anchors: [] },
    collision: { kind: "trunk", radius: archetype.trunkRadius, height: archetype.averageHeight },
    fidelity: { quality: "high", far: "multi-angle-impostor", horizon: "single-impostor" },
    metadata: { product: "prehistoric-rush", archetypeId: archetype.id }
  };
}

function foliageInput(archetype) {
  const frond = /fern|cycad|frond/.test(`${archetype.shape}:${archetype.foliageTexture}`);
  const needle = /spire|araucaria|needle/.test(`${archetype.shape}:${archetype.foliageTexture}`);
  return {
    id: `${archetype.id}:foliage`,
    speciesId: archetype.id,
    kind: frond ? "frond-cluster" : needle ? "needle-cluster" : "leaf-cluster",
    structure: { mode: archetype.shape, density: archetype.shape === "forked-ghostwood" ? 0.62 : 1 },
    card: { mode: "alpha-cutout", crossedPlanes: frond ? 3 : 2, doubleSided: true, alphaCutoff: 0.38 },
    density: archetype.shape === "forked-ghostwood" ? 0.64 : 1,
    translucency: frond ? 0.16 : 0.1,
    wind: { mode: "branch-relative", amplitude: frond ? 0.13 : 0.08, frequency: frond ? 0.85 : 0.66, stiffness: needle ? 0.84 : 0.7 },
    seasonalColors: { default: archetype.foliageColor, accent: archetype.accentColor },
    materialRegions: ["foliage"],
    texture: { pattern: archetype.foliageTexture, scale: archetype.textureScale, strength: archetype.textureStrength },
    metadata: { product: "prehistoric-rush", archetypeId: archetype.id }
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
      objectType: "tree-archetype",
      metadata: {
        treeStructureId: treeDescriptor.id,
        foliageDescriptorId: foliageDescriptor.id,
        typeIndex
      }
    });
    species.push(speciesDescriptor);
    treeStructures.push(treeDescriptor);
    foliageDescriptors.push(foliageDescriptor);
    objects.push(objectDescriptor);
  });

  return Object.freeze({
    species: Object.freeze(species),
    treeStructures: Object.freeze(treeStructures),
    foliageDescriptors: Object.freeze(foliageDescriptors),
    objects: Object.freeze(objects),
    treeTypes: PREHISTORIC_TREE_TYPES
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
    vegetationSpecies: runtime.catalog.species
  });
}
