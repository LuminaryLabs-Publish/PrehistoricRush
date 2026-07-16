const DEFAULT_THRESHOLDS = Object.freeze({ near: 120, medium: 42, far: 6 });

function combineBounds(trunk, crown) {
  const min = [
    Math.min(trunk.bounds.min[0], crown.bounds.min[0]),
    Math.min(trunk.bounds.min[1], crown.bounds.min[1]),
    Math.min(trunk.bounds.min[2], crown.bounds.min[2])
  ];
  const max = [
    Math.max(trunk.bounds.max[0], crown.bounds.max[0]),
    Math.max(trunk.bounds.max[1], crown.bounds.max[1]),
    Math.max(trunk.bounds.max[2], crown.bounds.max[2])
  ];
  return {
    min,
    max,
    center: [(min[0] + max[0]) * 0.5, (min[1] + max[1]) * 0.5, (min[2] + max[2]) * 0.5],
    width: Math.max(max[0] - min[0], max[2] - min[2]),
    height: max[1] - min[1]
  };
}

function projectedPixels(camera, renderer, worldHeight, distance) {
  const viewportHeight = renderer.domElement?.height || globalThis.innerHeight || 720;
  const fov = Math.max(1, Number(camera.fov ?? 60)) * Math.PI / 180;
  return worldHeight * viewportHeight / Math.max(0.001, 2 * distance * Math.tan(fov * 0.5));
}

function suppressLegacyTreeMeshes(scene, typeCount) {
  const candidates = [];
  scene.traverse((object) => {
    if (!object?.isInstancedMesh) return;
    const type = object.geometry?.type;
    if (type === "CylinderGeometry" || type === "IcosahedronGeometry") candidates.push(object);
  });
  const expected = typeCount * 2;
  for (const object of candidates.slice(0, expected)) {
    object.visible = false;
    object.userData.legacyTreeSuppressed = true;
  }
  return Math.min(expected, candidates.length);
}

function createBillboardGeometry(THREE) {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  geometry.translate(0, 0.5, 0);
  return geometry;
}

function createAtlasMaterials(THREE, packageValue, fallbackColor) {
  const frames = packageValue?.forms?.far?.frames ?? [];
  const atlas = packageValue?.forms?.far?.atlas;
  const metadata = atlas?.metadata ?? {};
  const columns = Math.max(1, Number(metadata.columns ?? metadata.width / metadata.frameSize) || 8);
  const rows = Math.max(1, Number(metadata.rows ?? metadata.height / metadata.frameSize) || 2);
  const source = atlas?.assetId;
  const baseTexture = source ? new THREE.TextureLoader().load(source) : null;
  if (baseTexture) {
    baseTexture.colorSpace = THREE.SRGBColorSpace;
    baseTexture.wrapS = THREE.ClampToEdgeWrapping;
    baseTexture.wrapT = THREE.ClampToEdgeWrapping;
    baseTexture.generateMipmaps = true;
  }
  const count = Math.max(1, frames.filter((frame) => Number(frame.elevationDegrees) === Number(frames[0]?.elevationDegrees ?? 0)).length || columns);
  return Array.from({ length: count }, (_, index) => {
    const texture = baseTexture?.clone?.() ?? null;
    if (texture) {
      texture.repeat.set(1 / columns, 1 / rows);
      texture.offset.set((index % columns) / columns, Math.max(0, rows - 1) / rows);
      texture.needsUpdate = true;
    }
    return new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : fallbackColor,
      map: texture,
      transparent: false,
      alphaTest: 0.38,
      side: THREE.DoubleSide,
      depthWrite: true,
      fog: true
    });
  });
}

