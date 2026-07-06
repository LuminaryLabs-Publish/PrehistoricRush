const ENGINE_URL = "https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine@main/src/index.js";
const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js";

const FALLBACK_SCENE_GRAPH = {
  id: "prehistoric-rush",
  entryScene: "menu",
  transitions: {
    "menu:start": "game",
    "game:runOver": "run-over",
    "game:win": "win",
    "run-over:menu": "menu",
    "run-over:retry": "game",
    "win:menu": "menu",
    "win:again": "game"
  }
};

const FALLBACK_TUNING = {
  motion: {
    baseForwardSpeed: 13.5,
    maxForwardSpeed: 24,
    boostForwardSpeed: 29,
    turnRate: 2.45,
    jumpGravity: 34,
    jumpImpulse: 13.5,
    coyoteSeconds: 0.08,
    inputBufferSeconds: 0.12
  },
  camera: {
    followLagSeconds: 0.08,
    lookAheadMeters: 14,
    fovBase: 64,
    fovAtMaxSpeed: 74
  },
  terrain: {
    chunkSize: 44,
    chunkRadius: 3,
    chunkSegments: 18,
    seed: "prehistoric-rush-infinite-terrain-v0"
  }
};

function clone(value) {
  return value == null ? value : typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : min));
}

function wrapAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function hash2(x, z, seed = 0) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(z | 0, 668265263) ^ Math.imul(seed | 0, 1442695041);
  h = (h ^ (h >>> 13)) | 0;
  h = Math.imul(h, 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function seedNumber(seedText = "seed") {
  let value = 2166136261;
  for (const char of String(seedText)) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

async function loadJson(path, fallback) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`${path} returned ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Using fallback for ${path}:`, error);
    return clone(fallback);
  }
}

async function loadModule(url, label) {
  try {
    return await import(url);
  } catch (error) {
    console.warn(`${label} import failed.`, error);
    return null;
  }
}

function createFallbackKit(apiName) {
  return () => ({
    id: `fallback-${apiName}`,
    install({ engine }) {
      engine.n ??= {};
      engine.n[apiName] = {
        getSnapshot: () => ({}),
        getState: () => ({}),
        configure: () => ({}),
        setDescriptor: () => ({}),
        getDescriptors: () => ({}),
        setPreset: () => ({}),
        getRenderDescriptor: () => ({})
      };
    }
  });
}

function createFallbackEngine({ kits = [] } = {}) {
  const engine = { n: {}, tick() {} };
  for (const kit of kits) kit?.install?.({ engine, world: { getResource() {}, setResource() {}, emit() {} } });
  return engine;
}

function installEngine(NexusEngine) {
  if (!NexusEngine) {
    return createFallbackEngine({
      kits: [
        createFallbackKit("coreSkybox")(),
        createFallbackKit("coreScene")(),
        createFallbackKit("coreInput")(),
        createFallbackKit("coreMotion")(),
        createFallbackKit("coreCamera")(),
        createFallbackKit("coreGraphics")(),
        createFallbackKit("coreAnimation")(),
        createFallbackKit("coreUi")(),
        createFallbackKit("coreDiagnostics")(),
        createFallbackKit("coreComposition")()
      ]
    });
  }

  return NexusEngine.createRealtimeGame({
    kits: [
      NexusEngine.createCoreSkyboxKit?.({ presetId: "golden-horizon" }),
      NexusEngine.createCoreSceneKit?.(),
      NexusEngine.createCoreInputKit?.(),
      NexusEngine.createCoreMotionKit?.(),
      NexusEngine.createCoreCameraKit?.(),
      NexusEngine.createCoreGraphicsKit?.(),
      NexusEngine.createCoreAnimationKit?.(),
      NexusEngine.createCoreUIKit?.(),
      NexusEngine.createCoreDiagnosticsKit?.(),
      NexusEngine.createCoreCompositionKit?.()
    ].filter(Boolean)
  });
}

