export const RACER_PROFILE_SCHEMA_VERSION = "prehistoric-rush.racer.v1";

const RATINGS = new Set(["low", "normal", "high"]);
const AVAILABILITY = new Set(["playable", "controller-proof", "locked"]);
const DEFAULT_PACE_CURVE = Object.freeze([1, 1, 1, 1, 1]);

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
  return value;
}

function object(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${name} must be an object.`);
  return value;
}

function text(value, name) {
  const result = String(value ?? "").trim();
  if (!result) throw new TypeError(`${name} must be a non-empty string.`);
  return result;
}

function optionalText(value) {
  if (value == null || value === "") return null;
  return String(value).trim() || null;
}

function finite(value, name, minimum = -Infinity, maximum = Infinity) {
  const result = Number(value);
  if (!Number.isFinite(result) || result < minimum || result > maximum) {
    throw new RangeError(`${name} must be between ${minimum} and ${maximum}.`);
  }
  return result;
}

function rating(value, name) {
  const result = String(value ?? "").toLowerCase();
  if (!RATINGS.has(result)) throw new RangeError(`${name} must be low, normal, or high.`);
  return result;
}

function availability(value) {
  const result = String(value ?? "locked").toLowerCase();
  if (!AVAILABILITY.has(result)) throw new RangeError("availability must be playable, controller-proof, or locked.");
  return result;
}

function stringList(value, name) {
  if (!Array.isArray(value)) throw new TypeError(`${name} must be an array.`);
  return [...new Set(value.map((entry, index) => text(entry, `${name}[${index}]`)))];
}

function direction(value, name) {
  if (!Array.isArray(value) || value.length !== 3) throw new TypeError(`${name} must contain exactly three numbers.`);
  return value.map((entry, index) => finite(entry, `${name}[${index}]`));
}

function range(value, name, minimum = 0) {
  if (!Array.isArray(value) || value.length !== 2) throw new TypeError(`${name} must contain exactly two numbers.`);
  const start = finite(value[0], `${name}[0]`, minimum);
  const end = finite(value[1], `${name}[1]`, start);
  return [start, end];
}

function paceCurve(value, name) {
  if (!Array.isArray(value) || value.length !== 5) throw new TypeError(`${name} must contain exactly five numbers.`);
  const result = value.map((entry, index) => finite(entry, `${name}[${index}]`, 0, 1));
  for (let index = 1; index < result.length; index += 1) {
    if (result[index] < result[index - 1]) throw new RangeError(`${name} must be non-decreasing.`);
  }
  return result;
}

export function defineRacerProfile(input = {}) {
  const source = object(input, "Racer profile");
  const ratings = object(source.ratings, "ratings");
  const movement = object(source.movement, "movement");
  const surfaces = object(source.surfaces, "surfaces");
  const stamina = object(source.stamina, "stamina");
  const abilities = object(source.abilities, "abilities");
  const actor = object(source.actor, "actor");
  const presentation = object(source.presentation, "presentation");
  const camera = object(source.camera, "camera");
  const pace = source.pace == null ? {} : object(source.pace, "pace");

  const baseSpeed = finite(movement.baseSpeed, "movement.baseSpeed", 0);
  const maximumSpeed = finite(movement.maximumSpeed, "movement.maximumSpeed", baseSpeed);
  const boostSpeed = finite(movement.boostSpeed, "movement.boostSpeed", maximumSpeed);
  const paceCurveValues = paceCurve(pace.curve ?? DEFAULT_PACE_CURVE, "pace.curve");
  const sprintMinimumToStart = finite(pace.sprintMinimumToStart ?? 0, "pace.sprintMinimumToStart", 0, 1);
  const sprintMinimumToMaintain = finite(pace.sprintMinimumToMaintain ?? 0, "pace.sprintMinimumToMaintain", 0, sprintMinimumToStart);
  const minimumDistance = finite(camera.minimumDistance, "camera.minimumDistance", 0.01);
  const maximumDistance = finite(camera.maximumDistance, "camera.maximumDistance", minimumDistance);
  const verticalFov = finite(camera.verticalFov, "camera.verticalFov", 1, 179);
  const closeDistance = finite(camera.closeDistance ?? minimumDistance * 0.82, "camera.closeDistance", 0.01, maximumDistance);

  return deepFreeze({
    schemaVersion: RACER_PROFILE_SCHEMA_VERSION,
    id: text(source.id, "id"),
    displayName: text(source.displayName, "displayName"),
    racingIdentity: text(source.racingIdentity, "racingIdentity"),
    availability: availability(source.availability),
    ratings: {
      speed: rating(ratings.speed, "ratings.speed"),
      handling: rating(ratings.handling, "ratings.handling"),
      weight: rating(ratings.weight, "ratings.weight"),
      stamina: rating(ratings.stamina, "ratings.stamina"),
      skill: rating(ratings.skill, "ratings.skill")
    },
    movement: {
      baseSpeed,
      maximumSpeed,
      boostSpeed,
      accelerationResponse: finite(movement.accelerationResponse, "movement.accelerationResponse", 0.01),
      turnRate: finite(movement.turnRate, "movement.turnRate", 0),
      gravity: finite(movement.gravity, "movement.gravity", 0),
      jumpImpulse: finite(movement.jumpImpulse, "movement.jumpImpulse", 0)
    },
    surfaces: {
      path: finite(surfaces.path, "surfaces.path", 0, 2),
      edge: finite(surfaces.edge, "surfaces.edge", 0, 2),
      verge: finite(surfaces.verge, "surfaces.verge", 0, 2),
      forest: finite(surfaces.forest, "surfaces.forest", 0, 2),
      response: finite(surfaces.response, "surfaces.response", 0.01)
    },
    stamina: {
      capacity: finite(stamina.capacity, "stamina.capacity", 0),
      recoveryRate: finite(stamina.recoveryRate, "stamina.recoveryRate", 0),
      behavior: text(stamina.behavior, "stamina.behavior")
    },
    pace: {
      curve: paceCurveValues,
      sprintDrainRate: finite(pace.sprintDrainRate ?? 0, "pace.sprintDrainRate", 0),
      sprintMinimumToStart,
      sprintMinimumToMaintain
    },
    abilities: {
      active: optionalText(abilities.active),
      passive: optionalText(abilities.passive)
    },
    actor: {
      archetype: text(actor.archetype, "actor.archetype"),
      creatureId: text(actor.creatureId, "actor.creatureId"),
      characterId: text(actor.characterId, "actor.characterId"),
      playerId: text(actor.playerId, "actor.playerId"),
      motionActorId: text(actor.motionActorId, "actor.motionActorId"),
      motionIntentPrefix: text(actor.motionIntentPrefix, "actor.motionIntentPrefix"),
      bodyProvider: text(actor.bodyProvider, "actor.bodyProvider"),
      bodyDescriptorId: text(actor.bodyDescriptorId, "actor.bodyDescriptorId"),
      rigProvider: text(actor.rigProvider, "actor.rigProvider"),
      rigDescriptorId: text(actor.rigDescriptorId, "actor.rigDescriptorId"),
      supportKind: text(actor.supportKind, "actor.supportKind"),
      capabilities: stringList(actor.capabilities, "actor.capabilities")
    },
    presentation: {
      creatureRecipeId: text(presentation.creatureRecipeId, "presentation.creatureRecipeId"),
      meshName: text(presentation.meshName, "presentation.meshName"),
      snapshotName: text(presentation.snapshotName, "presentation.snapshotName"),
      rootOffsetY: finite(presentation.rootOffsetY, "presentation.rootOffsetY"),
      poseSharpness: finite(presentation.poseSharpness, "presentation.poseSharpness", 0.01),
      turnScale: finite(presentation.turnScale, "presentation.turnScale", 0),
      jumpNormalization: finite(presentation.jumpNormalization, "presentation.jumpNormalization", 0.01),
      framingPadding: finite(presentation.framingPadding, "presentation.framingPadding", 0),
      fovRange: range(presentation.fovRange, "presentation.fovRange", 1)
    },
    camera: {
      halfWidth: finite(camera.halfWidth, "camera.halfWidth", 0.01),
      height: finite(camera.height, "camera.height", 0.01),
      halfDepth: finite(camera.halfDepth, "camera.halfDepth", 0.01),
      padding: finite(camera.padding, "camera.padding", 0),
      minimumDistance,
      maximumDistance,
      closeDistance,
      smoothTime: finite(camera.smoothTime, "camera.smoothTime", 0),
      verticalFov,
      fovExpansion: finite(camera.fovExpansion ?? 8, "camera.fovExpansion", 0, 30),
      sprintFovBonus: finite(camera.sprintFovBonus ?? 1.5, "camera.sprintFovBonus", 0, 10),
      preferredDirection: direction(camera.preferredDirection, "camera.preferredDirection"),
      lookAheadSeconds: finite(camera.lookAheadSeconds, "camera.lookAheadSeconds", 0),
      speedLookAheadSeconds: finite(camera.speedLookAheadSeconds ?? 0.16, "camera.speedLookAheadSeconds", 0, 2),
      targetLift: finite(camera.targetLift ?? 0.28, "camera.targetLift", 0, 10),
      speedTargetLift: finite(camera.speedTargetLift ?? 0.22, "camera.speedTargetLift", 0, 10),
      jumpTargetLift: finite(camera.jumpTargetLift ?? 0.36, "camera.jumpTargetLift", 0, 10),
      turnLead: finite(camera.turnLead ?? 0.42, "camera.turnLead", 0, 10),
      closePaddingScale: finite(camera.closePaddingScale ?? 0.7, "camera.closePaddingScale", 0.6, 1),
      speedPaddingScale: finite(camera.speedPaddingScale ?? 0.04, "camera.speedPaddingScale", 0, 0.4),
      fovSmoothing: finite(camera.fovSmoothing ?? 7, "camera.fovSmoothing", 0.01, 30)
    }
  });
}

export function isRacerProfile(value) {
  try {
    return defineRacerProfile(value).schemaVersion === RACER_PROFILE_SCHEMA_VERSION;
  } catch {
    return false;
  }
}
