const DEFAULT_THRESHOLDS = Object.freeze({ near: 300, medium: 84, far: 12 });
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
    .map((frame, arrayIndex) => ({ frame, arrayIndex, azimuth: normalizedDegrees(frame.azimuthDegrees ?? 0) }))
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
    const amount = clamp((angle - leftAngle) / Math.max(0.000001, rightAngle - leftAngle), 0, 1);
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

  const nearest = row.slice().sort((left, right) => circularDegreesDistance(left.azimuth, view.azimuthDegrees) - circularDegreesDistance(right.azimuth, view.azimuthDegrees))[0];
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

function patchMeshMaterial(material, formId) {
  const uniforms = {
    treeTime: { value: 0 },
    treeWindStrength: { value: formId === "near" ? 1 : 0.72 }
  };
  material.userData.treeFidelityUniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute float fidelityFade;\nattribute vec3 instanceTint;\nuniform float treeTime;\nuniform float treeWindStrength;\nvarying float vFidelityFade;\nvarying vec3 vInstanceTint;\nvarying vec3 vTreeLocalPosition;\nvarying vec3 vTreeLocalNormal;\nvarying float vTreeBaseAO;"
      )
      .replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);
vFidelityFade = fidelityFade;
vInstanceTint = instanceTint;
vTreeLocalPosition = position;
vTreeLocalNormal = normalize(objectNormal);
vTreeBaseAO = mix(0.58, 1.0, smoothstep(0.0, 3.6, position.y));
float treeHeightWeight = smoothstep(0.4, 15.0, max(0.0, position.y));
float treePhase = instanceMatrix[3].x * 0.019 + instanceMatrix[3].z * 0.023;
float trunkSway = sin(treeTime * 0.31 + treePhase) * 0.055 * treeWindStrength * treeHeightWeight;
float branchFlutter = sin(treeTime * 1.47 + dot(position, vec3(0.37, 0.19, 0.29)) + treePhase) * 0.018 * treeWindStrength * treeHeightWeight;
transformed.x += trunkSway + branchFlutter;
transformed.z += trunkSway * 0.34 - branchFlutter * 0.58;`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying float vFidelityFade;
varying vec3 vInstanceTint;
varying vec3 vTreeLocalPosition;
varying vec3 vTreeLocalNormal;
varying float vTreeBaseAO;
float fidelityHash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float treeNoise(vec3 p){return fract(sin(dot(floor(p),vec3(127.1,311.7,74.7)))*43758.5453);}
float treeTriplanar(vec3 p, vec3 n) {
  vec3 weights = pow(abs(n), vec3(4.0)); weights /= max(0.001, weights.x + weights.y + weights.z);
  float xy = treeNoise(vec3(p.xy, 1.7));
  float yz = treeNoise(vec3(p.yz, 3.1));
  float xz = treeNoise(vec3(p.xz, 5.3));
  return xy * weights.z + yz * weights.x + xz * weights.y;
}`
      )
      .replace("vec4 diffuseColor = vec4( diffuse, opacity );", "vec4 diffuseColor = vec4( diffuse * vInstanceTint, opacity );")
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
float foliageMask = smoothstep(0.015, 0.11, diffuseColor.g - max(diffuseColor.r, diffuseColor.b));
float barkGrain = treeTriplanar(vTreeLocalPosition * vec3(2.8, 0.42, 2.8), normalize(vTreeLocalNormal));
float barkRidges = sin(vTreeLocalPosition.y * 8.5 + barkGrain * 7.0) * 0.5 + 0.5;
vec3 barkTint = diffuseColor.rgb * mix(0.68, 1.18, barkGrain * 0.58 + barkRidges * 0.42);
float moss = smoothstep(0.56, 0.82, treeTriplanar(vTreeLocalPosition * 0.31 + 4.7, normalize(vTreeLocalNormal))) * (1.0 - smoothstep(1.5, 9.0, vTreeLocalPosition.y));
barkTint = mix(barkTint, barkTint * vec3(0.48, 0.88, 0.46), moss * 0.62);
vec3 leafTint = diffuseColor.rgb * mix(0.76, 1.18, treeTriplanar(vTreeLocalPosition * 0.62, normalize(vTreeLocalNormal)));
diffuseColor.rgb = mix(barkTint, leafTint, foliageMask) * mix(vTreeBaseAO, 1.0, foliageMask * 0.45);`
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
float barkSurface = treeTriplanar(vTreeLocalPosition * vec3(3.4, 0.58, 3.4), normalize(vTreeLocalNormal));
vec3 barkGradient = vec3(dFdx(barkSurface), dFdy(barkSurface), 0.0);
normal = normalize(normal + barkGradient * (1.0 - foliageMask) * 0.22);`
      )
      .replace(
        "float roughnessFactor = roughness;",
        "float roughnessFactor = clamp(roughness + (barkGrain - 0.5) * (1.0 - foliageMask) * 0.22, 0.55, 1.0);"
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
vec3 leafTransmission = diffuseColor.rgb * vec3(1.08, 1.2, 0.72) * foliageMask * 0.12;
totalEmissiveRadiance += leafTransmission;`
      )
      .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\nif (fidelityHash(gl_FragCoord.xy) > clamp(vFidelityFade, 0.0, 1.0)) discard;");
  };
  material.customProgramCacheKey = () => `prehistoric-natural-tree-triplanar-fidelity-v6-${formId}`;
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
  if (!image || dimensions.width < 1 || dimensions.height < 1) throw new Error("Tree impostor atlas entered rendering without valid decoded image data.");
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
      saturation: { value: options.formId === "horizon" ? 0.78 : 0.9 },
      ambientLift: { value: options.formId === "horizon" ? 1.16 : 1.08 },
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
  const material = patchMeshMaterial(new THREE.MeshPhysicalMaterial({
    color: packageValue?.material?.foliageColor ?? 0x4f7138,
    vertexColors: Boolean(geometry.getAttribute("color")),
    roughness: packageValue?.material?.roughness ?? (formId === "near" ? 0.82 : 0.88),
    metalness: 0,
    clearcoat: 0.025,
    clearcoatRoughness: 0.9
  }), formId);
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
  if (!packageValue?.forms?.near?.geometry || !packageValue?.forms?.medium?.geometry) throw new TypeError(`Tree fidelity package ${packageValue?.archetypeId ?? typeIndex} is missing Object Shape mesh forms.`);
  if (!packageValue?.growth?.digest) throw new TypeError(`Tree fidelity package ${packageValue?.archetypeId ?? typeIndex} is missing its admitted growth digest.`);
  const farAtlas = packageValue?.forms?.far?.atlas;
  const horizonAtlas = packageValue?.forms?.horizon?.atlas;
  if (!farAtlas?.runtimeImage || !horizonAtlas?.runtimeImage) throw new Error(`Tree fidelity package ${packageValue.archetypeId} entered rendering before atlas decoding completed.`);
  if (String(farAtlas.assetId) !== String(horizonAtlas.assetId)) throw new Error(`Tree fidelity package ${packageValue.archetypeId} must share one atlas across far and horizon forms.`);
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

function createProxyPackage(treeType, typeIndex) {
  const archetypeId = String(treeType?.id ?? treeType?.[6]?.id ?? `tree-${typeIndex}`);
  const positions = [
    -0.18, 0, -0.18, 0.18, 0, -0.18, 0.18, 5.2, -0.18, -0.18, 5.2, -0.18,
    -0.18, 0, 0.18, 0.18, 0, 0.18, 0.18, 5.2, 0.18, -0.18, 5.2, 0.18,
    0, 4.1, 0, -1.45, 5.3, -1.45, 1.45, 5.3, -1.45,
    0, 4.1, 0, 1.45, 5.3, -1.45, 1.45, 5.3, 1.45,
    0, 4.1, 0, 1.45, 5.3, 1.45, -1.45, 5.3, 1.45,
    0, 4.1, 0, -1.45, 5.3, 1.45, -1.45, 5.3, -1.45,
    0, 7.8, 0, -1.45, 5.3, -1.45, 1.45, 5.3, -1.45,
    0, 7.8, 0, 1.45, 5.3, -1.45, 1.45, 5.3, 1.45,
    0, 7.8, 0, 1.45, 5.3, 1.45, -1.45, 5.3, 1.45,
    0, 7.8, 0, -1.45, 5.3, 1.45, -1.45, 5.3, -1.45
  ];
  const indices = Array.from({ length: positions.length / 3 }, (_, index) => index);
  const geometry = { positions, indices, attributes: {} };
  return Object.freeze({
    schema: "prehistoric-rush.generic-tree-proxy/1",
    archetypeId,
    proxy: true,
    generation: { id: `generic-tree-proxy:${archetypeId}` },
    growth: { digest: "generic-tree-proxy-v1" },
    source: { bounds: { min: [-1.45, 0, -1.45], max: [1.45, 7.8, 1.45], size: [2.9, 7.8, 2.9], center: [0, 3.9, 0], width: 2.9, height: 7.8, depth: 2.9 } },
    forms: {
      near: { kind: "mesh", minimumProjectedSize: 0, geometry },
      medium: { kind: "mesh", minimumProjectedSize: -1, geometry },
      far: { kind: "mesh", minimumProjectedSize: -2, geometry, frames: [] },
      horizon: { kind: "mesh", minimumProjectedSize: -3, geometry, frames: [] }
    },
    change: { duration: 0, hysteresis: 0, stableSelectionFrames: 1 },
    material: { foliageColor: treeType?.foliageColor ?? treeType?.[5] ?? "#4f7138", roughness: 0.9 }
  });
}

function createProxyTypeLayer(THREE, scene, treeType, typeIndex, capacity) {
  const packageValue = createProxyPackage(treeType, typeIndex);
  const near = createMeshBatch(THREE, scene, packageValue, "near", capacity);
  const medium = createMeshBatch(THREE, scene, packageValue, "medium", capacity);
  const far = createMeshBatch(THREE, scene, packageValue, "far", capacity);
  const horizon = createMeshBatch(THREE, scene, packageValue, "horizon", capacity);
  medium.visible = false;
  far.visible = false;
  horizon.visible = false;
  return {
    typeIndex,
    packageValue,
    proxy: true,
    atlasTexture: null,
    near,
    medium,
    far,
    horizon,
    capacities: { near: capacity, medium: capacity, far: capacity, horizon: capacity },
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
  const hysteresis = clamp(Number(packageValue?.change?.hysteresis ?? 0.14), 0, 0.45);
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
  return { min, size };
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
  const patches = new Map();
  const selections = new Map();
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  const packageByArchetype = new Map(packages.filter(Boolean).map((entry) => [entry.archetypeId, entry]));
  const layers = treeTypes.map((treeType, typeIndex) => {
    const archetypeId = String(treeType?.id ?? treeType?.[6]?.id ?? "");
    const packageValue = packages[typeIndex] ?? packageByArchetype.get(archetypeId) ?? null;
    return packageValue
      ? createTypeLayer(THREE, scene, packageValue, typeIndex, capacity)
      : createProxyTypeLayer(THREE, scene, treeType, typeIndex, capacity);
  });
  const upgradeQueue = new Map();
  const suppressedLegacyMeshes = suppressLegacyTreeMeshes(scene, treeTypes.length);
  let generationDigest = "";
  let growthDigest = "";
  let elapsed = 0;
  let presentationRecords = [];
  const view = {
    enabled: true,
    activePatches: 0,
    treeCount: 0,
    suppressedLegacyMeshes,
    counts: { near: 0, medium: 0, far: 0, horizon: 0 },
    transitioning: 0,
    packageCount: 0,
    proxyPackageCount: layers.length,
    pendingPackageUpgrades: 0,
    textureCount: 0,
    generationIds: [],
    generationDigest: "",
    growthDigests: [],
    growthDigest: "",
    presentationAuthority: "object-fidelity-natural-growth",
    presentationCount: 0,
    frameSelectionRevision: 0,
    frameBindingCount: 0,
    frameBindingDigest: "00000000",
    exactFrameAck: null,
    frameBindingSample: []
  };

  function refreshPackageView() {
    const detailed = layers.filter((layer) => !layer.proxy);
    view.packageCount = detailed.length;
    view.proxyPackageCount = layers.length - detailed.length;
    view.pendingPackageUpgrades = upgradeQueue.size;
    view.textureCount = detailed.filter((layer) => layer.atlasTexture).length;
    view.generationIds = detailed.map((layer) => layer.packageValue.generation?.id).filter(Boolean);
    generationDigest = view.generationIds.join("|");
    view.generationDigest = generationDigest;
    view.growthDigests = detailed.map((layer) => layer.packageValue.growth?.digest).filter(Boolean);
    growthDigest = view.growthDigests.join("|");
    view.growthDigest = growthDigest;
  }

  refreshPackageView();

  function queuePackage(packageValue) {
    const typeIndex = treeTypes.findIndex((treeType) => String(treeType?.id ?? treeType?.[6]?.id ?? "") === String(packageValue?.archetypeId ?? ""));
    if (typeIndex < 0) throw new RangeError(`Unknown tree fidelity archetype: ${packageValue?.archetypeId}.`);
    if (!layers[typeIndex].proxy && layers[typeIndex].packageValue?.generation?.id === packageValue?.generation?.id) return false;
    upgradeQueue.set(typeIndex, packageValue);
    view.pendingPackageUpgrades = upgradeQueue.size;
    return true;
  }

  function applyOnePackageUpgrade() {
    const next = upgradeQueue.entries().next();
    if (next.done) return null;
    const [typeIndex, packageValue] = next.value;
    upgradeQueue.delete(typeIndex);
    const previous = layers[typeIndex];
    const replacement = createTypeLayer(THREE, scene, packageValue, typeIndex, capacity);
    layers[typeIndex] = replacement;
    disposeMesh(scene, previous.near);
    disposeMesh(scene, previous.medium);
    disposeMesh(scene, previous.far);
    disposeMesh(scene, previous.horizon);
    previous.atlasTexture?.dispose?.();
    refreshPackageView();
    return packageValue.archetypeId;
  }

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
    applyOnePackageUpgrade();
    elapsed += Math.max(0, Number(deltaTime) || 0);
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
          const prior = selections.get(treeId) ?? { form: rawForm(layer.packageValue, pixels), transition: null, candidate: null, candidateFrames: 0 };
          const desired = retainWithHysteresis(layer.packageValue, pixels, prior.transition?.to ?? prior.form);
          const stableFrames = Math.max(1, Number(layer.packageValue?.change?.stableSelectionFrames ?? 3));

          if (!prior.transition && desired !== prior.form) {
            if (prior.candidate === desired) prior.candidateFrames += 1;
            else { prior.candidate = desired; prior.candidateFrames = 1; }
            if (prior.candidateFrames >= stableFrames) {
              prior.transition = { from: prior.form, to: desired, elapsed: 0 };
              prior.candidate = null;
              prior.candidateFrames = 0;
            }
          } else if (!prior.transition) {
            prior.candidate = null;
            prior.candidateFrames = 0;
          } else if (desired !== prior.transition.to) {
            const current = prior.transition.elapsed >= (layer.packageValue.change?.duration ?? 0.32) * 0.5 ? prior.transition.to : prior.transition.from;
            prior.form = current;
            prior.transition = current === desired ? null : { from: current, to: desired, elapsed: 0 };
          }

          const record = { trunk, crown, bounds, pixels, treeId };
          if (prior.transition) {
            const duration = Math.max(0.001, Number(layer.packageValue.change?.duration ?? 0.32));
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
    const nextPresentationRecords = [];

    perType.forEach((selection, typeIndex) => {
      const layer = layers[typeIndex];
      for (const formId of ["near", "medium"]) {
        const mesh = layer[formId];
        const records = selection[formId];
        for (const entry of records) nextPresentationRecords.push({ typeIndex, formId, record: entry.record, fade: entry.fade });
        const count = Math.min(layer.capacities[formId], records.length);
        for (let index = 0; index < count; index += 1) {
          const entry = records[index];
          writeCombinedMatrix(mesh, index, entry.record.bounds, layer.packageValue, entry.record);
          setScalarAttribute(mesh, "fidelityFade", index, entry.fade);
          setVector3Attribute(mesh, "instanceTint", index, tintFor(entry.record));
        }
        mesh.count = count;
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.material.userData.treeFidelityUniforms) mesh.material.userData.treeFidelityUniforms.treeTime.value = elapsed;
        markAttributes(mesh, ["fidelityFade", "instanceTint"]);
        layer.counts[formId] = count;
        view.counts[formId] += count;
      }

      for (const formId of ["far", "horizon"]) {
        const mesh = layer[formId];
        if (layer.proxy) {
          mesh.count = 0;
          layer.counts[formId] = 0;
          continue;
        }
        const form = layer.packageValue.forms[formId];
        const rendered = [];
        for (const entry of selection[formId]) {
          const yawDegrees = Number(variationFor(entry.record).yawDegrees ?? 0);
          const bindings = resolveTreeImpostorBlend(form.frames, camera.position, entry.record.bounds, yawDegrees);
          for (const binding of bindings) {
            const fade = entry.fade * binding.weight;
            if (fade > 0.005) rendered.push({ entry, binding, fade });
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

    presentationRecords = nextPresentationRecords;
    view.presentationCount = presentationRecords.length;
    frameBindings.sort((left, right) => left.treeId.localeCompare(right.treeId) || left.formId.localeCompare(right.formId) || left.frameIndex - right.frameIndex);
    view.frameSelectionRevision += 1;
    view.frameBindingCount = frameBindings.length;
    view.frameBindingDigest = hashFrameBindings(frameBindings);
    view.frameBindingSample = frameBindings.slice(0, 32);
    view.exactFrameAck = Object.freeze({
      generationDigest,
      growthDigest,
      revision: view.frameSelectionRevision,
      bindingCount: view.frameBindingCount,
      bindingDigest: view.frameBindingDigest,
      textureCount: view.textureCount,
      presentationAuthority: view.presentationAuthority
    });
    return view;
  }

  function getPresentationRecords() {
    return presentationRecords;
  }

  function dispose() {
    patches.clear();
    selections.clear();
    presentationRecords = [];
    for (const layer of layers) {
      disposeMesh(scene, layer.near);
      disposeMesh(scene, layer.medium);
      disposeMesh(scene, layer.far);
      disposeMesh(scene, layer.horizon);
      layer.atlasTexture?.dispose?.();
    }
  }

  return Object.freeze({ view, activatePatch, releasePatches, queuePackage, update, getPresentationRecords, dispose });
}

export default createThreeTreeFidelityLayer;
