const DEG = Math.PI / 180;

function frozenArchetype(value) {
  return Object.freeze({
    distributionWeight: 1,
    shape: "broad-lobed",
    barkTexture: "vertical-strata",
    foliageTexture: "soft-mottle",
    textureScale: 0.18,
    textureStrength: 0.13,
    ecology: Object.freeze({ moisture: 0.5, elevation: 0.5, clusterScale: 0.018, clusterStrength: 0.7 }),
    ...value
  });
}

export const TREE_FIDELITY_PACKAGE_VERSION = "4";

export const PREHISTORIC_TREE_ARCHETYPES = Object.freeze([
  frozenArchetype({
    id: "giant-fern-tree",
    label: "Giant Fern Tree",
    minHeight: 38,
    maxHeight: 54,
    averageHeight: 46,
    trunkRadius: 2.25,
    crownHeight: 13,
    crownRadius: 17,
    barkColor: 0x6a4028,
    foliageColor: 0x3d713d,
    accentColor: 0x6f9d52,
    shape: "giant-fern",
    barkTexture: "fibrous-ribs",
    foliageTexture: "radial-fronds",
    textureScale: 0.15,
    ecology: Object.freeze({ moisture: 0.72, elevation: 0.38, clusterScale: 0.014, clusterStrength: 0.88 }),
    distributionWeight: 1.05
  }),
  frozenArchetype({
    id: "tower-conifer",
    label: "Tower Conifer",
    minHeight: 46,
    maxHeight: 62,
    averageHeight: 54,
    trunkRadius: 1.55,
    crownHeight: 24,
    crownRadius: 9,
    barkColor: 0x493427,
    foliageColor: 0x315e48,
    accentColor: 0x4e7d5d,
    shape: "spire",
    barkTexture: "plated-bark",
    foliageTexture: "needle-bands",
    textureScale: 0.22,
    ecology: Object.freeze({ moisture: 0.48, elevation: 0.72, clusterScale: 0.011, clusterStrength: 0.82 }),
    distributionWeight: 0.9
  }),
  frozenArchetype({
    id: "understory-cycad",
    label: "Understory Cycad",
    minHeight: 13,
    maxHeight: 21,
    averageHeight: 17,
    trunkRadius: 1.1,
    crownHeight: 6.5,
    crownRadius: 6.2,
    barkColor: 0x66543a,
    foliageColor: 0x67a14c,
    accentColor: 0x99bb5d,
    shape: "cycad",
    barkTexture: "diamond-scales",
    foliageTexture: "fan-ribs",
    textureScale: 0.3,
    ecology: Object.freeze({ moisture: 0.62, elevation: 0.28, clusterScale: 0.026, clusterStrength: 0.95 }),
    distributionWeight: 1.25
  }),
  frozenArchetype({
    id: "broad-canopy",
    label: "Broad Canopy Tree",
    minHeight: 30,
    maxHeight: 44,
    averageHeight: 37,
    trunkRadius: 1.8,
    crownHeight: 10,
    crownRadius: 15,
    barkColor: 0x73472e,
    foliageColor: 0x478b49,
    accentColor: 0x70a75b,
    shape: "umbrella",
    barkTexture: "vertical-strata",
    foliageTexture: "cloud-mottle",
    textureScale: 0.17,
    ecology: Object.freeze({ moisture: 0.56, elevation: 0.45, clusterScale: 0.016, clusterStrength: 0.8 }),
    distributionWeight: 1.2
  }),
  frozenArchetype({
    id: "moss-column",
    label: "Moss Column Tree",
    minHeight: 32,
    maxHeight: 48,
    averageHeight: 40,
    trunkRadius: 2.1,
    crownHeight: 8,
    crownRadius: 7.5,
    barkColor: 0x51513a,
    foliageColor: 0x5e984a,
    accentColor: 0x88a75c,
    shape: "column",
    barkTexture: "moss-patches",
    foliageTexture: "dense-mottle",
    textureScale: 0.2,
    ecology: Object.freeze({ moisture: 0.82, elevation: 0.35, clusterScale: 0.02, clusterStrength: 0.92 }),
    distributionWeight: 0.95
  }),
  frozenArchetype({
    id: "layered-araucaria",
    label: "Layered Araucaria",
    minHeight: 44,
    maxHeight: 60,
    averageHeight: 52,
    trunkRadius: 1.45,
    crownHeight: 30,
    crownRadius: 10.5,
    barkColor: 0x40362e,
    foliageColor: 0x416b5c,
    accentColor: 0x638b74,
    shape: "layered-araucaria",
    barkTexture: "charcoal-plates",
    foliageTexture: "tiered-needles",
    textureScale: 0.24,
    ecology: Object.freeze({ moisture: 0.44, elevation: 0.76, clusterScale: 0.012, clusterStrength: 0.9 }),
    distributionWeight: 0.78
  }),
  frozenArchetype({
    id: "fan-cycad",
    label: "Fan Cycad",
    minHeight: 17,
    maxHeight: 25,
    averageHeight: 21,
    trunkRadius: 1.35,
    crownHeight: 7,
    crownRadius: 8.4,
    barkColor: 0x70513a,
    foliageColor: 0x87964c,
    accentColor: 0xb0aa58,
    shape: "fan-cycad",
    barkTexture: "fibrous-chevron",
    foliageTexture: "golden-fronds",
    textureScale: 0.28,
    ecology: Object.freeze({ moisture: 0.52, elevation: 0.22, clusterScale: 0.03, clusterStrength: 0.96 }),
    distributionWeight: 1.05
  }),
  frozenArchetype({
    id: "ginkgo-crown-tree",
    label: "Ginkgo Crown Tree",
    minHeight: 28,
    maxHeight: 40,
    averageHeight: 34,
    trunkRadius: 1.55,
    crownHeight: 11,
    crownRadius: 13.5,
    barkColor: 0x756b58,
    foliageColor: 0x86a84f,
    accentColor: 0xc1bc62,
    shape: "ginkgo",
    barkTexture: "pale-mottle",
    foliageTexture: "fan-leaf-cloud",
    textureScale: 0.19,
    ecology: Object.freeze({ moisture: 0.58, elevation: 0.42, clusterScale: 0.017, clusterStrength: 0.84 }),
    distributionWeight: 0.88
  }),
  frozenArchetype({
    id: "marsh-horsetail-tower",
    label: "Marsh Horsetail Tower",
    minHeight: 14,
    maxHeight: 22,
    averageHeight: 18,
    trunkRadius: 0.52,
    crownHeight: 4.5,
    crownRadius: 3.6,
    barkColor: 0x506247,
    foliageColor: 0x4f7f72,
    accentColor: 0x79a090,
    shape: "horsetail",
    barkTexture: "segmented-rings",
    foliageTexture: "teal-whorls",
    textureScale: 0.38,
    ecology: Object.freeze({ moisture: 0.94, elevation: 0.12, clusterScale: 0.038, clusterStrength: 1 }),
    distributionWeight: 1.1
  }),
  frozenArchetype({
    id: "forked-ghostwood",
    label: "Forked Ghostwood",
    minHeight: 32,
    maxHeight: 46,
    averageHeight: 39,
    trunkRadius: 1.65,
    crownHeight: 12,
    crownRadius: 10.5,
    barkColor: 0x8a8677,
    foliageColor: 0x274f3a,
    accentColor: 0x91a37a,
    shape: "forked-ghostwood",
    barkTexture: "weathered-cracks",
    foliageTexture: "sparse-tip-mottle",
    textureScale: 0.21,
    ecology: Object.freeze({ moisture: 0.36, elevation: 0.58, clusterScale: 0.013, clusterStrength: 0.74 }),
    distributionWeight: 0.68
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
    foliageTexture: tree.foliageTexture
  })
])));

