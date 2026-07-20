import { createThreePatchStreamAdapter as createBasePatchStreamAdapter } from "./three-patch-stream-adapter.js";
import { applyLushJungleAtmosphere } from "./lush-jungle-atmosphere.js";
import { createPrehistoricFoliageAtlas } from "./prehistoric-foliage-atlas.js";
import { createThreeGroundCoverLayer } from "./three-ground-cover-layer.js";
import { createThreeLushFoliageLayer } from "./three-lush-foliage-layer.js";
import { createThreeProductionGroundLayer } from "./three-production-ground-layer.js";
import { createThreeTerrainLodLayer } from "./three-terrain-lod-layer.js";
import { createThreeTreeFidelityLayer } from "./three-tree-fidelity-layer.js";

function hideLegacyTerrain(scene, expectedVertexCount) {
  let hidden = 0;
  scene.traverse((object) => {
    if (!object?.isMesh || object.isInstancedMesh || object.isSkinnedMesh) return;
    if (object.userData?.terrainLodAuthoritative) return;
    const geometry = object.geometry;
    if (!geometry?.getAttribute) return;
    const position = geometry.getAttribute("position");
    const color = geometry.getAttribute("color");
    if (position?.count !== expectedVertexCount || color?.count !== expectedVertexCount) return;
    object.visible = false;
    object.userData.legacyTerrainSuppressed = true;
    hidden += 1;
  });
  return hidden;
}

