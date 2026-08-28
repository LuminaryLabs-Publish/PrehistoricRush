import { applyCreaturePoseDamped, createCreatureMesh } from "../../render/three-procedural-creature.js";
import { createThreePrebuiltRacerModel } from "../../render/three-prebuilt-racer-model.js";
import { createThreePrebuiltTreeModel } from "../../render/three-prebuilt-tree-model.js";
import { createThreeTreeFidelityLayer } from "../../render/three-tree-fidelity-layer.js";
import { applyLushJungleAtmosphere } from "../../render/lush-jungle-atmosphere.js";
import { createThreeCinematicFidelityLayer } from "../../render/three-cinematic-fidelity-layer.js";
import { createThreeCinematicGroundLayer } from "../../render/three-cinematic-ground-layer.js";
import { PREHISTORIC_TREE_TYPES } from "../../shared/tree-archetype-catalog.js";
import {
  createPrehistoricVegetationGeneratorOptions,
  createPrehistoricVegetationRuntime
} from "../../shared/prehistoric-vegetation-domain.js";
import { createPrehistoricWorldPatchGenerator } from "../../world/prehistoric-world-patch-generator.js";
import {
  createAdaptivePixelRatioController,
  readWebGLRendererIdentity,
  resolvePrehistoricVisualQuality
} from "../../shared/prehistoric-visual-quality.js";
import {
  FOUNDATION_FOREST_GENERATION_BUDGET,
  FOUNDATION_FOREST_RADIUS,
  FOUNDATION_WORKER_STREAMING_POLICY,
  FOUNDATION_TERRAIN_ACTIVE_RADIUS,
  FOUNDATION_TERRAIN_PATCH_SEGMENTS,
  FOUNDATION_TERRAIN_PATCH_SIZE,
  FOUNDATION_TERRAIN_RETAIN_RADIUS,
  createCenteredPatchPlan
} from "./rendering-streaming-policy.js";
import { createWorkerPatchStreamingService } from "./worker-patch-streaming-service.js";
import { speciesIdsForPatch } from "./startup-asset-policy.js";

const TREE_CAPACITY_PER_TYPE = 320;

export function sampleFoundationTerrainNormal(world, x, z, step = FOUNDATION_TERRAIN_PATCH_SIZE / FOUNDATION_TERRAIN_PATCH_SEGMENTS) {
  if (typeof world?.sampleElevation !== "function") throw new TypeError("Terrain normal sampling requires World sampleElevation().");
  const spacing = Math.max(0.001, Number(step) || 1);
  const nx = world.sampleElevation(x - spacing, z) - world.sampleElevation(x + spacing, z);
  const ny = spacing * 2;
  const nz = world.sampleElevation(x, z - spacing) - world.sampleElevation(x, z + spacing);
  const length = Math.hypot(nx, ny, nz) || 1;
  return Object.freeze([nx / length, ny / length, nz / length]);
}

function shiftEntryElevation(entry, delta) {
  if (Array.isArray(entry?.matrix) && entry.matrix.length >= 16) entry.matrix[13] += delta;
  if (entry?.bounds?.min && entry?.bounds?.max) {
    entry.bounds.min[1] += delta;
    entry.bounds.max[1] += delta;
  }
}

/**
 * Worker patches carry deterministic local relief, but Foundation owns the
 * authoritative world elevation. Rebase presentation records once at the
 * activation boundary so trees and ground cover share the playable surface.
 */
export function projectVegetationPatchToFoundation(world, patch) {
  if (typeof world?.sampleElevation !== "function") throw new TypeError("Vegetation projection requires World sampleElevation().");
  if (!patch || patch.foundationElevationProjection === true) return patch;

  for (const family of patch.trees ?? []) {
    const byTree = new Map();
    for (const entry of [...(family?.trunks ?? []), ...(family?.crowns ?? [])]) {
      const treeId = String(entry?.metadata?.treeId ?? entry?.id ?? "");
      if (!byTree.has(treeId)) byTree.set(treeId, []);
      byTree.get(treeId).push(entry);
    }
    for (const entries of byTree.values()) {
      const first = entries[0];
      const variation = first?.metadata?.variation;
      const ground = variation?.groundPosition;
      if (!Array.isArray(ground) || ground.length < 3) continue;
      const sink = Number(variation?.groundSink ?? 0);
      const targetGroundY = world.sampleElevation(Number(ground[0]), Number(ground[2])) - sink;
      const delta = targetGroundY - Number(ground[1]);
      const shiftedVariations = new Set();
      for (const entry of entries) {
        shiftEntryElevation(entry, delta);
        const entryVariation = entry?.metadata?.variation;
        if (entryVariation && !shiftedVariations.has(entryVariation)) {
          entryVariation.groundPosition[1] = targetGroundY;
          shiftedVariations.add(entryVariation);
        }
      }
    }
  }

  for (const entry of patch.groundCover ?? []) {
    if (!Array.isArray(entry?.matrix) || entry.matrix.length < 16) continue;
    const x = Number(entry.matrix[12]);
    const z = Number(entry.matrix[14]);
    const sink = Number(entry?.metadata?.visualGroundSink ?? 0);
    shiftEntryElevation(entry, world.sampleElevation(x, z) - sink - Number(entry.matrix[13]));
  }
  for (const entry of patch.grass ?? []) {
    if (!Array.isArray(entry?.matrix) || entry.matrix.length < 16) continue;
    const x = Number(entry.matrix[12]);
    const z = Number(entry.matrix[14]);
    entry.matrix[13] = world.sampleElevation(x, z);
  }
  for (const collider of patch.colliders ?? []) {
    collider.y = world.sampleElevation(Number(collider.x), Number(collider.z));
  }
  for (const pickup of patch.pickups ?? []) {
    pickup.y = world.sampleElevation(Number(pickup.x), Number(pickup.z)) + 1.15;
  }
  patch.foundationElevationProjection = true;
  return patch;
}

