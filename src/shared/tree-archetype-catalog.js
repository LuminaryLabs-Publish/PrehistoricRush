import { attachPrehistoricTreeFoliageSprites } from "../render/prehistoric-foliage-atlas.js";
import { foliageFamilyIdForArchetype } from "./prehistoric-foliage-card-recipes.js";

const DEG = Math.PI / 180;

function frozenArchetype(value) {
  const next = {
    distributionWeight: 1,
    shape: "broad-lobed",
    barkTexture: "vertical-strata",
    foliageTexture: "soft-mottle",
    foliageCardFamily: null,
    heroCardCount: 22,
    mediumCardCount: 10,
    canopyLayers: 3,
    hangingFoliage: 0.06,
    textureScale: 0.18,
    textureStrength: 0.13,
    ecology: Object.freeze({ moisture: 0.5, elevation: 0.5, clusterScale: 0.018, clusterStrength: 0.7 }),
    ...value
  };
  next.foliageCardFamily = next.foliageCardFamily ?? foliageFamilyIdForArchetype(next);
  return Object.freeze(next);
}

export const TREE_FIDELITY_PACKAGE_VERSION = "5";

export const PREHISTORIC_TREE_ARCHETYPES = Object.freeze([
  frozenArchetype({
    id: "giant-fern-tree", label: "Giant Fern Tree", minHeight: 38, maxHeight: 54, averageHeight: 46,
    trunkRadius: 2.25, crownHeight: 13, crownRadius: 17,
    barkColor: 0x6a4028, foliageColor: 0x3d713d, accentColor: 0x6f9d52,
    shape: "giant-fern", barkTexture: "fibrous-ribs", foliageTexture: "radial-fronds",
    foliageCardFamily: "fern-frond", heroCardCount: 26, mediumCardCount: 12, canopyLayers: 2,
    textureScale: 0.15,
    ecology: Object.freeze({ moisture: 0.72, elevation: 0.38, clusterScale: 0.014, clusterStrength: 0.88 }),
    distributionWeight: 1.05
  }),
  frozenArchetype({
    id: "tower-conifer", label: "Tower Conifer", minHeight: 46, maxHeight: 62, averageHeight: 54,
    trunkRadius: 1.55, crownHeight: 24, crownRadius: 9,
    barkColor: 0x493427, foliageColor: 0x315e48, accentColor: 0x4e7d5d,
    shape: "spire", barkTexture: "plated-bark", foliageTexture: "needle-bands",
    foliageCardFamily: "needle-spray", heroCardCount: 30, mediumCardCount: 14, canopyLayers: 7,
    textureScale: 0.22,
    ecology: Object.freeze({ moisture: 0.48, elevation: 0.72, clusterScale: 0.011, clusterStrength: 0.82 }),
    distributionWeight: 0.9
  }),
  frozenArchetype({
    id: "understory-cycad", label: "Understory Cycad", minHeight: 13, maxHeight: 21, averageHeight: 17,
    trunkRadius: 1.1, crownHeight: 6.5, crownRadius: 6.2,
    barkColor: 0x66543a, foliageColor: 0x67a14c, accentColor: 0x99bb5d,
    shape: "cycad", barkTexture: "diamond-scales", foliageTexture: "fan-ribs",
    foliageCardFamily: "fern-frond", heroCardCount: 18, mediumCardCount: 8, canopyLayers: 1,
    textureScale: 0.3,
    ecology: Object.freeze({ moisture: 0.62, elevation: 0.28, clusterScale: 0.026, clusterStrength: 0.95 }),
    distributionWeight: 1.25
  }),
  frozenArchetype({
    id: "broad-canopy", label: "Broad Canopy Tree", minHeight: 30, maxHeight: 44, averageHeight: 37,
    trunkRadius: 1.8, crownHeight: 10, crownRadius: 15,
    barkColor: 0x73472e, foliageColor: 0x478b49, accentColor: 0x70a75b,
    shape: "umbrella", barkTexture: "vertical-strata", foliageTexture: "cloud-mottle",
    foliageCardFamily: "broadleaf-spray", heroCardCount: 34, mediumCardCount: 16, canopyLayers: 4, hangingFoliage: 0.12,
    textureScale: 0.17,
    ecology: Object.freeze({ moisture: 0.56, elevation: 0.45, clusterScale: 0.016, clusterStrength: 0.8 }),
    distributionWeight: 1.2
  }),
  frozenArchetype({
    id: "moss-column", label: "Moss Column Tree", minHeight: 32, maxHeight: 48, averageHeight: 40,
    trunkRadius: 2.1, crownHeight: 8, crownRadius: 7.5,
    barkColor: 0x51513a, foliageColor: 0x5e984a, accentColor: 0x88a75c,
    shape: "column", barkTexture: "moss-patches", foliageTexture: "dense-mottle",
    foliageCardFamily: "bush-cluster", heroCardCount: 28, mediumCardCount: 12, canopyLayers: 5, hangingFoliage: 0.16,
    textureScale: 0.2,
    ecology: Object.freeze({ moisture: 0.82, elevation: 0.35, clusterScale: 0.02, clusterStrength: 0.92 }),
    distributionWeight: 0.95
  }),
  frozenArchetype({
    id: "layered-araucaria", label: "Layered Araucaria", minHeight: 44, maxHeight: 60, averageHeight: 52,
    trunkRadius: 1.45, crownHeight: 30, crownRadius: 10.5,
    barkColor: 0x40362e, foliageColor: 0x416b5c, accentColor: 0x638b74,
    shape: "layered-araucaria", barkTexture: "charcoal-plates", foliageTexture: "tiered-needles",
    foliageCardFamily: "needle-spray", heroCardCount: 34, mediumCardCount: 16, canopyLayers: 8,
    textureScale: 0.24,
    ecology: Object.freeze({ moisture: 0.44, elevation: 0.76, clusterScale: 0.012, clusterStrength: 0.9 }),
    distributionWeight: 0.78
  }),
  frozenArchetype({
    id: "fan-cycad", label: "Fan Cycad", minHeight: 17, maxHeight: 25, averageHeight: 21,
    trunkRadius: 1.35, crownHeight: 7, crownRadius: 8.4,
    barkColor: 0x70513a, foliageColor: 0x87964c, accentColor: 0xb0aa58,
    shape: "fan-cycad", barkTexture: "fibrous-chevron", foliageTexture: "golden-fronds",
    foliageCardFamily: "palm-frond", heroCardCount: 22, mediumCardCount: 10, canopyLayers: 1,
    textureScale: 0.28,
    ecology: Object.freeze({ moisture: 0.52, elevation: 0.22, clusterScale: 0.03, clusterStrength: 0.96 }),
    distributionWeight: 1.05
  }),
  frozenArchetype({
    id: "ginkgo-crown-tree", label: "Ginkgo Crown Tree", minHeight: 28, maxHeight: 40, averageHeight: 34,
    trunkRadius: 1.55, crownHeight: 11, crownRadius: 13.5,
    barkColor: 0x756b58, foliageColor: 0x86a84f, accentColor: 0xc1bc62,
    shape: "ginkgo", barkTexture: "pale-mottle", foliageTexture: "fan-leaf-cloud",
    foliageCardFamily: "ginkgo-fan", heroCardCount: 32, mediumCardCount: 15, canopyLayers: 4,
    textureScale: 0.19,
    ecology: Object.freeze({ moisture: 0.58, elevation: 0.42, clusterScale: 0.017, clusterStrength: 0.84 }),
    distributionWeight: 0.88
  }),
  frozenArchetype({
    id: "marsh-horsetail-tower", label: "Marsh Horsetail Tower", minHeight: 14, maxHeight: 22, averageHeight: 18,
    trunkRadius: 0.52, crownHeight: 4.5, crownRadius: 3.6,
    barkColor: 0x506247, foliageColor: 0x4f7f72, accentColor: 0x79a090,
    shape: "horsetail", barkTexture: "segmented-rings", foliageTexture: "teal-whorls",
    foliageCardFamily: "horsetail-whorl", heroCardCount: 20, mediumCardCount: 9, canopyLayers: 5,
    textureScale: 0.38,
    ecology: Object.freeze({ moisture: 0.94, elevation: 0.12, clusterScale: 0.038, clusterStrength: 1 }),
    distributionWeight: 1.1
  }),
  frozenArchetype({
    id: "forked-ghostwood", label: "Forked Ghostwood", minHeight: 32, maxHeight: 46, averageHeight: 39,
    trunkRadius: 1.65, crownHeight: 12, crownRadius: 10.5,
    barkColor: 0x8a8677, foliageColor: 0x274f3a, accentColor: 0x91a37a,
    shape: "forked-ghostwood", barkTexture: "weathered-cracks", foliageTexture: "sparse-tip-mottle",
    foliageCardFamily: "broadleaf-spray", heroCardCount: 18, mediumCardCount: 8, canopyLayers: 3, hangingFoliage: 0.04,
    textureScale: 0.21,
    ecology: Object.freeze({ moisture: 0.36, elevation: 0.58, clusterScale: 0.013, clusterStrength: 0.74 }),
    distributionWeight: 0.68
  }),
  frozenArchetype({
    id: "tall-prehistoric-palm", label: "Tall Prehistoric Palm", minHeight: 34, maxHeight: 50, averageHeight: 42,
    trunkRadius: 1.05, crownHeight: 9, crownRadius: 12.5,
    barkColor: 0x766247, foliageColor: 0x6fa54b, accentColor: 0xa8c55f,
    shape: "tall-palm", barkTexture: "palm-rings", foliageTexture: "long-palm-fronds",
    foliageCardFamily: "palm-frond", heroCardCount: 26, mediumCardCount: 12, canopyLayers: 1, hangingFoliage: 0.08,
    textureScale: 0.26,
    ecology: Object.freeze({ moisture: 0.64, elevation: 0.32, clusterScale: 0.018, clusterStrength: 0.78 }),
    distributionWeight: 0.92
  }),
  frozenArchetype({
    id: "short-jungle-palm", label: "Short Jungle Palm", minHeight: 18, maxHeight: 30, averageHeight: 24,
    trunkRadius: 0.82, crownHeight: 8, crownRadius: 9.5,
    barkColor: 0x725a3e, foliageColor: 0x79ad50, accentColor: 0xb2c96a,
    shape: "short-palm", barkTexture: "palm-fibers", foliageTexture: "compact-palm-fronds",
    foliageCardFamily: "palm-frond", heroCardCount: 22, mediumCardCount: 10, canopyLayers: 1, hangingFoliage: 0.12,
    textureScale: 0.3,
    ecology: Object.freeze({ moisture: 0.72, elevation: 0.24, clusterScale: 0.026, clusterStrength: 0.9 }),
    distributionWeight: 1.08
  })
]);

