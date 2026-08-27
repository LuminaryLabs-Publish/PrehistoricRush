import { DEFAULT_RACER_BEHAVIOR_REGISTRY } from "../../racers/racer-behavior-registry.js";
import { normalizeRacerIntent } from "../../racers/racer-intent.js";
import { defineRacerProfile } from "../../racers/racer-profile.js";

const clone = (value) => value === undefined ? undefined : structuredClone(value);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, Number(value) || 0));
const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;

function samplePaceCurve(curve, value) {
  const normalized = clamp(value, 0, 1);
  const scaled = normalized * (curve.length - 1);
  const index = Math.min(curve.length - 2, Math.floor(scaled));
  const remainder = scaled - index;
  return curve[index] + (curve[index + 1] - curve[index]) * remainder;
}

function staminaPhase(value) {
  if (value <= 0.3) return "red";
  if (value <= 0.6) return "yellow";
  if (value < 0.92) return "green";
  return "gold";
}

function normalizeModifiers(input = {}) {
  return {
    speedMultiplier: Math.max(0, finite(input.speedMultiplier, 1)),
    accelerationMultiplier: Math.max(0, finite(input.accelerationMultiplier, 1)),
    turnMultiplier: Math.max(0, finite(input.turnMultiplier, 1)),
    gravityMultiplier: Math.max(0, finite(input.gravityMultiplier, 1)),
    jumpImpulseMultiplier: Math.max(0, finite(input.jumpImpulseMultiplier, 1))
  };
}

function combineModifiers(left, right) {
  const a = normalizeModifiers(left);
  const b = normalizeModifiers(right);
  return {
    speedMultiplier: a.speedMultiplier * b.speedMultiplier,
    accelerationMultiplier: a.accelerationMultiplier * b.accelerationMultiplier,
    turnMultiplier: a.turnMultiplier * b.turnMultiplier,
    gravityMultiplier: a.gravityMultiplier * b.gravityMultiplier,
    jumpImpulseMultiplier: a.jumpImpulseMultiplier * b.jumpImpulseMultiplier
  };
}

