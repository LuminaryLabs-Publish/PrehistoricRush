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

function grassGeometry(THREE) {
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let blade = 0; blade < 9; blade += 1) {
    const angle = blade / 9 * Math.PI * 2 + (blade % 3) * 0.21;
    const radius = 0.08 + (blade % 4) * 0.055;
    const width = 0.055 + (blade % 3) * 0.012;
    const height = 0.58 + (blade % 5) * 0.1;
    const base = positions.length / 3;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const sideX = Math.cos(angle + Math.PI * 0.5) * width;
    const sideZ = Math.sin(angle + Math.PI * 0.5) * width;
    positions.push(x - sideX, 0, z - sideZ, x + sideX, 0, z + sideZ, x + Math.sin(angle) * 0.12, height, z + Math.cos(angle) * 0.12);
    uvs.push(0, 0, 1, 0, 0.5, 1);
    indices.push(base, base + 1, base + 2);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}

function fernGeometry(THREE) {
  const positions = [];
  const colors = [];
  const indices = [];
  for (let frond = 0; frond < 7; frond += 1) {
    const angle = frond / 7 * Math.PI * 2;
    for (let segment = 0; segment < 4; segment += 1) {
      const t0 = segment / 4;
      const t1 = (segment + 1) / 4;
      const width0 = (1 - t0) * 0.2 + 0.035;
      const width1 = (1 - t1) * 0.2 + 0.02;
      const radius0 = t0 * 0.72;
      const radius1 = t1 * 0.72;
      const y0 = Math.sin(t0 * Math.PI * 0.72) * 0.34;
      const y1 = Math.sin(t1 * Math.PI * 0.72) * 0.34;
      const sideX = Math.cos(angle + Math.PI * 0.5);
      const sideZ = Math.sin(angle + Math.PI * 0.5);
      const base = positions.length / 3;
      positions.push(
        Math.cos(angle) * radius0 - sideX * width0, y0, Math.sin(angle) * radius0 - sideZ * width0,
        Math.cos(angle) * radius0 + sideX * width0, y0, Math.sin(angle) * radius0 + sideZ * width0,
        Math.cos(angle) * radius1 - sideX * width1, y1, Math.sin(angle) * radius1 - sideZ * width1,
        Math.cos(angle) * radius1 + sideX * width1, y1, Math.sin(angle) * radius1 + sideZ * width1
      );
      for (let vertex = 0; vertex < 4; vertex += 1) colors.push(0.54 + t1 * 0.18, 0.84 + t1 * 0.12, 0.42 + t1 * 0.08);
      indices.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function patchVegetationMaterial(material, cacheKey) {
  const uniforms = { vegetationTime: { value: 0 }, vegetationSpeed: { value: 0 } };
  material.userData.cinematicVegetationUniforms = uniforms;
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float vegetationTime;\nuniform float vegetationSpeed;\nvarying float vCinematicHeight;\nvarying float vCinematicDistance;")
      .replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);
vCinematicHeight = clamp(position.y, 0.0, 1.0);
float cinematicPhase = instanceMatrix[3].x * 0.071 + instanceMatrix[3].z * 0.053;
float cinematicSway = sin(vegetationTime * (1.28 + vegetationSpeed * 1.4) + cinematicPhase) * (0.075 + vegetationSpeed * 0.018) * vCinematicHeight * vCinematicHeight;
transformed.x += cinematicSway;
transformed.z += cinematicSway * 0.38;
vec4 cinematicWorld = modelMatrix * instanceMatrix * vec4(transformed, 1.0);
vCinematicDistance = distance(cameraPosition, cinematicWorld.xyz);`
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vCinematicHeight;\nvarying float vCinematicDistance;")
      .replace(
        "vec3 totalEmissiveRadiance = emissive;",
        "vec3 cinematicTransmission = diffuse * vec3(1.06, 1.22, 0.72) * vCinematicHeight * 0.12 * (1.0 - smoothstep(65.0, 120.0, vCinematicDistance));\nvec3 totalEmissiveRadiance = emissive + cinematicTransmission;"
      );
  };
  material.customProgramCacheKey = () => cacheKey;
  return material;
}

function createBatches(THREE, scene, profile) {
  const vegetationParameters = {
    vertexColors: true,
    roughness: 0.88,
    metalness: 0,
    side: THREE.DoubleSide,
    fog: true
  };
  const grass = new THREE.InstancedMesh(
    grassGeometry(THREE),
    patchVegetationMaterial(new THREE.MeshPhysicalMaterial({ ...vegetationParameters, color: 0x5f9a42, sheen: 0.08, sheenRoughness: 0.78 }), "prehistoric-cinematic-grass-v1"),
    Math.ceil(6200 * profile.groundDensity)
  );
  const ferns = new THREE.InstancedMesh(
    fernGeometry(THREE),
    patchVegetationMaterial(new THREE.MeshPhysicalMaterial({ ...vegetationParameters, color: 0x4f8e42, sheen: 0.12, sheenRoughness: 0.72 }), "prehistoric-cinematic-ferns-v1"),
    Math.ceil(1500 * profile.groundDensity)
  );
  const rocks = new THREE.InstancedMesh(
    new THREE.DodecahedronGeometry(0.55, 0),
    new THREE.MeshStandardMaterial({ color: 0x596056, roughness: 0.96, metalness: 0, vertexColors: true, fog: true }),
    Math.ceil(520 * profile.groundDensity)
  );
  const litterGeometry = new THREE.CircleGeometry(0.3, 5);
  litterGeometry.rotateX(-Math.PI * 0.5);
  const litter = new THREE.InstancedMesh(
    litterGeometry,
    new THREE.MeshStandardMaterial({ color: 0x6f5b32, roughness: 1, metalness: 0, vertexColors: true, side: THREE.DoubleSide, fog: true }),
    Math.ceil(1900 * profile.groundDensity)
  );
  const flowers = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(0.09, 0),
    new THREE.MeshPhysicalMaterial({ color: 0xffe6a2, roughness: 0.72, metalness: 0, emissive: 0x3b2e14, emissiveIntensity: 0.16, vertexColors: true, fog: true }),
    Math.ceil(420 * profile.groundDensity)
  );
  const roots = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.08, 0.15, 1, 6, 1),
    new THREE.MeshStandardMaterial({ color: 0x493421, roughness: 0.95, metalness: 0, vertexColors: true, fog: true }),
    Math.ceil(380 * profile.groundDensity)
  );
  for (const [name, mesh] of Object.entries({ grass, ferns, rocks, litter, flowers, roots })) {
    mesh.name = `prehistoric-cinematic-${name}`;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = name === "rocks" || name === "roots";
    mesh.receiveShadow = name !== "flowers";
    mesh.frustumCulled = false;
    scene.add(mesh);
  }
  return { grass, ferns, rocks, litter, flowers, roots };
}

export function createThreeCinematicGroundLayer(THREE, options = {}) {
  const { scene, camera, profile } = options;
  if (!scene || !camera || !profile) throw new TypeError("Cinematic ground layer requires scene, camera, and quality profile.");
  const batches = createBatches(THREE, scene, profile);
  const patches = new Map();
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  const color = new THREE.Color();
  let elapsed = 0;
  let recordsDirty = true;
  let combinedRecords = { grass: [], ferns: [], rocks: [], litter: [], flowers: [], roots: [] };
  let visibilityCell = "";
  const view = { activePatches: 0, grass: 0, ferns: 0, rocks: 0, litter: 0, flowers: 0, roots: 0, overflow: 0, speed01: 0, instanceRebuilds: 0 };

  function pushRecord(records, kind, seed, sourceMatrix) {
    matrix.fromArray(sourceMatrix);
    matrix.decompose(position, quaternion, scale);
    const yaw = unit(seed, "yaw") * Math.PI * 2;
    quaternion.setFromEuler(new THREE.Euler(kind === "roots" ? Math.PI * 0.5 : 0, yaw, kind === "roots" ? 0.18 : 0));
    const scalar = kind === "grass" ? 0.72 + unit(seed, "scale") * 0.95
      : kind === "ferns" ? 0.65 + unit(seed, "scale") * 1.25
      : kind === "rocks" ? 0.34 + unit(seed, "scale") * 1.05
      : kind === "litter" ? 0.45 + unit(seed, "scale") * 1.25
      : kind === "flowers" ? 0.72 + unit(seed, "scale") * 0.55
      : 0.75 + unit(seed, "scale") * 1.7;
    if (kind === "flowers") position.y += 0.34 + unit(seed, "height") * 0.42;
    else if (kind === "litter") position.y += 0.018;
    else if (kind === "roots") position.y += 0.07;
    scale.set(scalar, kind === "roots" ? scalar * 1.8 : scalar, scalar);
    records[kind].push({ seed, distanceCenter: position.toArray(), matrix: new THREE.Matrix4().compose(position, quaternion, scale).toArray() });
  }

  function buildPatchRecords(patch) {
    const records = { grass: [], ferns: [], rocks: [], litter: [], flowers: [], roots: [] };
    for (const source of patch.grass ?? []) {
      pushRecord(records, "grass", source.id, source.matrix);
      const token = hashText(source.id);
      if (token % 4 === 0) pushRecord(records, "litter", `${source.id}:litter`, source.matrix);
      if (token % 7 === 0) pushRecord(records, "ferns", `${source.id}:fern`, source.matrix);
      if (token % 17 === 0) pushRecord(records, "flowers", `${source.id}:flower`, source.matrix);
      if (token % 23 === 0) pushRecord(records, "rocks", `${source.id}:rock`, source.matrix);
      if (token % 31 === 0) pushRecord(records, "roots", `${source.id}:root`, source.matrix);
    }
    return records;
  }

  function activatePatch(patch) {
    patches.set(patch.id, buildPatchRecords(patch));
    view.activePatches = patches.size;
    recordsDirty = true;
  }

  function releasePatches(ids = []) {
    for (const id of ids) patches.delete(id);
    view.activePatches = patches.size;
    recordsDirty = true;
  }

  function rebuild() {
    if (!recordsDirty) return combinedRecords;
    const records = { grass: [], ferns: [], rocks: [], litter: [], flowers: [], roots: [] };
    for (const patchRecords of patches.values()) {
      for (const kind of Object.keys(records)) records[kind].push(...patchRecords[kind]);
    }
    combinedRecords = records;
    recordsDirty = false;
    return combinedRecords;
  }

  function update(state = {}, deltaTime = 1 / 60) {
    elapsed += Math.max(0, Number(deltaTime) || 0);
    const patchRecordsChanged = recordsDirty;
    const records = rebuild();
    const speed01 = Math.min(1, Math.max(0, Number(state.speed01) || 0));
    view.speed01 = speed01;
    const nextVisibilityCell = `${Math.floor(camera.position.x / 24)}:${Math.floor(camera.position.z / 24)}`;
    const rebuildInstances = nextVisibilityCell !== visibilityCell || patchRecordsChanged || view.instanceRebuilds === 0;
    if (rebuildInstances) {
      visibilityCell = nextVisibilityCell;
      view.overflow = 0;
      view.instanceRebuilds += 1;
    }
    for (const [kind, mesh] of Object.entries(batches)) {
      if (rebuildInstances) {
        const distanceLimit = kind === "grass" || kind === "litter" ? 112 : 138;
        const visible = records[kind].filter((record) => camera.position.distanceToSquared(position.set(...record.distanceCenter)) <= distanceLimit * distanceLimit);
        const capacity = mesh.instanceMatrix.count;
        const count = Math.min(capacity, visible.length);
        for (let index = 0; index < count; index += 1) {
          const record = visible[index];
          mesh.setMatrixAt(index, matrix.fromArray(record.matrix));
          const hue = unit(record.seed, "hue");
          if (kind === "grass") color.setHSL(0.25 + hue * 0.07, 0.42, 0.32 + hue * 0.14);
          else if (kind === "ferns") color.setHSL(0.29 + hue * 0.05, 0.46, 0.29 + hue * 0.12);
          else if (kind === "flowers") color.setHSL(0.08 + hue * 0.12, 0.72, 0.7);
          else if (kind === "rocks") color.setHSL(0.25 + hue * 0.05, 0.1, 0.28 + hue * 0.16);
          else if (kind === "roots") color.setHSL(0.08, 0.35, 0.2 + hue * 0.08);
          else color.setHSL(0.1 + hue * 0.06, 0.34, 0.2 + hue * 0.12);
          mesh.setColorAt(index, color);
        }
        mesh.count = count;
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        view[kind] = count;
        view.overflow += Math.max(0, visible.length - count);
      }
      const uniforms = mesh.material.userData.cinematicVegetationUniforms;
      if (uniforms) {
        uniforms.vegetationTime.value = elapsed;
        uniforms.vegetationSpeed.value = speed01;
      }
    }
    return view;
  }

  function dispose() {
    patches.clear();
    for (const mesh of Object.values(batches)) {
      scene.remove(mesh);
      mesh.geometry.dispose();
      mesh.material.dispose();
    }
  }

  function setVisible(visible) {
    for (const mesh of Object.values(batches)) mesh.visible = Boolean(visible);
    return Boolean(visible);
  }

  return Object.freeze({ view, activatePatch, releasePatches, update, setVisible, dispose });
}

export default createThreeCinematicGroundLayer;