export const PREHISTORIC_TREE_TYPES = Object.freeze(PREHISTORIC_TREE_ARCHETYPES.map((tree, typeIndex) => Object.freeze([
  tree.minHeight,
  tree.maxHeight,
  tree.trunkRadius,
  tree.crownHeight,
  tree.crownRadius,
  tree.foliageColor,
  Object.freeze({
    id: tree.id,
    label: tree.label,
    typeIndex,
    averageHeight: tree.averageHeight,
    barkColor: tree.barkColor,
    foliageColor: tree.foliageColor,
    accentColor: tree.accentColor,
    distributionWeight: tree.distributionWeight,
    ecology: tree.ecology,
    shape: tree.shape,
    barkTexture: tree.barkTexture,
    foliageTexture: tree.foliageTexture,
    foliageCardFamily: tree.foliageCardFamily,
    heroCardCount: tree.heroCardCount,
    mediumCardCount: tree.mediumCardCount,
    canopyLayers: tree.canopyLayers,
    hangingFoliage: tree.hangingFoliage
  })
])));

function colorChannels(THREE, hex) {
  const color = new THREE.Color(hex);
  return [color.r, color.g, color.b];
}

function patternedMaterial(THREE, geometry, archetype) {
  const base = colorChannels(THREE, archetype.barkColor);
  const accent = colorChannels(THREE, archetype.accentColor ?? archetype.barkColor);
  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const seed = archetype.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) * 0.0137;
  const frequency = archetype.textureScale ?? 0.2;
  const strength = archetype.textureStrength ?? 0.13;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const vertical = Math.sin(y * frequency * 3.1 + seed);
    const radial = Math.sin((x * 0.83 + z * 1.17) * frequency * 5.2 + seed * 2.3);
    const broad = Math.sin((x + y * 0.37 - z) * frequency * 1.4 + seed * 0.7);
    const amount = Math.max(0, Math.min(1, 0.5 + vertical * 0.2 + radial * 0.18 + broad * 0.12));
    const value = 1 + (amount - 0.5) * strength * 2;
    colors[index * 3] = Math.min(1, (base[0] + (accent[0] - base[0]) * amount * 0.22) * value);
    colors[index * 3 + 1] = Math.min(1, (base[1] + (accent[1] - base[1]) * amount * 0.22) * value);
    colors[index * 3 + 2] = Math.min(1, (base[2] + (accent[2] - base[2]) * amount * 0.22) * value);
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, flatShading: false });
}

