import { createPrehistoricFoliageAtlas } from "./prehistoric-foliage-atlas.js";
import { getPrehistoricFoliageCardFamily } from "../shared/prehistoric-foliage-card-recipes.js";

const ATLAS_CACHE = new WeakMap();

function captureAtlas(THREE) {
  let atlas = ATLAS_CACHE.get(THREE);
  if (!atlas) {
    atlas = createPrehistoricFoliageAtlas(THREE, { tileSize: 256 });
    ATLAS_CACHE.set(THREE, atlas);
  }
  return atlas;
}

function materialFactory(THREE, atlas, archetype) {
  const cache = new Map();
  return (cluster) => {
    const family = getPrehistoricFoliageCardFamily(cluster.familyId);
    if (!family) throw new RangeError(`Natural tree cluster ${cluster.id} references unknown family ${cluster.familyId}.`);
    const bucket = Math.max(0, Math.min(3, Math.floor(Number(cluster.lightExposure ?? 0.5) * 4)));
    const key = `${family.id}:${bucket}`;
    if (cache.has(key)) return cache.get(key);
    const color = new THREE.Color(archetype.foliageColor);
    const accent = new THREE.Color(archetype.accentColor ?? archetype.foliageColor);
    color.lerp(accent, bucket / 3 * 0.42);
    const parameters = {
      name: `natural-tree-foliage:${archetype.id}:${family.id}:${bucket}`,
      map: atlas.createFamilyTexture(family.id),
      color,
      alphaTest: family.alphaCutoff,
      alphaToCoverage: true,
      transparent: false,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      roughness: family.roughness,
      metalness: 0,
      emissive: new THREE.Color(archetype.foliageColor).multiplyScalar(0.1 + Number(family.translucency ?? 0.12) * 0.2),
      emissiveIntensity: 0.2 + Number(family.translucency ?? 0.12) * 0.45,
      fog: true
    };
    const material = THREE.MeshPhysicalMaterial
      ? new THREE.MeshPhysicalMaterial({ ...parameters, clearcoat: 0.025, clearcoatRoughness: 0.84, sheen: 0.08, sheenRoughness: 0.78, sheenColor: accent })
      : new THREE.MeshStandardMaterial(parameters);
    cache.set(key, material);
    return material;
  };
}

function geometryFor(THREE, mode, cache) {
  const key = mode === "hanging-edge" ? "hanging" : "centered";
  if (cache.has(key)) return cache.get(key);
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 2);
  if (key === "hanging") geometry.translate(0, -0.5, 0);
  cache.set(key, geometry);
  return geometry;
}

export function attachPrehistoricTreeFoliageMeshes(THREE, group, archetype, options = {}) {
  const growthPlan = options.growthPlan;
  if (!growthPlan?.foliageClusters?.length) throw new TypeError(`Natural foliage meshes require a growth plan for ${archetype.id}.`);
  const atlas = options.atlas ?? captureAtlas(THREE);
  const materialFor = materialFactory(THREE, atlas, archetype);
  const geometryCache = new Map();
  const cards = [];
  for (const cluster of growthPlan.foliageClusters) {
    const cardCount = Math.max(1, Math.floor(Number(cluster.cardCount) || 1));
    for (let cardIndex = 0; cardIndex < cardCount; cardIndex += 1) {
      const mesh = new THREE.Mesh(geometryFor(THREE, cluster.mode, geometryCache), materialFor(cluster));
      const yawOffset = cardCount === 1 ? 0 : cardIndex / cardCount * Math.PI;
      mesh.name = `${archetype.id}:natural-foliage:${cluster.id}:${cardIndex}`;
      mesh.position.set(...cluster.position);
      mesh.rotation.set(
        Number(cluster.rotation?.[0] ?? 0),
        Number(cluster.rotation?.[1] ?? 0) + yawOffset,
        Number(cluster.rotation?.[2] ?? 0) + (cardIndex % 2 === 0 ? -1 : 1) * 0.035,
        "YXZ"
      );
      const scaleJitter = 0.94 + Number(cluster.seed ?? 0.5) * 0.12;
      mesh.scale.set(cluster.scale[0] * scaleJitter, cluster.scale[1] * scaleJitter, 1);
      mesh.castShadow = cluster.mode !== "hanging-edge";
      mesh.receiveShadow = true;
      mesh.userData.foliageCard = true;
      mesh.userData.naturalGrowth = true;
      mesh.userData.familyId = cluster.familyId;
      mesh.userData.clusterId = cluster.id;
      mesh.userData.lightExposure = cluster.lightExposure;
      mesh.userData.shade = cluster.shade;
      mesh.userData.windScale = cluster.windScale;
      group.add(mesh);
      cards.push(mesh);
    }
  }
  return cards;
}

