import {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES,
  TREE_FIDELITY_PACKAGE_VERSION,
  createPrehistoricTreeObject
} from "./tree-archetype-catalog.js";

export {
  PREHISTORIC_TREE_ARCHETYPES,
  PREHISTORIC_TREE_TYPES,
  TREE_FIDELITY_PACKAGE_VERSION,
  createPrehistoricTreeObject
} from "./tree-archetype-catalog.js";

export const TREE_FIDELITY_BUNDLE_ID = "prehistoric-tree-fidelity";
export const TREE_FIDELITY_MANIFEST_ASSET_ID = "prehistoric-tree-fidelity-manifest";
export const TREE_FIDELITY_PROVIDER_ID = "prehistoric-tree-fidelity-provider";

const TREE_SHAPE_PROVIDER_ID = "prehistoric-tree-shape-provider";
const TREE_CAPTURE_PROVIDER_ID = "prehistoric-tree-capture-provider";
const TREE_SHAPE_PROFILE_ID = "prehistoric-tree-shape-profile";

function assetIdFor(archetype) {
  return `prehistoric-tree-fidelity:${archetype.id}`;
}

function objectIdFor(archetype) {
  return `prehistoric-tree-object:${archetype.id}`;
}

function sourceShapeIdFor(archetype) {
  return `prehistoric-tree-source-shape:${archetype.id}`;
}

function fidelityProfileIdFor(archetype) {
  return `prehistoric-tree-fidelity-profile:${archetype.id}`;
}

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
      if (colorAttribute) {
        colors.push(colorAttribute.getX(index), colorAttribute.getY(index), colorAttribute.getZ(index));
      } else {
        colors.push(fallbackColor.r, fallbackColor.g, fallbackColor.b);
      }
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

function treeShapeProfile() {
  return {
    id: TREE_SHAPE_PROFILE_ID,
    version: Number(TREE_FIDELITY_PACKAGE_VERSION),
    preserve: {
      silhouette: true,
      borders: true,
      materialBoundaries: true,
      normals: true,
      vertexColors: true
    },
    targets: [
      { id: "near", ratio: 1, mode: "source", maximumDeviation: 0 },
      { id: "medium", ratio: 0.32, mode: "simplify", maximumDeviation: 0.032, preserve: { borders: true, vertexColors: true } }
    ],
    metadata: { purpose: "PrehistoricRush tree near and medium geometry." }
  };
}

function captureDescriptor(archetype, kind) {
  const horizon = kind === "horizon";
  return {
    providerId: TREE_CAPTURE_PROVIDER_ID,
    viewSet: {
      pattern: "around-subject",
      azimuthCount: horizon ? 1 : 8,
      elevations: horizon ? [6] : [0, 12]
    },
    framing: { boundsSource: "core-object", preserveGrounding: true, padding: 0.05 },
    observations: ["color", "opacity"],
    output: { kind: "atlas", frameSize: horizon ? 128 : 256 },
    metadata: {
      archetypeId: archetype.id,
      form: kind,
      packageVersion: TREE_FIDELITY_PACKAGE_VERSION
    }
  };
}

