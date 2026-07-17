import {
  PREHISTORIC_FOLIAGE_CARD_FAMILIES,
  createTreeFoliageCardPlacements
} from "../shared/prehistoric-foliage-card-recipes.js";
import { PREHISTORIC_TREE_ARCHETYPES } from "../shared/tree-archetype-catalog.js";

const FORMS = Object.freeze(["near", "medium", "absent"]);

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
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
    height: max[1] - min[1]
  };
}

function projectedPixels(camera, renderer, worldHeight, distance) {
  const viewportHeight = renderer.domElement?.height || globalThis.innerHeight || 720;
  const fov = Math.max(1, Number(camera.fov ?? 60)) * Math.PI / 180;
  return worldHeight * viewportHeight / Math.max(0.001, 2 * distance * Math.tan(fov * 0.5));
}

function rawForm(packageValue, pixels) {
  const near = Number(packageValue?.forms?.near?.minimumProjectedSize ?? 360);
  const medium = Number(packageValue?.forms?.medium?.minimumProjectedSize ?? 150);
  if (pixels >= near) return "near";
  if (pixels >= medium) return "medium";
  return "absent";
}

function retainedForm(packageValue, pixels, previous) {
  if (!FORMS.includes(previous)) return rawForm(packageValue, pixels);
  const near = Number(packageValue?.forms?.near?.minimumProjectedSize ?? 360);
  const medium = Number(packageValue?.forms?.medium?.minimumProjectedSize ?? 150);
  const hysteresis = clamp(Number(packageValue?.change?.hysteresis ?? 0.16), 0, 0.4);
  if (previous === "near" && pixels >= near * (1 - hysteresis)) return "near";
  if (previous === "medium" && pixels >= medium * (1 - hysteresis) && pixels < near * (1 + hysteresis)) return "medium";
  if (previous === "absent" && pixels < medium * (1 + hysteresis)) return "absent";
  return rawForm(packageValue, pixels);
}

function addInstanceAttributes(THREE, geometry, capacity) {
  geometry.setAttribute("fidelityFade", new THREE.InstancedBufferAttribute(new Float32Array(capacity).fill(1), 1));
  geometry.setAttribute("instanceTint", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3).fill(1), 3));
  geometry.setAttribute("foliageWind", new THREE.InstancedBufferAttribute(new Float32Array(capacity * 4), 4));
  return geometry;
}

function patchFoliageMaterial(material, family, formId) {
  const uniforms = {
    foliageTime: { value: 0 }
  };
  material.userData.foliageUniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>\nattribute float fidelityFade;\nattribute vec3 instanceTint;\nattribute vec4 foliageWind;\nuniform float foliageTime;\nvarying float vFidelityFade;\nvarying vec3 vInstanceTint;`
      )
      .replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);\nvFidelityFade = fidelityFade;\nvInstanceTint = instanceTint;\nfloat windWeight = uv.y * uv.y;\nfloat phase = foliageWind.z + instanceMatrix[3].x * 0.027 + instanceMatrix[3].z * 0.019;\nfloat sway = sin(foliageTime * foliageWind.y + phase) * foliageWind.x * windWeight * (1.0 - foliageWind.w * 0.45);\ntransformed.x += sway;\ntransformed.z += sway * 0.32;`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying float vFidelityFade;\nvarying vec3 vInstanceTint;\nfloat foliageHash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}`
      )
      .replace("vec4 diffuseColor = vec4( diffuse, opacity );", "vec4 diffuseColor = vec4( diffuse * vInstanceTint, opacity );")
      .replace(
        "#include <clipping_planes_fragment>",
        `#include <clipping_planes_fragment>\nif (foliageHash(gl_FragCoord.xy) > clamp(vFidelityFade, 0.0, 1.0)) discard;`
      );
  };
  material.customProgramCacheKey = () => `prehistoric-lush-foliage-${family.id}-${formId}-v1`;
  return material;
}

function createFamilyBatch(THREE, scene, atlas, family, formId, capacity) {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 2);
  addInstanceAttributes(THREE, geometry, capacity);
  const material = patchFoliageMaterial(new THREE.MeshStandardMaterial({
    name: `lush-foliage:${family.id}:${formId}`,
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
    emissive: 0x122c18,
    emissiveIntensity: family.translucency * (formId === "near" ? 0.26 : 0.32),
    fog: true
  }), family, formId);
  const mesh = new THREE.InstancedMesh(geometry, material, capacity);
  mesh.name = `prehistoric-lush-foliage-${family.id}-${formId}`;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = formId === "near";
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  scene.add(mesh);
  return { mesh, family, formId, capacity, count: 0 };
}

