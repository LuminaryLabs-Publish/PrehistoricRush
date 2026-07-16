export const TREE_FIDELITY_BUNDLE_ID = "prehistoric-tree-fidelity";
export const TREE_FIDELITY_MANIFEST_ASSET_ID = "prehistoric-tree-fidelity-manifest";
export const TREE_FIDELITY_PROVIDER_ID = "prehistoric-tree-fidelity-provider";
export const TREE_FIDELITY_PACKAGE_VERSION = "3";

const TREE_SHAPE_PROVIDER_ID = "prehistoric-tree-shape-provider";
const TREE_CAPTURE_PROVIDER_ID = "prehistoric-tree-capture-provider";
const TREE_SHAPE_PROFILE_ID = "prehistoric-tree-shape-profile";

export const PREHISTORIC_TREE_ARCHETYPES = Object.freeze([
  Object.freeze({ id: "giant-fern-tree", minHeight: 34, maxHeight: 58, trunkRadius: 2.5, crownHeight: 10.5, crownRadius: 18, crownColor: 0x365f35, trunkColor: 0x6b432b }),
  Object.freeze({ id: "tower-conifer", minHeight: 38, maxHeight: 68, trunkRadius: 1.8, crownHeight: 7.5, crownRadius: 26, crownColor: 0x345c4a, trunkColor: 0x744236 }),
  Object.freeze({ id: "understory-cycad", minHeight: 14, maxHeight: 24, trunkRadius: 1.25, crownHeight: 7.2, crownRadius: 5, crownColor: 0x72aa54, trunkColor: 0x51513a }),
  Object.freeze({ id: "broad-canopy", minHeight: 28, maxHeight: 48, trunkRadius: 2.1, crownHeight: 9.2, crownRadius: 15, crownColor: 0x478b49, trunkColor: 0x6b432b }),
  Object.freeze({ id: "moss-column", minHeight: 30, maxHeight: 52, trunkRadius: 2.35, crownHeight: 3.5, crownRadius: 9, crownColor: 0x5e984a, trunkColor: 0x51513a })
]);

export const PREHISTORIC_TREE_TYPES = Object.freeze(PREHISTORIC_TREE_ARCHETYPES.map((tree) => Object.freeze([
  tree.minHeight,
  tree.maxHeight,
  tree.trunkRadius,
  tree.crownHeight,
  tree.crownRadius,
  tree.crownColor
])));

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

function createTreeObject(THREE, archetype) {
  const group = new THREE.Group();
  group.name = archetype.id;
  const height = (archetype.minHeight + archetype.maxHeight) * 0.5;
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(archetype.trunkRadius * 0.68, archetype.trunkRadius, height, 10, 3),
    new THREE.MeshStandardMaterial({ color: archetype.trunkColor, roughness: 0.86, metalness: 0 })
  );
  trunk.name = `${archetype.id}:trunk`;
  trunk.position.y = height * 0.5;
  const crownMaterial = new THREE.MeshStandardMaterial({ color: archetype.crownColor, roughness: 0.78, metalness: 0 });
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(archetype.crownRadius, 2), crownMaterial);
  crown.name = `${archetype.id}:crown`;
  crown.scale.set(1, Math.max(0.5, archetype.crownHeight / archetype.crownRadius), 1);
  crown.position.y = height - archetype.crownHeight * 0.35;
  const crownTop = new THREE.Mesh(new THREE.IcosahedronGeometry(archetype.crownRadius * 0.62, 1), crownMaterial);
  crownTop.name = `${archetype.id}:crown-top`;
  crownTop.scale.set(0.85, 0.7, 0.85);
  crownTop.position.set(archetype.crownRadius * 0.18, height + archetype.crownHeight * 0.18, -archetype.crownRadius * 0.08);
  group.add(trunk, crown, crownTop);
  return group;
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
    const baseVertex = positions.length / 3;
    normalMatrix.getNormalMatrix(mesh.matrixWorld);
    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    const color = material?.color ?? new THREE.Color(0xffffff);

    for (let index = 0; index < position.count; index += 1) {
      vertex.fromBufferAttribute(position, index).applyMatrix4(mesh.matrixWorld);
      positions.push(vertex.x, vertex.y, vertex.z);
      if (normalAttribute) {
        normal.fromBufferAttribute(normalAttribute, index).applyMatrix3(normalMatrix).normalize();
        normals.push(normal.x, normal.y, normal.z);
      } else {
        normals.push(0, 1, 0);
      }
      colors.push(color.r, color.g, color.b);
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
      { id: "medium", ratio: 0.34, mode: "simplify", maximumDeviation: 0.035, preserve: { borders: true, vertexColors: true } }
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
    framing: { boundsSource: "core-object", preserveGrounding: true, padding: 0.08 },
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
        maximumProjectedSize: 390,
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
        maximumProjectedSize: 170,
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
        maximumProjectedSize: 24,
        qualities: ["high"],
        requiredTraits: ["color", "opacity"],
        capture: captureDescriptor(archetype, "horizon")
      }
    ],
    change: { mode: "dither-crossfade", duration: 0.22, hysteresis: 0.12 },
    metadata: { archetypeId: archetype.id, packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
  };
}

function enrichedAtlas(result) {
  const color = result?.observations?.color;
  if (!color) throw new Error("Tree capture result is missing color observation.");
  return {
    ...color,
    metadata: {
      ...(color.metadata ?? {}),
      ...(result.metadata?.atlas ?? {})
    }
  };
}

