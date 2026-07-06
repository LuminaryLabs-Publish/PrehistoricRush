const ENGINE_URL = "https://cdn.jsdelivr.net/gh/LuminaryLabs-Dev/NexusEngine@main/src/index.js";

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
    return structuredClone(fallback);
  }
}

async function loadEngine() {
  try {
    return await import(ENGINE_URL);
  } catch (error) {
    console.warn("NexusEngine CDN import failed; using local fallback shell.", error);
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
        getDescriptors: () => ({})
      };
    }
  });
}

function createFallbackEngine({ kits = [] } = {}) {
  const engine = { n: {}, tick() {} };
  for (const kit of kits) kit.install?.({ engine });
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
        createFallbackKit("coreDiagnostics")()
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
      NexusEngine.createCoreDiagnosticsKit?.()
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

  const canvas = document.createElement("canvas");
  canvas.id = "game";
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block"
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
    boxShadow: "0 12px 48px rgba(0,0,0,.25)"
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
  mount.append(canvas, hud);
  return { canvas, hud, title, status, action };
}

function resizeCanvas(canvas, ctx) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.floor(innerWidth * dpr);
  canvas.height = Math.floor(innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createRunnerState(tuning, flockConfig) {
  const random = mulberry32(tuning.streaming?.seed ?? "prehistoric-rush-v0");
  const lanePositions = tuning.motion?.lanePositions ?? [-2.4, 0, 2.4];
  const flock = [];
  const maxAgents = Math.min(48, Number(flockConfig.maxAgents ?? 36));
  for (let i = 0; i < maxAgents; i += 1) {
    flock.push({
      x: random() * innerWidth,
      y: innerHeight * (0.08 + random() * 0.32),
      vx: 8 + random() * 18,
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
      state.obstacles.push({ lane, z: z0 + 5 + state.random() * (segmentLength - 8), kind: state.random() > 0.5 ? "bone" : "fern" });
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

  state.time += dt;
  state.speed = Math.min(motion.maxForwardSpeed ?? 18, (motion.baseForwardSpeed ?? 8.5) + state.time * ((motion.speedRampPerMinute ?? 1.15) / 60));
  state.distance += state.speed * dt;
  state.bestDistance = Math.max(state.bestDistance, state.distance);

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
    bird.y += Math.sin(bird.phase) * 2 * dt;
    if (bird.x > innerWidth + 60) bird.x = -60;
  }
}

function drawSky(app, ctx, width, height) {
  const descriptor = app.engine.n.coreSkybox?.getRenderDescriptor?.();
  const gradient = descriptor?.gradient ?? {};
  const top = gradient.topColor ?? "#241052";
  const mid = gradient.midColor ?? "#6d4cab";
  const horizon = gradient.horizonColor ?? "#ffb56d";
  const lower = gradient.lowerColor ?? "#120914";

  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, top);
  bg.addColorStop(0.48, mid);
  bg.addColorStop(0.72, horizon);
  bg.addColorStop(1, lower);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const clouds = descriptor?.cloudLayers ?? [];
  for (let i = 0; i < Math.max(1, clouds.length); i += 1) {
    const layer = clouds[i] ?? {};
    const y = height * (0.22 + (layer.altitude ?? 0.4) * 0.32);
    ctx.fillStyle = layer.highlightColor ?? "rgba(255,245,216,.84)";
    ctx.globalAlpha = 0.28 + (layer.coverage ?? 0.4) * 0.4;
    for (let c = 0; c < 8; c += 1) {
      const x = ((c * 220 + app.time * 8 * (i + 1)) % (width + 260)) - 130;
      ctx.beginPath();
      ctx.ellipse(x, y + Math.sin(c) * 18, 95, 22, 0, 0, Math.PI * 2);
      ctx.ellipse(x + 55, y - 10, 60, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

function project(app, lane, z) {
  const width = innerWidth;
  const height = innerHeight;
  const depth = Math.max(0.1, z - app.runner.distance);
  const t = Math.min(1, depth / 150);
  const centerX = width * 0.5;
  const horizonY = height * 0.46;
  const groundY = height * 0.84;
  const laneX = (app.tuning.motion?.lanePositions ?? [-2.4, 0, 2.4])[lane] ?? 0;
  const perspective = 1 - t;
  return {
    x: centerX + laneX * 120 * perspective,
    y: horizonY + (groundY - horizonY) * perspective,
    scale: Math.max(0.18, perspective)
  };
}

function drawGame(app, ctx) {
  const width = innerWidth;
  const height = innerHeight;
  const state = app.runner;

  ctx.fillStyle = "rgba(18, 9, 20, .72)";
  ctx.beginPath();
  ctx.moveTo(width * 0.18, height);
  ctx.lineTo(width * 0.44, height * 0.46);
  ctx.lineTo(width * 0.56, height * 0.46);
  ctx.lineTo(width * 0.82, height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 211, 122, .22)";
  ctx.lineWidth = 2;
  for (const laneX of [-1, 0, 1]) {
    ctx.beginPath();
    ctx.moveTo(width * 0.5 + laneX * 22, height * 0.46);
    ctx.lineTo(width * 0.5 + laneX * 150, height);
    ctx.stroke();
  }

  for (const pickup of state.pickups) {
    const p = project(app, pickup.lane, pickup.z);
    if (p.scale < 0.2 || p.y > height + 20) continue;
    ctx.save();
    ctx.translate(p.x, p.y - 32 * p.scale);
    ctx.rotate(app.time * 3);
    ctx.fillStyle = "#8fe8ff";
    ctx.shadowColor = "#8fe8ff";
    ctx.shadowBlur = 18 * p.scale;
    ctx.beginPath();
    ctx.moveTo(0, -12 * p.scale);
    ctx.lineTo(9 * p.scale, 0);
    ctx.lineTo(0, 12 * p.scale);
    ctx.lineTo(-9 * p.scale, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  for (const obstacle of state.obstacles) {
    const p = project(app, obstacle.lane, obstacle.z);
    if (p.scale < 0.2 || p.y > height + 20) continue;
    ctx.fillStyle = obstacle.kind === "bone" ? "#e7d6a2" : "#366d3d";
    ctx.fillRect(p.x - 20 * p.scale, p.y - 48 * p.scale, 40 * p.scale, 48 * p.scale);
  }

  for (const bird of state.flock) {
    const layer = app.flockConfig.depthLayers?.find((entry) => entry.id === bird.layer) ?? app.flockConfig.depthLayers?.[0] ?? { scale: 0.4, alpha: 0.35 };
    ctx.globalAlpha = layer.alpha ?? 0.35;
    ctx.fillStyle = "#120914";
    const flap = Math.sin(bird.phase) * 8 * (layer.scale ?? 0.5);
    ctx.beginPath();
    ctx.moveTo(bird.x, bird.y);
    ctx.lineTo(bird.x - 18 * layer.scale, bird.y + flap);
    ctx.lineTo(bird.x + 18 * layer.scale, bird.y - flap);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  const playerX = width * 0.5 + state.laneX * 120;
  const playerY = height * 0.78 - state.y * 35;
  const lean = (state.laneX - (app.tuning.motion?.lanePositions?.[state.lane] ?? state.laneX)) * -0.12;
  ctx.save();
  ctx.translate(playerX, playerY);
  ctx.rotate(lean);
  ctx.fillStyle = "#ffd37a";
  ctx.shadowColor = "#ffd37a";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.ellipse(0, -34, 22, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffe7a9";
  ctx.fillRect(-11, -82, 22, 28);
  ctx.restore();
}

function drawOverlay(app) {
  const { title, status, action } = app.shell;
  if (app.scene === "menu") {
    title.textContent = "Prehistoric Rush";
    status.textContent = "Press Start, Space, or Enter. Run the sky trail.";
    action.hidden = false;
    action.textContent = "Start Rush";
  } else if (app.scene === "game") {
    title.textContent = "Prehistoric Rush";
    status.textContent = `distance ${Math.floor(app.runner.distance)} · best ${Math.floor(app.runner.bestDistance)} · shards ${app.runner.shards}`;
    action.hidden = true;
  } else if (app.scene === "run-over") {
    title.textContent = "The Trail Caught You";
    status.textContent = `distance ${Math.floor(app.runner.distance)} · best ${Math.floor(app.runner.bestDistance)} · press Retry`;
    action.hidden = false;
    action.textContent = "Retry";
  } else if (app.scene === "win") {
    title.textContent = "New Trail Reached";
    status.textContent = `distance ${Math.floor(app.runner.distance)} · shards ${app.runner.shards}`;
    action.hidden = false;
    action.textContent = "Run Again";
  }
}

function draw(app) {
  const { canvas } = app.shell;
  const ctx = app.ctx;
  resizeCanvas(canvas, ctx);
  drawSky(app, ctx, innerWidth, innerHeight);
  updateFlock(app, 1 / 60);
  if (app.scene === "game" || app.scene === "run-over" || app.scene === "win") drawGame(app, ctx);
  drawOverlay(app);
}

function createInput() {
  const pressed = new Set();
  const held = new Set();
  addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ([" ", "arrowup", "arrowleft", "arrowright"].includes(key)) event.preventDefault();
    if (!held.has(key)) pressed.add(key);
    held.add(key);
  });
  addEventListener("keyup", (event) => held.delete(event.key.toLowerCase()));
  addEventListener("blur", () => { held.clear(); pressed.clear(); });
  return {
    leftPressed: false,
    rightPressed: false,
    jumpPressed: false,
    startPressed: false,
    consume(key) {
      const hit = pressed.has(key);
      pressed.delete(key);
      return hit;
    },
    flushFrame() {
      this.leftPressed = this.consume("arrowleft") || this.consume("a");
      this.rightPressed = this.consume("arrowright") || this.consume("d");
      this.jumpPressed = this.consume(" ") || this.consume("w") || this.consume("arrowup");
      this.startPressed = this.consume("enter");
    },
    clearFrame() {
      pressed.clear();
    }
  };
}

async function main() {
  const shell = createShell();
  const ctx = shell.canvas.getContext("2d");
  const [NexusEngine, sceneGraph, tuning, flockConfig] = await Promise.all([
    loadEngine(),
    loadJson("game-scenes.json", FALLBACK_SCENE_GRAPH),
    loadJson("runner-tuning.json", FALLBACK_TUNING),
    loadJson("flock-generation.json", FALLBACK_FLOCK)
  ]);

  const engine = installEngine(NexusEngine);
  const app = {
    shell,
    ctx,
    engine,
    sceneGraph,
    tuning,
    flockConfig,
    scene: sceneGraph.entryScene ?? "menu",
    input: createInput(),
    time: 0,
    runner: createRunnerState(tuning, flockConfig)
  };

  shell.action.addEventListener("click", () => {
    if (app.scene === "menu") transition(app, "start");
    else if (app.scene === "run-over") transition(app, "retry");
    else if (app.scene === "win") transition(app, "again");
  });

  resetRun(app);

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.033, (now - last) / 1000 || 1 / 60);
    last = now;
    app.time += dt;
    app.input.flushFrame();
    if (app.scene === "menu" && (app.input.jumpPressed || app.input.startPressed)) transition(app, "start");
    if (app.scene === "run-over" && app.input.jumpPressed) transition(app, "retry");
    if (app.scene === "win" && app.input.jumpPressed) transition(app, "again");
    if (app.scene === "game") updateRun(app, dt);
    app.engine.tick?.(dt);
    draw(app);
    app.input.clearFrame();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  globalThis.PrehistoricRushHost = {
    app,
    engine,
    getState: () => ({
      scene: app.scene,
      runner: app.runner,
      skybox: app.engine.n.coreSkybox?.getRenderDescriptor?.(),
      sceneGraph: app.sceneGraph
    })
  };
}

main().catch((error) => {
  document.body.textContent = `PrehistoricRush failed to start: ${error?.stack ?? error}`;
});
