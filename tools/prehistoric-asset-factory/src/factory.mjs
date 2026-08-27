import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { RACER_ROSTER_DETAILS } from "../../../src/racers/racer-roster.js";
import { PREHISTORIC_TREE_ARCHETYPES } from "../../../src/shared/tree-archetype-catalog.js";

const RACER_IDS = Object.freeze(Object.keys(RACER_ROSTER_DETAILS));
const TREE_IDS = Object.freeze(PREHISTORIC_TREE_ARCHETYPES.map((entry) => entry.id));
export const ASSET_IDS = Object.freeze([
  ...RACER_IDS.map((id) => `racer:${id}`),
  ...TREE_IDS.map((id) => `tree:${id}`)
]);

function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function rng(seed) {
  let state = hashText(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function material(color, roughness = 0.78) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 });
}

function mesh(geometry, surface, name, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
  geometry.computeVertexNormals();
  const object = new THREE.Mesh(geometry, surface);
  object.name = name;
  object.position.set(...position);
  object.scale.set(...scale);
  object.rotation.set(...rotation);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function ellipsoid(surface, name, position, scale, detail = 2) {
  return mesh(new THREE.IcosahedronGeometry(1, detail), surface, name, position, scale);
}

function coneBetween(surface, name, start, end, startRadius, endRadius = 0.02, radialSegments = 10) {
  const a = new THREE.Vector3(...start);
  const b = new THREE.Vector3(...end);
  const direction = b.clone().sub(a);
  const object = mesh(
    new THREE.CylinderGeometry(endRadius, startRadius, direction.length(), radialSegments, 2),
    surface,
    name,
    [0, 0, 0]
  );
  object.position.copy(a).add(b).multiplyScalar(0.5);
  object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return object;
}

function trianglePlate(surface, name, position, scale, rotation = [0, 0, 0]) {
  const shape = new THREE.BufferGeometry();
  shape.setAttribute("position", new THREE.Float32BufferAttribute([
    -0.6, 0, -0.08, 0.6, 0, -0.08, 0, 1, 0,
    0.6, 0, 0.08, -0.6, 0, 0.08, 0, 1, 0
  ], 3));
  shape.computeVertexNormals();
  return mesh(shape, surface, name, position, scale, rotation);
}

function addEyes(head, accent, scale = 1) {
  const eyeMaterial = material(0xf4d96b, 0.28);
  const pupilMaterial = material(0x15150e, 0.35);
  for (const side of [-1, 1]) {
    head.add(ellipsoid(eyeMaterial, `eye-${side}`, [side * 0.25 * scale, 0.2 * scale, 0.72 * scale], [0.12, 0.12, 0.08]));
    head.add(ellipsoid(pupilMaterial, `pupil-${side}`, [side * 0.25 * scale, 0.205 * scale, 0.79 * scale], [0.045, 0.07, 0.035], 1));
  }
  head.add(ellipsoid(material(accent, 0.5), "brow-accent", [0, 0.32 * scale, 0.57 * scale], [0.38, 0.08, 0.18], 1));
}

function addRacerIdentity(root, id, parts, surfaces) {
  const { body, head, tailRig, spineRig } = parts;
  const { skin, under, accent, dark } = surfaces;
  const spikes = (count, height = 0.38, start = -0.65, step = 0.3) => {
    for (let index = 0; index < count; index += 1) {
      spineRig.add(trianglePlate(accent, `dorsal-${index}`, [0, 0.68, start + index * step], [0.3, height * (1 - index * 0.035), 0.32]));
    }
  };
  if (id === "triceratops") {
    head.add(ellipsoid(accent, "frill", [0, 0.25, -0.18], [0.72, 0.75, 0.16], 2));
    head.add(coneBetween(under, "nose-horn", [0, 0.08, 0.65], [0, 0.34, 1.25], 0.13, 0.025));
    for (const side of [-1, 1]) head.add(coneBetween(under, `brow-horn-${side}`, [side * 0.28, 0.25, 0.42], [side * 0.38, 0.58, 1.2], 0.14, 0.025));
  } else if (id === "stegosaurus") {
    spikes(8, 0.62, -0.85, 0.27);
    for (const side of [-1, 1]) tailRig.add(coneBetween(accent, `thagomizer-${side}`, [side * 0.13, 0, -1.15], [side * 0.5, 0.18, -1.72], 0.11, 0.02));
  } else if (id === "spinosaurus") {
    for (let index = 0; index < 9; index += 1) spineRig.add(trianglePlate(accent, `sail-${index}`, [0, 0.5, -0.9 + index * 0.24], [0.34, 0.75 + Math.sin(index / 8 * Math.PI) * 0.95, 0.36]));
    head.scale.z *= 1.42;
  } else if (id === "ankylosaurus") {
    for (let row = -1; row <= 1; row += 1) for (let index = 0; index < 5; index += 1) body.add(ellipsoid(dark, `armor-${row}-${index}`, [row * 0.42, 0.5, -0.65 + index * 0.34], [0.18, 0.1, 0.23], 1));
    tailRig.add(ellipsoid(dark, "tail-club", [0, 0, -1.65], [0.48, 0.32, 0.58], 2));
  } else if (id === "pachycephalosaurus") {
    head.add(ellipsoid(accent, "cranial-dome", [0, 0.4, 0.12], [0.52, 0.48, 0.46], 2));
    spikes(5, 0.2, -0.55, 0.26);
  } else if (id === "carnotaurus") {
    for (const side of [-1, 1]) head.add(coneBetween(accent, `bull-horn-${side}`, [side * 0.28, 0.28, 0.12], [side * 0.46, 0.65, 0.04], 0.13, 0.015));
    spikes(6, 0.22, -0.72, 0.28);
  } else if (id === "therizinosaurus") {
    for (const side of [-1, 1]) for (let claw = 0; claw < 3; claw += 1) root.add(coneBetween(under, `claw-${side}-${claw}`, [side * (0.55 + claw * 0.05), 0.75, 0.35], [side * (0.72 + claw * 0.12), 0.62, 1.25 + claw * 0.06], 0.055, 0.008, 8));
    body.scale.y *= 1.15;
  } else if (id === "brachiosaurus") {
    spineRig.scale.y *= 1.75;
    head.position.y += 1.3;
    head.position.z -= 0.25;
    spineRig.add(coneBetween(skin, "long-neck-silhouette", [0, 0.3, 0.55], [0, 1.72, 1.05], 0.34, 0.2, 14));
  } else if (id === "pteranodon") {
    for (const side of [-1, 1]) {
      const wing = trianglePlate(skin, `wing-${side}`, [side * 0.9, 0.82, 0.05], [2.5, 1.05, 1], [Math.PI / 2, side * 0.12, -side * 0.15]);
      wing.scale.x *= side;
      root.add(wing);
    }
    root.add(coneBetween(skin, "pterosaur-neck-silhouette", [0, 0.78, 0.35], [0, 1.16, 0.92], 0.23, 0.14, 12));
    head.add(coneBetween(accent, "head-crest", [0, 0.18, -0.25], [0, 0.5, -1.05], 0.22, 0.02));
    head.scale.z *= 1.48;
  } else if (id === "gallimimus") {
    head.scale.set(0.72, 0.7, 1.2);
    spikes(4, 0.13, -0.45, 0.28);
  } else if (id === "tyrannosaurus-rex") {
    head.scale.multiplyScalar(1.22);
    spikes(7, 0.18, -0.75, 0.28);
  } else {
    spikes(8, 0.16, -0.85, 0.25);
    for (const side of [-1, 1]) root.add(trianglePlate(accent, `feather-arm-${side}`, [side * 0.52, 0.75, 0.18], [0.46, 0.72, 0.32], [0.25, 0, -side * 0.5]));
  }
}

function racerAnimations(id, bones) {
  const times = [0, 0.25, 0.5, 0.75, 1];
  const quaternionValues = (axis, amplitudes) => amplitudes.flatMap((value) => {
    const q = new THREE.Quaternion().setFromAxisAngle(axis, value);
    return [q.x, q.y, q.z, q.w];
  });
  const runTracks = [
    new THREE.QuaternionKeyframeTrack(`${bones.leftLeg.name}.quaternion`, times, quaternionValues(new THREE.Vector3(1, 0, 0), [0.55, -0.55, 0.55, -0.55, 0.55])),
    new THREE.QuaternionKeyframeTrack(`${bones.rightLeg.name}.quaternion`, times, quaternionValues(new THREE.Vector3(1, 0, 0), [-0.55, 0.55, -0.55, 0.55, -0.55])),
    new THREE.QuaternionKeyframeTrack(`${bones.tail.name}.quaternion`, times, quaternionValues(new THREE.Vector3(0, 1, 0), [-0.12, 0.12, -0.12, 0.12, -0.12])),
    new THREE.QuaternionKeyframeTrack(`${bones.spine.name}.quaternion`, times, quaternionValues(new THREE.Vector3(0, 0, 1), [0.035, -0.035, 0.035, -0.035, 0.035]))
  ];
  const idleTracks = [
    new THREE.QuaternionKeyframeTrack(`${bones.head.name}.quaternion`, [0, 1.5, 3], quaternionValues(new THREE.Vector3(0, 1, 0), [-0.045, 0.055, -0.045])),
    new THREE.QuaternionKeyframeTrack(`${bones.tail.name}.quaternion`, [0, 1.5, 3], quaternionValues(new THREE.Vector3(0, 1, 0), [-0.075, 0.075, -0.075]))
  ];
  const abilityAxis = id === "pteranodon" ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(1, 0, 0);
  const abilityTracks = [new THREE.QuaternionKeyframeTrack(`${bones.spine.name}.quaternion`, [0, 0.35, 0.8], quaternionValues(abilityAxis, [0, -0.42, 0]))];
  return [
    new THREE.AnimationClip("idle", 3, idleTracks),
    new THREE.AnimationClip("run", 1, runTracks),
    new THREE.AnimationClip("ability", 0.8, abilityTracks)
  ];
}

function createRacer(id, seed) {
  const details = RACER_ROSTER_DETAILS[id];
  const p = details.proportions;
  const random = rng(`${seed}:racer:${id}`);
  const root = new THREE.Group();
  root.name = `racer-${id}`;
  const rig = new THREE.Group();
  rig.name = `${id}-rig-root`;
  root.add(rig);
  const skin = material(details.skin, 0.76);
  const under = material(details.underbelly, 0.82);
  const accent = material(details.accent, 0.58);
  const dark = material(new THREE.Color(details.skin).multiplyScalar(0.55), 0.88);
  const spine = new THREE.Group(); spine.name = `${id}-spine`; spine.position.y = p.hipHeight;
  rig.add(spine);
  const body = ellipsoid(skin, "body", [0, 0.2, 0], [0.52 * p.bodyScale, 0.43 * p.bodyScale, p.bodyLength * 0.52], 3);
  spine.add(body);
  body.add(ellipsoid(under, "underbelly", [0, -0.18, 0.12], [0.43 * p.bodyScale, 0.19 * p.bodyScale, p.bodyLength * 0.42], 2));
  const neck = new THREE.Group(); neck.name = `${id}-neck`; neck.position.set(0, p.chestHeight - p.hipHeight, p.bodyLength * 0.38);
  spine.add(neck);
  neck.add(coneBetween(skin, "neck-form", [0, -0.16, -0.22], [0, p.headHeight - p.chestHeight, 0.35], 0.34 * p.bodyScale, 0.24 * p.bodyScale, 12));
  const head = new THREE.Group(); head.name = `${id}-head`; head.position.set(0, Math.max(0.1, p.headHeight - p.chestHeight), p.headForward * 0.5);
  neck.add(head);
  head.add(ellipsoid(skin, "skull", [0, 0, 0.3], [0.38 * p.bodyScale, 0.3 * p.bodyScale, 0.62 * p.bodyScale], 3));
  head.add(ellipsoid(under, "jaw", [0, -0.2, 0.52], [0.31 * p.bodyScale, 0.13 * p.bodyScale, 0.48 * p.bodyScale], 2));
  addEyes(head, details.accent, p.bodyScale);
  const tail = new THREE.Group(); tail.name = `${id}-tail`; tail.position.set(0, 0.12, -p.bodyLength * 0.42);
  spine.add(tail);
  tail.add(coneBetween(skin, "tail-form", [0, 0, 0], [0, 0.06, -p.tailLength], 0.34 * p.bodyScale, 0.035, 12));
  const legs = {};
  for (const [sideName, side] of [["left", -1], ["right", 1]]) {
    const leg = new THREE.Group(); leg.name = `${id}-${sideName}-leg`; leg.position.set(side * 0.34 * p.bodyScale, -0.1, -0.1); spine.add(leg);
    leg.add(coneBetween(skin, `${sideName}-thigh`, [0, 0, 0], [side * 0.05, -p.legLength * 0.54, 0.12], 0.22 * p.bodyScale, 0.14 * p.bodyScale, 10));
    leg.add(coneBetween(under, `${sideName}-shin`, [side * 0.05, -p.legLength * 0.5, 0.12], [side * 0.03, -p.legLength, 0.24], 0.14 * p.bodyScale, 0.08 * p.bodyScale, 9));
    leg.add(ellipsoid(dark, `${sideName}-foot`, [side * 0.03, -p.legLength, 0.42], [0.18, 0.08, 0.36], 2));
    legs[sideName] = leg;
  }
  if (id !== "pteranodon") for (const side of [-1, 1]) {
    const arm = new THREE.Group(); arm.name = `${id}-arm-${side}`; arm.position.set(side * 0.42 * p.bodyScale, 0.2, p.bodyLength * 0.24); spine.add(arm);
    arm.add(coneBetween(skin, `arm-form-${side}`, [0, 0, 0], [side * p.armLength * 0.32, -p.armLength * 0.65, p.armLength * 0.42], 0.11 * p.bodyScale, 0.045, 8));
  }
  addRacerIdentity(root, id, { body, head, tailRig: tail, spineRig: spine }, { skin, under, accent, dark });
  root.rotation.y = (random() - 0.5) * 0.02;
  root.userData = { schema: "prehistoric-rush.model/1", kind: "racer", id, rigged: true, clips: ["idle", "run", "ability"] };
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;
  root.updateMatrixWorld(true);
  return { id, kind: "racer", object: root, animations: racerAnimations(id, { leftLeg: legs.left, rightLeg: legs.right, tail, spine, head }) };
}

function createTree(id, seed) {
  const archetype = PREHISTORIC_TREE_ARCHETYPES.find((entry) => entry.id === id);
  if (!archetype) throw new RangeError(`Unknown tree: ${id}.`);
  const root = new THREE.Group(); root.name = `tree-${id}`;
  const rig = new THREE.Group(); rig.name = `${id}-wind-rig`; root.add(rig);
  const tree = new THREE.Group(); tree.name = `${id}-geometry`;
  const random = rng(`${seed}:tree:${id}`);
  const height = 4.2 + (archetype.averageHeight - 17) / 45 * 2.6;
  const trunkRadius = Math.max(0.13, archetype.trunkRadius * 0.16);
  const bark = material(archetype.barkColor, 0.94);
  const foliage = material(archetype.foliageColor, 0.88);
  const foliageAccent = material(archetype.accentColor, 0.8);
  tree.add(mesh(new THREE.CylinderGeometry(trunkRadius * 0.55, trunkRadius, height, 14, 7), bark, "trunk", [0, height * 0.5, 0]));
  for (let rootIndex = 0; rootIndex < 5; rootIndex += 1) {
    const angle = rootIndex / 5 * Math.PI * 2;
    tree.add(coneBetween(bark, `root-flare-${rootIndex}`, [0, 0.18, 0], [Math.sin(angle) * trunkRadius * 2.4, 0.02, Math.cos(angle) * trunkRadius * 2.4], trunkRadius * 0.48, 0.035, 8));
  }
  const crownRadius = Math.max(0.65, archetype.crownRadius * 0.105);
  const branchCount = archetype.shape === "spire" || archetype.shape === "layered-araucaria" ? 22 : 10;
  for (let branchIndex = 0; branchIndex < branchCount; branchIndex += 1) {
    const tier = branchIndex / Math.max(1, branchCount - 1);
    const angle = branchIndex * 2.399963 + random() * 0.18;
    const startY = height * (0.43 + tier * 0.47);
    const taper = archetype.shape === "spire" || archetype.shape === "layered-araucaria" ? 1 - tier * 0.7 : 0.68 + random() * 0.34;
    const radius = crownRadius * taper;
    const end = [Math.sin(angle) * radius, startY + (random() - 0.35) * 0.38, Math.cos(angle) * radius];
    tree.add(coneBetween(bark, `branch-${branchIndex}`, [0, startY, 0], end, trunkRadius * (0.28 - tier * 0.12), 0.025, 9));
    const leafScale = archetype.shape.includes("palm") || archetype.shape.includes("cycad") || archetype.shape === "giant-fern"
      ? [0.34, 0.08, Math.max(0.7, radius * 0.82)]
      : [0.4 + random() * 0.25, 0.26 + random() * 0.25, 0.52 + random() * 0.28];
    const leaf = ellipsoid(branchIndex % 3 === 0 ? foliageAccent : foliage, `foliage-${branchIndex}`, end, leafScale, 2);
    if (archetype.shape.includes("palm") || archetype.shape.includes("cycad") || archetype.shape === "giant-fern") leaf.rotation.y = angle;
    tree.add(leaf);
  }
  if (!["spire", "layered-araucaria", "tall-palm", "short-palm", "cycad", "fan-cycad", "giant-fern"].includes(archetype.shape)) {
    for (let cluster = 0; cluster < 9; cluster += 1) {
      const angle = cluster / 9 * Math.PI * 2 + random() * 0.4;
      const ring = crownRadius * (0.3 + random() * 0.64);
      tree.add(ellipsoid(cluster % 3 ? foliage : foliageAccent, `crown-${cluster}`, [Math.sin(angle) * ring, height * (0.76 + random() * 0.22), Math.cos(angle) * ring], [0.62 + random() * 0.35, 0.42 + random() * 0.32, 0.62 + random() * 0.35], 2));
    }
  }
  rig.add(tree);
  root.userData = { schema: "prehistoric-rush.model/1", kind: "tree", id, rigged: true, clips: ["wind", "gust"] };
  const q = (x, z) => {
    const value = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, 0, z));
    return [value.x, value.y, value.z, value.w];
  };
  const wind = new THREE.AnimationClip("wind", 4, [new THREE.QuaternionKeyframeTrack(`${rig.name}.quaternion`, [0, 1, 2, 3, 4], [...q(0, -0.018), ...q(0.012, 0.022), ...q(-0.008, -0.02), ...q(0.01, 0.018), ...q(0, -0.018)])]);
  const gust = new THREE.AnimationClip("gust", 1.4, [new THREE.QuaternionKeyframeTrack(`${rig.name}.quaternion`, [0, 0.45, 1.4], [...q(0, 0), ...q(0.045, 0.075), ...q(0, 0)])]);
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  root.position.y -= box.min.y;
  return { id, kind: "tree", object: root, animations: [wind, gust] };
}

