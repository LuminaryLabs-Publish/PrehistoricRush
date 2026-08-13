export function installPrehistoricRushPlayerActor(engine) {
  const creature = engine.n.creature;
  const character = engine.n.character;
  const player = engine.n.player;
  const creatureId = "prehistoric-rush-raptor";
  const characterId = "player-character";
  const playerId = "player-1";

  if (!creature.has(creatureId)) creature.register({
    id: creatureId,
    archetype: "raptor",
    body: { provider: "prehistoric-rush", descriptorId: "raptor-body" },
    rig: { provider: "prehistoric-rush", descriptorId: "raptor-rig" },
    support: { kind: "feet", fallback: "bounds-minimum", clearance: 0 },
    presentation: { framingPadding: 1.3, fovRange: [36, 52] },
    capabilities: ["locomotion"]
  });
  if (!character.has(characterId)) character.create({
    id: characterId,
    creatureId,
    profileId: playerId,
    bindings: { poseId: null, motionActorId: characterId, physicsBodyId: null },
    status: "active"
  });
  if (!player.has(playerId)) player.register({ id: playerId, characterId: null, controlStatus: "disabled" });
  player.possess(playerId, characterId);
  return Object.freeze({ playerId, characterId, creatureId });
}
