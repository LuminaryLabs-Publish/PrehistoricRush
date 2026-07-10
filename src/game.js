import { createRouteFieldDomainKit } from "./domains/route/route-field-domain-kit.js";
import { createSurfaceTraversalDomainKit } from "./domains/surface/surface-traversal-domain-kit.js";
import { createForestArchetypeDomainKit } from "./domains/forest/forest-archetype-domain-kit.js";
import { createGrassPatchDomainKit } from "./domains/grass/grass-patch-domain-kit.js";
import { createGrassWindDomainKit } from "./domains/grass/grass-wind-domain-kit.js";
import { createProceduralDinoBodyDomainKit } from "./domains/dino/procedural-dino-body-domain-kit.js";

const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";
const PHYSICS_URL = "https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.15.0/rapier.es.js";
const PHYSICS_KIT_URL = "https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusRealtime-ProtoKits@main/protokits/rapier-physics-domain-kit/index.js";

const tuning = {
  motion: { baseSpeed: 16, maxSpeed: 26, boostSpeed: 31, turnRate: 2.25, gravity: 34, jump: 13.5 },
  terrain: { chunkSize: 56, radius: 3, segments: 30, seed: 238991 },
  route: { segmentLength: 18, pathHalfWidth: 3.1, vergeWidth: 3.2, sampleSpacing: 2.5 },
  forest: { treesPerChunk: 7, grassPerChunk: 70, rocksPerChunk: 2, shardsPerChunk: 2 },
  goalDistance: 3600
};

const route = createRouteFieldDomainKit({ seed: tuning.terrain.seed, ...tuning.route });
const surface = createSurfaceTraversalDomainKit();
const forest = createForestArchetypeDomainKit();
const grassDomain = createGrassPatchDomainKit();
const wind = createGrassWindDomainKit();
const dinoBody = createProceduralDinoBodyDomainKit({ id: "prehistoric-rush-raptor", bodyScale: 0.82 });

