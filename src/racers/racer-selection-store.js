import { DEFAULT_RACER_ID, getRacerProfile } from "./racer-catalog.js";

export const RACER_SELECTION_STORAGE_KEY = "prehistoric-rush:racer:v1";

function storage() {
  try { return globalThis.localStorage ?? null; }
  catch { return null; }
}
export function loadSelectedRacerId(location = globalThis.location) {
  const requested = new URLSearchParams(location?.search ?? "").get("racer");
  const saved = storage()?.getItem(RACER_SELECTION_STORAGE_KEY);
  for (const candidate of [requested, saved, DEFAULT_RACER_ID]) {
    try { return getRacerProfile(candidate, { playableOnly: true }).id; }
    catch { /* continue to the canonical default */ }
  }
  return DEFAULT_RACER_ID;
}

export function saveSelectedRacerId(id) {
  const racerId = getRacerProfile(id, { playableOnly: true }).id;
  storage()?.setItem(RACER_SELECTION_STORAGE_KEY, racerId);
  return racerId;
}