export function createPrehistoricRushRacerImplementation({
  engine,
  course,
  world,
  profile,
  actorId,
  motionIntentPrefix,
  initialState = {},
  behaviorRegistry = DEFAULT_RACER_BEHAVIOR_REGISTRY,
  abilityContextProvider = null
} = {}) {
  if (!engine?.n?.motion?.submitIntent) throw new TypeError("Racer requires the Nexus motion service.");
  if (!course?.route?.nearest || !course?.route?.classify || typeof world?.sampleElevation !== "function") {
    throw new TypeError("Racer requires Course and World implementations.");
  }
  if (!behaviorRegistry?.getAbility || !behaviorRegistry?.getPassive) throw new TypeError("Racer requires a behavior registry.");

  const racerProfile = defineRacerProfile(profile);
  const movement = racerProfile.movement;
  const surfaces = racerProfile.surfaces;
  const pace = racerProfile.pace;
  const staminaCapacity = Math.max(1, racerProfile.stamina.capacity);
  const resolvedActorId = String(actorId ?? racerProfile.actor.motionActorId);
  const resolvedIntentPrefix = String(motionIntentPrefix ?? racerProfile.actor.motionIntentPrefix);
  const activeDefinition = behaviorRegistry.getAbility(racerProfile.abilities.active);
  const passiveDefinition = behaviorRegistry.getPassive(racerProfile.abilities.passive);
  if (racerProfile.abilities.active && !activeDefinition) throw new Error(`Missing racer ability: ${racerProfile.abilities.active}.`);
  if (racerProfile.abilities.passive && !passiveDefinition) throw new Error(`Missing racer passive: ${racerProfile.abilities.passive}.`);

  const spawn = {
    x: finite(initialState.x, 0),
    z: finite(initialState.z, 0),
    yaw: finite(initialState.yaw, 0),
    speed: Math.max(0, finite(initialState.speed, movement.baseSpeed)),
    routeIndex: Math.max(0, Math.floor(finite(initialState.routeIndex, 0)))
  };
  const state = {
    x: spawn.x, y: 0, z: spawn.z, yaw: spawn.yaw, speed: spawn.speed,
    verticalVelocity: 0, jumpHeight: 0, grounded: true,
    distance: 0, routeIndex: spawn.routeIndex, routeProgress: 0,
    region: "path", surfaceMultiplier: 1,
    steer: 0,
    stamina: racerProfile.stamina.capacity,
    stamina01: 1,
    staminaPhase: "gold",
    pace01: 1,
    paceMode: "run",
    abilityId: racerProfile.abilities.active,
    abilityStatus: activeDefinition ? "ready" : "unavailable",
    abilityElapsed: 0,
    abilityCooldown: 0,
    abilityEffect: null,
    passiveId: racerProfile.abilities.passive,
    lastLandingImpact: 0,
    landingRecoveryMultiplier: 1
  };
  const stateView = new Proxy(state, {
    set() { throw new TypeError("Racer behavior state is read-only."); },
    defineProperty() { throw new TypeError("Racer behavior state is read-only."); },
    deleteProperty() { throw new TypeError("Racer behavior state is read-only."); }
  });
  const motionIntent = {
    id: `${resolvedIntentPrefix}-0`,
    actorId: resolvedActorId,
    mode: "run",
    desiredVelocity: { x: 0, y: 0, z: 0 },
    desiredFacing: { x: 0, y: 0, z: 1 },
    grounded: true,
    sequence: 0
  };
  let frame = 0;
  let lastIntent = normalizeRacerIntent();
  let activeAbility = null;
  let abilityCooldown = 0;
  let sprintActive = false;
  let sprintLocked = false;

  function syncPaceState() {
    const stamina01 = clamp(state.stamina / staminaCapacity, 0, 1);
    state.stamina01 = stamina01;
    state.staminaPhase = staminaPhase(stamina01);
    state.pace01 = samplePaceCurve(pace.curve, stamina01);
    state.paceMode = sprintActive ? "sprint" : "run";
  }

  function syncAbilityState() {
    state.abilityElapsed = activeAbility?.elapsed ?? 0;
    state.abilityCooldown = abilityCooldown;
    state.abilityEffect = activeAbility?.effect ?? null;
    state.abilityStatus = activeAbility
      ? "active"
      : abilityCooldown > 0
        ? "cooldown"
        : activeDefinition
          ? "ready"
          : "unavailable";
  }

  function behaviorContext(dt, intent, environment = null) {
    return {
      dt,
      profile: racerProfile,
      state: stateView,
      intent,
      environment,
      ability: activeAbility ? Object.freeze({ ...activeAbility }) : null
    };
  }

  function reset() {
    frame = 0;
    activeAbility = null;
    abilityCooldown = 0;
    sprintActive = false;
    sprintLocked = false;
    lastIntent = normalizeRacerIntent();
    state.x = spawn.x;
    state.y = world.sampleElevation(spawn.x, spawn.z);
    state.z = spawn.z;
    state.yaw = spawn.yaw;
    state.speed = spawn.speed;
    state.verticalVelocity = 0;
    state.jumpHeight = 0;
    state.grounded = true;
    state.distance = 0;
    state.routeIndex = spawn.routeIndex;
    state.routeProgress = 0;
    state.region = "path";
    state.surfaceMultiplier = 1;
    state.steer = 0;
    state.stamina = racerProfile.stamina.capacity;
    state.lastLandingImpact = 0;
    state.landingRecoveryMultiplier = 1;
    syncAbilityState();
    syncPaceState();
    return clone(state);
  }

  function tryActivateAbility(dt, intent, environment) {
    if (!intent.ability || !activeDefinition || activeAbility || abilityCooldown > 0) return;
    const context = behaviorContext(dt, intent, environment);
    if (activeDefinition.canActivate?.(context) === false) return;
    const activation = activeDefinition.activate?.(context) ?? {};
    const staminaCost = Math.max(0, finite(activation.staminaCost, 0));
    if (state.stamina < staminaCost) return;
    state.stamina -= staminaCost;
    state.speed = Math.min(movement.boostSpeed * 1.25, state.speed + Math.max(0, finite(activation.speedImpulse, 0)));
    state.yaw += finite(activation.yawImpulse, 0);
    const verticalImpulse = Math.max(0, finite(activation.verticalImpulse, 0));
    if (verticalImpulse > 0) {
      state.verticalVelocity = Math.max(state.verticalVelocity, verticalImpulse);
      state.grounded = false;
    }
    activeAbility = {
      id: activeDefinition.id,
      elapsed: 0,
      duration: Math.max(0, finite(activation.duration, 0)),
      cooldown: Math.max(0, finite(activation.cooldown, 0)),
      effect: activation.effect == null ? activeDefinition.id : String(activation.effect),
      payload: activation.payload ?? null
    };
    syncAbilityState();
  }

  function finishAbility(dt, intent, environment) {
    if (!activeAbility || activeAbility.elapsed < activeAbility.duration) return;
    activeDefinition.finish?.(behaviorContext(dt, intent, environment));
    abilityCooldown = activeAbility.cooldown;
    activeAbility = null;
    syncAbilityState();
  }

  function tick(dtInput, input = {}) {
    const dt = Math.max(0, Math.min(0.05, Number(dtInput) || 0));
    const intent = normalizeRacerIntent(input);
    const environment = typeof abilityContextProvider === "function"
      ? abilityContextProvider({ dt, profile: racerProfile, state: stateView, intent }) ?? null
      : null;
    frame += 1;
    if (!activeAbility && abilityCooldown > 0) abilityCooldown = Math.max(0, abilityCooldown - dt);
    tryActivateAbility(dt, intent, environment);

    const requestedSprint = intent.boost && !activeAbility;
    if (!requestedSprint) {
      sprintActive = false;
      sprintLocked = false;
    } else if (sprintLocked) {
      sprintActive = false;
    } else {
      const minimum = (sprintActive ? pace.sprintMinimumToMaintain : pace.sprintMinimumToStart) * staminaCapacity;
      sprintActive = pace.sprintDrainRate === 0 || state.stamina >= minimum;
    }
    if (sprintActive && pace.sprintDrainRate > 0) {
      state.stamina = Math.max(0, state.stamina - pace.sprintDrainRate * dt);
      if (state.stamina < pace.sprintMinimumToMaintain * staminaCapacity) {
        sprintActive = false;
        sprintLocked = true;
      }
    }
    const sprintResponse = sprintActive ? samplePaceCurve(pace.curve, state.stamina / staminaCapacity) : 0;

    const passiveModifiers = passiveDefinition?.modifyMovement?.(behaviorContext(dt, intent, environment)) ?? {};
    const activeModifiers = activeAbility
      ? activeDefinition.getModifiers?.(behaviorContext(dt, intent, environment)) ?? {}
      : {};
    const modifiers = combineModifiers(passiveModifiers, activeModifiers);
    state.steer = intent.steer;
    state.yaw += intent.steer * movement.turnRate * modifiers.turnMultiplier * dt;

    const nearest = course.route.nearest(state.x, state.z, state.routeIndex, 120);
    state.routeIndex = nearest.index;
    state.routeProgress = nearest.progress;
    state.region = course.route.classify(nearest.distance, nearest.width);
    let targetMultiplier = surfaces[state.region] ?? surfaces.forest;
    if (passiveDefinition?.modifySurfaceMultiplier) {
      const modifiedSurfaceMultiplier = passiveDefinition.modifySurfaceMultiplier({
        ...behaviorContext(dt, intent, environment),
        targetMultiplier
      });
      targetMultiplier = clamp(finite(modifiedSurfaceMultiplier, targetMultiplier), 0, 2);
    }
    state.surfaceMultiplier += (targetMultiplier - state.surfaceMultiplier) * (1 - Math.exp(-surfaces.response * dt));
    const sprintTarget = movement.maximumSpeed + (movement.boostSpeed - movement.maximumSpeed) * sprintResponse;
    const desiredSpeed = (sprintActive ? sprintTarget : movement.maximumSpeed)
      * state.surfaceMultiplier
      * modifiers.speedMultiplier;
    state.speed += (desiredSpeed - state.speed) * Math.min(1, dt * movement.accelerationResponse * modifiers.accelerationMultiplier);

    const wasGrounded = state.grounded;
    if (intent.jump && state.grounded && modifiers.jumpImpulseMultiplier > 0) {
      state.verticalVelocity = movement.jumpImpulse * modifiers.jumpImpulseMultiplier;
      state.grounded = false;
    }
    state.verticalVelocity -= movement.gravity * modifiers.gravityMultiplier * dt;
    state.jumpHeight = Math.max(0, state.jumpHeight + state.verticalVelocity * dt);
    if (state.jumpHeight === 0) {
      const landingImpact = state.grounded ? 0 : Math.max(0, -state.verticalVelocity);
      state.verticalVelocity = 0;
      state.grounded = true;
      if (!wasGrounded && landingImpact > 0) {
        state.lastLandingImpact = landingImpact;
        const landing = passiveDefinition?.onLand?.({
          ...behaviorContext(dt, intent, environment),
          impactSpeed: landingImpact
        }) ?? {};
        state.landingRecoveryMultiplier = Math.max(0, finite(landing.recoveryMultiplier, 1));
        state.speed = Math.min(movement.boostSpeed * 1.25, state.speed + Math.max(0, finite(landing.speedBoost, 0)));
      }
    }

    const dx = Math.sin(state.yaw) * state.speed * dt;
    const dz = Math.cos(state.yaw) * state.speed * dt;
    state.x += dx;
    state.z += dz;
    state.distance += Math.hypot(dx, dz);
    state.y = world.sampleElevation(state.x, state.z);

    const safeDt = Math.max(dt, 0.000001);
    motionIntent.id = `${resolvedIntentPrefix}-${frame}`;
    motionIntent.mode = state.grounded ? "run" : "airborne";
    motionIntent.desiredVelocity.x = dx / safeDt;
    motionIntent.desiredVelocity.y = state.verticalVelocity;
    motionIntent.desiredVelocity.z = dz / safeDt;
    motionIntent.desiredFacing.x = Math.sin(state.yaw);
    motionIntent.desiredFacing.z = Math.cos(state.yaw);
    motionIntent.grounded = state.grounded;
    motionIntent.sequence = frame;
    engine.n.motion.submitIntent(motionIntent);

    if (activeAbility) {
      activeDefinition.update?.(behaviorContext(dt, intent, environment));
      activeAbility.elapsed += dt;
      finishAbility(dt, intent, environment);
    }
    if (!activeAbility && !sprintActive && state.stamina < racerProfile.stamina.capacity) {
      state.stamina = Math.min(racerProfile.stamina.capacity, state.stamina + racerProfile.stamina.recoveryRate * dt);
    }
    syncPaceState();
    lastIntent = intent;
    syncAbilityState();
    return state;
  }

  reset();
  return Object.freeze({
    profile: racerProfile,
    actorId: resolvedActorId,
    reset,
    tick,
    readIntent: () => lastIntent,
    readState: () => state,
    getState: () => clone(state),
    snapshot: () => clone(state)
  });
}
