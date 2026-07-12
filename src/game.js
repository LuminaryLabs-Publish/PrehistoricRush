import { createPrehistoricRushKitGraph } from "./domains/prehistoric-rush/prehistoric-rush-domain-kit.js";
import { createPrehistoricPatchGenerator } from "./world/prehistoric-patch-generator.js";
import { loadPlayerCharacterProfile } from "./shared/player-character-store.js";
import {
  KITS_COMMIT,
  NEXUS_COMMIT,
  PROTOKITS_COMMIT,
  RUNTIME_URLS
} from "./shared/runtime-versions.js";
import { applyCreaturePose, createCreatureMesh } from "./render/three-procedural-creature.js";

const CDN = RUNTIME_URLS;

const cfg = { seed: 238991, chunk: 56, segments: 30, trees: 7, grass: 70, goal: 3600 };
const STREAM = {
  activeRadius: 2,
  retainRadius: 4,
  prefetchDistance: 2,
  cacheLimit: 96,
  activationBudget: 1,
  generationBudget: 2
};
const TREE_BATCH_CAPACITY = 256;
const TERRAIN_SLOT_COUNT = (STREAM.activeRadius * 2 + 1) ** 2;
const treeTypes = [
  [34, 58, 2.5, 10.5, 18, 0x214f28],
  [38, 68, 1.8, 7.5, 26, 0x173c26],
  [14, 24, 1.25, 7.2, 5, 0x2d6638],
  [28, 48, 2.1, 9.2, 15, 0x315a2d],
  [30, 52, 2.35, 3.5, 9, 0x5d4933]
];

const load = async (url) => {
  try {
    return await import(url);
  } catch (error) {
    console.warn("module import failed", url, error);
    return null;
  }
};

function shell() {
  const root = document.querySelector("#app") ?? document.body;
  root.innerHTML = "";
  Object.assign(document.body.style, { margin: 0, overflow: "hidden", background: "#09130d", color: "#fff8dc", fontFamily: "system-ui,sans-serif" });
  const host = document.createElement("section");
  const panel = document.createElement("aside");
  const status = document.createElement("div");
  const button = document.createElement("button");
  Object.assign(host.style, { position: "fixed", inset: 0 });
  Object.assign(panel.style, { position: "fixed", top: "14px", left: "16px", minWidth: "292px", padding: "12px 14px", borderRadius: "16px", background: "rgba(7,14,9,.72)", zIndex: 4 });
  Object.assign(button.style, { marginTop: "10px", padding: "9px 14px", borderRadius: "999px", background: "#ffd37a", fontWeight: 800 });
  panel.append(status, button);
  root.append(host, panel);
  return { host, status, button };
}

async function createRapierAdapter(collision) {
  const [Rapier, RapierKit] = await Promise.all([load(CDN.rapier), load(CDN.rapierKit)]);
  const store = new Map();
  const world = {
    getResource: (resource) => store.get(resource?.name ?? resource),
    setResource: (resource, value) => store.set(resource?.name ?? resource, value),
    emit() {}
  };
  const engine = { n: {} };
  const kit = RapierKit?.createRapierPhysicsKit?.({}, {});
  kit?.initWorld?.({ world, engine });
  kit?.install?.({ world, engine });
  if (Rapier?.init) await Rapier.init();
  const api = engine.n.rapierPhysics;
  api?.configure?.({ rapier: Rapier, gravity: { x: 0, y: -34, z: 0 } });
  api?.registerKinematicActor?.({
    id: "dino",
    shape: collision?.shape ?? "capsule",
    halfHeight: collision?.halfHeight ?? 0.42,
    radius: collision?.radius ?? 0.32
  });
  return api ?? null;
}

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
      positions.push(geometry.attributes.position.getX(vertex), geometry.attributes.position.getY(vertex), geometry.attributes.position.getZ(vertex));
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