const hash = (x, z, seed = 1) => {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(z | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const terrainNoise = (x, z, seed) => Math.sin((x + seed) * 0.019) * 1.6 + Math.cos((z - seed) * 0.022) * 1.3 + Math.sin((x + z) * 0.008) * 2.6 + Math.cos((x - z) * 0.006) * 1.7;
const load = async (url) => { try { return await import(url); } catch (error) { console.warn("module import failed", url, error); return null; } };

function createShell() {
  const root = document.querySelector("#app") ?? document.body;
  root.innerHTML = "";
  Object.assign(document.body.style, { margin: 0, overflow: "hidden", background: "#09130d", color: "#fff8dc", fontFamily: "system-ui,sans-serif" });
  const host = document.createElement("section");
  Object.assign(host.style, { position: "fixed", inset: 0 });
  const panel = document.createElement("aside");
  Object.assign(panel.style, { position: "fixed", top: "14px", left: "16px", minWidth: "292px", padding: "12px 14px", borderRadius: "16px", border: "1px solid rgba(230,220,155,.28)", background: "rgba(7,14,9,.72)", backdropFilter: "blur(10px)", zIndex: 4 });
  const status = document.createElement("div");
  status.style.fontSize = "12px";
  const button = document.createElement("button");
  button.textContent = "Start Rush";
  Object.assign(button.style, { marginTop: "10px", padding: "9px 14px", borderRadius: "999px", border: "1px solid rgba(255,211,122,.8)", background: "#ffd37a", fontWeight: 800, cursor: "pointer" });
  panel.append(status, button);
  root.append(host, panel);
  return { host, status, button };
}

function createTerrain(THREE, scene) {
  const group = new THREE.Group();
  const chunks = [];
  const material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.94, metalness: 0, side: THREE.FrontSide });
  scene.add(group);

  function geometry() {
    const size = tuning.terrain.chunkSize;
    const seg = tuning.terrain.segments;
    const positions = [], colors = [], indices = [];
    for (let z = 0; z <= seg; z++) for (let x = 0; x <= seg; x++) {
      positions.push((x / seg - 0.5) * size, 0, (z / seg - 0.5) * size);
      colors.push(0.2, 0.4, 0.18);
    }
    for (let z = 0; z < seg; z++) for (let x = 0; x < seg; x++) {
      const a = z * (seg + 1) + x, b = a + 1, c = a + seg + 1, d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
    const g = new THREE.BufferGeometry();
    g.setIndex(indices);
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }

  for (let z = -tuning.terrain.radius; z <= tuning.terrain.radius; z++) for (let x = -tuning.terrain.radius; x <= tuning.terrain.radius; x++) {
    const mesh = new THREE.Mesh(geometry(), material);
    mesh.receiveShadow = true;
    group.add(mesh);
    chunks.push({ mesh, x, z });
  }

  const sample = (x, z) => terrainNoise(x, z, tuning.terrain.seed);
  let lastKey = "";
  function rebuild(mesh, cx, cz) {
    const p = mesh.geometry.attributes.position;
    const c = mesh.geometry.attributes.color;
    const size = tuning.terrain.chunkSize;
    for (let i = 0; i < p.count; i++) {
      const wx = cx * size + p.getX(i), wz = cz * size + p.getZ(i);
      const nearest = route.nearest(wx, wz, 0, route.samples.length);
      const y = sample(wx, wz) - Math.max(0, 1 - nearest.distance / (nearest.width + 2.4)) * 0.34;
      p.setY(i, y);
      const region = route.classify(nearest.distance, nearest.width);
      const base = region === "path" ? [0.36, 0.25, 0.13] : region === "edge" ? [0.34, 0.36, 0.16] : region === "verge" ? [0.18, 0.39, 0.18] : [0.11, 0.29, 0.13];
      const shade = 0.82 + hash(Math.floor(wx * 0.25), Math.floor(wz * 0.25), tuning.terrain.seed) * 0.2;
      c.setXYZ(i, base[0] * shade, base[1] * shade, base[2] * shade);
    }
    p.needsUpdate = true;
    c.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.position.set(cx * tuning.terrain.chunkSize, 0, cz * tuning.terrain.chunkSize);
  }

  function update(x, z) {
    const cx = Math.floor(x / tuning.terrain.chunkSize), cz = Math.floor(z / tuning.terrain.chunkSize);
    const key = `${cx}:${cz}`;
    if (key === lastKey) return false;
    lastKey = key;
    chunks.forEach((chunk) => rebuild(chunk.mesh, cx + chunk.x, cz + chunk.z));
    return true;
  }
  return { group, chunks, sample, update };
}

function createRaptor(THREE) {
  return dinoBody.createSkinnedBody(THREE);
}

function animateRaptor(player, speed, time, turn, jump, resistance) {
  dinoBody.applyPose(player, { speed, time, turn, jump, resistance });
}

function createGrassGeometry(THREE, planes = 3) {
  const geometries = [];
  for (let i = 0; i < planes; i++) {
    const g = new THREE.PlaneGeometry(1, 1, 1, 4);
    g.translate(0, 0.5, 0);
    g.rotateY((Math.PI / planes) * i);
    geometries.push(g);
  }
  const positions = [], uvs = [], indices = [];
  let vertexOffset = 0;
  for (const g of geometries) {
    const p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) { positions.push(p.getX(i), p.getY(i), p.getZ(i)); uvs.push(uv.getX(i), uv.getY(i)); }
    for (let i = 0; i < g.index.count; i++) indices.push(g.index.getX(i) + vertexOffset);
    vertexOffset += p.count;
  }
  const out = new THREE.BufferGeometry();
  out.setIndex(indices);
  out.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  out.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  return out;
}

