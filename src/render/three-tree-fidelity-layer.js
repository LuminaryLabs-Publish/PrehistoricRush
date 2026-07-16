const DEFAULT_THRESHOLDS = Object.freeze({ near: 360, medium: 150, far: 18 });
const FORM_ORDER = Object.freeze(["near", "medium", "far", "horizon"]);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

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

function normalizedDegrees(value) {
  return ((Number(value) % 360) + 360) % 360;
}

export function circularDegreesDistance(left, right) {
  const delta = Math.abs(normalizedDegrees(left) - normalizedDegrees(right));
  return Math.min(delta, 360 - delta);
}

function viewAngles(cameraPosition = {}, bounds = {}, yawDegrees = 0) {
  const center = bounds.center ?? [0, 0, 0];
  const dx = Number(cameraPosition.x ?? 0) - Number(center[0] ?? 0);
  const dy = Number(cameraPosition.y ?? 0) - Number(center[1] ?? 0);
  const dz = Number(cameraPosition.z ?? 0) - Number(center[2] ?? 0);
  const horizontal = Math.max(0.000001, Math.hypot(dx, dz));
  return {
    azimuthDegrees: normalizedDegrees(Math.atan2(dx, dz) * 180 / Math.PI - Number(yawDegrees || 0)),
    elevationDegrees: Math.atan2(dy, horizontal) * 180 / Math.PI
  };
}

export function resolveTreeImpostorBlend(frames = [], cameraPosition = {}, bounds = {}, yawDegrees = 0) {
  if (!frames.length) return [];
  const view = viewAngles(cameraPosition, bounds, yawDegrees);
  const elevations = Array.from(new Set(frames.map((frame) => Number(frame.elevationDegrees ?? 0))));
  elevations.sort((left, right) => Math.abs(left - view.elevationDegrees) - Math.abs(right - view.elevationDegrees) || left - right);
  const selectedElevation = elevations[0] ?? 0;
  const row = frames
    .map((frame, arrayIndex) => ({
      frame,
      arrayIndex,
      azimuth: normalizedDegrees(frame.azimuthDegrees ?? 0)
    }))
    .filter((entry) => Number(entry.frame.elevationDegrees ?? 0) === selectedElevation)
    .sort((left, right) => left.azimuth - right.azimuth || left.arrayIndex - right.arrayIndex);
  if (!row.length) return [];
  if (row.length === 1) {
    const entry = row[0];
    return [{
      arrayIndex: entry.arrayIndex,
      frame: entry.frame,
      frameIndex: Number(entry.frame.frameIndex ?? entry.arrayIndex),
      atlasCell: entry.frame.atlasCell ?? [entry.arrayIndex, 0],
      weight: 1,
      frameAzimuthDegrees: entry.azimuth,
      frameElevationDegrees: selectedElevation,
      viewAzimuthDegrees: view.azimuthDegrees,
      viewElevationDegrees: view.elevationDegrees
    }];
  }

  let angle = view.azimuthDegrees;
  if (angle < row[0].azimuth) angle += 360;
  for (let index = 0; index < row.length; index += 1) {
    const left = row[index];
    const right = row[(index + 1) % row.length];
    const leftAngle = left.azimuth;
    const rightAngle = index === row.length - 1 ? right.azimuth + 360 : right.azimuth;
    if (angle < leftAngle || angle > rightAngle) continue;
    const span = Math.max(0.000001, rightAngle - leftAngle);
    const amount = clamp((angle - leftAngle) / span, 0, 1);
    const makeBinding = (entry, weight) => ({
      arrayIndex: entry.arrayIndex,
      frame: entry.frame,
      frameIndex: Number(entry.frame.frameIndex ?? entry.arrayIndex),
      atlasCell: entry.frame.atlasCell ?? [entry.arrayIndex, 0],
      weight,
      frameAzimuthDegrees: entry.azimuth,
      frameElevationDegrees: Number(entry.frame.elevationDegrees ?? 0),
      viewAzimuthDegrees: view.azimuthDegrees,
      viewElevationDegrees: view.elevationDegrees
    });
    if (amount <= 0.001) return [makeBinding(left, 1)];
    if (amount >= 0.999) return [makeBinding(right, 1)];
    return [makeBinding(left, 1 - amount), makeBinding(right, amount)];
  }

  const nearest = row.sort((left, right) => circularDegreesDistance(left.azimuth, view.azimuthDegrees) - circularDegreesDistance(right.azimuth, view.azimuthDegrees))[0];
  return [{
    arrayIndex: nearest.arrayIndex,
    frame: nearest.frame,
    frameIndex: Number(nearest.frame.frameIndex ?? nearest.arrayIndex),
    atlasCell: nearest.frame.atlasCell ?? [nearest.arrayIndex, 0],
    weight: 1,
    frameAzimuthDegrees: nearest.azimuth,
    frameElevationDegrees: Number(nearest.frame.elevationDegrees ?? 0),
    viewAzimuthDegrees: view.azimuthDegrees,
    viewElevationDegrees: view.elevationDegrees
  }];
}

