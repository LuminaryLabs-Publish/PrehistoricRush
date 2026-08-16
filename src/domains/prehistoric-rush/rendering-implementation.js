import { applyCreaturePoseDamped, createCreatureMesh } from "../../render/three-procedural-creature.js";
import { createThreeTreeFidelityLayer } from "../../render/three-tree-fidelity-layer.js";
import { applyLushJungleAtmosphere } from "../../render/lush-jungle-atmosphere.js";
import { PREHISTORIC_TREE_ARCHETYPES, PREHISTORIC_TREE_TYPES } from "../../shared/tree-archetype-catalog.js";
import {
  FOUNDATION_FOREST_GENERATION_BUDGET,
  FOUNDATION_FOREST_RADIUS,
  FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  FOUNDATION_TERRAIN_PATCH_SEGMENTS,
  FOUNDATION_TERRAIN_PATCH_SIZE,
  FOUNDATION_TERRAIN_RETAIN_RADIUS,
  createCenteredPatchPlan,
  selectMissingPatchBatch
} from "./rendering-streaming-policy.js";

const FOREST_PATCH_SIZE = FOUNDATION_TERRAIN_PATCH_SIZE;
const TREES_PER_PATCH = 13;
const GRASS_PER_PATCH = 52;
const TREE_CAPACITY_PER_TYPE = 320;
const GRASS_CAPACITY = 5200;

function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function unit(seed, salt = "") {
  let value = hashText(`${seed}:${salt}`) || 1;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return (value >>> 0) / 4294967295;
}

function scaleTranslationMatrix(scaleX, scaleY, scaleZ, x, y, z, yaw = 0) {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return [
    c * scaleX, 0, -s * scaleX, 0,
    0, scaleY, 0, 0,
    s * scaleZ, 0, c * scaleZ, 0,
    x, y, z, 1
  ];
}

async function loadImage(url) {
  const image = new Image();
  image.decoding = "async";
  image.src = url.href;
  await image.decode();
  return image;
}

async function loadTreeFidelityPackages(onProgress = () => {}) {
  const root = new URL("../../../assets/tree-fidelity/", import.meta.url);
  onProgress(0.03, "Loading prehistoric tree manifest");
  const manifestResponse = await fetch(new URL("manifest.json", root));
  if (!manifestResponse.ok) throw new Error(`Tree Fidelity manifest failed: ${manifestResponse.status}`);
  const manifest = await manifestResponse.json();
  const entries = new Map(manifest.packages.map((entry) => [entry.archetypeId, entry]));
  const imagePromises = new Map();
  let completed = 0;

  const packages = await Promise.all(PREHISTORIC_TREE_ARCHETYPES.map(async (archetype) => {
    const entry = entries.get(archetype.id);
    if (!entry) throw new Error(`Tree Fidelity manifest is missing ${archetype.id}.`);
    const packageUrl = new URL(entry.file, root);
    const atlasUrl = new URL(entry.atlas, root);
    if (!imagePromises.has(atlasUrl.href)) imagePromises.set(atlasUrl.href, loadImage(atlasUrl));
    const [response, image] = await Promise.all([
      fetch(packageUrl),
      imagePromises.get(atlasUrl.href)
    ]);
    if (!response.ok) throw new Error(`Tree Fidelity package ${entry.file} failed: ${response.status}`);
    const packageValue = await response.json();
    if (packageValue.forms?.far?.atlas) packageValue.forms.far.atlas.runtimeImage = image;
    if (packageValue.forms?.horizon?.atlas) packageValue.forms.horizon.atlas.runtimeImage = image;
    completed += 1;
    onProgress(completed / PREHISTORIC_TREE_ARCHETYPES.length, `Loading forest · ${completed}/${PREHISTORIC_TREE_ARCHETYPES.length} species`);
    return packageValue;
  }));

  return packages;
}

function createTerrainMaterial(THREE) {
  return new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.97, metalness: 0 });
}

