const GRASS_VARIANT_COUNT = 6;
const DETAIL_VARIANT_COUNT = 4;

function hashText(value) {
  let hash = 2166136261;
  for (const character of String(value)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function unit(seed, salt = "") {
  let value = hashText(`${seed}:${salt}`) || 1;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return (value >>> 0) / 4294967295;
}

function canvasFor(width, height) {
  if (typeof OffscreenCanvas === "function") return new OffscreenCanvas(width, height);
  const canvas = globalThis.document?.createElement?.("canvas");
  if (!canvas) throw new Error("Production ground layer requires a canvas-capable browser.");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawBlade(context, x, baseY, height, width, lean, color) {
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x - width * 0.5, baseY);
  context.quadraticCurveTo(x + lean * 0.3, baseY - height * 0.54, x + lean, baseY - height);
  context.quadraticCurveTo(x + lean * 0.16, baseY - height * 0.48, x + width * 0.5, baseY);
  context.closePath();
  context.fill();
}

function createGrassAtlas(THREE, tileSize = 128) {
  const columns = 3;
  const rows = 2;
  const canvas = canvasFor(tileSize * columns, tileSize * rows);
  canvas.width = tileSize * columns;
  canvas.height = tileSize * rows;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Production grass atlas requires a 2D context.");
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let variant = 0; variant < GRASS_VARIANT_COUNT; variant += 1) {
    const column = variant % columns;
    const row = Math.floor(variant / columns);
    const ox = column * tileSize;
    const oy = row * tileSize;
    const bladeCount = 14 + variant * 3;
    for (let blade = 0; blade < bladeCount; blade += 1) {
      const seed = `grass:${variant}:${blade}`;
      const x = ox + tileSize * (0.08 + unit(seed, "x") * 0.84);
      const height = tileSize * (0.35 + unit(seed, "height") * 0.56);
      const width = tileSize * (0.012 + unit(seed, "width") * 0.02);
      const lean = tileSize * (unit(seed, "lean") - 0.5) * 0.22;
      const light = 94 + Math.floor(unit(seed, "light") * 55);
      drawBlade(context, x, oy + tileSize * 0.96, height, width, lean, `rgba(${46 + variant * 4},${light + 55},${38 + variant * 3},.98)`);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.name = "prehistoric-production-grass-atlas-v2";
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return {
    texture,
    createVariantTexture(variant) {
      const result = texture.clone();
      result.repeat.set(1 / columns, 1 / rows);
      result.offset.set((variant % columns) / columns, (rows - 1 - Math.floor(variant / columns)) / rows);
      result.needsUpdate = true;
      return result;
    },
    dispose() { texture.dispose(); }
  };
}

function createGrassGeometry(THREE) {
  const positions = [];
  const uvs = [];
  const indices = [];
  let offset = 0;
  for (let plane = 0; plane < 2; plane += 1) {
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 3);
    geometry.translate(0, 0.5, 0);
    geometry.rotateY(plane * Math.PI * 0.5);
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
  return output;
}

function patchGrassMaterial(material) {
  const uniforms = { productionTime: { value: 0 } };
  material.userData.productionUniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float productionTime;")
      .replace(
        "#include <begin_vertex>",
        "vec3 transformed = vec3(position);\nfloat grassSway = sin(productionTime * 1.35 + instanceMatrix[3].x * 0.13 + instanceMatrix[3].z * 0.09) * 0.11 * uv.y * uv.y;\ntransformed.x += grassSway;\ntransformed.z += grassSway * 0.35;"
      );
  };
  material.customProgramCacheKey = () => "prehistoric-production-grass-v2";
  return material;
}

function createGrassBatches(THREE, scene, grassAtlas, capacityPerVariant) {
  return Array.from({ length: GRASS_VARIANT_COUNT }, (_, variant) => {
    const geometry = createGrassGeometry(THREE);
    const material = patchGrassMaterial(new THREE.MeshStandardMaterial({
      name: `production-grass:${variant}`,
      map: grassAtlas.createVariantTexture(variant),
      color: 0xffffff,
      alphaTest: 0.34,
      alphaToCoverage: true,
      transparent: false,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      roughness: 0.86,
      metalness: 0,
      emissive: 0x102613,
      emissiveIntensity: 0.12,
      fog: true
    }));
    const mesh = new THREE.InstancedMesh(geometry, material, capacityPerVariant);
    mesh.name = `prehistoric-production-grass-${variant}`;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return { mesh, capacity: capacityPerVariant };
  });
}

function createGroundDetailBatches(THREE, scene, capacityPerVariant) {
  const definitions = [
    { color: 0x68583a, opacity: 0.72 },
    { color: 0x42623a, opacity: 0.68 },
    { color: 0x4d3b2a, opacity: 0.62 },
    { color: 0x78704b, opacity: 0.58 }
  ];
  return definitions.map((definition, variant) => {
    const geometry = new THREE.PlaneGeometry(1, 1);
    geometry.rotateX(-Math.PI * 0.5);
    const material = new THREE.MeshBasicMaterial({
      name: `production-ground-detail:${variant}`,
      color: definition.color,
      transparent: true,
      opacity: definition.opacity,
      depthWrite: false,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      fog: true
    });
    const mesh = new THREE.InstancedMesh(geometry, material, capacityPerVariant);
    mesh.name = `prehistoric-production-ground-detail-${variant}`;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;
    scene.add(mesh);
    return { mesh, capacity: capacityPerVariant };
  });
}

function suppressLegacyGrass(scene) {
  const suppressed = [];
  scene.traverse((object) => {
    if (!object?.isInstancedMesh || !object.material?.isShaderMaterial) return;
    if (!object.material.uniforms?.wind || !object.material.uniforms?.color || !object.material.uniforms?.time) return;
    object.visible = false;
    object.userData.productionGrassSuppressed = true;
    suppressed.push(object);
  });
  return suppressed;
}

export function createThreeProductionGroundLayer(THREE, options = {}) {
  const {
    scene,
    camera,
    grassCapacityPerVariant = 2800,
    groundDetailCapacityPerVariant = 900
  } = options;
  if (!scene || !camera) throw new TypeError("Production ground layer requires scene and camera.");
  const suppressedLegacyGrass = suppressLegacyGrass(scene);
  const grassAtlas = createGrassAtlas(THREE);
  const grassBatches = createGrassBatches(THREE, scene, grassAtlas, grassCapacityPerVariant);
  const detailBatches = createGroundDetailBatches(THREE, scene, groundDetailCapacityPerVariant);
  const patches = new Map();
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  let elapsed = 0;

  const view = {
    enabled: true,
    activePatches: 0,
    treePresentationRetired: true,
    treeAuthority: "object-fidelity-natural-growth",
    barkInstances: 0,
    canopyGroups: 0,
    grassClumps: 0,
    groundDetails: 0,
    suppressedLegacyGrass: suppressedLegacyGrass.length,
    overflow: 0
  };

  function activatePatch(patch) {
    const production = { grass: [], details: [] };
    for (const layer of patch.grass ?? []) {
      for (const descriptor of layer) {
        const variant = hashText(descriptor.id) % GRASS_VARIANT_COUNT;
        const grassMatrix = new THREE.Matrix4().fromArray(descriptor.matrix);
        grassMatrix.decompose(position, quaternion, scale);
        scale.x *= 1.65;
        scale.y *= 1.12;
        scale.z *= 1.65;
        grassMatrix.compose(position, quaternion, scale);
        production.grass.push({ id: descriptor.id, variant, matrix: grassMatrix.toArray(), center: position.toArray() });
        if (hashText(descriptor.id) % 11 === 0) {
          const detailVariant = hashText(`${descriptor.id}:detail`) % DETAIL_VARIANT_COUNT;
          const detailScale = 0.9 + unit(descriptor.id, "detail-scale") * 2.2;
          const detailPosition = new THREE.Vector3(position.x, position.y + 0.018, position.z);
          const detailQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, unit(descriptor.id, "detail-yaw") * Math.PI * 2, 0));
          production.details.push({
            id: `${descriptor.id}:detail`,
            variant: detailVariant,
            matrix: new THREE.Matrix4().compose(detailPosition, detailQuaternion, new THREE.Vector3(detailScale, detailScale, detailScale)).toArray(),
            center: detailPosition.toArray()
          });
        }
      }
    }
    patches.set(patch.id, production);
    view.activePatches = patches.size;
  }

  function releasePatches(ids = []) {
    for (const id of ids) patches.delete(id);
    view.activePatches = patches.size;
  }

  function update(_state, deltaTime = 1 / 60) {
    elapsed += Math.max(0, Number(deltaTime) || 0);
    const grass = Array.from({ length: GRASS_VARIANT_COUNT }, () => []);
    const details = Array.from({ length: DETAIL_VARIANT_COUNT }, () => []);
    for (const production of patches.values()) {
      for (const record of production.grass) {
        if (camera.position.distanceTo(position.set(...record.center)) <= 125) grass[record.variant].push(record);
      }
      for (const record of production.details) {
        if (camera.position.distanceTo(position.set(...record.center)) <= 62) details[record.variant].push(record);
      }
    }

    let overflow = 0;
    let grassCount = 0;
    grassBatches.forEach((batch, variant) => {
      const records = grass[variant];
      const count = Math.min(batch.capacity, records.length);
      for (let index = 0; index < count; index += 1) batch.mesh.setMatrixAt(index, matrix.fromArray(records[index].matrix));
      batch.mesh.count = count;
      batch.mesh.instanceMatrix.needsUpdate = true;
      batch.mesh.material.userData.productionUniforms.productionTime.value = elapsed;
      grassCount += count;
      overflow += Math.max(0, records.length - count);
    });

    let detailCount = 0;
    detailBatches.forEach((batch, variant) => {
      const records = details[variant];
      const count = Math.min(batch.capacity, records.length);
      for (let index = 0; index < count; index += 1) batch.mesh.setMatrixAt(index, matrix.fromArray(records[index].matrix));
      batch.mesh.count = count;
      batch.mesh.instanceMatrix.needsUpdate = true;
      detailCount += count;
      overflow += Math.max(0, records.length - count);
    });

    view.grassClumps = grassCount;
    view.groundDetails = detailCount;
    view.overflow = overflow;
    return view;
  }

  function dispose() {
    patches.clear();
    for (const mesh of suppressedLegacyGrass) {
      mesh.visible = true;
      delete mesh.userData.productionGrassSuppressed;
    }
    for (const batch of grassBatches) {
      scene.remove(batch.mesh);
      batch.mesh.geometry.dispose();
      batch.mesh.material.map?.dispose?.();
      batch.mesh.material.dispose();
    }
    for (const batch of detailBatches) {
      scene.remove(batch.mesh);
      batch.mesh.geometry.dispose();
      batch.mesh.material.dispose();
    }
    grassAtlas.dispose();
  }

  return Object.freeze({ view, activatePatch, releasePatches, update, dispose });
}

export default createThreeProductionGroundLayer;
