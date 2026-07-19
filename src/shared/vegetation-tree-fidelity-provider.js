import {
  PREHISTORIC_TREE_ARCHETYPES,
  TREE_FIDELITY_PACKAGE_VERSION
} from "./tree-archetype-catalog.js";
import { FOLIAGE_ATLAS_REVISION } from "./prehistoric-foliage-card-recipes.js";
import { PREHISTORIC_TREE_GROWTH_REVISION } from "./prehistoric-tree-growth-compute.js";
import { TREE_FIDELITY_PROVIDER_ID } from "./tree-fidelity-assets.js";
import { createPrehistoricNaturalTreeObject } from "../render/prehistoric-natural-tree-geometry.js";

const TREE_SHAPE_PROVIDER_ID = "prehistoric-tree-shape-provider";
const TREE_CAPTURE_PROVIDER_ID = "prehistoric-tree-capture-provider";
const TREE_SHAPE_PROFILE_ID = "prehistoric-tree-shape-profile";
const TREE_GROWTH_PACKAGE_SCHEMA = "prehistoric-rush.tree-growth-package/1";

const objectIdFor = (archetype) => `prehistoric-tree-object:${archetype.id}`;
const sourceShapeIdFor = (archetype) => `prehistoric-tree-source-shape:${archetype.id}`;
const fidelityProfileIdFor = (archetype) => `prehistoric-tree-fidelity-profile:${archetype.id}`;

function disposeTree(object) {
  const disposedGeometry = new Set();
  const disposedMaterials = new Set();
  object.traverse?.((child) => {
    if (child.geometry && !disposedGeometry.has(child.geometry)) {
      disposedGeometry.add(child.geometry);
      child.geometry.dispose?.();
    }
    const materials = Array.isArray(child.material) ? child.material : child.material ? [child.material] : [];
    for (const material of materials) {
      if (disposedMaterials.has(material)) continue;
      disposedMaterials.add(material);
      material.dispose?.();
    }
  });
}

function portableWoodGeometryFromObject(THREE, object) {
  object.updateMatrixWorld(true);
  const positions = [];
  const indices = [];
  const normals = [];
  const colors = [];
  const vertex = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();

  object.traverse((mesh) => {
    if (!mesh?.isMesh || !mesh.geometry?.getAttribute) return;
    if (mesh.userData?.foliageCard || mesh.userData?.vegetationRole === "bounds-proxy" || mesh.material?.visible === false) return;
    const geometry = mesh.geometry;
    const position = geometry.getAttribute("position");
    if (!position) return;
    const normalAttribute = geometry.getAttribute("normal");
    const colorAttribute = geometry.getAttribute("color");
    const baseVertex = positions.length / 3;
    normalMatrix.getNormalMatrix(mesh.matrixWorld);
    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const fallbackColor = material?.color ?? new THREE.Color(0xffffff);

    for (let index = 0; index < position.count; index += 1) {
      vertex.fromBufferAttribute(position, index).applyMatrix4(mesh.matrixWorld);
      positions.push(vertex.x, vertex.y, vertex.z);
      if (normalAttribute) {
        normal.fromBufferAttribute(normalAttribute, index).applyMatrix3(normalMatrix).normalize();
        normals.push(normal.x, normal.y, normal.z);
      } else {
        normals.push(0, 1, 0);
      }
      if (colorAttribute) colors.push(colorAttribute.getX(index), colorAttribute.getY(index), colorAttribute.getZ(index));
      else colors.push(fallbackColor.r, fallbackColor.g, fallbackColor.b);
    }

    if (geometry.index) {
      for (let index = 0; index < geometry.index.count; index += 1) indices.push(baseVertex + geometry.index.getX(index));
    } else {
      for (let index = 0; index < position.count; index += 1) indices.push(baseVertex + index);
    }
  });

  if (positions.length < 9 || indices.length < 3) throw new Error(`Tree ${object.name} produced no portable wood geometry.`);
  return {
    positions,
    indices,
    attributes: {
      normal: { itemSize: 3, values: normals },
      color: { itemSize: 3, values: colors }
    }
  };
}

function objectShapeProfileFromTreeRecipe(recipe) {
  return {
    id: recipe.id,
    version: Number(TREE_FIDELITY_PACKAGE_VERSION),
    preserve: {
      silhouette: true,
      borders: true,
      materialBoundaries: true,
      normals: true,
      vertexColors: true
    },
    targets: recipe.targets.map((target) => ({
      id: target.id,
      ratio: target.ratio,
      mode: target.mode,
      maximumDeviation: target.id === "near" ? 0 : 0.032,
      preserve: { borders: true, vertexColors: true }
    })),
    metadata: {
      purpose: "Tree-domain Shape recipe adapted for natural-growth wood only.",
      speciesId: recipe.speciesId,
      sourceRecipeId: recipe.id,
      growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
    }
  };
}