function markAttributes(mesh) {
  for (const name of ["fidelityFade", "instanceTint", "foliageWind"]) mesh.geometry.getAttribute(name).needsUpdate = true;
}

function setAttributes(mesh, index, fade, tint, wind) {
  mesh.geometry.getAttribute("fidelityFade").setX(index, fade);
  mesh.geometry.getAttribute("instanceTint").setXYZ(index, tint[0], tint[1], tint[2]);
  mesh.geometry.getAttribute("foliageWind").setXYZW(index, wind.amplitude, wind.frequency, wind.phase, wind.stiffness);
}

function colorTint(THREE, archetype, record, placement) {
  const color = new THREE.Color(archetype.foliageColor);
  const accent = new THREE.Color(archetype.accentColor ?? archetype.foliageColor);
  const amount = clamp(Number(placement.seed ?? 0.5) * 0.42, 0, 0.42);
  color.lerp(accent, amount);
  const variationTint = record.trunk.metadata?.variation?.tint ?? [1, 1, 1];
  const placementTint = placement.tint ?? [1, 1, 1];
  return [
    color.r * Number(variationTint[0] ?? 1) * Number(placementTint[0] ?? 1),
    color.g * Number(variationTint[1] ?? 1) * Number(placementTint[1] ?? 1),
    color.b * Number(variationTint[2] ?? 1) * Number(placementTint[2] ?? 1)
  ];
}

