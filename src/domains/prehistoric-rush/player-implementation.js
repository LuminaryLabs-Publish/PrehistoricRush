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
  const multipliers = { path: 1, edge: 0.88, verge: 0.68, forest: 0.42 };
  let frame = 0;
  let state;

  function reset() {
    frame = 0;
    state = { x: 0, y: world.sampleElevation(0, 0), z: 0, yaw: 0, speed: baseSpeed, verticalVelocity: 0, jumpHeight: 0, grounded: true, distance: 0, routeIndex: 0, routeProgress: 0, region: "path", surfaceMultiplier: 1 };
    return clone(state);
  }

  function tickFrame(dtInput, input = {}) {
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
    if (input.jump && state.grounded) { state.verticalVelocity = jumpImpulse; state.grounded = false; }
    state.verticalVelocity -= gravity * dt;
    state.jumpHeight = Math.max(0, state.jumpHeight + state.verticalVelocity * dt);
    if (state.jumpHeight === 0) { state.verticalVelocity = 0; state.grounded = true; }
    const dx = Math.sin(state.yaw) * state.speed * dt;
    const dz = Math.cos(state.yaw) * state.speed * dt;
    state.x += dx;
    state.z += dz;
    state.distance += Math.hypot(dx, dz);
    state.y = world.sampleElevation(state.x, state.z);
    engine.n.motion.submitIntent({ id: `player-motion-${frame}`, actorId: "player-character", mode: state.grounded ? "run" : "airborne", desiredVelocity: { x: dx / Math.max(dt, 0.000001), y: state.verticalVelocity, z: dz / Math.max(dt, 0.000001) }, desiredFacing: { x: Math.sin(state.yaw), y: 0, z: Math.cos(state.yaw) }, grounded: state.grounded, sequence: frame });
    return state;
  }

  function tick(dtInput, input = {}) {
    return clone(tickFrame(dtInput, input));
  }

  reset();
  return Object.freeze({ reset, tick, tickFrame, getState: () => clone(state), snapshot: () => clone(state) });
}
