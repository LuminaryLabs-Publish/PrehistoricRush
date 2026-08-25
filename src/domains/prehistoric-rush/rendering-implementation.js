import { applyCreaturePoseDamped, createCreatureMesh } from "../../render/three-procedural-creature.js";
import { createThreeTreeFidelityLayer } from "../../render/three-tree-fidelity-layer.js";
import { applyLushJungleAtmosphere } from "../../render/lush-jungle-atmosphere.js";
import { createThreeCinematicFidelityLayer } from "../../render/three-cinematic-fidelity-layer.js";
import { createThreeCinematicGroundLayer } from "../../render/three-cinematic-ground-layer.js";
import { PREHISTORIC_TREE_ARCHETYPES, PREHISTORIC_TREE_TYPES } from "../../shared/tree-archetype-catalog.js";
import {
  createAdaptivePixelRatioController,
  resolvePrehistoricVisualQuality
} from "../../shared/prehistoric-visual-quality.js";
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
const TREE_CAPACITY_PER_TYPE = 320;
const GRASS_CAPACITY = 7600;

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
        "#include <worldpos_vertex>\nvPrehistoricWorldPosition = worldPosition.xyz;\nvPrehistoricWorldNormal = normalize(mat3(modelMatrix) * objectNormal);"
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
  material.customProgramCacheKey = () => "prehistoric-triplanar-height-blended-terrain-v1";
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
  geometry.computeBoundingSphere();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `prehistoric-foundation-terrain:${patchX}:${patchZ}`;
  mesh.receiveShadow = true;
  return mesh;
}

function createCourseRibbon(THREE, world, route) {
  const samples = route.samples.filter((_, index) => index % 4 === 0);
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

function createForestPatch(world, route, patchX, patchZ, worldSeed, qualityProfile) {
  const id = `foundation-forest:${patchX}:${patchZ}`;
  const minX = patchX * FOREST_PATCH_SIZE - FOREST_PATCH_SIZE * 0.5;
  const minZ = patchZ * FOREST_PATCH_SIZE - FOREST_PATCH_SIZE * 0.5;
  const trees = PREHISTORIC_TREE_ARCHETYPES.map(() => ({ trunks: [], crowns: [] }));
  const grass = [];
  const treesPerPatch = Math.max(8, Math.round(22 * Number(qualityProfile?.treeDensity ?? 1)));
  const grassPerPatch = Math.max(30, Math.round(104 * Number(qualityProfile?.groundDensity ?? 1)));

  for (let index = 0; index < treesPerPatch; index += 1) {
    const seed = `${worldSeed}:${id}:tree:${index}`;
    const x = minX + unit(seed, "x") * FOREST_PATCH_SIZE;
    const z = minZ + unit(seed, "z") * FOREST_PATCH_SIZE;
    const nearest = route.nearest(x, z, 0, route.samples.length);
    if (nearest.distance < nearest.width + 5.25) continue;
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
      bounds: { min: [x - radius - leanMargin, y, z - radius - leanMargin], max: [x + radius + leanMargin, y + height, z + radius + leanMargin] },
      metadata
    });
    trees[typeIndex].crowns.push({
      id: `${treeId}:crown`,
      matrix: scaleTranslationMatrix(crownRadius, crownHeight, crownRadius, x, crownY, z, yawRadians),
      bounds: { min: [x - crownRadius, crownY - crownHeight * 0.5, z - crownRadius], max: [x + crownRadius, crownY + crownHeight * 0.5, z + crownRadius] },
      metadata
    });
  }

  for (let index = 0; index < grassPerPatch; index += 1) {
    const seed = `${worldSeed}:${id}:grass:${index}`;
    const x = minX + unit(seed, "x") * FOREST_PATCH_SIZE;
    const z = minZ + unit(seed, "z") * FOREST_PATCH_SIZE;
    const nearest = route.nearest(x, z, 0, route.samples.length);
    if (nearest.distance < nearest.width + 0.8) continue;
    const y = world.sampleElevation(x, z);
    const height = 0.35 + unit(seed, "height") * 1.15;
    const width = 0.45 + unit(seed, "width") * 0.75;
    grass.push({ id: `${id}:grass:${index}`, matrix: scaleTranslationMatrix(width, height, width, x, y, z, unit(seed, "yaw") * Math.PI * 2) });
  }

  return { id, x: patchX, z: patchZ, trees, grass };
}

