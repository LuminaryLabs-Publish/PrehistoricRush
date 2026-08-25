import { createSoftPlasticMaterial } from "./prehistoric-soft-plastic-material.js";

export const MENU_TRACK_SPEC = Object.freeze({
  lanes: 4,
  straightHalf: 16,
  turnRadius: 12,
  laneWidth: 2.65,
  straightSamples: 48,
  arcSamples: 64
});

export const MENU_ENVIRONMENT_BUDGET = Object.freeze({
  maximumDrawCalls: 70,
  maximumRenderedTriangles: 100000
});

export const MENU_ENVIRONMENT_COUNTS = Object.freeze({
  trees: 34,
  canopyLobesPerTree: 6,
  branchesPerTree: 2,
  rootsPerTree: 3,
  rocks: Object.freeze({ round: 20, sharpSide: 6, vertical: 4 }),
  grassBlades: 360,
  broadleafPlants: 24,
  leavesPerPlant: 7,
  clouds: Object.freeze({ broad: 7, tower: 10, thin: 9 })
});

export const MENU_TREE_ARCHETYPES = Object.freeze([
  "short-bush",
  "short-broadleaf",
  "tall-thin-broadleaf",
  "tiered-conifer",
  "redwood"
]);

export const MENU_ROCK_ARCHETYPES = Object.freeze(["round", "sharp-side", "vertical"]);

const TOTAL_TRACK_WIDTH = MENU_TRACK_SPEC.lanes * MENU_TRACK_SPEC.laneWidth;

function positiveModulo(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}

function laneOffset(lane) {
  const normalizedLane = Math.min(MENU_TRACK_SPEC.lanes - 1, Math.max(0, Math.floor(Number(lane) || 0)));
  return (normalizedLane + 0.5 - MENU_TRACK_SPEC.lanes * 0.5) * MENU_TRACK_SPEC.laneWidth;
}

export function getMenuTrackLaneLength(lane) {
  const radius = MENU_TRACK_SPEC.turnRadius + laneOffset(lane);
  return MENU_TRACK_SPEC.straightHalf * 4 + Math.PI * radius * 2;
}

export function getMenuTrackMetrics() {
  const outerTurnRadius = MENU_TRACK_SPEC.turnRadius + TOTAL_TRACK_WIDTH * 0.5;
  const outerWidth = 2 * (MENU_TRACK_SPEC.straightHalf + outerTurnRadius);
  const outerDepth = 2 * outerTurnRadius;
  return Object.freeze({
    lanes: MENU_TRACK_SPEC.lanes,
    outerWidth,
    outerDepth,
    aspectRatio: outerWidth / outerDepth,
    laneLengths: Object.freeze(Array.from({ length: MENU_TRACK_SPEC.lanes }, (_, lane) => getMenuTrackLaneLength(lane)))
  });
}

export function getMenuEnvironmentPerformanceEstimate() {
  const stadiumPointCount = MENU_TRACK_SPEC.straightSamples * 2 + MENU_TRACK_SPEC.arcSamples * 2;
  const stadiumStripTriangles = stadiumPointCount * 2;
  const blobTriangles = 2 * 12 + (8 - 2) * 12 * 2;
  const trunkTriangles = 9 * 10 * 2;
  const branchTriangles = 5 * 7 * 2;
  const rockTriangles = {
    round: (4 * 2 + 1) * 14,
    sharpSide: (4 * 2 + 1) * 12,
    vertical: (4 * 2 + 1) * 12
  };
  const renderedTriangles = 2
    + (stadiumPointCount - 2)
    + stadiumStripTriangles * MENU_TRACK_SPEC.lanes
    + stadiumStripTriangles * (MENU_TRACK_SPEC.lanes + 1)
    + 2 * MENU_TRACK_SPEC.lanes
    + trunkTriangles * MENU_ENVIRONMENT_COUNTS.trees
    + branchTriangles * MENU_ENVIRONMENT_COUNTS.trees * MENU_ENVIRONMENT_COUNTS.branchesPerTree
    + branchTriangles * MENU_ENVIRONMENT_COUNTS.trees * MENU_ENVIRONMENT_COUNTS.rootsPerTree
    + blobTriangles * MENU_ENVIRONMENT_COUNTS.trees * MENU_ENVIRONMENT_COUNTS.canopyLobesPerTree
    + rockTriangles.round * MENU_ENVIRONMENT_COUNTS.rocks.round
    + rockTriangles.sharpSide * MENU_ENVIRONMENT_COUNTS.rocks.sharpSide
    + rockTriangles.vertical * MENU_ENVIRONMENT_COUNTS.rocks.vertical
    + 2 * MENU_ENVIRONMENT_COUNTS.grassBlades
    + 12 * MENU_ENVIRONMENT_COUNTS.broadleafPlants * MENU_ENVIRONMENT_COUNTS.leavesPerPlant
    + blobTriangles * Object.values(MENU_ENVIRONMENT_COUNTS.clouds).reduce((sum, count) => sum + count, 0);
  const renderedInstances = MENU_ENVIRONMENT_COUNTS.trees * (
    1 + MENU_ENVIRONMENT_COUNTS.branchesPerTree + MENU_ENVIRONMENT_COUNTS.rootsPerTree + MENU_ENVIRONMENT_COUNTS.canopyLobesPerTree
  )
    + Object.values(MENU_ENVIRONMENT_COUNTS.rocks).reduce((sum, count) => sum + count, 0)
    + MENU_ENVIRONMENT_COUNTS.grassBlades
    + MENU_ENVIRONMENT_COUNTS.broadleafPlants * MENU_ENVIRONMENT_COUNTS.leavesPerPlant
    + Object.values(MENU_ENVIRONMENT_COUNTS.clouds).reduce((sum, count) => sum + count, 0);
  const nonInstancedMeshes = 2 + MENU_TRACK_SPEC.lanes + (MENU_TRACK_SPEC.lanes + 1) + MENU_TRACK_SPEC.lanes;
  return Object.freeze({ drawCalls: 27, renderedTriangles, renderedInstances: renderedInstances + nonInstancedMeshes, sharedGeometries: 13, sharedMaterials: 17 });
}