function createTerrainMaterial(THREE) {
  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    roughness: 0.91,
    metalness: 0,
    clearcoat: 0.06,
    clearcoatRoughness: 0.82,
    sheen: 0.08,
    sheenRoughness: 0.88,
    sheenColor: new THREE.Color(0x69845d)
  });
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vPrehistoricWorldPosition;\nvarying vec3 vPrehistoricWorldNormal;"
      )
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvPrehistoricWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvPrehistoricWorldNormal = normalize(mat3(modelMatrix) * objectNormal);"
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying vec3 vPrehistoricWorldPosition;
varying vec3 vPrehistoricWorldNormal;
float prehistoricHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123); }
float prehistoricNoise(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(prehistoricHash(i), prehistoricHash(i + vec3(1,0,0)), f.x), mix(prehistoricHash(i + vec3(0,1,0)), prehistoricHash(i + vec3(1,1,0)), f.x), f.y), mix(mix(prehistoricHash(i + vec3(0,0,1)), prehistoricHash(i + vec3(1,0,1)), f.x), mix(prehistoricHash(i + vec3(0,1,1)), prehistoricHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float prehistoricFbm(vec3 p) {
  float n = prehistoricNoise(p) * 0.58; p = p * 2.03 + 7.1;
  n += prehistoricNoise(p) * 0.28; p = p * 2.11 - 4.2;
  return n + prehistoricNoise(p) * 0.14;
}
float prehistoricTriplanar(vec3 p, vec3 n) {
  vec3 weights = pow(abs(n), vec3(4.0));
  weights /= max(0.001, weights.x + weights.y + weights.z);
  float xy = prehistoricFbm(vec3(p.xy, 1.7));
  float yz = prehistoricFbm(vec3(p.yz, 3.1));
  float xz = prehistoricFbm(vec3(p.xz, 5.3));
  return xy * weights.z + yz * weights.x + xz * weights.y;
}`
      )
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        `vec3 worldNormal = normalize(vPrehistoricWorldNormal);
float slope = 1.0 - clamp(worldNormal.y, 0.0, 1.0);
float macroNoise = prehistoricFbm(vPrehistoricWorldPosition * 0.035);
float detailNoise = prehistoricTriplanar(vPrehistoricWorldPosition * 0.38, worldNormal);
vec3 routeColor = vec3(0.54, 0.38, 0.20);
vec3 mossColor = vec3(0.18, 0.39, 0.15);
vec3 rockColor = vec3(0.31, 0.34, 0.29);
float routeSignal = smoothstep(0.42, 0.62, diffuse.r) * smoothstep(0.16, 0.42, diffuse.g) * (1.0 - smoothstep(0.34, 0.52, diffuse.g));
float moss = smoothstep(0.44, 0.72, macroNoise) * (1.0 - slope) * (1.0 - routeSignal);
float rock = smoothstep(0.28, 0.72, slope + detailNoise * 0.22);
vec3 layeredSurface = diffuse;
layeredSurface = mix(layeredSurface, mossColor * mix(0.78, 1.18, detailNoise), moss * 0.46);
layeredSurface = mix(layeredSurface, rockColor * mix(0.78, 1.12, detailNoise), rock * 0.52);
layeredSurface = mix(layeredSurface, routeColor * mix(0.82, 1.16, detailNoise), routeSignal * 0.78);
layeredSurface *= mix(0.88, 1.13, macroNoise);
vec4 diffuseColor = vec4(layeredSurface, opacity);`
      )
      .replace(
        "float roughnessFactor = roughness;",
        "float roughnessFactor = clamp(roughness + prehistoricFbm(vPrehistoricWorldPosition * 0.5) * 0.16 - 0.08, 0.58, 1.0);"
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
vec3 prehistoricDetailGradient = vec3(dFdx(detailNoise), dFdy(detailNoise), 0.0);
normal = normalize(normal + prehistoricDetailGradient * mix(0.1, 0.28, slope));`
      );
  };
  material.customProgramCacheKey = () => "prehistoric-triplanar-height-blended-terrain-v2";
  return material;
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
  const normals = geometry.attributes.normal;
  const side = FOUNDATION_TERRAIN_PATCH_SEGMENTS + 1;
  const step = size / FOUNDATION_TERRAIN_PATCH_SEGMENTS;
  for (let zIndex = 0; zIndex < side; zIndex += 1) {
    for (let xIndex = 0; xIndex < side; xIndex += 1) {
      if (xIndex !== 0 && zIndex !== 0 && xIndex !== side - 1 && zIndex !== side - 1) continue;
      const index = zIndex * side + xIndex;
      const normal = sampleFoundationTerrainNormal(world, position.getX(index), position.getZ(index), step);
      normals.setXYZ(index, normal[0], normal[1], normal[2]);
    }
  }
  normals.needsUpdate = true;
  geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `prehistoric-foundation-terrain:${patchX}:${patchZ}`;
  mesh.receiveShadow = true;
  return mesh;
}