function objectFidelityProfileFromTree(engine, archetype, sourceShapeId) {
  const tree = engine.n.vegetationTree.get(`${archetype.id}:tree-structure`);
  if (!tree) throw new RangeError(`Missing Tree-domain structure for ${archetype.id}.`);
  const profile = engine.n.vegetationTree.createFidelityProfile(tree, {
    id: fidelityProfileIdFor(archetype),
    version: Number(TREE_FIDELITY_PACKAGE_VERSION),
    shapeBuilderId: "object-shape-form",
    captureProviderId: TREE_CAPTURE_PROVIDER_ID,
    nearPixels: 300,
    mediumPixels: 84,
    mediumMaximumPixels: 330,
    farPixels: 12,
    farMaximumPixels: 105,
    horizonPixels: 18,
    transitionDuration: 0.32,
    hysteresis: 0.14,
    stableFrames: 3,
    capturePadding: 0.04,
    frameSize: 256,
    horizonFrameSize: 128,
    azimuthCount: 8,
    elevations: [0, 12],
    observations: ["color", "opacity"],
    metadata: {
      product: "prehistoric-rush",
      archetypeId: archetype.id,
      growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
      singleVisualAuthority: true
    }
  });
  return {
    ...profile,
    forms: profile.forms.map((form) => {
      if (form.id === "near" || form.id === "medium") {
        return {
          ...form,
          qualities: ["high"],
          requiredTraits: ["geometry", "vertex-color"],
          metadata: {
            ...(form.metadata ?? {}),
            shape: {
              sourceShapeId,
              profileId: TREE_SHAPE_PROFILE_ID,
              targetId: form.id,
              providerId: TREE_SHAPE_PROVIDER_ID
            },
            treeStructureId: tree.id,
            foliageDescriptorId: `${archetype.id}:foliage`,
            growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
            foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
          }
        };
      }
      return {
        ...form,
        qualities: ["high"],
        requiredTraits: ["color", "opacity"],
        capture: {
          ...form.capture,
          metadata: {
            ...(form.capture?.metadata ?? {}),
            archetypeId: archetype.id,
            packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
            growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
            foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
          }
        }
      };
    }),
    metadata: {
      ...(profile.metadata ?? {}),
      stableSelectionFrames: 3,
      treeStructureId: tree.id,
      foliageDescriptorId: `${archetype.id}:foliage`,
      growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
      singleVisualAuthority: true
    }
  };
}

function enrichedAtlas(result) {
  const color = result?.observations?.color;
  if (!color) throw new Error("Tree capture result is missing color observation.");
  return {
    ...color,
    metadata: {
      ...(color.metadata ?? {}),
      ...(result.metadata?.atlas ?? {}),
      captureBounds: result.metadata?.bounds ?? null,
      padding: 0.04,
      growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION
    }
  };
}

function meshGeometryForForm(engine, form) {
  const layer = form.layers.find((entry) => entry.role === "structure") ?? form.layers[0];
  const shapeId = layer?.metadata?.shapeId ?? layer?.reference?.descriptorId;
  const shape = engine.n.objectShape.getShape(shapeId);
  if (!shape?.geometry) throw new Error(`Fidelity form ${form.id} does not resolve to inline Object Shape geometry.`);
  return shape.geometry;
}

function captureResultForForm(engine, form) {
  const resultId = form.metadata?.captureResultId;
  const result = resultId ? engine.n.coreCapture.getResult(resultId) : null;
  if (!result) throw new Error(`Fidelity form ${form.id} does not resolve to a Core Capture result.`);
  return result;
}

function growthPayload(NexusEngine, runtime, archetype) {
  const entry = runtime.growthPlans?.[archetype.id];
  if (!entry?.near || !entry?.medium) throw new Error(`Missing admitted natural growth plans for ${archetype.id}.`);
  if (!entry.validation?.near?.valid || !entry.validation?.medium?.valid) throw new Error(`Natural growth plans for ${archetype.id} were not validated.`);
  const payload = {
    schema: TREE_GROWTH_PACKAGE_SCHEMA,
    revision: PREHISTORIC_TREE_GROWTH_REVISION,
    algorithm: entry.near.algorithm?.kind ?? null,
    forms: {
      near: { plan: entry.near, shadingBuffer: entry.buffers?.near?.shading ?? [] },
      medium: { plan: entry.medium, shadingBuffer: entry.buffers?.medium?.shading ?? [] }
    },
    metrics: entry.metrics
  };
  return {
    ...payload,
    digest: NexusEngine.hashFidelityValue(payload)
  };
}

