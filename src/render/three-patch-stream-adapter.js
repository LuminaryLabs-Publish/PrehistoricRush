import { applyCreaturePoseDamped, createCreatureMesh } from "./three-procedural-creature.js";

const GRASS_LAYER_CAPACITIES = Object.freeze([3600, 2600, 1300]);
const GRASS_CELL_CAPACITIES = Object.freeze([72, 72, 52]);
const SHARD_CAPACITY = 240;
const SHARD_CELL_CAPACITY = 2;
const TREE_CELL_CAPACITY = 8;

function grassGeometry(THREE, planes) {
  const positions = [];
  const uvs = [];
  const indices = [];
  let offset = 0;
  for (let index = 0; index < planes; index += 1) {
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 3);
    geometry.translate(0, 0.5, 0);
    geometry.scale(0.62, 1, 1);
    geometry.rotateY(Math.PI * index / planes);
    for (let vertex = 0; vertex < geometry.attributes.position.count; vertex += 1) {
      positions.push(
        geometry.attributes.position.getX(vertex),
        geometry.attributes.position.getY(vertex),
        geometry.attributes.position.getZ(vertex)
      );
      uvs.push(geometry.attributes.uv.getX(vertex), geometry.attributes.uv.getY(vertex));
    }
    for (let item = 0; item < geometry.index.count; item += 1) indices.push(geometry.index.getX(item) + offset);
    offset += geometry.attributes.position.count;
  }
  const output = new THREE.BufferGeometry();
  output.setIndex(indices);
  output.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  output.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  return output;
}

function grassMaterial(THREE, color) {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    alphaTest: 0.34,
    uniforms: { time: { value: 0 }, wind: { value: 0.2 }, color: { value: new THREE.Color(color) } },
    vertexShader: `uniform float time;uniform float wind;varying vec2 vUv;void main(){vUv=uv;vec3 p=position;float t=clamp(p.y,0.,1.);vec4 w=instanceMatrix*vec4(p,1.);p.x+=sin(time*1.45+w.x*.15+w.z*.11)*wind*t*t;p.z+=cos(time*1.1+w.z*.13)*wind*.35*t;gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(p,1.);}`,
    fragmentShader: `uniform vec3 color;varying vec2 vUv;void main(){float a=(1.-smoothstep(.16,.47,abs(vUv.x-.5)))*smoothstep(0.,.18,vUv.y)*(1.-smoothstep(.86,1.,vUv.y));if(a<.34)discard;float shade=mix(.82,1.18,smoothstep(0.,1.,vUv.y));gl_FragColor=vec4(color*shade,1.);}`
  });
}

function translationMatrix(x, y, z) {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1
  ];
}

function pickupDescriptor(pickup, patchId) {
  const radius = 0.42;
  return {
    id: pickup.id,
    matrix: translationMatrix(pickup.x, pickup.y, pickup.z),
    bounds: {
      min: [pickup.x - radius, pickup.y - radius, pickup.z - radius],
      max: [pickup.x + radius, pickup.y + radius, pickup.z + radius]
    },
    metadata: { patchId, kind: "pickup" }
  };
}

