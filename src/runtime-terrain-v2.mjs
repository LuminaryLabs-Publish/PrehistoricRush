const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";

const graph = {
  entryScene: "menu",
  transitions: {
    "menu:start": "game",
    "game:runOver": "run-over",
    "game:win": "win",
    "run-over:retry": "game",
    "run-over:menu": "menu",
    "win:again": "game",
    "win:menu": "menu"
  }
};

const tuning = {
  motion: { speed: 15, maxSpeed: 25, boostSpeed: 30, turnRate: 2.55, gravity: 34, jump: 13.5 },
  terrain: { chunkSize: 44, radius: 3, segments: 20, seed: 238991 }
};

const hash = (x, z, seed = 1) => {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(z | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
const heightAt = (x, z, seed) => Math.sin((x + seed) * 0.035) * 1.7 + Math.cos((z - seed) * 0.029) * 1.35 + Math.sin((x + z) * 0.012) * 2.6 + Math.cos((x - z) * 0.009) * 1.85 + Math.sin(x * 0.19 + seed) * Math.cos(z * 0.17 - seed) * 0.3;
const terrainColor = (h) => h < -1.4 ? 0x2d684d : h > 3.2 ? 0x8b6d43 : h > 1.6 ? 0x5f7d3b : 0x3e8b4e;

async function loadThree() {
  return import(THREE_URL);
}

function shell() {
  const root = document.querySelector("#app") ?? document.body;
  root.innerHTML = "";
  Object.assign(document.body.style, { margin: 0, overflow: "hidden", background: "#050216", color: "#fff8dc", fontFamily: "system-ui,sans-serif" });
  const host = document.createElement("section");
  Object.assign(host.style, { position: "fixed", inset: 0 });
  const panel = document.createElement("aside");
  Object.assign(panel.style, { position: "fixed", top: "14px", left: "16px", minWidth: "280px", padding: "12px 14px", borderRadius: "16px", border: "1px solid rgba(255,232,160,.35)", background: "rgba(5,3,18,.62)", zIndex: 4 });
  const title = document.createElement("strong");
  title.textContent = "Prehistoric Rush";
  title.style.color = "#ffd37a";
  const status = document.createElement("div");
  status.style.fontSize = "13px";
  const button = document.createElement("button");
  button.textContent = "Start Rush";
  Object.assign(button.style, { marginTop: "10px", padding: "8px 12px", borderRadius: "999px", border: "1px solid rgba(255,211,122,.8)", background: "#ffd37a", fontWeight: 700, cursor: "pointer" });
  panel.append(title, status, button);
  root.append(host, panel);
  return { host, status, button };
}

function createGrid(THREE, size, seg) {
  const pos = [], colors = [], idx = [];
  for (let z = 0; z <= seg; z++) {
    for (let x = 0; x <= seg; x++) {
      pos.push((x / seg - 0.5) * size, 0, (z / seg - 0.5) * size);
      colors.push(0.2, 0.6, 0.25);
    }
  }
  for (let z = 0; z < seg; z++) {
    for (let x = 0; x < seg; x++) {
      const a = z * (seg + 1) + x;
      const b = a + 1;
      const c = a + seg + 1;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setIndex(idx);
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  return g;
}

function createTerrain(THREE, scene) {
  const cfg = tuning.terrain;
  const group = new THREE.Group();
  scene.add(group);
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.94 });
  const chunks = [];
  const color = new THREE.Color();
  let last = "";
  for (let z = -cfg.radius; z <= cfg.radius; z++) {
    for (let x = -cfg.radius; x <= cfg.radius; x++) {
      const mesh = new THREE.Mesh(createGrid(THREE, cfg.chunkSize, cfg.segments), mat);
      mesh.frustumCulled = false;
      group.add(mesh);
      chunks.push({ mesh, x, z });
    }
  }
  function rebuild(mesh, cx, cz) {
    const p = mesh.geometry.attributes.position;
    const c = mesh.geometry.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const wx = cx * cfg.chunkSize + p.getX(i);
      const wz = cz * cfg.chunkSize + p.getZ(i);
      const y = heightAt(wx, wz, cfg.seed);
      p.setY(i, y);
      color.setHex(terrainColor(y));
      const shade = 0.82 + hash(Math.floor(wx * 0.35), Math.floor(wz * 0.35), cfg.seed) * 0.26;
      c.setXYZ(i, color.r * shade, color.g * shade, color.b * shade);
    }
    p.needsUpdate = true;
    c.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.position.set(cx * cfg.chunkSize, 0, cz * cfg.chunkSize);
  }
  function update(x, z) {
    const cx = Math.floor(x / cfg.chunkSize);
    const cz = Math.floor(z / cfg.chunkSize);
    const key = `${cx}:${cz}`;
    if (key === last) return false;
    last = key;
    chunks.forEach((chunk) => rebuild(chunk.mesh, cx + chunk.x, cz + chunk.z));
    return true;
  }
  return { update, sample: (x, z) => heightAt(x, z, cfg.seed), chunks, cfg };
}

function dino(THREE) {
  const group = new THREE.Group();
  const green = new THREE.MeshStandardMaterial({ color: 0x7cc66a, roughness: 0.82 });
  const belly = new THREE.MeshStandardMaterial({ color: 0xe3c77a, roughness: 0.9 });
  const eye = new THREE.MeshStandardMaterial({ color: 0x101018, emissive: 0x1e9cff, emissiveIntensity: 0.35 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 12), green); body.scale.set(1.15, .78, 1.45); body.position.y = .78;
  const stomach = new THREE.Mesh(new THREE.SphereGeometry(.38, 14, 10), belly); stomach.scale.set(.9, .58, .72); stomach.position.set(0, .7, -.2);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.42, 18, 12), green); head.position.set(0, 1.22, .82);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(.46, .25, .45), green); snout.position.set(0, 1.14, 1.2);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(.18, 1.55, 12), green); tail.rotation.x = Math.PI / 2; tail.position.set(0, .82, -1.16);
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(.055, 10, 8), eye); eyeL.position.set(-.17, 1.29, 1.2); const eyeR = eyeL.clone(); eyeR.position.x = .17;
  const legL = new THREE.Mesh(new THREE.BoxGeometry(.2, .58, .24), green); legL.position.set(-.28, .2, .26); const legR = legL.clone(); legR.position.x = .28;
  group.add(body, stomach, head, snout, tail, eyeL, eyeR, legL, legR);
  group.userData = { tail, legL, legR };
  return group;
}

