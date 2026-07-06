const ENGINE_URL = "https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine@main/src/index.js";
const RUN_MOVEMENT_URL = "https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusRealtime-ProtoKits@main/protokits/run-movement-kit/index.js";
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
    baseForwardSpeed: 8.5,
    maxForwardSpeed: 18,
    speedRampPerMinute: 1.15,
    lanePositions: [-2.4, 0, 2.4],
    laneChangeEase: 16,
    bankDegrees: 11,
    jumpGravity: 34,
    jumpImpulse: 13.5,
    coyoteSeconds: 0.08,
    inputBufferSeconds: 0.12
  },
  camera: {
    followLagSeconds: 0.08,
    lookAheadMeters: 9,
    fovBase: 62,
    fovAtMaxSpeed: 68
  },
  streaming: {
    segmentLength: 24,
    lookAheadSegments: 7,
    recycleBehindSegments: 3,
    objectPoolSize: 64,
    seed: "prehistoric-rush-v0"
  },
  rules: {
    minimumReactionSeconds: 0.75,
    neverBlockAllLanes: true,
    validateJumpGapsAgainstCurrentSpeed: true,
    reliefAfterDenseSegment: true
  }
};

const FALLBACK_FLOCK = {
  model: "flock-lite",
  maxAgents: 36,
  updateHz: 20,
  depthLayers: [
    { id: "far", scale: 0.35, alpha: 0.32, parallax: 0.08 },
    { id: "mid", scale: 0.65, alpha: 0.55, parallax: 0.18 }
  ],
  visuals: {
    frequencyRange: [2.2, 4.8],
    amplitudeRange: [0.18, 0.42]
  }
};

