import assert from "node:assert/strict";
import { installPrehistoricRushPlayerCharacter } from "../src/domains/prehistoric-rush/player-character-composition.js";

const clone = (value) => value === undefined ? undefined : structuredClone(value);
const creatureRecords = new Map();
const characterRecords = new Map();
const playerRecords = new Map();
const bodyRecords = new Map();
const rigRecords = new Map();
let creatureReplacements = 0;

const creatureBody = {
  create(recipe) {
    const preset = recipe.preset ?? {};
    const scale = Number(preset.proportions?.bodyScale ?? 1);
    const legLength = Number(preset.proportions?.legLength ?? 0.78);
    const descriptor = {
      id: String(recipe.id),
      archetype: String(recipe.archetype ?? "theropod"),
      contentHash: `${recipe.id}:${scale}:${legLength}`,
      transform: { scale: [scale, scale, scale] },
      bounds: { min: [-0.5, -0.16, -2], max: [0.5, 1.32, 1.6] },
      collision: { shape: "capsule", radius: 0.32, halfHeight: 0.42, centerY: 0.62 },
      skeleton: {
        rootBoneId: "root",
        bones: [
          { id: "root", parentId: null, position: [0, 0, 0], rotation: [0, 0, 0, 1] },
          { id: "pelvis", parentId: "root", position: [0, 0.66, -0.2], rotation: [0, 0, 0, 1] },
          { id: "chest", parentId: "pelvis", position: [0, 0.18, 0.5], rotation: [0, 0, 0, 1] },
          { id: "thigh-L", parentId: "pelvis", position: [-0.28, -0.08, 0.02], rotation: [0, 0, 0, 1] },
          { id: "shin-L", parentId: "thigh-L", position: [-0.035, -legLength * 0.5, 0.1], rotation: [0, 0, 0, 1] },
          { id: "foot-L", parentId: "shin-L", position: [0.015, -legLength * 0.36, 0.22], rotation: [0, 0, 0, 1] },
          { id: "thigh-R", parentId: "pelvis", position: [0.28, -0.08, 0.02], rotation: [0, 0, 0, 1] },
          { id: "shin-R", parentId: "thigh-R", position: [0.035, -legLength * 0.5, 0.1], rotation: [0, 0, 0, 1] },
          { id: "foot-R", parentId: "shin-R", position: [-0.015, -legLength * 0.36, 0.22], rotation: [0, 0, 0, 1] }
        ]
      }
    };
    bodyRecords.set(descriptor.id, descriptor);
    return clone(descriptor);
  },
  has: (id) => bodyRecords.has(String(id)),
  get: (id) => clone(bodyRecords.get(String(id)) ?? null)
};

const articulatedMotion = {
  registerRig(rig) {
    rigRecords.set(rig.id, clone(rig));
    return clone(rig);
  },
  getRig: (id) => clone(rigRecords.get(String(id)) ?? null)
};

const coreCreature = {
  register(value) {
    const next = { schema: "nexus-creature-definition/1", ...clone(value) };
    creatureRecords.set(next.id, next);
    return clone(next);
  },
  replace(value) {
    creatureReplacements += 1;
    const next = { schema: "nexus-creature-definition/1", ...clone(value) };
    creatureRecords.set(next.id, next);
    return clone(next);
  },
  get: (id) => clone(creatureRecords.get(String(id)) ?? null)
};

const coreCharacter = {
  create(value) {
    const next = { schema: "nexus-character/1", ...clone(value) };
    characterRecords.set(next.id, next);
    return clone(next);
  },
  replace(value) {
    const next = { schema: "nexus-character/1", ...clone(value) };
    characterRecords.set(next.id, next);
    return clone(next);
  },
  get: (id) => clone(characterRecords.get(String(id)) ?? null),
  resolve(id) {
    const character = this.get(id);
    return character ? { character, creature: coreCreature.get(character.creatureId) } : null;
  }
};

const corePlayer = {
  has: (id) => playerRecords.has(String(id)),
  register(value) {
    const next = { schema: "nexus-player/1", ...clone(value) };
    playerRecords.set(next.id, next);
    return clone(next);
  },
  possess(id, characterId) {
    const current = playerRecords.get(String(id));
    const next = {
      ...current,
      characterId: String(characterId),
      controlStatus: "enabled",
      controlGeneration: Number(current.controlGeneration ?? 0) + 1
    };
    playerRecords.set(next.id, next);
    return clone(next);
  },
  getControlledCharacter(id) {
    const player = clone(playerRecords.get(String(id)) ?? null);
    const resolved = player?.characterId ? coreCharacter.resolve(player.characterId) : null;
    return resolved ? { player, ...resolved } : null;
  }
};

const engine = {
  coreCreature,
  coreCharacter,
  corePlayer,
  n: { proceduralCreatureBody: creatureBody, articulatedMotion }
};

const profile = {
  profileId: "player-1",
  creature: {
    id: "raptor",
    archetype: "theropod",
    preset: { proportions: { bodyScale: 0.82, legLength: 0.78 } }
  }
};
const installed = installPrehistoricRushPlayerCharacter({ engine, profile });
assert.equal(installed.playerId, "player-1");
assert.equal(installed.characterId, "player-character");
assert.equal(installed.bodyId, "raptor");
assert.equal(installed.rigId, "raptor:rig");
assert.deepEqual(installed.creature.support.boneIds, ["foot-L", "foot-R"]);
assert.equal(installed.creature.presentation.focusBoneId, "chest");
assert.equal(corePlayer.getControlledCharacter("player-1").creature.id, installed.creatureId);
assert.doesNotThrow(() => structuredClone(installed));

const repeated = installPrehistoricRushPlayerCharacter({ engine, profile });
assert.equal(repeated.creatureId, installed.creatureId);
assert.equal(creatureReplacements, 0, "identical composition is idempotent");

const resizedProfile = clone(profile);
resizedProfile.creature.preset.proportions.bodyScale = 1.1;
const resized = installPrehistoricRushPlayerCharacter({ engine, profile: resizedProfile });
assert.equal(resized.creature.presentation.metadata.scale[0], 1.1);
assert.equal(creatureReplacements, 1, "changed embodiment explicitly replaces the creature definition");

const preview = installPrehistoricRushPlayerCharacter({
  engine,
  profile,
  characterId: "preview-character",
  includePlayer: false,
  motionActorId: null,
  physicsBodyId: null
});
assert.equal(preview.playerId, null);
assert.equal(preview.character.bindings.motionActorId, null);

console.log("player character composition test ok");
