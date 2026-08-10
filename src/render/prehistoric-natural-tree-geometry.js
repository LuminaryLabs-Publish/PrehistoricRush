import { createPrehistoricFoliageAtlas } from "./prehistoric-foliage-atlas.js";
import { getPrehistoricFoliageCardFamily } from "../shared/prehistoric-foliage-card-recipes.js";
import { PREHISTORIC_TREE_ART_DIRECTION } from "../shared/prehistoric-tree-art-direction.js";

const ATLAS_CACHE = new WeakMap();

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

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
    color.lerp(accent, bucket / 3 * 0.46);
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
      emissive: new THREE.Color(archetype.foliageColor).multiplyScalar(0.08 + Number(family.translucency ?? 0.12) * 0.22),
      emissiveIntensity: 0.18 + Number(family.translucency ?? 0.12) * 0.5,
      fog: true
    };
    const material = THREE.MeshPhysicalMaterial
      ? new THREE.MeshPhysicalMaterial({ ...parameters, clearcoat: 0.02, clearcoatRoughness: 0.88, sheen: 0.1, sheenRoughness: 0.78, sheenColor: accent })
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

function segmentResolution(segment) {
  if (segment.role === "trunk") {
    return {
      radial: PREHISTORIC_TREE_ART_DIRECTION.trunk.radialSegments,
      longitudinal: PREHISTORIC_TREE_ART_DIRECTION.trunk.longitudinalSegments
    };
  }
  if (segment.role === "root") {
    return {
      radial: PREHISTORIC_TREE_ART_DIRECTION.roots.radialSegments,
      longitudinal: PREHISTORIC_TREE_ART_DIRECTION.roots.longitudinalSegments
    };
  }
  return {
    radial: segment.order === 1 ? PREHISTORIC_TREE_ART_DIRECTION.branch.primaryRadialSegments : PREHISTORIC_TREE_ART_DIRECTION.branch.secondaryRadialSegments,
    longitudinal: PREHISTORIC_TREE_ART_DIRECTION.branch.longitudinalSegments
  };
}

