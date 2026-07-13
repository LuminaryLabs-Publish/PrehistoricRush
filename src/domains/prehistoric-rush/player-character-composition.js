import { createPlayerArticulatedRig } from "./player-articulation.js";

const clone = (value) => value === undefined ? undefined : structuredClone(value);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function requireApi(engine, name) {
  const api = engine?.[name] ?? engine?.n?.[name];
  if (!api) throw new TypeError(`PrehistoricRush player-character composition requires ${name}.`);
  return api;
}

export function createPrehistoricRushCreatureDefinition({
  profile = {},
  bodyDescriptor,
  rigDescriptor,
  creatureId,
  visualRootOffsetY = 0.05
} = {}) {
  if (!bodyDescriptor?.id) throw new TypeError("A procedural creature body descriptor is required.");
  if (!rigDescriptor?.id) throw new TypeError("An articulated rig descriptor is required.");
  const recipe = profile?.creature ?? profile;
  return {
    id: String(creatureId ?? `${bodyDescriptor.id}:creature`),
    archetype: String(bodyDescriptor.archetype ?? recipe?.archetype ?? "creature"),
    body: {
      provider: "procedural-creature-body",
      descriptorId: String(bodyDescriptor.id),
      contentHash: bodyDescriptor.contentHash ?? null
    },
    rig: {
      provider: "articulated-motion",
      descriptorId: String(rigDescriptor.id),
      contentHash: rigDescriptor.metadata?.contentHash ?? bodyDescriptor.contentHash ?? null
    },
    collision: clone(bodyDescriptor.collision ?? {}),
    support: {
      kind: "feet",
      boneIds: ["foot-L", "foot-R"],
      fallback: "bounds-minimum",
      clearance: 0
    },
    presentation: {
      focusBoneId: "chest",
      framingPadding: 1.18,
      fovRange: [36, 48],
      metadata: {
        bounds: clone(bodyDescriptor.bounds ?? null),
        scale: clone(bodyDescriptor.transform?.scale ?? [1, 1, 1]),
        visualRootOffsetY: Number(visualRootOffsetY)
      }
    },
    capabilities: ["articulation", "locomotion", "terrain-ik"],
    metadata: {
      profileId: profile?.profileId == null ? null : String(profile.profileId),
      recipeId: recipe?.id == null ? null : String(recipe.id)
    }
  };
}

export function installPrehistoricRushPlayerCharacter({
  engine,
  profile = {},
  creatureRecipe,
  bodyId,
  creatureId,
  characterId = "player-character",
  playerId,
  motionActorId = "dino",
  physicsBodyId = "dino",
  includePlayer = true,
  status = "active",
  visualRootOffsetY = 0.05
} = {}) {
  const creatureBody = requireApi(engine, "proceduralCreatureBody");
  const articulatedMotion = requireApi(engine, "articulatedMotion");
  const coreCreature = requireApi(engine, "coreCreature");
  const coreCharacter = requireApi(engine, "coreCharacter");
  const recipe = creatureRecipe ?? profile?.creature ?? profile;
  const resolvedBodyId = String(bodyId ?? recipe?.id ?? "prehistoric-rush-raptor");
  const bodyDescriptor = creatureBody.create(recipe);
  if (bodyDescriptor.id !== resolvedBodyId && creatureBody.has?.(resolvedBodyId)) {
    throw new Error(`Player creature body id mismatch: expected ${resolvedBodyId}, received ${bodyDescriptor.id}.`);
  }

  const rigDescriptor = createPlayerArticulatedRig(bodyDescriptor, { rigId: `${bodyDescriptor.id}:rig` });
  articulatedMotion.registerRig(rigDescriptor);

  const creatureDefinition = createPrehistoricRushCreatureDefinition({
    profile,
    bodyDescriptor,
    rigDescriptor,
    creatureId,
    visualRootOffsetY
  });
  const existingCreature = coreCreature.get(creatureDefinition.id);
  const creature = !existingCreature
    ? coreCreature.register(creatureDefinition)
    : same(existingCreature, { schema: existingCreature.schema, ...creatureDefinition })
      ? existingCreature
      : coreCreature.replace(creatureDefinition);

  const existingCharacter = coreCharacter.get(characterId);
  const characterInput = {
    id: String(characterId),
    creatureId: creature.id,
    profileId: profile?.profileId == null ? null : String(profile.profileId),
    bindings: {
      poseId: existingCharacter?.bindings?.poseId ?? `${characterId}:pose`,
      motionActorId: motionActorId == null ? null : String(motionActorId),
      physicsBodyId: physicsBodyId == null ? null : String(physicsBodyId)
    },
    status,
    lifecycleRevision: existingCharacter?.lifecycleRevision ?? 0,
    metadata: { source: "prehistoric-rush-player-character" }
  };
  const character = !existingCharacter
    ? coreCharacter.create(characterInput)
    : same(existingCharacter, { schema: existingCharacter.schema, ...characterInput })
      ? existingCharacter
      : coreCharacter.replace({ ...characterInput, lifecycleRevision: existingCharacter.lifecycleRevision + 1 });

  const resolvedPlayerId = String(playerId ?? profile?.profileId ?? "player-1");
  let player = null;
  if (includePlayer) {
    const corePlayer = requireApi(engine, "corePlayer");
    if (!corePlayer.has(resolvedPlayerId)) {
      corePlayer.register({
        id: resolvedPlayerId,
        characterId: null,
        controlStatus: "disabled",
        controlGeneration: 0,
        spawnGeneration: 0,
        metadata: { source: "prehistoric-rush-player-character" }
      });
    }
    player = corePlayer.possess(resolvedPlayerId, character.id);
  }

  return {
    creatureId: creature.id,
    characterId: character.id,
    playerId: includePlayer ? resolvedPlayerId : null,
    bodyId: bodyDescriptor.id,
    rigId: rigDescriptor.id,
    motionActorId: character.bindings.motionActorId,
    physicsBodyId: character.bindings.physicsBodyId,
    bodyDescriptor: clone(bodyDescriptor),
    rigDescriptor: clone(rigDescriptor),
    creature: clone(creature),
    character: clone(character),
    player: clone(player)
  };
}
