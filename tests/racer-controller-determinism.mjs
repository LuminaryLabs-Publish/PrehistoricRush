import assert from "node:assert/strict";
import { createPrehistoricRushRacerImplementation } from "../src/domains/prehistoric-rush/racer-implementation.js";
import { TRICERATOPS_RACER_PROFILE } from "../src/racers/profiles/triceratops.js";
import { VELOCIRAPTOR_RACER_PROFILE } from "../src/racers/profiles/velociraptor.js";

const course = {
  route: {
    nearest(x, z) {
      return { index: Math.max(0, Math.floor(z * 3)), progress: z / 180, distance: Math.abs(x), width: 1.4 };
    },
    classify(distance, width) {
      return distance <= width ? "path" : distance <= width + 0.8 ? "edge" : distance <= width + 1.6 ? "verge" : "forest";
    }
  }
};
const world = { sampleElevation: (x, z) => Math.sin(x * 0.02) + Math.cos(z * 0.015) * 0.25 };

function run(profile, { actorId = profile.actor.motionActorId, useAbility = false } = {}) {
  const intents = [];
  const engine = { n: { motion: { submitIntent(value) { intents.push(structuredClone(value)); } } } };
  const racer = createPrehistoricRushRacerImplementation({ engine, course, world, profile, actorId });
  let maximumSpeed = 0;
  for (let index = 0; index < 40; index += 1) {
    const state = racer.tick(1 / 60, {
      steer: index < 18 ? 0.72 : -0.24,
      boost: index >= 8,
      jump: profile.id === "velociraptor" && index === 6,
      ability: useAbility && index === 2
    });
    maximumSpeed = Math.max(maximumSpeed, state.speed);
  }
  return { state: racer.snapshot(), intents, maximumSpeed };
}

const first = run(VELOCIRAPTOR_RACER_PROFILE);
const second = run(VELOCIRAPTOR_RACER_PROFILE);
assert.deepEqual(first, second, "same profile and intent sequence must produce the same state and motion intents");

const playerDriven = run(VELOCIRAPTOR_RACER_PROFILE, { actorId: "player-controlled" });
const aiDriven = run(VELOCIRAPTOR_RACER_PROFILE, { actorId: "ai-controlled" });
assert.deepEqual(playerDriven.state, aiDriven.state, "input authority must not change racer simulation");
assert.equal(playerDriven.intents.at(-1).actorId, "player-controlled");
assert.equal(aiDriven.intents.at(-1).actorId, "ai-controlled");

const triceratopsBase = run(TRICERATOPS_RACER_PROFILE);
const triceratopsCharge = run(TRICERATOPS_RACER_PROFILE, { useAbility: true });
const repeatedCharge = run(TRICERATOPS_RACER_PROFILE, { useAbility: true });
assert.deepEqual(triceratopsCharge, repeatedCharge, "ability execution must be deterministic");
assert.equal(triceratopsCharge.state.abilityStatus, "active");
assert.ok(triceratopsCharge.state.stamina < TRICERATOPS_RACER_PROFILE.stamina.capacity);
assert.ok(triceratopsCharge.maximumSpeed > triceratopsBase.maximumSpeed, "charge module modifies the shared movement core");
assert.notEqual(triceratopsCharge.state.yaw, first.state.yaw, "profile turn rate changes handling without a subclass");
assert.equal(triceratopsCharge.intents.at(-1).id, "triceratops-motion-40");

console.log("racer controller determinism and extension contract ok");