function createShell() {
  const mount = document.querySelector("#app") ?? document.body;
  mount.innerHTML = "";
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
  document.body.style.background = "#050216";
  document.body.style.color = "#fff8dc";
  document.body.style.fontFamily = "system-ui, sans-serif";

  const renderHost = document.createElement("section");
  renderHost.id = "threeHost";
  Object.assign(renderHost.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    overflow: "hidden"
  });

  const hud = document.createElement("aside");
  hud.id = "hud";
  Object.assign(hud.style, {
    position: "fixed",
    left: "16px",
    top: "14px",
    padding: "12px 14px",
    border: "1px solid rgba(255, 232, 160, 0.35)",
    borderRadius: "16px",
    background: "rgba(5, 3, 18, 0.62)",
    backdropFilter: "blur(8px)",
    minWidth: "260px",
    boxShadow: "0 12px 48px rgba(0,0,0,.25)",
    zIndex: "4"
  });

  const title = document.createElement("strong");
  title.id = "title";
  title.textContent = "Prehistoric Rush";
  title.style.color = "#ffd37a";

  const status = document.createElement("div");
  status.id = "status";
  status.style.fontSize = "13px";
  status.style.marginTop = "4px";

  const action = document.createElement("button");
  action.id = "primaryAction";
  action.textContent = "Start Rush";
  Object.assign(action.style, {
    marginTop: "10px",
    padding: "8px 12px",
    borderRadius: "999px",
    border: "1px solid rgba(255, 211, 122, 0.8)",
    color: "#1b0d04",
    background: "#ffd37a",
    fontWeight: "700",
    cursor: "pointer"
  });

  hud.append(title, status, action);
  mount.append(renderHost, hud);
  return { renderHost, hud, title, status, action };
}

function terrainHeight(x, z, seed = 1) {
  const rolling = Math.sin((x + seed * 0.001) * 0.035) * 1.45 + Math.cos((z - seed * 0.002) * 0.029) * 1.2;
  const mid = Math.sin((x + z) * 0.012) * 2.4 + Math.cos((x - z) * 0.009) * 1.7;
  const detail = Math.sin(x * 0.19 + seed) * Math.cos(z * 0.17 - seed) * 0.22;
  return rolling + mid + detail;
}

function terrainColor(height) {
  if (height < -1.4) return 0x2d684d;
  if (height > 3.2) return 0x8b6d43;
  if (height > 1.6) return 0x5f7d3b;
  return 0x3e8b4e;
}

function createTerrainSystem(THREE, scene, config = {}) {
  const chunkSize = Number(config.chunkSize ?? 44);
  const radius = Math.max(1, Math.min(5, Math.trunc(config.chunkRadius ?? 3)));
  const segments = Math.max(8, Math.min(28, Math.trunc(config.chunkSegments ?? 18)));
  const seed = seedNumber(config.seed ?? "terrain");
  const group = new THREE.Group();
  group.name = "InfiniteTerrainSystem";
  scene.add(group);

  const terrainMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.94, metalness: 0.02 });
  const chunks = [];
  let lastCx = Infinity;
  let lastCz = Infinity;
  const tempColor = new THREE.Color();

  function buildChunk(mesh, cx, cz) {
    const geometry = mesh.geometry;
    const positions = geometry.attributes.position;
    const colors = geometry.attributes.color;
    for (let i = 0; i < positions.count; i += 1) {
      const lx = positions.getX(i);
      const lz = positions.getY(i);
      const wx = cx * chunkSize + lx;
      const wz = cz * chunkSize + lz;
      const height = terrainHeight(wx, wz, seed);
      positions.setZ(i, height);
      tempColor.setHex(terrainColor(height));
      const shade = 0.86 + hash2(Math.floor(wx * 0.25), Math.floor(wz * 0.25), seed) * 0.22;
      colors.setXYZ(i, tempColor.r * shade, tempColor.g * shade, tempColor.b * shade);
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.computeVertexNormals();
    mesh.position.set(cx * chunkSize, 0, cz * chunkSize);
    mesh.userData.cx = cx;
    mesh.userData.cz = cz;
  }

  for (let dz = -radius; dz <= radius; dz += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const geometry = new THREE.PlaneGeometry(chunkSize, chunkSize, segments, segments);
      geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(geometry.attributes.position.count * 3), 3));
      geometry.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(geometry, terrainMaterial);
      mesh.frustumCulled = false;
      mesh.receiveShadow = true;
      group.add(mesh);
      chunks.push({ mesh, dx, dz });
    }
  }

  function update(centerX, centerZ) {
    const cx = Math.floor(centerX / chunkSize);
    const cz = Math.floor(centerZ / chunkSize);
    if (cx === lastCx && cz === lastCz) return false;
    lastCx = cx;
    lastCz = cz;
    for (const chunk of chunks) buildChunk(chunk.mesh, cx + chunk.dx, cz + chunk.dz);
    return true;
  }

  return { group, chunkSize, radius, seed, chunks, update, sampleHeight: (x, z) => terrainHeight(x, z, seed) };
}

