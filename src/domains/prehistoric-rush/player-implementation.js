const clone = (value) => value === undefined ? undefined : structuredClone(value);

export function createPrehistoricRushPlayerImplementation({ engine, course, world, config = {} } = {}) {
  if (!engine?.n?.player || !engine?.n?.character || !engine?.n?.motion) throw new TypeError("Player requires Nexus player, character, and motion services.");
  if (!course?.route || typeof world?.sampleElevation !== "function") throw new TypeError("Player requires Course and World implementations.");
  const baseSpeed = Number(config.baseSpeed ?? 16);
  const maxSpeed = Number(config.maxSpeed ?? 26);
  const boostSpeed = Number(config.boostSpeed ?? 31);
  const turnRate = Number(config.turnRate ?? 2.25);
  const gravity = Number(config.gravity ?? 34);
  const jumpImpulse = Number(config.jumpImpulse ?? 13.5);
  const multipliers = Object.freeze({ path: 1, edge: 0.88, verge: 0.68, forest: 0.42 });
  const state = {
    x: 0, y: 0, z: 0, yaw: 0, speed: baseSpeed,
    verticalVelocity: 0, jumpHeight: 0, grounded: true,
    distance: 0, routeIndex: 0, routeProgress: 0,
    region: "path", surfaceMultiplier: 1
  };
  const motionIntent = {
    id: "player-motion-0",
    actorId: "player-character",
    mode: "run",
    desiredVelocity: { x: 0, y: 0, z: 0 },
    desiredFacing: { x: 0, y: 0, z: 1 },
    grounded: true,
    sequence: 0
  };
  let frame = 0;

  function reset() {
    frame = 0;
    state.x = 0;
    state.y = world.sampleElevation(0, 0);
    state.z = 0;
    state.yaw = 0;
    state.speed = baseSpeed;
    state.verticalVelocity = 0;
    state.jumpHeight = 0;
    state.grounded = true;
    state.distance = 0;
    state.routeIndex = 0;
    state.routeProgress = 0;
    state.region = "path";
    state.surfaceMultiplier = 1;
    return clone(state);
  }

  function tick(dtInput, input = {}) {
    const dt = Math.max(0, Math.min(0.05, Number(dtInput) || 0));
    frame += 1;
    state.yaw += Number(input.steer ?? 0) * turnRate * dt;
    const nearest = course.route.nearest(state.x, state.z, state.routeIndex, 120);
    state.routeIndex = nearest.index;
    state.routeProgress = nearest.progress;
    state.region = course.route.classify(nearest.distance, nearest.width);
    const targetMultiplier = multipliers[state.region] ?? multipliers.forest;
    state.surfaceMultiplier += (targetMultiplier - state.surfaceMultiplier) * (1 - Math.exp(-4.8 * dt));
    const desiredSpeed = (input.boost ? boostSpeed : maxSpeed) * state.surfaceMultiplier;
    state.speed += (desiredSpeed - state.speed) * Math.min(1, dt * 2.6);
    if (input.jump && state.grounded) {
      state.verticalVelocity = jumpImpulse;
      state.grounded = false;
    }
    state.verticalVelocity -= gravity * dt;
    state.jumpHeight = Math.max(0, state.jumpHeight + state.verticalVelocity * dt);
    if (state.jumpHeight === 0) {
      state.verticalVelocity = 0;
      state.grounded = true;
    }
    const dx = Math.sin(state.yaw) * state.speed * dt;
    const dz = Math.cos(state.yaw) * state.speed * dt;
    state.x += dx;
    state.z += dz;
    state.distance += Math.hypot(dx, dz);
    state.y = world.sampleElevation(state.x, state.z);

    const safeDt = Math.max(dt, 0.000001);
    motionIntent.id = `player-motion-${frame}`;
    motionIntent.mode = state.grounded ? "run" : "airborne";
    motionIntent.desiredVelocity.x = dx / safeDt;
    motionIntent.desiredVelocity.y = state.verticalVelocity;
    motionIntent.desiredVelocity.z = dz / safeDt;
    motionIntent.desiredFacing.x = Math.sin(state.yaw);
    motionIntent.desiredFacing.z = Math.cos(state.yaw);
    motionIntent.grounded = state.grounded;
    motionIntent.sequence = frame;
    engine.n.motion.submitIntent(motionIntent);
    return state;
  }

  reset();
  return Object.freeze({
    reset,
    tick,
    readState: () => state,
    getState: () => clone(state),
    snapshot: () => clone(state)
  });
}
