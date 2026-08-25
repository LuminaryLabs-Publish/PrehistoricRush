import assert from "node:assert/strict";
import { installPrehistoricRushPlayerActor } from "../src/domains/prehistoric-rush/player-actor-binding.js";
import { createDefaultPlayerCharacterProfile } from "../src/shared/player-character-schema.js";
import {
  DEFAULT_RACER_BEHAVIOR_REGISTRY
} from "../src/racers/racer-behavior-registry.js";
import {
  getRacerProfile,
  listRacerProfiles,
  resolvePlayableRacerProfile
} from "../src/racers/racer-catalog.js";
import { normalizeRacerIntent } from "../src/racers/racer-intent.js";
import { RACER_PROFILE_SCHEMA_VERSION, defineRacerProfile } from "../src/racers/racer-profile.js";

const profiles = listRacerProfiles();
assert.deepEqual(profiles.map((profile) => profile.id), ["velociraptor", "triceratops"]);
assert.equal(getRacerProfile("velociraptor").availability, "playable");
assert.equal(getRacerProfile("triceratops").availability, "controller-proof");
assert.equal(resolvePlayableRacerProfile("triceratops").id, "velociraptor", "non-live body profiles cannot enter the production route");
assert.throws(() => getRacerProfile("unknown"), /Unknown racer profile/);

for (const profile of profiles) {
  assert.equal(profile.schemaVersion, RACER_PROFILE_SCHEMA_VERSION);
  assert.ok(Object.isFrozen(profile));
  assert.ok(Object.isFrozen(profile.movement));
  assert.ok(Object.isFrozen(profile.camera));
  assert.ok(profile.movement.baseSpeed <= profile.movement.maximumSpeed);
  assert.ok(profile.movement.maximumSpeed <= profile.movement.boostSpeed);
  assert.ok(profile.actor.capabilities.includes("locomotion"));
  assert.equal("creature" in profile, false, "gameplay RacerProfile does not own cosmetic creature data");
}

const cosmeticProfile = createDefaultPlayerCharacterProfile();
assert.ok(cosmeticProfile.creature, "cosmetic profile still owns procedural body data");
assert.equal("movement" in cosmeticProfile, false, "cosmetic profile does not absorb racer gameplay tuning");

assert.deepEqual(normalizeRacerIntent({ steer: 4, boost: 1, jump: 0, ability: "yes" }), {
  steer: 1,
  boost: true,
  jump: false,
  ability: true
});
assert.ok(Object.isFrozen(normalizeRacerIntent()));
assert.deepEqual(
  DEFAULT_RACER_BEHAVIOR_REGISTRY.listAbilities().map((entry) => entry.id),
  ["vine-swing", "charge-ram"]
);
assert.deepEqual(
  DEFAULT_RACER_BEHAVIOR_REGISTRY.listPassives().map((entry) => entry.id),
  ["agile-landing", "line-holder"]
);

assert.throws(
  () => defineRacerProfile({ ...getRacerProfile("velociraptor"), movement: { ...getRacerProfile("velociraptor").movement, maximumSpeed: 1 } }),
  /movement.maximumSpeed/
);

function createActorEngine() {
  const creatures = new Map();
  const characters = new Map();
  const players = new Map();
  return {
    records: { creatures, characters, players },
    n: {
      creature: {
        has: (id) => creatures.has(id),
        register(value) { creatures.set(value.id, structuredClone(value)); }
      },
      character: {
        has: (id) => characters.has(id),
        create(value) { characters.set(value.id, structuredClone(value)); }
      },
      player: {
        has: (id) => players.has(id),
        register(value) { players.set(value.id, structuredClone(value)); },
        possess(id, characterId) {
          players.set(id, { ...players.get(id), characterId, controlStatus: "enabled" });
        }
      }
    }
  };
}

for (const profile of profiles) {
  const engine = createActorEngine();
  const binding = installPrehistoricRushPlayerActor(engine, { profile });
  const creature = engine.records.creatures.get(binding.creatureId);
  const character = engine.records.characters.get(binding.characterId);
  assert.equal(binding.racerId, profile.id);
  assert.equal(creature.archetype, profile.actor.archetype);
  assert.equal(creature.body.descriptorId, profile.actor.bodyDescriptorId);
  assert.deepEqual(creature.capabilities, profile.actor.capabilities);
  assert.equal(character.bindings.motionActorId, profile.actor.motionActorId);
  assert.equal(engine.records.players.get(binding.playerId).controlStatus, "enabled");
}

console.log("racer profile contract ok");