function colorChannels(THREE, hex) {
  const color = new THREE.Color(hex);
  return [color.r, color.g, color.b];
}

function patternedMaterial(THREE, geometry, archetype, role, options = {}) {
  const baseHex = role === "bark" ? archetype.barkColor : archetype.foliageColor;
  const accentHex = options.accentColor ?? archetype.accentColor ?? baseHex;
  const base = colorChannels(THREE, baseHex);
  const accent = colorChannels(THREE, accentHex);
  const position = geometry.getAttribute("position");
  const colors = new Float32Array(position.count * 3);
  const seed = archetype.id.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0) * 0.0137;
  const frequency = archetype.textureScale ?? 0.2;
  const strength = archetype.textureStrength ?? 0.13;
  for (let index = 0; index < position.count; index += 1) {
    const x = position.getX(index);
    const y = position.getY(index);
    const z = position.getZ(index);
    const vertical = Math.sin(y * frequency * (role === "bark" ? 3.1 : 1.3) + seed);
    const radial = Math.sin((x * 0.83 + z * 1.17) * frequency * 5.2 + seed * 2.3);
    const broad = Math.sin((x + y * 0.37 - z) * frequency * 1.4 + seed * 0.7);
    const amount = Math.max(0, Math.min(1, 0.5 + vertical * 0.2 + radial * 0.18 + broad * 0.12));
    const value = 1 + (amount - 0.5) * strength * 2;
    colors[index * 3] = Math.min(1, (base[0] + (accent[0] - base[0]) * amount * 0.42) * value);
    colors[index * 3 + 1] = Math.min(1, (base[1] + (accent[1] - base[1]) * amount * 0.42) * value);
    colors[index * 3 + 2] = Math.min(1, (base[2] + (accent[2] - base[2]) * amount * 0.42) * value);
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: role === "bark" ? 0.9 : 0.78,
    metalness: 0,
    flatShading: false,
    side: options.side ?? THREE.FrontSide
  });
}

