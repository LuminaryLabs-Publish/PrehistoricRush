import { TRICERATOPS_RACER_PROFILE } from "./profiles/triceratops.js";
import { VELOCIRAPTOR_RACER_PROFILE } from "./profiles/velociraptor.js";
import {
  ANKYLOSAURUS_RACER_PROFILE,
  BRACHIOSAURUS_RACER_PROFILE,
  CARNOTAURUS_RACER_PROFILE,
  GALLIMIMUS_RACER_PROFILE,
  PACHYCEPHALOSAURUS_RACER_PROFILE,
  PTERANODON_RACER_PROFILE,
  SPINOSAURUS_RACER_PROFILE,
  STEGOSAURUS_RACER_PROFILE,
  THERIZINOSAURUS_RACER_PROFILE,
  TYRANNOSAURUS_REX_RACER_PROFILE
} from "./profiles/roster-profiles.js";

export const DEFAULT_RACER_ID = VELOCIRAPTOR_RACER_PROFILE.id;

const profiles = Object.freeze([
  TYRANNOSAURUS_REX_RACER_PROFILE,
  VELOCIRAPTOR_RACER_PROFILE,
  TRICERATOPS_RACER_PROFILE,
  STEGOSAURUS_RACER_PROFILE,
  SPINOSAURUS_RACER_PROFILE,
  ANKYLOSAURUS_RACER_PROFILE,
  PACHYCEPHALOSAURUS_RACER_PROFILE,
  CARNOTAURUS_RACER_PROFILE,
  GALLIMIMUS_RACER_PROFILE,
  THERIZINOSAURUS_RACER_PROFILE,
  BRACHIOSAURUS_RACER_PROFILE,
  PTERANODON_RACER_PROFILE
]);
const byId = new Map(profiles.map((profile) => [profile.id, profile]));

export function listRacerProfiles({ playableOnly = false } = {}) {
  return playableOnly ? profiles.filter((profile) => profile.availability === "playable") : [...profiles];
}

export function getRacerProfile(id = DEFAULT_RACER_ID, { playableOnly = false } = {}) {
  const profile = byId.get(String(id));
  if (!profile) throw new RangeError(`Unknown racer profile: ${id}.`);
  if (playableOnly && profile.availability !== "playable") throw new RangeError(`Racer profile is not playable yet: ${id}.`);
  return profile;
}

export function resolvePlayableRacerProfile(id = DEFAULT_RACER_ID) {
  try {
    return getRacerProfile(id, { playableOnly: true });
  } catch {
    return getRacerProfile(DEFAULT_RACER_ID, { playableOnly: true });
  }
}