function createTypeLayer(THREE, scene, packageValue, type, typeIndex, capacity) {
  const material = packageValue?.material ?? {};
  const trunkColor = material.trunk?.color ?? 0x6b432b;
  const crownColor = material.crown?.color ?? type[5] ?? 0x397b3f;
  const nearTrunk = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.7, 1.15, 1, 10, 3),
    new THREE.MeshStandardMaterial({ color: trunkColor, roughness: material.trunk?.roughness ?? 0.86, metalness: 0 }),
    capacity
  );
  const nearCrown = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 2),
    new THREE.MeshStandardMaterial({ color: crownColor, roughness: material.crown?.roughness ?? 0.78, metalness: 0 }),
    capacity
  );
  const mediumTrunk = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.7, 1.15, 1, 6, 1),
    new THREE.MeshStandardMaterial({ color: trunkColor, roughness: 0.9, metalness: 0 }),
    capacity
  );
  const mediumCrown = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.MeshStandardMaterial({ color: crownColor, roughness: 0.84, metalness: 0 }),
    capacity
  );
  nearTrunk.castShadow = nearTrunk.receiveShadow = true;
  nearCrown.castShadow = false;
  nearCrown.receiveShadow = true;
  mediumTrunk.castShadow = false;
  mediumTrunk.receiveShadow = true;
  mediumCrown.castShadow = false;
  mediumCrown.receiveShadow = true;
  for (const mesh of [nearTrunk, nearCrown, mediumTrunk, mediumCrown]) {
    mesh.name = `prehistoric-tree-fidelity-${typeIndex}-${mesh.geometry.type}`;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    scene.add(mesh);
  }

  const billboardGeometry = createBillboardGeometry(THREE);
  const billboardMaterials = createAtlasMaterials(THREE, packageValue, crownColor);
  const billboards = billboardMaterials.map((billboardMaterial, angleIndex) => {
    const mesh = new THREE.InstancedMesh(billboardGeometry, billboardMaterial, capacity);
    mesh.name = `prehistoric-tree-fidelity-${typeIndex}-impostor-${angleIndex}`;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  });

  return {
    typeIndex,
    packageValue,
    nearTrunk,
    nearCrown,
    mediumTrunk,
    mediumCrown,
    billboards,
    counts: { near: 0, medium: 0, far: 0 }
  };
}

function disposeMesh(scene, mesh, sharedGeometry = false) {
  scene.remove(mesh);
  if (!sharedGeometry) mesh.geometry?.dispose?.();
  const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
  for (const material of materials) {
    material.map?.dispose?.();
    material.dispose?.();
  }
}