export function createThreePatchStreamAdapter(THREE, options = {}) {
  const {
    game,
    corePhysics,
    ui,
    instanceBatches,
    cameraFollow,
    config,
    stream,
    treeTypes,
    treeBatchCapacity
  } = options;
  const route = game.route;
  const terrainSlotCount = (stream.activeRadius * 2 + 1) ** 2;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x15251b);
  scene.fog = new THREE.FogExp2(0x203326, 0.0125);
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 900);
  const cameraTargets = { position: [0, 0, 0], lookPoint: [0, 0, 0] };
  let cameraRunId = null;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  ui.host.append(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xb9d0b2, 0x182015, 1.4));
  const sun = new THREE.DirectionalLight(0xffe6b2, 2.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -80;
  sun.shadow.camera.right = 80;
  sun.shadow.camera.top = 80;
  sun.shadow.camera.bottom = -80;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 180;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.06;
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun, sun.target);

  function baseTerrainGeometry() {
    const positions = [];
    const colors = [];
    const normals = [];
    const indices = [];
    for (let z = 0; z <= config.segments; z += 1) {
      for (let x = 0; x <= config.segments; x += 1) {
        positions.push((x / config.segments - 0.5) * config.chunk, 0, (z / config.segments - 0.5) * config.chunk);
        colors.push(0.2, 0.4, 0.18);
        normals.push(0, 1, 0);
      }
    }
    for (let z = 0; z < config.segments; z += 1) {
      for (let x = 0; x < config.segments; x += 1) {
        const a = z * (config.segments + 1) + x;
        const b = a + 1;
        const c = a + config.segments + 1;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    return geometry;
  }

  const terrainMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.94 });
  const terrainSlots = [];
  const terrainByPatch = new Map();
  for (let index = 0; index < terrainSlotCount; index += 1) {
    const mesh = new THREE.Mesh(baseTerrainGeometry(), terrainMaterial);
    mesh.receiveShadow = true;
    mesh.visible = false;
    scene.add(mesh);
    terrainSlots.push({ mesh, patchId: null });
  }

  const matrix = new THREE.Matrix4();
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5b4028, roughness: 0.98 });
  const trees = treeTypes.map((type, typeIndex) => {
    const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.7, 1.15, 1, 10), trunkMaterial, treeBatchCapacity);
    const crown = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(1, 2),
      new THREE.MeshStandardMaterial({ color: type[5], roughness: 0.92 }),
      treeBatchCapacity
    );
    trunk.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    crown.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    trunk.castShadow = trunk.receiveShadow = true;
    crown.castShadow = false;
    crown.receiveShadow = true;
    scene.add(trunk, crown);
    return {
      typeIndex,
      trunk,
      crown,
      trunkBatch: instanceBatches.create({
        id: `prehistoric-rush-tree-${typeIndex}-trunks`,
        capacity: treeBatchCapacity,
        cellCapacity: TREE_CELL_CAPACITY,
        updateMode: "incremental",
        boundsMode: "recompute-on-change"
      }),
      crownBatch: instanceBatches.create({
        id: `prehistoric-rush-tree-${typeIndex}-crowns`,
        capacity: treeBatchCapacity,
        cellCapacity: TREE_CELL_CAPACITY,
        updateMode: "incremental",
        boundsMode: "recompute-on-change"
      })
    };
  });

  const grass = [
    { planes: 2, color: 0x3f7a37 },
    { planes: 3, color: 0x4f9340 },
    { planes: 3, color: 0x69a94d }
  ].map((definition, index) => {
    const capacity = GRASS_LAYER_CAPACITIES[index];
    const mesh = new THREE.InstancedMesh(grassGeometry(THREE, definition.planes), grassMaterial(THREE, definition.color), capacity);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);
    return {
      capacity,
      mesh,
      batch: instanceBatches.create({
        id: `prehistoric-rush-grass-${index}`,
        capacity,
        cellCapacity: GRASS_CELL_CAPACITIES[index],
        updateMode: "incremental",
        boundsMode: "recompute-on-change"
      })
    };
  });

  const shards = new THREE.InstancedMesh(
    new THREE.OctahedronGeometry(0.34),
    new THREE.MeshStandardMaterial({ color: 0x8fe8ff, emissive: 0x43d4ff, emissiveIntensity: 1 }),
    SHARD_CAPACITY
  );
  shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(shards);
  const shardBatch = instanceBatches.create({
    id: "prehistoric-rush-shards",
    capacity: SHARD_CAPACITY,
    cellCapacity: SHARD_CELL_CAPACITY,
    updateMode: "incremental",
    boundsMode: "recompute-on-change"
  });

  const playerDescriptor = game.getPlayerBody();
  const player = createCreatureMesh(THREE, playerDescriptor);
  scene.add(player);

  const activePatches = new Map();
  const grassByPatch = new Map();
  const shardsByPatch = new Map();
  const collidersByPatch = new Map();
  const pickupsByPatch = new Map();
  const pickupPatchById = new Map();
  const activePickups = new Map();
  const view = {
    colliders: [],
    pickups: [],
    time: 0,
    treeBatchStats: [],
    patchStats: {},
    ownership: {
      activePatches: 0,
      grassPatches: 0,
      shardPatches: 0,
      colliderPatches: 0
    }
  };

  function fallbackHeight(x, z) {
    const nearest = route.nearest(x, z, 0, route.samples.length);
    const noise = Math.sin((x + config.seed) * 0.019) * 1.6 +
      Math.cos((z - config.seed) * 0.022) * 1.3 +
      Math.sin((x + z) * 0.008) * 2.6 +
      Math.cos((x - z) * 0.006) * 1.7;
    return noise - Math.max(0, 1 - nearest.distance / (nearest.width + 2.4)) * 0.34;
  }

  function samplePatchHeight(patch, x, z) {
    const localX = (x - (patch.x * config.chunk - config.chunk * 0.5)) / config.chunk * config.segments;
    const localZ = (z - (patch.z * config.chunk - config.chunk * 0.5)) / config.chunk * config.segments;
    const x0 = Math.max(0, Math.min(config.segments, Math.floor(localX)));
    const z0 = Math.max(0, Math.min(config.segments, Math.floor(localZ)));
    const x1 = Math.min(config.segments, x0 + 1);
    const z1 = Math.min(config.segments, z0 + 1);
    const tx = Math.max(0, Math.min(1, localX - x0));
    const tz = Math.max(0, Math.min(1, localZ - z0));
    const side = config.segments + 1;
    const h00 = patch.terrain.heights[z0 * side + x0];
    const h10 = patch.terrain.heights[z0 * side + x1];
    const h01 = patch.terrain.heights[z1 * side + x0];
    const h11 = patch.terrain.heights[z1 * side + x1];
    const top = h00 + (h10 - h00) * tx;
    const bottom = h01 + (h11 - h01) * tx;
    return top + (bottom - top) * tz;
  }

  function sampleHeight(x, z) {
    const patch = activePatches.get(`${Math.floor((x + config.chunk * 0.5) / config.chunk)}:${Math.floor((z + config.chunk * 0.5) / config.chunk)}`);
    return patch ? samplePatchHeight(patch, x, z) : fallbackHeight(x, z);
  }
  game.setHeightSampler(sampleHeight);

  function acquireTerrainSlot(patchId) {
    const current = terrainByPatch.get(patchId);
    if (current) return current;
    const slot = terrainSlots.find((candidate) => candidate.patchId == null) ?? terrainSlots[0];
    if (slot.patchId) terrainByPatch.delete(slot.patchId);
    slot.patchId = patchId;
    terrainByPatch.set(patchId, slot);
    return slot;
  }

  function applyTerrainPatch(patch) {
    const slot = acquireTerrainSlot(patch.id);
    const positions = slot.mesh.geometry.attributes.position;
    const colors = slot.mesh.geometry.attributes.color;
    const normals = slot.mesh.geometry.attributes.normal;
    for (let index = 0; index < positions.count; index += 1) positions.setY(index, patch.terrain.heights[index]);
    colors.array.set(patch.terrain.colors);
    normals.array.set(patch.terrain.normals);
    positions.needsUpdate = true;
    colors.needsUpdate = true;
    normals.needsUpdate = true;
    slot.mesh.position.set(patch.x * config.chunk, 0, patch.z * config.chunk);
    slot.mesh.visible = true;
    slot.mesh.geometry.computeBoundingBox();
    slot.mesh.geometry.computeBoundingSphere();
  }

  function applyBatchToMesh(mesh, update, label) {
    if (update.instanceWrites.length > 0) {
      mesh.instanceMatrix.clearUpdateRanges?.();
      for (const write of update.instanceWrites) {
        for (let offset = 0; offset < write.count; offset += 1) {
          const descriptor = write.instances[offset];
          if (descriptor?.matrix) matrix.fromArray(descriptor.matrix);
          else matrix.makeScale(0, 0, 0);
          mesh.setMatrixAt(write.start + offset, matrix);
        }
        mesh.instanceMatrix.addUpdateRange?.(write.start * 16, write.count * 16);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
    mesh.count = update.slotCount ?? update.activeCount;
    if (update.boundsDirty) {
      if (update.bounds) {
        mesh.boundingBox = new THREE.Box3(new THREE.Vector3(...update.bounds.min), new THREE.Vector3(...update.bounds.max));
        mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(...update.bounds.center), update.bounds.radius);
      } else {
        mesh.boundingBox = new THREE.Box3().makeEmpty();
        mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 0);
      }
    }
    if (update.overflow.count > 0) console.warn(`${label} overflow`, update.overflow);
  }

  function flushTrees() {
    view.treeBatchStats = [];
    for (const tree of trees) {
      const trunkUpdate = tree.trunkBatch.flush();
      const crownUpdate = tree.crownBatch.flush();
      applyBatchToMesh(tree.trunk, trunkUpdate, trunkUpdate.id);
      applyBatchToMesh(tree.crown, crownUpdate, crownUpdate.id);
      view.treeBatchStats.push({
        typeIndex: tree.typeIndex,
        trunks: tree.trunkBatch.getStats(),
        crowns: tree.crownBatch.getStats()
      });
    }
  }

  function flushGrass() {
    for (const layer of grass) {
      const update = layer.batch.flush();
      applyBatchToMesh(layer.mesh, update, update.id);
    }
  }

  function flushShards() {
    const update = shardBatch.flush();
    applyBatchToMesh(shards, update, update.id);
  }

  function updateOwnershipStats() {
    view.ownership = {
      activePatches: activePatches.size,
      grassPatches: grassByPatch.size,
      shardPatches: shardsByPatch.size,
      colliderPatches: collidersByPatch.size
    };
  }

  function syncColliderMembership() {
    view.colliders = [...collidersByPatch.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .flatMap(([, colliders]) => colliders);
    corePhysics.syncColliders(view.colliders);
  }

  function syncPickupView() {
    view.pickups = [...activePickups.values()].sort((left, right) => left.id.localeCompare(right.id));
  }

  function setPatchPickups(patchId, pickups, collectedIds) {
    const collected = collectedIds instanceof Set ? collectedIds : new Set(collectedIds ?? []);
    const previous = pickupsByPatch.get(patchId) ?? [];
    for (const pickup of previous) {
      pickupPatchById.delete(pickup.id);
      activePickups.delete(pickup.id);
    }
    pickupsByPatch.set(patchId, pickups);
    const visible = [];
    for (const pickup of pickups) {
      pickupPatchById.set(pickup.id, patchId);
      if (collected.has(pickup.id)) continue;
      activePickups.set(pickup.id, pickup);
      visible.push(pickupDescriptor(pickup, patchId));
    }
    shardsByPatch.set(patchId, visible);
    shardBatch.replaceCell(patchId, visible);
  }

  function activatePatch(entry, state) {
    const patch = entry.patch;
    const collected = new Set(state.collectedShardIds);
    activePatches.set(patch.id, patch);
    applyTerrainPatch(patch);
    trees.forEach((tree, typeIndex) => {
      tree.trunkBatch.replaceCell(patch.id, patch.trees[typeIndex].trunks);
      tree.crownBatch.replaceCell(patch.id, patch.trees[typeIndex].crowns);
    });
    grassByPatch.set(patch.id, patch.grass);
    for (let layerIndex = 0; layerIndex < grass.length; layerIndex += 1) {
      grass[layerIndex].batch.replaceCell(patch.id, patch.grass[layerIndex]);
    }
    collidersByPatch.set(patch.id, patch.colliders);
    setPatchPickups(patch.id, patch.pickups, collected);
    flushTrees();
    flushGrass();
    flushShards();
    syncColliderMembership();
    syncPickupView();
    updateOwnershipStats();
  }

  function releasePatches(ids) {
    let membershipChanged = false;
    for (const patchId of ids) {
      if (!activePatches.delete(patchId)) continue;
      membershipChanged = true;
      const slot = terrainByPatch.get(patchId);
      if (slot) {
        slot.mesh.visible = false;
        slot.patchId = null;
        terrainByPatch.delete(patchId);
      }
      for (const tree of trees) {
        tree.trunkBatch.releaseCell(patchId);
        tree.crownBatch.releaseCell(patchId);
      }
      for (const layer of grass) layer.batch.releaseCell(patchId);
      shardBatch.releaseCell(patchId);
      grassByPatch.delete(patchId);
      shardsByPatch.delete(patchId);
      collidersByPatch.delete(patchId);
      const pickups = pickupsByPatch.get(patchId) ?? [];
      for (const pickup of pickups) {
        pickupPatchById.delete(pickup.id);
        activePickups.delete(pickup.id);
      }
      pickupsByPatch.delete(patchId);
    }
    if (!membershipChanged) return;
    flushTrees();
    flushGrass();
    flushShards();
    syncColliderMembership();
    syncPickupView();
    updateOwnershipStats();
  }

  function refreshDynamicContent(state, changedPickupIds = []) {
    const collected = new Set(state.collectedShardIds);
    const affectedPatchIds = new Set();
    if (changedPickupIds.length > 0) {
      for (const pickupId of changedPickupIds) {
        const patchId = pickupPatchById.get(String(pickupId));
        if (patchId) affectedPatchIds.add(patchId);
      }
    } else {
      for (const patchId of activePatches.keys()) affectedPatchIds.add(patchId);
    }
    for (const patchId of affectedPatchIds) {
      const patch = activePatches.get(patchId);
      if (patch) setPatchPickups(patchId, patch.pickups, collected);
    }
    if (affectedPatchIds.size > 0) {
      flushShards();
      syncPickupView();
      updateOwnershipStats();
    }
  }

  function setCameraTargets(state) {
    const ahead = route.samples[Math.min(route.samples.length - 1, state.routeIndex + 12)] ?? route.samples[state.routeIndex];
    const backX = -Math.sin(state.yaw);
    const backZ = -Math.cos(state.yaw);
    cameraTargets.position[0] = state.x + backX * 6.6;
    cameraTargets.position[1] = state.y + 2.35;
    cameraTargets.position[2] = state.z + backZ * 6.6;
    cameraTargets.lookPoint[0] = ahead.x;
    cameraTargets.lookPoint[1] = sampleHeight(ahead.x, ahead.z) + 1.15;
    cameraTargets.lookPoint[2] = ahead.z;
  }

  function applyCameraTransform(transform) {
    camera.position.fromArray(transform.position);
    camera.quaternion.fromArray(transform.quaternion);
  }

  function resetCamera(state, reason = "run-reset") {
    setCameraTargets(state);
    cameraRunId = state.runId;
    const transform = cameraFollow.reset({
      position: cameraTargets.position,
      lookPoint: cameraTargets.lookPoint,
      reason
    });
    applyCameraTransform(transform);
    return transform;
  }

  function render(state, dt) {
    view.time += dt;
    player.position.set(state.x, state.y + state.jumpHeight + 0.05, state.z);
    player.rotation.y = state.yaw;
    const playerPose = game.getPlayerPose();
    if (playerPose) applyCreaturePoseDamped(player, playerPose, dt, 18);
    setCameraTargets(state);
    const cameraTransform = cameraRunId !== state.runId
      ? resetCamera(state, "run-change")
      : cameraFollow.update({
          targetPosition: cameraTargets.position,
          targetLookPoint: cameraTargets.lookPoint,
          deltaTime: Math.min(dt, 1 / 30)
        });
    applyCameraTransform(cameraTransform);
    sun.position.set(state.x - 25, state.y + 45, state.z - 20);
    sun.target.position.set(state.x, state.y, state.z);
    grass.forEach((layer) => {
      layer.mesh.material.uniforms.time.value = view.time;
      layer.mesh.material.uniforms.wind.value = 0.22;
    });
    shards.rotation.y += dt * 0.8;
    renderer.render(scene, camera);
  }

  return {
    scene,
    camera,
    renderer,
    sun,
    player,
    playerDescriptor,
    view,
    sampleHeight,
    resetCamera,
    activatePatch,
    releasePatches,
    refreshDynamicContent,
    render,
    ownership: Object.freeze({
      activePatches,
      grassByPatch,
      shardsByPatch,
      collidersByPatch
    })
  };
}

export default createThreePatchStreamAdapter;