function meshGeometryForForm(NexusEngine, engine, form) {
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
  const horizonCapture = captureResultForForm(engine, horizonForm);
  const generationInput = {
    objectId: object.id,
    objectContentHash: object.contentHash,
    shapeProfileId: TREE_SHAPE_PROFILE_ID,
    fidelityProfileId: packageValue.profileId,
    fidelityPackageId: packageValue.id,
    fidelityPackageHash: packageValue.contentHash,
    buildId: build.id,
    packageVersion: TREE_FIDELITY_PACKAGE_VERSION,
    forms: {
      near: nearForm.contentHash,
      medium: mediumForm.contentHash,
      far: farForm.contentHash,
      horizon: horizonForm.contentHash
    }
  };
  const generationId = `tree-fidelity:${NexusEngine.hashFidelityValue(generationInput)}`;
  const sourceBounds = object.bounds;
  return {
    schema: "prehistoric-rush.tree-fidelity-package/3",
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
      collision: { radius: archetype.trunkRadius, height: (archetype.minHeight + archetype.maxHeight) * 0.5 }
    },
    forms: {
      near: {
        kind: "mesh",
        minimumProjectedSize: profile.forms.find((entry) => entry.id === "near").minimumProjectedSize,
        geometry: meshGeometryForForm(NexusEngine, engine, nearForm),
        formId: nearForm.id,
        contentHash: nearForm.contentHash
      },
      medium: {
        kind: "mesh",
        minimumProjectedSize: profile.forms.find((entry) => entry.id === "medium").minimumProjectedSize,
        maximumProjectedSize: profile.forms.find((entry) => entry.id === "medium").maximumProjectedSize,
        geometry: meshGeometryForForm(NexusEngine, engine, mediumForm),
        formId: mediumForm.id,
        contentHash: mediumForm.contentHash
      },
      far: {
        kind: "multi-angle-impostor",
        minimumProjectedSize: profile.forms.find((entry) => entry.id === "far").minimumProjectedSize,
        maximumProjectedSize: profile.forms.find((entry) => entry.id === "far").maximumProjectedSize,
        atlas: enrichedAtlas(farCapture),
        frames: farCapture.frames,
        formId: farForm.id,
        contentHash: farForm.contentHash
      },
      horizon: {
        kind: "horizon-impostor",
        minimumProjectedSize: profile.forms.find((entry) => entry.id === "horizon").minimumProjectedSize,
        maximumProjectedSize: profile.forms.find((entry) => entry.id === "horizon").maximumProjectedSize,
        atlas: enrichedAtlas(horizonCapture),
        frames: horizonCapture.frames,
        formId: horizonForm.id,
        contentHash: horizonForm.contentHash
      }
    },
    change: profile.change,
    material: {
      vertexColors: true,
      roughness: 0.82,
      metalness: 0
    }
  };
}

async function registerAndBuildTree(NexusEngine, THREE, engine, subjects, archetype, context) {
  const objectId = objectIdFor(archetype);
  const sourceShapeId = sourceShapeIdFor(archetype);
  const treeObject = createTreeObject(THREE, archetype);
  const portableGeometry = portableGeometryFromObject(THREE, treeObject);
  const metrics = NexusEngine.computeShapeMetrics(portableGeometry);
  subjects.set(objectId, treeObject);

  try {
    context.updateProgress(0.08, 1, `Registering ${archetype.id}`);
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
      metadata: { archetypeId: archetype.id, packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
    });
    engine.n.objectShape.registerSource({
      id: sourceShapeId,
      objectId: object.id,
      objectContentHash: object.contentHash,
      kind: "triangle-mesh",
      geometry: portableGeometry,
      metadata: { archetypeId: archetype.id }
    });
    engine.n.objectFidelity.registerProfile(treeFidelityProfile(archetype, sourceShapeId));
    context.updateProgress(0.16, 1, `Deriving ${archetype.id} mesh LODs`);
    const build = await engine.n.objectFidelity.requestBuild({
      objectId: object.id,
      profileId: fidelityProfileIdFor(archetype),
      quality: "high"
    });
    if (build.state !== "ready") throw new Error(`Object Fidelity build ${build.id} finished in state ${build.state}.`);
    context.updateProgress(0.96, 1, `Committing ${archetype.id} fidelity package`);
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
    version: "2.0.0",
    metadata: {
      purpose: "Coordinate Core Object, Object Shape, Core Capture, and Object Fidelity into portable PrehistoricRush tree packages.",
      domains: ["n:core-object", "n:object:shape", "n:capture", "n:object:fidelity"]
    },
    async load(asset, context) {
      if (asset.metadata.kind === "manifest") {
        return {
          portable: {
            schema: "prehistoric-rush.tree-fidelity-manifest/3",
            revision: asset.version,
            bundleId: TREE_FIDELITY_BUNDLE_ID,
            archetypes: PREHISTORIC_TREE_ARCHETYPES.map((tree) => ({ id: tree.id, assetId: assetIdFor(tree) }))
          },
          metadata: { kind: "manifest", packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
        };
      }
      const archetype = PREHISTORIC_TREE_ARCHETYPES.find((tree) => tree.id === asset.metadata.archetypeId);
      if (!archetype) throw new RangeError(`Unknown tree archetype: ${asset.metadata.archetypeId}`);
      const portable = await registerAndBuildTree(NexusEngine, THREE, engine, subjects, archetype, context);
      context.updateProgress(1, 1, `${archetype.id} ready`);
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
      version: 1
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
      metadata: { kind: "package", archetypeId: archetype.id, packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
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
      packageVersion: TREE_FIDELITY_PACKAGE_VERSION
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
