import { defineRacerProfile } from "../racer-profile.js";

export const TRICERATOPS_RACER_PROFILE = defineRacerProfile({
  id: "triceratops",
  displayName: "Triceratops",
  racingIdentity: "Heavy line-holder that preserves pace through rough ground and commits to a charge.",
  availability: "controller-proof",
  ratings: { speed: "normal", handling: "low", weight: "high", stamina: "high", skill: "normal" },
  movement: {
    baseSpeed: 13.5,
    maximumSpeed: 21,
    boostSpeed: 25,
    accelerationResponse: 1.85,
    turnRate: 1.35,
    gravity: 38,
    jumpImpulse: 8.5
  },
  surfaces: { path: 1, edge: 0.94, verge: 0.82, forest: 0.62, response: 3.6 },
  stamina: { capacity: 125, recoveryRate: 14, behavior: "Large reserve with slower recovery after committed charges." },
  abilities: { active: "charge-ram", passive: "line-holder" },
  actor: {
    archetype: "ceratopsian",
    creatureId: "prehistoric-rush-triceratops",
    characterId: "triceratops-character",
    playerId: "triceratops-proof-player",
    motionActorId: "triceratops-character",
    motionIntentPrefix: "triceratops-motion",
    bodyProvider: "prehistoric-rush",
    bodyDescriptorId: "triceratops-body",
    rigProvider: "prehistoric-rush",
    rigDescriptorId: "triceratops-rig",
    supportKind: "feet",
    capabilities: ["locomotion", "charge-ram", "line-holder"]
  },
  presentation: {
    creatureRecipeId: "prehistoric-rush-triceratops",
    meshName: "prehistoric-rush-procedural-triceratops",
    snapshotName: "controller-proof-triceratops",
    rootOffsetY: 0.04,
    poseSharpness: 14,
    turnScale: 0.2,
    jumpNormalization: 1.2,
    framingPadding: 1.55,
    fovRange: [38, 56]
  },
  camera: {
    halfWidth: 2.25,
    height: 2.8,
    halfDepth: 2.7,
    padding: 5.6,
    minimumDistance: 12,
    maximumDistance: 22,
    smoothTime: 0.16,
    verticalFov: 64,
    preferredDirection: [0, 0.46, -1],
    lookAheadSeconds: 0.12
  }
});