function createThreeAdapter(THREE, game, physics, ui, instanceBatches, cameraFollow) {
  const route = game.route;
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
    for (let z = 0; z <= cfg.segments; z += 1) {
      for (let x = 0; x <= cfg.segments; x += 1) {
        positions.push((x / cfg.segments - 0.5) * cfg.chunk, 0, (z / cfg.segments - 0.5) * cfg.chunk);
        colors.push(0.2, 0.4, 0.18);
        normals.push(0, 1, 0);
      }
    }
    for (let z = 0; z < cfg.segments; z += 1) {
      for (let x = 0; x < cfg.segments; x += 1) {
        const a = z * (cfg.segments + 1) + x;
        const b = a + 1;
        const c = a + cfg.segments + 1;
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
  for (let index = 0; index < TERRAIN_SLOT_COUNT; index += 1) {
    const mesh = new THREE.Mesh(baseTerrainGeometry(), terrainMaterial);
    mesh.receiveShadow = true;
    mesh.visible = false;
    scene.add(mesh);
    terrainSlots.push({ mesh, patchId: null });
  }

  const matrix = new THREE.Matrix4();
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5b4028, roughness: 0.98 });
  const trees = treeTypes.map((type, typeIndex) => {
    const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.7, 1.15, 1, 10), trunkMaterial, TREE_BATCH_CAPACITY);
    const crown = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshStandardMaterial({ color: type[5], roughness: 0.92 }), TREE_BATCH_CAPACITY);
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
      trunkBatch: instanceBatches.create({ id: `prehistoric-rush-tree-${typeIndex}-trunks`, capacity: TREE_BATCH_CAPACITY, boundsMode: "recompute-on-change" }),
      crownBatch: instanceBatches.create({ id: `prehistoric-rush-tree-${typeIndex}-crowns`, capacity: TREE_BATCH_CAPACITY, boundsMode: "recompute-on-change" })
    };
  });

  const grass = [
    { capacity: 3600, mesh: new THREE.InstancedMesh(grassGeometry(THREE, 2), grassMaterial(THREE, 0x3f7a37), 3600) },
    { capacity: 2600, mesh: new THREE.InstancedMesh(grassGeometry(THREE, 3), grassMaterial(THREE, 0x4f9340), 2600) },
    { capacity: 1300, mesh: new THREE.InstancedMesh(grassGeometry(THREE, 3), grassMaterial(THREE, 0x69a94d), 1300) }
  ];
  grass.forEach(({ mesh }) => {
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);
  });
  const shards = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.34), new THREE.MeshStandardMaterial({ color: 0x8fe8ff, emissive: 0x43d4ff, emissiveIntensity: 1 }), 240);
  shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(shards);

  const playerDescriptor = game.getPlayerBody();
  const player = createCreatureMesh(THREE, playerDescriptor);
  scene.add(player);
  const activePatches = new Map();
  const view = { colliders: [], pickups: [], time: 0, treeBatchStats: [], patchStats: {} };

  function fallbackHeight(x, z) {
    const nearest = route.nearest(x, z, 0, route.samples.length);
    const noise = Math.sin((x + cfg.seed) * 0.019) * 1.6 + Math.cos((z - cfg.seed) * 0.022) * 1.3 + Math.sin((x + z) * 0.008) * 2.6 + Math.cos((x - z) * 0.006) * 1.7;
    return noise - Math.max(0, 1 - nearest.distance / (nearest.width + 2.4)) * 0.34;
  }

  function samplePatchHeight(patch, x, z) {
    const localX = (x - (patch.x * cfg.chunk - cfg.chunk * 0.5)) / cfg.chunk * cfg.segments;
    const localZ = (z - (patch.z * cfg.chunk - cfg.chunk * 0.5)) / cfg.chunk * cfg.segments;
    const x0 = Math.max(0, Math.min(cfg.segments, Math.floor(localX)));
    const z0 = Math.max(0, Math.min(cfg.segments, Math.floor(localZ)));
    const x1 = Math.min(cfg.segments, x0 + 1);
    const z1 = Math.min(cfg.segments, z0 + 1);
    const tx = Math.max(0, Math.min(1, localX - x0));
    const tz = Math.max(0, Math.min(1, localZ - z0));
    const side = cfg.segments + 1;
    const h00 = patch.terrain.heights[z0 * side + x0];
    const h10 = patch.terrain.heights[z0 * side + x1];
    const h01 = patch.terrain.heights[z1 * side + x0];
    const h11 = patch.terrain.heights[z1 * side + x1];
    const top = h00 + (h10 - h00) * tx;
    const bottom = h01 + (h11 - h01) * tx;
    return top + (bottom - top) * tz;
  }

  function sampleHeight(x, z) {
    const patch = activePatches.get(`${Math.floor((x + cfg.chunk * 0.5) / cfg.chunk)}:${Math.floor((z + cfg.chunk * 0.5) / cfg.chunk)}`);
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
    slot.mesh.position.set(patch.x * cfg.chunk, 0, patch.z * cfg.chunk);
    slot.mesh.visible = true;
    slot.mesh.geometry.computeBoundingBox();
    slot.mesh.geometry.computeBoundingSphere();
  }

  function applyBatchToMesh(mesh, update, label) {
    for (let index = 0; index < update.activeCount; index += 1) {
      matrix.fromArray(update.instances[index].matrix);
      mesh.setMatrixAt(index, matrix);
    }
    mesh.count = update.activeCount;
    mesh.instanceMatrix.needsUpdate = true;
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
      view.treeBatchStats.push({ typeIndex: tree.typeIndex, trunks: tree.trunkBatch.getStats(), crowns: tree.crownBatch.getStats() });
    }
  }

  function rebuildActiveContent(state) {
    const grassCounts = [0, 0, 0];
    let shardCount = 0;
    view.colliders = [];
    view.pickups = [];
    const collected = new Set(state.collectedShardIds);
    const patches = [...activePatches.values()].sort((left, right) => left.id.localeCompare(right.id));
    for (const patch of patches) {
      view.colliders.push(...patch.colliders);
      for (let layerIndex = 0; layerIndex < grass.length; layerIndex += 1) {
        const layer = grass[layerIndex];
        for (const descriptor of patch.grass[layerIndex]) {
          const item = grassCounts[layerIndex];
          if (item >= layer.capacity) break;
          matrix.fromArray(descriptor.matrix);
          layer.mesh.setMatrixAt(item, matrix);
          grassCounts[layerIndex] += 1;
        }
      }
      for (const pickup of patch.pickups) {
        if (collected.has(pickup.id) || shardCount >= 240) continue;
        matrix.makeTranslation(pickup.x, pickup.y, pickup.z);
        shards.setMatrixAt(shardCount++, matrix);
        view.pickups.push(pickup);
      }
    }
    grass.forEach((layer, index) => {
      layer.mesh.count = grassCounts[index];
      layer.mesh.instanceMatrix.needsUpdate = true;
      layer.mesh.computeBoundingBox?.();
      layer.mesh.computeBoundingSphere?.();
    });
    shards.count = shardCount;
    shards.instanceMatrix.needsUpdate = true;
    shards.computeBoundingBox?.();
    shards.computeBoundingSphere?.();
    physics?.setFixedColliders?.(view.colliders);
  }

  function activatePatch(entry, state) {
    const patch = entry.patch;
    activePatches.set(patch.id, patch);
    applyTerrainPatch(patch);
    trees.forEach((tree, typeIndex) => {
      tree.trunkBatch.replaceCell(patch.id, patch.trees[typeIndex].trunks);
      tree.crownBatch.replaceCell(patch.id, patch.trees[typeIndex].crowns);
    });
    flushTrees();
    rebuildActiveContent(state);
  }

  function releasePatches(ids, state) {
    let changed = false;
    for (const patchId of ids) {
      if (!activePatches.delete(patchId)) continue;
      changed = true;
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
    }
    if (changed) {
      flushTrees();
      rebuildActiveContent(state);
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
    applyCreaturePose(player, game.createPlayerPose({
      speed: state.speed,
      time: state.elapsed,
      turn: game.getInput().steer,
      jump: Math.min(1, state.jumpHeight / 2),
      resistance: 1 - state.surfaceMultiplier
    }));
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
    refreshDynamicContent: rebuildActiveContent,
    render
  };
}