export function createThreePatchStreamLodAdapter(THREE, options = {}) {
  const {
    terrainLodPolicy,
    selectTerrainLodLevel,
    stream,
    config,
    treeTypes = [],
    treeFidelityPackages = [],
    treeBatchCapacity = 256,
    foliageCardCapacity = 8192,
    groundCoverCapacity = 2400,
    visualPrefetchCapacity = 12
  } = options;
  if (!terrainLodPolicy) throw new TypeError("Three patch stream LOD adapter requires terrainLodPolicy.");
  if (!Number.isInteger(visualPrefetchCapacity) || visualPrefetchCapacity < 0) {
    throw new TypeError("Three patch stream LOD adapter visualPrefetchCapacity must be a non-negative integer.");
  }

  const base = createBasePatchStreamAdapter(THREE, options);
  const atmosphere = applyLushJungleAtmosphere(THREE, base.scene, base.renderer, options.atmosphere ?? {});
  const foliageAtlas = createPrehistoricFoliageAtlas(THREE, { tileSize: options.foliageTileSize ?? 256 });
  const expectedLegacyVertices = (Number(config.segments) + 1) ** 2;
  const activeTerrainSlotCount = (stream.activeRadius * 2 + 1) ** 2;
  const terrain = createThreeTerrainLodLayer(THREE, {
    scene: base.scene,
    renderer: base.renderer,
    policy: terrainLodPolicy,
    selectTerrainLodLevel,
    slotCount: activeTerrainSlotCount + visualPrefetchCapacity,
    textureSeed: config.seed
  });
  const treeFidelity = treeFidelityPackages.length > 0
    ? createThreeTreeFidelityLayer(THREE, {
        scene: base.scene,
        camera: base.camera,
        renderer: base.renderer,
        treeTypes,
        packages: treeFidelityPackages,
        capacity: treeBatchCapacity
      })
    : null;
  const lushFoliage = treeFidelity
    ? createThreeLushFoliageLayer(THREE, {
        scene: base.scene,
        packages: treeFidelityPackages,
        atlas: foliageAtlas,
        authority: treeFidelity,
        capacityPerFamily: foliageCardCapacity
      })
    : null;
  const groundCover = createThreeGroundCoverLayer(THREE, {
    scene: base.scene,
    atlas: foliageAtlas,
    capacityPerSpecies: groundCoverCapacity
  });
  const productionGround = createThreeProductionGroundLayer(THREE, {
    scene: base.scene,
    camera: base.camera,
    grassCapacityPerVariant: options.productionGrassCapacity ?? 2800,
    groundDetailCapacityPerVariant: options.productionGroundDetailCapacity ?? 900
  });

  const visualPatchIds = new Set();
  const presentationPrefetchIds = new Set();

  base.view.terrainLod = terrain.view;
  base.view.treeFidelity = treeFidelity?.view ?? { enabled: false, packageCount: 0, counts: { near: 0, medium: 0, far: 0, horizon: 0 } };
  base.view.lushFoliage = lushFoliage?.view ?? { enabled: false, nearCards: 0, mediumCards: 0, treeCount: 0 };
  base.view.groundCover = groundCover.view;
  base.view.productionGround = productionGround.view;
  base.view.productionForest = productionGround.view;
  base.view.presentationPrefetch = {
    capacity: visualPrefetchCapacity,
    count: 0,
    visualPatchCount: 0,
    patchIds: []
  };
  base.view.jungleAtmosphere = Object.freeze({
    background: `#${atmosphere.background.getHexString()}`,
    fogColor: `#${atmosphere.fogColor.getHexString()}`,
    fogDensity: base.scene.fog?.density ?? null,
    exposure: base.renderer.toneMappingExposure,
    foliageAtlasRevision: foliageAtlas.revision
  });
  base.view.legacyTerrainSlotsSuppressed = hideLegacyTerrain(base.scene, expectedLegacyVertices);

  const baseActivatePatch = base.activatePatch;
  const baseReleasePatches = base.releasePatches;
  const baseRender = base.render;
  let renderedFrame = 0;

  function refreshPresentationPrefetchView() {
    base.view.presentationPrefetch = {
      capacity: visualPrefetchCapacity,
      count: presentationPrefetchIds.size,
      visualPatchCount: visualPatchIds.size,
      patchIds: [...presentationPrefetchIds].sort()
    };
  }

  function releaseVisualPatchIds(ids) {
    terrain.releasePatches(ids);
    treeFidelity?.releasePatches(ids);
    lushFoliage?.releasePatches(ids);
    groundCover.releasePatches(ids);
    productionGround.releasePatches(ids);
    for (const patchId of ids) {
      visualPatchIds.delete(String(patchId));
      presentationPrefetchIds.delete(String(patchId));
    }
    refreshPresentationPrefetchView();
  }

  function activateVisualPatch(patch, state) {
    if (!patch?.terrain) throw new TypeError("Terrain patch activation requires terrain fields.");
    if (visualPatchIds.has(patch.id)) {
      return Object.freeze({ accepted: true, patchId: patch.id, reused: true });
    }

    try {
      const admission = terrain.activatePatch(patch, state);
      treeFidelity?.activatePatch(patch, state);
      lushFoliage?.activatePatch(patch, state);
      groundCover.activatePatch(patch, state);
      productionGround.activatePatch(patch, state);
      visualPatchIds.add(patch.id);
      refreshPresentationPrefetchView();
      return admission;
    } catch (error) {
      releaseVisualPatchIds([patch.id]);
      throw error;
    }
  }

  function prefetchPatch(entry, state) {
    const patch = entry?.patch ?? entry;
    if (!visualPatchIds.has(patch?.id) && presentationPrefetchIds.size >= visualPrefetchCapacity) {
      throw new RangeError(`Presentation-prefetch capacity ${visualPrefetchCapacity} was exceeded.`);
    }
    const admission = activateVisualPatch(patch, state);
    presentationPrefetchIds.add(patch.id);
    refreshPresentationPrefetchView();
    return Object.freeze({
      ...admission,
      presentationOnly: true,
      patchId: patch.id
    });
  }

  function activatePatch(entry, state) {
    const patch = entry?.patch ?? entry;
    const wasVisual = visualPatchIds.has(patch?.id);
    const admission = activateVisualPatch(patch, state);
    try {
      baseActivatePatch(entry, state);
      presentationPrefetchIds.delete(patch.id);
      refreshPresentationPrefetchView();
      base.view.legacyTerrainSlotsSuppressed = hideLegacyTerrain(base.scene, expectedLegacyVertices);
      return admission;
    } catch (error) {
      if (!wasVisual) releaseVisualPatchIds([patch.id]);
      throw error;
    }
  }

  function promotePrefetchPatch(entry, state) {
    const patch = entry?.patch ?? entry;
    if (!presentationPrefetchIds.has(patch?.id)) return activatePatch(entry, state);
    baseActivatePatch(entry, state);
    presentationPrefetchIds.delete(patch.id);
    refreshPresentationPrefetchView();
    base.view.legacyTerrainSlotsSuppressed = hideLegacyTerrain(base.scene, expectedLegacyVertices);
    return Object.freeze({ accepted: true, patchId: patch.id, promoted: true, reusedVisuals: true });
  }

  function releasePatches(ids) {
    releaseVisualPatchIds(ids);
    return baseReleasePatches(ids);
  }

  function render(state, deltaTime) {
    terrain.update(state, deltaTime);
    treeFidelity?.update(state, deltaTime);
    lushFoliage?.update(state, deltaTime);
    groundCover.update(state, deltaTime);
    productionGround.update(state, deltaTime);

    const treeGrowthDigest = treeFidelity?.view.growthDigest ?? null;
    const foliageGrowthDigest = lushFoliage?.view.growthDigest ?? null;
    const singleTreeAuthority = Boolean(
      treeFidelity
      && lushFoliage
      && lushFoliage.view.authority === treeFidelity.view.presentationAuthority
      && treeGrowthDigest
      && treeGrowthDigest === foliageGrowthDigest
      && productionGround.view.treePresentationRetired === true
      && productionGround.view.barkInstances === 0
      && productionGround.view.canopyGroups === 0
    );
    if (treeFidelity && !singleTreeAuthority) {
      throw new Error("Natural vegetation presentation authority diverged: wood, foliage, and impostor generations must share one Object Fidelity decision.");
    }

    const result = baseRender(state, deltaTime);
    renderedFrame += 1;
    terrain.view.lastVisibleFrameAck = Object.freeze({
      frame: renderedFrame,
      policyId: terrainLodPolicy.id,
      activePatches: terrain.view.active,
      morphing: terrain.view.morphing
    });
    base.view.lushVegetationFrameAck = Object.freeze({
      frame: renderedFrame,
      foliageAtlasRevision: foliageAtlas.revision,
      treeCards: (lushFoliage?.view.nearCards ?? 0) + (lushFoliage?.view.mediumCards ?? 0),
      treePresentationAuthority: treeFidelity?.view.presentationAuthority ?? null,
      singleTreeAuthority,
      treeGrowthDigest,
      foliageGrowthDigest,
      computePreparedShading: Boolean(lushFoliage?.view.computePreparedShading),
      productionCanopyGroups: 0,
      productionBranchesAndBark: 0,
      productionGrassClumps: productionGround.view.grassClumps,
      groundSurfaceDetails: productionGround.view.groundDetails,
      groundCover: groundCover.view.count,
      treeGenerationDigest: treeFidelity?.view.generationDigest ?? null,
      visualPatchCount: visualPatchIds.size,
      presentationPrefetchCount: presentationPrefetchIds.size
    });
    return result;
  }

  return Object.freeze({
    ...base,
    terrainLod: terrain,
    treeFidelity,
    lushFoliage,
    groundCover,
    productionGround,
    productionForest: productionGround,
    foliageAtlas,
    atmosphere,
    prefetchPatch,
    activatePatch,
    promotePrefetchPatch,
    releasePatches,
    isVisualPatchActive(patchId) {
      return visualPatchIds.has(String(patchId));
    },
    getVisualPatchIds() {
      return [...visualPatchIds].sort();
    },
    render,
    dispose() {
      productionGround.dispose();
      lushFoliage?.dispose();
      groundCover.dispose();
      treeFidelity?.dispose();
      terrain.dispose();
      foliageAtlas.dispose();
      visualPatchIds.clear();
      presentationPrefetchIds.clear();
    }
  });
}

export default createThreePatchStreamLodAdapter;