export function createThreeLushFoliageLayer(THREE, options = {}) {
  const {
    scene,
    camera,
    renderer,
    packages = [],
    atlas,
    capacityPerFamily = 8192
  } = options;
  if (!scene || !camera || !renderer || !atlas) throw new TypeError("Lush foliage layer requires scene, camera, renderer, and foliage atlas.");
  if (packages.length !== PREHISTORIC_TREE_ARCHETYPES.length) throw new Error("Lush foliage package and archetype counts must match.");

  const batches = new Map();
  for (const family of PREHISTORIC_FOLIAGE_CARD_FAMILIES) {
    batches.set(`${family.id}:near`, createFamilyBatch(THREE, scene, atlas, family, "near", capacityPerFamily));
    batches.set(`${family.id}:medium`, createFamilyBatch(THREE, scene, atlas, family, "medium", capacityPerFamily));
  }
  const placements = PREHISTORIC_TREE_ARCHETYPES.map((archetype) => ({
    near: createTreeFoliageCardPlacements(archetype, "near"),
    medium: createTreeFoliageCardPlacements(archetype, "medium")
  }));
  const patches = new Map();
  const selections = new Map();
  const treeMatrix = new THREE.Matrix4();
  const localMatrix = new THREE.Matrix4();
  const worldMatrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const rotation = new THREE.Euler(0, 0, 0, "YXZ");
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  let elapsed = 0;

  const view = {
    enabled: true,
    activePatches: 0,
    treeCount: 0,
    counts: Object.fromEntries(PREHISTORIC_FOLIAGE_CARD_FAMILIES.map((family) => [family.id, { near: 0, medium: 0 }])),
    nearCards: 0,
    mediumCards: 0,
    transitioning: 0,
    overflow: 0,
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

  function treeTransform(record, archetype) {
    const variation = record.trunk.metadata?.variation ?? {};
    const bounds = combineBounds(record.trunk, record.crown);
    const ground = variation.groundPosition ?? [bounds.center[0], bounds.min[1], bounds.center[2]];
    const trunkHeight = record.trunk.bounds.max[1] - record.trunk.bounds.min[1];
    const verticalScale = trunkHeight / Math.max(0.001, archetype.averageHeight);
    const horizontalScale = Math.max(
      (record.crown.bounds.max[0] - record.crown.bounds.min[0]) / Math.max(0.001, archetype.crownRadius * 2),
      (record.crown.bounds.max[2] - record.crown.bounds.min[2]) / Math.max(0.001, archetype.crownRadius * 2)
    );
    position.set(ground[0], ground[1], ground[2]);
    rotation.set(
      Number(variation.leanXRadians ?? Number(variation.leanXDegrees ?? 0) * Math.PI / 180),
      Number(variation.yawRadians ?? Number(variation.yawDegrees ?? 0) * Math.PI / 180),
      Number(variation.leanZRadians ?? Number(variation.leanZDegrees ?? 0) * Math.PI / 180),
      "YXZ"
    );
    quaternion.setFromEuler(rotation);
    scale.set(horizontalScale, verticalScale, horizontalScale);
    treeMatrix.compose(position, quaternion, scale);
    return bounds;
  }

  function appendCards(buckets, typeIndex, record, formId, fade) {
    if (formId === "absent" || fade <= 0.005) return;
    const archetype = PREHISTORIC_TREE_ARCHETYPES[typeIndex];
    treeTransform(record, archetype);
    for (const card of placements[typeIndex][formId]) {
      position.set(...card.position);
      rotation.set(...card.rotation, "YXZ");
      quaternion.setFromEuler(rotation);
      scale.set(card.scale[0], card.scale[1], 1);
      localMatrix.compose(position, quaternion, scale);
      worldMatrix.multiplyMatrices(treeMatrix, localMatrix);
      const bucket = buckets.get(`${card.familyId}:${formId}`);
      bucket.push({ matrix: worldMatrix.toArray(), fade, tint: colorTint(THREE, archetype, record, card), wind: card.wind });
    }
  }

  function update(_state, deltaTime = 1 / 60) {
    elapsed += Math.max(0, Number(deltaTime) || 0);
    const buckets = new Map(Array.from(batches.keys()).map((key) => [key, []]));
    const seen = new Set();
    let transitioning = 0;
    let treeCount = 0;

    for (const patch of patches.values()) {
      patch.trees.forEach((treeSet, typeIndex) => {
        const packageValue = packages[typeIndex];
        const count = Math.min(treeSet.trunks.length, treeSet.crowns.length);
        for (let index = 0; index < count; index += 1) {
          const record = { trunk: treeSet.trunks[index], crown: treeSet.crowns[index] };
          const treeId = record.trunk.metadata?.treeId ?? record.trunk.id;
          const bounds = combineBounds(record.trunk, record.crown);
          const distance = Math.max(0.001, camera.position.distanceTo(position.set(...bounds.center)));
          const pixels = projectedPixels(camera, renderer, bounds.height, distance);
          const prior = selections.get(treeId) ?? { form: rawForm(packageValue, pixels), transition: null, candidate: null, candidateFrames: 0 };
          const desired = retainedForm(packageValue, pixels, prior.transition?.to ?? prior.form);
          const stableFrames = Math.max(1, Number(packageValue?.change?.stableSelectionFrames ?? 2));
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
          }

          if (prior.transition) {
            const duration = Math.max(0.001, Number(packageValue?.change?.duration ?? 0.35));
            prior.transition.elapsed += Math.max(0, Number(deltaTime) || 0);
            const progress = clamp(prior.transition.elapsed / duration, 0, 1);
            appendCards(buckets, typeIndex, record, prior.transition.from, 1 - progress);
            appendCards(buckets, typeIndex, record, prior.transition.to, progress);
            transitioning += 1;
            if (progress >= 1) {
              prior.form = prior.transition.to;
              prior.transition = null;
            }
          } else {
            prior.form = desired;
            appendCards(buckets, typeIndex, record, prior.form, 1);
          }
          selections.set(treeId, prior);
          seen.add(treeId);
          treeCount += 1;
        }
      });
    }

    for (const key of selections.keys()) if (!seen.has(key)) selections.delete(key);
    view.nearCards = 0;
    view.mediumCards = 0;
    view.overflow = 0;
    for (const family of PREHISTORIC_FOLIAGE_CARD_FAMILIES) view.counts[family.id] = { near: 0, medium: 0 };

    for (const [key, batch] of batches) {
      const records = buckets.get(key);
      const count = Math.min(batch.capacity, records.length);
      for (let index = 0; index < count; index += 1) {
        const record = records[index];
        batch.mesh.setMatrixAt(index, worldMatrix.fromArray(record.matrix));
        setAttributes(batch.mesh, index, record.fade, record.tint, record.wind);
      }
      batch.mesh.count = count;
      batch.mesh.instanceMatrix.needsUpdate = true;
      markAttributes(batch.mesh);
      batch.mesh.material.userData.foliageUniforms.foliageTime.value = elapsed;
      batch.count = count;
      const [familyId, formId] = key.split(":");
      view.counts[familyId][formId] = count;
      if (formId === "near") view.nearCards += count;
      else view.mediumCards += count;
      view.overflow += Math.max(0, records.length - count);
    }
    view.treeCount = treeCount;
    view.transitioning = transitioning;
    return view;
  }

  function dispose() {
    patches.clear();
    selections.clear();
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