function portablePackageFromFidelity(NexusEngine, runtime, archetype, object, build, packageValue) {
  const engine = runtime.engine;
  const profile = engine.n.objectFidelity.getSnapshot().profiles[packageValue.profileId];
  const nearForm = engine.n.objectFidelity.getForm(packageValue.forms.near);
  const mediumForm = engine.n.objectFidelity.getForm(packageValue.forms.medium);
  const farForm = engine.n.objectFidelity.getForm(packageValue.forms.far);
  const horizonForm = engine.n.objectFidelity.getForm(packageValue.forms.horizon);
  const farCapture = captureResultForForm(engine, farForm);
  captureResultForForm(engine, horizonForm);
  const species = engine.n.vegetation.getSpecies(archetype.id);
  const tree = engine.n.vegetationTree.get(`${archetype.id}:tree-structure`);
  const foliage = engine.n.vegetationFoliage.get(`${archetype.id}:foliage`);
  const growth = growthPayload(NexusEngine, runtime, archetype);
  const generationInput = {
    objectId: object.id,
    objectContentHash: object.contentHash,
    vegetationSpeciesHash: species?.contentHash ?? null,
    treeStructureId: tree?.id ?? null,
    treeStructureHash: tree ? NexusEngine.hashFidelityValue(tree) : null,
    foliageDescriptorId: foliage?.id ?? null,
    foliageDescriptorHash: foliage ? NexusEngine.hashFidelityValue(foliage) : null,
    growthRevision: growth.revision,
    growthDigest: growth.digest,
    foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
    shapeProfileId: TREE_SHAPE_PROFILE_ID,
    fidelityProfileId: packageValue.profileId,
    fidelityPackageId: packageValue.id,
    fidelityPackageHash: packageValue.contentHash,
    buildId: build.id,
    packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
    archetypeId: archetype.id,
    forms: {
      near: nearForm.contentHash,
      medium: mediumForm.contentHash,
      far: farForm.contentHash,
      horizon: horizonForm.contentHash
    }
  };
  const generationId = `tree-fidelity:${NexusEngine.hashFidelityValue(generationInput)}`;
  const sourceBounds = object.bounds;
  const sharedAtlas = enrichedAtlas(farCapture);
  const farFrames = farCapture.frames.map((frame) => ({ ...frame }));
  const formProfile = (id) => profile.forms.find((entry) => entry.id === id);
  return {
    schema: "prehistoric-rush.tree-fidelity-package/5",
    version: TREE_FIDELITY_PACKAGE_VERSION,
    archetypeId: archetype.id,
    generation: { id: generationId, ...generationInput },
    growth,
    source: {
      bounds: {
        min: sourceBounds.min,
        max: sourceBounds.max,
        size: sourceBounds.size,
        center: sourceBounds.center,
        width: Math.max(sourceBounds.size[0], sourceBounds.size[2]),
        height: sourceBounds.size[1],
        depth: Math.max(sourceBounds.size[0], sourceBounds.size[2])
      },
      pivot: object.pivot,
      groundAnchor: object.groundAnchor,
      collision: { radius: archetype.trunkRadius, height: archetype.averageHeight }
    },
    forms: {
      near: {
        kind: "natural-wood-mesh-plus-compute-foliage-cards",
        minimumProjectedSize: formProfile("near").minimumProjectedSize,
        foliageDensity: formProfile("near").metadata?.foliageDensity ?? 1,
        geometry: meshGeometryForForm(engine, nearForm),
        growthDigest: growth.digest,
        formId: nearForm.id,
        contentHash: nearForm.contentHash
      },
      medium: {
        kind: "reduced-natural-wood-mesh-plus-compute-foliage-cards",
        minimumProjectedSize: formProfile("medium").minimumProjectedSize,
        maximumProjectedSize: formProfile("medium").maximumProjectedSize,
        foliageDensity: formProfile("medium").metadata?.foliageDensity ?? 0.46,
        geometry: meshGeometryForForm(engine, mediumForm),
        growthDigest: growth.digest,
        formId: mediumForm.id,
        contentHash: mediumForm.contentHash
      },
      far: {
        kind: "natural-growth-multi-angle-impostor",
        minimumProjectedSize: formProfile("far").minimumProjectedSize,
        maximumProjectedSize: formProfile("far").maximumProjectedSize,
        atlas: sharedAtlas,
        frames: farFrames,
        growthDigest: growth.digest,
        formId: farForm.id,
        contentHash: farForm.contentHash
      },
      horizon: {
        kind: "natural-growth-horizon-impostor",
        minimumProjectedSize: formProfile("horizon").minimumProjectedSize,
        maximumProjectedSize: formProfile("horizon").maximumProjectedSize,
        atlas: sharedAtlas,
        frames: farFrames,
        growthDigest: growth.digest,
        formId: horizonForm.id,
        contentHash: horizonForm.contentHash
      }
    },
    change: { ...profile.change, stableSelectionFrames: 3 },
    material: {
      vertexColors: true,
      roughness: 0.82,
      metalness: 0,
      barkColor: archetype.barkColor,
      foliageColor: archetype.foliageColor,
      accentColor: archetype.accentColor,
      barkTexture: archetype.barkTexture,
      foliageTexture: archetype.foliageTexture,
      foliageCardFamily: archetype.foliageCardFamily,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
      alphaCutout: true,
      doubleSidedFoliage: true,
      computePreparedShading: true
    },
    ecology: species?.ecology ?? archetype.ecology,
    spawn: {
      averageHeight: archetype.averageHeight,
      distributionWeight: species?.ecology?.distributionWeight ?? archetype.distributionWeight,
      heroCardCount: archetype.heroCardCount,
      mediumCardCount: archetype.mediumCardCount
    }
  };
}

