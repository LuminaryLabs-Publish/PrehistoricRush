const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const dampingAlpha = (sharpness, dt) => 1 - Math.exp(-Math.max(0, sharpness) * Math.max(0, dt));

function materialsOf(mesh) {
  return Array.isArray(mesh?.material) ? mesh.material : mesh?.material ? [mesh.material] : [];
}

export function createCreatureMesh(THREE, descriptor, options = {}) {
  if (!descriptor?.geometry || !descriptor?.skeleton) throw new TypeError("A procedural creature descriptor is required.");
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(descriptor.geometry.indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(descriptor.geometry.positions, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(descriptor.geometry.normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(descriptor.geometry.colors, 3));
  geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(descriptor.geometry.skinIndices, 4));
  geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(descriptor.geometry.skinWeights, 4));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  const boneById = {};
  const orderedBones = descriptor.skeleton.bones.map((definition) => {
    const bone = new THREE.Bone();
    bone.name = definition.id;
    bone.position.set(...definition.position);
    bone.quaternion.set(...definition.rotation);
    boneById[definition.id] = bone;
    return bone;
  });
  descriptor.skeleton.bones.forEach((definition) => {
    if (definition.parentId) boneById[definition.parentId].add(boneById[definition.id]);
  });

  const opacity = options.opacity == null ? 1 : clamp01(options.opacity);
  const material = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: descriptor.material.roughness,
    metalness: descriptor.material.metalness,
    transparent: opacity < 0.999,
    opacity,
    depthWrite: opacity >= 0.999
  });
  const mesh = new THREE.SkinnedMesh(geometry, material);
  const root = boneById[descriptor.skeleton.rootBoneId];
  mesh.add(root);
  root.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(orderedBones);
  mesh.bind(skeleton);
  mesh.normalizeSkinWeights();
  mesh.scale.set(...descriptor.transform.scale);
  mesh.castShadow = options.castShadow ?? true;
  mesh.receiveShadow = options.receiveShadow ?? true;
  mesh.userData = { bodyDescriptor: descriptor, boneById };
  return mesh;
}

export function applyCreaturePose(mesh, pose) {
  const boneById = mesh?.userData?.boneById ?? {};
  for (const [boneId, transform] of Object.entries(pose?.bones ?? {})) {
    const bone = boneById[boneId];
    if (!bone) continue;
    if (transform.position) bone.position.set(...transform.position);
    if (transform.rotationEuler) bone.rotation.set(...transform.rotationEuler);
  }
  mesh?.skeleton?.update();
}

function dampAngle(current, target, alpha) {
  let delta = target - current;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return current + delta * alpha;
}

export function applyCreaturePoseDamped(mesh, pose, dt, sharpness = 14) {
  const alpha = dampingAlpha(sharpness, dt);
  const boneById = mesh?.userData?.boneById ?? {};
  for (const [boneId, transform] of Object.entries(pose?.bones ?? {})) {
    const bone = boneById[boneId];
    if (!bone) continue;
    if (transform.position) {
      bone.position.x += (transform.position[0] - bone.position.x) * alpha;
      bone.position.y += (transform.position[1] - bone.position.y) * alpha;
      bone.position.z += (transform.position[2] - bone.position.z) * alpha;
    }
    if (transform.rotationEuler) {
      bone.rotation.x = dampAngle(bone.rotation.x, transform.rotationEuler[0], alpha);
      bone.rotation.y = dampAngle(bone.rotation.y, transform.rotationEuler[1], alpha);
      bone.rotation.z = dampAngle(bone.rotation.z, transform.rotationEuler[2], alpha);
    }
  }
  mesh?.skeleton?.update();
}

export function setCreatureOpacity(mesh, opacity) {
  const next = clamp01(opacity);
  for (const material of materialsOf(mesh)) {
    material.transparent = next < 0.999;
    material.opacity = next;
    material.depthWrite = next >= 0.999;
    material.needsUpdate = true;
  }
}

