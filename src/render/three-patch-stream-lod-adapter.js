import { createThreePatchStreamAdapter as createBasePatchStreamAdapter } from "./three-patch-stream-adapter.js";
import { createThreeTerrainLodLayer } from "./three-terrain-lod-layer.js";

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
    config
  } = options;
  if (!terrainLodPolicy) throw new TypeError("Three patch stream LOD adapter requires terrainLodPolicy.");
  const base = createBasePatchStreamAdapter(THREE, options);
  const expectedLegacyVertices = (Number(config.segments) + 1) ** 2;
  const terrain = createThreeTerrainLodLayer(THREE, {
    scene: base.scene,
    renderer: base.renderer,
    policy: terrainLodPolicy,
    selectTerrainLodLevel,
    slotCount: (stream.activeRadius * 2 + 1) ** 2,
    textureSeed: config.seed
  });
  base.view.terrainLod = terrain.view;
  base.view.legacyTerrainSlotsSuppressed = hideLegacyTerrain(base.scene, expectedLegacyVertices);

  const baseActivatePatch = base.activatePatch;
  const baseReleasePatches = base.releasePatches;
  const baseRender = base.render;
  let renderedFrame = 0;

  function activatePatch(entry, state) {
    const patch = entry?.patch ?? entry;
    if (!patch?.terrain) throw new TypeError("Terrain patch activation requires terrain fields.");
    const admission = terrain.activatePatch(patch, state);
    try {
      baseActivatePatch(entry, state);
      base.view.legacyTerrainSlotsSuppressed = hideLegacyTerrain(base.scene, expectedLegacyVertices);
      return admission;
    } catch (error) {
      terrain.releasePatches([patch.id]);
      throw error;
    }
  }

  function releasePatches(ids) {
    terrain.releasePatches(ids);
    return baseReleasePatches(ids);
  }

  function render(state, deltaTime) {
    terrain.update(state, deltaTime);
    const result = baseRender(state, deltaTime);
    renderedFrame += 1;
    terrain.view.lastVisibleFrameAck = Object.freeze({
      frame: renderedFrame,
      policyId: terrainLodPolicy.id,
      activePatches: terrain.view.active,
      morphing: terrain.view.morphing
    });
    return result;
  }

  return Object.freeze({
    ...base,
    terrainLod: terrain,
    activatePatch,
    releasePatches,
    render,
    dispose() {
      terrain.dispose();
    }
  });
}

export default createThreePatchStreamLodAdapter;
