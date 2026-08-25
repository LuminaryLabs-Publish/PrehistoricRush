import { TRICERATOPS_RACER_PROFILE } from "./profiles/triceratops.js";
import { VELOCIRAPTOR_RACER_PROFILE } from "./profiles/velociraptor.js";

export const DEFAULT_RACER_ID = VELOCIRAPTOR_RACER_PROFILE.id;

const profiles = Object.freeze([
  VELOCIRAPTOR_RACER_PROFILE,
  TRICERATOPS_RACER_PROFILE
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