function addWoodMesh(THREE, group, geometry, archetype, position, scale = [1, 1, 1], rotation = [0, 0, 0], name = "wood") {
  const mesh = new THREE.Mesh(geometry, patternedMaterial(THREE, geometry, archetype));
  mesh.name = `${archetype.id}:${name}:${group.children.length}`;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.vegetationRole = "wood";
  group.add(mesh);
  return mesh;
}

function addCylinderBetween(THREE, group, archetype, start, end, radiusStart, radiusEnd, name = "branch", radialSegments = 8) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radiusEnd, radiusStart, length, radialSegments, 2);
  const mesh = addWoodMesh(THREE, group, geometry, archetype, [0, 0, 0], [1, 1, 1], [0, 0, 0], name);
  mesh.position.copy(startVector).add(endVector).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function addBoundsProxy(THREE, group, archetype, height) {
  const width = archetype.crownRadius * 2;
  const proxyHeight = Math.max(archetype.crownHeight, height * 0.25);
  const geometry = new THREE.BoxGeometry(width, proxyHeight, width);
  geometry.setIndex([]);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
  mesh.name = `${archetype.id}:canopy-bounds-proxy`;
  mesh.position.set(0, height * 0.78, 0);
  mesh.visible = false;
  mesh.userData.vegetationRole = "bounds-proxy";
  group.add(mesh);
  return mesh;
}

