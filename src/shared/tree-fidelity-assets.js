export const TREE_FIDELITY_BUNDLE_ID = "prehistoric-tree-fidelity";
export const TREE_FIDELITY_MANIFEST_ASSET_ID = "prehistoric-tree-fidelity-manifest";
export const TREE_FIDELITY_PROVIDER_ID = "prehistoric-tree-fidelity-provider";
export const TREE_FIDELITY_PACKAGE_VERSION = "2";

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

function createTreeObject(THREE, archetype) {
  const group = new THREE.Group();
  group.name = archetype.id;
  const height = (archetype.minHeight + archetype.maxHeight) * 0.5;
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(archetype.trunkRadius * 0.68, archetype.trunkRadius, height, 10, 3),
    new THREE.MeshStandardMaterial({ color: archetype.trunkColor, roughness: 0.86, metalness: 0 })
  );
  trunk.position.y = height * 0.5;
  const crownMaterial = new THREE.MeshStandardMaterial({ color: archetype.crownColor, roughness: 0.78, metalness: 0 });
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(archetype.crownRadius, 2), crownMaterial);
  crown.scale.set(1, Math.max(0.5, archetype.crownHeight / archetype.crownRadius), 1);
  crown.position.y = height - archetype.crownHeight * 0.35;
  const crownTop = new THREE.Mesh(new THREE.IcosahedronGeometry(archetype.crownRadius * 0.62, 1), crownMaterial);
  crownTop.scale.set(0.85, 0.7, 0.85);
  crownTop.position.set(archetype.crownRadius * 0.18, height + archetype.crownHeight * 0.18, -archetype.crownRadius * 0.08);
  group.add(trunk, crown, crownTop);
  return group;
}

function disposeTree(object) {
  object.traverse?.((child) => {
    child.geometry?.dispose?.();
    const materials = Array.isArray(child.material) ? child.material : child.material ? [child.material] : [];
    for (const material of materials) material.dispose?.();
  });
}

function createPortablePackage(archetype, capture) {
  const averageHeight = (archetype.minHeight + archetype.maxHeight) * 0.5;
  return {
    schema: "prehistoric-rush.tree-fidelity-package/2",
    version: TREE_FIDELITY_PACKAGE_VERSION,
    archetypeId: archetype.id,
    source: {
      bounds: { width: archetype.crownRadius * 2, height: averageHeight + archetype.crownHeight, depth: archetype.crownRadius * 2 },
      pivot: [0, 0, 0],
      collision: { radius: archetype.trunkRadius, height: averageHeight }
    },
    forms: {
      near: {
        kind: "mesh-recipe",
        minimumProjectedSize: 360,
        trunk: { radialSegments: 10, heightSegments: 3, taper: 0.68 },
        crowns: [{ detail: 2, scale: [1, archetype.crownHeight / archetype.crownRadius, 1] }, { detail: 1, scale: [0.53, 0.43, 0.53] }]
      },
      medium: {
        kind: "mesh-recipe",
        minimumProjectedSize: 150,
        maximumProjectedSize: 390,
        trunk: { radialSegments: 6, heightSegments: 1, taper: 0.7 },
        crowns: [{ detail: 1, scale: [1, archetype.crownHeight / archetype.crownRadius, 1] }]
      },
      far: {
        kind: "multi-angle-impostor",
        minimumProjectedSize: 18,
        maximumProjectedSize: 170,
        atlas: capture.observations.color,
        frames: capture.frames,
        crossedCards: 2
      },
      horizon: {
        kind: "impostor",
        minimumProjectedSize: 0,
        maximumProjectedSize: 24,
        atlas: capture.observations.color,
        frames: capture.frames.slice(0, 1),
        crossedCards: 1
      }
    },
    change: { mode: "dither-crossfade", duration: 0.22, hysteresis: 0.12 },
    material: {
      trunk: { color: archetype.trunkColor, roughness: 0.86, metalness: 0 },
      crown: { color: archetype.crownColor, roughness: 0.78, metalness: 0 }
    }
  };
}