function makeDino(THREE) {
  const group = new THREE.Group();
  group.name = "DinoObject";
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x7cc66a, roughness: 0.82, metalness: 0.02 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: 0xe3c77a, roughness: 0.9 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x101018, emissive: 0x1e9cff, emissiveIntensity: 0.35 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 12), bodyMat);
  body.scale.set(1.15, 0.78, 1.45);
  body.position.y = 0.78;
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 10), bellyMat);
  belly.scale.set(0.9, 0.58, 0.72);
  belly.position.set(0, 0.7, -0.2);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 12), bodyMat);
  head.scale.set(0.92, 0.74, 1.12);
  head.position.set(0, 1.22, 0.82);
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.25, 0.45), bodyMat);
  snout.position.set(0, 1.14, 1.2);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.55, 12), bodyMat);
  tail.rotation.x = Math.PI / 2;
  tail.position.set(0, 0.82, -1.16);
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), eyeMat);
  eyeL.position.set(-0.17, 1.29, 1.2);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.17;

  const legGeo = new THREE.BoxGeometry(0.2, 0.58, 0.24);
  const legL = new THREE.Mesh(legGeo, bodyMat);
  legL.position.set(-0.28, 0.2, 0.26);
  const legR = legL.clone();
  legR.position.x = 0.28;
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.38, 0.12), bodyMat);
  armL.position.set(-0.46, 0.76, 0.72);
  armL.rotation.z = 0.45;
  const armR = armL.clone();
  armR.position.x = 0.46;
  armR.rotation.z = -0.45;
  group.add(body, belly, head, snout, tail, eyeL, eyeR, legL, legR, armL, armR);
  group.userData = { body, head, tail, legL, legR, armL, armR };
  return group;
}

function createSkyMesh(THREE) {
  const geometry = new THREE.SphereGeometry(620, 48, 24);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new THREE.Color("#241052") },
      midColor: { value: new THREE.Color("#6d4cab") },
      horizonColor: { value: new THREE.Color("#ffb56d") },
      lowerColor: { value: new THREE.Color("#120914") }
    },
    vertexShader: `varying vec3 vPos; void main(){ vPos = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec3 vPos; uniform vec3 topColor; uniform vec3 midColor; uniform vec3 horizonColor; uniform vec3 lowerColor; void main(){ float h = clamp(vPos.y * 0.5 + 0.5, 0.0, 1.0); vec3 low = mix(lowerColor, horizonColor, smoothstep(0.05, 0.38, h)); vec3 high = mix(midColor, topColor, smoothstep(0.45, 1.0, h)); vec3 col = mix(low, high, smoothstep(0.32, 0.74, h)); gl_FragColor = vec4(col, 1.0); }`
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  return mesh;
}

function createBirdMesh(THREE) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([
    -0.35, 0, 0, 0, 0.07, 0.05, 0.35, 0, 0,
    -0.35, 0, 0, 0, -0.07, -0.05, 0.35, 0, 0
  ], 3));
  return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x18111f, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
}