function createTerrainPatch(THREE, world, patchX, patchZ, material) {
  const size = FOUNDATION_TERRAIN_PATCH_SIZE;
  const geometry = new THREE.PlaneGeometry(size, size, FOUNDATION_TERRAIN_PATCH_SEGMENTS, FOUNDATION_TERRAIN_PATCH_SEGMENTS);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate((patchX + 0.5) * size, 0, (patchZ + 0.5) * size);
  const position = geometry.attributes.position;
  const colors = new Float32Array(position.count * 3);
  const low = new THREE.Color(0x355f2d);
  const high = new THREE.Color(0x6e7650);
  const wet = new THREE.Color(0x2b4a2c);
  const color = new THREE.Color();

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const z = position.getZ(index);
    const y = world.sampleElevation(x, z);
    position.setY(index, y);
    const elevation = Math.max(0, Math.min(1, (y + 55) / 150));
    color.copy(low).lerp(high, elevation * 0.68);
    const wetness = Math.max(0, Math.min(0.34, 0.17 + Math.sin(x * 0.016 + z * 0.011) * 0.1));
    color.lerp(wet, wetness);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `prehistoric-foundation-terrain:${patchX}:${patchZ}`;
  mesh.receiveShadow = true;
  return mesh;
}

function createCourseRibbon(THREE, world, route) {
  const samples = route.samples.filter((_, index) => index % 4 === 0);
  const positions = [];
  const indices = [];
  for (let index = 0; index < samples.length; index += 1) {
    const point = samples[index];
    const previous = samples[Math.max(0, index - 1)];
    const next = samples[Math.min(samples.length - 1, index + 1)];
    const dx = next.x - previous.x;
    const dz = next.z - previous.z;
    const length = Math.hypot(dx, dz) || 1;
    const nx = -dz / length;
    const nz = dx / length;
    const halfWidth = Number(point.width ?? route.pathHalfWidth ?? 3.1);
    const leftX = point.x + nx * halfWidth;
    const leftZ = point.z + nz * halfWidth;
    const rightX = point.x - nx * halfWidth;
    const rightZ = point.z - nz * halfWidth;
    positions.push(leftX, world.sampleElevation(leftX, leftZ) + 0.055, leftZ);
    positions.push(rightX, world.sampleElevation(rightX, rightZ) + 0.055, rightZ);
    if (index < samples.length - 1) {
      const base = index * 2;
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x79562f, roughness: 1 }));
  mesh.name = "prehistoric-course-ribbon";
  mesh.receiveShadow = true;
  return mesh;
}

function createGrassGeometry(THREE) {
  const source = new THREE.ConeGeometry(0.12, 1, 3, 1, true);
  source.translate(0, 0.5, 0);
  return source;
}

