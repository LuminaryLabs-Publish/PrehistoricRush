import { createDefaultPlayerCharacterProfile } from "../shared/player-character-schema.js";

export const RACER_ROSTER_DETAILS = Object.freeze({
  "tyrannosaurus-rex": { className: "Power / Control", activeName: "Roar Shockwave", passiveName: "Heavy Momentum", accent: "#ef6942", skin: "#8d4931", underbelly: "#d7a565", proportions: { bodyLength: 1.75, hipHeight: 0.9, chestHeight: 1.18, headHeight: 1.38, headForward: 1.28, tailLength: 2.25, legLength: 0.9, armLength: 0.22, bodyScale: 1.22 } },
  velociraptor: { className: "Speed / Traversal", activeName: "Vine Swing", passiveName: "Agile Landing", accent: "#91d35f", skin: "#78ad52", underbelly: "#b8a15d", proportions: { bodyLength: 1.42, hipHeight: 0.68, chestHeight: 0.86, headHeight: 1.06, headForward: 1.02, tailLength: 1.8, legLength: 0.78, armLength: 0.44, bodyScale: 0.82 } },
  triceratops: { className: "Defense / Line", activeName: "Charge Ram", passiveName: "Line Holder", accent: "#f0bd55", skin: "#997b47", underbelly: "#d4be7a", proportions: { bodyLength: 1.82, hipHeight: 0.62, chestHeight: 0.82, headHeight: 0.9, headForward: 0.78, tailLength: 1.15, legLength: 0.54, armLength: 0.36, bodyScale: 1.18 } },
  stegosaurus: { className: "Defense / Space", activeName: "Tail Sweep", passiveName: "Wide Stability", accent: "#eaa95b", skin: "#766b3e", underbelly: "#b9a86a", proportions: { bodyLength: 2, hipHeight: 0.65, chestHeight: 0.85, headHeight: 0.84, headForward: 0.8, tailLength: 2.5, legLength: 0.58, armLength: 0.35, bodyScale: 1.14 } },
  spinosaurus: { className: "Route / Water", activeName: "Water Rush", passiveName: "Amphibious", accent: "#5fc9c5", skin: "#376f70", underbelly: "#91b7a0", proportions: { bodyLength: 1.9, hipHeight: 0.9, chestHeight: 1.25, headHeight: 1.42, headForward: 1.4, tailLength: 2.35, legLength: 0.84, armLength: 0.55, bodyScale: 1.16 } },
  ankylosaurus: { className: "Armor / Recovery", activeName: "Tail Slam", passiveName: "Armored Recovery", accent: "#b8a26d", skin: "#5f6251", underbelly: "#a9a17e", proportions: { bodyLength: 1.9, hipHeight: 0.55, chestHeight: 0.72, headHeight: 0.78, headForward: 0.72, tailLength: 1.75, legLength: 0.48, armLength: 0.34, bodyScale: 1.2 } },
  pachycephalosaurus: { className: "Impact / Redirect", activeName: "Headbutt Redirect", passiveName: "Impact Boost", accent: "#ff8c64", skin: "#aa5d46", underbelly: "#d6a874", proportions: { bodyLength: 1.3, hipHeight: 0.72, chestHeight: 0.9, headHeight: 1.25, headForward: 0.94, tailLength: 1.45, legLength: 0.76, armLength: 0.34, bodyScale: 0.84 } },
  carnotaurus: { className: "Burst / Pace", activeName: "Sprint Burst", passiveName: "Fast Acceleration", accent: "#f15a45", skin: "#9e3e33", underbelly: "#d99368", proportions: { bodyLength: 1.62, hipHeight: 0.82, chestHeight: 1.02, headHeight: 1.23, headForward: 1.18, tailLength: 2.05, legLength: 0.88, armLength: 0.2, bodyScale: 1 } },
  gallimimus: { className: "Speed / Momentum", activeName: "Momentum Run", passiveName: "Momentum Conservation", accent: "#f5d76c", skin: "#b59d4c", underbelly: "#e4d9a3", proportions: { bodyLength: 1.28, hipHeight: 0.76, chestHeight: 0.88, headHeight: 1.32, headForward: 1.08, tailLength: 1.65, legLength: 1.08, armLength: 0.4, bodyScale: 0.72 } },
  therizinosaurus: { className: "Reach / Vault", activeName: "Claw Vault", passiveName: "Long Reach", accent: "#c192dc", skin: "#765b83", underbelly: "#c0a9c8", proportions: { bodyLength: 1.48, hipHeight: 0.83, chestHeight: 1.16, headHeight: 1.42, headForward: 1, tailLength: 1.45, legLength: 0.84, armLength: 0.9, bodyScale: 1.02 } },
  brachiosaurus: { className: "Scale / Terrain", activeName: "Ground Stomp", passiveName: "Long Stride", accent: "#6dc38b", skin: "#4e8063", underbelly: "#9bc19d", proportions: { bodyLength: 2.2, hipHeight: 1.1, chestHeight: 1.45, headHeight: 1.7, headForward: 0.88, tailLength: 2.8, legLength: 1.3, armLength: 0.65, bodyScale: 1.35 } },
  pteranodon: { className: "Air / Vertical", activeName: "Glide Dive", passiveName: "Air Control", accent: "#69b8ea", skin: "#547d92", underbelly: "#aec8cc", proportions: { bodyLength: 1.15, hipHeight: 0.62, chestHeight: 0.82, headHeight: 1.28, headForward: 1.62, tailLength: 0.82, legLength: 0.58, armLength: 0.9, bodyScale: 0.78 } }
});

export function getRacerRosterDetails(id) {
  const details = RACER_ROSTER_DETAILS[String(id)];
  if (!details) throw new RangeError(`Unknown roster presentation: ${id}.`);
  return details;
}
export function createRacerCharacterProfile(racerProfile, customization = null) {
  const base = racerProfile.id === "velociraptor" && customization?.creature
    ? structuredClone(customization)
    : createDefaultPlayerCharacterProfile();
  const details = getRacerRosterDetails(racerProfile.id);
  base.profileId = `roster:${racerProfile.id}`;
  base.creature.id = racerProfile.presentation.creatureRecipeId;
  base.creature.seed = `prehistoric-rush:roster:${racerProfile.id}`;
  base.creature.preset.id = `prehistoric-rush-roster-${racerProfile.id}`;
  base.creature.preset.proportions = { ...base.creature.preset.proportions, ...details.proportions };
  if (racerProfile.id !== "velociraptor" || !customization?.creature) {
    base.creature.preset.material = {
      ...base.creature.preset.material,
      skin: details.skin,
      underbelly: details.underbelly
    };
  }
  return base;
}