function createRunnerState(tuning) {
  const motion = tuning.motion ?? FALLBACK_TUNING.motion;
  return {
    x: 0,
    z: 0,
    terrainY: 0,
    jumpY: 0,
    verticalVelocity: 0,
    grounded: true,
    coyote: 0,
    jumpBuffer: 0,
    yaw: 0,
    speed: motion.baseForwardSpeed ?? 13.5,
    distance: 0,
    bestDistance: Number(localStorage.getItem("prehistoricRush.bestDistance") ?? 0),
    shards: 0,
    time: 0,
    goalDistance: 3600,
    terrainChunk: { x: 0, z: 0 },
    activeColliders: [],
    activePickups: [],
    flock: Array.from({ length: 36 }, (_, i) => ({
      x: (hash2(i, 1, 3) - 0.5) * 80,
      y: 14 + hash2(i, 2, 9) * 18,
      z: 35 + hash2(i, 3, 14) * 120,
      phase: hash2(i, 4, 19) * Math.PI * 2,
      layer: i % 2 ? "mid" : "far"
    }))
  };
}

function createThreeWorld(THREE, host, tuning) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x241052, 70, 360);

  const camera = new THREE.PerspectiveCamera(64, innerWidth / innerHeight, 0.1, 900);
  camera.position.set(0, 6.0, -11);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.append(renderer.domElement);

  const sky = createSkyMesh(THREE);
  scene.add(sky);
  scene.add(new THREE.AmbientLight(0xffe8ba, 1.25));
  const sun = new THREE.DirectionalLight(0xffd37a, 2.4);
  sun.position.set(-10, 24, -8);
  scene.add(sun);

  const world = new THREE.Group();
  scene.add(world);
  const terrain = createTerrainSystem(THREE, world, tuning.terrain ?? FALLBACK_TUNING.terrain);

  const dino = makeDino(THREE);
  world.add(dino);

  const dummy = new THREE.Object3D();
  const rockMesh = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.7, 0), new THREE.MeshStandardMaterial({ color: 0x806143, roughness: 0.92 }), 420);
  const shardMesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.34, 0), new THREE.MeshStandardMaterial({ color: 0x8fe8ff, emissive: 0x43d4ff, emissiveIntensity: 0.95, roughness: 0.35 }), 220);
  const treeMesh = new THREE.InstancedMesh(new THREE.ConeGeometry(0.95, 3.5, 7), new THREE.MeshStandardMaterial({ color: 0x2f9c5a, roughness: 0.9 }), 520);
  world.add(rockMesh, shardMesh, treeMesh);

  const flockGroup = new THREE.Group();
  const birds = Array.from({ length: 48 }, () => {
    const bird = createBirdMesh(THREE);
    flockGroup.add(bird);
    return bird;
  });
  world.add(flockGroup);

  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(innerWidth, innerHeight);
  }
  addEventListener("resize", resize);

  return { scene, camera, renderer, sky, world, terrain, dino, dummy, rockMesh, shardMesh, treeMesh, birds };
}