export function sampleMenuTrackLane(lane, distance) {
  const radius = MENU_TRACK_SPEC.turnRadius + laneOffset(lane);
  const straightLength = MENU_TRACK_SPEC.straightHalf * 2;
  const arcLength = Math.PI * radius;
  const perimeter = straightLength * 2 + arcLength * 2;
  let cursor = positiveModulo(Number(distance) || 0, perimeter);
  if (cursor < straightLength) {
    return { x: -MENU_TRACK_SPEC.straightHalf + cursor, z: radius, tangentX: 1, tangentZ: 0, curvature: 0, perimeter };
  }
  cursor -= straightLength;
  if (cursor < arcLength) {
    const angle = Math.PI / 2 - cursor / radius;
    return {
      x: MENU_TRACK_SPEC.straightHalf + Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      tangentX: Math.sin(angle),
      tangentZ: -Math.cos(angle),
      curvature: -1 / radius,
      perimeter
    };
  }
  cursor -= arcLength;
  if (cursor < straightLength) {
    return { x: MENU_TRACK_SPEC.straightHalf - cursor, z: -radius, tangentX: -1, tangentZ: 0, curvature: 0, perimeter };
  }
  cursor -= straightLength;
  const angle = -Math.PI / 2 + cursor / radius;
  return {
    x: -MENU_TRACK_SPEC.straightHalf - Math.cos(angle) * radius,
    z: Math.sin(angle) * radius,
    tangentX: Math.sin(angle),
    tangentZ: Math.cos(angle),
    curvature: -1 / radius,
    perimeter
  };
}

