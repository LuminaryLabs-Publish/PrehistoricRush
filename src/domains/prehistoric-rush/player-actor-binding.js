import { defineRacerProfile } from "../../racers/racer-profile.js";
import { VELOCIRAPTOR_RACER_PROFILE } from "../../racers/profiles/velociraptor.js";

export function installPrehistoricRushPlayerActor(engine, options = {}) {
  const creature = engine?.n?.creature;
  const character = engine?.n?.character;
  const player = engine?.n?.player;
  if (!creature || !character || !player) throw new TypeError("Player actor binding requires Nexus creature, character, and player services.");

  const profile = defineRacerProfile(options.profile ?? VELOCIRAPTOR_RACER_PROFILE);
  const actor = profile.actor;
  const creatureId = String(options.creatureId ?? actor.creatureId);
  const characterId = String(options.characterId ?? actor.characterId);
  const playerId = String(options.playerId ?? actor.playerId);
  const motionActorId = String(options.motionActorId ?? actor.motionActorId);

  if (!creature.has(creatureId)) creature.register({
    id: creatureId,
    archetype: actor.archetype,
    body: { provider: actor.bodyProvider, descriptorId: actor.bodyDescriptorId },
    rig: { provider: actor.rigProvider, descriptorId: actor.rigDescriptorId },
    support: { kind: actor.supportKind, fallback: "bounds-minimum", clearance: 0 },
    presentation: {
      framingPadding: profile.presentation.framingPadding,
      fovRange: [...profile.presentation.fovRange]
    },
    capabilities: [...actor.capabilities]
  });
  if (!character.has(characterId)) character.create({
    id: characterId,
    creatureId,
    profileId: playerId,
    bindings: { poseId: null, motionActorId, physicsBodyId: null },
    status: "active"
  });
  if (!player.has(playerId)) player.register({ id: playerId, characterId: null, controlStatus: "disabled" });
  player.possess(playerId, characterId);
  return Object.freeze({ racerId: profile.id, playerId, characterId, creatureId, motionActorId });
}
