import {
  PREHISTORIC_FOLIAGE_CARD_FAMILIES,
  foliageFamilyIdForArchetype,
  getPrehistoricFoliageCardFamily
} from "../shared/prehistoric-foliage-card-recipes.js";
import { PREHISTORIC_TREE_ARCHETYPES } from "../shared/tree-archetype-catalog.js";

const GRASS_VARIANT_COUNT = 6;
const DETAIL_VARIANT_COUNT = 4;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function smoothstep(minimum, maximum, value) {
  const t = clamp((value - minimum) / Math.max(0.0001, maximum - minimum), 0, 1);
  return t * t * (3 - 2 * t);
}

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
    size: [max[0] - min[0], max[1] - min[1], max[2] - min[2]]
  };
}

function productionRecipe(archetype) {
  const token = `${archetype.shape}:${archetype.id}`;
  if (/palm|cycad|fern/.test(token)) {
    return { role: /tall-palm/.test(token) ? "emergent" : "understory", primary: 0, secondary: 0, canopyGroups: 4, branchStart: 0.78, spread: 0.45, rise: 0.12 };
  }
  if (/spire|araucaria/.test(token)) {
    return { role: "emergent", primary: 6, secondary: 1, canopyGroups: 5, branchStart: 0.42, spread: 0.78, rise: 0.04 };
  }
  if (/ghostwood/.test(token)) {
    return { role: "sparse", primary: 3, secondary: 2, canopyGroups: 3, branchStart: 0.5, spread: 0.78, rise: 0.2 };
  }
  if (/umbrella|ginkgo/.test(token)) {
    return { role: "canopy", primary: 5, secondary: 2, canopyGroups: 6, branchStart: 0.54, spread: 0.88, rise: 0.24 };
  }
  return { role: "canopy", primary: 4, secondary: 2, canopyGroups: 5, branchStart: 0.52, spread: 0.68, rise: 0.16 };
}

function addInstanceAttributes(THREE, geometry, capacity, names) {
  for (const [name, size, fill] of names) {
    geometry.setAttribute(name, new THREE.InstancedBufferAttribute(new Float32Array(capacity * size).fill(fill), size));
  }
  return geometry;
}

function patchBarkMaterial(material) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute vec3 productionTint;\nattribute vec4 productionBark;\nvarying vec3 vProductionTint;\nvarying vec4 vProductionBark;\nvarying vec2 vProductionUv;"
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvProductionTint = productionTint;\nvProductionBark = productionBark;\nvProductionUv = uv;"
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vProductionTint;\nvarying vec4 vProductionBark;\nvarying vec2 vProductionUv;"
      )
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        `float verticalGrain = sin(vProductionUv.x * 52.0 + vProductionUv.y * 9.0 + vProductionBark.x * 6.28318) * 0.5 + 0.5;
float broadGrain = sin(vProductionUv.y * 18.0 + vProductionUv.x * 11.0) * 0.5 + 0.5;
float moss = (1.0 - smoothstep(0.02, 0.34, vProductionUv.y)) * vProductionBark.y;
vec3 barkColor = vProductionTint * mix(0.72, 1.13, verticalGrain * 0.58 + broadGrain * 0.42);
barkColor = mix(barkColor, barkColor * vec3(0.52, 0.88, 0.5), moss);
vec4 diffuseColor = vec4(barkColor, opacity);`
      );
  };
  material.customProgramCacheKey = () => "prehistoric-production-bark-v1";
  return material;
}

function patchCanopyMaterial(material, family) {
  const uniforms = { productionTime: { value: 0 } };
  material.userData.productionUniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nattribute vec3 productionTint;\nattribute vec4 productionFoliage;\nuniform float productionTime;\nvarying vec3 vProductionTint;\nvarying float vProductionFade;\nvarying float vProductionLight;"
      )
      .replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);