function addMesh(THREE, group, geometry, archetype, role, position, scale = [1, 1, 1], rotation = [0, 0, 0], options = {}) {
  const material = patternedMaterial(THREE, geometry, archetype, role, options);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `${archetype.id}:${options.name ?? role}:${group.children.length}`;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = role === "bark";
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addCylinderBetween(THREE, group, archetype, start, end, radiusStart, radiusEnd, options = {}) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radiusEnd, radiusStart, length, options.radialSegments ?? 8, options.heightSegments ?? 2);
  const material = patternedMaterial(THREE, geometry, archetype, "bark");
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = `${archetype.id}:${options.name ?? "branch"}:${group.children.length}`;
  mesh.position.copy(startVector).add(endVector).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addLobe(THREE, group, archetype, position, scale, detail = 1, options = {}) {
  return addMesh(
    THREE,
    group,
    new THREE.IcosahedronGeometry(1, detail),
    archetype,
    "foliage",
    position,
    scale,
    options.rotation ?? [0, 0, 0],
    { name: options.name ?? "crown", accentColor: options.accentColor }
  );
}

function createGiantFern(THREE, group, archetype, height) {
  addMesh(THREE, group, new THREE.CylinderGeometry(archetype.trunkRadius * 0.62, archetype.trunkRadius, height, 10, 3), archetype, "bark", [0, height * 0.5, 0], [1, 1, 1], [0, 0, 0], { name: "trunk" });
  const crownY = height * 0.82;
  for (let index = 0; index < 9; index += 1) {
    const angle = index / 9 * Math.PI * 2;
    const radius = archetype.crownRadius * (0.48 + (index % 3) * 0.06);
    const x = Math.sin(angle) * radius * 0.4;
    const z = Math.cos(angle) * radius * 0.4;
    addLobe(THREE, group, archetype, [x, crownY + Math.sin(index * 1.7) * 1.3, z], [radius * 0.62, archetype.crownHeight * 0.25, radius * 0.23], 1, { rotation: [0.08 * Math.sin(angle), angle, 0.18 * Math.cos(angle)] });
  }
  addLobe(THREE, group, archetype, [0, crownY + archetype.crownHeight * 0.28, 0], [archetype.crownRadius * 0.42, archetype.crownHeight * 0.42, archetype.crownRadius * 0.42], 2);
}

