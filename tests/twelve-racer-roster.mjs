import assert from "node:assert/strict";
import { DEFAULT_RACER_BEHAVIOR_REGISTRY } from "../src/racers/racer-behavior-registry.js";
import { listRacerProfiles } from "../src/racers/racer-catalog.js";
import { createRacerCharacterProfile, getRacerRosterDetails } from "../src/racers/racer-roster.js";
import { createPrehistoricRushRacerImplementation } from "../src/domains/prehistoric-rush/racer-implementation.js";

const racers = listRacerProfiles({ playableOnly: true });
assert.equal(racers.length, 12, "the live roster contains exactly twelve racers");
assert.equal(new Set(racers.map((racer) => racer.id)).size, 12, "racer ids are unique");
assert.equal(new Set(racers.map((racer) => racer.actor.creatureId)).size, 12, "actor creature ids are unique");

for (const racer of racers) {
  const details = getRacerRosterDetails(racer.id);
  const character = createRacerCharacterProfile(racer);
  assert.equal(racer.availability, "playable");
  assert.ok(DEFAULT_RACER_BEHAVIOR_REGISTRY.getAbility(racer.abilities.active), `${racer.id} active ability is registered`);
  assert.ok(DEFAULT_RACER_BEHAVIOR_REGISTRY.getPassive(racer.abilities.passive), `${racer.id} passive is registered`);
  assert.ok(details.activeName && details.passiveName && details.accent && details.className);
  assert.equal(character.creature.id, racer.presentation.creatureRecipeId);
  assert.equal(character.creature.preset.id, `prehistoric-rush-roster-${racer.id}`);

  const intents = [];
  const controller = createPrehistoricRushRacerImplementation({
    engine: { n: { motion: { submitIntent(intent) { intents.push(structuredClone(intent)); } } } },
    course: { route: { nearest: () => ({ index: 0, progress: 0, distance: 0, width: 3.1 }), classify: () => "path" } },
    world: { sampleElevation: () => 0 },
    profile: racer
  });
  const before = controller.snapshot();
  controller.tick(1 / 60, { ability: true });
  const after = controller.snapshot();
  assert.equal(after.abilityStatus, "active", `${racer.id} signature move activates through shared E intent`);
  assert.ok(after.stamina < before.stamina, `${racer.id} signature move consumes stamina`);
  assert.equal(intents.length, 1, `${racer.id} submits one Nexus motion intent`);

  const sprintController = createPrehistoricRushRacerImplementation({
    engine: { n: { motion: { submitIntent() {} } } },
    course: { route: { nearest: () => ({ index: 0, progress: 0, distance: 0, width: 3.1 }), classify: () => "path" } },
    world: { sampleElevation: () => 0 },
    profile: racer
  });
  sprintController.tick(1 / 60, { boost: true });
  assert.equal(sprintController.readState().paceMode, "sprint", `${racer.id} enters sprint mode`);
  assert.ok(sprintController.readState().stamina < racer.stamina.capacity, `${racer.id} sprint drains stamina`);
  let frame = 0;
  while (sprintController.readState().paceMode === "sprint" && frame < 1200) {
    sprintController.tick(1 / 60, { boost: true });
    frame += 1;
  }
  const depleted = sprintController.snapshot();
  assert.ok(depleted.stamina >= 0, `${racer.id} stamina never becomes negative`);
  assert.equal(depleted.paceMode, "run", `${racer.id} falls back to normal running when depleted`);
  for (let frame = 0; frame < 60; frame += 1) sprintController.tick(1 / 60, { boost: false });
  assert.ok(sprintController.readState().stamina > depleted.stamina, `${racer.id} recovers stamina after sprint`);
}

for (const speedBand of ["low", "normal", "high"]) assert.ok(racers.some((racer) => racer.ratings.speed === speedBand));
console.log("twelve racer roster contract ok");