function seededRandom(seed) {
  let state = [...String(seed)].reduce((value, character) => Math.imul(value ^ character.charCodeAt(0), 16777619), 2166136261) >>> 0;
  return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function makeBufferGeometry(THREE, vertices, indices, colors = null) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  if (colors) geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function makeSweptTrunkGeometry(THREE, { rings = 9, sides = 10, bendX = 0.075, bendZ = -0.035 } = {}) {
  const vertices = [];
  const indices = [];
  for (let ring = 0; ring <= rings; ring += 1) {
    const t = ring / rings;
    const radius = THREE.MathUtils.lerp(0.18, 0.075, t) * (1 + Math.sin(t * Math.PI) * 0.14);
    const centerX = Math.sin(t * Math.PI * 0.85) * bendX;
    const centerZ = Math.sin(t * Math.PI * 1.15) * bendZ;
    for (let side = 0; side < sides; side += 1) {
      const angle = side / sides * Math.PI * 2;
      const barkPulse = 1 + 0.055 * Math.sin(side * 2.73 + ring * 1.91);
      vertices.push(centerX + Math.cos(angle) * radius * barkPulse, t, centerZ + Math.sin(angle) * radius * barkPulse);
    }
  }
  for (let ring = 0; ring < rings; ring += 1) {
    for (let side = 0; side < sides; side += 1) {
      const next = (side + 1) % sides;
      const a = ring * sides + side;
      const b = ring * sides + next;
      const c = (ring + 1) * sides + next;
      const d = (ring + 1) * sides + side;
      indices.push(a, d, b, b, d, c);
    }
  }
  return makeBufferGeometry(THREE, vertices, indices);
}

function makeBlobGeometry(THREE, seed = 1, latSegments = 8, lonSegments = 12) {
  const random = seededRandom(seed);
  const phaseA = random() * Math.PI * 2;
  const phaseB = random() * Math.PI * 2;
  const vertices = [0, 1, 0];
  const indices = [];
  for (let lat = 1; lat < latSegments; lat += 1) {
    const theta = lat / latSegments * Math.PI;
    for (let lon = 0; lon < lonSegments; lon += 1) {
      const phi = lon / lonSegments * Math.PI * 2;
      const noise = 1 + 0.07 * Math.sin(phi * 3 + phaseA) * Math.sin(theta * 2.2) + 0.04 * Math.cos(phi * 5 + phaseB);
      vertices.push(Math.sin(theta) * Math.cos(phi) * noise, Math.cos(theta) * noise, Math.sin(theta) * Math.sin(phi) * noise);
    }
  }
  const bottomIndex = vertices.length / 3;
  vertices.push(0, -1, 0);
  for (let lon = 0; lon < lonSegments; lon += 1) indices.push(0, 1 + (lon + 1) % lonSegments, 1 + lon);
  for (let lat = 0; lat < latSegments - 2; lat += 1) {
    const row = 1 + lat * lonSegments;
    const nextRow = row + lonSegments;
    for (let lon = 0; lon < lonSegments; lon += 1) {
      const next = (lon + 1) % lonSegments;
      indices.push(row + lon, row + next, nextRow + lon, row + next, nextRow + next, nextRow + lon);
    }
  }
  const lastRow = 1 + (latSegments - 2) * lonSegments;
  for (let lon = 0; lon < lonSegments; lon += 1) indices.push(lastRow + lon, lastRow + (lon + 1) % lonSegments, bottomIndex);
  return makeBufferGeometry(THREE, vertices, indices);
}

function makeRockGeometry(THREE, style, seed) {
  const random = seededRandom(seed);
  const segments = style === "round" ? 14 : 12;
  const height = style === "vertical" ? 2.9 : style === "sharp-side" ? 2.2 : 1.45;
  const rings = style === "vertical"
    ? [{ y: 0, r: 0.78 }, { y: 0.18, r: 0.82 }, { y: 0.64, r: 0.69 }, { y: 0.84, r: 0.56 }, { y: 0.95, r: 0.3 }]
    : style === "sharp-side"
      ? [{ y: 0, r: 1 }, { y: 0.16, r: 1.03 }, { y: 0.55, r: 0.72 }, { y: 0.8, r: 0.28 }, { y: 0.92, r: 0.12 }]
      : [{ y: 0, r: 1.02 }, { y: 0.18, r: 1.08 }, { y: 0.58, r: 0.84 }, { y: 0.82, r: 0.48 }, { y: 0.95, r: 0.2 }];
  const vertices = [];
  const colors = [];
  const indices = [];
  for (let ringIndex = 0; ringIndex < rings.length; ringIndex += 1) {
    const ring = rings[ringIndex];
    for (let segment = 0; segment < segments; segment += 1) {
      const angle = segment / segments * Math.PI * 2;
      const directional = style === "sharp-side" ? 1 + 0.3 * Math.max(0, Math.cos(angle - 0.15)) * ring.y : 1;
      const wobble = 1 + (random() - 0.5) * 0.17 + 0.06 * Math.sin(segment * 2.19 + ringIndex * 1.7);
      const lean = style === "sharp-side" ? ring.y * 0.5 : style === "vertical" ? ring.y * 0.08 : 0;
      vertices.push(Math.cos(angle) * ring.r * wobble * directional + lean, ring.y * height, Math.sin(angle) * ring.r * wobble);
      const moss = Math.max(0, 1 - ring.y * 3.1) * (0.66 + random() * 0.24);
      const stone = new THREE.Color(0x888173).lerp(new THREE.Color(0x5d7043), moss);
      stone.offsetHSL((random() - 0.5) * 0.018, 0, (random() - 0.5) * 0.06);
      colors.push(stone.r, stone.g, stone.b);
    }
  }
  const topIndex = vertices.length / 3;
  const topLean = style === "sharp-side" ? 0.9 : style === "vertical" ? 0.18 : 0;
  vertices.push(topLean, height, 0);
  colors.push(0.53, 0.5, 0.44);
  for (let ring = 0; ring < rings.length - 1; ring += 1) {
    for (let segment = 0; segment < segments; segment += 1) {
      const next = (segment + 1) % segments;
      const a = ring * segments + segment;
      const b = ring * segments + next;
      const c = (ring + 1) * segments + next;
      const d = (ring + 1) * segments + segment;
      indices.push(a, d, b, b, d, c);
    }
  }
  const lastRing = (rings.length - 1) * segments;
  for (let segment = 0; segment < segments; segment += 1) indices.push(lastRing + segment, topIndex, lastRing + (segment + 1) % segments);
  return makeBufferGeometry(THREE, vertices, indices, colors);
}

function makeGrassGeometry(THREE) {
  const vertices = [-0.06, 0, 0, 0.05, 0, 0, 0.02, 0.52, 0, 0, 0, -0.06, 0, 0, 0.05, 0, 0.48, 0.015];
  return makeBufferGeometry(THREE, vertices, [0, 1, 2, 3, 4, 5]);
}

function makeBroadleafGeometry(THREE, segments = 6) {
  const vertices = [];
  const indices = [];
  for (let segment = 0; segment <= segments; segment += 1) {
    const t = segment / segments;
    const width = Math.sin(t * Math.PI) * 0.3;
    const lift = Math.sin(t * Math.PI) * 0.17;
    vertices.push(-width, t, lift, width, t, lift);
  }
  for (let segment = 0; segment < segments; segment += 1) {
    const a = segment * 2;
    const b = a + 1;
    const c = a + 3;
    const d = a + 2;
    indices.push(a, d, b, b, d, c);
  }
  return makeBufferGeometry(THREE, vertices, indices);
}

function stadiumPoints(THREE) {
  const points = [];
  const { straightHalf, turnRadius, straightSamples, arcSamples } = MENU_TRACK_SPEC;
  for (let i = 0; i < straightSamples; i += 1) points.push(new THREE.Vector2(THREE.MathUtils.lerp(-straightHalf, straightHalf, i / straightSamples), turnRadius));
  for (let i = 0; i < arcSamples; i += 1) {
    const angle = THREE.MathUtils.lerp(Math.PI / 2, -Math.PI / 2, i / arcSamples);
    points.push(new THREE.Vector2(straightHalf + Math.cos(angle) * turnRadius, Math.sin(angle) * turnRadius));
  }
  for (let i = 0; i < straightSamples; i += 1) points.push(new THREE.Vector2(THREE.MathUtils.lerp(straightHalf, -straightHalf, i / straightSamples), -turnRadius));
  for (let i = 0; i < arcSamples; i += 1) {
    const angle = THREE.MathUtils.lerp(-Math.PI / 2, Math.PI / 2, i / arcSamples);
    points.push(new THREE.Vector2(-straightHalf - Math.cos(angle) * turnRadius, Math.sin(angle) * turnRadius));
  }
  return points;
}

function offsetPoint(THREE, points, index, offset) {
  const previous = points[(index - 1 + points.length) % points.length];
  const next = points[(index + 1) % points.length];
  const tangent = next.clone().sub(previous).normalize();
  return points[index].clone().addScaledVector(new THREE.Vector2(-tangent.y, tangent.x), offset);
}

function makeStadiumStrip(THREE, points, innerOffset, outerOffset, y = 0) {
  const vertices = [];
  const indices = [];
  for (let index = 0; index < points.length; index += 1) {
    const inner = offsetPoint(THREE, points, index, innerOffset);
    const outer = offsetPoint(THREE, points, index, outerOffset);
    vertices.push(inner.x, y, inner.y, outer.x, y, outer.y);
  }
  for (let index = 0; index < points.length; index += 1) {
    const next = (index + 1) % points.length;
    const a = index * 2;
    const b = a + 1;
    const c = next * 2 + 1;
    const d = next * 2;
    indices.push(a, d, b, b, d, c);
  }
  return makeBufferGeometry(THREE, vertices, indices);
}

function makeStadiumFill(THREE, points, offset, y = -0.03) {
  const contour = points.map((_, index) => offsetPoint(THREE, points, index, offset));
  const faces = THREE.ShapeUtils.triangulateShape(contour, []);
  return makeBufferGeometry(THREE, contour.flatMap((point) => [point.x, y, point.y]), faces.flat());
}

function treeRecipe(index, random) {
  const archetype = index % 17 === 0 ? "redwood" : MENU_TREE_ARCHETYPES[index % 4];
  if (archetype === "short-bush") return { archetype, height: 4.1 + random() * 1.1, trunkWidth: 1.7, crownScale: 1.15, radial: 1.28, crownY: 0.69 };
  if (archetype === "tall-thin-broadleaf") return { archetype, height: 8.2 + random() * 2.1, trunkWidth: 1.8, crownScale: 1.05, radial: 0.68, crownY: 0.82 };
  if (archetype === "tiered-conifer") return { archetype, height: 8.3 + random() * 2, trunkWidth: 2.05, crownScale: 0.95, radial: 0.95, crownY: 0.54 };
  if (archetype === "redwood") return { archetype, height: 11.3 + random() * 1.5, trunkWidth: 3.1, crownScale: 0.8, radial: 0.82, crownY: 0.68 };
  return { archetype: "short-broadleaf", height: 5.8 + random() * 2.2, trunkWidth: 2.1, crownScale: 1.08, radial: 1.05, crownY: 0.77 };
}

function menuPalette(recipe) {
  const desert = recipe.id === "desert-plains";
  const swamp = recipe.id === "swamp-basin";
  const volcanic = recipe.id === "volcanic-highlands";
  const coastal = recipe.id === "coastal-cliffs";
  return {
    terrain: desert ? 0x9a9a64 : swamp ? 0x53765c : volcanic ? 0x6f8060 : coastal ? 0x8ab57b : 0x7fa66f,
    infield: desert ? 0xa9a86f : swamp ? 0x618269 : volcanic ? 0x788969 : coastal ? 0x9abe83 : 0x8eb27a,
    trunk: volcanic ? 0x4b3327 : 0x684124,
    leaves: desert ? [0x788545, 0x87934e, 0x68793f, 0x929b57, 0x718044] : swamp ? [0x2f663f, 0x42764a, 0x376d42, 0x56804d, 0x3b7045] : [0x4a8845, 0x5b974c, 0x397a40, 0x70a453, 0x4f8b3d],
    dirt: desert ? [0xad7544, 0xba814a, 0x9f693e, 0xc18a53] : [0x9e5b34, 0xb16a3d, 0x92502f, 0xb97545]
  };
}

function addTreeInstances(THREE, group, points, random, palette) {
  const count = MENU_ENVIRONMENT_COUNTS.trees;
  const lobes = MENU_ENVIRONMENT_COUNTS.canopyLobesPerTree;
  const trunkGeometry = makeSweptTrunkGeometry(THREE);
  const branchGeometry = makeSweptTrunkGeometry(THREE, { rings: 5, sides: 7, bendX: 0.14, bendZ: 0.02 });
  const blobGeometry = makeBlobGeometry(THREE, 404);
  const trunks = new THREE.InstancedMesh(trunkGeometry, createSoftPlasticMaterial(THREE, { color: palette.trunk, roughness: 0.58, clearcoat: 0.18 }), count);
  const branches = new THREE.InstancedMesh(branchGeometry, createSoftPlasticMaterial(THREE, { color: palette.trunk, roughness: 0.6, clearcoat: 0.14 }), count * 2);
  const roots = new THREE.InstancedMesh(branchGeometry, branches.material, count * 3);
  const crowns = new THREE.InstancedMesh(blobGeometry, createSoftPlasticMaterial(THREE, { color: 0xffffff, roughness: 0.5, clearcoat: 0.26 }), count * lobes);
  const dummy = new THREE.Object3D();
  const up = new THREE.Vector3(0, 1, 0);
  for (let index = 0; index < count; index += 1) {
    const pathIndex = Math.floor(index / count * points.length) % points.length;
    const base = offsetPoint(THREE, points, pathIndex, TOTAL_TRACK_WIDTH * 0.5 + 6.5 + random() * 11);
    const recipe = treeRecipe(index, random);
    const yaw = random() * Math.PI * 2;
    dummy.position.set(base.x, 0, base.y);
    dummy.rotation.set(0, yaw, 0);
    dummy.scale.set(recipe.trunkWidth, recipe.height, recipe.trunkWidth);
    dummy.updateMatrix();
    trunks.setMatrixAt(index, dummy.matrix);
    for (let branch = 0; branch < 2; branch += 1) {
      const side = branch ? 1 : -1;
      const start = new THREE.Vector3(base.x, recipe.height * (0.57 + branch * 0.1), base.y);
      const direction = new THREE.Vector3(side * (0.85 + random() * 0.45), 0.5 + random() * 0.4, (random() - 0.5) * 1.1).applyAxisAngle(up, yaw);
      dummy.position.copy(start);
      dummy.quaternion.setFromUnitVectors(up, direction.clone().normalize());
      dummy.scale.set(0.6, direction.length(), 0.6);
      dummy.updateMatrix();
      branches.setMatrixAt(index * 2 + branch, dummy.matrix);
    }
    for (let root = 0; root < 3; root += 1) {
      const angle = yaw + root / 3 * Math.PI * 2 + random() * 0.25;
      const direction = new THREE.Vector3(Math.cos(angle) * (0.65 + random() * 0.35), -0.08, Math.sin(angle) * (0.65 + random() * 0.35));
      dummy.position.set(base.x, 0.11, base.y);
      dummy.quaternion.setFromUnitVectors(up, direction.clone().normalize());
      dummy.scale.set(0.68, direction.length(), 0.68);
      dummy.updateMatrix();
      roots.setMatrixAt(index * 3 + root, dummy.matrix);
    }
    for (let lobe = 0; lobe < lobes; lobe += 1) {
      const angle = yaw + lobe / lobes * Math.PI * 2;
      let radial = lobe === 0 ? 0 : recipe.radial * (0.76 + random() * 0.42);
      let y = recipe.height * recipe.crownY + (lobe === 0 ? 0.9 : (random() - 0.45) * 1.15);
      let scale = recipe.crownScale * (1.02 + random() * 0.38);
      if (recipe.archetype === "tiered-conifer") {
        const tier = Math.floor(lobe / 2);
        radial = (1.25 - tier * 0.24) * (lobe % 2 ? 1 : -1);
        y = recipe.height * (0.55 + tier * 0.14);
        scale *= 1 - tier * 0.1;
      } else if (recipe.archetype === "redwood") {
        const tier = Math.floor(lobe / 2);
        radial = (0.95 - tier * 0.12) * (lobe % 2 ? 1 : -1);
        y = recipe.height * (0.66 + tier * 0.1);
        scale *= 0.9 - tier * 0.05;
      }
      dummy.position.set(base.x + Math.cos(angle) * radial, y, base.y + Math.sin(angle) * radial);
      dummy.rotation.set((random() - 0.5) * 0.13, random() * Math.PI, (random() - 0.5) * 0.13);
      dummy.scale.set(scale * (1.04 + random() * 0.18), scale * (0.83 + random() * 0.23), scale);
      dummy.updateMatrix();
      const instance = index * lobes + lobe;
      crowns.setMatrixAt(instance, dummy.matrix);
      crowns.setColorAt(instance, new THREE.Color(palette.leaves[(index + lobe) % palette.leaves.length]));
    }
  }
  for (const object of [trunks, branches, roots, crowns]) {
    object.castShadow = true;
    object.receiveShadow = true;
    group.add(object);
  }
}

function addRockInstances(THREE, group, random) {
  const definitions = [
    ["round", MENU_ENVIRONMENT_COUNTS.rocks.round],
    ["sharp-side", MENU_ENVIRONMENT_COUNTS.rocks.sharpSide],
    ["vertical", MENU_ENVIRONMENT_COUNTS.rocks.vertical]
  ];
  const dummy = new THREE.Object3D();
  for (let styleIndex = 0; styleIndex < definitions.length; styleIndex += 1) {
    const [style, count] = definitions[styleIndex];
    const rocks = new THREE.InstancedMesh(
      makeRockGeometry(THREE, style, 900 + styleIndex),
      createSoftPlasticMaterial(THREE, { color: 0xffffff, vertexColors: true, flatShading: true, roughness: 0.58, clearcoat: 0.12 }),
      count
    );
    for (let index = 0; index < count; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = style === "round" ? 2.3 + random() * 7 : 4 + random() * 5;
      const scale = style === "vertical" ? 0.62 + random() * 0.28 : 0.52 + random() * 0.58;
      dummy.position.set(Math.cos(angle) * radius + (styleIndex - 1) * 1.6, 0.02, Math.sin(angle) * radius * 0.56);
      dummy.rotation.set(0, random() * Math.PI * 2, (random() - 0.5) * (style === "vertical" ? 0.06 : 0.15));
      dummy.scale.set(scale * (0.85 + random() * 0.3), scale, scale * (0.85 + random() * 0.3));
      dummy.updateMatrix();
      rocks.setMatrixAt(index, dummy.matrix);
    }
    rocks.castShadow = true;
    rocks.receiveShadow = true;
    group.add(rocks);
  }
}

function addGroundCover(THREE, group, points, random) {
  const dummy = new THREE.Object3D();
  const grass = new THREE.InstancedMesh(
    makeGrassGeometry(THREE),
    createSoftPlasticMaterial(THREE, { color: 0x4f8c43, roughness: 0.64, clearcoat: 0.1, side: THREE.DoubleSide }),
    MENU_ENVIRONMENT_COUNTS.grassBlades
  );
  for (let index = 0; index < MENU_ENVIRONMENT_COUNTS.grassBlades; index += 1) {
    let x;
    let z;
    if (index < 120) {
      x = (random() - 0.5) * 24;
      z = (random() - 0.5) * 9.5;
    } else {
      const pathIndex = Math.floor(random() * points.length);
      const point = offsetPoint(THREE, points, pathIndex, TOTAL_TRACK_WIDTH * 0.5 + 0.9 + random() * 15);
      x = point.x;
      z = point.y;
    }
    const scale = 0.45 + random() * 0.72;
    dummy.position.set(x, 0.02, z);
    dummy.rotation.set(0, random() * Math.PI, 0);
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    grass.setMatrixAt(index, dummy.matrix);
  }
  group.add(grass);

  const plantCount = MENU_ENVIRONMENT_COUNTS.broadleafPlants;
  const leavesPerPlant = MENU_ENVIRONMENT_COUNTS.leavesPerPlant;
  const plants = new THREE.InstancedMesh(
    makeBroadleafGeometry(THREE),
    createSoftPlasticMaterial(THREE, { color: 0x407b3b, roughness: 0.58, clearcoat: 0.18, side: THREE.DoubleSide }),
    plantCount * leavesPerPlant
  );
  for (let plant = 0; plant < plantCount; plant += 1) {
    const pathIndex = Math.floor(random() * points.length);
    const base = plant < 8
      ? new THREE.Vector2(-9 + plant * 2.4, -6.5 + (plant % 3) * 1.7)
      : offsetPoint(THREE, points, pathIndex, TOTAL_TRACK_WIDTH * 0.5 + 1.4 + random() * 8);
    for (let leaf = 0; leaf < leavesPerPlant; leaf += 1) {
      const angle = leaf / leavesPerPlant * Math.PI * 2 + random() * 0.22;
      const scale = 0.48 + random() * 0.34;
      dummy.position.set(base.x, 0.03, base.y);
      dummy.rotation.set(Math.cos(angle) * 0.7, angle, Math.sin(angle) * 0.7);
      dummy.scale.set(scale, scale * (0.9 + random() * 0.3), scale);
      dummy.updateMatrix();
      plants.setMatrixAt(plant * leavesPerPlant + leaf, dummy.matrix);
    }
  }
  group.add(plants);
}

function addCloudInstances(THREE, group) {
  const geometry = makeBlobGeometry(THREE, 1300);
  const material = createSoftPlasticMaterial(THREE, { color: 0xf1ead8, roughness: 0.7, clearcoat: 0.06 });
  const dummy = new THREE.Object3D();
  const broad = new THREE.InstancedMesh(geometry, material, MENU_ENVIRONMENT_COUNTS.clouds.broad);
  for (let index = 0; index < broad.count; index += 1) {
    const centered = index - (broad.count - 1) * 0.5;
    dummy.position.set(-18 + centered * 1.2, 18 + Math.cos(index) * 0.35 + (index % 2) * 0.35, -25 + Math.sin(index) * 0.45);
    dummy.rotation.set(0, index * 0.4, 0);
    dummy.scale.set(1.45, 1.02, 1.15);
    dummy.updateMatrix(); broad.setMatrixAt(index, dummy.matrix);
  }
  const tower = new THREE.InstancedMesh(geometry, createSoftPlasticMaterial(THREE, { color: 0xaeb7b1, roughness: 0.74, clearcoat: 0.04 }), MENU_ENVIRONMENT_COUNTS.clouds.tower);
  for (let index = 0; index < tower.count; index += 1) {
    const baseLayer = index < 5;
    const level = Math.max(0, index - 4);
    const x = baseLayer ? (index - 2) * 1.05 : [0, -0.52, 0.42, -0.24, 0.08][Math.min(4, level - 1)] ?? 0;
    const y = baseLayer ? 0.3 + Math.max(0, 1.1 - Math.abs(index - 2) * 0.38) : 1.55 + level * 0.82;
    const taper = baseLayer ? 1 : Math.max(0.62, 1 - level * 0.07);
    dummy.position.set(24 + x, 18.5 + y, -28 + Math.sin(index * 1.7) * 0.35);
    dummy.rotation.set(0, index * 0.27, 0);
    dummy.scale.set(1.55 * taper, (baseLayer ? 1.05 : 1.25) * taper, 1.32 * taper);
    dummy.updateMatrix(); tower.setMatrixAt(index, dummy.matrix);
  }
  const thin = new THREE.InstancedMesh(geometry, material, MENU_ENVIRONMENT_COUNTS.clouds.thin);
  for (let index = 0; index < thin.count; index += 1) {
    const centered = index - (thin.count - 1) * 0.5;
    dummy.position.set(centered * 1.5, 17 + Math.sin(index * 1.4) * 0.22, -31);
    dummy.rotation.set(0, index * 0.31, 0);
    dummy.scale.set(1.32, 0.6, 0.88);
    dummy.updateMatrix(); thin.setMatrixAt(index, dummy.matrix);
  }
  group.add(broad, tower, thin);
}

export function createPrehistoricMenuEnvironment(THREE, recipe) {
  if (!THREE?.Group) throw new Error("Three.js is required to create the menu environment.");
  if (!recipe?.id || !recipe?.presentation) throw new Error("A Prehistoric Rush world recipe is required.");
  const group = new THREE.Group();
  group.name = `prehistoric-menu-environment:${recipe.id}`;
  const random = seededRandom(recipe.seed);
  const palette = menuPalette(recipe);
  const points = stadiumPoints(THREE);
  const terrainColor = new THREE.Color(...recipe.presentation.terrainColor).lerp(new THREE.Color(palette.terrain), 0.42);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(112, 80), createSoftPlasticMaterial(THREE, { color: terrainColor, roughness: 0.72, clearcoat: 0.07, side: THREE.DoubleSide }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.08;
  ground.receiveShadow = true;
  group.add(ground);
  group.add(new THREE.Mesh(
    makeStadiumFill(THREE, points, -TOTAL_TRACK_WIDTH * 0.5 - 0.22),
    createSoftPlasticMaterial(THREE, { color: palette.infield, roughness: 0.68, clearcoat: 0.09, side: THREE.DoubleSide })
  ));
  for (let lane = 0; lane < MENU_TRACK_SPEC.lanes; lane += 1) {
    const innerOffset = -TOTAL_TRACK_WIDTH * 0.5 + lane * MENU_TRACK_SPEC.laneWidth;
    const mesh = new THREE.Mesh(
      makeStadiumStrip(THREE, points, innerOffset, innerOffset + MENU_TRACK_SPEC.laneWidth),
      createSoftPlasticMaterial(THREE, { color: palette.dirt[lane], roughness: 0.62, clearcoat: 0.11, side: THREE.DoubleSide })
    );
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  const lineMaterial = createSoftPlasticMaterial(THREE, { color: 0xe7d5aa, roughness: 0.72, clearcoat: 0.04, side: THREE.DoubleSide });
  for (let line = 0; line <= MENU_TRACK_SPEC.lanes; line += 1) {
    const offset = -TOTAL_TRACK_WIDTH * 0.5 + line * MENU_TRACK_SPEC.laneWidth;
    group.add(new THREE.Mesh(makeStadiumStrip(THREE, points, offset - 0.055, offset + 0.055, 0.035), lineMaterial));
  }
  for (let lane = 0; lane < MENU_TRACK_SPEC.lanes; lane += 1) {
    const laneCenter = MENU_TRACK_SPEC.turnRadius - TOTAL_TRACK_WIDTH * 0.5 + (lane + 0.5) * MENU_TRACK_SPEC.laneWidth;
    const marker = new THREE.Mesh(new THREE.PlaneGeometry(MENU_TRACK_SPEC.laneWidth - 0.32, 0.16), lineMaterial);
    marker.rotation.x = -Math.PI / 2;
    marker.rotation.z = Math.PI / 2;
    marker.position.set(-MENU_TRACK_SPEC.straightHalf * 0.72, 0.045, laneCenter);
    group.add(marker);
  }
  addTreeInstances(THREE, group, points, random, palette);
  addRockInstances(THREE, group, random);
  addGroundCover(THREE, group, points, random);
  addCloudInstances(THREE, group);
  group.userData.track = getMenuTrackMetrics();
  group.userData.environmentCounts = MENU_ENVIRONMENT_COUNTS;
  group.userData.performanceBudget = MENU_ENVIRONMENT_BUDGET;
  group.userData.performanceEstimate = getMenuEnvironmentPerformanceEstimate();
  return group;
}