function treePools(THREE) {
  const mats = [0x16863f, 0x1f9c4f, 0x247c35, 0x5c8f39, 0x0f6b43].map((color) => new THREE.MeshStandardMaterial({ color, roughness: .9 }));
  return [
    new THREE.InstancedMesh(new THREE.ConeGeometry(.8, 3.7, 7), mats[0], 190),
    new THREE.InstancedMesh(new THREE.ConeGeometry(1.25, 3.0, 8), mats[1], 190),
    new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1.15, 0), mats[2], 190),
    new THREE.InstancedMesh(new THREE.ConeGeometry(.42, 4.2, 6), mats[3], 190),
    new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1.0, 1), mats[4], 190)
  ];
}

function sky(THREE) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xb85c36, side: THREE.BackSide });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(620, 48, 24), mat);
  mesh.frustumCulled = false;
  return mesh;
}

function setup(THREE, host) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x7c3a42, 90, 390);
  const camera = new THREE.PerspectiveCamera(64, innerWidth / innerHeight, 0.1, 900);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  host.append(renderer.domElement);
  scene.add(sky(THREE), new THREE.AmbientLight(0xffe8ba, 1.2));
  const sun = new THREE.DirectionalLight(0xffd37a, 2.2); sun.position.set(-10, 24, -8); scene.add(sun);
  const terrain = createTerrain(THREE, scene);
  const player = dino(THREE); scene.add(player);
  const dummy = new THREE.Object3D();
  const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.7, 0), new THREE.MeshStandardMaterial({ color: 0x806143, roughness: .92 }), 420);
  const shards = new THREE.InstancedMesh(new THREE.OctahedronGeometry(.34, 0), new THREE.MeshStandardMaterial({ color: 0x8fe8ff, emissive: 0x43d4ff, emissiveIntensity: .95 }), 220);
  const trees = treePools(THREE); scene.add(rocks, shards, ...trees);
  addEventListener("resize", () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  return { scene, camera, renderer, terrain, player, dummy, rocks, shards, trees };
}

