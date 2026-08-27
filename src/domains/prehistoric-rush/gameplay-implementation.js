const clone = (value) => value === undefined ? undefined : structuredClone(value);

const PICKUP_ELEVATION_BUDGET_PER_TICK = 2;

function createRoutePickups(course) {
  // Keep semantic pickup placement deterministic, but defer Foundation height sampling.
  // The previous eager path sampled all 62 current-route pickups before the renderer existed,
  // which made gameplay construction the widest synchronous fan-out inside the old 20% phase.
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
    pickups.push({
      id: `prehistoric-shard:${String(pickups.length).padStart(3, "0")}`,
      x,
      y: 1.15,
      z,
      radius: 1.05,
      routeIndex: sampleIndex,
      elevationResolved: false
    });
  }
  return pickups;
}

export function createPrehistoricRushGameplayImplementation({ player, course, world, goalDistance = 3600 } = {}) {
  if (!player?.tick) throw new TypeError("Gameplay requires the PrehistoricRush Player implementation.");
  if (!course?.route || !world?.sampleElevation) throw new TypeError("Gameplay pickups require Course and World implementations.");
  const pickups = createRoutePickups(course);
  const collected = new Set();
  const activePickups = pickups.slice();
  const input = { steer: 0, boost: false, jump: false, ability: false };
  const run = {
    runId: 0,
    status: "game",
    elapsed: 0,
    shards: 0,
    collectedShardIds: []
  };
  let pickupRevision = 0;
  let elevationCursor = 0;

  function hydratePickupElevations(maximum = PICKUP_ELEVATION_BUDGET_PER_TICK) {
    let resolved = 0;
    while (elevationCursor < pickups.length && resolved < maximum) {
      const pickup = pickups[elevationCursor];
      elevationCursor += 1;
      if (pickup.elevationResolved) continue;
      pickup.y = world.sampleElevation(pickup.x, pickup.z) + 1.15;
      pickup.elevationResolved = true;
      resolved += 1;
    }
    if (resolved > 0) pickupRevision += 1;
    return resolved;
  }

  function copyPlayerState(playerState) {
    run.x = playerState.x;
    run.y = playerState.y;
    run.z = playerState.z;
    run.yaw = playerState.yaw;
    run.speed = playerState.speed;
    run.verticalVelocity = playerState.verticalVelocity;
    run.jumpHeight = playerState.jumpHeight;
    run.grounded = playerState.grounded;
    run.distance = playerState.distance;
    run.routeIndex = playerState.routeIndex;
    run.routeProgress = playerState.routeProgress;
    run.region = playerState.region;
    run.surfaceMultiplier = playerState.surfaceMultiplier;
    run.steer = playerState.steer ?? 0;
    run.stamina = playerState.stamina ?? null;
    run.abilityId = playerState.abilityId ?? null;
    run.abilityStatus = playerState.abilityStatus ?? "unavailable";
    run.abilityElapsed = playerState.abilityElapsed ?? 0;
    run.abilityCooldown = playerState.abilityCooldown ?? 0;
    run.abilityEffect = playerState.abilityEffect ?? null;
    run.passiveId = playerState.passiveId ?? null;
    run.lastLandingImpact = playerState.lastLandingImpact ?? 0;
    run.landingRecoveryMultiplier = playerState.landingRecoveryMultiplier ?? 1;
  }

  function resetRun(status = "game") {
    const playerState = player.reset();
    collected.clear();
    activePickups.length = 0;
    activePickups.push(...pickups);
    pickupRevision += 1;
    run.runId += 1;
    run.status = status;
    run.elapsed = 0;
    run.shards = 0;
    run.collectedShardIds = [];
    copyPlayerState(playerState);
    return clone(run);
  }

  function setInput(next = {}) {
    if (next.steer !== undefined) input.steer = Number(next.steer) || 0;
    if (next.boost !== undefined) input.boost = Boolean(next.boost);
    if (next.jump !== undefined) input.jump = Boolean(next.jump);
    if (next.ability !== undefined) input.ability = Boolean(next.ability);
    return input;
  }

  function collectNearby(nextPlayer) {
    let changed = false;
    for (let index = activePickups.length - 1; index >= 0; index -= 1) {
      const pickup = activePickups[index];
      const routeDelta = Math.abs(Number(pickup.routeIndex) - Number(nextPlayer.routeIndex));
      if (routeDelta > 240) continue;
      const dx = pickup.x - nextPlayer.x;
      const dz = pickup.z - nextPlayer.z;
      if (dx * dx + dz * dz > pickup.radius * pickup.radius) continue;
      collected.add(pickup.id);
      activePickups.splice(index, 1);
      changed = true;
    }
    if (changed) {
      pickupRevision += 1;
      run.shards = collected.size;
      run.collectedShardIds = [...collected];
    }
  }

  function tick(dt) {
    if (run.status !== "game") return run;
    const nextPlayer = player.tick(dt, input);
    hydratePickupElevations();
    input.jump = false;
    input.ability = false;
    collectNearby(nextPlayer);
    copyPlayerState(nextPlayer);
    run.elapsed += Number(dt || 0);
    if (run.distance >= goalDistance) run.status = "win";
    return run;
  }

  resetRun("game");
  return Object.freeze({
    start: () => resetRun("game"),
    setInput,
    tick,
    readState: () => run,
    readInput: () => input,
    readPickups: () => activePickups,
    getPickupRevision: () => pickupRevision,
    hydratePickupElevations,
    getState: () => clone(run),
    getPickups: () => activePickups,
    snapshotPickups: () => activePickups.map(clone),
    snapshot: () => ({
      run: clone(run),
      input: clone(input),
      goalDistance: Number(goalDistance),
      pickups: {
        total: pickups.length,
        remaining: activePickups.length,
        collected: collected.size,
        revision: pickupRevision,
        elevationResolved: pickups.filter((pickup) => pickup.elevationResolved).length,
        elevationPending: pickups.filter((pickup) => !pickup.elevationResolved).length,
        elevationBudgetPerTick: PICKUP_ELEVATION_BUDGET_PER_TICK
      }
    })
  });
}