function clone(value) {
  return value == null ? value : typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function mulberry32(seedText = "seed") {
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    seed = Math.imul(seed ^ seedText.charCodeAt(i), 2654435761) >>> 0;
  }
  return function next() {
    seed += 0x6D2B79F5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
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

function installEngine(NexusEngine, RunMovement, tuning) {
  const motion = tuning.motion ?? FALLBACK_TUNING.motion;
  const runMovementOptions = {
    actorId: "dino",
    lanePositions: motion.lanePositions,
    baseForwardSpeed: motion.baseForwardSpeed,
    maxForwardSpeed: motion.maxForwardSpeed,
    speedRampPerMinute: motion.speedRampPerMinute,
    laneChangeEase: motion.laneChangeEase,
    jumpGravity: motion.jumpGravity,
    jumpImpulse: motion.jumpImpulse,
    coyoteSeconds: motion.coyoteSeconds,
    inputBufferSeconds: motion.inputBufferSeconds,
    bankDegrees: motion.bankDegrees
  };

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
      NexusEngine.createCoreCompositionKit?.(),
      RunMovement?.createRunMovementKit?.(NexusEngine, runMovementOptions)
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
    minWidth: "240px",
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
  return { mount, renderHost, hud, title, status, action };
}

function createRunnerState(tuning, flockConfig) {
  const random = mulberry32(tuning.streaming?.seed ?? "prehistoric-rush-v0");
  const lanePositions = tuning.motion?.lanePositions ?? [-2.4, 0, 2.4];
  const flock = [];
  const maxAgents = Math.min(48, Number(flockConfig.maxAgents ?? 36));
  for (let i = 0; i < maxAgents; i += 1) {
    flock.push({
      x: (random() - 0.5) * 80,
      y: 12 + random() * 18,
      z: 30 + random() * 130,
      vx: 0.8 + random() * 1.8,
      phase: random() * Math.PI * 2,
      layer: i % 2 ? "mid" : "far"
    });
  }

  return {
    random,
    distance: 0,
    bestDistance: Number(localStorage.getItem("prehistoricRush.bestDistance") ?? 0),
    speed: tuning.motion?.baseForwardSpeed ?? 8.5,
    lane: 1,
    laneX: lanePositions[1] ?? 0,
    y: 0,
    vy: 0,
    onGround: true,
    coyote: 0,
    jumpBuffer: 0,
    shards: 0,
    nearMisses: 0,
    time: 0,
    goalDistance: 720,
    obstacles: [],
    pickups: [],
    nextSegment: 0,
    flock
  };
}

function spawnSegments(state, tuning) {
  const segmentLength = tuning.streaming?.segmentLength ?? 24;
  const lookAhead = tuning.streaming?.lookAheadSegments ?? 7;
  const target = state.distance + segmentLength * lookAhead;
  const lanes = tuning.motion?.lanePositions ?? [-2.4, 0, 2.4];

  while (state.nextSegment * segmentLength < target) {
    const z0 = state.nextSegment * segmentLength + 34;
    const difficulty = Math.min(1, state.distance / 900);
    const count = state.random() < 0.48 + difficulty * 0.24 ? 2 : 1;
    const blocked = new Set();

    for (let i = 0; i < count; i += 1) {
      const lane = Math.floor(state.random() * lanes.length);
      if (blocked.size >= lanes.length - 1) break;
      blocked.add(lane);
      state.obstacles.push({
        lane,
        z: z0 + 5 + state.random() * (segmentLength - 8),
        kind: state.random() > 0.5 ? "bone" : "fern"
      });
    }

    if (state.random() > 0.35) {
      const lane = Math.floor(state.random() * lanes.length);
      state.pickups.push({ lane, z: z0 + 8 + state.random() * (segmentLength - 10), taken: false });
    }

    state.nextSegment += 1;
  }

  state.obstacles = state.obstacles.filter((object) => object.z > state.distance - 10);
  state.pickups = state.pickups.filter((object) => object.z > state.distance - 10 && !object.taken);
}

function resetRun(app) {
  app.runner = createRunnerState(app.tuning, app.flockConfig);
  app.engine.n.runMovement?.reset?.(app.tuning.motion ?? FALLBACK_TUNING.motion);
  app.engine.n.runMovement?.attach?.("dino");
  spawnSegments(app.runner, app.tuning);
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
  const tuning = app.tuning;
  const motion = tuning.motion ?? FALLBACK_TUNING.motion;
  const lanePositions = motion.lanePositions ?? [-2.4, 0, 2.4];
  const runApi = app.engine.n.runMovement;

  state.time += dt;

  if (runApi?.tick) {
    if (app.input.leftPressed) runApi.moveLeft?.("dino");
    if (app.input.rightPressed) runApi.moveRight?.("dino");
    if (app.input.jumpPressed) runApi.jump?.("dino");
    runApi.tick(dt);
    const controller = runApi.getController?.("dino");
    if (controller) {
      state.distance = controller.distance;
      state.speed = controller.forwardSpeed;
      state.lane = controller.lane;
      state.laneX = controller.laneX;
      state.y = controller.height;
      state.vy = controller.verticalVelocity;
      state.onGround = controller.grounded;
      state.coyote = controller.coyoteTimer;
      state.jumpBuffer = controller.jumpBuffer;
    }
  } else {
    state.speed = Math.min(motion.maxForwardSpeed ?? 18, (motion.baseForwardSpeed ?? 8.5) + state.time * ((motion.speedRampPerMinute ?? 1.15) / 60));
    state.distance += state.speed * dt;
    if (app.input.leftPressed) state.lane = Math.max(0, state.lane - 1);
    if (app.input.rightPressed) state.lane = Math.min(lanePositions.length - 1, state.lane + 1);
    if (app.input.jumpPressed) state.jumpBuffer = motion.inputBufferSeconds ?? 0.12;
    state.jumpBuffer = Math.max(0, state.jumpBuffer - dt);
    state.coyote = Math.max(0, state.coyote - dt);
    if (state.jumpBuffer > 0 && (state.onGround || state.coyote > 0)) {
      state.vy = motion.jumpImpulse ?? 13.5;
      state.onGround = false;
      state.coyote = 0;
      state.jumpBuffer = 0;
    }
    state.vy -= (motion.jumpGravity ?? 34) * dt;
    state.y += state.vy * dt;
    if (state.y <= 0) {
      state.y = 0;
      state.vy = 0;
      if (!state.onGround) state.coyote = motion.coyoteSeconds ?? 0.08;
      state.onGround = true;
    } else {
      state.onGround = false;
    }
    const targetX = lanePositions[state.lane] ?? 0;
    state.laneX += (targetX - state.laneX) * Math.min(1, (motion.laneChangeEase ?? 16) * dt);
  }

  state.bestDistance = Math.max(state.bestDistance, state.distance);
  spawnSegments(state, tuning);

  for (const pickup of state.pickups) {
    if (pickup.taken) continue;
    if (Math.abs(pickup.z - state.distance) < 1.1 && pickup.lane === state.lane && state.y < 2) {
      pickup.taken = true;
      state.shards += 1;
    }
  }

  for (const obstacle of state.obstacles) {
    const dz = Math.abs(obstacle.z - state.distance);
    if (dz < 0.75 && obstacle.lane === state.lane && state.y < 1.4) {
      localStorage.setItem("prehistoricRush.bestDistance", String(Math.floor(state.bestDistance)));
      transition(app, "runOver");
      return;
    }
    if (dz < 1.1 && obstacle.lane !== state.lane) state.nearMisses += dt * 0.5;
  }

  if (state.distance >= state.goalDistance) {
    localStorage.setItem("prehistoricRush.bestDistance", String(Math.floor(state.bestDistance)));
    transition(app, "win");
  }
}

function updateFlock(app, dt) {
  for (const bird of app.runner.flock) {
    bird.phase += dt * 4;
    bird.x += bird.vx * dt;
    bird.y += Math.sin(bird.phase) * 0.02;
    if (bird.x > 46) bird.x = -46;
  }
}

function createSkyMesh(THREE) {
  const geometry = new THREE.SphereGeometry(420, 48, 24);
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

function makeDino(THREE) {
  const group = new THREE.Group();
  group.name = "DinoObject";

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x7cc66a, roughness: 0.82, metalness: 0.02 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: 0xe3c77a, roughness: 0.9 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x101018, emissive: 0x1e9cff, emissiveIntensity: 0.35 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 18, 12), bodyMat);
  body.scale.set(1.15, 0.78, 1.45);
  body.position.y = 0.78;
  group.add(body);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 10), bellyMat);
  belly.scale.set(0.9, 0.58, 0.72);
  belly.position.set(0, 0.7, -0.2);
  group.add(belly);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 12), bodyMat);
  head.scale.set(0.92, 0.74, 1.12);
  head.position.set(0, 1.22, 0.82);
  group.add(head);

  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.25, 0.45), bodyMat);
  snout.position.set(0, 1.14, 1.2);
  group.add(snout);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.55, 12), bodyMat);
  tail.rotation.x = Math.PI / 2;
  tail.position.set(0, 0.82, -1.16);
  group.add(tail);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), eyeMat);
  eyeL.position.set(-0.17, 1.29, 1.2);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.17;
  group.add(eyeL, eyeR);

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
  group.add(legL, legR, armL, armR);

  group.userData = { body, head, tail, legL, legR, armL, armR };
  return group;
}