function collectVisibleTerrainObjects(app) {
  const THREE = app.THREE;
  const { terrain, dummy, rockMesh, shardMesh, treeMesh } = app.three;
  const state = app.runner;
  const chunkSize = terrain.chunkSize;
  const cx = Math.floor(state.x / chunkSize);
  const cz = Math.floor(state.z / chunkSize);
  const radius = terrain.radius;
  const seed = terrain.seed;
  let rockCount = 0;
  let shardCount = 0;
  let treeCount = 0;
  state.activeColliders.length = 0;
  state.activePickups.length = 0;

  for (let zc = cz - radius; zc <= cz + radius; zc += 1) {
    for (let xc = cx - radius; xc <= cx + radius; xc += 1) {
      for (let i = 0; i < 7; i += 1) {
        const rx = (hash2(xc * 31 + i, zc * 17, seed) - 0.5) * chunkSize;
        const rz = (hash2(xc * 19, zc * 23 + i, seed) - 0.5) * chunkSize;
        const wx = xc * chunkSize + rx;
        const wz = zc * chunkSize + rz;
        const y = terrain.sampleHeight(wx, wz);
        dummy.position.set(wx, y + 1.75, wz);
        dummy.rotation.set(0, hash2(xc, zc, i + seed) * Math.PI * 2, 0);
        const scale = 0.7 + hash2(xc + i, zc - i, seed) * 0.75;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        if (treeCount < treeMesh.count) treeMesh.setMatrixAt(treeCount++, dummy.matrix);
      }

      for (let i = 0; i < 4; i += 1) {
        const rx = (hash2(xc * 41 + i, zc * 29, seed + 8) - 0.5) * chunkSize;
        const rz = (hash2(xc * 37, zc * 11 + i, seed + 8) - 0.5) * chunkSize;
        const wx = xc * chunkSize + rx;
        const wz = zc * chunkSize + rz;
        const y = terrain.sampleHeight(wx, wz);
        dummy.position.set(wx, y + 0.55, wz);
        dummy.rotation.set(hash2(xc, zc, i) * 0.5, hash2(zc, i, xc) * Math.PI, 0);
        const scale = 0.65 + hash2(i, xc, zc) * 0.65;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        if (rockCount < rockMesh.count) rockMesh.setMatrixAt(rockCount++, dummy.matrix);
        state.activeColliders.push({ x: wx, y, z: wz, radius: 0.95 * scale });
      }

      for (let i = 0; i < 2; i += 1) {
        const rx = (hash2(xc * 13 + i, zc * 43, seed + 21) - 0.5) * chunkSize;
        const rz = (hash2(xc * 7, zc * 53 + i, seed + 21) - 0.5) * chunkSize;
        const wx = xc * chunkSize + rx;
        const wz = zc * chunkSize + rz;
        const key = `${xc}:${zc}:${i}`;
        if (app.collectedPickups.has(key)) continue;
        const y = terrain.sampleHeight(wx, wz);
        dummy.position.set(wx, y + 1.25 + Math.sin(app.time * 4 + i) * 0.12, wz);
        dummy.rotation.set(app.time * 1.2, app.time * 2.1, 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        if (shardCount < shardMesh.count) shardMesh.setMatrixAt(shardCount++, dummy.matrix);
        state.activePickups.push({ key, x: wx, y, z: wz, radius: 1.15 });
      }
    }
  }

  rockMesh.count = rockCount;
  shardMesh.count = shardCount;
  treeMesh.count = treeCount;
  rockMesh.instanceMatrix.needsUpdate = true;
  shardMesh.instanceMatrix.needsUpdate = true;
  treeMesh.instanceMatrix.needsUpdate = true;
}

function resetRun(app) {
  app.runner = createRunnerState(app.tuning);
  app.collectedPickups = new Set();
  app.three.terrain.update(app.runner.x, app.runner.z);
  collectVisibleTerrainObjects(app);
}

function transition(app, eventName) {
  const key = `${app.scene}:${eventName}`;
  const next = app.sceneGraph.transitions?.[key];
  if (!next) return;
  app.scene = next;
  if (next === "game") resetRun(app);
  const preset = next === "run-over" ? "storm-front" : "golden-horizon";
  try { app.engine.n.coreSkybox?.setPreset?.(preset); } catch {}
}

function updateRun(app, dt) {
  const state = app.runner;
  const motion = app.tuning.motion ?? FALLBACK_TUNING.motion;
  state.time += dt;

  const turn = (app.input.left ? 1 : 0) - (app.input.right ? 1 : 0);
  state.yaw = wrapAngle(state.yaw + turn * (motion.turnRate ?? 2.45) * dt);
  const targetSpeed = app.input.boost ? (motion.boostForwardSpeed ?? 29) : (motion.maxForwardSpeed ?? 24);
  state.speed += (targetSpeed - state.speed) * Math.min(1, dt * 2.2);

  if (app.input.jump) state.jumpBuffer = motion.inputBufferSeconds ?? 0.12;
  state.jumpBuffer = Math.max(0, state.jumpBuffer - dt);
  state.coyote = Math.max(0, state.coyote - dt);
  if (state.jumpBuffer > 0 && (state.grounded || state.coyote > 0)) {
    state.verticalVelocity = motion.jumpImpulse ?? 13.5;
    state.grounded = false;
    state.jumpBuffer = 0;
    state.coyote = 0;
  }

  state.verticalVelocity -= (motion.jumpGravity ?? 34) * dt;
  state.jumpY += state.verticalVelocity * dt;
  if (state.jumpY <= 0) {
    if (!state.grounded) state.coyote = motion.coyoteSeconds ?? 0.08;
    state.jumpY = 0;
    state.verticalVelocity = 0;
    state.grounded = true;
  } else {
    state.grounded = false;
  }

  const dx = Math.sin(state.yaw) * state.speed * dt;
  const dz = Math.cos(state.yaw) * state.speed * dt;
  state.x += dx;
  state.z += dz;
  state.distance += Math.hypot(dx, dz);
  state.bestDistance = Math.max(state.bestDistance, state.distance);
  state.terrainY = app.three.terrain.sampleHeight(state.x, state.z);

  const terrainChanged = app.three.terrain.update(state.x, state.z);
  if (terrainChanged || app.frameIndex % 8 === 0) collectVisibleTerrainObjects(app);

  for (const pickup of state.activePickups) {
    if (Math.hypot(pickup.x - state.x, pickup.z - state.z) < pickup.radius + 0.55 && state.jumpY < 2.4) {
      app.collectedPickups.add(pickup.key);
      state.shards += 1;
      collectVisibleTerrainObjects(app);
      break;
    }
  }

  for (const collider of state.activeColliders) {
    const hit = Math.hypot(collider.x - state.x, collider.z - state.z) < collider.radius + 0.45 && state.jumpY < 1.2;
    if (hit) {
      localStorage.setItem("prehistoricRush.bestDistance", String(Math.floor(state.bestDistance)));
      transition(app, "runOver");
      return;
    }
  }

  if (state.distance >= state.goalDistance) {
    localStorage.setItem("prehistoricRush.bestDistance", String(Math.floor(state.bestDistance)));
    transition(app, "win");
  }
}

function updateFlock(app, dt) {
  for (const bird of app.runner.flock) {
    bird.phase += dt * 4;
    bird.x += dt * 2.2;
    if (bird.x > 48) bird.x = -48;
  }
}

function updateSky(app) {
  const THREE = app.THREE;
  const descriptor = app.engine.n.coreSkybox?.getRenderDescriptor?.();
  const gradient = descriptor?.gradient ?? {};
  const uniforms = app.three.sky.material.uniforms;
  uniforms.topColor.value = new THREE.Color(gradient.topColor ?? "#241052");
  uniforms.midColor.value = new THREE.Color(gradient.midColor ?? "#6d4cab");
  uniforms.horizonColor.value = new THREE.Color(gradient.horizonColor ?? "#ffb56d");
  uniforms.lowerColor.value = new THREE.Color(gradient.lowerColor ?? "#120914");
  app.three.sky.position.copy(app.three.camera.position);
}

function syncThree(app, dt) {
  const THREE = app.THREE;
  const three = app.three;
  const state = app.runner;
  updateSky(app);

  const dinoY = state.terrainY + state.jumpY + 0.12;
  const dino = three.dino;
  dino.position.set(state.x, dinoY, state.z);
  dino.rotation.y = state.yaw;
  dino.rotation.z = Math.sin(state.time * 4) * 0.035;
  const parts = dino.userData;
  const stride = Math.sin(state.time * Math.max(8, state.speed * 0.9));
  if (parts.legL) parts.legL.rotation.x = stride * 0.55;
  if (parts.legR) parts.legR.rotation.x = -stride * 0.55;
  if (parts.armL) parts.armL.rotation.x = -stride * 0.35;
  if (parts.armR) parts.armR.rotation.x = stride * 0.35;
  if (parts.tail) parts.tail.rotation.z = Math.sin(state.time * 4) * 0.14;

  for (let i = 0; i < three.birds.length; i += 1) {
    const birdData = state.flock[i];
    const bird = three.birds[i];
    bird.visible = Boolean(birdData);
    if (!birdData) continue;
    const sideX = Math.cos(state.yaw) * birdData.x;
    const sideZ = -Math.sin(state.yaw) * birdData.x;
    const forwardX = Math.sin(state.yaw) * birdData.z;
    const forwardZ = Math.cos(state.yaw) * birdData.z;
    bird.position.set(state.x + sideX + forwardX, state.terrainY + birdData.y, state.z + sideZ + forwardZ);
    bird.rotation.y = state.yaw + Math.PI;
    bird.scale.setScalar(birdData.layer === "mid" ? 0.95 : 0.55);
    bird.rotation.z = Math.sin(birdData.phase) * 0.2;
  }

  const targetFov = (app.tuning.camera?.fovBase ?? 64) + Math.min(1, state.speed / (app.tuning.motion?.maxForwardSpeed ?? 24)) * 10;
  three.camera.fov += (targetFov - three.camera.fov) * Math.min(1, dt * 5);
  three.camera.updateProjectionMatrix();

  const back = new THREE.Vector3(-Math.sin(state.yaw), 0, -Math.cos(state.yaw));
  const side = new THREE.Vector3(Math.cos(state.yaw), 0, -Math.sin(state.yaw));
  const desired = new THREE.Vector3(state.x, dinoY + 4.7, state.z).addScaledVector(back, 11.5).addScaledVector(side, 1.2);
  three.camera.position.lerp(desired, Math.min(1, dt * 7.5));
  const look = new THREE.Vector3(state.x, dinoY + 1.35, state.z).addScaledVector(new THREE.Vector3(Math.sin(state.yaw), 0, Math.cos(state.yaw)), 15 + state.speed * 0.26);
  three.camera.lookAt(look);

  if (app.scene === "menu") {
    three.camera.position.lerp(new THREE.Vector3(state.x + Math.sin(app.time * 0.35) * 9, state.terrainY + 7.2, state.z - 16), Math.min(1, dt * 2.2));
    three.camera.lookAt(new THREE.Vector3(state.x, dinoY + 1.2, state.z + 10));
  }
  if (app.scene === "run-over") {
    three.camera.position.lerp(new THREE.Vector3(state.x + 4, dinoY + 2.2, state.z - 5), Math.min(1, dt * 4));
    three.camera.lookAt(new THREE.Vector3(state.x, dinoY + 0.5, state.z));
  }
  if (app.scene === "win") {
    three.camera.position.lerp(new THREE.Vector3(state.x, dinoY + 8, state.z - 22), Math.min(1, dt * 2.8));
    three.camera.lookAt(new THREE.Vector3(state.x, dinoY + 1.2, state.z + 20));
  }
}

function updateHud(app) {
  const state = app.runner;
  const scene = app.scene;
  app.ui.title.textContent = scene === "menu" ? "Prehistoric Rush" : scene === "run-over" ? "Run Over" : scene === "win" ? "Open Terrain Cleared" : "Prehistoric Rush";
  app.ui.status.innerHTML = [
    `Scene: <b>${scene}</b>`,
    `Distance: ${Math.floor(state.distance)}m / ${state.goalDistance}m`,
    `Speed: ${state.speed.toFixed(1)} m/s`,
    `Heading: ${Math.round((state.yaw * 180) / Math.PI)}°`,
    `Shards: ${state.shards}`,
    `Best: ${Math.floor(state.bestDistance)}m`,
    "Infinite terrain, free steering, no stop"
  ].join("<br>");
  app.ui.action.textContent = scene === "menu" ? "Start Rush" : scene === "run-over" ? "Retry" : scene === "win" ? "Run Again" : "Jump";
}

function bindInput(app) {
  addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) event.preventDefault();
    if (event.code === "ArrowLeft" || event.code === "KeyA") app.input.left = true;
    if (event.code === "ArrowRight" || event.code === "KeyD") app.input.right = true;
    if (event.code === "ArrowUp" || event.code === "KeyW") app.input.boost = true;
    if (event.code === "Space") {
      if (app.scene === "menu") transition(app, "start");
      else if (app.scene === "run-over") transition(app, "retry");
      else if (app.scene === "win") transition(app, "again");
      else app.input.jump = true;
    }
    if (event.code === "Enter") {
      if (app.scene === "menu") transition(app, "start");
      else if (app.scene === "run-over") transition(app, "retry");
      else if (app.scene === "win") transition(app, "again");
    }
  });
  addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft" || event.code === "KeyA") app.input.left = false;
    if (event.code === "ArrowRight" || event.code === "KeyD") app.input.right = false;
    if (event.code === "ArrowUp" || event.code === "KeyW") app.input.boost = false;
  });
  app.ui.action.addEventListener("click", () => {
    if (app.scene === "menu") transition(app, "start");
    else if (app.scene === "run-over") transition(app, "retry");
    else if (app.scene === "win") transition(app, "again");
    else app.input.jump = true;
  });
}