async function buildTree(NexusEngine, THREE, runtime, subjects, archetype, context) {
  const engine = runtime.engine;
  const objectId = objectIdFor(archetype);
  const sourceShapeId = sourceShapeIdFor(archetype);
  const treeStructure = engine.n.vegetationTree.get(`${archetype.id}:tree-structure`);
  const growthEntry = runtime.growthPlans?.[archetype.id];
  if (!treeStructure) throw new RangeError(`Missing Tree-domain structure for ${archetype.id}.`);
  if (!growthEntry?.near) throw new RangeError(`Missing natural-growth capture plan for ${archetype.id}.`);
  const treeObject = createPrehistoricNaturalTreeObject(THREE, archetype, growthEntry.near);
  const portableGeometry = portableWoodGeometryFromObject(THREE, treeObject);
  const metrics = NexusEngine.computeShapeMetrics(portableGeometry);
  const fullBounds = growthEntry.near.bounds;
  subjects.set(objectId, treeObject);

  try {
    context.updateProgress(0.08, 1, `Registering ${archetype.label}`);
    const shapeRecipe = engine.n.vegetationTree.createShapeRecipe(treeStructure, {
      id: TREE_SHAPE_PROFILE_ID,
      mediumRatio: 0.32,
      metadata: {
        product: "prehistoric-rush",
        growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
        foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
        woodOnly: true
      }
    });
    engine.n.objectShape.registerProfile(objectShapeProfileFromTreeRecipe(shapeRecipe));
    const object = engine.n.coreObject.register({
      id: objectId,
      objectType: "tree-archetype",
      bounds: { min: fullBounds.min, max: fullBounds.max },
      pivot: [0, 0, 0],
      groundAnchor: [0, 0, 0],
      geometry: { provider: "core-object-shape", descriptorId: sourceShapeId },
      material: { provider: "prehistoric-rush", descriptorId: `${archetype.id}:materials` },
      collision: { provider: "prehistoric-rush", descriptorId: `${archetype.id}:collision` },
      lod: { provider: "core-object-fidelity", descriptorId: fidelityProfileIdFor(archetype) },
      capture: { provider: "core-capture", descriptorId: `${archetype.id}:capture` },
      metadata: {
        vegetation: true,
        speciesId: archetype.id,
        treeStructureId: treeStructure.id,
        foliageDescriptorId: `${archetype.id}:foliage`,
        foliageCardFamily: archetype.foliageCardFamily,
        growthPlanId: growthEntry.near.id,
        growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
        foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
        archetypeId: archetype.id,
        label: archetype.label,
        shape: archetype.shape,
        packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
        woodMetrics: metrics
      }
    });
    engine.n.objectShape.registerSource({
      id: sourceShapeId,
      objectId: object.id,
      objectContentHash: object.contentHash,
      kind: "triangle-mesh",
      geometry: portableGeometry,
      metadata: {
        speciesId: archetype.id,
        archetypeId: archetype.id,
        shape: archetype.shape,
        growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
        foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
        woodOnly: true
      }
    });
    engine.n.objectFidelity.registerProfile(objectFidelityProfileFromTree(engine, archetype, sourceShapeId));
    context.updateProgress(0.16, 1, `Deriving ${archetype.label} natural wood LODs and matching foliage captures`);
    const build = await engine.n.objectFidelity.requestBuild({
      objectId: object.id,
      profileId: fidelityProfileIdFor(archetype),
      quality: "high"
    });
    if (build.state !== "ready") throw new Error(`Object Fidelity build ${build.id} finished in state ${build.state}.`);
    context.updateProgress(0.96, 1, `Committing ${archetype.label} single-authority fidelity package`);
    const packageValue = engine.n.objectFidelity.getActivePackage(object.id);
    if (!packageValue?.readiness?.complete) throw new Error(`Object Fidelity package for ${archetype.id} is incomplete.`);
    return portablePackageFromFidelity(NexusEngine, runtime, archetype, object, build, packageValue);
  } finally {
    subjects.delete(objectId);
    disposeTree(treeObject);
  }
}

