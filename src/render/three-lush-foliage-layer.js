import { PREHISTORIC_FOLIAGE_CARD_FAMILIES } from "../shared/prehistoric-foliage-card-recipes.js";
import { PREHISTORIC_TREE_ARCHETYPES } from "../shared/tree-archetype-catalog.js";

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function addInstanceAttributes(THREE, geometry, capacity) {
  geometry.setAttribute("fidelityFade", new THREE.InstancedBufferAttribute(new Float32Array(capacity).fill(1), 1));
  geometry.setAttribute("instanceTint", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3).fill(1), 3));
  geometry.setAttribute("foliageWind", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 4), 4));
  geometry.setAttribute("foliageShade", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 4), 4));
  return geometry;
}

function patchFoliageMaterial(material, family, formId) {
  const uniforms = { foliageTime: { value: 0 } };
  material.userData.foliageUniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
attribute float fidelityFade;
attribute vec3 instanceTint;
attribute vec4 foliageWind;
attribute vec4 foliageShade;
uniform float foliageTime;
varying float vFidelityFade;
varying vec3 vInstanceTint;
varying vec4 vFoliageShade;`
      )
      .replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);
vFidelityFade = fidelityFade;
vInstanceTint = instanceTint;
vFoliageShade = foliageShade;
float windWeight = uv.y * uv.y;
float phase = foliageWind.z + instanceMatrix[3].x * 0.027 + instanceMatrix[3].z * 0.019;
float sway = sin(foliageTime * foliageWind.y + phase) * foliageWind.x * windWeight * (1.0 - foliageWind.w * 0.45);
transformed.x += sway;
transformed.z += sway * 0.32;`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying float vFidelityFade;
varying vec3 vInstanceTint;
varying vec4 vFoliageShade;
float foliageHash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}`
      )
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        "vec3 computedLeafColor = diffuse * vInstanceTint * mix(0.68, 1.2, vFoliageShade.x) * mix(1.0, 0.76, vFoliageShade.y);\nvec4 diffuseColor = vec4(computedLeafColor, opacity);"
      )
      .replace(
        "vec3 totalEmissiveRadiance = emissive;",
        "vec3 totalEmissiveRadiance = emissive + diffuse * vInstanceTint * vFoliageShade.z * 0.14;"
      )
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>
if (foliageHash(gl_FragCoord.xy) > clamp(vFidelityFade, 0.0, 1.0)) discard;`
      );
  };
  material.customProgramCacheKey = () => `prehistoric-compute-foliage-${family.id}-${formId}-v2`;
  return material;
}

function createFamilyBatch(THREE, scene, atlas, family, formId, capacity) {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 2);
  addInstanceAttributes(THREE, geometry, capacity);
  const parameters = {
    name: `compute-foliage:${family.id}:${formId}`,
    map: atlas.createFamilyTexture(family.id),
    color: 0xffffff,
    alphaTest: family.alphaCutoff,
    alphaToCoverage: true,
    transparent: false,
    depthWrite: true,
    depthTest: true,
    side: THREE.DoubleSide,
    roughness: family.roughness,
    metalness: 0,
    emissive: 0x102818,
    emissiveIntensity: family.translucency * (formId === "near" ? 0.2 : 0.25),
    fog: true
  };
  const baseMaterial = THREE.MeshPhysicalMaterial
    ? new THREE.MeshPhysicalMaterial({
        ...parameters,
        clearcoat: 0.02,
        clearcoatRoughness: 0.88,
        sheen: 0.08,
        sheenRoughness: 0.8,
        sheenColor: new THREE.Color(0x72935f)
      })
    : new THREE.MeshStandardMaterial(parameters);
  const material = patchFoliageMaterial(baseMaterial, family, formId);
  const mesh = new THREE.InstancedMesh(geometry, material, capacity);
  mesh.name = `prehistoric-compute-foliage-${family.id}-${formId}`;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = formId === "near";
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  scene.add(mesh);
  return { mesh, family, formId, capacity, count: 0 };
}

function sourceBounds(packageValue) {
  const bounds = packageValue?.source?.bounds ?? {};
  return {
    size: bounds.size ?? [bounds.width ?? 1, bounds.height ?? 1, bounds.depth ?? bounds.width ?? 1]
  };
}

function variationFor(record) {
  return record.trunk.metadata?.variation ?? record.crown.metadata?.variation ?? {};
}

function treeMatrixFor(THREE, record, packageValue, target) {
  const bounds = record.bounds;
  const source = sourceBounds(packageValue);
  const variation = variationFor(record);
  const ground = variation.groundPosition ?? [bounds.center[0], bounds.min[1], bounds.center[2]];
  const position = target.position;
  const rotation = target.rotation;
  const quaternion = target.quaternion;
  const scale = target.scale;
  position.set(ground[0], ground[1], ground[2]);
  rotation.set(
    Number(variation.leanXRadians ?? Number(variation.leanXDegrees ?? 0) * Math.PI / 180),
    Number(variation.yawRadians ?? Number(variation.yawDegrees ?? 0) * Math.PI / 180),
    Number(variation.leanZRadians ?? Number(variation.leanZDegrees ?? 0) * Math.PI / 180),
    "YXZ"
  );
  quaternion.setFromEuler(rotation);
  scale.set(
    bounds.size[0] / Math.max(0.001, source.size[0]),
    bounds.size[1] / Math.max(0.001, source.size[1]),
    bounds.size[2] / Math.max(0.001, source.size[2])
  );
  target.treeMatrix.compose(position, quaternion, scale);
}