function trunk(THREE, group, archetype, height, options = {}) {
  return addWoodMesh(
    THREE,
    group,
    new THREE.CylinderGeometry(
      archetype.trunkRadius * (options.topScale ?? 0.58),
      archetype.trunkRadius * (options.bottomScale ?? 1),
      height,
      options.radialSegments ?? 10,
      options.heightSegments ?? 4
    ),
    archetype,
    [0, height * 0.5, 0],
    [1, 1, 1],
    [options.leanX ?? 0, 0, options.leanZ ?? 0],
    options.name ?? "trunk"
  );
}

function createGiantFernWood(THREE, group, archetype, height) {
  trunk(THREE, group, archetype, height * 0.84, { topScale: 0.52, radialSegments: 10, heightSegments: 5 });
}

function createSpireWood(THREE, group, archetype, height) {
  trunk(THREE, group, archetype, height, { topScale: 0.42, radialSegments: 9, heightSegments: 5 });
  for (let tier = 0; tier < 6; tier += 1) {
    const t = tier / 5;
    const y = height * (0.38 + t * 0.5);
    const radius = archetype.crownRadius * (1 - t * 0.68);
    for (let arm = 0; arm < 4; arm += 1) {
      const angle = arm / 4 * Math.PI * 2 + tier * 0.36;
      addCylinderBetween(THREE, group, archetype, [0, y, 0], [Math.sin(angle) * radius, y + radius * 0.06, Math.cos(angle) * radius], archetype.trunkRadius * 0.24, 0.12, "tier-branch", 6);
    }
  }
}