function createShardLayer(THREE, scene, capacity = 160) {
  const mesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.34), new THREE.MeshStandardMaterial({ color: 0x8fe8ff, emissive: 0x43d4ff, emissiveIntensity: 1.15, roughness: 0.35 }), capacity);
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
  racerPresentation = null,
  playerBody = null,
  diagnosticFoundationOnly = false,
  onProgress = () => {}
} = {}) {
  if (!host || !world) throw new TypeError("Rendering requires host and World implementation.");
  const resolvedRacerPresentation = racerPresentation
    ? {
        racerId: String(racerPresentation.racerId ?? "racer"),
        bodyDescriptor: racerPresentation.bodyDescriptor ?? playerBody,
        meshName: String(racerPresentation.meshName ?? "prehistoric-rush-procedural-racer"),
        snapshotName: String(racerPresentation.snapshotName ?? "procedural-skinned-racer"),
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
  const qualityProfile = resolvePrehistoricVisualQuality(globalThis.location, globalThis);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 1400);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance", alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  const adaptivePixelRatio = createAdaptivePixelRatioController(renderer, qualityProfile, globalThis);
  renderer.setClearAlpha(1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.append(renderer.domElement);

  let denseWorldGPUActive = false;
  let denseVisualRevision = 0;
  let treeFidelityPackages = null;
  const terrainMaterial = createTerrainMaterial(THREE);
  const terrainPatches = new Map();
  function ensureTerrain(state = {}) {
    const activePlan = createCenteredPatchPlan(state, { size: FOUNDATION_TERRAIN_PATCH_SIZE, radius: FOUNDATION_TERRAIN_ACTIVE_RADIUS, prefix: "foundation-terrain" });
    const retainedIds = new Set(createCenteredPatchPlan(state, { size: FOUNDATION_TERRAIN_PATCH_SIZE, radius: FOUNDATION_TERRAIN_RETAIN_RADIUS, prefix: "foundation-terrain" }).map((entry) => entry.id));
    for (const entry of activePlan) {
      if (terrainPatches.has(entry.id)) continue;
      const mesh = createTerrainPatch(THREE, world, entry.x, entry.z, terrainMaterial);
      mesh.visible = !denseWorldGPUActive;
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
  const terrainStartedAt = performance.now();
  ensureTerrain({ x: 0, z: 0 });
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
  const cinematicFidelity = diagnosticFoundationOnly ? null : createThreeCinematicFidelityLayer(THREE, { scene, camera, renderer, profile: qualityProfile, sun });

  let courseRibbon = null;
  let treeFidelity = null;
  let treeFidelityStatus = diagnosticFoundationOnly ? "disabled" : "loading";
  let treeFidelityError = null;
  let treeFidelityLoadMs = 0;
  let grassMesh = null;
  let cinematicGround = null;
  let playerMesh = null;
  let shardMesh = null;
  const forestPatches = new Map();
  let elapsed = 0;

  function applyDenseWorldVisibility() {
    for (const mesh of terrainPatches.values()) mesh.visible = !denseWorldGPUActive;
    if (grassMesh) grassMesh.visible = !denseWorldGPUActive && !cinematicGround;
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
    if (course?.route) { courseRibbon = createCourseRibbon(THREE, world, course.route); scene.add(courseRibbon); }
    if (racerBody) {
      playerMesh = createCreatureMesh(THREE, racerBody);
      playerMesh.name = resolvedRacerPresentation.meshName;
      scene.add(playerMesh);
    }
    shardMesh = createShardLayer(THREE, scene);
    grassMesh = createGrassLayer(THREE, scene);
    cinematicGround = createThreeCinematicGroundLayer(THREE, { scene, camera, profile: qualityProfile });
    grassMesh.visible = false;
  }

  const treeLoadStartedAt = performance.now();
  const richPresentationReady = diagnosticFoundationOnly
    ? Promise.resolve(null)
    : loadTreeFidelityPackages((progress, detail) => onProgress(0.22 + progress * 0.66, detail))
      .then((packages) => {
        treeFidelityPackages = packages;
        treeFidelity = createThreeTreeFidelityLayer(THREE, { scene, camera, renderer, treeTypes: PREHISTORIC_TREE_TYPES, packages, capacity: TREE_CAPACITY_PER_TYPE });
        treeFidelityStatus = "ready";
        treeFidelityLoadMs = performance.now() - treeLoadStartedAt;
        denseVisualRevision += 1;
        applyDenseWorldVisibility();
        onProgress(1, "Rich prehistoric forest ready");
        return treeFidelity;
      })
      .catch((error) => { treeFidelityStatus = "error"; treeFidelityError = error instanceof Error ? error : new Error(String(error)); throw treeFidelityError; });
  richPresentationReady.catch(() => {});

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
    const plan = createCenteredPatchPlan(state, { size: FOREST_PATCH_SIZE, radius: FOUNDATION_FOREST_RADIUS, prefix: "foundation-forest" });
    const desiredIds = new Set(plan.map((entry) => entry.id));
    const batch = selectMissingPatchBatch(plan, new Set(forestPatches.keys()), FOUNDATION_FOREST_GENERATION_BUDGET);
    let changed = false;
    for (const entry of batch) {
      const patch = createForestPatch(world, course.route, entry.x, entry.z, world.recipe.seed, qualityProfile);
      forestPatches.set(entry.id, patch);
      treeFidelity.activatePatch(patch);
      cinematicGround?.activatePatch(patch);
      changed = true;
    }
    const released = [];
    for (const id of forestPatches.keys()) {
      if (desiredIds.has(id)) continue;
      forestPatches.delete(id);
      released.push(id);
      changed = true;
    }
    if (released.length) {
      treeFidelity.releasePatches(released);
      cinematicGround?.releasePatches(released);
    }
    if (changed) {
      denseVisualRevision += 1;
      flushGrass();
    }
  }

  function updateShards() {
    if (!shardMesh || !gameplay?.getPickups) return;
    const pickups = gameplay.getPickups();
    const count = Math.min(shardMesh.instanceMatrix.count || 160, pickups.length);
    for (let index = 0; index < count; index += 1) {
      const pickup = pickups[index];
      matrix.compose(new THREE.Vector3(pickup.x, pickup.y + Math.sin(elapsed * 2 + index) * 0.12, pickup.z), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, elapsed * 0.8 + index * 0.11, 0)), new THREE.Vector3(1, 1, 1));
      shardMesh.setMatrixAt(index, matrix);
    }
    shardMesh.count = count;
    shardMesh.instanceMatrix.needsUpdate = true;
  }

  function draw(state, framing, dt = 1 / 60) {
    if (treeFidelityError) throw treeFidelityError;
    elapsed += Math.max(0, Number(dt) || 0);
    ensureTerrain(state);
    if (framing) { camera.position.set(...framing.position); camera.lookAt(...framing.target); }
    if (!diagnosticFoundationOnly) {
      ensureForest(state);
      if (playerMesh) {
        playerMesh.position.set(state.x, state.y + state.jumpHeight + resolvedRacerPresentation.rootOffsetY, state.z);
        playerMesh.rotation.y = state.yaw;
        if (creatureApi?.createPose) {
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
      treeFidelity?.update(state, dt);
      cinematicGround?.update(state, dt);
      updateShards();
      if (grassMesh) grassMesh.rotation.y = Math.sin(elapsed * 0.11) * 0.002;
      if (shardMesh) shardMesh.rotation.y = elapsed * 0.18;
    }
    if (denseWorldGPUActive) applyDenseWorldVisibility();
    sun.position.set(state.x - 30, state.y + 55, state.z - 24);
    sun.target.position.set(state.x, state.y, state.z);
    adaptivePixelRatio.update(dt);
    cinematicFidelity?.update(state, dt);
    if (cinematicFidelity) cinematicFidelity.render(scene);
    else renderer.render(scene, camera);
  }

  function getDenseWorldPresentation() {
    let treeCount = 0;
    for (const patch of forestPatches.values()) for (const treeSet of patch.trees) treeCount += Math.min(treeSet.trunks.length, treeSet.crowns.length);
    return Object.freeze({
      revision: denseVisualRevision,
      terrainPatchCount: terrainPatches.size,
      terrainPatchIds: [...terrainPatches.keys()].sort(),
      forestPatchCount: forestPatches.size,
      treePackageCount: treeFidelityPackages?.length ?? 0,
      treeCount,
      treePackages: treeFidelityPackages ?? [],
      forestPatches: [...forestPatches.values()]
    });
  }

  function setDenseWorldGPUActive(active) {
    denseWorldGPUActive = Boolean(active);
    applyDenseWorldVisibility();
    return denseWorldGPUActive;
  }

  const playableRendererMs = performance.now() - renderStartedAt;
  onProgress(1, diagnosticFoundationOnly ? "Foundation diagnostic ready" : "Playable world ready · rich forest streaming");

  return Object.freeze({
    scene, camera, renderer, qualityProfile, draw, getDenseWorldPresentation, setDenseWorldGPUActive,
    whenRichPresentationReady() { return richPresentationReady; },
    snapshot: () => ({
      terrainAuthority: "n:world:foundation",
      terrainPatchCount: terrainPatches.size,
      terrainPatchIds: [...terrainPatches.keys()].sort(),
      terrainActiveRadius: FOUNDATION_TERRAIN_ACTIVE_RADIUS,
      vegetationEnabled: !diagnosticFoundationOnly,
      diagnosticFoundationOnly,
      denseWorldPresentation: denseWorldGPUActive ? "nexus-webgpu" : "three-webgl2",
      racerId: resolvedRacerPresentation?.racerId ?? null,
      playerPresentation: playerMesh ? resolvedRacerPresentation.snapshotName : diagnosticFoundationOnly ? "disabled-for-diagnostic" : "unavailable",
      treeFidelityStatus,
      treeFidelityError: treeFidelityError?.message ?? null,
      treeFidelityPackageCount: treeFidelity?.view?.packageCount ?? 0,
      treeCount: treeFidelity?.view?.treeCount ?? 0,
      treeFidelityCounts: treeFidelity ? { ...treeFidelity.view.counts } : { near: 0, medium: 0, far: 0, horizon: 0 },
      grassCount: grassMesh?.count ?? 0,
      activeForestPatches: forestPatches.size,
      activeForestPatchIds: [...forestPatches.keys()].sort(),
      forestTargetPatchCount: (FOUNDATION_FOREST_RADIUS * 2 + 1) ** 2,
      forestGenerationBudget: FOUNDATION_FOREST_GENERATION_BUDGET,
      atmosphere: scene.fog ? "lush-jungle" : "none",
      visualQuality: qualityProfile.id,
      rendererPreference: qualityProfile.rendererPreference,
      adaptiveResolution: adaptivePixelRatio.getSnapshot(),
      cinematicFidelity: cinematicFidelity?.view ?? null,
      cinematicGround: cinematicGround ? { ...cinematicGround.view } : null,
      courseVisible: Boolean(courseRibbon),
      performance: { playableRendererMs, initialTerrainMs, treeFidelityLoadMs }
    })
  });
}
