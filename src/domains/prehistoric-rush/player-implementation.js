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

  function tick(dtInput, input = {}) {
    const dt = Math.max(0, Math.min(0.05, Number(dtInput) || 0));
    frame += 1;
    const next = clone(state);
    next.yaw += Number(input.steer ?? 0) * turnRate * dt;
    const nearest = course.route.nearest(next.x, next.z, next.routeIndex, 120);
    next.routeIndex = nearest.index;
    next.routeProgress = nearest.progress;
    next.region = course.route.classify(nearest.distance, nearest.width);
    const targetMultiplier = multipliers[next.region] ?? multipliers.forest;
    next.surfaceMultiplier += (targetMultiplier - next.surfaceMultiplier) * (1 - Math.exp(-4.8 * dt));
    const desiredSpeed = (input.boost ? boostSpeed : maxSpeed) * next.surfaceMultiplier;
    next.speed += (desiredSpeed - next.speed) * Math.min(1, dt * 2.6);
    if (input.jump && next.grounded) { next.verticalVelocity = jumpImpulse; next.grounded = false; }
    next.verticalVelocity -= gravity * dt;
    next.jumpHeight = Math.max(0, next.jumpHeight + next.verticalVelocity * dt);
    if (next.jumpHeight === 0) { next.verticalVelocity = 0; next.grounded = true; }
    const dx = Math.sin(next.yaw) * next.speed * dt;
    const dz = Math.cos(next.yaw) * next.speed * dt;
    next.x += dx;
    next.z += dz;
    next.distance += Math.hypot(dx, dz);
    next.y = world.sampleElevation(next.x, next.z);
    engine.n.motion.submitIntent({ id: `player-motion-${frame}`, actorId: "player-character", mode: next.grounded ? "run" : "airborne", desiredVelocity: { x: dx / Math.max(dt, 0.000001), y: next.verticalVelocity, z: dz / Math.max(dt, 0.000001) }, desiredFacing: { x: Math.sin(next.yaw), y: 0, z: Math.cos(next.yaw) }, grounded: next.grounded, sequence: frame });
    state = next;
    return clone(state);
  }

  reset();
  return Object.freeze({ reset, tick, getState: () => clone(state), snapshot: () => clone(state) });
}
