import { createTerrainLodTopology, createTerrainPatchVertexData } from "./terrain-lod-geometry.js";
import { createClaySurfaceTextures } from "./three-clay-surface-textures.js";

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const smoothstep01 = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function targetInfluences(topology, levelId) {
  const values = new Array(Math.max(0, topology.levels.length - 1)).fill(0);
  const levelIndex = topology.levelOrder[levelId];
  if (levelIndex > 0) values[levelIndex - 1] = 1;
  return values;
}

function setIndexForLevel(slot, levelId) {
  const index = slot.indexAttributes[levelId];
  if (!index) throw new RangeError(`Missing terrain LOD index for ${levelId}.`);
  slot.mesh.geometry.setIndex(index);
}

function setInfluences(slot, values) {
  for (let index = 0; index < slot.mesh.morphTargetInfluences.length; index += 1) {
    slot.mesh.morphTargetInfluences[index] = Number(values[index] ?? 0);
  }
}

function setImmediateLevel(slot, topology, levelId) {
  setInfluences(slot, targetInfluences(topology, levelId));
  setIndexForLevel(slot, levelId);
  slot.levelId = levelId;
  slot.targetLevelId = levelId;
  slot.drawLevelId = levelId;
  slot.transition = null;
}

function startTransition(slot, topology, targetLevelId, durationSeconds) {
  if (slot.targetLevelId === targetLevelId && slot.transition) return;
  if (slot.levelId === targetLevelId && !slot.transition) return;

  const currentDrawIndex = topology.levelOrder[slot.drawLevelId ?? slot.levelId] ?? 0;
  const targetIndex = topology.levelOrder[targetLevelId];
  const finerLevelId = topology.levels[Math.min(currentDrawIndex, targetIndex)]?.id ?? targetLevelId;
  setIndexForLevel(slot, finerLevelId);
  slot.drawLevelId = finerLevelId;
  slot.targetLevelId = targetLevelId;
  slot.transition = {
    elapsed: 0,
    duration: Math.max(0.0001, Number(durationSeconds) || 0.0001),
    start: [...slot.mesh.morphTargetInfluences],
    end: targetInfluences(topology, targetLevelId)
  };
}

function advanceTransition(slot, topology, deltaTime) {
  if (!slot.transition) return false;
  slot.transition.elapsed += Math.max(0, Number(deltaTime) || 0);
  const progress = smoothstep01(slot.transition.elapsed / slot.transition.duration);
  const values = slot.transition.start.map((start, index) => start + (slot.transition.end[index] - start) * progress);
  setInfluences(slot, values);
  if (progress >= 1) {
    setIndexForLevel(slot, slot.targetLevelId);
    slot.levelId = slot.targetLevelId;
    slot.drawLevelId = slot.targetLevelId;
    slot.transition = null;
  }
  return true;
}

function createGeometry(THREE, topology) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(topology.vertexCount * 3, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(topology.vertexCount * 3, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(topology.vertexCount * 3, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(topology.vertexCount * 2, 2));
  geometry.morphTargetsRelative = true;
  geometry.morphAttributes.position = topology.levels.slice(1).map(
    () => new THREE.Float32BufferAttribute(topology.vertexCount * 3, 3)
  );
  return geometry;
}

function writePatch(slot, topology, policy, patch) {
  const data = createTerrainPatchVertexData({ patch, policy, topology });
  const geometry = slot.mesh.geometry;
  geometry.getAttribute("position").array.set(data.positions);
  geometry.getAttribute("normal").array.set(data.normals);
  geometry.getAttribute("color").array.set(data.colors);
  geometry.getAttribute("uv").array.set(data.uvs);
  geometry.getAttribute("position").needsUpdate = true;
  geometry.getAttribute("normal").needsUpdate = true;
  geometry.getAttribute("color").needsUpdate = true;
  geometry.getAttribute("uv").needsUpdate = true;

  topology.levels.slice(1).forEach((level, index) => {
    const offsets = data.morphOffsetsByLevel[level.id];
    geometry.morphAttributes.position[index].array.set(offsets);
    geometry.morphAttributes.position[index].needsUpdate = true;
  });
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  slot.bounds = data.bounds;
  slot.mesh.position.set(patch.x * policy.patchSize, 0, patch.z * policy.patchSize);
  slot.mesh.visible = true;
}

function createMaterial(THREE, textures) {
  return new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.86,
    roughnessMap: textures.roughnessMap,
    metalness: 0,
    normalMap: textures.normalMap,
    normalScale: new THREE.Vector2(0.18, 0.18),
    clearcoat: 0.28,
    clearcoatRoughness: 0.46,
    side: THREE.DoubleSide
  });
}

