import {
  PREHISTORIC_TREE_ARCHETYPES,
  TREE_FIDELITY_PACKAGE_VERSION,
  createPrehistoricTreeObject
} from "./tree-archetype-catalog.js";
import {
  TREE_FIDELITY_PROVIDER_ID
} from "./tree-fidelity-assets.js";

const TREE_SHAPE_PROVIDER_ID = "prehistoric-tree-shape-provider";
const TREE_CAPTURE_PROVIDER_ID = "prehistoric-tree-capture-provider";
const TREE_SHAPE_PROFILE_ID = "prehistoric-tree-shape-profile";

const objectIdFor = (archetype) => `prehistoric-tree-object:${archetype.id}`;
const sourceShapeIdFor = (archetype) => `prehistoric-tree-source-shape:${archetype.id}`;
const fidelityProfileIdFor = (archetype) => `prehistoric-tree-fidelity-profile:${archetype.id}`;

function disposeTree(object) {
  const disposedMaterials = new Set();
  object.traverse?.((child) => {
    child.geometry?.dispose?.();
    const materials = Array.isArray(child.material) ? child.material : child.material ? [child.material] : [];
    for (const material of materials) {
      if (disposedMaterials.has(material)) continue;
      disposedMaterials.add(material);
      material.dispose?.();
    }
  });
}

function portableGeometryFromObject(THREE, object) {
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

  if (positions.length < 9 || indices.length < 3) throw new Error(`Tree ${object.name} produced no portable triangle geometry.`);
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
      purpose: "Tree-domain Shape recipe adapted for PrehistoricRush.",
      speciesId: recipe.speciesId,
      sourceRecipeId: recipe.id
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
    nearPixels: 360,
    mediumPixels: 150,
    mediumMaximumPixels: 410,
    farPixels: 18,
    farMaximumPixels: 175,
    horizonPixels: 26,
    transitionDuration: 0.35,
    hysteresis: 0.16,
    stableFrames: 2,
    capturePadding: 0.05,
    frameSize: 256,
    horizonFrameSize: 128,
    azimuthCount: 8,
    elevations: [0, 12],
    observations: ["color", "opacity"],
    metadata: { product: "prehistoric-rush", archetypeId: archetype.id }
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
            shape: {
              sourceShapeId,
              profileId: TREE_SHAPE_PROFILE_ID,
              targetId: form.id,
              providerId: TREE_SHAPE_PROVIDER_ID
            },
            treeStructureId: tree.id
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
            packageVersion: TREE_FIDELITY_PACKAGE_VERSION
          }
        }
      };
    }),
    metadata: {
      ...(profile.metadata ?? {}),
      stableSelectionFrames: 2,
      treeStructureId: tree.id,
      foliageDescriptorId: `${archetype.id}:foliage`
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
      padding: 0.05
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

function portablePackageFromFidelity(NexusEngine, engine, archetype, object, build, packageValue) {
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
  const generationInput = {
    objectId: object.id,
    objectContentHash: object.contentHash,
    vegetationSpeciesHash: species?.contentHash ?? null,
    treeStructureId: tree?.id ?? null,
    foliageDescriptorId: foliage?.id ?? null,
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
  return {
    schema: "prehistoric-rush.tree-fidelity-package/4",
    version: TREE_FIDELITY_PACKAGE_VERSION,
    archetypeId: archetype.id,
    generation: { id: generationId, ...generationInput },
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
        kind: "mesh",
        minimumProjectedSize: profile.forms.find((entry) => entry.id === "near").minimumProjectedSize,
        geometry: meshGeometryForForm(engine, nearForm),
        formId: nearForm.id,
        contentHash: nearForm.contentHash
      },
      medium: {
        kind: "mesh",
        minimumProjectedSize: profile.forms.find((entry) => entry.id === "medium").minimumProjectedSize,
        maximumProjectedSize: profile.forms.find((entry) => entry.id === "medium").maximumProjectedSize,
        geometry: meshGeometryForForm(engine, mediumForm),
        formId: mediumForm.id,
        contentHash: mediumForm.contentHash
      },
      far: {
        kind: "multi-angle-impostor",
        minimumProjectedSize: profile.forms.find((entry) => entry.id === "far").minimumProjectedSize,
        maximumProjectedSize: profile.forms.find((entry) => entry.id === "far").maximumProjectedSize,
        atlas: sharedAtlas,
        frames: farFrames,
        formId: farForm.id,
        contentHash: farForm.contentHash
      },
      horizon: {
        kind: "horizon-impostor",
        minimumProjectedSize: profile.forms.find((entry) => entry.id === "horizon").minimumProjectedSize,
        maximumProjectedSize: profile.forms.find((entry) => entry.id === "horizon").maximumProjectedSize,
        atlas: sharedAtlas,
        frames: farFrames,
        formId: horizonForm.id,
        contentHash: horizonForm.contentHash
      }
    },
    change: { ...profile.change, stableSelectionFrames: 2 },
    material: {
      vertexColors: true,
      roughness: 0.82,
      metalness: 0,
      barkColor: archetype.barkColor,
      foliageColor: archetype.foliageColor,
      accentColor: archetype.accentColor,
      barkTexture: archetype.barkTexture,
      foliageTexture: archetype.foliageTexture
    },
    ecology: species?.ecology ?? archetype.ecology,
    spawn: {
      averageHeight: archetype.averageHeight,
      distributionWeight: species?.ecology?.distributionWeight ?? archetype.distributionWeight
    }
  };
}

