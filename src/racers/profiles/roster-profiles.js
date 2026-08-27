import { defineRacerProfile } from "../racer-profile.js";

function createRosterProfile({
  id,
  displayName,
  racingIdentity,
  ratings,
  movement,
  surfaces,
  stamina,
  pace,
  active,
  passive,
  archetype,
  capabilities = [],
  presentation = {},
  camera = {}
}) {
  return defineRacerProfile({
    id,
    displayName,
    racingIdentity,
    availability: "playable",
    ratings,
    movement,
    surfaces,
    stamina,
    pace,
    abilities: { active, passive },
    actor: {
      archetype,
      creatureId: `prehistoric-rush-${id}`,
      characterId: `${id}-character`,
      playerId: `${id}-player`,
      motionActorId: `${id}-character`,
      motionIntentPrefix: `${id}-motion`,
      bodyProvider: "prehistoric-rush",
      bodyDescriptorId: `${id}-body`,
      rigProvider: "prehistoric-rush",
      rigDescriptorId: `${id}-rig`,
      supportKind: "feet",
      capabilities: ["locomotion", "jump", active, passive, ...capabilities]
    },
    presentation: {
      creatureRecipeId: `prehistoric-rush-${id}`,
      meshName: `prehistoric-rush-procedural-${id}`,
      snapshotName: `procedural-${id}`,
      rootOffsetY: presentation.rootOffsetY ?? 0.05,
      poseSharpness: presentation.poseSharpness ?? 16,
      turnScale: presentation.turnScale ?? 0.28,
      jumpNormalization: presentation.jumpNormalization ?? 2,
      framingPadding: presentation.framingPadding ?? 1.4,
      fovRange: presentation.fovRange ?? [36, 56]
    },
    camera: {
      halfWidth: camera.halfWidth ?? 1.9,
      height: camera.height ?? 2.7,
      halfDepth: camera.halfDepth ?? 2,
      padding: camera.padding ?? 5.2,
      minimumDistance: camera.minimumDistance ?? 11,
      maximumDistance: camera.maximumDistance ?? 20,
      smoothTime: camera.smoothTime ?? 0.14,
      verticalFov: camera.verticalFov ?? 63,
      preferredDirection: camera.preferredDirection ?? [0, 0.48, -1],
      lookAheadSeconds: camera.lookAheadSeconds ?? 0.08
    }
  });
}