export function createThreeTerrainLodLayer(THREE, options = {}) {
  const {
    scene,
    renderer,
    policy,
    selectTerrainLodLevel,
    slotCount = 25,
    textureSeed = 238991
  } = options;
  if (!scene || !renderer) throw new TypeError("Terrain LOD layer requires a Three.js scene and renderer.");
  if (!policy?.levels?.length) throw new TypeError("Terrain LOD layer requires a policy descriptor.");
  if (typeof selectTerrainLodLevel !== "function") throw new TypeError("Terrain LOD layer requires selectTerrainLodLevel().");

  const topology = createTerrainLodTopology(policy);
  const textureResolution = policy.materialPolicy?.textureResolution?.width ?? 2048;
  const textures = createClaySurfaceTextures(THREE, {
    resolution: textureResolution,
    seed: textureSeed,
    maximumAnisotropy: renderer.capabilities?.getMaxAnisotropy?.() ?? 8,
    normalId: policy.materialPolicy?.textures?.normal?.id,
    roughnessId: policy.materialPolicy?.textures?.roughness?.id
  });
  const material = createMaterial(THREE, textures);
  const slots = [];
  const byPatch = new Map();

  for (let index = 0; index < slotCount; index += 1) {
    const geometry = createGeometry(THREE, topology);
    const indexAttributes = Object.fromEntries(topology.levels.map((level) => [
      level.id,
      new THREE.BufferAttribute(topology.indicesByLevel[level.id], 1)
    ]));
    geometry.setIndex(indexAttributes[topology.levels[0].id]);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `prehistoric-terrain-lod-slot-${index}`;
    mesh.receiveShadow = true;
    mesh.visible = false;
    mesh.frustumCulled = true;
    mesh.updateMorphTargets();
    scene.add(mesh);
    slots.push({
      mesh,
      indexAttributes,
      patchId: null,
      bounds: null,
      levelId: topology.levels[0].id,
      targetLevelId: topology.levels[0].id,
      drawLevelId: topology.levels[0].id,
      transition: null
    });
  }

  const view = {
    policyId: policy.id,
    sourceResolution: policy.sourceResolution,
    textureResolution: textures.resolution,
    counts: Object.fromEntries(topology.levels.map((level) => [level.id, 0])),
    morphing: 0,
    active: 0,
    lastSelectionRevision: 0,
    lastVisibleFrameAck: null
  };

  function acquire(patchId) {
    const current = byPatch.get(patchId);
    if (current) return current;
    const slot = slots.find((candidate) => candidate.patchId == null);
    if (!slot) throw new RangeError(`Terrain LOD slot capacity ${slots.length} was exceeded.`);
    slot.patchId = patchId;
    byPatch.set(patchId, slot);
    return slot;
  }

  function choose(slot, state) {
    return selectTerrainLodLevel(policy, {
      focus: { x: state?.x ?? 0, z: state?.z ?? 0 },
      bounds: slot.bounds,
      previousLevelId: slot.targetLevelId ?? slot.levelId
    });
  }

  function refreshView() {
    const counts = Object.fromEntries(topology.levels.map((level) => [level.id, 0]));
    let morphing = 0;
    let active = 0;
    for (const slot of slots) {
      if (!slot.patchId) continue;
      active += 1;
      counts[slot.targetLevelId] = (counts[slot.targetLevelId] ?? 0) + 1;
      if (slot.transition) morphing += 1;
    }
    view.counts = counts;
    view.morphing = morphing;
    view.active = active;
    view.lastSelectionRevision += 1;
  }

  function activatePatch(patch, state) {
    const slot = acquire(patch.id);
    try {
      writePatch(slot, topology, policy, patch);
      const selection = choose(slot, state);
      setImmediateLevel(slot, topology, selection.levelId);
      refreshView();
      return Object.freeze({
        accepted: true,
        patchId: patch.id,
        levelId: selection.levelId,
        resolution: selection.resolution,
        sourceResolution: policy.sourceResolution,
        vertexCount: topology.vertexCount,
        textureResolution: textures.resolution
      });
    } catch (error) {
      slot.mesh.visible = false;
      slot.patchId = null;
      slot.bounds = null;
      byPatch.delete(patch.id);
      throw error;
    }
  }

  function releasePatches(ids = []) {
    for (const patchId of ids) {
      const slot = byPatch.get(patchId);
      if (!slot) continue;
      slot.mesh.visible = false;
      slot.patchId = null;
      slot.bounds = null;
      slot.transition = null;
      byPatch.delete(patchId);
    }
    refreshView();
  }

  function update(state, deltaTime) {
    for (const slot of slots) {
      if (!slot.patchId || !slot.bounds) continue;
      const selection = choose(slot, state);
      if (selection.levelId !== slot.targetLevelId) {
        startTransition(slot, topology, selection.levelId, selection.morphDurationSeconds);
      }
      advanceTransition(slot, topology, deltaTime);
    }
    refreshView();
  }

  function dispose() {
    for (const slot of slots) {
      scene.remove(slot.mesh);
      slot.mesh.geometry.dispose();
    }
    material.dispose();
    textures.dispose();
    byPatch.clear();
  }

  return Object.freeze({
    policy,
    topology,
    material,
    textures,
    slots,
    view,
    activatePatch,
    releasePatches,
    update,
    dispose
  });
}

export default createThreeTerrainLodLayer;