function consumeFrameInput(app) {
  app.input.jump = false;
}

async function main() {
  const ui = createShell();
  const [THREE, NexusEngine, sceneGraph, loadedTuning] = await Promise.all([
    loadModule(THREE_URL, "Three.js"),
    loadModule(ENGINE_URL, "NexusEngine"),
    loadJson("./game-scenes.json", FALLBACK_SCENE_GRAPH),
    loadJson("./runner-tuning.json", FALLBACK_TUNING)
  ]);

  if (!THREE) {
    ui.status.textContent = "Three.js failed to load.";
    return;
  }

  const tuning = { ...FALLBACK_TUNING, ...loadedTuning, motion: { ...FALLBACK_TUNING.motion, ...(loadedTuning.motion ?? {}) }, terrain: { ...FALLBACK_TUNING.terrain, ...(loadedTuning.terrain ?? {}) }, camera: { ...FALLBACK_TUNING.camera, ...(loadedTuning.camera ?? {}) } };
  const engine = installEngine(NexusEngine);
  const app = {
    THREE,
    ui,
    engine,
    sceneGraph,
    tuning,
    scene: sceneGraph.entryScene ?? "menu",
    input: { left: false, right: false, boost: false, jump: false },
    runner: null,
    time: 0,
    frameIndex: 0,
    last: performance.now(),
    three: null,
    collectedPickups: new Set()
  };

  app.three = createThreeWorld(THREE, ui.renderHost, tuning);
  resetRun(app);
  bindInput(app);

  function frame(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - app.last) / 1000));
    app.last = now;
    app.time += dt;
    app.frameIndex += 1;

    if (app.scene === "game") updateRun(app, dt);
    else updateFlock(app, dt * 0.45);
    updateFlock(app, dt);
    syncThree(app, dt);
    updateHud(app);
    consumeFrameInput(app);
    app.three.renderer.render(app.three.scene, app.three.camera);
    requestAnimationFrame(frame);
  }

  globalThis.PrehistoricRushHost = {
    app,
    engine,
    getState: () => ({
      scene: app.scene,
      runner: app.runner,
      terrain: {
        chunkSize: app.three.terrain.chunkSize,
        chunkRadius: app.three.terrain.radius,
        chunkCount: app.three.terrain.chunks.length,
        activeColliders: app.runner.activeColliders.length,
        activePickups: app.runner.activePickups.length
      },
      skybox: app.engine.n.coreSkybox?.getRenderDescriptor?.(),
      sceneGraph: app.sceneGraph,
      renderer: "three-infinite-terrain"
    })
  };

  requestAnimationFrame(frame);
}

main().catch((error) => {
  console.error(error);
  document.body.textContent = `PrehistoricRush failed to boot: ${error.message}`;
});
