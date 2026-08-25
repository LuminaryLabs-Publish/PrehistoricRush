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
  let run = null;

  function resetRun(status = "game") {
    const playerState = player.reset();
    collected = new Set();
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

  function collectNearby(nextPlayer) {
    for (const pickup of pickups) {
      if (collected.has(pickup.id)) continue;
      if (Math.hypot(pickup.x - nextPlayer.x, pickup.z - nextPlayer.z) > pickup.radius) continue;
      collected.add(pickup.id);
    }
  }

  function tick(dt) {
    if (!run || run.status !== "game") return clone(run);
    const nextPlayer = player.tick(dt, input);
    input.jump = false;
    collectNearby(nextPlayer);
    run = {
      ...run,
      ...nextPlayer,
      elapsed: Number(run.elapsed ?? 0) + Number(dt || 0),
      shards: collected.size,
      collectedShardIds: [...collected]
    };
    if (run.distance >= goalDistance) run.status = "win";
    return clone(run);
  }

  resetRun("game");
  return Object.freeze({
    start: () => resetRun("game"),
    setInput,
    tick,
    getState: () => clone(run),
    getPickups: () => pickups.filter((pickup) => !collected.has(pickup.id)).map(clone),
    snapshot: () => ({
      run: clone(run),
      input: clone(input),
      goalDistance: Number(goalDistance),
      pickups: { total: pickups.length, remaining: pickups.length - collected.size, collected: collected.size }
    })
  });
}