export function resolveTreeImpostorFrame(frames = [], cameraPosition = {}, bounds = {}, yawDegrees = 0) {
  return resolveTreeImpostorBlend(frames, cameraPosition, bounds, yawDegrees)
    .slice()
    .sort((left, right) => right.weight - left.weight || left.arrayIndex - right.arrayIndex)[0] ?? null;
}

function hashFrameBindings(bindings) {
  let hash = 2166136261;
  const text = bindings
    .map((entry) => `${entry.treeId}:${entry.formId}:${entry.frameIndex}:${entry.atlasCell.join(",")}:${entry.weight.toFixed(4)}`)
    .join("|");
  for (const character of text) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return (hash >>> 0).toString(16).padStart(8, "0");
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

function addInstanceAttributes(THREE, geometry, capacity, withFrames = false) {
  geometry.setAttribute("fidelityFade", new THREE.InstancedBufferAttribute(new Float32Array(capacity).fill(1), 1));
  geometry.setAttribute("instanceTint", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3).fill(1), 3));
  if (withFrames) geometry.setAttribute("frameRect", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 4), 4));
  return geometry;
}

function patchMeshMaterial(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute float fidelityFade;\nattribute vec3 instanceTint;\nvarying float vFidelityFade;\nvarying vec3 vInstanceTint;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvFidelityFade = fidelityFade;\nvInstanceTint = instanceTint;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vFidelityFade;\nvarying vec3 vInstanceTint;\nfloat fidelityHash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}")
      .replace("vec4 diffuseColor = vec4( diffuse, opacity );", "vec4 diffuseColor = vec4( diffuse * vInstanceTint, opacity );")
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (fidelityHash(gl_FragCoord.xy) > clamp(vFidelityFade, 0.0, 1.0)) discard;");
  };
  material.customProgramCacheKey = () => "prehistoric-tree-mesh-fidelity-v2";
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
  addInstanceAttributes(THREE, geometry, capacity, false);
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

function createBillboardGeometry(THREE, capacity) {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  geometry.translate(0, 0.5, 0);
  addInstanceAttributes(THREE, geometry, capacity, true);
  return geometry;
}

function validImageDimensions(image) {
  return {
    width: Number(image?.width ?? image?.naturalWidth ?? 0),
    height: Number(image?.height ?? image?.naturalHeight ?? 0)
  };
}