function createGrassLayer(THREE, scene) {
  const mesh = new THREE.InstancedMesh(
    createGrassGeometry(THREE),
    new THREE.MeshStandardMaterial({ color: 0x4d883d, roughness: 0.95, side: THREE.DoubleSide }),
    GRASS_CAPACITY
  );
  mesh.name = "prehistoric-foundation-grass";
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function createForestPatch(world, route, patchX, patchZ, worldSeed) {
  const id = `foundation-forest:${patchX}:${patchZ}`;
  const minX = patchX * FOREST_PATCH_SIZE - FOREST_PATCH_SIZE * 0.5;
  const minZ = patchZ * FOREST_PATCH_SIZE - FOREST_PATCH_SIZE * 0.5;
  const trees = PREHISTORIC_TREE_ARCHETYPES.map(() => ({ trunks: [], crowns: [] }));
  const grass = [];

  for (let index = 0; index < TREES_PER_PATCH; index += 1) {
    const seed = `${worldSeed}:${id}:tree:${index}`;
    const x = minX + unit(seed, "x") * FOREST_PATCH_SIZE;
    const z = minZ + unit(seed, "z") * FOREST_PATCH_SIZE;
    const nearest = route.nearest(x, z, 0, route.samples.length);
    if (nearest.distance < nearest.width + 6.5) continue;
    const typeIndex = Math.min(PREHISTORIC_TREE_ARCHETYPES.length - 1, Math.floor(unit(seed, "species") * PREHISTORIC_TREE_ARCHETYPES.length));
    const archetype = PREHISTORIC_TREE_ARCHETYPES[typeIndex];
    const y = world.sampleElevation(x, z);
    const scale = 0.84 + unit(seed, "scale") * 0.34;
    const height = archetype.averageHeight * scale * (0.9 + unit(seed, "height") * 0.2);
    const radius = archetype.trunkRadius * scale;
    const crownHeight = archetype.crownHeight * scale;
    const crownRadius = archetype.crownRadius * scale * (0.9 + unit(seed, "crown") * 0.22);
    const yawRadians = unit(seed, "yaw") * Math.PI * 2;
    const leanXRadians = (unit(seed, "lean-x") - 0.5) * 0.08;
    const leanZRadians = (unit(seed, "lean-z") - 0.5) * 0.08;
    const leanMargin = Math.sin(Math.max(Math.abs(leanXRadians), Math.abs(leanZRadians))) * height;
    const crownY = y + height * 0.78;
    const treeId = `${id}:tree:${index}`;
    const tintValue = 0.9 + unit(seed, "tint") * 0.2;
    const variation = {
      uniformScale: scale,
      heightScale: 1,
      crownScale: 1,
      yawDegrees: yawRadians * 180 / Math.PI,
      yawRadians,
      leanXDegrees: leanXRadians * 180 / Math.PI,
      leanZDegrees: leanZRadians * 180 / Math.PI,
      leanXRadians,
      leanZRadians,
      groundSink: 0,
      groundPosition: [x, y, z],
      tint: [tintValue, tintValue * (0.96 + unit(seed, "tint-g") * 0.05), tintValue * 0.94]
    };
    const metadata = { treeId, cellId: id, typeIndex, speciesId: archetype.id, variation };
    trees[typeIndex].trunks.push({
      id: `${treeId}:trunk`,
      matrix: scaleTranslationMatrix(radius, height, radius, x, y + height * 0.5, z, yawRadians),
      bounds: {
        min: [x - radius - leanMargin, y, z - radius - leanMargin],
        max: [x + radius + leanMargin, y + height, z + radius + leanMargin]
      },
      metadata
    });
    trees[typeIndex].crowns.push({
      id: `${treeId}:crown`,
      matrix: scaleTranslationMatrix(crownRadius, crownHeight, crownRadius, x, crownY, z, yawRadians),
      bounds: {
        min: [x - crownRadius, crownY - crownHeight * 0.5, z - crownRadius],
        max: [x + crownRadius, crownY + crownHeight * 0.5, z + crownRadius]
      },
      metadata
    });
  }

  for (let index = 0; index < GRASS_PER_PATCH; index += 1) {
    const seed = `${worldSeed}:${id}:grass:${index}`;
    const x = minX + unit(seed, "x") * FOREST_PATCH_SIZE;
    const z = minZ + unit(seed, "z") * FOREST_PATCH_SIZE;
    const nearest = route.nearest(x, z, 0, route.samples.length);
    if (nearest.distance < nearest.width + 0.8) continue;
    const y = world.sampleElevation(x, z);
    const height = 0.35 + unit(seed, "height") * 1.15;
    const width = 0.45 + unit(seed, "width") * 0.75;
    grass.push({
      id: `${id}:grass:${index}`,
      matrix: scaleTranslationMatrix(width, height, width, x, y, z, unit(seed, "yaw") * Math.PI * 2)
    });
  }

  return { id, x: patchX, z: patchZ, trees, grass };
}

function createShardLayer(THREE, scene, capacity = 160) {
  const mesh = new THREE.InstancedMesh(
    new THREE.OctahedronGeometry(0.34),
    new THREE.MeshStandardMaterial({ color: 0x8fe8ff, emissive: 0x43d4ff, emissiveIntensity: 1.15, roughness: 0.35 }),
    capacity
  );
  mesh.name = "prehistoric-shards";
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = false;
  scene.add(mesh);
  return mesh;
}

export async function createPrehistoricRushRenderingImplementation(THREE, {
  host,
  world,
  course,
  gameplay,
  creatureApi = null,
  playerBody = null,
  diagnosticFoundationOnly = false,
  onProgress = () => {}
} = {}) {
  if (!host || !world) throw new TypeError("Rendering requires host and World implementation.");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 1400);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);

  const terrainMaterial = createTerrainMaterial(THREE);
  const terrainPatches = new Map();
  function ensureTerrain(state = {}) {
    const activePlan = createCenteredPatchPlan(state, {
      size: FOUNDATION_TERRAIN_PATCH_SIZE,
      radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
      prefix: "foundation-terrain"
    });
    const retainedIds = new Set(createCenteredPatchPlan(state, {
      size: FOUNDATION_TERRAIN_PATCH_SIZE,
      radius: FOUNDATION_TERRAIN_RETAIN_RADIUS,
      prefix: "foundation-terrain"
    }).map((entry) => entry.id));
    for (const entry of activePlan) {
      if (terrainPatches.has(entry.id)) continue;
      const mesh = createTerrainPatch(THREE, world, entry.x, entry.z, terrainMaterial);
      terrainPatches.set(entry.id, mesh);
      scene.add(mesh);
    }
    for (const [id, mesh] of terrainPatches) {
      if (retainedIds.has(id)) continue;
      terrainPatches.delete(id);
      scene.remove(mesh);
      mesh.geometry?.dispose?.();
    }
  }

  onProgress(0.08, "Resolving local Nexus Foundation terrain");
  ensureTerrain({ x: 0, z: 0 });

  const hemisphere = new THREE.HemisphereLight(0xe1f2cf, 0x2c3d25, 1.5);
  const sun = new THREE.DirectionalLight(0xffdda0, 2.6);
  sun.position.set(-30, 55, -20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 190;
  scene.add(hemisphere, sun, sun.target);
  applyLushJungleAtmosphere(THREE, scene, renderer, { fogDensity: diagnosticFoundationOnly ? 0.0018 : 0.0062 });

  let courseRibbon = null;
  let treeFidelity = null;
  let grassMesh = null;
  let playerMesh = null;
  let shardMesh = null;
  const forestPatches = new Map();
  let elapsed = 0;

  if (!diagnosticFoundationOnly) {
    onProgress(0.16, "Restoring course and player presentation");
    if (course?.route) {
      courseRibbon = createCourseRibbon(THREE, world, course.route);
      scene.add(courseRibbon);
    }
    if (playerBody) {
      playerMesh = createCreatureMesh(THREE, playerBody);
      playerMesh.name = "prehistoric-rush-procedural-raptor";
      scene.add(playerMesh);
    }
    shardMesh = createShardLayer(THREE, scene);
    grassMesh = createGrassLayer(THREE, scene);
    const packages = await loadTreeFidelityPackages((progress, detail) => onProgress(0.22 + progress * 0.66, detail));
    treeFidelity = createThreeTreeFidelityLayer(THREE, {
      scene,
      camera,
      renderer,
      treeTypes: PREHISTORIC_TREE_TYPES,
      packages,
      capacity: TREE_CAPACITY_PER_TYPE
    });
  }

  const matrix = new THREE.Matrix4();
  function flushGrass() {
    if (!grassMesh) return;
    let index = 0;
    for (const patch of forestPatches.values()) {
      for (const record of patch.grass) {
        if (index >= GRASS_CAPACITY) break;
        grassMesh.setMatrixAt(index, matrix.fromArray(record.matrix));
        index += 1;
      }
    }
    grassMesh.count = index;
    grassMesh.instanceMatrix.needsUpdate = true;
  }

  function ensureForest(state) {
    if (!treeFidelity || diagnosticFoundationOnly) return;
    const plan = createCenteredPatchPlan(state, {
      size: FOREST_PATCH_SIZE,
      radius: FOUNDATION_FOREST_RADIUS,
      prefix: "foundation-forest"
    });
    const desiredIds = new Set(plan.map((entry) => entry.id));
    const batch = selectMissingPatchBatch(plan, new Set(forestPatches.keys()), FOUNDATION_FOREST_GENERATION_BUDGET);
    let changed = false;
    for (const entry of batch) {
      const patch = createForestPatch(world, course.route, entry.x, entry.z, world.recipe.seed);
      forestPatches.set(entry.id, patch);
      treeFidelity.activatePatch(patch);
      changed = true;
    }
    const released = [];
    for (const id of forestPatches.keys()) {
      if (desiredIds.has(id)) continue;
      forestPatches.delete(id);
      released.push(id);
      changed = true;
    }
    if (released.length) treeFidelity.releasePatches(released);
    if (changed) flushGrass();
  }

  function updateShards() {
    if (!shardMesh || !gameplay?.getPickups) return;
    const pickups = gameplay.getPickups();
    const count = Math.min(shardMesh.instanceMatrix.count || 160, pickups.length);
    for (let index = 0; index < count; index += 1) {
      const pickup = pickups[index];
      matrix.compose(
        new THREE.Vector3(pickup.x, pickup.y + Math.sin(elapsed * 2 + index) * 0.12, pickup.z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, elapsed * 0.8 + index * 0.11, 0)),
        new THREE.Vector3(1, 1, 1)
      );
      shardMesh.setMatrixAt(index, matrix);
    }
    shardMesh.count = count;
    shardMesh.instanceMatrix.needsUpdate = true;
  }

  function draw(state, framing, dt = 1 / 60) {
    elapsed += Math.max(0, Number(dt) || 0);
    ensureTerrain(state);
    if (framing) {
      camera.position.set(...framing.position);
      camera.lookAt(...framing.target);
    }
    if (!diagnosticFoundationOnly) {
      ensureForest(state);
      if (playerMesh) {
        playerMesh.position.set(state.x, state.y + state.jumpHeight + 0.05, state.z);
        playerMesh.rotation.y = state.yaw;
        if (creatureApi?.createPose) {
          const pose = creatureApi.createPose(playerBody.id, {
            speed: state.speed,
            time: elapsed,
            turn: 0,
            jump: Math.min(1, state.jumpHeight / 2),
            resistance: 1 - Number(state.surfaceMultiplier ?? 1)
          });
          applyCreaturePoseDamped(playerMesh, pose, dt, 18);
        }
      }
      treeFidelity?.update(state, dt);
      updateShards();
      if (grassMesh) grassMesh.rotation.y = Math.sin(elapsed * 0.11) * 0.002;
      if (shardMesh) shardMesh.rotation.y = elapsed * 0.18;
    }
    sun.position.set(state.x - 30, state.y + 55, state.z - 24);
    sun.target.position.set(state.x, state.y, state.z);
    renderer.render(scene, camera);
  }

  onProgress(1, diagnosticFoundationOnly ? "Foundation diagnostic ready" : "Prehistoric world ready");

  return Object.freeze({
    scene,
    camera,
    renderer,
    draw,
    snapshot: () => ({
      terrainAuthority: "n:world:foundation",
      terrainPatchCount: terrainPatches.size,
      terrainActiveRadius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
      vegetationEnabled: !diagnosticFoundationOnly,
      diagnosticFoundationOnly,
      playerPresentation: playerMesh ? "procedural-skinned-raptor" : diagnosticFoundationOnly ? "disabled-for-diagnostic" : "unavailable",
      treeFidelityPackageCount: treeFidelity?.view?.packageCount ?? 0,
      treeCount: treeFidelity?.view?.treeCount ?? 0,
      treeFidelityCounts: treeFidelity ? { ...treeFidelity.view.counts } : { near: 0, medium: 0, far: 0, horizon: 0 },
      grassCount: grassMesh?.count ?? 0,
      activeForestPatches: forestPatches.size,
      forestTargetPatchCount: (FOUNDATION_FOREST_RADIUS * 2 + 1) ** 2,
      forestGenerationBudget: FOUNDATION_FOREST_GENERATION_BUDGET,
      atmosphere: scene.fog ? "lush-jungle" : "none",
      courseVisible: Boolean(courseRibbon)
    })
  });
}