async function buildTree(NexusEngine, THREE, engine, subjects, archetype, context) {
  const objectId = objectIdFor(archetype);
  const sourceShapeId = sourceShapeIdFor(archetype);
  const treeStructure = engine.n.vegetationTree.get(`${archetype.id}:tree-structure`);
  if (!treeStructure) throw new RangeError(`Missing Tree-domain structure for ${archetype.id}.`);
  const treeObject = createPrehistoricTreeObject(THREE, archetype);
  const portableGeometry = portableGeometryFromObject(THREE, treeObject);
  const metrics = NexusEngine.computeShapeMetrics(portableGeometry);
  subjects.set(objectId, treeObject);

  try {
    context.updateProgress(0.08, 1, `Registering ${archetype.label}`);
    const shapeRecipe = engine.n.vegetationTree.createShapeRecipe(treeStructure, {
      id: TREE_SHAPE_PROFILE_ID,
      mediumRatio: 0.32,
      metadata: { product: "prehistoric-rush" }
    });
    engine.n.objectShape.registerProfile(objectShapeProfileFromTreeRecipe(shapeRecipe));
    const object = engine.n.coreObject.register({
      id: objectId,
      objectType: "tree-archetype",
      bounds: { min: metrics.bounds.min, max: metrics.bounds.max },
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
        archetypeId: archetype.id,
        label: archetype.label,
        shape: archetype.shape,
        packageVersion: TREE_FIDELITY_PACKAGE_VERSION
      }
    });
    engine.n.objectShape.registerSource({
      id: sourceShapeId,
      objectId: object.id,
      objectContentHash: object.contentHash,
      kind: "triangle-mesh",
      geometry: portableGeometry,
      metadata: { speciesId: archetype.id, archetypeId: archetype.id, shape: archetype.shape }
    });
    engine.n.objectFidelity.registerProfile(objectFidelityProfileFromTree(engine, archetype, sourceShapeId));
    context.updateProgress(0.16, 1, `Deriving ${archetype.label} mesh LODs`);
    const build = await engine.n.objectFidelity.requestBuild({
      objectId: object.id,
      profileId: fidelityProfileIdFor(archetype),
      quality: "high"
    });
    if (build.state !== "ready") throw new Error(`Object Fidelity build ${build.id} finished in state ${build.state}.`);
    context.updateProgress(0.96, 1, `Committing ${archetype.label} fidelity package`);
    const packageValue = engine.n.objectFidelity.getActivePackage(object.id);
    if (!packageValue?.readiness?.complete) throw new Error(`Object Fidelity package for ${archetype.id} is incomplete.`);
    return portablePackageFromFidelity(NexusEngine, engine, archetype, object, build, packageValue);
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
    version: "4.0.0",
    metadata: {
      purpose: "Build PrehistoricRush tree assets through Object Vegetation, Tree, Foliage, Object Shape, Capture, and Object Fidelity.",
      domains: [
        "n:object",
        "n:object:vegetation",
        "n:object:vegetation:tree",
        "n:object:vegetation:foliage",
        "n:object:shape",
        "n:capture",
        "n:object:fidelity"
      ]
    },
    async load(asset, context) {
      if (asset.metadata.kind === "manifest") {
        return {
          portable: {
            schema: "prehistoric-rush.tree-fidelity-manifest/4",
            revision: asset.version,
            bundleId: runtime.bundleId,
            vegetationDomain: "n:object:vegetation",
            archetypes: PREHISTORIC_TREE_ARCHETYPES.map((tree) => ({
              id: tree.id,
              label: tree.label,
              averageHeight: tree.averageHeight,
              shape: tree.shape
            }))
          },
          metadata: {
            kind: "manifest",
            packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
            speciesCount: runtime.vegetationCatalog.species.length
          }
        };
      }
      const archetype = PREHISTORIC_TREE_ARCHETYPES.find((tree) => tree.id === asset.metadata.archetypeId);
      if (!archetype) throw new RangeError(`Unknown tree archetype: ${asset.metadata.archetypeId}`);
      const portable = await buildTree(NexusEngine, THREE, engine, subjects, archetype, context);
      context.updateProgress(1, 1, `${archetype.label} ready`);
      return {
        portable,
        metadata: {
          archetypeId: archetype.id,
          speciesId: archetype.id,
          generationId: portable.generation.id,
          fidelityPackageId: portable.generation.fidelityPackageId,
          packageVersion: TREE_FIDELITY_PACKAGE_VERSION
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