function createBirdMesh(THREE) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute([
    -0.35, 0, 0, 0, 0.07, 0.05, 0.35, 0, 0,
    -0.35, 0, 0, 0, -0.07, -0.05, 0.35, 0, 0
  ], 3));
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x18111f, transparent: true, opacity: 0.55, side: THREE.DoubleSide }));
}

function createThreeWorld(THREE, host) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x241052, 42, 210);

  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 550);
  camera.position.set(0, 4.2, -8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.append(renderer.domElement);

  const sky = createSkyMesh(THREE);
  scene.add(sky);

  scene.add(new THREE.AmbientLight(0xffe8ba, 1.1));
  const sun = new THREE.DirectionalLight(0xffd37a, 2.2);
  sun.position.set(-10, 20, -8);
  scene.add(sun);

  const world = new THREE.Group();
  world.name = "PrehistoricRushWorld";
  scene.add(world);

  const trackGroup = new THREE.Group();
  const obstacleGroup = new THREE.Group();
  const pickupGroup = new THREE.Group();
  const flockGroup = new THREE.Group();
  world.add(trackGroup, obstacleGroup, pickupGroup, flockGroup);

  const trackMaterial = new THREE.MeshStandardMaterial({ color: 0x3f2418, roughness: 0.95 });
  const laneMaterial = new THREE.MeshBasicMaterial({ color: 0xffd37a, transparent: true, opacity: 0.35 });
  const trackMeshes = [];
  const laneMarkers = [];
  for (let i = 0; i < 14; i += 1) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.12, 23.6), trackMaterial);
    mesh.receiveShadow = true;
    trackGroup.add(mesh);
    trackMeshes.push(mesh);
  }
  for (let i = 0; i < 42; i += 1) {
    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 8), laneMaterial);
    trackGroup.add(marker);
    laneMarkers.push(marker);
  }

  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x2d6441, roughness: 0.92 });
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.4, 260), wallMaterial);
  wallL.position.set(-6.15, 1.65, 80);
  const wallR = wallL.clone();
  wallR.position.x = 6.15;
  world.add(wallL, wallR);

  const dino = makeDino(THREE);
  world.add(dino);

  const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xb99157, roughness: 0.8 });
  const fernMaterial = new THREE.MeshStandardMaterial({ color: 0x2f9c5a, roughness: 0.9 });
  const pickupMaterial = new THREE.MeshStandardMaterial({ color: 0x8fe8ff, emissive: 0x47cfff, emissiveIntensity: 0.8, roughness: 0.35 });
  const obstaclePool = [];
  const pickupPool = [];

  for (let i = 0; i < 72; i += 1) {
    const bone = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.1, 0.68), obstacleMaterial);
    const fern = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.45, 8), fernMaterial);
    fern.position.y = 0.6;
    bone.visible = false;
    fern.visible = false;
    obstacleGroup.add(bone, fern);
    obstaclePool.push({ bone, fern });
  }

  for (let i = 0; i < 48; i += 1) {
    const pickup = new THREE.Mesh(new THREE.OctahedronGeometry(0.36, 0), pickupMaterial);
    pickup.visible = false;
    pickupGroup.add(pickup);
    pickupPool.push(pickup);
  }

  const birdPool = [];
  for (let i = 0; i < 48; i += 1) {
    const bird = createBirdMesh(THREE);
    flockGroup.add(bird);
    birdPool.push(bird);
  }

  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(innerWidth, innerHeight);
  }
  addEventListener("resize", resize);

  return { scene, camera, renderer, sky, world, dino, trackMeshes, laneMarkers, obstaclePool, pickupPool, birdPool, resize };
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
  const lanes = app.tuning.motion?.lanePositions ?? [-2.4, 0, 2.4];
  const segmentLength = app.tuning.streaming?.segmentLength ?? 24;
  const baseSegment = Math.floor((state.distance - 24) / segmentLength);

  updateSky(app);

  for (let i = 0; i < three.trackMeshes.length; i += 1) {
    const z = (baseSegment + i) * segmentLength + segmentLength * 0.5;
    const mesh = three.trackMeshes[i];
    mesh.position.set(0, -0.08, z);
  }

  for (let i = 0; i < three.laneMarkers.length; i += 1) {
    const marker = three.laneMarkers[i];
    const markerSegment = Math.floor(i / 3);
    const laneIndex = i % 3;
    marker.position.set(lanes[laneIndex] ?? 0, 0.025, (baseSegment + markerSegment) * segmentLength + 8);
  }

  const dino = three.dino;
  dino.position.set(state.laneX, 0.12 + state.y, state.distance);
  dino.rotation.z = THREE.MathUtils.degToRad(-Math.max(-14, Math.min(14, (lanes[state.lane] ?? 0) - state.laneX)) * 6);
  dino.rotation.y = Math.sin(state.time * 8) * 0.025;
  const parts = dino.userData;
  const stride = Math.sin(state.time * Math.max(6, state.speed * 0.9));
  if (parts.legL) parts.legL.rotation.x = stride * 0.55;
  if (parts.legR) parts.legR.rotation.x = -stride * 0.55;
  if (parts.armL) parts.armL.rotation.x = -stride * 0.35;
  if (parts.armR) parts.armR.rotation.x = stride * 0.35;
  if (parts.tail) parts.tail.rotation.z = Math.sin(state.time * 4) * 0.14;

  for (const pair of three.obstaclePool) {
    pair.bone.visible = false;
    pair.fern.visible = false;
  }
  const visibleObstacles = state.obstacles.filter((object) => object.z > state.distance - 8 && object.z < state.distance + 175);
  visibleObstacles.slice(0, three.obstaclePool.length).forEach((object, index) => {
    const pair = three.obstaclePool[index];
    const mesh = object.kind === "fern" ? pair.fern : pair.bone;
    mesh.visible = true;
    mesh.position.set(lanes[object.lane] ?? 0, object.kind === "fern" ? 0.75 : 0.55, object.z);
    mesh.rotation.y = object.kind === "fern" ? Math.sin(object.z) * 0.25 : object.z * 0.03;
  });

  for (const mesh of three.pickupPool) mesh.visible = false;
  const visiblePickups = state.pickups.filter((object) => !object.taken && object.z > state.distance - 6 && object.z < state.distance + 160);
  visiblePickups.slice(0, three.pickupPool.length).forEach((object, index) => {
    const mesh = three.pickupPool[index];
    mesh.visible = true;
    mesh.position.set(lanes[object.lane] ?? 0, 1.15 + Math.sin(app.time * 4 + index) * 0.12, object.z);
    mesh.rotation.set(app.time * 1.2, app.time * 2.1, 0);
  });

  for (let i = 0; i < three.birdPool.length; i += 1) {
    const birdData = state.flock[i];
    const bird = three.birdPool[i];
    bird.visible = Boolean(birdData);
    if (!birdData) continue;
    const z = state.distance + birdData.z;
    bird.position.set(birdData.x, birdData.y, z);
    bird.rotation.y = Math.PI;
    bird.scale.setScalar(birdData.layer === "mid" ? 0.95 : 0.55);
    bird.rotation.z = Math.sin(birdData.phase) * 0.2;
  }

  const targetFov = (app.tuning.camera?.fovBase ?? 62) + Math.min(1, state.speed / (app.tuning.motion?.maxForwardSpeed ?? 18)) * 6;
  three.camera.fov += (targetFov - three.camera.fov) * Math.min(1, dt * 5);
  three.camera.updateProjectionMatrix();

  const desired = new THREE.Vector3(state.laneX * 0.32, 4.2 + Math.min(1.2, state.y * 0.25), state.distance - 8.6 - Math.min(4, state.speed * 0.08));
  three.camera.position.lerp(desired, Math.min(1, dt * 7.5));
  const look = new THREE.Vector3(state.laneX * 0.25, 1.25 + state.y * 0.18, state.distance + 13 + state.speed * 0.35);
  three.camera.lookAt(look);

  if (app.scene === "menu") {
    three.camera.position.lerp(new THREE.Vector3(Math.sin(app.time * 0.35) * 3.8, 4.6, state.distance - 13), Math.min(1, dt * 2.2));
    three.camera.lookAt(new THREE.Vector3(0, 1.1, state.distance + 10));
  }
  if (app.scene === "run-over") {
    three.camera.position.lerp(new THREE.Vector3(state.laneX + 2.2, 1.6, state.distance - 4.2), Math.min(1, dt * 4));
    three.camera.lookAt(new THREE.Vector3(state.laneX, 0.6, state.distance));
  }
  if (app.scene === "win") {
    three.camera.position.lerp(new THREE.Vector3(0, 6.8, state.distance - 18), Math.min(1, dt * 2.8));
    three.camera.lookAt(new THREE.Vector3(0, 1.2, state.distance + 18));
  }
}

