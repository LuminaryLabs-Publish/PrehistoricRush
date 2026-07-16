const DEFAULT_THRESHOLDS = Object.freeze({ near: 360, medium: 150, far: 18 });
const FORM_ORDER = Object.freeze(["near", "medium", "far", "horizon"]);

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
    size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]],
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

function patchDitherMaterial(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float fidelityFade;\nvarying float vFidelityFade;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFidelityFade = fidelityFade;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vFidelityFade;\nfloat fidelityHash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}")
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (fidelityHash(gl_FragCoord.xy) > clamp(vFidelityFade, 0.0, 1.0)) discard;");
  };
  material.customProgramCacheKey = () => "prehistoric-tree-fidelity-dither-v1";
  return material;
}

function createGeometryFromPortable(THREE, portable, capacity) {
  if (!portable?.positions?.length || !portable?.indices?.length) throw new TypeError("Tree mesh form requires portable triangle geometry.");
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(portable.positions, 3));
  geometry.setIndex(portable.indices);
  for (const [name, attribute] of Object.entries(portable.attributes ?? {})) {
    geometry.setAttribute(name, new THREE.Float32BufferAttribute(attribute.values, attribute.itemSize));
  }
  if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
  geometry.setAttribute("fidelityFade", new THREE.InstancedBufferAttribute(new Float32Array(capacity).fill(1), 1));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createBillboardGeometry(THREE, capacity) {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  geometry.translate(0, 0.5, 0);
  geometry.setAttribute("fidelityFade", new THREE.InstancedBufferAttribute(new Float32Array(capacity).fill(1), 1));
  return geometry;
}

function createDecodedAtlasTexture(THREE, atlas) {
  if (atlas?.runtimeImage) {
    const texture = new THREE.Texture(atlas.runtimeImage);
    texture.needsUpdate = true;
    return texture;
  }
  return atlas?.assetId ? new THREE.TextureLoader().load(atlas.assetId) : null;
}

function createAtlasMaterials(THREE, form, fallbackColor) {
  const frames = form?.frames ?? [];
  const atlas = form?.atlas;
  const metadata = atlas?.metadata ?? {};
  const columns = Math.max(1, Number(metadata.columns ?? metadata.width / metadata.frameSize) || 1);
  const rows = Math.max(1, Number(metadata.rows ?? metadata.height / metadata.frameSize) || 1);
  const baseTexture = createDecodedAtlasTexture(THREE, atlas);
  if (baseTexture) {
    baseTexture.colorSpace = THREE.SRGBColorSpace;
    baseTexture.wrapS = THREE.ClampToEdgeWrapping;
    baseTexture.wrapT = THREE.ClampToEdgeWrapping;
    baseTexture.generateMipmaps = true;
  }
  const baseElevation = Number(frames[0]?.elevationDegrees ?? 0);
  const count = Math.max(1, frames.filter((frame) => Number(frame.elevationDegrees) === baseElevation).length || columns);
  return Array.from({ length: count }, (_, index) => {
    const texture = index === 0 ? baseTexture : baseTexture?.clone?.() ?? null;
    if (texture) {
      texture.repeat.set(1 / columns, 1 / rows);
      texture.offset.set((index % columns) / columns, Math.max(0, rows - 1) / rows);
      texture.needsUpdate = true;
    }
    return patchDitherMaterial(new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : fallbackColor,
      map: texture,
      transparent: false,
      alphaTest: 0.38,
      side: THREE.DoubleSide,
      depthWrite: true,
      fog: true
    }));
  });
}

function createMeshBatch(THREE, scene, packageValue, formId, capacity) {
  const form = packageValue?.forms?.[formId];
  const geometry = createGeometryFromPortable(THREE, form?.geometry, capacity);
  const material = patchDitherMaterial(new THREE.MeshStandardMaterial({
    vertexColors: Boolean(geometry.getAttribute("color")),
    roughness: packageValue?.material?.roughness ?? (formId === "near" ? 0.82 : 0.88),
    metalness: packageValue?.material?.metalness ?? 0
  }));
  const mesh = new THREE.InstancedMesh(geometry, material, capacity);
  mesh.name = `prehistoric-tree-fidelity-${packageValue.archetypeId}-${formId}`;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = formId === "near";
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  scene.add(mesh);
  return mesh;
}