function applyBarkVertexColors(THREE, geometry, archetype, segment) {
  const base = new THREE.Color(archetype.barkColor);
  const accent = new THREE.Color(archetype.accentColor ?? archetype.barkColor);
  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const roleFactor = segment.role === "root" ? 0.22 : segment.role === "trunk" ? 0.08 : 0.14;
  const seed = segment.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) * 0.021;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const grain = Math.sin(y * 3.8 + seed) * 0.5 + Math.sin((x + z) * 8.2 - seed) * 0.22;
    const amount = Math.max(0, Math.min(1, 0.42 + grain * 0.2 + roleFactor));
    const color = base.clone().lerp(accent, amount * 0.22).multiplyScalar(0.78 + amount * 0.34);
    if (segment.role === "root") color.lerp(new THREE.Color(0x48613b), 0.18);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

function barkMaterial(THREE, archetype) {
  const parameters = {
    name: `natural-tree-bark:${archetype.id}`,
    vertexColors: true,
    roughness: 0.84,
    metalness: 0,
    fog: true
  };
  return THREE.MeshPhysicalMaterial
    ? new THREE.MeshPhysicalMaterial({ ...parameters, clearcoat: 0.035, clearcoatRoughness: 0.88 })
    : new THREE.MeshStandardMaterial(parameters);
}

function addGrowthSegment(THREE, group, archetype, segment, material) {
  const start = new THREE.Vector3(...segment.start);
  const end = new THREE.Vector3(...segment.end);
  const direction = end.clone().sub(start);
  const length = Math.max(0.001, direction.length());
  const radialSegments = segment.role === "trunk" ? 10 : segment.role === "root" ? 8 : segment.order === 1 ? 8 : 6;
  const geometry = new THREE.CylinderGeometry(segment.radiusEnd, segment.radiusStart, length, radialSegments, 2, false);
  applyBarkVertexColors(THREE, geometry, archetype, segment);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `${archetype.id}:natural-wood:${segment.id}`;
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.vegetationRole = segment.role;
  mesh.userData.naturalGrowth = true;
  mesh.userData.segmentId = segment.id;
  mesh.userData.branchOrder = segment.order;
  group.add(mesh);
  return mesh;
}

export function createPrehistoricNaturalTreeObject(THREE, archetype, growthPlan, options = {}) {
  if (!growthPlan?.woodSegments?.length) throw new TypeError(`Natural tree object requires a growth plan for ${archetype.id}.`);
  const group = new THREE.Group();
  group.name = archetype.id;
  group.userData.naturalGrowth = true;
  group.userData.growthPlanId = growthPlan.id;
  const material = barkMaterial(THREE, archetype);
  for (const segment of [...growthPlan.roots, ...growthPlan.woodSegments]) addGrowthSegment(THREE, group, archetype, segment, material);
  attachPrehistoricTreeFoliageMeshes(THREE, group, archetype, { ...options, growthPlan });
  const bounds = growthPlan.bounds;
  const width = Math.max(0.1, bounds.max[0] - bounds.min[0]);
  const height = Math.max(0.1, bounds.max[1] - bounds.min[1]);
  const depth = Math.max(0.1, bounds.max[2] - bounds.min[2]);
  const proxyGeometry = new THREE.BoxGeometry(width, height, depth);
  proxyGeometry.setIndex([]);
  const proxy = new THREE.Mesh(proxyGeometry, new THREE.MeshBasicMaterial({ visible: false }));
  proxy.name = `${archetype.id}:natural-bounds-proxy`;
  proxy.position.set(
    (bounds.min[0] + bounds.max[0]) * 0.5,
    (bounds.min[1] + bounds.max[1]) * 0.5,
    (bounds.min[2] + bounds.max[2]) * 0.5
  );
  proxy.visible = false;
  proxy.userData.vegetationRole = "bounds-proxy";
  group.add(proxy);
  group.updateMatrixWorld(true);
  return group;
}

export default attachPrehistoricTreeFoliageMeshes;
