import {
  createDefaultPlayerCharacterProfile,
  mergePlayerCharacterProfile,
  normalizePlayerCharacterProfile
} from "./player-character-schema.js";

export const PLAYER_CHARACTER_STORAGE_KEY = "prehistoric-rush:character:v1";
export const PLAYER_CHARACTER_CHANNEL = "prehistoric-rush:character";

const listeners = new Set();
let channel = null;

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function getChannel() {
  if (channel || typeof BroadcastChannel !== "function") return channel;
  channel = new BroadcastChannel(PLAYER_CHARACTER_CHANNEL);
  channel.addEventListener("message", (event) => {
    if (event.data?.type !== "character-profile-updated") return;
    const profile = normalizePlayerCharacterProfile(event.data.profile);
    for (const listener of listeners) listener({ source: "broadcast", profile });
  });
  return channel;
}

export function loadPlayerCharacterProfile() {
  const storage = getStorage();
  if (!storage) return createDefaultPlayerCharacterProfile();
  try {
    const raw = storage.getItem(PLAYER_CHARACTER_STORAGE_KEY);
    if (!raw) return createDefaultPlayerCharacterProfile();
    return normalizePlayerCharacterProfile(JSON.parse(raw));
  } catch (error) {
    console.warn("Could not read saved player character profile; using defaults.", error);
    return createDefaultPlayerCharacterProfile();
  }
}

export function savePlayerCharacterProfile(input, options = {}) {
  const previous = loadPlayerCharacterProfile();
  const profile = normalizePlayerCharacterProfile({
    ...input,
    revision: options.preserveRevision === true
      ? input?.revision
      : Math.max(previous.revision + 1, Number(input?.revision ?? 0)),
    updatedAt: Date.now()
  });
  const storage = getStorage();
  if (storage) storage.setItem(PLAYER_CHARACTER_STORAGE_KEY, JSON.stringify(profile));
  if (options.broadcast !== false) {
    getChannel()?.postMessage({ type: "character-profile-updated", profile });
  }
  for (const listener of listeners) listener({ source: "local", profile });
  return profile;
}

export function patchPlayerCharacterProfile(patch, options = {}) {
  return savePlayerCharacterProfile(
    mergePlayerCharacterProfile(loadPlayerCharacterProfile(), patch),
    options
  );
}

export function resetPlayerCharacterProfile(options = {}) {
  return savePlayerCharacterProfile(createDefaultPlayerCharacterProfile(), options);
}

export function subscribePlayerCharacterProfile(listener) {
  if (typeof listener !== "function") throw new TypeError("Character profile listener must be a function.");
  listeners.add(listener);
  getChannel();

  const onStorage = (event) => {
    if (event.key !== PLAYER_CHARACTER_STORAGE_KEY || !event.newValue) return;
    try {
      listener({ source: "storage", profile: normalizePlayerCharacterProfile(JSON.parse(event.newValue)) });
    } catch (error) {
      console.warn("Ignored invalid character profile storage event.", error);
    }
  };
  globalThis.addEventListener?.("storage", onStorage);

  return () => {
    listeners.delete(listener);
    globalThis.removeEventListener?.("storage", onStorage);
  };
}

export function closePlayerCharacterProfileStore() {
  channel?.close();
  channel = null;
  listeners.clear();
}
