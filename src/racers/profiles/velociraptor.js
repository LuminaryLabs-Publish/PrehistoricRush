import { defineRacerProfile } from "../racer-profile.js";

export const VELOCIRAPTOR_RACER_PROFILE = defineRacerProfile({
  id: "velociraptor",
  displayName: "Velociraptor",
  racingIdentity: "Fast traversal racer with agile landings and high steering control.",
  availability: "playable",
  ratings: { speed: "high", handling: "high", weight: "low", stamina: "normal", skill: "normal" },
  movement: {
    baseSpeed: 16,
    maximumSpeed: 26,
    boostSpeed: 31,
    accelerationResponse: 2.6,
    turnRate: 2.25,
    gravity: 34,
    jumpImpulse: 13.5
  },
  surfaces: { path: 1, edge: 0.88, verge: 0.68, forest: 0.42, response: 4.8 },
  stamina: { capacity: 100, recoveryRate: 18, behavior: "Quick recovery after short traversal bursts." },
  pace: { curve: [0.38, 0.62, 0.82, 0.94, 1], sprintDrainRate: 27, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  abilities: { active: "vine-swing", passive: "agile-landing" },
  actor: {
    archetype: "raptor",
    creatureId: "prehistoric-rush-raptor",
    characterId: "player-character",
    playerId: "player-1",
    motionActorId: "player-character",
    motionIntentPrefix: "player-motion",
    bodyProvider: "prehistoric-rush",
    bodyDescriptorId: "raptor-body",
    rigProvider: "prehistoric-rush",
    rigDescriptorId: "raptor-rig",
    supportKind: "feet",
    capabilities: ["locomotion", "jump", "vine-swing"]
  },
  presentation: {
    creatureRecipeId: "prehistoric-rush-raptor",
    meshName: "prehistoric-rush-procedural-raptor",
    snapshotName: "procedural-skinned-raptor",
    rootOffsetY: 0.05,
    poseSharpness: 18,
    turnScale: 0.32,
    jumpNormalization: 2,
    framingPadding: 1.3,
    fovRange: [36, 52]
  },
  camera: {
    halfWidth: 1.6,
    height: 2.4,
    halfDepth: 1.6,
    padding: 4.8,
    minimumDistance: 10,
    maximumDistance: 18,
    smoothTime: 0.12,
    verticalFov: 62,
    preferredDirection: [0, 0.5, -1],
    lookAheadSeconds: 0
  }
});