export function createThreeTreeFidelityLayer(THREE, options = {}) {
  const { scene, camera, renderer, treeTypes = [], packages = [], capacity = 256 } = options;
  if (!scene || !camera || !renderer) throw new TypeError("Tree fidelity layer requires scene, camera, and renderer.");
  const patches = new Map();
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  const layers = treeTypes.map((type, typeIndex) => createTypeLayer(THREE, scene, packages[typeIndex] ?? null, type, typeIndex, capacity));
  const suppressedLegacyMeshes = suppressLegacyTreeMeshes(scene, treeTypes.length);
  const view = {
    enabled: true,
    activePatches: 0,
    treeCount: 0,
    suppressedLegacyMeshes,
    counts: { near: 0, medium: 0, far: 0 },
    packageCount: packages.filter(Boolean).length
  };

  function activatePatch(patch) {
    patches.set(patch.id, patch);
    view.activePatches = patches.size;
  }

  function releasePatches(ids = []) {
    for (const id of ids) patches.delete(id);
    view.activePatches = patches.size;
  }

  function writeMatrix(mesh, index, source) {
    matrix.fromArray(source);
    mesh.setMatrixAt(index, matrix);
  }

  function writeBillboard(mesh, index, bounds, cameraPosition) {
    const dx = cameraPosition.x - bounds.center[0];
    const dz = cameraPosition.z - bounds.center[2];
    euler.set(0, Math.atan2(dx, dz), 0);
    quaternion.setFromEuler(euler);
    position.set(bounds.center[0], bounds.min[1], bounds.center[2]);
    scale.set(bounds.width, bounds.height, 1);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  }

  function selectThresholds(packageValue) {
    return {
      near: Number(packageValue?.forms?.near?.minimumProjectedSize ?? DEFAULT_THRESHOLDS.near),
      medium: Number(packageValue?.forms?.medium?.minimumProjectedSize ?? DEFAULT_THRESHOLDS.medium),
      far: Number(packageValue?.forms?.far?.minimumProjectedSize ?? DEFAULT_THRESHOLDS.far)
    };
  }

  function update() {
    const perType = layers.map(() => ({ near: [], medium: [], far: [] }));
    for (const patch of patches.values()) {
      patch.trees.forEach((treeSet, typeIndex) => {
        const target = perType[typeIndex];
        const layer = layers[typeIndex];
        const thresholds = selectThresholds(layer.packageValue);
        const count = Math.min(treeSet.trunks.length, treeSet.crowns.length);
        for (let index = 0; index < count; index += 1) {
          const trunk = treeSet.trunks[index];
          const crown = treeSet.crowns[index];
          const bounds = combineBounds(trunk, crown);
          const distance = Math.max(0.001, camera.position.distanceTo(position.set(...bounds.center)));
          const pixels = projectedPixels(camera, renderer, bounds.height, distance);
          const record = { trunk, crown, bounds, pixels };
          if (pixels >= thresholds.near) target.near.push(record);
          else if (pixels >= thresholds.medium) target.medium.push(record);
          else target.far.push(record);
        }
      });
    }

    view.counts = { near: 0, medium: 0, far: 0 };
    view.treeCount = 0;
    perType.forEach((selection, typeIndex) => {
      const layer = layers[typeIndex];
      const nearCount = Math.min(capacity, selection.near.length);
      const mediumCount = Math.min(capacity, selection.medium.length);
      for (let index = 0; index < nearCount; index += 1) {
        writeMatrix(layer.nearTrunk, index, selection.near[index].trunk.matrix);
        writeMatrix(layer.nearCrown, index, selection.near[index].crown.matrix);
      }
      for (let index = 0; index < mediumCount; index += 1) {
        writeMatrix(layer.mediumTrunk, index, selection.medium[index].trunk.matrix);
        writeMatrix(layer.mediumCrown, index, selection.medium[index].crown.matrix);
      }
      layer.nearTrunk.count = layer.nearCrown.count = nearCount;
      layer.mediumTrunk.count = layer.mediumCrown.count = mediumCount;
      for (const mesh of [layer.nearTrunk, layer.nearCrown, layer.mediumTrunk, layer.mediumCrown]) mesh.instanceMatrix.needsUpdate = true;

      const angleSelections = layer.billboards.map(() => []);
      for (const record of selection.far) {
        const dx = camera.position.x - record.bounds.center[0];
        const dz = camera.position.z - record.bounds.center[2];
        const angle = (Math.atan2(dx, dz) + Math.PI * 2) % (Math.PI * 2);
        const angleIndex = Math.round(angle / (Math.PI * 2) * layer.billboards.length) % layer.billboards.length;
        angleSelections[angleIndex].push(record);
      }
      let farCount = 0;
      angleSelections.forEach((records, angleIndex) => {
        const mesh = layer.billboards[angleIndex];
        const count = Math.min(capacity, records.length);
        for (let index = 0; index < count; index += 1) writeBillboard(mesh, index, records[index].bounds, camera.position);
        mesh.count = count;
        mesh.instanceMatrix.needsUpdate = true;
        farCount += count;
      });
      layer.counts = { near: nearCount, medium: mediumCount, far: farCount };
      view.counts.near += nearCount;
      view.counts.medium += mediumCount;
      view.counts.far += farCount;
      view.treeCount += nearCount + mediumCount + farCount;
    });
    return view;
  }

  function dispose() {
    patches.clear();
    for (const layer of layers) {
      disposeMesh(scene, layer.nearTrunk);
      disposeMesh(scene, layer.nearCrown);
      disposeMesh(scene, layer.mediumTrunk);
      disposeMesh(scene, layer.mediumCrown);
      const geometry = layer.billboards[0]?.geometry;
      for (const mesh of layer.billboards) disposeMesh(scene, mesh, true);
      geometry?.dispose?.();
    }
  }

  return Object.freeze({ view, activatePatch, releasePatches, update, dispose });
}

export default createThreeTreeFidelityLayer;