export function hasCompatibleCreatureTopology(left, right) {
  if (!left?.geometry || !right?.geometry) return false;
  const arraysMatch = ["positions", "normals", "colors", "indices", "skinIndices", "skinWeights"]
    .every((key) => left.geometry[key]?.length === right.geometry[key]?.length);
  if (!arraysMatch) return false;
  const leftBones = left.skeleton?.bones ?? [];
  const rightBones = right.skeleton?.bones ?? [];
  return leftBones.length === rightBones.length && leftBones.every((bone, index) => bone.id === rightBones[index]?.id);
}

function dampArray(current, target, alpha) {
  let maximumDelta = 0;
  for (let index = 0; index < current.length; index += 1) {
    const delta = target[index] - current[index];
    current[index] += delta * alpha;
    maximumDelta = Math.max(maximumDelta, Math.abs(delta));
  }
  return maximumDelta;
}

function normalizeNormals(array) {
  for (let index = 0; index < array.length; index += 3) {
    const length = Math.hypot(array[index], array[index + 1], array[index + 2]) || 1;
    array[index] /= length;
    array[index + 1] /= length;
    array[index + 2] /= length;
  }
}

export function dampCreatureMeshTowardDescriptor(mesh, descriptor, dt, sharpness = 10) {
  if (!hasCompatibleCreatureTopology(mesh?.userData?.bodyDescriptor, descriptor)) {
    throw new RangeError("Cannot damp between incompatible creature topologies.");
  }
  const alpha = dampingAlpha(sharpness, dt);
  const geometry = mesh.geometry;
  const position = geometry.getAttribute("position");
  const normal = geometry.getAttribute("normal");
  const color = geometry.getAttribute("color");
  let maximumDelta = dampArray(position.array, descriptor.geometry.positions, alpha);
  maximumDelta = Math.max(maximumDelta, dampArray(normal.array, descriptor.geometry.normals, alpha));
  maximumDelta = Math.max(maximumDelta, dampArray(color.array, descriptor.geometry.colors, alpha));
  normalizeNormals(normal.array);
  position.needsUpdate = true;
  normal.needsUpdate = true;
  color.needsUpdate = true;

  const targetScale = descriptor.transform.scale;
  maximumDelta = Math.max(
    maximumDelta,
    Math.abs(targetScale[0] - mesh.scale.x),
    Math.abs(targetScale[1] - mesh.scale.y),
    Math.abs(targetScale[2] - mesh.scale.z)
  );
  mesh.scale.x += (targetScale[0] - mesh.scale.x) * alpha;
  mesh.scale.y += (targetScale[1] - mesh.scale.y) * alpha;
  mesh.scale.z += (targetScale[2] - mesh.scale.z) * alpha;

  for (const material of materialsOf(mesh)) {
    maximumDelta = Math.max(
      maximumDelta,
      Math.abs(descriptor.material.roughness - material.roughness),
      Math.abs(descriptor.material.metalness - material.metalness)
    );
    material.roughness += (descriptor.material.roughness - material.roughness) * alpha;
    material.metalness += (descriptor.material.metalness - material.metalness) * alpha;
  }

  if (maximumDelta < 0.0005) {
    position.array.set(descriptor.geometry.positions);
    normal.array.set(descriptor.geometry.normals);
    color.array.set(descriptor.geometry.colors);
    position.needsUpdate = true;
    normal.needsUpdate = true;
    color.needsUpdate = true;
    mesh.scale.set(...targetScale);
    mesh.userData.bodyDescriptor = descriptor;
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
  }
  return maximumDelta;
}

export function disposeCreatureMesh(mesh) {
  if (!mesh) return;
  mesh.parent?.remove(mesh);
  mesh.geometry?.dispose?.();
  for (const material of materialsOf(mesh)) material.dispose?.();
  mesh.skeleton?.dispose?.();
}