export function createVegetationTreeFidelityProvider(NexusEngine, THREE, runtime, options = {}) {
  const engine = runtime.engine;
  const subjects = new Map();
  const canvas = options.canvas ?? document.createElement("canvas");
  const renderer = options.renderer ?? new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  const captureProvider = NexusEngine.createThreeObjectCaptureProvider({
    id: TREE_CAPTURE_PROVIDER_ID,
    THREE,
    renderer,
    resolveSubject(subject) {
      const object = subjects.get(subject.objectId);
      if (!object) throw new RangeError(`Unknown tree capture subject: ${subject.objectId}`);
      return object;
    }
  });
  engine.n.coreCapture.registerProvider(captureProvider);

  return {
    id: TREE_FIDELITY_PROVIDER_ID,
    version: "5.1.0",
    metadata: {
      purpose: "Build one admitted natural-growth tree representation through Object Vegetation, Compute, Shape, Capture, and Fidelity.",
      growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
      foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
      singleVisualAuthority: true,
      domains: [
        "n:object",
        "n:object:vegetation",
        "n:object:vegetation:tree",
        "n:object:vegetation:foliage",
        "n:compute",
        "n:object:shape",
        "n:capture",
        "n:object:fidelity"
      ]
    },
    async load(asset, context) {
      if (asset.metadata.kind === "manifest") {
        return {
          portable: {
            schema: "prehistoric-rush.tree-fidelity-manifest/5",
            revision: asset.version,
            bundleId: runtime.bundleId,
            vegetationDomain: "n:object:vegetation",
            computeDomain: "n:compute",
            growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
            growthDigest: runtime.treeGrowthDigest ?? null,
            foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
            singleVisualAuthority: true,
            archetypes: PREHISTORIC_TREE_ARCHETYPES.map((tree) => ({
              id: tree.id,
              label: tree.label,
              averageHeight: tree.averageHeight,
              shape: tree.shape,
              foliageCardFamily: tree.foliageCardFamily,
              heroCardCount: tree.heroCardCount,
              mediumCardCount: tree.mediumCardCount
            }))
          },
          metadata: {
            kind: "manifest",
            packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
            speciesCount: runtime.vegetationCatalog.species.length,
            growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
            growthDigest: runtime.treeGrowthDigest ?? null,
            foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
            singleVisualAuthority: true
          }
        };
      }
      const archetype = PREHISTORIC_TREE_ARCHETYPES.find((tree) => tree.id === asset.metadata.archetypeId);
      if (!archetype) throw new RangeError(`Unknown tree archetype: ${asset.metadata.archetypeId}`);
      const portable = await buildTree(NexusEngine, THREE, runtime, subjects, archetype, context);
      context.updateProgress(1, 1, `${archetype.label} ready`);
      return {
        portable,
        metadata: {
          archetypeId: archetype.id,
          speciesId: archetype.id,
          generationId: portable.generation.id,
          growthDigest: portable.growth.digest,
          fidelityPackageId: portable.generation.fidelityPackageId,
          packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
          growthRevision: PREHISTORIC_TREE_GROWTH_REVISION,
          foliageAtlasRevision: FOLIAGE_ATLAS_REVISION,
          singleVisualAuthority: true
        }
      };
    },
    dispose() {
      engine.n.coreCapture.unregisterProvider(TREE_CAPTURE_PROVIDER_ID);
      subjects.clear();
      if (!options.renderer) renderer.dispose();
    }
  };
}

export function replaceTreeFidelityProviderWithVegetation(NexusEngine, THREE, runtime, options = {}) {
  runtime.assets.unregisterProvider(TREE_FIDELITY_PROVIDER_ID);
  runtime.assets.registerProvider(createVegetationTreeFidelityProvider(NexusEngine, THREE, runtime, options));
  return runtime;
}

export default createVegetationTreeFidelityProvider;