function createCycadWood(THREE, group, archetype, height) {
  trunk(THREE, group, archetype, height * 0.7, { topScale: 0.78, radialSegments: 10, heightSegments: 4 });
}

function createUmbrellaWood(THREE, group, archetype, height) {
  trunk(THREE, group, archetype, height * 0.78, { topScale: 0.58, radialSegments: 10, heightSegments: 4 });
  const forkY = height * 0.58;
  addCylinderBetween(THREE, group, archetype, [0, forkY, 0], [-archetype.crownRadius * 0.38, height * 0.86, 1.2], archetype.trunkRadius * 0.46, 0.28, "left-branch");
  addCylinderBetween(THREE, group, archetype, [0, forkY, 0], [archetype.crownRadius * 0.42, height * 0.89, -0.9], archetype.trunkRadius * 0.44, 0.24, "right-branch");
  addCylinderBetween(THREE, group, archetype, [0, forkY + 1, 0], [0.8, height * 0.98, archetype.crownRadius * 0.26], archetype.trunkRadius * 0.35, 0.18, "rear-branch");
}

function createColumnWood(THREE, group, archetype, height) {
  trunk(THREE, group, archetype, height, { topScale: 0.62, radialSegments: 10, heightSegments: 5 });
  for (let tier = 0; tier < 4; tier += 1) {
    const y = height * (0.52 + tier * 0.1);
    const angle = tier * 1.8;
    addCylinderBetween(THREE, group, archetype, [0, y, 0], [Math.sin(angle) * archetype.crownRadius * 0.45, y + 1.2, Math.cos(angle) * archetype.crownRadius * 0.45], archetype.trunkRadius * 0.3, 0.16, "column-branch", 7);
  }
}

function createAraucariaWood(THREE, group, archetype, height) {
  trunk(THREE, group, archetype, height, { topScale: 0.38, radialSegments: 10, heightSegments: 6 });
  for (let tier = 0; tier < 7; tier += 1) {
    const t = tier / 6;
    const y = height * 0.4 + t * archetype.crownHeight * 0.82;
    const radius = archetype.crownRadius * (1 - t * 0.66);
    for (let arm = 0; arm < 5; arm += 1) {
      const angle = arm / 5 * Math.PI * 2 + tier * 0.42;
      addCylinderBetween(THREE, group, archetype, [0, y, 0], [Math.sin(angle) * radius, y + 0.6, Math.cos(angle) * radius], archetype.trunkRadius * 0.2, 0.1, "araucaria-tier", 6);
    }
  }
}

function createGinkgoWood(THREE, group, archetype, height) {
  trunk(THREE, group, archetype, height * 0.64, { topScale: 0.58, radialSegments: 9, heightSegments: 4 });
  const y = height * 0.52;
  addCylinderBetween(THREE, group, archetype, [0, y, 0], [-archetype.crownRadius * 0.38, height * 0.83, 1], archetype.trunkRadius * 0.46, 0.28, "ginkgo-left");
  addCylinderBetween(THREE, group, archetype, [0, y, 0], [archetype.crownRadius * 0.44, height * 0.88, -0.8], archetype.trunkRadius * 0.44, 0.24, "ginkgo-right");
  addCylinderBetween(THREE, group, archetype, [0, y + 1, 0], [1, height * 0.96, 2], archetype.trunkRadius * 0.34, 0.18, "ginkgo-center");
}