function createGrassMaterial(THREE, baseColor) {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    alphaTest: 0.34,
    depthWrite: true,
    uniforms: { uTime: { value: 0 }, uWind: { value: 0.2 }, uColor: { value: new THREE.Color(baseColor) } },
    vertexShader: `uniform float uTime; uniform float uWind; varying vec2 vUv; varying float vShade; void main(){ vUv=uv; vec3 p=position; float tip=clamp(position.y,0.0,1.0); vec4 world=instanceMatrix*vec4(p,1.0); float wave=sin(uTime*1.45+world.x*0.15+world.z*0.11)*uWind; p.x+=wave*tip*tip; p.z+=cos(uTime*1.1+world.z*0.13)*uWind*0.35*tip; vShade=0.72+tip*0.28; gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(p,1.0); }`,
    fragmentShader: `uniform vec3 uColor; varying vec2 vUv; varying float vShade; void main(){ float blade=1.0-smoothstep(0.38,0.5,abs(vUv.x-0.5)); float tip=smoothstep(0.0,0.18,vUv.y)*(1.0-smoothstep(0.86,1.0,vUv.y)); float alpha=blade*tip; if(alpha<0.34) discard; gl_FragColor=vec4(uColor*vShade,alpha); }`
  });
}

function createForestRenderer(THREE, scene) {
  const dummy = new THREE.Object3D();
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5b4028, roughness: 0.98 });
  const rootMaterial = new THREE.MeshStandardMaterial({ color: 0x49351f, roughness: 1 });
  const treePools = forest.archetypes.map((archetype) => {
    const group = new THREE.Group();
    const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.7, 1.15, 1, 10), trunkMaterial, 100);
    const crown = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), new THREE.MeshStandardMaterial({ color: archetype.tint, roughness: 0.92 }), 100);
    trunk.castShadow = crown.castShadow = true;
    trunk.receiveShadow = crown.receiveShadow = true;
    group.add(trunk, crown);
    scene.add(group);
    return { archetype, trunk, crown, trunkCount: 0, crownCount: 0 };
  });
  const roots = new THREE.InstancedMesh(new THREE.ConeGeometry(0.42, 4.8, 6), rootMaterial, 400);
  roots.castShadow = true; scene.add(roots);

  const grassLayers = [
    { id: "carpet", mesh: new THREE.InstancedMesh(createGrassGeometry(THREE, 2), createGrassMaterial(THREE, 0x254f24), 3600) },
    { id: "main", mesh: new THREE.InstancedMesh(createGrassGeometry(THREE, 3), createGrassMaterial(THREE, 0x356d2e), 2600) },
    { id: "verge", mesh: new THREE.InstancedMesh(createGrassGeometry(THREE, 3), createGrassMaterial(THREE, 0x4c8238), 1300) }
  ];
  grassLayers.forEach(({ mesh }) => { mesh.frustumCulled = false; scene.add(mesh); });

  const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.75, 1), new THREE.MeshStandardMaterial({ color: 0x655847, roughness: 0.98 }), 320);
  const shards = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.34, 0), new THREE.MeshStandardMaterial({ color: 0x8fe8ff, emissive: 0x43d4ff, emissiveIntensity: 1 }), 220);
  rocks.castShadow = true; scene.add(rocks, shards);
  return { dummy, treePools, roots, rootCount: 0, grassLayers, rocks, shards };
}

async function createPhysics() {
  const [R, Kit] = await Promise.all([load(PHYSICS_URL), load(PHYSICS_KIT_URL)]);
  const store = new Map();
  const world = { getResource: (r) => store.get(r?.name ?? r), setResource: (r, v) => store.set(r?.name ?? r, v), emit() {} };
  const engine = { n: {} };
  const kit = Kit?.createRapierPhysicsKit?.({}, {});
  kit?.initWorld?.({ world, engine }); kit?.install?.({ world, engine });
  if (R?.init) await R.init();
  const api = engine.n.rapierPhysics;
  api?.configure?.({ rapier: R, gravity: { x: 0, y: -34, z: 0 } });
  api?.registerKinematicActor?.({ id: "dino", shape: "capsule", halfHeight: 0.42, radius: 0.32 });
  return api ?? null;
}