function createSpire(THREE, group, archetype, height) {
  addMesh(THREE, group, new THREE.CylinderGeometry(archetype.trunkRadius * 0.55, archetype.trunkRadius, height, 9, 4), archetype, "bark", [0, height * 0.5, 0], [1, 1, 1], [0, 0, 0], { name: "trunk" });
  const crownBase = height * 0.42;
  for (let tier = 0; tier < 6; tier += 1) {
    const t = tier / 5;
    const radius = archetype.crownRadius * (1 - t * 0.7);
    addMesh(THREE, group, new THREE.ConeGeometry(radius, archetype.crownHeight * 0.28, 10, 2), archetype, "foliage", [0, crownBase + t * archetype.crownHeight * 0.72, 0], [1, 1, 1], [0, tier * 0.31, 0], { name: "spire-tier" });
  }
}

function createCycad(THREE, group, archetype, height, fan = false) {
  addMesh(THREE, group, new THREE.CylinderGeometry(archetype.trunkRadius * 0.8, archetype.trunkRadius, height * 0.72, 10, 3), archetype, "bark", [0, height * 0.36, 0], [1, 1, 1], [0, 0, 0], { name: "trunk" });
  const crownY = height * 0.72;
  const frondCount = fan ? 12 : 9;
  for (let index = 0; index < frondCount; index += 1) {
    const angle = index / frondCount * Math.PI * 2;
    const length = archetype.crownRadius * (0.78 + (index % 2) * 0.12);
    addLobe(THREE, group, archetype, [Math.sin(angle) * length * 0.36, crownY, Math.cos(angle) * length * 0.36], [length * 0.62, archetype.crownHeight * 0.16, length * 0.16], 1, { rotation: [fan ? -0.12 : 0.08, angle, Math.sin(angle) * 0.25] });
  }
  addLobe(THREE, group, archetype, [0, crownY + archetype.crownHeight * 0.18, 0], [archetype.crownRadius * 0.27, archetype.crownHeight * 0.35, archetype.crownRadius * 0.27], 1);
}

function createUmbrella(THREE, group, archetype, height) {
  addMesh(THREE, group, new THREE.CylinderGeometry(archetype.trunkRadius * 0.65, archetype.trunkRadius, height, 10, 3), archetype, "bark", [0, height * 0.5, 0], [1, 1, 1], [0, 0, 0], { name: "trunk" });
  const forkY = height * 0.68;
  addCylinderBetween(THREE, group, archetype, [0, forkY, 0], [-archetype.crownRadius * 0.32, height * 0.87, 0.8], archetype.trunkRadius * 0.45, archetype.trunkRadius * 0.2, { name: "left-branch" });
  addCylinderBetween(THREE, group, archetype, [0, forkY, 0], [archetype.crownRadius * 0.36, height * 0.9, -0.6], archetype.trunkRadius * 0.42, archetype.trunkRadius * 0.18, { name: "right-branch" });
  addLobe(THREE, group, archetype, [-archetype.crownRadius * 0.25, height * 0.9, 0], [archetype.crownRadius * 0.72, archetype.crownHeight * 0.45, archetype.crownRadius * 0.64], 2);
  addLobe(THREE, group, archetype, [archetype.crownRadius * 0.34, height * 0.92, -0.5], [archetype.crownRadius * 0.68, archetype.crownHeight * 0.42, archetype.crownRadius * 0.62], 2);
  addLobe(THREE, group, archetype, [0, height * 0.98, archetype.crownRadius * 0.18], [archetype.crownRadius * 0.58, archetype.crownHeight * 0.38, archetype.crownRadius * 0.52], 1);
}

