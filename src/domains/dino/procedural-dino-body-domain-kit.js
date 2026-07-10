export function createProceduralDinoBodyDomainKit(config = {}) {
  const profile = {
    id: config.id ?? "forest-raptor",
    version: "procedural-dino-body-v1",
    topology: {
      radialSegments: config.radialSegments ?? 10,
      torsoStations: 8,
      tailSegments: 7,
      limbSegments: 2,
      triangulated: true,
      singleSkinnedSurface: true
    },
    proportions: {
      bodyLength: config.bodyLength ?? 1.42,
      hipHeight: config.hipHeight ?? 0.68,
      chestHeight: config.chestHeight ?? 0.86,
      headHeight: config.headHeight ?? 1.06,
      headForward: config.headForward ?? 1.02,
      tailLength: config.tailLength ?? 1.8,
      legLength: config.legLength ?? 0.78,
      armLength: config.armLength ?? 0.44,
      bodyScale: config.bodyScale ?? 0.82
    },
    material: {
      skin: config.skin ?? 0x78ad52,
      underbelly: config.underbelly ?? 0xb8a15d,
      roughness: config.roughness ?? 0.8,
      metalness: 0
    },
    animation: {
      strideSwing: config.strideSwing ?? 0.86,
      hipBob: config.hipBob ?? 0.075,
      tailFollow: config.tailFollow ?? 0.1,
      headCounter: config.headCounter ?? 0.08,
      turnLean: config.turnLean ?? 0.1
    }
  };

  const clone = (value) => typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));

  function createSkinnedBody(THREE) {
    const bones = {};
    const orderedBones = [];
    const addBone = (name, parent, position) => {
      const bone = new THREE.Bone();
      bone.name = name;
      bone.position.set(...position);
      (parent ?? boneRoot).add(bone);
      bones[name] = bone;
      orderedBones.push(bone);
      return bone;
    };

    const boneRoot = new THREE.Bone();
    boneRoot.name = "dino-root";
    bones.root = boneRoot;
    orderedBones.push(boneRoot);

    const pelvis = addBone("pelvis", boneRoot, [0, 0.66, -0.2]);
    const chest = addBone("chest", pelvis, [0, 0.18, 0.5]);
    const neck = addBone("neck", chest, [0, 0.14, 0.38]);
    const head = addBone("head", neck, [0, 0.08, 0.36]);

    let tailParent = pelvis;
    for (let i = 0; i < profile.topology.tailSegments; i++) {
      tailParent = addBone(`tail-${i}`, tailParent, [0, -0.035, -0.255]);
    }

    for (const side of [-1, 1]) {
      const suffix = side < 0 ? "L" : "R";
      const thigh = addBone(`thigh-${suffix}`, pelvis, [side * 0.28, -0.08, 0.02]);
      const shin = addBone(`shin-${suffix}`, thigh, [side * 0.035, -0.39, 0.1]);
      addBone(`foot-${suffix}`, shin, [-side * 0.015, -0.28, 0.22]);
      const upper = addBone(`upperArm-${suffix}`, chest, [side * 0.27, 0.02, 0.24]);
      addBone(`foreArm-${suffix}`, upper, [side * 0.07, -0.2, 0.18]);
    }

    boneRoot.updateMatrixWorld(true);
    const boneIndex = Object.fromEntries(orderedBones.map((bone, index) => [bone.name, index]));
    const positions = [], normals = [], colors = [], skinIndices = [], skinWeights = [], indices = [];

    const skinColor = new THREE.Color(profile.material.skin);
    const bellyColor = new THREE.Color(profile.material.underbelly);

    function appendTube(stations, radialSegments = profile.topology.radialSegments) {
      const base = positions.length / 3;
      for (let s = 0; s < stations.length; s++) {
        const station = stations[s];
        const next = stations[Math.min(stations.length - 1, s + 1)];
        const prev = stations[Math.max(0, s - 1)];
        const tangent = new THREE.Vector3(next.x - prev.x, next.y - prev.y, next.z - prev.z).normalize();
        const up = Math.abs(tangent.y) > 0.92 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(up, tangent).normalize();
        const binormal = new THREE.Vector3().crossVectors(tangent, right).normalize();
        for (let r = 0; r < radialSegments; r++) {
          const angle = r / radialSegments * Math.PI * 2;
          const ca = Math.cos(angle), sa = Math.sin(angle);
          const rx = station.rx ?? station.radius;
          const ry = station.ry ?? station.radius;
          const offset = right.clone().multiplyScalar(ca * rx).add(binormal.clone().multiplyScalar(sa * ry));
          positions.push(station.x + offset.x, station.y + offset.y, station.z + offset.z);
          normals.push(offset.x / Math.max(rx, 0.001), offset.y / Math.max(ry, 0.001), offset.z / Math.max(rx, 0.001));
          const underside = Math.max(0, -offset.y / Math.max(ry, 0.001));
          const color = skinColor.clone().lerp(bellyColor, underside * (station.belly ?? 0.55));
          colors.push(color.r, color.g, color.b);
          skinIndices.push(station.boneA, station.boneB ?? station.boneA, 0, 0);
          const w = station.weightB ?? 0;
          skinWeights.push(1 - w, w, 0, 0);
        }
      }
      for (let s = 0; s < stations.length - 1; s++) {
        for (let r = 0; r < radialSegments; r++) {
          const a = base + s * radialSegments + r;
          const b = base + s * radialSegments + (r + 1) % radialSegments;
          const c = base + (s + 1) * radialSegments + r;
          const d = base + (s + 1) * radialSegments + (r + 1) % radialSegments;
          indices.push(a, c, b, b, c, d);
        }
      }
    }

    const b = boneIndex;
    appendTube([
      { x: 0, y: 0.64, z: -0.55, rx: 0.22, ry: 0.2, boneA: b.pelvis },
      { x: 0, y: 0.7, z: -0.34, rx: 0.39, ry: 0.31, boneA: b.pelvis },
      { x: 0, y: 0.76, z: -0.08, rx: 0.45, ry: 0.34, boneA: b.pelvis, boneB: b.chest, weightB: 0.2 },
      { x: 0, y: 0.82, z: 0.2, rx: 0.4, ry: 0.31, boneA: b.pelvis, boneB: b.chest, weightB: 0.62 },
      { x: 0, y: 0.88, z: 0.43, rx: 0.31, ry: 0.27, boneA: b.chest },
      { x: 0, y: 0.94, z: 0.62, rx: 0.22, ry: 0.22, boneA: b.chest, boneB: b.neck, weightB: 0.35 },
      { x: 0, y: 1.0, z: 0.78, rx: 0.16, ry: 0.17, boneA: b.neck },
      { x: 0, y: 1.05, z: 0.92, rx: 0.13, ry: 0.14, boneA: b.neck, boneB: b.head, weightB: 0.45 }
    ]);

    appendTube([
      { x: 0, y: 1.04, z: 0.88, rx: 0.24, ry: 0.2, boneA: b.head },
      { x: 0, y: 1.08, z: 1.06, rx: 0.29, ry: 0.23, boneA: b.head },
      { x: 0, y: 1.06, z: 1.27, rx: 0.23, ry: 0.18, boneA: b.head },
      { x: 0, y: 1.03, z: 1.49, rx: 0.16, ry: 0.12, boneA: b.head },
      { x: 0, y: 1.01, z: 1.62, rx: 0.09, ry: 0.075, boneA: b.head }
    ], 9);

    const tailStations = [];
    for (let i = 0; i <= profile.topology.tailSegments; i++) {
      const t = i / profile.topology.tailSegments;
      tailStations.push({
        x: 0,
        y: 0.66 - t * 0.22,
        z: -0.5 - t * profile.proportions.tailLength,
        radius: 0.23 * (1 - t) + 0.025,
        boneA: i === 0 ? b.pelvis : b[`tail-${Math.min(profile.topology.tailSegments - 1, i - 1)}`],
        boneB: i >= profile.topology.tailSegments ? b[`tail-${profile.topology.tailSegments - 1}`] : b[`tail-${i}`],
        weightB: i === 0 ? 0 : 0.55
      });
    }
    appendTube(tailStations, 8);

    for (const side of [-1, 1]) {
      const suffix = side < 0 ? "L" : "R";
      appendTube([
        { x: side * 0.27, y: 0.7, z: -0.05, radius: 0.15, boneA: b.pelvis, boneB: b[`thigh-${suffix}`], weightB: 0.4 },
        { x: side * 0.32, y: 0.43, z: 0.04, radius: 0.13, boneA: b[`thigh-${suffix}`] },
        { x: side * 0.33, y: 0.18, z: 0.11, radius: 0.09, boneA: b[`thigh-${suffix}`], boneB: b[`shin-${suffix}`], weightB: 0.55 },
        { x: side * 0.3, y: -0.02, z: 0.21, radius: 0.065, boneA: b[`shin-${suffix}`] },
        { x: side * 0.29, y: -0.13, z: 0.42, rx: 0.085, ry: 0.045, boneA: b[`shin-${suffix}`], boneB: b[`foot-${suffix}`], weightB: 0.7 },
        { x: side * 0.29, y: -0.14, z: 0.65, rx: 0.07, ry: 0.035, boneA: b[`foot-${suffix}`] }
      ], 8);

      appendTube([
        { x: side * 0.24, y: 0.9, z: 0.42, radius: 0.07, boneA: b.chest, boneB: b[`upperArm-${suffix}`], weightB: 0.5 },
        { x: side * 0.34, y: 0.72, z: 0.58, radius: 0.055, boneA: b[`upperArm-${suffix}`] },
        { x: side * 0.38, y: 0.58, z: 0.75, radius: 0.038, boneA: b[`upperArm-${suffix}`], boneB: b[`foreArm-${suffix}`], weightB: 0.6 },
        { x: side * 0.4, y: 0.51, z: 0.9, radius: 0.025, boneA: b[`foreArm-${suffix}`] }
      ], 7);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(indices);
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(skinWeights, 4));
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: profile.material.roughness,
      metalness: profile.material.metalness,
      skinning: true
    });
    const mesh = new THREE.SkinnedMesh(geometry, material);
    mesh.name = `${profile.id}-wrapped-skinned-body`;
    mesh.add(boneRoot);
    const skeleton = new THREE.Skeleton(orderedBones);
    mesh.bind(skeleton);
    mesh.normalizeSkinWeights();
    mesh.scale.setScalar(profile.proportions.bodyScale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { bones, skeleton, profile: clone(profile), topology: { vertices: positions.length / 3, triangles: indices.length / 3 } };
    return mesh;
  }

  function applyPose(mesh, { speed = 0, time = 0, turn = 0, jump = 0, resistance = 0 } = {}) {
    const bones = mesh?.userData?.bones;
    if (!bones) return;
    const stride = Math.sin(time * Math.max(8, speed * 0.9));
    bones.pelvis.position.y = 0.66 + Math.abs(stride) * profile.animation.hipBob + jump * 0.08;
    bones.pelvis.rotation.z = -turn * profile.animation.turnLean;
    bones.chest.rotation.z = -turn * profile.animation.turnLean * 0.55;
    bones.head.rotation.y = -turn * 0.14;
    bones.head.rotation.x = resistance * profile.animation.headCounter - Math.abs(stride) * 0.025;
    bones["thigh-L"].rotation.x = stride * profile.animation.strideSwing;
    bones["thigh-R"].rotation.x = -stride * profile.animation.strideSwing;
    bones["shin-L"].rotation.x = Math.max(0, -stride) * 0.55;
    bones["shin-R"].rotation.x = Math.max(0, stride) * 0.55;
    bones["upperArm-L"].rotation.x = -stride * 0.28 - 0.18;
    bones["upperArm-R"].rotation.x = stride * 0.28 - 0.18;
    for (let i = 0; i < profile.topology.tailSegments; i++) {
      const bone = bones[`tail-${i}`];
      const k = i / Math.max(1, profile.topology.tailSegments - 1);
      bone.rotation.y = -turn * (0.18 + k * 0.38) + Math.sin(time * 3.4 - i * 0.5) * (profile.animation.tailFollow + k * 0.035);
      bone.rotation.x = Math.sin(time * 4.6 - i * 0.35) * 0.025;
    }
    mesh.skeleton.update();
  }

  return {
    id: "procedural-dino-body-domain-kit",
    kind: "procedural-dino-body-domain",
    profile,
    createSkinnedBody,
    applyPose,
    getDescriptor: () => clone(profile),
    snapshot: () => ({ id: "procedural-dino-body-domain-kit", profile: clone(profile) })
  };
}