async function main() {
  const ui = createShell();
  const [THREE, physics] = await Promise.all([load(THREE_URL), createPhysics()]);
  if (!THREE) throw new Error("Three.js failed to load.");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x15251b);
  scene.fog = new THREE.FogExp2(0x203326, 0.0125);
  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 900);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  ui.host.append(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xb9d0b2, 0x182015, 1.4));
  const sun = new THREE.DirectionalLight(0xffe6b2, 2.2);
  sun.position.set(-25, 45, -20); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -48; sun.shadow.camera.right = 48; sun.shadow.camera.top = 48; sun.shadow.camera.bottom = -48;
  scene.add(sun);

  const terrain = createTerrain(THREE, scene);
  const forestView = createForestRenderer(THREE, scene);
  const player = createRaptor(THREE); player.castShadow = true; scene.add(player);
  player.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  const state = { x: 0, z: 0, y: 0, jumpY: 0, vy: 0, grounded: true, yaw: 0, speed: tuning.motion.baseSpeed, distance: 0, best: Number(localStorage.getItem("prehistoricRush.bestDistance") ?? 0), shards: 0, collected: new Set(), time: 0, turn: 0, routeIndex: 0, region: "path", scene: "menu", colliders: [], pickups: [] };
  const input = { left: false, right: false, boost: false, jump: false };
  let populationKey = "";

  function populate() {
    const size = tuning.terrain.chunkSize;
    const cx = Math.floor(state.x / size), cz = Math.floor(state.z / size);
    const key = `${cx}:${cz}`;
    if (key === populationKey) return;
    populationKey = key;
    state.colliders.length = 0; state.pickups.length = 0;
    forestView.treePools.forEach((pool) => { pool.trunkCount = 0; pool.crownCount = 0; });
    forestView.rootCount = 0;
    const grassCounts = forestView.grassLayers.map(() => 0);
    let rockCount = 0, shardCount = 0;

    for (let zc = cz - tuning.terrain.radius; zc <= cz + tuning.terrain.radius; zc++) for (let xc = cx - tuning.terrain.radius; xc <= cx + tuning.terrain.radius; xc++) {
      for (let i = 0; i < tuning.forest.treesPerChunk; i++) {
        const x = xc * size + (hash(xc * 31 + i, zc * 17, 11) - 0.5) * size;
        const z = zc * size + (hash(xc * 19, zc * 23 + i, 13) - 0.5) * size;
        const near = route.nearest(x, z, state.routeIndex, 180);
        if (near.distance < near.width + 5.5) continue;
        const y = terrain.sample(x, z);
        const type = Math.floor(hash(xc + i, zc - i, 41) * forest.archetypes.length) % forest.archetypes.length;
        const pool = forestView.treePools[type], a = pool.archetype;
        const height = a.minHeight + hash(xc, zc, i + 47) * (a.maxHeight - a.minHeight);
        const radius = a.trunkRadius * (0.82 + hash(i, xc, 61) * 0.42);
        const rotation = hash(xc, zc, i + 67) * Math.PI * 2;
        const trunkIndex = pool.trunkCount++;
        forestView.dummy.position.set(x, y + height * 0.5, z); forestView.dummy.rotation.set(0, rotation, 0); forestView.dummy.scale.set(radius, height, radius); forestView.dummy.updateMatrix(); pool.trunk.setMatrixAt(trunkIndex, forestView.dummy.matrix);
        const crownIndex = pool.crownCount++;
        forestView.dummy.position.set(x, y + height * 0.78, z); forestView.dummy.scale.set(a.crownRadius, a.crownHeight, a.crownRadius); forestView.dummy.updateMatrix(); pool.crown.setMatrixAt(crownIndex, forestView.dummy.matrix);
        for (let r = 0; r < 4; r++) {
          const rootIndex = forestView.rootCount++;
          forestView.dummy.position.set(x + Math.sin(rotation + r * Math.PI / 2) * radius * 1.2, y + 0.3, z + Math.cos(rotation + r * Math.PI / 2) * radius * 1.2);
          forestView.dummy.rotation.set(Math.PI / 2.25, rotation + r * Math.PI / 2, 0); forestView.dummy.scale.set(radius * 0.65, radius * 1.7, radius * 0.5); forestView.dummy.updateMatrix(); forestView.roots.setMatrixAt(rootIndex, forestView.dummy.matrix);
        }
        state.colliders.push({ x, z, radius: radius * 1.3 });
      }

      for (let i = 0; i < tuning.forest.grassPerChunk; i++) {
        const x = xc * size + (hash(xc * 71 + i, zc * 37, 79) - 0.5) * size;
        const z = zc * size + (hash(xc * 43, zc * 59 + i, 83) - 0.5) * size;
        const near = route.nearest(x, z, state.routeIndex, 190);
        const routeScale = grassDomain.scaleForRoute(near.distance, near.width);
        if (routeScale <= 0) continue;
        const region = route.classify(near.distance, near.width);
        const layerIndex = region === "edge" ? 0 : region === "verge" ? (hash(i, xc, 89) > 0.48 ? 1 : 2) : (hash(i, zc, 97) > 0.28 ? 1 : 0);
        const layer = forestView.grassLayers[layerIndex], cfg = grassDomain.layers[layer.id];
        const index = grassCounts[layerIndex]++;
        if (index >= layer.mesh.count) continue;
        const y = terrain.sample(x, z);
        const distanceToPlayer = Math.hypot(x - state.x, z - state.z);
        const lod = distanceToPlayer > 80 ? 0 : distanceToPlayer > 45 ? 0.55 : distanceToPlayer > 22 ? 0.78 : 1;
        if (!lod) continue;
        const randomScale = 0.78 + hash(i, xc + zc, 103) * 0.55;
        forestView.dummy.position.set(x, y, z);
        forestView.dummy.rotation.set(0, hash(i, zc, 109) * Math.PI, 0);
        forestView.dummy.scale.set(cfg.width * randomScale * lod, cfg.height * routeScale * randomScale, cfg.width * randomScale * lod);
        forestView.dummy.updateMatrix(); layer.mesh.setMatrixAt(index, forestView.dummy.matrix);
      }

      for (let i = 0; i < tuning.forest.rocksPerChunk; i++) {
        const x = xc * size + (hash(xc * 17 + i, zc * 29, 113) - 0.5) * size;
        const z = zc * size + (hash(xc * 23, zc * 31 + i, 127) - 0.5) * size;
        const near = route.nearest(x, z, state.routeIndex, 160);
        if (near.distance < near.width + 0.8) continue;
        const y = terrain.sample(x, z), scale = 0.7 + hash(i, xc, 131) * 0.9;
        forestView.dummy.position.set(x, y + 0.5, z); forestView.dummy.rotation.set(hash(i, zc, 137), hash(xc, i, 139) * Math.PI, 0); forestView.dummy.scale.setScalar(scale); forestView.dummy.updateMatrix(); forestView.rocks.setMatrixAt(rockCount++, forestView.dummy.matrix);
      }

      for (let i = 0; i < tuning.forest.shardsPerChunk; i++) {
        const id = `${xc}:${zc}:${i}`; if (state.collected.has(id)) continue;
        const sampleIndex = Math.max(0, Math.min(route.samples.length - 1, state.routeIndex + Math.floor(hash(xc, zc, i + 149) * 100) - 20));
        const routePoint = route.samples[sampleIndex];
        const side = hash(i, xc, 151) * 2 - 1;
        const x = routePoint.x + side * Math.min(routePoint.width * 0.65, 2.1), z = routePoint.z, y = terrain.sample(x, z);
        forestView.dummy.position.set(x, y + 1.15, z); forestView.dummy.scale.setScalar(1); forestView.dummy.updateMatrix(); forestView.shards.setMatrixAt(shardCount++, forestView.dummy.matrix);
        state.pickups.push({ id, x, z, radius: 1.1 });
      }
    }
    forestView.treePools.forEach((pool) => { pool.trunk.count = pool.trunkCount; pool.crown.count = pool.crownCount; pool.trunk.instanceMatrix.needsUpdate = true; pool.crown.instanceMatrix.needsUpdate = true; });
    forestView.roots.count = forestView.rootCount; forestView.roots.instanceMatrix.needsUpdate = true;
    forestView.grassLayers.forEach((layer, index) => { layer.mesh.count = grassCounts[index]; layer.mesh.instanceMatrix.needsUpdate = true; });
    forestView.rocks.count = rockCount; forestView.rocks.instanceMatrix.needsUpdate = true;
    forestView.shards.count = shardCount; forestView.shards.instanceMatrix.needsUpdate = true;
    physics?.setFixedColliders?.(state.colliders.map((c, i) => ({ id: `tree-${i}`, shape: "ball", x: c.x, y: terrain.sample(c.x, c.z), z: c.z, radius: c.radius, tags: ["tree"] })));
  }

  terrain.update(0, 0); populate();
  const start = () => { if (state.scene !== "game") { state.scene = "game"; state.x = 0; state.z = 0; state.distance = 0; state.routeIndex = 0; state.yaw = 0; } };
  ui.button.addEventListener("click", () => state.scene === "game" ? (input.jump = true) : start());
  addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) event.preventDefault();
    if (event.code === "Enter") start();
    if (event.code === "KeyA" || event.code === "ArrowLeft") input.left = true;
    if (event.code === "KeyD" || event.code === "ArrowRight") input.right = true;
    if (event.code === "KeyW" || event.code === "ArrowUp") input.boost = true;
    if (event.code === "Space") state.scene === "game" ? input.jump = true : start();
  });
  addEventListener("keyup", (event) => {
    if (event.code === "KeyA" || event.code === "ArrowLeft") input.left = false;
    if (event.code === "KeyD" || event.code === "ArrowRight") input.right = false;
    if (event.code === "KeyW" || event.code === "ArrowUp") input.boost = false;
  });
  addEventListener("blur", () => { input.left = input.right = input.boost = input.jump = false; });
  addEventListener("resize", () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (state.scene === "game") {
      state.time += dt;
      state.turn = (input.left ? 1 : 0) - (input.right ? 1 : 0);
      state.yaw += state.turn * tuning.motion.turnRate * dt;
      const nearest = route.nearest(state.x, state.z, state.routeIndex, 120); state.routeIndex = nearest.index;
      state.region = route.classify(nearest.distance, nearest.width);
      const surfaceState = surface.update(state.region, dt);
      const desired = (input.boost ? tuning.motion.boostSpeed : tuning.motion.maxSpeed) * surfaceState.multiplier;
      state.speed += (desired - state.speed) * Math.min(1, dt * 2.6);
      if (input.jump && state.grounded) { state.vy = tuning.motion.jump; state.grounded = false; }
      state.vy -= tuning.motion.gravity * dt; state.jumpY = Math.max(0, state.jumpY + state.vy * dt);
      if (state.jumpY === 0) { state.vy = 0; state.grounded = true; }
      const dx = Math.sin(state.yaw) * state.speed * dt, dz = Math.cos(state.yaw) * state.speed * dt;
      state.x += dx; state.z += dz; state.distance += Math.hypot(dx, dz); state.best = Math.max(state.best, state.distance);
      state.y = terrain.sample(state.x, state.z);
      if (terrain.update(state.x, state.z)) { populationKey = ""; populate(); }
      physics?.setActorTransform?.("dino", { x: state.x, y: state.y + state.jumpY + 0.62, z: state.z });
      const contacts = physics?.step?.(dt)?.contacts ?? [];
      const hit = contacts.some((c) => c.actorId === "dino") || state.colliders.some((c) => Math.hypot(c.x - state.x, c.z - state.z) < c.radius + 0.32 && state.jumpY < 1.05);
      if (hit) state.scene = "run-over";
      for (const pickup of state.pickups) if (Math.hypot(pickup.x - state.x, pickup.z - state.z) < pickup.radius + 0.4) { state.collected.add(pickup.id); state.shards++; populationKey = ""; populate(); break; }
      if (state.distance >= tuning.goalDistance) state.scene = "win";
    }

    const surfaceState = surface.getState();
    player.position.set(state.x, state.y + state.jumpY + 0.05, state.z); player.rotation.y = state.yaw;
    animateRaptor(player, state.speed, state.time, state.turn, Math.min(1, state.jumpY / 2), 1 - surfaceState.multiplier);
    const routeAhead = route.samples[Math.min(route.samples.length - 1, state.routeIndex + 12)] ?? route.samples[state.routeIndex];
    const back = new THREE.Vector3(-Math.sin(state.yaw), 0, -Math.cos(state.yaw));
    const cameraTarget = new THREE.Vector3(state.x, state.y + 2.35, state.z).addScaledVector(back, 6.6);
    camera.position.lerp(cameraTarget, 1 - Math.exp(-8.5 * dt));
    camera.lookAt(new THREE.Vector3(routeAhead.x, terrain.sample(routeAhead.x, routeAhead.z) + 1.15, routeAhead.z));
    camera.fov += ((62 + Math.min(10, Math.max(0, state.speed - 16) * 0.7)) - camera.fov) * Math.min(1, dt * 4); camera.updateProjectionMatrix();

    const windState = wind.update(state.time);
    forestView.grassLayers.forEach((layer) => { layer.mesh.material.uniforms.uTime.value = state.time; layer.mesh.material.uniforms.uWind.value = windState.strength * (0.7 + windState.gust * 0.6); });
    forestView.shards.rotation.y += dt * 0.8;

    const progress = Math.min(1, state.distance / tuning.goalDistance);
    ui.status.innerHTML = `<div style="font-size:15px;font-weight:850;color:#ffd37a">Prehistoric Rush</div><div style="opacity:.72;text-transform:uppercase;letter-spacing:.08em">${state.scene}</div><div style="height:7px;border-radius:99px;background:#ffffff22;overflow:hidden;margin:8px 0"><div style="height:100%;width:${(progress * 100).toFixed(1)}%;background:linear-gradient(90deg,#d7ae55,#84d778)"></div></div><div>${Math.floor(state.distance)}m / ${tuning.goalDistance}m · ${state.shards} shards</div><div>${state.speed.toFixed(1)} m/s · ${state.region} × ${surfaceState.multiplier.toFixed(2)}</div><div style="opacity:.62;margin-top:5px">route ${state.routeIndex} · giant forest · layered grass</div>`;
    ui.button.textContent = state.scene === "game" ? "Jump" : state.scene === "run-over" ? "Retry" : state.scene === "win" ? "Run Again" : "Start Rush";
    input.jump = false;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }

  globalThis.PrehistoricRushHost = {
    app: { scene, camera, renderer, terrain, player, state, route, surface, forest, grassDomain, wind, dinoBody, physics },
    getState: () => ({ scene: state.scene, runner: { ...state, collected: [...state.collected] }, route: route.snapshot(), surface: surface.snapshot(), forest: forest.snapshot(), grass: grassDomain.snapshot(), wind: wind.snapshot(), dinoBody: dinoBody.snapshot(), renderer: "three-giant-forest-skinned-dino-v2" })
  };
  requestAnimationFrame(loop);
}

main().catch((error) => { console.error(error); document.body.textContent = `Could not start PrehistoricRush: ${error.message}`; });