function createBillboardBatches(THREE, scene, packageValue, formId, fallbackColor, capacity) {
  const form = packageValue?.forms?.[formId];
  const materials = createAtlasMaterials(THREE, form, fallbackColor);
  return materials.map((material, angleIndex) => {
    const mesh = new THREE.InstancedMesh(createBillboardGeometry(THREE, capacity), material, capacity);
    mesh.name = `prehistoric-tree-fidelity-${packageValue.archetypeId}-${formId}-${angleIndex}`;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  });
}

function createTypeLayer(THREE, scene, packageValue, typeIndex, capacity) {
  if (!packageValue?.forms?.near?.geometry || !packageValue?.forms?.medium?.geometry) {
    throw new TypeError(`Tree fidelity package ${packageValue?.archetypeId ?? typeIndex} is missing Object Shape mesh forms.`);
  }
  if (!packageValue?.forms?.far?.atlas?.runtimeImage || !packageValue?.forms?.horizon?.atlas?.runtimeImage) {
    throw new Error(`Tree fidelity package ${packageValue.archetypeId} entered rendering before atlas decoding completed.`);
  }
  const near = createMeshBatch(THREE, scene, packageValue, "near", capacity);
  const medium = createMeshBatch(THREE, scene, packageValue, "medium", capacity);
  const fallbackColor = packageValue?.material?.crown?.color ?? 0x397b3f;
  const far = createBillboardBatches(THREE, scene, packageValue, "far", fallbackColor, capacity);
  const horizon = createBillboardBatches(THREE, scene, packageValue, "horizon", fallbackColor, capacity);
  return {
    typeIndex,
    packageValue,
    near,
    medium,
    far,
    horizon,
    counts: { near: 0, medium: 0, far: 0, horizon: 0 }
  };
}

function disposeMesh(scene, mesh) {
  scene.remove(mesh);
  mesh.geometry?.dispose?.();
  const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
  for (const material of materials) {
    material.map?.dispose?.();
    material.dispose?.();
  }
}

function thresholdSet(packageValue) {
  return {
    near: Number(packageValue?.forms?.near?.minimumProjectedSize ?? DEFAULT_THRESHOLDS.near),
    medium: Number(packageValue?.forms?.medium?.minimumProjectedSize ?? DEFAULT_THRESHOLDS.medium),
    far: Number(packageValue?.forms?.far?.minimumProjectedSize ?? DEFAULT_THRESHOLDS.far)
  };
}

function rawForm(packageValue, pixels) {
  const thresholds = thresholdSet(packageValue);
  if (pixels >= thresholds.near) return "near";
  if (pixels >= thresholds.medium) return "medium";
  if (pixels >= thresholds.far) return "far";
  return "horizon";
}

function retainWithHysteresis(packageValue, pixels, previous) {
  if (!previous || !FORM_ORDER.includes(previous)) return rawForm(packageValue, pixels);
  const thresholds = thresholdSet(packageValue);
  const hysteresis = Math.max(0, Math.min(0.45, Number(packageValue?.change?.hysteresis ?? 0.12)));
  if (previous === "near" && pixels >= thresholds.near * (1 - hysteresis)) return previous;
  if (previous === "medium" && pixels >= thresholds.medium * (1 - hysteresis) && pixels < thresholds.near * (1 + hysteresis)) return previous;
  if (previous === "far" && pixels >= thresholds.far * (1 - hysteresis) && pixels < thresholds.medium * (1 + hysteresis)) return previous;
  if (previous === "horizon" && pixels < thresholds.far * (1 + hysteresis)) return previous;
  return rawForm(packageValue, pixels);
}