function updateHud(app) {
  const state = app.runner;
  const scene = app.scene;
  app.ui.title.textContent = scene === "menu" ? "Prehistoric Rush" : scene === "run-over" ? "Run Over" : scene === "win" ? "Fossil Gate Cleared" : "Prehistoric Rush";
  app.ui.status.innerHTML = [
    `Scene: <b>${scene}</b>`,
    `Distance: ${Math.floor(state.distance)}m / ${state.goalDistance}m`,
    `Shards: ${state.shards}`,
    `Best: ${Math.floor(state.bestDistance)}m`,
    "3D Three.js renderer active"
  ].join("<br>");
  app.ui.action.textContent = scene === "menu" ? "Start Rush" : scene === "run-over" ? "Retry" : scene === "win" ? "Run Again" : "Jump";
}

function bindInput(app) {
  addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) event.preventDefault();
    if (event.code === "ArrowLeft" || event.code === "KeyA") app.input.leftPressed = true;
    if (event.code === "ArrowRight" || event.code === "KeyD") app.input.rightPressed = true;
    if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space") {
      if (app.scene === "menu") transition(app, "start");
      else if (app.scene === "run-over") transition(app, "retry");
      else if (app.scene === "win") transition(app, "again");
      else app.input.jumpPressed = true;
    }
    if (event.code === "Enter") {
      if (app.scene === "menu") transition(app, "start");
      else if (app.scene === "run-over") transition(app, "retry");
      else if (app.scene === "win") transition(app, "again");
    }
  });

  app.ui.action.addEventListener("click", () => {
    if (app.scene === "menu") transition(app, "start");
    else if (app.scene === "run-over") transition(app, "retry");
    else if (app.scene === "win") transition(app, "again");
    else app.input.jumpPressed = true;
  });
}