function shadingFor(form, cluster, clusterIndex) {
  const buffer = form?.shadingBuffer ?? [];
  const offset = clusterIndex * 8;
  if (buffer.length >= offset + 8) {
    return {
      lightExposure: clamp(Number(buffer[offset]), 0, 1),
      shade: clamp(Number(buffer[offset + 1]), 0, 1),
      backlight: clamp(Number(buffer[offset + 2]), 0, 1),
      windScale: Math.max(0, Number(buffer[offset + 3]) || 0),
      seed: Number(buffer[offset + 4]) || 0,
      cardCount: Math.max(1, Math.floor(Number(buffer[offset + 5]) || 1)),
      radial: Number(buffer[offset + 6]) > 0.5,
      hanging: Number(buffer[offset + 7]) > 0.5
    };
  }
  return {
    lightExposure: clamp(Number(cluster.lightExposure ?? 0.5), 0, 1),
    shade: clamp(Number(cluster.shade ?? 0.5), 0, 1),
    backlight: Math.max(0.04, 1 - Number(cluster.shade ?? 0.5) * 0.68),
    windScale: Math.max(0, Number(cluster.windScale ?? 1)),
    seed: Number(cluster.seed ?? 0),
    cardCount: Math.max(1, Math.floor(Number(cluster.cardCount ?? 1))),
    radial: cluster.mode === "radial-frond",
    hanging: cluster.mode === "hanging-edge"
  };
}

function colorTint(THREE, archetype, record, shading, cardIndex) {
  const color = new THREE.Color(archetype.foliageColor);
  const accent = new THREE.Color(archetype.accentColor ?? archetype.foliageColor);
  const edgeAmount = clamp(shading.lightExposure * 0.48 + (cardIndex % 3) * 0.035, 0, 0.58);
  color.lerp(accent, edgeAmount);
  const variationTint = variationFor(record).tint ?? [1, 1, 1];
  return [
    color.r * Number(variationTint[0] ?? 1),
    color.g * Number(variationTint[1] ?? 1),
    color.b * Number(variationTint[2] ?? 1)
  ];
}

function setAttributes(mesh, index, fade, tint, wind, shade) {
  mesh.geometry.getAttribute("fidelityFade").setX(index, fade);
  mesh.geometry.getAttribute("instanceTint").setXYZ(index, tint[0], tint[1], tint[2]);
  mesh.geometry.getAttribute("foliageWind").setXYZW(index, wind.amplitude, wind.frequency, wind.phase, wind.stiffness);
  mesh.geometry.getAttribute("foliageShade").setXYZW(index, shade.lightExposure, shade.shade, shade.backlight, shade.windScale);
}

function markAttributes(mesh) {
  for (const name of ["fidelityFade", "instanceTint", "foliageWind", "foliageShade"]) mesh.geometry.getAttribute(name).needsUpdate = true;
}