function createAtlasTexture(THREE, atlas) {
  const image = atlas?.runtimeImage;
  const dimensions = validImageDimensions(image);
  if (!image || dimensions.width < 1 || dimensions.height < 1) {
    throw new Error("Tree impostor atlas entered rendering without valid decoded image data.");
  }
  const texture = new THREE.Texture(image);
  texture.name = `tree-atlas:${atlas.assetId ?? "runtime"}`;
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function createBillboardMaterial(THREE, scene, atlasTexture, options = {}) {
  const fog = scene.fog;
  const fogColor = fog?.color ?? new THREE.Color(0x163224);
  const fogDensity = Number(fog?.density ?? 0.0085);
  return new THREE.ShaderMaterial({
    name: `tree-impostor:${options.formId}`,
    uniforms: {
      atlasMap: { value: atlasTexture },
      fogColor: { value: fogColor.clone() },
      fogDensity: { value: fogDensity },
      saturation: { value: options.formId === "horizon" ? 0.76 : 0.88 },
      ambientLift: { value: options.formId === "horizon" ? 1.18 : 1.1 },
      topLight: { value: options.formId === "horizon" ? 0.05 : 0.09 }
    },
    vertexShader: `
      attribute vec4 frameRect;
      attribute float fidelityFade;
      attribute vec3 instanceTint;
      varying vec2 vAtlasUv;
      varying float vFidelityFade;
      varying vec3 vInstanceTint;
      varying float vViewDistance;
      varying float vLocalHeight;
      void main() {
        vec2 topLeftUv = vec2(uv.x, 1.0 - uv.y);
        vAtlasUv = frameRect.xy + topLeftUv * frameRect.zw;
        vFidelityFade = fidelityFade;
        vInstanceTint = instanceTint;
        vLocalHeight = uv.y;
        vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vViewDistance = distance(cameraPosition, worldPosition.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D atlasMap;
      uniform vec3 fogColor;
      uniform float fogDensity;
      uniform float saturation;
      uniform float ambientLift;
      uniform float topLight;
      varying vec2 vAtlasUv;
      varying float vFidelityFade;
      varying vec3 vInstanceTint;
      varying float vViewDistance;
      varying float vLocalHeight;
      float fidelityHash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main() {
        vec4 sampleColor = texture2D(atlasMap, vAtlasUv);
        if (sampleColor.a < 0.38) discard;
        if (fidelityHash(gl_FragCoord.xy) > clamp(vFidelityFade, 0.0, 1.0)) discard;
        vec3 color = sampleColor.rgb * vInstanceTint;
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        color = mix(vec3(luminance), color, saturation);
        color *= ambientLift + vLocalHeight * topLight;
        float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vViewDistance * vViewDistance);
        color = mix(color, fogColor, clamp(fogFactor, 0.0, 0.96));
        gl_FragColor = vec4(color, sampleColor.a);
      }
    `,
    transparent: false,
    alphaTest: 0.38,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
    fog: false
  });
}

function createMeshBatch(THREE, scene, packageValue, formId, capacity) {
  const form = packageValue?.forms?.[formId];
  const geometry = createGeometryFromPortable(THREE, form?.geometry, capacity);
  const material = patchMeshMaterial(new THREE.MeshStandardMaterial({
    vertexColors: Boolean(geometry.getAttribute("color")),
    roughness: packageValue?.material?.roughness ?? (formId === "near" ? 0.82 : 0.88),
    metalness: 0
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

function createBillboardBatch(THREE, scene, packageValue, formId, atlasTexture, capacity) {
  const geometry = createBillboardGeometry(THREE, capacity);
  const material = createBillboardMaterial(THREE, scene, atlasTexture, { formId });
  const mesh = new THREE.InstancedMesh(geometry, material, capacity);
  mesh.name = `prehistoric-tree-fidelity-${packageValue.archetypeId}-${formId}`;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.frustumCulled = false;
  scene.add(mesh);
  return mesh;
}

function createTypeLayer(THREE, scene, packageValue, typeIndex, capacity) {
  if (!packageValue?.forms?.near?.geometry || !packageValue?.forms?.medium?.geometry) {
    throw new TypeError(`Tree fidelity package ${packageValue?.archetypeId ?? typeIndex} is missing Object Shape mesh forms.`);
  }
  const farAtlas = packageValue?.forms?.far?.atlas;
  const horizonAtlas = packageValue?.forms?.horizon?.atlas;
  if (!farAtlas?.runtimeImage || !horizonAtlas?.runtimeImage) {
    throw new Error(`Tree fidelity package ${packageValue.archetypeId} entered rendering before atlas decoding completed.`);
  }
  if (String(farAtlas.assetId) !== String(horizonAtlas.assetId)) {
    throw new Error(`Tree fidelity package ${packageValue.archetypeId} must share one atlas across far and horizon forms.`);
  }
  const billboardCapacity = capacity * 4;
  const atlasTexture = createAtlasTexture(THREE, farAtlas);
  return {
    typeIndex,
    packageValue,
    atlasTexture,
    near: createMeshBatch(THREE, scene, packageValue, "near", capacity),
    medium: createMeshBatch(THREE, scene, packageValue, "medium", capacity),
    far: createBillboardBatch(THREE, scene, packageValue, "far", atlasTexture, billboardCapacity),
    horizon: createBillboardBatch(THREE, scene, packageValue, "horizon", atlasTexture, billboardCapacity),
    capacities: { near: capacity, medium: capacity, far: billboardCapacity, horizon: billboardCapacity },
    counts: { near: 0, medium: 0, far: 0, horizon: 0 }
  };
}

function disposeMesh(scene, mesh) {
  scene.remove(mesh);
  mesh.geometry?.dispose?.();
  mesh.material?.dispose?.();
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
  const hysteresis = clamp(Number(packageValue?.change?.hysteresis ?? 0.16), 0, 0.45);
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

function variationFor(record) {
  return record.trunk.metadata?.variation ?? record.crown.metadata?.variation ?? {};
}

function tintFor(record) {
  const tint = variationFor(record).tint;
  return Array.isArray(tint) && tint.length === 3 ? tint : [1, 1, 1];
}

function setScalarAttribute(mesh, name, index, value) {
  mesh.geometry.getAttribute(name).setX(index, value);
}

function setVector3Attribute(mesh, name, index, value) {
  mesh.geometry.getAttribute(name).setXYZ(index, value[0], value[1], value[2]);
}

function setVector4Attribute(mesh, name, index, value) {
  mesh.geometry.getAttribute(name).setXYZW(index, value[0], value[1], value[2], value[3]);
}

function markAttributes(mesh, names) {
  for (const name of names) mesh.geometry.getAttribute(name).needsUpdate = true;
}

function fallbackFrameRect(form, frame) {
  const metadata = form.atlas?.metadata ?? {};
  const columns = Math.max(1, Number(metadata.columns) || 1);
  const rows = Math.max(1, Number(metadata.rows) || 1);
  const cell = frame.atlasCell ?? [Number(frame.frameIndex ?? 0) % columns, Math.floor(Number(frame.frameIndex ?? 0) / columns)];
  return [cell[0] / columns, cell[1] / rows, 1 / columns, 1 / rows];
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
  const generationDigest = generationIds.join("|");
  const view = {
    enabled: true,
    activePatches: 0,
    treeCount: 0,
    suppressedLegacyMeshes,
    counts: { near: 0, medium: 0, far: 0, horizon: 0 },
    transitioning: 0,
    packageCount: packages.length,
    textureCount: layers.length,
    generationIds,
    generationDigest,
    frameSelectionRevision: 0,
    frameBindingCount: 0,
    frameBindingDigest: "00000000",
    exactFrameAck: null,
    frameBindingSample: []
  };

  function activatePatch(patch) {
    patches.set(patch.id, patch);
    view.activePatches = patches.size;
  }

  function releasePatches(ids = []) {
    for (const id of ids) patches.delete(id);
    view.activePatches = patches.size;
  }

  function writeCombinedMatrix(mesh, index, bounds, packageValue, record) {
    const source = sourceBounds(packageValue);
    const variation = variationFor(record);
    const ground = variation.groundPosition ?? [bounds.center[0], bounds.min[1], bounds.center[2]];
    const sx = bounds.size[0] / Math.max(0.001, source.size[0]);
    const sy = bounds.size[1] / Math.max(0.001, source.size[1]);
    const sz = bounds.size[2] / Math.max(0.001, source.size[2]);
    position.set(ground[0], ground[1], ground[2]);
    euler.set(
      Number(variation.leanXRadians ?? 0),
      Number(variation.yawRadians ?? 0),
      Number(variation.leanZRadians ?? 0),
      "YXZ"
    );
    quaternion.setFromEuler(euler);
    scale.set(sx, sy, sz);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  }

  function writeBillboard(mesh, index, bounds, record, frame) {
    const variation = variationFor(record);
    const ground = variation.groundPosition ?? [bounds.center[0], bounds.min[1], bounds.center[2]];
    const aspect = clamp(Number(frame.opaqueAspect ?? bounds.width / Math.max(0.001, bounds.height)), 0.08, 3.5);
    const height = Math.max(0.1, bounds.height);
    const width = clamp(height * aspect, bounds.width * 0.56, bounds.width * 1.26);
    const dx = camera.position.x - ground[0];
    const dz = camera.position.z - ground[2];
    euler.set(0, Math.atan2(dx, dz), Number(variation.leanZRadians ?? 0) * 0.32, "YXZ");
    quaternion.setFromEuler(euler);
    position.set(ground[0], ground[1], ground[2]);
    scale.set(width, height, 1);
    matrix.compose(position, quaternion, scale);
    mesh.setMatrixAt(index, matrix);
  }

  function pushRecord(buckets, form, record, fade) {
    buckets[form].push({ record, fade });
  }

  function update(_state, deltaTime = 1 / 60) {
    const perType = layers.map(() => ({ near: [], medium: [], far: [], horizon: [] }));
    const seen = new Set();
    const frameBindings = [];
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
          const prior = selections.get(treeId) ?? {
            form: rawForm(layer.packageValue, pixels),
            transition: null,
            candidate: null,
            candidateFrames: 0
          };
          const desired = retainWithHysteresis(layer.packageValue, pixels, prior.transition?.to ?? prior.form);
          const stableFrames = Math.max(1, Number(layer.packageValue?.change?.stableSelectionFrames ?? 2));

          if (!prior.transition && desired !== prior.form) {
            if (prior.candidate === desired) prior.candidateFrames += 1;
            else {
              prior.candidate = desired;
              prior.candidateFrames = 1;
            }
            if (prior.candidateFrames >= stableFrames) {
              prior.transition = { from: prior.form, to: desired, elapsed: 0 };
              prior.candidate = null;
              prior.candidateFrames = 0;
            }
          } else if (!prior.transition) {
            prior.candidate = null;
            prior.candidateFrames = 0;
          } else if (desired !== prior.transition.to) {
            const current = prior.transition.elapsed >= (layer.packageValue.change?.duration ?? 0.35) * 0.5
              ? prior.transition.to
              : prior.transition.from;
            prior.form = current;
            prior.transition = current === desired ? null : { from: current, to: desired, elapsed: 0 };
          }

          const record = { trunk, crown, bounds, pixels, treeId };
          if (prior.transition) {
            const duration = Math.max(0.001, Number(layer.packageValue.change?.duration ?? 0.35));
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
        const count = Math.min(layer.capacities[formId], records.length);
        for (let index = 0; index < count; index += 1) {
          const entry = records[index];
          writeCombinedMatrix(mesh, index, entry.record.bounds, layer.packageValue, entry.record);
          setScalarAttribute(mesh, "fidelityFade", index, entry.fade);
          setVector3Attribute(mesh, "instanceTint", index, tintFor(entry.record));
        }
        mesh.count = count;
        mesh.instanceMatrix.needsUpdate = true;
        markAttributes(mesh, ["fidelityFade", "instanceTint"]);
        layer.counts[formId] = count;
        view.counts[formId] += count;
      }

      for (const formId of ["far", "horizon"]) {
        const mesh = layer[formId];
        const form = layer.packageValue.forms[formId];
        const rendered = [];
        for (const entry of selection[formId]) {
          const yawDegrees = Number(variationFor(entry.record).yawDegrees ?? 0);
          const bindings = resolveTreeImpostorBlend(form.frames, camera.position, entry.record.bounds, yawDegrees);
          for (const binding of bindings) {
            const fade = entry.fade * binding.weight;
            if (fade <= 0.005) continue;
            rendered.push({ entry, binding, fade });
          }
        }
        const count = Math.min(layer.capacities[formId], rendered.length);
        for (let index = 0; index < count; index += 1) {
          const { entry, binding, fade } = rendered[index];
          const frame = binding.frame;
          writeBillboard(mesh, index, entry.record.bounds, entry.record, frame);
          setScalarAttribute(mesh, "fidelityFade", index, fade);
          setVector3Attribute(mesh, "instanceTint", index, tintFor(entry.record));
          setVector4Attribute(mesh, "frameRect", index, frame.uvRect ?? fallbackFrameRect(form, frame));
          frameBindings.push({
            treeId: entry.record.treeId,
            formId,
            frameIndex: binding.frameIndex,
            atlasCell: binding.atlasCell,
            weight: binding.weight,
            frameAzimuthDegrees: binding.frameAzimuthDegrees,
            frameElevationDegrees: binding.frameElevationDegrees
          });
        }
        mesh.count = count;
        mesh.instanceMatrix.needsUpdate = true;
        markAttributes(mesh, ["fidelityFade", "instanceTint", "frameRect"]);
        layer.counts[formId] = count;
        view.counts[formId] += count;
      }
    });

    frameBindings.sort((left, right) => left.treeId.localeCompare(right.treeId) || left.formId.localeCompare(right.formId) || left.frameIndex - right.frameIndex);
    view.frameSelectionRevision += 1;
    view.frameBindingCount = frameBindings.length;
    view.frameBindingDigest = hashFrameBindings(frameBindings);
    view.frameBindingSample = frameBindings.slice(0, 32);
    view.exactFrameAck = Object.freeze({
      generationDigest,
      revision: view.frameSelectionRevision,
      bindingCount: view.frameBindingCount,
      bindingDigest: view.frameBindingDigest,
      textureCount: view.textureCount
    });
    return view;
  }

  function dispose() {
    patches.clear();
    selections.clear();
    for (const layer of layers) {
      disposeMesh(scene, layer.near);
      disposeMesh(scene, layer.medium);
      disposeMesh(scene, layer.far);
      disposeMesh(scene, layer.horizon);
      layer.atlasTexture.dispose();
    }
  }

  return Object.freeze({ view, activatePatch, releasePatches, update, dispose });
}

export default createThreeTreeFidelityLayer;