function createHorsetailWood(THREE, group, archetype, height) {
  for (let index = 0; index < 5; index += 1) {
    const angle = index / 5 * Math.PI * 2;
    const offset = index === 0 ? 0 : archetype.crownRadius * 0.28;
    const stemHeight = height * (0.72 + (index % 3) * 0.12);
    addWoodMesh(
      THREE,
      group,
      new THREE.CylinderGeometry(archetype.trunkRadius * 0.52, archetype.trunkRadius * 0.72, stemHeight, 8, 6),
      archetype,
      [Math.sin(angle) * offset, stemHeight * 0.5, Math.cos(angle) * offset],
      [1, 1, 1],
      [0, 0, 0],
      "horsetail-stem"
    );
  }
}

function createGhostwoodWood(THREE, group, archetype, height) {
  const forkY = height * 0.48;
  trunk(THREE, group, archetype, forkY, { topScale: 0.68, radialSegments: 9, heightSegments: 3 });
  addCylinderBetween(THREE, group, archetype, [0, forkY, 0], [-4.6, height * 0.92, 0.6], archetype.trunkRadius * 0.72, 0.5, "ghost-fork-left");
  addCylinderBetween(THREE, group, archetype, [0, forkY, 0], [4.2, height, -1.4], archetype.trunkRadius * 0.68, 0.44, "ghost-fork-right");
  addCylinderBetween(THREE, group, archetype, [-2.2, height * 0.7, 0.3], [-6.5, height * 0.83, 2.1], 0.52, 0.2, "dead-limb", 7);
}

function createPalmWood(THREE, group, archetype, height, short = false) {
  const points = [
    [0, 0, 0],
    [short ? 0.22 : 0.35, height * 0.34, short ? -0.1 : 0.2],
    [short ? -0.18 : 0.52, height * 0.68, short ? 0.14 : -0.15],
    [short ? 0.12 : 0.7, height * 0.92, short ? 0.08 : 0.1]
  ];
  for (let index = 0; index < points.length - 1; index += 1) {
    const t = index / (points.length - 2);
    addCylinderBetween(
      THREE,
      group,
      archetype,
      points[index],
      points[index + 1],
      archetype.trunkRadius * (1 - t * 0.18),
      archetype.trunkRadius * (0.82 - t * 0.22),
      "palm-trunk-segment",
      10
    );
  }
}

export function createPrehistoricTreeObject(THREE, archetype, options = {}) {
  const group = new THREE.Group();
  group.name = archetype.id;
  const height = archetype.averageHeight;
  switch (archetype.shape) {
    case "giant-fern": createGiantFernWood(THREE, group, archetype, height); break;
    case "spire": createSpireWood(THREE, group, archetype, height); break;
    case "cycad":
    case "fan-cycad": createCycadWood(THREE, group, archetype, height); break;
    case "umbrella": createUmbrellaWood(THREE, group, archetype, height); break;
    case "column": createColumnWood(THREE, group, archetype, height); break;
    case "layered-araucaria": createAraucariaWood(THREE, group, archetype, height); break;
    case "ginkgo": createGinkgoWood(THREE, group, archetype, height); break;
    case "horsetail": createHorsetailWood(THREE, group, archetype, height); break;
    case "forked-ghostwood": createGhostwoodWood(THREE, group, archetype, height); break;
    case "tall-palm": createPalmWood(THREE, group, archetype, height, false); break;
    case "short-palm": createPalmWood(THREE, group, archetype, height, true); break;
    default: createUmbrellaWood(THREE, group, archetype, height); break;
  }
  addBoundsProxy(THREE, group, archetype, height);
  attachPrehistoricTreeFoliageSprites(THREE, group, archetype, options.foliage ?? {});
  group.rotation.y = (archetype.id.length % 7) * 7 * DEG;
  group.updateMatrixWorld(true);
  return group;
}