export function describe(id) {
  const [kind, key] = String(id).split(":");
  if (!ASSET_IDS.includes(`${kind}:${key}`)) throw new RangeError(`Unknown factory asset: ${id}.`);
  return Object.freeze({ id: `${kind}:${key}`, kind, key, seed: `prehistoric-rush:${kind}:${key}:v1`, format: "glb", deterministic: true });
}

export function generate(id, options = {}) {
  const descriptor = describe(id);
  const seed = options.seed ?? descriptor.seed;
  return descriptor.kind === "racer" ? createRacer(descriptor.key, seed) : createTree(descriptor.key, seed);
}

export function randomize(id, options = {}) {
  return generate(id, { seed: `${options.seed ?? Date.now()}:${id}` });
}

export function reroll(id, stream = "presentation", index = 0) {
  return generate(id, { seed: `${describe(id).seed}:${stream}:${index}` });
}

function geometryMetrics(object) {
  const result = { meshes: 0, vertices: 0, triangles: 0, invalidNormals: 0, materials: 0 };
  const surfaces = new Set();
  object.traverse((node) => {
    if (!node.isMesh) return;
    result.meshes += 1;
    const position = node.geometry?.getAttribute?.("position");
    const normal = node.geometry?.getAttribute?.("normal");
    result.vertices += position?.count ?? 0;
    result.triangles += node.geometry?.index ? node.geometry.index.count / 3 : (position?.count ?? 0) / 3;
    if (!normal || normal.count !== position?.count) result.invalidNormals += position?.count ?? 1;
    else for (let index = 0; index < normal.count; index += 1) {
      const length = Math.hypot(normal.getX(index), normal.getY(index), normal.getZ(index));
      if (!Number.isFinite(length) || length < 0.7 || length > 1.3) result.invalidNormals += 1;
    }
    const values = Array.isArray(node.material) ? node.material : [node.material];
    for (const value of values) if (value) surfaces.add(value.uuid);
  });
  result.materials = surfaces.size;
  return result;
}

