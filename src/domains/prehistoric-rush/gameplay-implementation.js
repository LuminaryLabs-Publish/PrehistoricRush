const clone = (value) => value === undefined ? undefined : structuredClone(value);

function createRoutePickups(course, world) {
  const samples = course?.route?.samples ?? [];
  const pickups = [];
  const stride = Math.max(24, Math.floor(samples.length / 64));
  for (let sampleIndex = stride; sampleIndex < samples.length - stride; sampleIndex += stride) {
    const point = samples[sampleIndex];
    const previous = samples[Math.max(0, sampleIndex - 2)];
    const next = samples[Math.min(samples.length - 1, sampleIndex + 2)];
    const dx = next.x - previous.x;
    const dz = next.z - previous.z;
    const length = Math.hypot(dx, dz) || 1;
    const nx = -dz / length;
    const nz = dx / length;
    const side = pickups.length % 2 === 0 ? -1 : 1;
    const offset = Math.min(Number(point.width ?? 3.1) * 0.48, 1.65) * side;
    const x = point.x + nx * offset;
    const z = point.z + nz * offset;
    pickups.push(Object.freeze({
      id: `prehistoric-shard:${String(pickups.length).padStart(3, "0")}`,
      x,
      y: world.sampleElevation(x, z) + 1.15,
      z,
      radius: 1.05,
      routeIndex: sampleIndex
    }));
  }
  return Object.freeze(pickups);
}

export function createPrehistoricRushGameplayImplementation({ player, course, world, goalDistance = 3600 } = {}) {
  if (!player?.tick) throw new TypeError("Gameplay requires the PrehistoricRush Player implementation.");
  if (!course?.route || !world?.sampleElevation) throw new TypeError("Gameplay pickups require Course and World implementations.");
  const pickups = createRoutePickups(course, world);
  let input = { steer: 0, boost: false, jump: false };
  let collected = new Set();
  let activePickups = [];
  let run = null;

  function resetRun(status = "game") {
    const playerState = player.reset();
    collected = new Set();
    activePickups = [...pickups];
    run = {
      runId: Number(run?.runId ?? 0) + 1,
      status,
      elapsed: 0,
      shards: 0,
      collectedShardIds: [],
      ...playerState
    };
    return clone(run);
  }

  function setInput(next = {}) {
    input = { ...input, ...next };
    return clone(input);
  }

  function setFrameInput(steer = 0, boost = false) {
    input.steer = Number(steer) || 0;
    input.boost = Boolean(boost);
  }

  function collectNearby(nextPlayer) {
    for (let index = activePickups.length - 1; index >= 0; index -= 1) {
      const pickup = activePickups[index];
      if (Math.hypot(pickup.x - nextPlayer.x, pickup.z - nextPlayer.z) > pickup.radius) continue;
      activePickups.splice(index, 1);
      collected.add(pickup.id);
      run.collectedShardIds.push(pickup.id);
    }
  }

  function tickFrame(dt) {
    if (!run || run.status !== "game") return run;
    const nextPlayer = typeof player.tickFrame === "function" ? player.tickFrame(dt, input) : player.tick(dt, input);
    input.jump = false;
    collectNearby(nextPlayer);
    Object.assign(run, nextPlayer);
    run.elapsed = Number(run.elapsed ?? 0) + Number(dt || 0);
    run.shards = collected.size;
    if (run.distance >= goalDistance) run.status = "win";
    return run;
  }

  function tick(dt) {
    return clone(tickFrame(dt));
  }

  function readFrameState(target = {}) {
    target.runId = run.runId;
    target.status = run.status;
    target.elapsed = run.elapsed;
    target.shards = run.shards;
    target.x = run.x;
    target.y = run.y;
    target.z = run.z;
    target.yaw = run.yaw;
    target.speed = run.speed;
    target.verticalVelocity = run.verticalVelocity;
    target.jumpHeight = run.jumpHeight;
    target.grounded = run.grounded;
    target.distance = run.distance;
    target.routeIndex = run.routeIndex;
    target.routeProgress = run.routeProgress;
    target.region = run.region;
    target.surfaceMultiplier = run.surfaceMultiplier;
    return target;
  }

  resetRun("game");
  return Object.freeze({
    start: () => resetRun("game"),
    setInput,
    setFrameInput,
    tick,
    tickFrame,
    readFrameState,
    getState: () => clone(run),
    getActivePickups: () => activePickups,
    getPickups: () => activePickups.map(clone),
    snapshot: () => ({
      run: clone(run),
      input: clone(input),
      goalDistance: Number(goalDistance),
      pickups: { total: pickups.length, remaining: activePickups.length, collected: collected.size }
    })
  });
}