vProductionTint = productionTint;
vProductionFade = productionFoliage.x;
vProductionLight = productionFoliage.y;
float swayWeight = uv.y * uv.y;
float sway = sin(productionTime * productionFoliage.w + productionFoliage.z + instanceMatrix[3].x * 0.021 + instanceMatrix[3].z * 0.017) * ${Number(family.wind.amplitude).toFixed(4)} * swayWeight;
transformed.x += sway;
transformed.z += sway * 0.35;`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vProductionTint;\nvarying float vProductionFade;\nvarying float vProductionLight;\nfloat productionHash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}"
      )
      .replace(
        "vec4 diffuseColor = vec4( diffuse, opacity );",
        "vec4 diffuseColor = vec4(diffuse * vProductionTint * mix(0.78, 1.18, vProductionLight), opacity);"
      )
      .replace(
        "#include <clipping_planes_fragment>",
        "#include <clipping_planes_fragment>\nif (productionHash(gl_FragCoord.xy) > clamp(vProductionFade, 0.0, 1.0)) discard;"
      );
  };
  material.customProgramCacheKey = () => `prehistoric-production-canopy-${family.id}-v1`;
  return material;
}

function createBarkBatch(THREE, scene, capacity) {
  const geometry = addInstanceAttributes(
    THREE,
    new THREE.CylinderGeometry(0.58, 1, 1, 8, 3, false),
    capacity,
    [["productionTint", 3, 1], ["productionBark", 4, 0]]
  );
  const material = patchBarkMaterial(new THREE.MeshStandardMaterial({
    name: "production-bark",
    vertexColors: false,
    roughness: 0.86,
    metalness: 0,
    fog: true
  }));
  const mesh = new THREE.InstancedMesh(geometry, material, capacity);
  mesh.name = "prehistoric-production-bark";
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  scene.add(mesh);
  return { mesh, capacity };
}

function crossedCardGeometry(THREE, capacity) {
  const positions = [];
  const uvs = [];
  const indices = [];
  let offset = 0;
  for (let plane = 0; plane < 2; plane += 1) {
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 2);
    geometry.translate(0, 0.5, 0);
    geometry.rotateY(Math.PI * plane * 0.5);
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
  addInstanceAttributes(THREE, output, capacity, [["productionTint", 3, 1], ["productionFoliage", 4, 0]]);
  return output;
}

function createCanopyBatch(THREE, scene, atlas, family, capacity) {
  const geometry = crossedCardGeometry(THREE, capacity);
  const material = patchCanopyMaterial(new THREE.MeshStandardMaterial({
    name: `production-canopy:${family.id}`,
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
    emissiveIntensity: family.translucency * 0.34,
    fog: true
  }), family);
  const mesh = new THREE.InstancedMesh(geometry, material, capacity);
  mesh.name = `prehistoric-production-canopy-${family.id}`;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.frustumCulled = false;
  scene.add(mesh);
  return { mesh, family, capacity };
}

function canvasFor(width, height) {
  if (typeof OffscreenCanvas === "function") return new OffscreenCanvas(width, height);
  const canvas = globalThis.document?.createElement?.("canvas");
  if (!canvas) throw new Error("Production forest layer requires a canvas-capable browser.");
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
  texture.name = "prehistoric-production-grass-atlas-v1";
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
  material.customProgramCacheKey = () => "prehistoric-production-grass-v1";
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

function matrixBetween(THREE, start, end, radiusStart, radiusEnd = radiusStart) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const length = Math.max(0.001, direction.length());
  const position = startVector.clone().add(endVector).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  const scale = new THREE.Vector3(radiusStart, length, radiusStart);
  return new THREE.Matrix4().compose(position, quaternion, scale).toArray();
}

function rotateLocal(x, z, yaw) {
  const cosine = Math.cos(yaw);
  const sine = Math.sin(yaw);
  return [x * cosine + z * sine, -x * sine + z * cosine];
}

function createTreeProductionRecords(THREE, treeId, record, archetype) {
  const bounds = combineBounds(record.trunk, record.crown);
  const variation = record.trunk.metadata?.variation ?? {};
  const ground = variation.groundPosition ?? [bounds.center[0], bounds.min[1], bounds.center[2]];
  const yaw = Number(variation.yawRadians ?? Number(variation.yawDegrees ?? 0) * Math.PI / 180);
  const height = record.trunk.bounds.max[1] - record.trunk.bounds.min[1];
  const trunkRadius = Math.max(0.15, (record.trunk.bounds.max[0] - record.trunk.bounds.min[0]) * 0.5);
  const crownRadius = Math.max(
    (record.crown.bounds.max[0] - record.crown.bounds.min[0]) * 0.5,
    (record.crown.bounds.max[2] - record.crown.bounds.min[2]) * 0.5
  );
  const crownHeight = record.crown.bounds.max[1] - record.crown.bounds.min[1];
  const recipe = productionRecipe(archetype);
  const barkColor = new THREE.Color(archetype.barkColor);
  const variationTint = variation.tint ?? [1, 1, 1];
  const barkTint = [
    barkColor.r * Number(variationTint[0] ?? 1),
    barkColor.g * Number(variationTint[1] ?? 1),
    barkColor.b * Number(variationTint[2] ?? 1)
  ];

  const trunkMatrix = new THREE.Matrix4().fromArray(record.trunk.matrix);
  const trunkPosition = new THREE.Vector3();
  const trunkQuaternion = new THREE.Quaternion();
  const trunkScale = new THREE.Vector3();
  trunkMatrix.decompose(trunkPosition, trunkQuaternion, trunkScale);
  trunkScale.x *= 1.035;
  trunkScale.z *= 1.035;
  trunkMatrix.compose(trunkPosition, trunkQuaternion, trunkScale);

  const wood = [{
    id: `${treeId}:bark-shell`,
    center: bounds.center,
    matrix: trunkMatrix.toArray(),
    tint: barkTint,
    bark: [unit(treeId, "grain"), clamp(0.18 + unit(treeId, "moss") * 0.42, 0, 0.62), 0, 0]
  }];

  for (let root = 0; root < 4; root += 1) {
    const angle = yaw + root / 4 * Math.PI * 2 + unit(treeId, `root-angle:${root}`) * 0.22;
    const length = trunkRadius * (1.8 + unit(treeId, `root-length:${root}`) * 1.4);
    wood.push({
      id: `${treeId}:root:${root}`,
      center: ground,
      matrix: matrixBetween(
        THREE,
        [ground[0], ground[1] + 0.12, ground[2]],
        [ground[0] + Math.sin(angle) * length, ground[1] + 0.05, ground[2] + Math.cos(angle) * length],
        trunkRadius * 0.38,
        trunkRadius * 0.08
      ),
      tint: barkTint,
      bark: [unit(treeId, `root-grain:${root}`), 0.52, 0, 0]
    });
  }

  const branchEnds = [];
  for (let primary = 0; primary < recipe.primary; primary += 1) {
    const angle = yaw + primary / Math.max(1, recipe.primary) * Math.PI * 2 + unit(treeId, `primary-angle:${primary}`) * 0.42;
    const startY = ground[1] + height * (recipe.branchStart + primary / Math.max(1, recipe.primary) * 0.08);
    const spread = crownRadius * recipe.spread * (0.72 + unit(treeId, `primary-spread:${primary}`) * 0.4);
    const start = [ground[0], startY, ground[2]];
    const end = [
      ground[0] + Math.sin(angle) * spread,
      startY + crownHeight * (recipe.rise + unit(treeId, `primary-rise:${primary}`) * 0.16),
      ground[2] + Math.cos(angle) * spread
    ];
    wood.push({
      id: `${treeId}:primary:${primary}`,
      center: end,
      matrix: matrixBetween(THREE, start, end, trunkRadius * 0.3, trunkRadius * 0.1),
      tint: barkTint,
      bark: [unit(treeId, `primary-grain:${primary}`), 0.08, 0, 0]
    });
    branchEnds.push(end);

    for (let secondary = 0; secondary < recipe.secondary; secondary += 1) {
      const side = secondary % 2 === 0 ? -1 : 1;
      const secondaryAngle = angle + side * (0.38 + unit(treeId, `secondary-angle:${primary}:${secondary}`) * 0.38);
      const startSecondary = [
        start[0] + (end[0] - start[0]) * 0.58,
        start[1] + (end[1] - start[1]) * 0.58,
        start[2] + (end[2] - start[2]) * 0.58
      ];
      const secondaryLength = spread * (0.34 + unit(treeId, `secondary-length:${primary}:${secondary}`) * 0.2);
      const endSecondary = [
        startSecondary[0] + Math.sin(secondaryAngle) * secondaryLength,
        startSecondary[1] + crownHeight * (0.05 + unit(treeId, `secondary-rise:${primary}:${secondary}`) * 0.12),
        startSecondary[2] + Math.cos(secondaryAngle) * secondaryLength
      ];
      wood.push({
        id: `${treeId}:secondary:${primary}:${secondary}`,
        center: endSecondary,
        matrix: matrixBetween(THREE, startSecondary, endSecondary, trunkRadius * 0.13, trunkRadius * 0.045),
        tint: barkTint,
        bark: [unit(treeId, `secondary-grain:${primary}:${secondary}`), 0.03, 0, 0]
      });
      branchEnds.push(endSecondary);
    }
  }

  const familyId = foliageFamilyIdForArchetype(archetype);
  const family = getPrehistoricFoliageCardFamily(familyId);
  const foliageBase = new THREE.Color(archetype.foliageColor);
  const foliageAccent = new THREE.Color(archetype.accentColor ?? archetype.foliageColor);
  const canopy = [];
  const groupCount = recipe.canopyGroups;
  for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
    const branchEnd = branchEnds[groupIndex % Math.max(1, branchEnds.length)];
    const angle = yaw + groupIndex / groupCount * Math.PI * 2 + unit(treeId, `canopy-angle:${groupIndex}`) * 0.38;
    const shell = 0.3 + (groupIndex / Math.max(1, groupCount - 1)) * 0.58;
    const localRadius = crownRadius * shell * (0.72 + unit(treeId, `canopy-radius:${groupIndex}`) * 0.24);
    const [offsetX, offsetZ] = rotateLocal(Math.sin(angle) * localRadius, Math.cos(angle) * localRadius, yaw * 0.12);
    const center = branchEnd ?? [
      bounds.center[0] + offsetX,
      record.crown.bounds.min[1] + crownHeight * (0.38 + unit(treeId, `canopy-height:${groupIndex}`) * 0.48),
      bounds.center[2] + offsetZ
    ];
    const edge = groupIndex >= Math.ceil(groupCount * 0.45);
    const tintColor = foliageBase.clone().lerp(foliageAccent, edge ? 0.5 : 0.12);
    const light = edge ? 0.72 + unit(treeId, `edge-light:${groupIndex}`) * 0.28 : 0.08 + unit(treeId, `inner-light:${groupIndex}`) * 0.2;
    const position = new THREE.Vector3(
      center[0] + (unit(treeId, `canopy-x:${groupIndex}`) - 0.5) * crownRadius * 0.22,
      center[1] + (unit(treeId, `canopy-y:${groupIndex}`) - 0.5) * crownHeight * 0.18,
      center[2] + (unit(treeId, `canopy-z:${groupIndex}`) - 0.5) * crownRadius * 0.22
    );
    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(
      (unit(treeId, `canopy-pitch:${groupIndex}`) - 0.5) * 0.28,
      angle,
      (unit(treeId, `canopy-roll:${groupIndex}`) - 0.5) * 0.3,
      "YXZ"
    ));
    const scale = new THREE.Vector3(
      crownRadius * (0.48 + unit(treeId, `canopy-width:${groupIndex}`) * 0.24),
      crownHeight * (0.42 + unit(treeId, `canopy-height-scale:${groupIndex}`) * 0.24),
      1
    );
    canopy.push({
      id: `${treeId}:canopy-group:${groupIndex}`,
      familyId: family?.id ?? familyId,
      center: position.toArray(),
      matrix: new THREE.Matrix4().compose(position, quaternion, scale).toArray(),
      tint: [
        tintColor.r * Number(variationTint[0] ?? 1),
        tintColor.g * Number(variationTint[1] ?? 1),
        tintColor.b * Number(variationTint[2] ?? 1)
      ],
      light,
      phase: unit(treeId, `canopy-phase:${groupIndex}`) * Math.PI * 2,
      frequency: family?.wind?.frequency ?? 0.72
    });
  }

  return { wood, canopy };
}

export function createThreeProductionForestLayer(THREE, options = {}) {
  const {
    scene,
    camera,
    atlas,
    barkCapacity = 9000,
    canopyCapacityPerFamily = 2600,
    grassCapacityPerVariant = 2800,
    groundDetailCapacityPerVariant = 900
  } = options;
  if (!scene || !camera || !atlas) throw new TypeError("Production forest layer requires scene, camera, and foliage atlas.");

  const suppressedLegacyGrass = suppressLegacyGrass(scene);
  const barkBatch = createBarkBatch(THREE, scene, barkCapacity);
  const canopyBatches = new Map(PREHISTORIC_FOLIAGE_CARD_FAMILIES.map((family) => [family.id, createCanopyBatch(THREE, scene, atlas, family, canopyCapacityPerFamily)]));
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
    barkInstances: 0,
    canopyGroups: 0,
    grassClumps: 0,
    groundDetails: 0,
    suppressedLegacyGrass: suppressedLegacyGrass.length,
    overflow: 0
  };

  function activatePatch(patch) {
    const production = { wood: [], canopy: [], grass: [], details: [] };
    patch.trees.forEach((treeSet, typeIndex) => {
      const archetype = PREHISTORIC_TREE_ARCHETYPES[typeIndex];
      if (!archetype) return;
      const count = Math.min(treeSet.trunks.length, treeSet.crowns.length);
      for (let index = 0; index < count; index += 1) {
        const trunk = treeSet.trunks[index];
        const crown = treeSet.crowns[index];
        const treeId = trunk.metadata?.treeId ?? trunk.id;
        const records = createTreeProductionRecords(THREE, treeId, { trunk, crown }, archetype);
        production.wood.push(...records.wood);
        production.canopy.push(...records.canopy);
      }
    });

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
    const wood = [];
    const canopy = new Map(PREHISTORIC_FOLIAGE_CARD_FAMILIES.map((family) => [family.id, []]));
    const grass = Array.from({ length: GRASS_VARIANT_COUNT }, () => []);
    const details = Array.from({ length: DETAIL_VARIANT_COUNT }, () => []);

    for (const production of patches.values()) {
      for (const record of production.wood) {
        const distance = camera.position.distanceTo(position.set(...record.center));
        if (distance <= 118) wood.push(record);
      }
      for (const record of production.canopy) {
        const distance = camera.position.distanceTo(position.set(...record.center));
        const fade = 1 - smoothstep(82, 126, distance);
        if (fade > 0.01) canopy.get(record.familyId)?.push({ ...record, fade });
      }
      for (const record of production.grass) {
        const distance = camera.position.distanceTo(position.set(...record.center));
        if (distance <= 125) grass[record.variant].push(record);
      }
      for (const record of production.details) {
        const distance = camera.position.distanceTo(position.set(...record.center));
        if (distance <= 62) details[record.variant].push(record);
      }
    }

    const barkTint = barkBatch.mesh.geometry.getAttribute("productionTint");
    const barkValues = barkBatch.mesh.geometry.getAttribute("productionBark");
    const barkCount = Math.min(barkBatch.capacity, wood.length);
    for (let index = 0; index < barkCount; index += 1) {
      const record = wood[index];
      barkBatch.mesh.setMatrixAt(index, matrix.fromArray(record.matrix));
      barkTint.setXYZ(index, record.tint[0], record.tint[1], record.tint[2]);
      barkValues.setXYZW(index, record.bark[0], record.bark[1], record.bark[2], record.bark[3]);
    }
    barkBatch.mesh.count = barkCount;
    barkBatch.mesh.instanceMatrix.needsUpdate = true;
    barkTint.needsUpdate = true;
    barkValues.needsUpdate = true;

    let canopyCount = 0;
    let overflow = Math.max(0, wood.length - barkCount);
    for (const [familyId, batch] of canopyBatches) {
      const records = canopy.get(familyId);
      const count = Math.min(batch.capacity, records.length);
      const tint = batch.mesh.geometry.getAttribute("productionTint");
      const values = batch.mesh.geometry.getAttribute("productionFoliage");
      for (let index = 0; index < count; index += 1) {
        const record = records[index];
        batch.mesh.setMatrixAt(index, matrix.fromArray(record.matrix));
        tint.setXYZ(index, record.tint[0], record.tint[1], record.tint[2]);
        values.setXYZW(index, record.fade, record.light, record.phase, record.frequency);
      }
      batch.mesh.count = count;
      batch.mesh.instanceMatrix.needsUpdate = true;
      tint.needsUpdate = true;
      values.needsUpdate = true;
      batch.mesh.material.userData.productionUniforms.productionTime.value = elapsed;
      canopyCount += count;
      overflow += Math.max(0, records.length - count);
    }

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

    view.barkInstances = barkCount;
    view.canopyGroups = canopyCount;
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
    scene.remove(barkBatch.mesh);
    barkBatch.mesh.geometry.dispose();
    barkBatch.mesh.material.dispose();
    for (const batch of canopyBatches.values()) {
      scene.remove(batch.mesh);
      batch.mesh.geometry.dispose();
      batch.mesh.material.map?.dispose?.();
      batch.mesh.material.dispose();
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

export default createThreeProductionForestLayer;