export function validate(value) {
  const metrics = geometryMetrics(value.object);
  const bounds = new THREE.Box3().setFromObject(value.object);
  const size = bounds.getSize(new THREE.Vector3());
  const failures = [];
  if (metrics.meshes < 3) failures.push("insufficient-mesh-detail");
  if (metrics.vertices < 300) failures.push("insufficient-vertex-detail");
  if (metrics.invalidNormals > 0) failures.push("invalid-normals");
  if (!value.animations?.length) failures.push("missing-animation-clips");
  if (bounds.min.y < -0.001) failures.push("below-ground");
  if (![size.x, size.y, size.z].every((number) => Number.isFinite(number) && number > 0)) failures.push("invalid-bounds");
  return Object.freeze({ status: failures.length ? "FAIL" : "PASS", failures, metrics, bounds: { min: bounds.min.toArray(), max: bounds.max.toArray(), size: size.toArray() }, animationClips: value.animations.map((clip) => clip.name) });
}

function installFileReader() {
  if (globalThis.FileReader) return;
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) { blob.arrayBuffer().then((value) => { this.result = value; this.onloadend?.({ target: this }); }); }
    readAsDataURL(blob) { blob.arrayBuffer().then((value) => { this.result = `data:${blob.type || "application/octet-stream"};base64,${Buffer.from(value).toString("base64")}`; this.onloadend?.({ target: this }); }); }
  };
}

export async function exportAsset(value) {
  installFileReader();
  const exporter = new GLTFExporter();
  const result = await exporter.parseAsync(value.object, { binary: true, animations: value.animations, onlyVisible: true, trs: true });
  return Buffer.from(result);
}

export const factory = Object.freeze({ describe, generate, randomize, reroll, validate, export: exportAsset });
