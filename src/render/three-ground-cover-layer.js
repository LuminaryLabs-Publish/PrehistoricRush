import {
  PREHISTORIC_GROUND_COVER_ARCHETYPES,
  getPrehistoricFoliageCardFamily
} from "../shared/prehistoric-foliage-card-recipes.js";

function addAttributes(THREE, geometry, capacity) {
  geometry.setAttribute("instanceTint", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3).fill(1), 3));
  geometry.setAttribute("groundWind", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 4), 4));
  return geometry;
}

function crossedGeometry(THREE, planes, capacity) {
  const positions = [];
  const uvs = [];
  const indices = [];
  let offset = 0;
  for (let plane = 0; plane < planes; plane += 1) {
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 2);
    geometry.translate(0, 0.5, 0);
    geometry.rotateY(Math.PI * plane / planes);
    const position = geometry.getAttribute("position");
    const uv = geometry.getAttribute("uv");
    for (let index = 0; index < position.count; index += 1) {
      positions.push(position.getX(index), position.getY(index), position.getZ(index));
      uvs.push(uv.getX(index), uv.getY(index));
    }
    for (let index = 0; index < geometry.index.count; index += 1) indices.push(geometry.index.getX(index) + offset);
    offset += position.count;
    geometry.dispose();
  }
  const output = new THREE.BufferGeometry();
  output.setIndex(indices);
  output.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  output.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  addAttributes(THREE, output, capacity);
  return output;
}

function patchMaterial(material, species) {
  const uniforms = {
    groundTime: { value: 0 },
    fadeStart: { value: 58 },
    fadeEnd: { value: 118 }
  };
  material.userData.groundCoverUniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>\nattribute vec3 instanceTint;\nattribute vec4 groundWind;\nuniform float groundTime;\nvarying vec3 vInstanceTint;\nvarying float vGroundDistance;`
      )
      .replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);\nvInstanceTint = instanceTint;\nfloat bend = sin(groundTime * groundWind.y + groundWind.z + instanceMatrix[3].x * 0.04 + instanceMatrix[3].z * 0.03) * groundWind.x * uv.y * uv.y * (1.0 - groundWind.w * 0.42);\ntransformed.x += bend;\ntransformed.z += bend * 0.28;\nvec4 groundWorld = modelMatrix * instanceMatrix * vec4(transformed, 1.0);\nvGroundDistance = distance(cameraPosition, groundWorld.xyz);`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying vec3 vInstanceTint;\nvarying float vGroundDistance;\nuniform float fadeStart;\nuniform float fadeEnd;\nfloat groundHash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}`
      )
      .replace("vec4 diffuseColor = vec4( diffuse, opacity );", "vec4 diffuseColor = vec4( diffuse * vInstanceTint, opacity );")
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>\nfloat groundFade = 1.0 - smoothstep(fadeStart, fadeEnd, vGroundDistance);\nif (groundHash(gl_FragCoord.xy) > groundFade) discard;`
      );
  };
  material.customProgramCacheKey = () => `prehistoric-ground-cover-${species.id}-v1`;
  return material;
}

function createBatch(THREE, scene, atlas, species, capacity) {
  const family = getPrehistoricFoliageCardFamily(species.familyId);
  const geometry = crossedGeometry(THREE, species.crossedPlanes, capacity);
  const material = patchMaterial(new THREE.MeshStandardMaterial({
    name: `ground-cover:${species.id}`,
    map: atlas.createFamilyTexture(species.familyId),
    color: species.color,
    alphaTest: family?.alphaCutoff ?? 0.38,
    alphaToCoverage: true,
    transparent: false,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
    roughness: family?.roughness ?? 0.8,
    metalness: 0,
    emissive: 0x102616,
    emissiveIntensity: Number(family?.translucency ?? 0.12) * 0.24,
    fog: true
  }), species);
  const mesh = new THREE.InstancedMesh(geometry, material, capacity);
  mesh.name = `prehistoric-ground-cover-${species.id}`;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  scene.add(mesh);
  return { species, mesh, capacity, count: 0 };
}

export function createThreeGroundCoverLayer(THREE, options = {}) {
  const { scene, atlas, capacityPerSpecies = 2400 } = options;
  if (!scene || !atlas) throw new TypeError("Ground cover layer requires scene and foliage atlas.");
  const batches = new Map(PREHISTORIC_GROUND_COVER_ARCHETYPES.map((species) => [species.id, createBatch(THREE, scene, atlas, species, capacityPerSpecies)]));
  const patches = new Map();
  const matrix = new THREE.Matrix4();
  let elapsed = 0;
  const view = {
    enabled: true,
    activePatches: 0,
    count: 0,
    overflow: 0,
    counts: Object.fromEntries(PREHISTORIC_GROUND_COVER_ARCHETYPES.map((species) => [species.id, 0])),
    atlasRevision: atlas.revision
  };

  function activatePatch(patch) {
    patches.set(patch.id, patch);
    view.activePatches = patches.size;
  }

  function releasePatches(ids = []) {
    for (const id of ids) patches.delete(id);
    view.activePatches = patches.size;
  }

  function update(_state, deltaTime = 1 / 60) {
    elapsed += Math.max(0, Number(deltaTime) || 0);
    const records = new Map(PREHISTORIC_GROUND_COVER_ARCHETYPES.map((species) => [species.id, []]));
    for (const patch of patches.values()) {
      for (const descriptor of patch.groundCover ?? []) {
        const bucket = records.get(descriptor.speciesId);
        if (bucket) bucket.push(descriptor);
      }
    }

    view.count = 0;
    view.overflow = 0;
    for (const [speciesId, batch] of batches) {
      const values = records.get(speciesId);
      const count = Math.min(batch.capacity, values.length);
      const tintAttribute = batch.mesh.geometry.getAttribute("instanceTint");
      const windAttribute = batch.mesh.geometry.getAttribute("groundWind");
      for (let index = 0; index < count; index += 1) {
        const descriptor = values[index];
        batch.mesh.setMatrixAt(index, matrix.fromArray(descriptor.matrix));
        const tint = descriptor.tint ?? [1, 1, 1];
        const wind = descriptor.wind ?? { amplitude: 0.08, frequency: 0.7, phase: 0, stiffness: 0.72 };
        tintAttribute.setXYZ(index, tint[0], tint[1], tint[2]);
        windAttribute.setXYZW(index, wind.amplitude, wind.frequency, wind.phase, wind.stiffness);
      }
      batch.mesh.count = count;
      batch.mesh.instanceMatrix.needsUpdate = true;
      tintAttribute.needsUpdate = true;
      windAttribute.needsUpdate = true;
      batch.mesh.material.userData.groundCoverUniforms.groundTime.value = elapsed;
      batch.count = count;
      view.counts[speciesId] = count;
      view.count += count;
      view.overflow += Math.max(0, values.length - count);
    }
    return view;
  }

  function dispose() {
    patches.clear();
    for (const batch of batches.values()) {
      scene.remove(batch.mesh);
      batch.mesh.geometry.dispose();
      batch.mesh.material.map?.dispose?.();
      batch.mesh.material.dispose();
    }
  }

  return Object.freeze({ view, activatePatch, releasePatches, update, dispose });
}

export default createThreeGroundCoverLayer;