function treeFidelityProfile(archetype, sourceShapeId) {
  const shapeMetadata = (targetId) => ({
    shape: {
      sourceShapeId,
      profileId: TREE_SHAPE_PROFILE_ID,
      targetId,
      providerId: TREE_SHAPE_PROVIDER_ID
    }
  });
  return {
    id: fidelityProfileIdFor(archetype),
    version: Number(TREE_FIDELITY_PACKAGE_VERSION),
    identity: {
      preserveSilhouette: true,
      preserveGrounding: true,
      preserveMajorStructure: true,
      preserveMaterialResponse: true
    },
    forms: [
      {
        id: "near",
        fidelity: "near-mesh",
        builderId: "object-shape-form",
        required: true,
        order: 0,
        minimumProjectedSize: 360,
        qualities: ["high"],
        requiredTraits: ["geometry", "vertex-color"],
        metadata: shapeMetadata("near")
      },
      {
        id: "medium",
        fidelity: "medium-mesh",
        builderId: "object-shape-form",
        required: true,
        order: 1,
        minimumProjectedSize: 150,
        maximumProjectedSize: 410,
        qualities: ["high"],
        requiredTraits: ["geometry", "vertex-color"],
        metadata: shapeMetadata("medium")
      },
      {
        id: "far",
        fidelity: "multi-angle-impostor",
        builderId: "captured-form",
        required: true,
        order: 2,
        minimumProjectedSize: 18,
        maximumProjectedSize: 175,
        qualities: ["high"],
        requiredTraits: ["color", "opacity"],
        capture: captureDescriptor(archetype, "far")
      },
      {
        id: "horizon",
        fidelity: "horizon-impostor",
        builderId: "captured-form",
        required: true,
        order: 3,
        minimumProjectedSize: 0,
        maximumProjectedSize: 26,
        qualities: ["high"],
        requiredTraits: ["color", "opacity"],
        capture: captureDescriptor(archetype, "horizon")
      }
    ],
    change: { mode: "dither-crossfade", duration: 0.35, hysteresis: 0.16 },
    metadata: {
      archetypeId: archetype.id,
      packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
      stableSelectionFrames: 2
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
  const generationInput = {
    objectId: object.id,
    objectContentHash: object.contentHash,
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
    ecology: archetype.ecology,
    spawn: {
      averageHeight: archetype.averageHeight,
      distributionWeight: archetype.distributionWeight
    }
  };
}

async function registerAndBuildTree(NexusEngine, THREE, engine, subjects, archetype, context) {
  const objectId = objectIdFor(archetype);
  const sourceShapeId = sourceShapeIdFor(archetype);
  const treeObject = createPrehistoricTreeObject(THREE, archetype);
  const portableGeometry = portableGeometryFromObject(THREE, treeObject);
  const metrics = NexusEngine.computeShapeMetrics(portableGeometry);
  subjects.set(objectId, treeObject);

  try {
    context.updateProgress(0.08, 1, `Registering ${archetype.label}`);
    engine.n.objectShape.registerProfile(treeShapeProfile());
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
      metadata: { archetypeId: archetype.id, shape: archetype.shape }
    });
    engine.n.objectFidelity.registerProfile(treeFidelityProfile(archetype, sourceShapeId));
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

export function createPrehistoricTreeFidelityAssetProvider(NexusEngine, THREE, engine, options = {}) {
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
    version: "3.0.0",
    metadata: {
      purpose: "Coordinate Core Object, Object Shape, Core Capture, and Object Fidelity into portable PrehistoricRush tree packages.",
      domains: ["n:core-object", "n:object:shape", "n:capture", "n:object:fidelity"]
    },
    async load(asset, context) {
      if (asset.metadata.kind === "manifest") {
        return {
          portable: {
            schema: "prehistoric-rush.tree-fidelity-manifest/4",
            revision: asset.version,
            bundleId: TREE_FIDELITY_BUNDLE_ID,
            archetypes: PREHISTORIC_TREE_ARCHETYPES.map((tree) => ({
              id: tree.id,
              label: tree.label,
              assetId: assetIdFor(tree),
              averageHeight: tree.averageHeight,
              shape: tree.shape
            }))
          },
          metadata: { kind: "manifest", packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
        };
      }
      const archetype = PREHISTORIC_TREE_ARCHETYPES.find((tree) => tree.id === asset.metadata.archetypeId);
      if (!archetype) throw new RangeError(`Unknown tree archetype: ${asset.metadata.archetypeId}`);
      const portable = await registerAndBuildTree(NexusEngine, THREE, engine, subjects, archetype, context);
      context.updateProgress(1, 1, `${archetype.label} ready`);
      return {
        portable,
        metadata: {
          archetypeId: archetype.id,
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

export function installPrehistoricTreeFidelityAssets(NexusEngine, THREE, engine, options = {}) {
  const assets = engine.n?.coreAssets ?? engine.coreAssets;
  if (!assets) throw new Error("Prehistoric tree fidelity assets require Core Assets.");
  if (options.cache !== false && typeof NexusEngine.createBrowserIndexedDbAssetCacheAdapter === "function" && globalThis.indexedDB) {
    assets.setCacheProvider(NexusEngine.createBrowserIndexedDbAssetCacheAdapter({
      databaseName: options.databaseName ?? "prehistoric-rush-assets",
      storeName: "tree-fidelity",
      version: Number(TREE_FIDELITY_PACKAGE_VERSION)
    }));
  }
  assets.registerProvider(createPrehistoricTreeFidelityAssetProvider(NexusEngine, THREE, engine, options));
  const packageIds = [];
  for (const archetype of PREHISTORIC_TREE_ARCHETYPES) {
    const id = assetIdFor(archetype);
    packageIds.push(id);
    assets.registerAsset({
      id,
      type: "tree-fidelity-package",
      version: TREE_FIDELITY_PACKAGE_VERSION,
      providerId: TREE_FIDELITY_PROVIDER_ID,
      metadata: {
        kind: "package",
        archetypeId: archetype.id,
        shape: archetype.shape,
        packageVersion: TREE_FIDELITY_PACKAGE_VERSION
      }
    });
  }
  assets.registerAsset({
    id: TREE_FIDELITY_MANIFEST_ASSET_ID,
    type: "tree-fidelity-manifest",
    version: TREE_FIDELITY_PACKAGE_VERSION,
    providerId: TREE_FIDELITY_PROVIDER_ID,
    dependencies: packageIds,
    metadata: { kind: "manifest", packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
  });
  assets.registerBundle({
    id: TREE_FIDELITY_BUNDLE_ID,
    version: TREE_FIDELITY_PACKAGE_VERSION,
    assets: [TREE_FIDELITY_MANIFEST_ASSET_ID],
    metadata: {
      purpose: "PrehistoricRush Object Shape, Capture, and Fidelity tree package.",
      packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
      archetypeCount: PREHISTORIC_TREE_ARCHETYPES.length
    }
  });
  return { assets, bundleId: TREE_FIDELITY_BUNDLE_ID, manifestAssetId: TREE_FIDELITY_MANIFEST_ASSET_ID, packageIds };
}

export async function createPrehistoricTreeFidelityAssetRuntime(NexusEngine, THREE, options = {}) {
  const kits = [
    NexusEngine.createCoreAssetsKit(),
    NexusEngine.createCoreObjectKit(),
    NexusEngine.createCoreObjectShapeKit(),
    NexusEngine.createCoreCaptureKit(),
    NexusEngine.createCoreObjectFidelityKit()
  ];
  if (options.startup === true) kits.push(NexusEngine.createCoreStartupKit());
  const engine = NexusEngine.createEngine({ kits });
  engine.n.objectShape.registerProvider(NexusEngine.createReferenceObjectShapeProvider({ id: TREE_SHAPE_PROVIDER_ID }));
  engine.installKit(NexusEngine.createObjectShapeFidelityAdapterKit({ builderId: "object-shape-form" }));
  const registration = installPrehistoricTreeFidelityAssets(NexusEngine, THREE, engine, options);
  return {
    engine,
    startup: engine.n?.coreStartup ?? null,
    object: engine.n.coreObject,
    shape: engine.n.objectShape,
    capture: engine.n.coreCapture,
    fidelity: engine.n.objectFidelity,
    ...registration
  };
}