function createColumn(THREE, group, archetype, height) {
  addMesh(THREE, group, new THREE.CylinderGeometry(archetype.trunkRadius * 0.72, archetype.trunkRadius, height, 10, 4), archetype, "bark", [0, height * 0.5, 0], [1, 1, 1], [0, 0, 0], { name: "trunk" });
  for (let tier = 0; tier < 5; tier += 1) {
    const t = tier / 4;
    addLobe(THREE, group, archetype, [Math.sin(tier * 2.2) * 1.1, height * (0.5 + t * 0.12), Math.cos(tier * 1.7) * 0.9], [archetype.crownRadius * (0.72 - t * 0.08), archetype.crownHeight * 0.42, archetype.crownRadius * (0.62 - t * 0.05)], 1);
  }
}

function createLayeredAraucaria(THREE, group, archetype, height) {
  addMesh(THREE, group, new THREE.CylinderGeometry(archetype.trunkRadius * 0.5, archetype.trunkRadius, height, 10, 5), archetype, "bark", [0, height * 0.5, 0], [1, 1, 1], [0, 0, 0], { name: "trunk" });
  for (let tier = 0; tier < 7; tier += 1) {
    const t = tier / 6;
    const radius = archetype.crownRadius * (1 - t * 0.65);
    const y = height * 0.42 + t * archetype.crownHeight * 0.82;
    addLobe(THREE, group, archetype, [0, y, 0], [radius, archetype.crownHeight * 0.08, radius * 0.88], 1, { rotation: [0, tier * 0.41, 0], name: "layer" });
  }
  addLobe(THREE, group, archetype, [0, height + 1.2, 0], [archetype.crownRadius * 0.18, archetype.crownHeight * 0.22, archetype.crownRadius * 0.18], 1);
}

function createGinkgo(THREE, group, archetype, height) {
  addMesh(THREE, group, new THREE.CylinderGeometry(archetype.trunkRadius * 0.62, archetype.trunkRadius, height * 0.86, 9, 3), archetype, "bark", [0, height * 0.43, 0], [1, 1, 1], [0, 0, 0], { name: "trunk" });
  const y = height * 0.78;
  addCylinderBetween(THREE, group, archetype, [0, height * 0.56, 0], [-4.2, y, 0.8], archetype.trunkRadius * 0.42, 0.38, { name: "fork-left" });
  addCylinderBetween(THREE, group, archetype, [0, height * 0.58, 0], [5.1, y + 1.5, -0.5], archetype.trunkRadius * 0.4, 0.32, { name: "fork-right" });
  addLobe(THREE, group, archetype, [-archetype.crownRadius * 0.28, y + 1, 0], [archetype.crownRadius * 0.72, archetype.crownHeight * 0.52, archetype.crownRadius * 0.38], 2, { rotation: [0, 0.18, -0.08] });
  addLobe(THREE, group, archetype, [archetype.crownRadius * 0.33, y + 2.2, -0.8], [archetype.crownRadius * 0.76, archetype.crownHeight * 0.56, archetype.crownRadius * 0.42], 2, { rotation: [0, -0.2, 0.11] });
  addLobe(THREE, group, archetype, [0.8, y + archetype.crownHeight * 0.42, 0.7], [archetype.crownRadius * 0.5, archetype.crownHeight * 0.4, archetype.crownRadius * 0.35], 1);
}