function createWorkerExecutor(PatchModule, generatorOptions) {
  if (typeof Worker !== "function" || typeof PatchModule.createMessageWorkerExecutor !== "function") return { executor: null, worker: null };
  try {
    const worker = new Worker(new URL("./workers/prehistoric-patch-worker.js", import.meta.url), { type: "module" });
    worker.postMessage({ type: "init-patch-worker", payload: generatorOptions });
    return { executor: PatchModule.createMessageWorkerExecutor(worker), worker };
  } catch (error) {
    console.warn("patch worker unavailable; using deferred synchronous generation", error);
    return { executor: null, worker: null };
  }
}

async function main() {
  const ui = shell();
  const playerProfile = loadPlayerCharacterProfile();
  const [NexusEngine, SeedModule, CreatureModule, BatchModule, PatchModule, CameraModule, THREE] = await Promise.all([
    load(CDN.nexus),
    load(CDN.seedKit),
    load(CDN.creatureKit),
    load(CDN.batchKit),
    load(CDN.patchKit),
    load(CDN.cameraKit),
    load(CDN.three)
  ]);
  if (!NexusEngine || !SeedModule || !CreatureModule || !BatchModule || !PatchModule || !CameraModule || !THREE) {
    throw new Error("Required pinned runtime module failed to load.");
  }
  const NexusEngineKits = { ...SeedModule, ...CreatureModule, ...BatchModule, ...PatchModule, ...CameraModule };
  const engine = NexusEngine.createRealtimeGame({
    kits: createPrehistoricRushKitGraph(NexusEngine, NexusEngineKits, {
    seed: cfg.seed,
    goalDistance: cfg.goal,
    playerCreature: playerProfile.creature
  })
  });
  const game = engine.n.prehistoricRush;
  const instanceBatches = engine.n.instancedRenderBatch;
  const patchControllers = engine.n.seededWorldPatchController;
  const cameraFollows = engine.n.cameraSmoothFollow;
  if (!game || !instanceBatches || !patchControllers || !cameraFollows) throw new Error("PrehistoricRush composition did not install.");

  const playerBody = game.getPlayerBody();
  const physics = await createRapierAdapter(playerBody.collision);
  const generatorOptions = {
    config: { ...cfg, shardsPerPatch: 2 },
    treeTypes,
    routeSamples: game.route.samples
  };
  const generator = createPrehistoricPatchGenerator(generatorOptions);
  const workerState = createWorkerExecutor(PatchModule, generatorOptions);
  const controller = patchControllers.create({
    id: "prehistoric-rush-world",
    worldSeed: String(cfg.seed),
    generatorVersion: "prehistoric-patch-v1",
    patchSize: cfg.chunk,
    activeRadius: STREAM.activeRadius,
    retainRadius: STREAM.retainRadius,
    prefetchDistance: STREAM.prefetchDistance,
    cacheLimit: STREAM.cacheLimit,
    activationBudget: STREAM.activationBudget,
    generationBudget: STREAM.generationBudget,
    terrainSettingsHash: `segments-${cfg.segments}`,
    vegetationSettingsHash: `trees-${cfg.trees}-grass-${cfg.grass}`,
    generator,
    executor: workerState.executor
  });
  const cameraFollow = cameraFollows.create({
    id: "prehistoric-rush-player-camera",
    positionSmoothTime: 0.22,
    lookSmoothTime: 0.14,
    maximumPositionSpeed: 45,
    maximumLookSpeed: 65,
    rotationSharpness: 12,
    maximumDeltaTime: 1 / 30,
    teleportThreshold: 24
  });
  const adapter = createThreeAdapter(THREE, game, physics, ui, instanceBatches, cameraFollow);
  const input = { left: false, right: false, boost: false };

  function updateStreaming(state, primeCenter = false) {
    const forward = { x: Math.sin(state.yaw), z: Math.cos(state.yaw) };
    controller.setFocus({
      position: { x: state.x + cfg.chunk * 0.5, z: state.z + cfg.chunk * 0.5 },
      velocity: { x: forward.x * state.speed, z: forward.z * state.speed },
      forward
    });
    controller.update();
    adapter.releasePatches(controller.takeReleasedPatchIds(), state);
    if (primeCenter) {
      const centerX = Math.floor((state.x + cfg.chunk * 0.5) / cfg.chunk);
      const centerZ = Math.floor((state.z + cfg.chunk * 0.5) / cfg.chunk);
      controller.generateSync(centerX, centerZ);
    }
    controller.pump({ maximum: workerState.worker ? STREAM.generationBudget : 1 });
    for (const patch of controller.takeReadyPatches({ maximum: STREAM.activationBudget })) adapter.activatePatch(patch, state);
    adapter.view.patchStats = controller.getStats();
  }

  game.start();
  updateStreaming(game.getState(), true);
  adapter.resetCamera(game.getState(), "initial-run");

  const start = () => {
    game.start();
    updateStreaming(game.getState(), true);
    adapter.resetCamera(game.getState(), "run-restart");
  };
  ui.button.onclick = () => game.getState().status === "game" ? game.setInput({ jump: true }) : start();
  addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) event.preventDefault();
    if (event.code === "Enter") start();
    if (["KeyA", "ArrowLeft"].includes(event.code)) input.left = true;
    if (["KeyD", "ArrowRight"].includes(event.code)) input.right = true;
    if (["KeyW", "ArrowUp"].includes(event.code)) input.boost = true;
    if (event.code === "Space") game.getState().status === "game" ? game.setInput({ jump: true }) : start();
  });
  addEventListener("keyup", (event) => {
    if (["KeyA", "ArrowLeft"].includes(event.code)) input.left = false;
    if (["KeyD", "ArrowRight"].includes(event.code)) input.right = false;
    if (["KeyW", "ArrowUp"].includes(event.code)) input.boost = false;
  });
  addEventListener("blur", () => {
    input.left = false;
    input.right = false;
    input.boost = false;
    game.setInput({ steer: 0, boost: false, jump: false });
  });
  addEventListener("resize", () => {
    adapter.camera.aspect = innerWidth / innerHeight;
    adapter.camera.updateProjectionMatrix();
    adapter.renderer.setSize(innerWidth, innerHeight);
  });

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    game.setInput({ steer: (input.left ? 1 : 0) - (input.right ? 1 : 0), boost: input.boost });
    engine.tick(dt);
    let state = game.getState();
    updateStreaming(state);

    if (state.status === "game") {
      physics?.setActorTransform?.("dino", { x: state.x, y: state.y + state.jumpHeight + playerBody.collision.centerY, z: state.z });
      const contacts = physics?.step?.(dt)?.contacts ?? [];
      const hit = contacts.some((contact) => contact.actorId === "dino") || adapter.view.colliders.some((collider) => Math.hypot(collider.x - state.x, collider.z - state.z) < collider.radius + playerBody.collision.radius && state.jumpHeight < 1.05);
      if (hit) game.fail({ kind: "tree-impact", x: state.x, z: state.z });
      for (const pickup of adapter.view.pickups) {
        if (Math.hypot(pickup.x - state.x, pickup.z - state.z) < pickup.radius + 0.4 && game.collectShard(pickup.id)) {
          adapter.refreshDynamicContent(game.getState());
          break;
        }
      }
      state = game.getState();
    }

    adapter.render(state, dt);
    const progress = Math.min(1, state.distance / cfg.goal);
    const patchStats = adapter.view.patchStats;
    ui.status.innerHTML = `<b style="color:#ffd37a">Prehistoric Rush</b><br>${state.status}<div style="height:7px;background:#ffffff22;margin:8px 0"><div style="height:100%;width:${(progress * 100).toFixed(1)}%;background:#84d778"></div></div>${Math.floor(state.distance)}m / ${cfg.goal}m · ${state.shards} shards<br>${state.speed.toFixed(1)} m/s · ${state.region} × ${state.surfaceMultiplier.toFixed(2)}<br><small>patches ${patchStats.active}/${patchStats.desiredActive} · cache ${patchStats.cached} · queue ${patchStats.queued} · ${workerState.worker ? "worker" : "fallback"}</small>`;
    ui.button.textContent = state.status === "game" ? "Jump" : state.status === "run-over" ? "Retry" : state.status === "win" ? "Run Again" : "Start Rush";
    requestAnimationFrame(loop);
  }

  globalThis.PrehistoricRushHost = {
    engine,
    physics,
    adapter,
    patchController: controller,
    cameraFollow,
    versions: { nexus: NEXUS_COMMIT, kits: KITS_COMMIT, protokits: PROTOKITS_COMMIT },
    getState: () => ({
      game: game.snapshot(),
      patchStreaming: controller.getSnapshot(),
      camera: cameraFollow.getSnapshot(),
      composition: engine.gameComposer,
      scene: engine.coreScene?.getSceneHostDescriptor?.(),
      playerProfile: { profileId: playerProfile.profileId, revision: playerProfile.revision },
      playerBody: { id: playerBody.id, contentHash: playerBody.contentHash, topology: playerBody.topology },
      renderer: "three-seeded-patch-streaming-neck-shadow-grass-v7"
    })
  };
  requestAnimationFrame(loop);
}

main().catch((error) => {
  console.error(error);
  document.body.textContent = `Could not start PrehistoricRush: ${error.message}`;
});
