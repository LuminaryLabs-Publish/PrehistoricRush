import { PLAYER_RAPTOR_PRESET } from "../presets/player-raptor.js";

export const PLAYER_CHARACTER_SCHEMA_VERSION = "prehistoric-rush.character.v1";
export const DEFAULT_PLAYER_PROFILE_ID = "player-1";

const clone = (value) => structuredClone(value);
const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, minimum, maximum, fallback) => Math.min(maximum, Math.max(minimum, finite(value, fallback)));
const color = (value, fallback) => /^#[0-9a-f]{6}$/i.test(String(value ?? "")) ? String(value).toLowerCase() : fallback;

export function createDefaultPlayerCharacterProfile() {
  return {
    schemaVersion: PLAYER_CHARACTER_SCHEMA_VERSION,
    profileId: DEFAULT_PLAYER_PROFILE_ID,
    revision: 0,
    updatedAt: Date.now(),
    creature: clone(PLAYER_RAPTOR_PRESET)
  };
}

export function normalizePlayerCharacterProfile(input = {}) {
  const fallback = createDefaultPlayerCharacterProfile();
  const source = input && typeof input === "object" ? input : {};
  const creature = source.creature && typeof source.creature === "object" ? source.creature : {};
  const preset = creature.preset && typeof creature.preset === "object" ? creature.preset : {};
  const proportions = preset.proportions && typeof preset.proportions === "object" ? preset.proportions : {};
  const material = preset.material && typeof preset.material === "object" ? preset.material : {};
  const animation = preset.animation && typeof preset.animation === "object" ? preset.animation : {};
  const topology = preset.topology && typeof preset.topology === "object" ? preset.topology : {};
  const collision = preset.collision && typeof preset.collision === "object" ? preset.collision : {};
  const fallbackCreature = fallback.creature;
  const fallbackPreset = fallbackCreature.preset;

  return {
    schemaVersion: PLAYER_CHARACTER_SCHEMA_VERSION,
    profileId: String(source.profileId ?? fallback.profileId),
    revision: Math.max(0, Math.floor(finite(source.revision, 0))),
    updatedAt: Math.max(0, finite(source.updatedAt, Date.now())),
    creature: {
      id: String(creature.id ?? fallbackCreature.id),
      seed: String(creature.seed ?? fallbackCreature.seed),
      archetype: "theropod",
      preset: {
        id: String(preset.id ?? fallbackPreset.id),
        archetype: "theropod",
        topology: {
          radialSegments: Math.round(clamp(topology.radialSegments, 6, 18, fallbackPreset.topology.radialSegments)),
          tailSegments: Math.round(clamp(topology.tailSegments, 3, 14, fallbackPreset.topology.tailSegments))
        },
        proportions: {
          bodyLength: clamp(proportions.bodyLength, 0.85, 2.2, fallbackPreset.proportions.bodyLength),
          hipHeight: clamp(proportions.hipHeight, 0.4, 1.25, fallbackPreset.proportions.hipHeight),
          chestHeight: clamp(proportions.chestHeight, 0.5, 1.5, fallbackPreset.proportions.chestHeight),
          headHeight: clamp(proportions.headHeight, 0.65, 1.7, fallbackPreset.proportions.headHeight),
          headForward: clamp(proportions.headForward, 0.65, 1.7, fallbackPreset.proportions.headForward),
          tailLength: clamp(proportions.tailLength, 0.8, 3.2, fallbackPreset.proportions.tailLength),
          legLength: clamp(proportions.legLength, 0.45, 1.35, fallbackPreset.proportions.legLength),
          armLength: clamp(proportions.armLength, 0.2, 0.9, fallbackPreset.proportions.armLength),
          bodyScale: clamp(proportions.bodyScale, 0.55, 1.35, fallbackPreset.proportions.bodyScale)
        },
        material: {
          skin: color(material.skin, fallbackPreset.material.skin),
          underbelly: color(material.underbelly, fallbackPreset.material.underbelly),
          roughness: clamp(material.roughness, 0, 1, fallbackPreset.material.roughness),
          metalness: clamp(material.metalness, 0, 1, fallbackPreset.material.metalness)
        },
        animation: {
          strideSwing: clamp(animation.strideSwing, 0.25, 1.5, fallbackPreset.animation.strideSwing),
          hipBob: clamp(animation.hipBob, 0, 0.2, fallbackPreset.animation.hipBob),
          tailFollow: clamp(animation.tailFollow, 0, 0.35, fallbackPreset.animation.tailFollow),
          headCounter: clamp(animation.headCounter, 0, 0.3, fallbackPreset.animation.headCounter),
          turnLean: clamp(animation.turnLean, 0, 0.35, fallbackPreset.animation.turnLean)
        },
        collision: {
          shape: "capsule",
          radius: clamp(collision.radius, 0.18, 0.6, fallbackPreset.collision.radius),
          halfHeight: clamp(collision.halfHeight, 0.22, 0.9, fallbackPreset.collision.halfHeight),
          centerY: clamp(collision.centerY, 0.3, 1.2, fallbackPreset.collision.centerY)
        }
      }
    }
  };
}

export function mergePlayerCharacterProfile(base, patch) {
  const merge = (left, right) => {
    if (!right || typeof right !== "object" || Array.isArray(right)) return right === undefined ? left : right;
    const output = { ...(left && typeof left === "object" ? left : {}) };
    for (const [key, value] of Object.entries(right)) output[key] = merge(output[key], value);
    return output;
  };
  return normalizePlayerCharacterProfile(merge(base, patch));
}