export const TYRANNOSAURUS_REX_RACER_PROFILE = createRosterProfile({
  id: "tyrannosaurus-rex",
  displayName: "Tyrannosaurus rex",
  racingIdentity: "A heavyweight pace-setter that uses momentum and a roar shockwave to reshape nearby racing lines.",
  ratings: { speed: "normal", handling: "low", weight: "high", stamina: "high", skill: "normal" },
  movement: { baseSpeed: 14, maximumSpeed: 22.5, boostSpeed: 27, accelerationResponse: 1.7, turnRate: 1.2, gravity: 39, jumpImpulse: 8.2 },
  surfaces: { path: 1, edge: 0.95, verge: 0.8, forest: 0.58, response: 3.3 },
  stamina: { capacity: 130, recoveryRate: 13, behavior: "Large reserve rewards long, committed straights." },
  pace: { curve: [0.30, 0.48, 0.68, 0.86, 1], sprintDrainRate: 24, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "roar-shockwave",
  passive: "heavy-momentum",
  archetype: "tyrannosaur",
  presentation: { poseSharpness: 13, turnScale: 0.18, framingPadding: 1.7 },
  camera: { halfWidth: 2.4, height: 3.3, halfDepth: 3, padding: 6, minimumDistance: 13, maximumDistance: 23, smoothTime: 0.17 }
});
export const STEGOSAURUS_RACER_PROFILE = createRosterProfile({
  id: "stegosaurus",
  displayName: "Stegosaurus",
  racingIdentity: "A broad, stable racer that protects its immediate space with a sweeping tail.",
  ratings: { speed: "low", handling: "normal", weight: "high", stamina: "high", skill: "low" },
  movement: { baseSpeed: 12.8, maximumSpeed: 20, boostSpeed: 24, accelerationResponse: 1.7, turnRate: 1.55, gravity: 38, jumpImpulse: 8 },
  surfaces: { path: 1, edge: 0.96, verge: 0.84, forest: 0.65, response: 3.4 },
  stamina: { capacity: 132, recoveryRate: 13.5, behavior: "Steady stamina supports deliberate defensive pacing." },
  pace: { curve: [0.40, 0.58, 0.74, 0.89, 1], sprintDrainRate: 22, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "tail-sweep",
  passive: "wide-stability",
  archetype: "stegosaur",
  presentation: { poseSharpness: 13, turnScale: 0.2, framingPadding: 1.7 },
  camera: { halfWidth: 2.55, height: 2.8, halfDepth: 3.15, padding: 6, minimumDistance: 13, maximumDistance: 24 }
});

export const SPINOSAURUS_RACER_PROFILE = createRosterProfile({
  id: "spinosaurus",
  displayName: "Spinosaurus",
  racingIdentity: "An amphibious route specialist that turns wet terrain into a high-speed racing line.",
  ratings: { speed: "high", handling: "normal", weight: "high", stamina: "normal", skill: "high" },
  movement: { baseSpeed: 14.4, maximumSpeed: 24, boostSpeed: 29, accelerationResponse: 2.05, turnRate: 1.55, gravity: 37, jumpImpulse: 9.5 },
  surfaces: { path: 1, edge: 1.02, verge: 0.94, forest: 0.58, response: 4.1 },
  stamina: { capacity: 108, recoveryRate: 16, behavior: "Efficient on wet or soft edges; average reserve elsewhere." },
  pace: { curve: [0.44, 0.65, 0.82, 0.94, 1], sprintDrainRate: 28, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "water-rush",
  passive: "amphibious",
  archetype: "spinosaur",
  presentation: { poseSharpness: 15, turnScale: 0.24, framingPadding: 1.65 },
  camera: { halfWidth: 2.3, height: 3.4, halfDepth: 3, padding: 5.9, minimumDistance: 13, maximumDistance: 23 }
});

export const ANKYLOSAURUS_RACER_PROFILE = createRosterProfile({
  id: "ankylosaurus",
  displayName: "Ankylosaurus",
  racingIdentity: "An armored recovery racer that absorbs disruption and answers with a heavy tail slam.",
  ratings: { speed: "low", handling: "low", weight: "high", stamina: "high", skill: "low" },
  movement: { baseSpeed: 12.5, maximumSpeed: 19.5, boostSpeed: 23, accelerationResponse: 1.6, turnRate: 1.25, gravity: 40, jumpImpulse: 7.2 },
  surfaces: { path: 1, edge: 0.98, verge: 0.88, forest: 0.72, response: 3.1 },
  stamina: { capacity: 140, recoveryRate: 12.5, behavior: "The deepest reserve, tuned for resilient recovery." },
  pace: { curve: [0.28, 0.46, 0.66, 0.84, 1], sprintDrainRate: 20, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "tail-slam",
  passive: "armored-recovery",
  archetype: "ankylosaur",
  presentation: { poseSharpness: 12, turnScale: 0.16, framingPadding: 1.75 },
  camera: { halfWidth: 2.5, height: 2.35, halfDepth: 3.1, padding: 6.1, minimumDistance: 13, maximumDistance: 24 }
});

export const PACHYCEPHALOSAURUS_RACER_PROFILE = createRosterProfile({
  id: "pachycephalosaurus",
  displayName: "Pachycephalosaurus",
  racingIdentity: "An impact-routing specialist that converts contact into a sharp redirect and speed gain.",
  ratings: { speed: "normal", handling: "high", weight: "normal", stamina: "normal", skill: "high" },
  movement: { baseSpeed: 14.5, maximumSpeed: 23.5, boostSpeed: 28, accelerationResponse: 2.25, turnRate: 2.05, gravity: 35, jumpImpulse: 10.5 },
  surfaces: { path: 1, edge: 0.9, verge: 0.72, forest: 0.48, response: 4.4 },
  stamina: { capacity: 102, recoveryRate: 17, behavior: "Balanced reserve rewards well-timed redirects." },
  pace: { curve: [0.50, 0.68, 0.84, 0.95, 1], sprintDrainRate: 29, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "headbutt-redirect",
  passive: "impact-boost",
  archetype: "pachycephalosaur",
  presentation: { poseSharpness: 18, turnScale: 0.34 },
  camera: { halfWidth: 1.75, height: 2.6, halfDepth: 1.9, padding: 5, minimumDistance: 10.5, maximumDistance: 19 }
});

export const CARNOTAURUS_RACER_PROFILE = createRosterProfile({
  id: "carnotaurus",
  displayName: "Carnotaurus",
  racingIdentity: "An acceleration predator built around explosive sprint windows and decisive exits.",
  ratings: { speed: "high", handling: "normal", weight: "normal", stamina: "low", skill: "normal" },
  movement: { baseSpeed: 15, maximumSpeed: 25, boostSpeed: 31.5, accelerationResponse: 3.1, turnRate: 1.7, gravity: 36, jumpImpulse: 10.2 },
  surfaces: { path: 1, edge: 0.88, verge: 0.66, forest: 0.4, response: 4.7 },
  stamina: { capacity: 82, recoveryRate: 20, behavior: "Small reserve refills quickly between sprint bursts." },
  pace: { curve: [0.18, 0.42, 0.72, 0.93, 1], sprintDrainRate: 34, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "sprint-burst",
  passive: "fast-acceleration",
  archetype: "abelisaur",
  presentation: { poseSharpness: 19, turnScale: 0.28 },
  camera: { halfWidth: 1.95, height: 2.8, halfDepth: 2.25, padding: 5.2, minimumDistance: 11, maximumDistance: 20 }
});

export const GALLIMIMUS_RACER_PROFILE = createRosterProfile({
  id: "gallimimus",
  displayName: "Gallimimus",
  racingIdentity: "A clean-line speed racer that conserves momentum when steering inputs stay smooth.",
  ratings: { speed: "high", handling: "high", weight: "low", stamina: "high", skill: "high" },
  movement: { baseSpeed: 16.5, maximumSpeed: 27, boostSpeed: 32, accelerationResponse: 2.7, turnRate: 2.15, gravity: 33, jumpImpulse: 12.5 },
  surfaces: { path: 1, edge: 0.86, verge: 0.63, forest: 0.38, response: 5 },
  stamina: { capacity: 118, recoveryRate: 18, behavior: "Efficient sustained running collapses under messy route changes." },
  pace: { curve: [0.45, 0.66, 0.84, 0.95, 1], sprintDrainRate: 30, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "momentum-run",
  passive: "momentum-conservation",
  archetype: "ornithomimid",
  presentation: { poseSharpness: 20, turnScale: 0.34, framingPadding: 1.25 },
  camera: { halfWidth: 1.55, height: 2.7, halfDepth: 1.65, padding: 4.7, minimumDistance: 10, maximumDistance: 18, lookAheadSeconds: 0.14 }
});

export const THERIZINOSAURUS_RACER_PROFILE = createRosterProfile({
  id: "therizinosaurus",
  displayName: "Therizinosaurus",
  racingIdentity: "A reach-based traversal racer that uses long claws to vault over compromised lines.",
  ratings: { speed: "normal", handling: "normal", weight: "normal", stamina: "normal", skill: "high" },
  movement: { baseSpeed: 14, maximumSpeed: 22.5, boostSpeed: 27, accelerationResponse: 2, turnRate: 1.75, gravity: 34, jumpImpulse: 12.8 },
  surfaces: { path: 1, edge: 0.9, verge: 0.7, forest: 0.5, response: 4.2 },
  stamina: { capacity: 105, recoveryRate: 16, behavior: "Balanced reserve supports deliberate vault routes." },
  pace: { curve: [0.36, 0.56, 0.75, 0.90, 1], sprintDrainRate: 24, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "claw-vault",
  passive: "long-reach",
  archetype: "therizinosaur",
  presentation: { poseSharpness: 16, turnScale: 0.29, framingPadding: 1.5 },
  camera: { halfWidth: 2, height: 3.3, halfDepth: 2.1, padding: 5.5, minimumDistance: 12, maximumDistance: 21 }
});

export const BRACHIOSAURUS_RACER_PROFILE = createRosterProfile({
  id: "brachiosaurus",
  displayName: "Brachiosaurus",
  racingIdentity: "A towering terrain controller whose long stride and ground stomp change the route around it.",
  ratings: { speed: "low", handling: "low", weight: "high", stamina: "high", skill: "normal" },
  movement: { baseSpeed: 11.5, maximumSpeed: 18.5, boostSpeed: 22, accelerationResponse: 1.35, turnRate: 1.05, gravity: 42, jumpImpulse: 6 },
  surfaces: { path: 1, edge: 0.98, verge: 0.9, forest: 0.74, response: 2.8 },
  stamina: { capacity: 150, recoveryRate: 11.5, behavior: "Massive reserve supports slow, unstoppable pacing." },
  pace: { curve: [0.24, 0.42, 0.63, 0.82, 1], sprintDrainRate: 18, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "ground-stomp",
  passive: "long-stride",
  archetype: "sauropod",
  presentation: { poseSharpness: 10, turnScale: 0.12, framingPadding: 2 },
  camera: { halfWidth: 3, height: 5.2, halfDepth: 3.5, padding: 7.4, minimumDistance: 16, maximumDistance: 29, smoothTime: 0.2 }
});

export const PTERANODON_RACER_PROFILE = createRosterProfile({
  id: "pteranodon",
  displayName: "Pteranodon",
  racingIdentity: "A vertical-line specialist that trades grounded traction for controlled glide and dive routes.",
  ratings: { speed: "high", handling: "high", weight: "low", stamina: "low", skill: "high" },
  movement: { baseSpeed: 15, maximumSpeed: 24.5, boostSpeed: 30, accelerationResponse: 2.5, turnRate: 2.35, gravity: 27, jumpImpulse: 14 },
  surfaces: { path: 1, edge: 0.84, verge: 0.64, forest: 0.36, response: 4.8 },
  stamina: { capacity: 88, recoveryRate: 19, behavior: "Short aerial windows demand active stamina management." },
  pace: { curve: [0.20, 0.43, 0.74, 0.94, 1], sprintDrainRate: 30, sprintMinimumToStart: 0.18, sprintMinimumToMaintain: 0.08 },
  active: "glide-dive",
  passive: "air-control",
  archetype: "pterosaur",
  presentation: { poseSharpness: 21, turnScale: 0.4, jumpNormalization: 3, framingPadding: 1.45 },
  camera: { halfWidth: 2.3, height: 3.1, halfDepth: 2.2, padding: 5.8, minimumDistance: 12, maximumDistance: 22, verticalFov: 66, lookAheadSeconds: 0.16 }
});