function consumeInput(app) {
  app.input.leftPressed = false;
  app.input.rightPressed = false;
  app.input.jumpPressed = false;
}

async function main() {
  const ui = createShell();
  const [THREE, NexusEngine, RunMovement, sceneGraph, tuning, flockConfig] = await Promise.all([
    loadModule(THREE_URL, "Three.js"),
    loadModule(ENGINE_URL, "NexusEngine"),
    loadModule(RUN_MOVEMENT_URL, "run-movement-kit"),
    loadJson("./game-scenes.json", FALLBACK_SCENE_GRAPH),
    loadJson("./runner-tuning.json", FALLBACK_TUNING),
    loadJson("./flock-generation.json", FALLBACK_FLOCK)
  ]);

  if (!THREE) {
    ui.status.textContent = "Three.js failed to load.";
    return;
  }

  const engine = installEngine(NexusEngine, RunMovement, tuning);
  const app = {
    THREE,
    ui,
    engine,
    sceneGraph,
    tuning,
    flockConfig,
    scene: sceneGraph.entryScene ?? "menu",
    input: { leftPressed: false, rightPressed: false, jumpPressed: false },
    runner: null,
    time: 0,
    last: performance.now(),
    three: null
  };

  app.three = createThreeWorld(THREE, ui.renderHost);
  resetRun(app);
  bindInput(app);

  function frame(now) {
    const dt = Math.min(0.05, Math.max(0.001, (now - app.last) / 1000));
    app.last = now;
    app.time += dt;

    if (app.scene === "game") {
      updateRun(app, dt);
      updateFlock(app, dt);
    } else {
      updateFlock(app, dt * 0.45);
    }

    syncThree(app, dt);
    updateHud(app);
    consumeInput(app);
    app.three.renderer.render(app.three.scene, app.three.camera);
    requestAnimationFrame(frame);
  }

  globalThis.PrehistoricRushHost = {
    app,
    engine,
    getState: () => ({
      scene: app.scene,
      runner: app.runner,
      runMovement: app.engine.n.runMovement?.getSnapshot?.(),
      skybox: app.engine.n.coreSkybox?.getRenderDescriptor?.(),
      sceneGraph: app.sceneGraph,
      renderer: "three"
    })
  };

  requestAnimationFrame(frame);
}

main().catch((error) => {
  console.error(error);
  document.body.textContent = `PrehistoricRush failed to boot: ${error.message}`;
});