function createCourseRibbon(THREE, world, route, range = {}) {
  const startIndex = Math.max(0, Math.floor(Number(range.startIndex) || 0));
  const endIndex = Math.min(route.samples.length, Math.max(startIndex + 2, Math.floor(Number(range.endIndex) || route.samples.length)));
  const samples = route.samples.slice(startIndex, endIndex).filter((_, index) => index % 2 === 0);
  const positions = [];
  const uvs = [];
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
    uvs.push(0, index / Math.max(1, samples.length - 1), 1, index / Math.max(1, samples.length - 1));
    if (index < samples.length - 1) {
      const base = index * 2;
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  const material = new THREE.MeshPhysicalMaterial({ color: 0x8b6538, roughness: 0.94, metalness: 0, clearcoat: 0.035, clearcoatRoughness: 0.82 });
  material.defines = { ...(material.defines ?? {}), USE_UV: "" };
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nfloat trailHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}")
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        `float trailGrain = trailHash(floor(vUv * vec2(72.0, 420.0)));
float wornCenter = 1.0 - smoothstep(0.08, 0.48, abs(vUv.x - 0.5));
float edgeSoil = smoothstep(0.22, 0.5, abs(vUv.x - 0.5));
vec3 packedClay = vec3(0.56, 0.39, 0.21) * mix(0.82, 1.14, trailGrain);
vec3 looseSoil = vec3(0.38, 0.28, 0.17) * mix(0.82, 1.1, trailGrain);
vec3 trailColor = mix(looseSoil, packedClay, wornCenter * 0.72);
trailColor = mix(trailColor, vec3(0.29, 0.37, 0.18), edgeSoil * 0.2);
vec4 diffuseColor = vec4(trailColor, opacity);`
      )
      .replace("float roughnessFactor = roughness;", "float roughnessFactor = clamp(roughness - wornCenter * 0.09 + trailGrain * 0.08, 0.7, 1.0);");
  };
  material.customProgramCacheKey = () => "prehistoric-layered-dirt-trail-v1";
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = "prehistoric-course-ribbon";
  mesh.receiveShadow = true;
  return mesh;
}

function createShardLayer(THREE, scene, capacity = 160) {
  const mesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.34), new THREE.MeshStandardMaterial({ color: 0x8fe8ff, emissive: 0x43d4ff, emissiveIntensity: 1.15, roughness: 0.35 }), capacity);
  mesh.name = "prehistoric-shards";
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = false;
  scene.add(mesh);
  return mesh;
}

export function createPrehistoricRushRenderSurface(THREE, { host } = {}) {
  if (!host) throw new TypeError("Prehistoric Rush render surface requires a host element.");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x08130d);
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 1400);
  camera.position.set(0, 7, -14);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance", alpha: true });
  const rendererIdentity = readWebGLRendererIdentity(renderer);
  const qualityProfile = resolvePrehistoricVisualQuality(globalThis.location, globalThis, { rendererIdentity });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearAlpha(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);
  renderer.render(scene, camera);
  return Object.freeze({
    scene,
    camera,
    renderer,
    qualityProfile,
    renderLoadingFrame() { renderer.render(scene, camera); }
  });
}

function yieldRenderingStartupFrame() {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    globalThis.requestAnimationFrame?.(finish);
    globalThis.setTimeout?.(finish, 32);
    if (typeof globalThis.requestAnimationFrame !== "function" && typeof globalThis.setTimeout !== "function") finish();
  });
}

function yieldTreePreparationFrame() {
  return new Promise((resolve) => {
    if (typeof globalThis.requestAnimationFrame === "function") globalThis.requestAnimationFrame(resolve);
    else if (typeof globalThis.setTimeout === "function") globalThis.setTimeout(resolve, 0);
    else resolve();
  });
}

