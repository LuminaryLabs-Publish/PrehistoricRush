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

export default attachPrehistoricTreeFoliageMeshes;