function createOrganicSegmentGeometry(THREE, archetype, segment) {
  const start = new THREE.Vector3(...segment.start);
  const end = new THREE.Vector3(...segment.end);
  const length = Math.max(0.001, end.distanceTo(start));
  const resolution = segmentResolution(segment);
  const positions = [];
  const uvs = [];
  const indices = [];
  const seed = segment.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) * 0.01391;
  const groundTrunk = segment.role === "trunk" && Math.min(Number(segment.start?.[1] ?? 0), Number(segment.end?.[1] ?? 0)) <= archetype.averageHeight * 0.025;
  const localCurve = segment.role === "trunk"
    ? PREHISTORIC_TREE_ART_DIRECTION.trunk.curvature
    : segment.role === "root" ? 0.018 : 0.012;

  for (let ring = 0; ring <= resolution.longitudinal; ring += 1) {
    const t = ring / resolution.longitudinal;
    const y = (t - 0.5) * length;
    const baseRadius = Number(segment.radiusStart) + (Number(segment.radiusEnd) - Number(segment.radiusStart)) * t;
    const trunkFlare = groundTrunk
      ? 1 + (PREHISTORIC_TREE_ART_DIRECTION.trunk.baseFlare - 1) * Math.pow(1 - t, 3.2)
      : 1;
    const rootFlare = segment.role === "root"
      ? 1 + PREHISTORIC_TREE_ART_DIRECTION.roots.buttressStrength * Math.pow(1 - t, 2.2)
      : 1;
    const centerX = Math.sin(t * Math.PI) * length * localCurve * Math.sin(seed * 3.1);
    const centerZ = Math.sin(t * Math.PI * 0.82) * length * localCurve * 0.62 * Math.cos(seed * 2.7);

    for (let side = 0; side < resolution.radial; side += 1) {
      const u = side / resolution.radial;
      const theta = u * Math.PI * 2;
      const ridge = Math.sin(theta * 5 + seed + t * 4.7) * 0.55 + Math.sin(theta * 9 - seed * 0.7 + t * 2.2) * 0.25;
      const irregularity = 1 + ridge * PREHISTORIC_TREE_ART_DIRECTION.trunk.irregularity;
      const radius = Math.max(0.001, baseRadius * trunkFlare * rootFlare * irregularity);
      const rootEllipse = segment.role === "root"
        ? 1 - PREHISTORIC_TREE_ART_DIRECTION.roots.flattening * 0.32
        : 1;
      positions.push(
        centerX + Math.cos(theta) * radius,
        y,
        centerZ + Math.sin(theta) * radius * rootEllipse
      );
      uvs.push(u, t);
    }
  }

  for (let ring = 0; ring < resolution.longitudinal; ring += 1) {
    const current = ring * resolution.radial;
    const next = (ring + 1) * resolution.radial;
    for (let side = 0; side < resolution.radial; side += 1) {
      const a = current + side;
      const b = current + (side + 1) % resolution.radial;
      const c = next + (side + 1) % resolution.radial;
      const d = next + side;
      indices.push(a, d, b, b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function applyBarkVertexColors(THREE, geometry, archetype, segment) {
  const base = new THREE.Color(archetype.barkColor);
  const accent = new THREE.Color(archetype.accentColor ?? archetype.barkColor);
  const moss = new THREE.Color(0x43583a);
  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const roleFactor = segment.role === "root" ? 0.2 : segment.role === "trunk" ? 0.08 : 0.13;
  const seed = segment.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) * 0.021;
  const localMinY = geometry.boundingBox?.min?.y ?? -0.5;
  const localMaxY = geometry.boundingBox?.max?.y ?? 0.5;
  const localHeight = Math.max(0.001, localMaxY - localMinY);

  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const t = clamp((y - localMinY) / localHeight, 0, 1);
    const treeSpaceY = Number(segment.start?.[1] ?? 0) + (Number(segment.end?.[1] ?? 0) - Number(segment.start?.[1] ?? 0)) * t;
    const vertical = Math.sin(y * 1.35 + seed) * 0.42;
    const ridges = Math.sin(Math.atan2(z, x) * 5 + seed * 0.7) * 0.34;
    const broad = Math.sin((x + z) * 1.7 - seed * 0.5) * 0.18;
    const amount = clamp(0.5 + vertical * 0.22 + ridges * 0.22 + broad * 0.16 + roleFactor, 0, 1);
    const color = base.clone().lerp(accent, amount * 0.24).multiplyScalar(0.78 + amount * 0.3);
    const groundLight = clamp(treeSpaceY / PREHISTORIC_TREE_ART_DIRECTION.bark.groundAoHeight, PREHISTORIC_TREE_ART_DIRECTION.bark.groundAoMinimum, 1);
    color.multiplyScalar(groundLight);
    if (segment.role === "root" || treeSpaceY < 0.75) {
      const mossMix = segment.role === "root" ? PREHISTORIC_TREE_ART_DIRECTION.bark.rootMossMix : PREHISTORIC_TREE_ART_DIRECTION.bark.rootMossMix * 0.5;
      color.lerp(moss, mossMix);
    }
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
    roughness: PREHISTORIC_TREE_ART_DIRECTION.bark.roughness,
    metalness: 0,
    fog: true
  };
  return THREE.MeshPhysicalMaterial
    ? new THREE.MeshPhysicalMaterial({
        ...parameters,
        clearcoat: PREHISTORIC_TREE_ART_DIRECTION.bark.clearcoat,
        clearcoatRoughness: PREHISTORIC_TREE_ART_DIRECTION.bark.clearcoatRoughness
      })
    : new THREE.MeshStandardMaterial(parameters);
}

function addGrowthSegment(THREE, group, archetype, segment, material) {
  const start = new THREE.Vector3(...segment.start);
  const end = new THREE.Vector3(...segment.end);
  const direction = end.clone().sub(start);
  const length = Math.max(0.001, direction.length());
  const geometry = createOrganicSegmentGeometry(THREE, archetype, segment);
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
  mesh.userData.organicGeometry = true;
  mesh.userData.segmentLength = length;
  group.add(mesh);
  return mesh;
}

export function createPrehistoricNaturalTreeObject(THREE, archetype, growthPlan, options = {}) {
  if (!growthPlan?.woodSegments?.length) throw new TypeError(`Natural tree object requires a growth plan for ${archetype.id}.`);
  const group = new THREE.Group();
  group.name = archetype.id;
  group.userData.naturalGrowth = true;
  group.userData.growthPlanId = growthPlan.id;
  group.userData.artDirection = "chunky-prehistoric-canopy-v1";
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