export function createThreeLushFoliageLayer(THREE, options = {}) {
  const { scene, packages = [], atlas, authority, capacityPerFamily = 8192 } = options;
  if (!scene || !atlas || !authority?.getPresentationRecords) throw new TypeError("Lush foliage layer requires scene, foliage atlas, and Object Fidelity presentation authority.");
  if (packages.length !== PREHISTORIC_TREE_ARCHETYPES.length) throw new Error("Lush foliage package and archetype counts must match.");
  for (const packageValue of packages) {
    if (!packageValue?.growth?.forms?.near?.plan || !packageValue?.growth?.forms?.medium?.plan || !packageValue?.growth?.digest) {
      throw new Error(`Tree package ${packageValue?.archetypeId ?? "unknown"} is missing admitted natural-growth forms.`);
    }
  }

  const batches = new Map();
  for (const family of PREHISTORIC_FOLIAGE_CARD_FAMILIES) {
    batches.set(`${family.id}:near`, createFamilyBatch(THREE, scene, atlas, family, "near", capacityPerFamily));
    batches.set(`${family.id}:medium`, createFamilyBatch(THREE, scene, atlas, family, "medium", capacityPerFamily));
  }
  const familyById = new Map(PREHISTORIC_FOLIAGE_CARD_FAMILIES.map((family) => [family.id, family]));
  const treeTransform = {
    treeMatrix: new THREE.Matrix4(),
    localMatrix: new THREE.Matrix4(),
    worldMatrix: new THREE.Matrix4(),
    position: new THREE.Vector3(),
    rotation: new THREE.Euler(0, 0, 0, "YXZ"),
    quaternion: new THREE.Quaternion(),
    scale: new THREE.Vector3()
  };
  let elapsed = 0;
  const growthDigest = packages.map((entry) => entry.growth.digest).join("|");

  const view = {
    enabled: true,
    activePatches: 0,
    treeCount: 0,
    counts: Object.fromEntries(PREHISTORIC_FOLIAGE_CARD_FAMILIES.map((family) => [family.id, { near: 0, medium: 0 }])),
    nearCards: 0,
    mediumCards: 0,
    transitioning: 0,
    overflow: 0,
    atlasRevision: atlas.revision,
    growthDigest,
    authority: "object-fidelity-natural-growth",
    computePreparedShading: true
  };

  function activatePatch() {
    view.activePatches = authority.view.activePatches;
  }

  function releasePatches() {
    view.activePatches = authority.view.activePatches;
  }

  function appendPlanCards(buckets, entry) {
    const packageValue = packages[entry.typeIndex];
    const archetype = PREHISTORIC_TREE_ARCHETYPES[entry.typeIndex];
    const form = packageValue.growth.forms[entry.formId];
    const plan = form.plan;
    treeMatrixFor(THREE, entry.record, packageValue, treeTransform);

    plan.foliageClusters.forEach((cluster, clusterIndex) => {
      const family = familyById.get(cluster.familyId);
      if (!family) throw new Error(`Growth cluster ${cluster.id} references unknown foliage family ${cluster.familyId}.`);
      const shading = shadingFor(form, cluster, clusterIndex);
      for (let cardIndex = 0; cardIndex < shading.cardCount; cardIndex += 1) {
        const yawOffset = shading.cardCount === 1 ? 0 : cardIndex / shading.cardCount * Math.PI;
        treeTransform.position.set(...cluster.position);
        treeTransform.rotation.set(
          Number(cluster.rotation?.[0] ?? 0) + (shading.radial ? -0.08 : 0),
          Number(cluster.rotation?.[1] ?? 0) + yawOffset,
          Number(cluster.rotation?.[2] ?? 0) + (cardIndex % 2 === 0 ? -1 : 1) * 0.035,
          "YXZ"
        );
        treeTransform.quaternion.setFromEuler(treeTransform.rotation);
        const jitter = 0.94 + (shading.seed + cardIndex * 0.173) % 1 * 0.12;
        treeTransform.scale.set(cluster.scale[0] * jitter, cluster.scale[1] * jitter, 1);
        treeTransform.localMatrix.compose(treeTransform.position, treeTransform.quaternion, treeTransform.scale);
        treeTransform.worldMatrix.multiplyMatrices(treeTransform.treeMatrix, treeTransform.localMatrix);
        const bucket = buckets.get(`${cluster.familyId}:${entry.formId}`);
        bucket.push({
          matrix: treeTransform.worldMatrix.toArray(),
          fade: entry.fade,
          tint: colorTint(THREE, archetype, entry.record, shading, cardIndex),
          wind: {
            amplitude: family.wind.amplitude * shading.windScale,
            frequency: family.wind.frequency,
            phase: shading.seed * Math.PI * 2 + cardIndex * 0.73,
            stiffness: family.wind.stiffness
          },
          shade: shading
        });
      }
    });
  }

  function update(_state, deltaTime = 1 / 60) {
    elapsed += Math.max(0, Number(deltaTime) || 0);
    const buckets = new Map(Array.from(batches.keys()).map((key) => [key, []]));
    const records = authority.getPresentationRecords();
    for (const entry of records) appendPlanCards(buckets, entry);

    view.nearCards = 0;
    view.mediumCards = 0;
    view.overflow = 0;
    view.treeCount = new Set(records.map((entry) => entry.record.treeId)).size;
    view.transitioning = authority.view.transitioning;
    view.activePatches = authority.view.activePatches;
    for (const family of PREHISTORIC_FOLIAGE_CARD_FAMILIES) view.counts[family.id] = { near: 0, medium: 0 };

    for (const [key, batch] of batches) {
      const bucket = buckets.get(key);
      const count = Math.min(batch.capacity, bucket.length);
      for (let index = 0; index < count; index += 1) {
        const record = bucket[index];
        batch.mesh.setMatrixAt(index, treeTransform.worldMatrix.fromArray(record.matrix));
        setAttributes(batch.mesh, index, record.fade, record.tint, record.wind, record.shade);
      }
      batch.mesh.count = count;
      batch.mesh.instanceMatrix.needsUpdate = true;
      markAttributes(batch.mesh);
      batch.mesh.material.userData.foliageUniforms.foliageTime.value = elapsed;
      batch.count = count;
      const separator = key.lastIndexOf(":");
      const familyId = key.slice(0, separator);
      const formId = key.slice(separator + 1);
      view.counts[familyId][formId] = count;
      if (formId === "near") view.nearCards += count;
      else view.mediumCards += count;
      view.overflow += Math.max(0, bucket.length - count);
    }
    return view;
  }

  function dispose() {
    for (const batch of batches.values()) {
      scene.remove(batch.mesh);
      batch.mesh.geometry.dispose();
      batch.mesh.material.map?.dispose?.();
      batch.mesh.material.dispose();
    }
  }

  return Object.freeze({ view, activatePatch, releasePatches, update, dispose });
}

export default createThreeLushFoliageLayer;