export async function createPrehistoricRushRenderingImplementation(THREE, {
  host,
  world,
  course,
  gameplay,
  Nexus = null,
  engine = null,
  creatureApi = null,
  racerPresentation = null,
  playerBody = null,
  renderSurface = null,
  assetSession = null,
  diagnosticFoundationOnly = false,
  onProgress = () => {},
  onFidelityState = () => {}
} = {}) {
  if (!host || !world) throw new TypeError("Rendering requires host and World implementation.");
  const resolvedRacerPresentation = racerPresentation
    ? {
        racerId: String(racerPresentation.racerId ?? "racer"),
        bodyDescriptor: racerPresentation.bodyDescriptor ?? playerBody,
        meshName: String(racerPresentation.meshName ?? "prehistoric-rush-procedural-racer"),
        snapshotName: String(racerPresentation.snapshotName ?? "procedural-skinned-racer"),
        accent: String(racerPresentation.accent ?? "#ffd66e"),
        rootOffsetY: Number(racerPresentation.rootOffsetY ?? 0.05),
        poseSharpness: Number(racerPresentation.poseSharpness ?? 18),
        turnScale: Number(racerPresentation.turnScale ?? 0.32),
        jumpNormalization: Math.max(0.01, Number(racerPresentation.jumpNormalization ?? 2))
      }
    : playerBody
      ? {
          racerId: "velociraptor",
          bodyDescriptor: playerBody,
          meshName: "prehistoric-rush-procedural-raptor",
          snapshotName: "procedural-skinned-raptor",
          rootOffsetY: 0.05,
          poseSharpness: 18,
          turnScale: 0.32,
          jumpNormalization: 2
        }
      : null;
  const racerBody = resolvedRacerPresentation?.bodyDescriptor ?? null;
  const renderStartedAt = performance.now();
  const surface = renderSurface ?? createPrehistoricRushRenderSurface(THREE, { host });
  const { qualityProfile, scene, camera, renderer } = surface;
  const adaptivePixelRatio = createAdaptivePixelRatioController(renderer, qualityProfile, globalThis);

  let denseWorldGPUActive = false;
  let denseVisualRevision = 0;
  const treeFidelityPackages = new Map();
  const prebuiltTreePreparations = new Map();
  const terrainMaterial = createTerrainMaterial(THREE);
  const terrainPatches = new Map();
  function ensureTerrain(state = {}, maximumNewPatches = Infinity) {
    const activePlan = createCenteredPatchPlan(state, { size: FOUNDATION_TERRAIN_PATCH_SIZE, radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS, prefix: "foundation-terrain" });
    const retainedIds = new Set(createCenteredPatchPlan(state, { size: FOUNDATION_TERRAIN_PATCH_SIZE, radius: FOUNDATION_TERRAIN_RETAIN_RADIUS, prefix: "foundation-terrain" }).map((entry) => entry.id));
    let created = 0;
    for (const entry of activePlan) {
      if (terrainPatches.has(entry.id)) continue;
      if (created >= maximumNewPatches) break;
      const mesh = createTerrainPatch(THREE, world, entry.x, entry.z, terrainMaterial);
      mesh.visible = !denseWorldGPUActive;
      terrainPatches.set(entry.id, mesh);
      scene.add(mesh);
      created += 1;
    }
    for (const [id, mesh] of terrainPatches) {
      if (retainedIds.has(id)) continue;
      terrainPatches.delete(id);
      scene.remove(mesh);
      mesh.geometry?.dispose?.();
    }
  }

  onProgress(0.08, "Resolving local Nexus Foundation terrain");
  const terrainStartedAt = performance.now();
  const initialFoundationPatchCount = 9;
  for (let patchIndex = 0; patchIndex < initialFoundationPatchCount; patchIndex += 1) {
    ensureTerrain({ x: 0, z: 0 }, 1);
    onProgress(0.08 + ((patchIndex + 1) / initialFoundationPatchCount) * 0.06, `Preparing starting terrain ${patchIndex + 1}/${initialFoundationPatchCount}`);
    surface.renderLoadingFrame?.();
    if (patchIndex + 1 < initialFoundationPatchCount) await yieldRenderingStartupFrame();
  }
  const initialTerrainMs = performance.now() - terrainStartedAt;

  const hemisphere = new THREE.HemisphereLight(0xe1f2cf, 0x2c3d25, 1.5);
  const sun = new THREE.DirectionalLight(0xffdda0, 2.6);
  sun.position.set(-30, 55, -20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(qualityProfile.shadowMapSize, qualityProfile.shadowMapSize);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 190;
  sun.shadow.camera.left = -qualityProfile.shadowRadius;
  sun.shadow.camera.right = qualityProfile.shadowRadius;
  sun.shadow.camera.top = qualityProfile.shadowRadius;
  sun.shadow.camera.bottom = -qualityProfile.shadowRadius;
  sun.shadow.bias = -0.0003;
  sun.shadow.normalBias = 0.035;
  sun.shadow.radius = qualityProfile.id === "performance" ? 1 : 2;
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(hemisphere, sun, sun.target);
  const atmosphere = applyLushJungleAtmosphere(THREE, scene, renderer, {
    fogDensity: diagnosticFoundationOnly ? 0.0018 : 0.0062,
    shadowMapSize: qualityProfile.shadowMapSize,
    shadowRadius: qualityProfile.shadowRadius,
    exposure: qualityProfile.id === "cinematic" ? 1.04 : 1.08
  });
  const fallbackBackground = atmosphere.background;
  const cinematicFidelity = diagnosticFoundationOnly ? null : createThreeCinematicFidelityLayer(THREE, { scene, camera, profile: qualityProfile, sun });

  let courseRibbon = null;
  let courseRibbonRange = null;
  let treeFidelity = null;
  let treeFidelityStatus = diagnosticFoundationOnly ? "disabled" : "proxy";
  let treeFidelityError = null;
  let treeFidelityLoadMs = 0;
  let cinematicGround = null;
  let playerMesh = null;
  let prebuiltRacer = null;
  let playerModelStatus = diagnosticFoundationOnly ? "disabled" : "procedural-fallback";
  let abilityPulse = null;
  let speedWake = null;
  let pickupPulse = null;
  let pickupPulseElapsed = Infinity;
  let lastShardCount = 0;
  let shardMesh = null;
  const cameraFeedback = { fov: camera.fov, speed01: 0, sprint01: 0, jump01: 0 };
  let groundAlignmentError = 0;
  const forestPatches = new Map();
  let workerStreaming = null;
  let resolveInitialForestReady = null;
  const initialForestReady = diagnosticFoundationOnly
    ? Promise.resolve(null)
    : new Promise((resolve) => { resolveInitialForestReady = resolve; });
  let elapsed = 0;

  function applyDenseWorldVisibility() {
    for (const mesh of terrainPatches.values()) mesh.visible = !denseWorldGPUActive;
    cinematicGround?.setVisible(!denseWorldGPUActive);
    cinematicFidelity?.setVisible(!denseWorldGPUActive);
    scene.traverse((object) => {
      if (String(object?.name ?? "").startsWith("prehistoric-tree-fidelity-")) object.visible = !denseWorldGPUActive;
    });
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.zIndex = denseWorldGPUActive ? "2" : "1";
    if (denseWorldGPUActive) {
      scene.background = null;
      renderer.setClearAlpha(0);
    } else {
      scene.background = fallbackBackground;
      renderer.setClearAlpha(1);
    }
  }

  if (!diagnosticFoundationOnly) {
    onProgress(0.16, "Restoring course and player presentation");
    if (course?.route) {
      courseRibbonRange = { startIndex: 0, endIndex: Math.min(course.route.samples.length, 384) };
      courseRibbon = createCourseRibbon(THREE, world, course.route, courseRibbonRange);
      scene.add(courseRibbon);
    }
    if (racerBody) {
      const modelBuffer = assetSession?.getRacerModelBuffer?.();
      const modelRecord = assetSession?.getRacerModelRecord?.();
      if (modelBuffer instanceof ArrayBuffer) {
        try {
          prebuiltRacer = await createThreePrebuiltRacerModel(THREE, modelBuffer, {
            name: `${resolvedRacerPresentation.racerId}-${modelRecord?.variant ?? "production"}-glb`,
            transform: modelRecord?.runtimeTransform
          });
          playerMesh = prebuiltRacer.object;
          playerModelStatus = "prebuilt-glb";
        } catch (error) {
          playerModelStatus = "procedural-fallback";
          onFidelityState(Object.freeze({ status: "degraded", subject: "selected-racer-model", error: error?.message ?? String(error) }));
        }
      }
      if (!playerMesh) playerMesh = createCreatureMesh(THREE, racerBody);
      playerMesh.name = resolvedRacerPresentation.meshName;
      scene.add(playerMesh);
      abilityPulse = new THREE.Mesh(
        new THREE.RingGeometry(0.7, 0.82, 48),
        new THREE.MeshBasicMaterial({ color: resolvedRacerPresentation.accent, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
      );
      abilityPulse.name = `${resolvedRacerPresentation.racerId}-ability-pulse`;
      abilityPulse.rotation.x = -Math.PI / 2;
      abilityPulse.visible = false;
      scene.add(abilityPulse);
      speedWake = new THREE.Mesh(
        new THREE.RingGeometry(1.15, 1.22, 48),
        new THREE.MeshBasicMaterial({ color: resolvedRacerPresentation.accent, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      speedWake.name = `${resolvedRacerPresentation.racerId}-speed-wake`;
      speedWake.rotation.x = -Math.PI / 2;
      speedWake.visible = false;
      speedWake.renderOrder = 12;
      scene.add(speedWake);
      pickupPulse = new THREE.Mesh(
        new THREE.RingGeometry(0.42, 0.5, 32),
        new THREE.MeshBasicMaterial({ color: 0x8fe8ff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      pickupPulse.name = `${resolvedRacerPresentation.racerId}-pickup-pulse`;
      pickupPulse.rotation.x = -Math.PI / 2;
      pickupPulse.visible = false;
      pickupPulse.renderOrder = 13;
      scene.add(pickupPulse);
    }
    shardMesh = createShardLayer(THREE, scene);
    cinematicGround = createThreeCinematicGroundLayer(THREE, { scene, camera, profile: qualityProfile });
  }

  const treeLoadStartedAt = performance.now();
  let resolveRichPresentationReady = null;
  const richPresentationReady = diagnosticFoundationOnly
    ? Promise.resolve(null)
    : new Promise((resolve) => { resolveRichPresentationReady = resolve; });
  let fullFidelityScheduled = false;
  let fullFidelityAttemptComplete = diagnosticFoundationOnly;
  let lastFidelityStateSignature = "";

  function syncFidelityState() {
    const packageCount = treeFidelity?.view?.packageCount ?? 0;
    treeFidelityStatus = packageCount >= PREHISTORIC_TREE_TYPES.length
      ? "ready"
      : treeFidelityError
        ? "degraded"
        : packageCount > 0
          ? "loading"
          : "proxy";
    treeFidelityLoadMs = performance.now() - treeLoadStartedAt;
    const fidelityState = Object.freeze({
      status: treeFidelityStatus,
      packageCount,
      packageTotal: PREHISTORIC_TREE_TYPES.length,
      proxyPackageCount: treeFidelity?.view?.proxyPackageCount ?? PREHISTORIC_TREE_TYPES.length,
      prebuiltPackageCount: treeFidelity?.view?.prebuiltPackageCount ?? 0,
      factoryBatchCount: treeFidelity?.view?.factoryBatchCount ?? 0,
      factorySourceMeshCount: treeFidelity?.view?.factorySourceMeshCount ?? 0,
      fullAttemptComplete: fullFidelityAttemptComplete,
      error: treeFidelityError?.message ?? null
    });
    const signature = `${fidelityState.status}:${fidelityState.packageCount}:${fidelityState.proxyPackageCount}:${fidelityState.prebuiltPackageCount}:${fidelityState.factorySourceMeshCount}:${fidelityState.error ?? ""}`;
    if (signature !== lastFidelityStateSignature) {
      lastFidelityStateSignature = signature;
      onFidelityState(fidelityState);
    }
    const pendingPackageUpgrades = treeFidelity?.view?.pendingPackageUpgrades ?? 0;
    if (fullFidelityAttemptComplete && pendingPackageUpgrades === 0 && resolveRichPresentationReady) {
      resolveRichPresentationReady(treeFidelity);
      resolveRichPresentationReady = null;
      onProgress(1, packageCount >= PREHISTORIC_TREE_TYPES.length
        ? "Full forest fidelity ready"
        : `Forest fidelity settled with ${packageCount}/${PREHISTORIC_TREE_TYPES.length} detailed species; proxies remain active`);
    }
  }

  function prepareTreePackage(packageValue) {
    const modelBuffer = packageValue?.prebuiltModel?.modelBuffer;
    if (!(modelBuffer instanceof ArrayBuffer)) return Promise.resolve(packageValue);
    const archetypeId = String(packageValue.archetypeId ?? "");
    const existing = prebuiltTreePreparations.get(archetypeId);
    if (existing) return existing;
    const preparation = createThreePrebuiltTreeModel(THREE, modelBuffer)
      .then((prebuiltTree) => {
        const { prebuiltModel: _prebuiltModel, ...packageWithoutBinary } = packageValue;
        return Object.freeze({ ...packageWithoutBinary, prebuiltTree });
      })
      .catch((error) => {
        treeFidelityError = error instanceof Error ? error : new Error(String(error));
        return packageValue;
      });
    prebuiltTreePreparations.set(archetypeId, preparation);
    return preparation;
  }

  async function queueFidelityPackages(packages) {
    let preparedCount = 0;
    for (const packageValue of packages) {
      if (!packageValue?.archetypeId || treeFidelityPackages.has(packageValue.archetypeId)) continue;
      if (preparedCount > 0) await yieldTreePreparationFrame();
      const preparedPackage = await prepareTreePackage(packageValue);
      if (treeFidelityPackages.has(packageValue.archetypeId)) continue;
      treeFidelityPackages.set(packageValue.archetypeId, preparedPackage);
      treeFidelity?.queuePackage(preparedPackage);
      preparedCount += 1;
    }
    syncFidelityState();
  }

  function requestSpecies(speciesIds, priority = "background") {
    if (!assetSession || speciesIds.length === 0) return;
    treeFidelityStatus = treeFidelityPackages.size > 0 ? "loading" : "proxy";
    assetSession.requestSpecies(speciesIds, {
      priority,
      onFailure(speciesId, error) {
        treeFidelityError = error instanceof Error ? error : new Error(String(error));
        onFidelityState(Object.freeze({ status: "degraded", speciesId, error: treeFidelityError.message }));
      }
    }).then(queueFidelityPackages).catch((error) => {
      treeFidelityError = error instanceof Error ? error : new Error(String(error));
      syncFidelityState();
    });
  }

  function scheduleFullFidelity() {
    if (fullFidelityScheduled) return;
    fullFidelityScheduled = true;
    if (!assetSession) {
      fullFidelityAttemptComplete = true;
      syncFidelityState();
      return;
    }
    const request = () => assetSession.requestAllSpecies({
      priority: "idle",
      onFailure(_speciesId, error) {
        treeFidelityError = error instanceof Error ? error : new Error(String(error));
        syncFidelityState();
      }
    }).then(async (packages) => {
      await queueFidelityPackages(packages);
      fullFidelityAttemptComplete = true;
      syncFidelityState();
    }).catch((error) => {
      treeFidelityError = error instanceof Error ? error : new Error(String(error));
      fullFidelityAttemptComplete = true;
      syncFidelityState();
    });
    if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(request, { timeout: 2500 });
    else globalThis.setTimeout?.(request, 250);
  }

  if (!diagnosticFoundationOnly) {
    treeFidelity = createThreeTreeFidelityLayer(THREE, {
      scene,
      camera,
      renderer,
      treeTypes: PREHISTORIC_TREE_TYPES,
      packages: [],
      capacity: TREE_CAPACITY_PER_TYPE,
      projectedThresholdScale: qualityProfile.treeLodThresholdScale
    });
    if (!Nexus || !engine) throw new Error("Worker forest fallback requires the active Nexus Engine and Object Vegetation domain.");
    const vegetationRuntime = createPrehistoricVegetationRuntime(Nexus, { engine });
    const generatorOptions = {
      config: {
        seed: Number(world.recipe.seed),
        chunk: FOUNDATION_WORKER_STREAMING_POLICY.patchSize,
        segments: FOUNDATION_WORKER_STREAMING_POLICY.terrainSegments,
        trees: Math.max(8, Math.round(22 * Number(qualityProfile.treeDensity ?? 1))),
        grass: Math.max(96, Math.round(104 * Number(qualityProfile.groundDensity ?? 1))),
        groundCover: Math.max(12, Math.round(Number(world.recipe.runtime?.groundCover ?? 36) * Number(qualityProfile.groundDensity ?? 1))),
        shardsPerPatch: 2
      },
      routeSamples: course.route.samples,
      worldRecipe: structuredClone(world.recipe)
    };
    const fallbackGenerator = createPrehistoricWorldPatchGenerator({
      ...generatorOptions,
      ...createPrehistoricVegetationGeneratorOptions(vegetationRuntime)
    });
    const hardwareConcurrency = Math.max(2, Number(globalThis.navigator?.hardwareConcurrency ?? 2));
    workerStreaming = createWorkerPatchStreamingService({
      workerUrl: new URL("../../workers/prehistoric-patch-worker.js", import.meta.url),
      generatorOptions,
      fallbackGenerator,
      policy: {
        ...FOUNDATION_WORKER_STREAMING_POLICY,
        workerCount: Math.max(1, Math.min(
          FOUNDATION_WORKER_STREAMING_POLICY.workerCountMaximum,
          hardwareConcurrency - 1
        ))
      },
      onActivate(patch) {
        projectVegetationPatchToFoundation(world, patch);
        forestPatches.set(patch.id, patch);
        treeFidelity.activatePatch(patch);
        cinematicGround?.activatePatch(patch);
        requestSpecies(speciesIdsForPatch(patch), "visible");
        scheduleFullFidelity();
        denseVisualRevision += 1;
        if (resolveInitialForestReady) {
          resolveInitialForestReady(patch);
          resolveInitialForestReady = null;
        }
      },
      onRelease(id) {
        if (!forestPatches.delete(id)) return;
        treeFidelity.releasePatches([id]);
        cinematicGround?.releasePatches([id]);
        denseVisualRevision += 1;
      }
    });
    syncFidelityState();
    applyDenseWorldVisibility();
  }
  const densePresentationReady = diagnosticFoundationOnly
    ? richPresentationReady
    : Promise.all([richPresentationReady, initialForestReady]).then(([result]) => result);
  densePresentationReady.catch(() => {});

  const matrix = new THREE.Matrix4();
  const shardPosition = new THREE.Vector3();
  const shardQuaternion = new THREE.Quaternion();
  const shardEuler = new THREE.Euler();
  const shardScale = new THREE.Vector3(1, 1, 1);

  function ensureCourseRibbon(state = {}) {
    if (!course?.route || !courseRibbonRange) return;
    const routeIndex = Math.max(0, Math.floor(Number(state.routeIndex) || 0));
    if (routeIndex >= courseRibbonRange.startIndex + 64 && routeIndex < courseRibbonRange.endIndex - 64) return;
    const startIndex = Math.max(0, Math.floor(routeIndex / 256) * 256 - 64);
    const endIndex = Math.min(course.route.samples.length, startIndex + 384);
    if (startIndex === courseRibbonRange.startIndex && endIndex === courseRibbonRange.endIndex) return;
    const previous = courseRibbon;
    courseRibbonRange = { startIndex, endIndex };
    courseRibbon = createCourseRibbon(THREE, world, course.route, courseRibbonRange);
    scene.add(courseRibbon);
    if (previous) {
      scene.remove(previous);
      previous.geometry?.dispose?.();
      previous.material?.dispose?.();
    }
  }

  function updateShards() {
    if (!shardMesh || !gameplay?.getPickups) return;
    const pickups = gameplay.getPickups();
    const count = Math.min(shardMesh.instanceMatrix.count || 160, pickups.length);
    for (let index = 0; index < count; index += 1) {
      const pickup = pickups[index];
      shardPosition.set(pickup.x, pickup.y + Math.sin(elapsed * 2 + index) * 0.12, pickup.z);
      shardEuler.set(0, elapsed * 0.8 + index * 0.11, 0);
      shardQuaternion.setFromEuler(shardEuler);
      matrix.compose(shardPosition, shardQuaternion, shardScale);
      shardMesh.setMatrixAt(index, matrix);
    }
    shardMesh.count = count;
    shardMesh.instanceMatrix.needsUpdate = true;
  }

  function updateSpeedFeedback(state = {}, deltaTime = 1 / 60) {
    const speed01 = Math.min(1, Math.max(0, Number(state.speed01) || 0));
    const activeRun = state.status === "game";
    const sprinting = state.paceMode === "sprint";
    if (speedWake) {
      const visible = activeRun && speed01 > 0.48;
      speedWake.visible = visible;
      speedWake.position.set(state.x, state.y + 0.045, state.z);
      speedWake.scale.setScalar(0.82 + speed01 * 0.38);
      speedWake.rotation.z = elapsed * (0.22 + speed01 * 0.42);
      speedWake.material.opacity = visible ? 0.018 + speed01 * 0.045 + (sprinting ? 0.024 : 0) : 0;
    }
    const shardCount = Math.max(0, Number(state.shards) || 0);
    if (shardCount < lastShardCount) {
      pickupPulseElapsed = Infinity;
      if (pickupPulse) pickupPulse.visible = false;
    } else if (shardCount > lastShardCount) {
      pickupPulseElapsed = 0;
      if (pickupPulse) {
        pickupPulse.visible = true;
        pickupPulse.position.set(state.x, state.y + 0.06, state.z);
      }
    }
    lastShardCount = shardCount;
    if (pickupPulse?.visible) {
      pickupPulseElapsed += Math.max(0, Number(deltaTime) || 0);
      const progress = Math.min(1, pickupPulseElapsed / 0.36);
      pickupPulse.position.set(state.x, state.y + 0.06, state.z);
      pickupPulse.scale.setScalar(0.65 + progress * 2.4);
      pickupPulse.material.opacity = Math.max(0, 0.7 * (1 - progress));
      if (progress >= 1) pickupPulse.visible = false;
    }
  }

  function draw(state, framing, dt = 1 / 60) {
    elapsed += Math.max(0, Number(dt) || 0);
    const stateGroundY = Number(state.y);
    const sampledGroundY = Number(world.sampleElevation(state.x, state.z));
    groundAlignmentError = Number.isFinite(stateGroundY) && Number.isFinite(sampledGroundY)
      ? Math.abs(stateGroundY - sampledGroundY)
      : null;
    ensureTerrain(state, 1);
    if (framing) {
      camera.position.set(...framing.position);
      if (Number.isFinite(Number(framing.fov)) && Math.abs(camera.fov - Number(framing.fov)) > 0.001) {
        camera.fov = Number(framing.fov);
        camera.updateProjectionMatrix();
      }
      cameraFeedback.fov = camera.fov;
      cameraFeedback.speed01 = Math.min(1, Math.max(0, Number(framing.speed01) || 0));
      cameraFeedback.sprint01 = Math.min(1, Math.max(0, Number(framing.sprint01) || 0));
      cameraFeedback.jump01 = Math.min(1, Math.max(0, Number(framing.jump01) || 0));
      camera.lookAt(...framing.target);
    }
    if (!diagnosticFoundationOnly) {
      ensureCourseRibbon(state);
      workerStreaming?.update(state);
      if (playerMesh) {
        playerMesh.position.set(state.x, state.y + state.jumpHeight + resolvedRacerPresentation.rootOffsetY, state.z);
        playerMesh.rotation.y = state.yaw;
        if (prebuiltRacer) prebuiltRacer.update(state, dt);
        else if (creatureApi?.createPose) {
          const turn = Math.max(-1, Math.min(1, Number(state.steer ?? 0))) * resolvedRacerPresentation.turnScale;
          const pose = creatureApi.createPose(racerBody.id, {
            speed: state.speed,
            time: elapsed,
            turn,
            jump: Math.min(1, state.jumpHeight / resolvedRacerPresentation.jumpNormalization),
            resistance: 1 - Number(state.surfaceMultiplier ?? 1)
          });
          applyCreaturePoseDamped(playerMesh, pose, dt, resolvedRacerPresentation.poseSharpness);
        }
      }
      if (abilityPulse) {
        const active = state.abilityStatus === "active";
        const progress = active ? Math.min(1, Number(state.abilityElapsed ?? 0) / 1.35) : 0;
        abilityPulse.visible = active;
        abilityPulse.position.set(state.x, state.y + 0.09, state.z);
        abilityPulse.scale.setScalar(1 + progress * 4.2);
        abilityPulse.material.opacity = active ? Math.max(0.12, 0.82 * (1 - progress)) : 0;
      }
      treeFidelity?.update(state, dt);
      syncFidelityState();
      cinematicGround?.update(state, dt);
      updateShards();
      updateSpeedFeedback(state, dt);
      if (shardMesh) shardMesh.rotation.y = elapsed * 0.18;
    }
    if (denseWorldGPUActive) applyDenseWorldVisibility();
    sun.position.set(state.x - 30, state.y + 55, state.z - 24);
    sun.target.position.set(state.x, state.y, state.z);
    adaptivePixelRatio.update(dt);
    cinematicFidelity?.update(state, dt);
    renderer.render(scene, camera);
  }

  function getDenseWorldPresentation() {
    let treeCount = 0;
    for (const patch of forestPatches.values()) for (const treeSet of patch.trees) treeCount += Math.min(treeSet.trunks.length, treeSet.crowns.length);
    const orderedTreePackages = PREHISTORIC_TREE_TYPES
      .map((treeType) => treeFidelityPackages.get(treeType?.[6]?.id))
      .filter(Boolean);
    return Object.freeze({
      revision: denseVisualRevision,
      terrainPatchCount: terrainPatches.size,
      terrainPatchIds: [...terrainPatches.keys()].sort(),
      forestPatchCount: forestPatches.size,
      treePackageCount: orderedTreePackages.length,
      treeCount,
      treePackages: orderedTreePackages,
      forestPatches: [...forestPatches.values()]
    });
  }

  function setDenseWorldGPUActive(active) {
    denseWorldGPUActive = Boolean(active);
    applyDenseWorldVisibility();
    return denseWorldGPUActive;
  }

  const playableRendererMs = performance.now() - renderStartedAt;
  globalThis.addEventListener?.("pagehide", () => {
    workerStreaming?.dispose();
    prebuiltRacer?.dispose();
    for (const effect of [abilityPulse, speedWake, pickupPulse]) {
      effect?.geometry?.dispose?.();
      effect?.material?.dispose?.();
    }
  }, { once: true });
  onProgress(1, diagnosticFoundationOnly ? "Foundation diagnostic ready" : "Playable world ready · proxy forest active · fidelity streaming");

  return Object.freeze({
    scene, camera, renderer, qualityProfile, draw, getDenseWorldPresentation, setDenseWorldGPUActive,
    whenRichPresentationReady() { return densePresentationReady; },
    snapshot: () => ({
      terrainAuthority: "n:world:foundation",
      terrainPatchCount: terrainPatches.size,
      terrainPatchIds: [...terrainPatches.keys()].sort(),
      terrainActiveRadius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
      vegetationEnabled: !diagnosticFoundationOnly,
      diagnosticFoundationOnly,
      denseWorldPresentation: denseWorldGPUActive ? "nexus-webgpu" : "three-webgl2",
      racerId: resolvedRacerPresentation?.racerId ?? null,
      playerPresentation: playerMesh ? (prebuiltRacer ? `prebuilt-glb-${resolvedRacerPresentation.racerId}` : resolvedRacerPresentation.snapshotName) : diagnosticFoundationOnly ? "disabled-for-diagnostic" : "unavailable",
      playerModelStatus,
      playerAnimationClips: prebuiltRacer?.animations ?? [],
      abilityEffectVisible: Boolean(abilityPulse?.visible),
      speedFeedbackVisible: Boolean(speedWake?.visible),
      pickupFeedbackVisible: Boolean(pickupPulse?.visible),
      cameraFeedback: { ...cameraFeedback },
      groundAlignmentError,
      treeFidelityStatus,
      treeFidelityError: treeFidelityError?.message ?? null,
      treeFidelityPackageCount: treeFidelity?.view?.packageCount ?? 0,
      treeFidelityProxyPackageCount: treeFidelity?.view?.proxyPackageCount ?? 0,
      treeFidelityPrebuiltPackageCount: treeFidelity?.view?.prebuiltPackageCount ?? 0,
      treeFidelityFactoryBatchCount: treeFidelity?.view?.factoryBatchCount ?? 0,
      treeFidelityFactorySourceMeshCount: treeFidelity?.view?.factorySourceMeshCount ?? 0,
      treeFidelityPendingUpgrades: treeFidelity?.view?.pendingPackageUpgrades ?? 0,
      treeCount: treeFidelity?.view?.treeCount ?? 0,
      treeFidelityCounts: treeFidelity ? { ...treeFidelity.view.counts } : { near: 0, medium: 0, far: 0, horizon: 0 },
      grassCount: cinematicGround?.view?.grass ?? 0,
      activeForestPatches: forestPatches.size,
      activeForestPatchIds: [...forestPatches.keys()].sort(),
      forestTargetPatchCount: (FOUNDATION_FOREST_RADIUS * 2 + 1) ** 2,
      forestGenerationBudget: FOUNDATION_FOREST_GENERATION_BUDGET,
      workerStreaming: workerStreaming?.snapshot() ?? null,
      atmosphere: scene.fog ? "lush-jungle" : "none",
      visualQuality: qualityProfile.id,
      rendererPreference: qualityProfile.rendererPreference,
      adaptiveResolution: adaptivePixelRatio.getSnapshot(),
      cinematicFidelity: cinematicFidelity?.view ?? null,
      cinematicGround: cinematicGround ? { ...cinematicGround.view } : null,
      courseVisible: Boolean(courseRibbon),
      courseRibbonRange: courseRibbonRange ? { ...courseRibbonRange } : null,
      performance: { playableRendererMs, initialTerrainMs, treeFidelityLoadMs }
    })
  });
}
