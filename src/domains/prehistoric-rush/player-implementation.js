import { defineRacerProfile } from "../../racers/racer-profile.js";
import { VELOCIRAPTOR_RACER_PROFILE } from "../../racers/profiles/velociraptor.js";
import { createPrehistoricRushRacerImplementation } from "./racer-implementation.js";

function profileWithLegacyConfig(profile, config = {}) {
  if (!config || typeof config !== "object" || Object.keys(config).length === 0) return profile;
  return defineRacerProfile({
    ...profile,
    movement: {
      ...profile.movement,
      baseSpeed: config.baseSpeed ?? profile.movement.baseSpeed,
      maximumSpeed: config.maxSpeed ?? profile.movement.maximumSpeed,
      boostSpeed: config.boostSpeed ?? profile.movement.boostSpeed,
      accelerationResponse: config.accelerationResponse ?? config.acceleration ?? profile.movement.accelerationResponse,
      turnRate: config.turnRate ?? profile.movement.turnRate,
      gravity: config.gravity ?? profile.movement.gravity,
      jumpImpulse: config.jumpImpulse ?? profile.movement.jumpImpulse
    }
  });
}

export function createPrehistoricRushPlayerImplementation(options = {}) {
  const { engine, config = {}, profile = VELOCIRAPTOR_RACER_PROFILE, actorId, motionIntentPrefix, ...rest } = options;
  if (!engine?.n?.player || !engine?.n?.character || !engine?.n?.motion) {
    throw new TypeError("Player requires Nexus player, character, and motion services.");
  }
  const resolvedProfile = profileWithLegacyConfig(profile, config);
  return createPrehistoricRushRacerImplementation({
    ...rest,
    engine,
    profile: resolvedProfile,
    actorId: actorId ?? resolvedProfile.actor.motionActorId,
    motionIntentPrefix: motionIntentPrefix ?? resolvedProfile.actor.motionIntentPrefix
  });
}