function sourceBounds(packageValue) {
  const bounds = packageValue?.source?.bounds ?? {};
  const min = bounds.min ?? [-(bounds.width ?? 1) * 0.5, 0, -(bounds.depth ?? bounds.width ?? 1) * 0.5];
  const size = bounds.size ?? [bounds.width ?? 1, bounds.height ?? 1, bounds.depth ?? bounds.width ?? 1];
  const center = bounds.center ?? [0, min[1] + size[1] * 0.5, 0];
  return { min, size, center };
}

function setFade(mesh, index, value) {
  const attribute = mesh.geometry.getAttribute("fidelityFade");
  attribute.setX(index, Math.max(0, Math.min(1, value)));
}

export function createThreeTreeFidelityLayer(THREE, options = {}) {
  const { scene, camera, renderer, treeTypes = [], packages = [], capacity = 256 } = options;
  if (!scene || !camera || !renderer) throw new TypeError("Tree fidelity layer requires scene, camera, and renderer.");
  if (packages.length !== treeTypes.length) throw new Error(`Tree fidelity package count ${packages.length} does not match archetype count ${treeTypes.length}.`);
  const patches = new Map();
  const selections = new Map();
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  const layers = treeTypes.map((_, typeIndex) => createTypeLayer(THREE, scene, packages[typeIndex], typeIndex, capacity));
  const suppressedLegacyMeshes = suppressLegacyTreeMeshes(scene, treeTypes.length);
  const generationIds = packages.map((entry) => entry.generation?.id).filter(Boolean);
  const view = {
    enabled: true,
    activePatches: 0,
    treeCount: 0,
    suppressedLegacyMeshes,
    counts: { near: 0, medium: 0, far: 0, horizon: 0 },
    transitioning: 0,
    packageCount: packages.length,
    generationIds,
    generationDigest: generationIds.join("|")
  };

  function activatePatch(patch) {
    patches.set(patch.id, patch);
    view.activePatches = patches.size;
  }

  function releasePatches(ids = []) {
    for (const id of ids) patches.delete(id);
    view.activePatches = patches.size;
  }

  function writeCombinedMatrix(mesh, index, bounds, packageValue) {
    const source = sourceBounds(packageValue);
    const sx = bounds.size[0] / Math.max(0.001, source.size[0]);
    const sy = bounds.size[1] / Math.max(0.001, source.size[1]);
    const sz = bounds.size[2] / Math.max(0.001, source.size[2]);
    position.set(
      bounds.center[0] - source.center[0] * sx,
      bounds.min[1] - source.min[1] * sy,
      bounds.center[2] - source.center[2] * sz
    );
    scale.set(sx, sy, sz);
    quaternion.identity();
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  }

  function writeBillboard(mesh, index, bounds) {
    const dx = camera.position.x - bounds.center[0];
    const dz = camera.position.z - bounds.center[2];
    euler.set(0, Math.atan2(dx, dz), 0);
    quaternion.setFromEuler(euler);
    position.set(bounds.center[0], bounds.min[1], bounds.center[2]);
    scale.set(bounds.width, bounds.height, 1);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  }

  function pushRecord(buckets, form, record, fade) {
    buckets[form].push({ record, fade });
  }

  function update(_state, deltaTime = 1 / 60) {
    const perType = layers.map(() => ({ near: [], medium: [], far: [], horizon: [] }));
    const seen = new Set();
    let transitioning = 0;

    for (const patch of patches.values()) {
      patch.trees.forEach((treeSet, typeIndex) => {
        const layer = layers[typeIndex];
        const count = Math.min(treeSet.trunks.length, treeSet.crowns.length);
        for (let index = 0; index < count; index += 1) {
          const trunk = treeSet.trunks[index];
          const crown = treeSet.crowns[index];
          const treeId = trunk.metadata?.treeId ?? crown.metadata?.treeId ?? trunk.id;
          seen.add(treeId);
          const bounds = combineBounds(trunk, crown);
          const distance = Math.max(0.001, camera.position.distanceTo(position.set(...bounds.center)));
          const pixels = projectedPixels(camera, renderer, bounds.height, distance);
          const prior = selections.get(treeId) ?? { form: rawForm(layer.packageValue, pixels), transition: null };
          const desired = retainWithHysteresis(layer.packageValue, pixels, prior.transition?.to ?? prior.form);
          if (!prior.transition && desired !== prior.form) {
            prior.transition = { from: prior.form, to: desired, elapsed: 0 };
          } else if (prior.transition && desired !== prior.transition.to) {
            const current = prior.transition.elapsed >= (layer.packageValue.change?.duration ?? 0.22) * 0.5
              ? prior.transition.to
              : prior.transition.from;
            prior.form = current;
            prior.transition = current === desired ? null : { from: current, to: desired, elapsed: 0 };
          }

          const record = { trunk, crown, bounds, pixels, treeId };
          if (prior.transition) {
            const duration = Math.max(0.001, Number(layer.packageValue.change?.duration ?? 0.22));
            prior.transition.elapsed += Math.max(0, Number(deltaTime) || 0);
            const progress = Math.min(1, prior.transition.elapsed / duration);
            pushRecord(perType[typeIndex], prior.transition.from, record, 1 - progress);
            pushRecord(perType[typeIndex], prior.transition.to, record, progress);
            transitioning += 1;
            if (progress >= 1) {
              prior.form = prior.transition.to;
              prior.transition = null;
            }
          } else {
            prior.form = desired;
            pushRecord(perType[typeIndex], prior.form, record, 1);
          }
          selections.set(treeId, prior);
        }
      });
    }

    for (const treeId of selections.keys()) if (!seen.has(treeId)) selections.delete(treeId);
    view.counts = { near: 0, medium: 0, far: 0, horizon: 0 };
    view.treeCount = seen.size;
    view.transitioning = transitioning;

    perType.forEach((selection, typeIndex) => {
      const layer = layers[typeIndex];
      for (const formId of ["near", "medium"]) {
        const mesh = layer[formId];
        const records = selection[formId];
        const count = Math.min(capacity, records.length);
        for (let index = 0; index < count; index += 1) {
          writeCombinedMatrix(mesh, index, records[index].record.bounds, layer.packageValue);
          setFade(mesh, index, records[index].fade);
        }
        mesh.count = count;
        mesh.instanceMatrix.needsUpdate = true;
        mesh.geometry.getAttribute("fidelityFade").needsUpdate = true;
        layer.counts[formId] = count;
        view.counts[formId] += count;
      }

      for (const formId of ["far", "horizon"]) {
        const meshes = layer[formId];
        const angleSelections = meshes.map(() => []);
        for (const entry of selection[formId]) {
          const record = entry.record;
          const dx = camera.position.x - record.bounds.center[0];
          const dz = camera.position.z - record.bounds.center[2];
          const angle = (Math.atan2(dx, dz) + Math.PI * 2) % (Math.PI * 2);
          const angleIndex = meshes.length === 1 ? 0 : Math.round(angle / (Math.PI * 2) * meshes.length) % meshes.length;
          angleSelections[angleIndex].push(entry);
        }
        let formCount = 0;
        angleSelections.forEach((records, angleIndex) => {
          const mesh = meshes[angleIndex];
          const count = Math.min(capacity, records.length);
          for (let index = 0; index < count; index += 1) {
            writeBillboard(mesh, index, records[index].record.bounds);
            setFade(mesh, index, records[index].fade);
          }
          mesh.count = count;
          mesh.instanceMatrix.needsUpdate = true;
          mesh.geometry.getAttribute("fidelityFade").needsUpdate = true;
          formCount += count;
        });
        layer.counts[formId] = formCount;
        view.counts[formId] += formCount;
      }
    });
    return view;
  }

  function dispose() {
    patches.clear();
    selections.clear();
    for (const layer of layers) {
      disposeMesh(scene, layer.near);
      disposeMesh(scene, layer.medium);
      for (const mesh of layer.far) disposeMesh(scene, mesh);
      for (const mesh of layer.horizon) disposeMesh(scene, mesh);
    }
  }

  return Object.freeze({ view, activatePatch, releasePatches, update, dispose });
}

export default createThreeTreeFidelityLayer;