export function createPrehistoricTreeFidelityAssetProvider(NexusEngine, THREE, options = {}) {
  if (typeof NexusEngine?.createThreeObjectCaptureProvider !== "function") {
    throw new TypeError("Pinned NexusEngine is missing createThreeObjectCaptureProvider().");
  }
  const canvas = options.canvas ?? document.createElement("canvas");
  const renderer = options.renderer ?? new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(1);
  const subjects = new Map();
  const capture = NexusEngine.createThreeObjectCaptureProvider({
    THREE,
    renderer,
    resolveSubject(subject) {
      const object = subjects.get(subject.objectId);
      if (!object) throw new RangeError(`Unknown tree capture subject: ${subject.objectId}`);
      return object;
    }
  });

  return {
    id: TREE_FIDELITY_PROVIDER_ID,
    version: "1.1.0",
    metadata: { purpose: "Prepare portable PrehistoricRush tree mesh recipes and captured impostor atlases." },
    async load(asset, context) {
      if (asset.metadata.kind === "manifest") {
        return {
          portable: {
            schema: "prehistoric-rush.tree-fidelity-manifest/2",
            revision: asset.version,
            bundleId: TREE_FIDELITY_BUNDLE_ID,
            archetypes: PREHISTORIC_TREE_ARCHETYPES.map((tree) => ({ id: tree.id, assetId: assetIdFor(tree) }))
          },
          metadata: { kind: "manifest", packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
        };
      }
      const archetype = PREHISTORIC_TREE_ARCHETYPES.find((tree) => tree.id === asset.metadata.archetypeId);
      if (!archetype) throw new RangeError(`Unknown tree archetype: ${asset.metadata.archetypeId}`);
      context.updateProgress(0.05, 1, `Building ${archetype.id}`);
      const object = createTreeObject(THREE, archetype);
      subjects.set(archetype.id, object);
      try {
        const captureResult = await capture.capture({
          id: `capture:${archetype.id}:v${TREE_FIDELITY_PACKAGE_VERSION}`,
          subject: { objectId: archetype.id },
          viewSet: { pattern: "around-subject", azimuthCount: 8, elevations: [0, 12] },
          framing: { boundsSource: "three-object", preserveGrounding: true, padding: 0.08 },
          observations: ["color", "opacity"],
          output: { kind: "atlas", frameSize: 256 },
          metadata: { archetypeId: archetype.id, packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
        }, {
          jobId: context.jobId,
          isCancelled: context.isCancelled,
          updateProgress(completed, total, detail) {
            context.updateProgress(0.05 + (completed / Math.max(1, total)) * 0.9, 1, detail);
          }
        });
        context.updateProgress(1, 1, `${archetype.id} ready`);
        return {
          portable: createPortablePackage(archetype, captureResult),
          metadata: { archetypeId: archetype.id, capturedFrames: captureResult.frames.length, packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
        };
      } finally {
        subjects.delete(archetype.id);
        disposeTree(object);
      }
    },
    dispose() {
      capture.dispose?.();
      if (!options.renderer) renderer.dispose();
      subjects.clear();
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
  assets.registerProvider(createPrehistoricTreeFidelityAssetProvider(NexusEngine, THREE, options));
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
    metadata: { purpose: "PrehistoricRush tree mesh LOD and impostor fidelity package.", packageVersion: TREE_FIDELITY_PACKAGE_VERSION }
  });
  return { assets, bundleId: TREE_FIDELITY_BUNDLE_ID, manifestAssetId: TREE_FIDELITY_MANIFEST_ASSET_ID, packageIds };
}

export async function createPrehistoricTreeFidelityAssetRuntime(NexusEngine, THREE, options = {}) {
  const kits = [NexusEngine.createCoreAssetsKit()];
  if (options.startup === true) kits.push(NexusEngine.createCoreStartupKit());
  const engine = NexusEngine.createEngine({ kits });
  const registration = installPrehistoricTreeFidelityAssets(NexusEngine, THREE, engine, options);
  return { engine, startup: engine.n?.coreStartup ?? null, ...registration };
}