function state() { return { x: 0, z: 0, y: 0, jumpY: 0, vy: 0, grounded: true, yaw: 0, speed: 15, distance: 0, best: Number(localStorage.getItem("prehistoricRush.bestDistance") ?? 0), shards: 0, colliders: [], pickups: [], collected: new Set(), time: 0 }; }

function populate(app) {
  const view = app.view, s = app.state, size = tuning.terrain.chunkSize, radius = tuning.terrain.radius, seed = tuning.terrain.seed;
  const cx = Math.floor(s.x / size), cz = Math.floor(s.z / size);
  const treeCounts = view.trees.map(() => 0); let rockCount = 0, shardCount = 0; s.colliders.length = 0; s.pickups.length = 0;
  for (let zc = cz - radius; zc <= cz + radius; zc++) for (let xc = cx - radius; xc <= cx + radius; xc++) {
    for (let i = 0; i < 9; i++) {
      const x = xc * size + (hash(xc * 31 + i, zc * 17, seed) - .5) * size, z = zc * size + (hash(xc * 19, zc * 23 + i, seed) - .5) * size, y = view.terrain.sample(x, z), type = Math.floor(hash(xc + i, zc - i, seed + 44) * 5) % 5, mesh = view.trees[type], n = treeCounts[type]++;
      const scale = .72 + hash(xc + i, zc - i, seed) * .95; view.dummy.position.set(x, y + (type === 3 ? 2.1 : 1.5), z); view.dummy.rotation.set(0, hash(xc, zc, i + seed) * Math.PI * 2, 0); view.dummy.scale.set(scale, scale, scale); view.dummy.updateMatrix(); if (n < mesh.count) mesh.setMatrixAt(n, view.dummy.matrix); s.colliders.push({ x, z, radius: .75 * scale });
    }
    for (let i = 0; i < 4; i++) {
      const x = xc * size + (hash(xc * 41 + i, zc * 29, seed + 8) - .5) * size, z = zc * size + (hash(xc * 37, zc * 11 + i, seed + 8) - .5) * size, y = view.terrain.sample(x, z), scale = .65 + hash(i, xc, zc) * .65; view.dummy.position.set(x, y + .55, z); view.dummy.scale.set(scale, scale, scale); view.dummy.updateMatrix(); if (rockCount < view.rocks.count) view.rocks.setMatrixAt(rockCount++, view.dummy.matrix); s.colliders.push({ x, z, radius: .95 * scale });
    }
    for (let i = 0; i < 2; i++) { const key = `${xc}:${zc}:${i}`; if (s.collected.has(key)) continue; const x = xc * size + (hash(xc * 13 + i, zc * 43, seed + 21) - .5) * size, z = zc * size + (hash(xc * 7, zc * 53 + i, seed + 21) - .5) * size, y = view.terrain.sample(x, z); view.dummy.position.set(x, y + 1.25, z); view.dummy.scale.setScalar(1); view.dummy.updateMatrix(); if (shardCount < view.shards.count) view.shards.setMatrixAt(shardCount++, view.dummy.matrix); s.pickups.push({ key, x, z, radius: 1.15 }); }
  }
  view.rocks.count = rockCount; view.shards.count = shardCount; view.trees.forEach((m, i) => { m.count = treeCounts[i]; m.instanceMatrix.needsUpdate = true; }); view.rocks.instanceMatrix.needsUpdate = true; view.shards.instanceMatrix.needsUpdate = true;
}