function createHorsetail(THREE, group, archetype, height) {
  const stems = 5;
  for (let index = 0; index < stems; index += 1) {
    const angle = index / stems * Math.PI * 2;
    const offset = index === 0 ? 0 : archetype.crownRadius * 0.24;
    const stemHeight = height * (0.72 + (index % 3) * 0.12);
    const x = Math.sin(angle) * offset;
    const z = Math.cos(angle) * offset;
    addMesh(THREE, group, new THREE.CylinderGeometry(archetype.trunkRadius * 0.56, archetype.trunkRadius * 0.72, stemHeight, 8, 6), archetype, "bark", [x, stemHeight * 0.5, z], [1, 1, 1], [0, 0, 0], { name: "segmented-stem" });
    for (let ring = 1; ring <= 4; ring += 1) {
      addMesh(THREE, group, new THREE.TorusGeometry(archetype.trunkRadius * 0.75, archetype.trunkRadius * 0.09, 4, 8), archetype, "foliage", [x, stemHeight * ring / 5, z], [1, 1, 1], [Math.PI * 0.5, 0, 0], { name: "ring" });
    }
    addLobe(THREE, group, archetype, [x, stemHeight, z], [archetype.crownRadius * 0.28, archetype.crownHeight * 0.38, archetype.crownRadius * 0.28], 1);
  }
}

function createGhostwood(THREE, group, archetype, height) {
  const forkY = height * 0.48;
  addMesh(THREE, group, new THREE.CylinderGeometry(archetype.trunkRadius * 0.68, archetype.trunkRadius, forkY, 9, 3), archetype, "bark", [0, forkY * 0.5, 0], [1, 1, 1], [0, 0, 0], { name: "trunk" });
  addCylinderBetween(THREE, group, archetype, [0, forkY, 0], [-4.6, height * 0.92, 0.6], archetype.trunkRadius * 0.72, 0.52, { name: "ghost-fork-left" });
  addCylinderBetween(THREE, group, archetype, [0, forkY, 0], [4.2, height, -1.4], archetype.trunkRadius * 0.68, 0.46, { name: "ghost-fork-right" });
  addCylinderBetween(THREE, group, archetype, [-2.2, height * 0.7, 0.3], [-6.5, height * 0.83, 2.1], 0.55, 0.22, { name: "dead-limb" });
  addLobe(THREE, group, archetype, [-4.8, height * 0.91, 0.9], [archetype.crownRadius * 0.54, archetype.crownHeight * 0.42, archetype.crownRadius * 0.48], 1);
  addLobe(THREE, group, archetype, [4.5, height * 0.98, -1.3], [archetype.crownRadius * 0.5, archetype.crownHeight * 0.38, archetype.crownRadius * 0.46], 1);
  addLobe(THREE, group, archetype, [1.2, height * 0.78, 2.2], [archetype.crownRadius * 0.34, archetype.crownHeight * 0.3, archetype.crownRadius * 0.3], 1);
}

export function createPrehistoricTreeObject(THREE, archetype) {
  const group = new THREE.Group();
  group.name = archetype.id;
  const height = archetype.averageHeight;
  switch (archetype.shape) {
    case "giant-fern": createGiantFern(THREE, group, archetype, height); break;
    case "spire": createSpire(THREE, group, archetype, height); break;
    case "cycad": createCycad(THREE, group, archetype, height, false); break;
    case "fan-cycad": createCycad(THREE, group, archetype, height, true); break;
    case "umbrella": createUmbrella(THREE, group, archetype, height); break;
    case "column": createColumn(THREE, group, archetype, height); break;
    case "layered-araucaria": createLayeredAraucaria(THREE, group, archetype, height); break;
    case "ginkgo": createGinkgo(THREE, group, archetype, height); break;
    case "horsetail": createHorsetail(THREE, group, archetype, height); break;
    case "forked-ghostwood": createGhostwood(THREE, group, archetype, height); break;
    default: createUmbrella(THREE, group, archetype, height); break;
  }
  group.rotation.y = (archetype.id.length % 7) * 7 * DEG;
  group.updateMatrixWorld(true);
  return group;
}