async function main() {
  const ui = shell(); const THREE = await loadThree(); const app = { THREE, ui, view: setup(THREE, ui.host), state: state(), scene: "menu", input: { left: false, right: false, boost: false, jump: false }, frame: 0, last: performance.now() };
  app.view.terrain.update(0, 0); populate(app);
  const start = () => { app.scene = app.scene === "menu" || app.scene === "run-over" || app.scene === "win" ? "game" : app.scene; };
  ui.button.addEventListener("click", start); addEventListener("keydown", e => { if (e.code === "Enter") start(); if (e.code === "KeyA" || e.code === "ArrowLeft") app.input.left = true; if (e.code === "KeyD" || e.code === "ArrowRight") app.input.right = true; if (e.code === "KeyW" || e.code === "ArrowUp") app.input.boost = true; if (e.code === "Space") app.scene === "game" ? app.input.jump = true : start(); }); addEventListener("keyup", e => { if (e.code === "KeyA" || e.code === "ArrowLeft") app.input.left = false; if (e.code === "KeyD" || e.code === "ArrowRight") app.input.right = false; if (e.code === "KeyW" || e.code === "ArrowUp") app.input.boost = false; });
  function loop(now) { const dt = Math.min(.05, (now - app.last) / 1000); app.last = now; app.frame++; const s = app.state, v = app.view; if (app.scene === "game") { s.time += dt; s.yaw += ((app.input.left ? 1 : 0) - (app.input.right ? 1 : 0)) * tuning.motion.turnRate * dt; s.speed += ((app.input.boost ? tuning.motion.boostSpeed : tuning.motion.maxSpeed) - s.speed) * Math.min(1, dt * 2.2); if (app.input.jump && s.grounded) { s.vy = tuning.motion.jump; s.grounded = false; } s.vy -= tuning.motion.gravity * dt; s.jumpY = Math.max(0, s.jumpY + s.vy * dt); if (s.jumpY === 0) { s.vy = 0; s.grounded = true; } const dx = Math.sin(s.yaw) * s.speed * dt, dz = Math.cos(s.yaw) * s.speed * dt; s.x += dx; s.z += dz; s.distance += Math.hypot(dx, dz); s.best = Math.max(s.best, s.distance); s.y = v.terrain.sample(s.x, s.z); if (v.terrain.update(s.x, s.z) || app.frame % 8 === 0) populate(app); for (const c of s.colliders) if (Math.hypot(c.x - s.x, c.z - s.z) < c.radius + .45 && s.jumpY < 1.2) app.scene = "run-over"; for (const p of s.pickups) if (Math.hypot(p.x - s.x, p.z - s.z) < p.radius + .55) { s.collected.add(p.key); s.shards++; populate(app); break; } if (s.distance > 3600) app.scene = "win"; }
    const y = s.y + s.jumpY + .12; v.player.position.set(s.x, y, s.z); v.player.rotation.y = s.yaw; const parts = v.player.userData, stride = Math.sin(s.time * Math.max(8, s.speed * .9)); if (parts.legL) parts.legL.rotation.x = stride * .55; if (parts.legR) parts.legR.rotation.x = -stride * .55; if (parts.tail) parts.tail.rotation.z = Math.sin(s.time * 4) * .14; const back = new THREE.Vector3(-Math.sin(s.yaw), 0, -Math.cos(s.yaw)); v.camera.position.lerp(new THREE.Vector3(s.x, y + 4.7, s.z).addScaledVector(back, 11.5), Math.min(1, dt * 7.5)); v.camera.lookAt(new THREE.Vector3(s.x + Math.sin(s.yaw) * 15, y + 1.35, s.z + Math.cos(s.yaw) * 15)); ui.status.innerHTML = [`Scene: <b>${app.scene}</b>`, `Distance: ${Math.floor(s.distance)}m / 3600m`, `Speed: ${s.speed.toFixed(1)} m/s`, `Heading: ${Math.round(s.yaw * 180 / Math.PI)}°`, `Shards: ${s.shards}`, `Best: ${Math.floor(s.best)}m`, `Terrain chunks: ${v.terrain.chunks.length}`, "5 tree types, free steering, no stop"].join("<br>"); ui.button.textContent = app.scene === "game" ? "Jump" : app.scene === "run-over" ? "Retry" : app.scene === "win" ? "Run Again" : "Start Rush"; app.input.jump = false; v.renderer.render(v.scene, v.camera); requestAnimationFrame(loop); }
  globalThis.PrehistoricRushHost = { app, getState: () => ({ scene: app.scene, runner: app.state, terrain: { chunks: app.view.terrain.chunks.length }, renderer: "three-terrain-v2" }) }; requestAnimationFrame(loop);
}
main().catch(e => { console.error(e); document.body.textContent = e.message; });
