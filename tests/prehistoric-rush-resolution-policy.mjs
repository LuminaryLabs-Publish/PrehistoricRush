import assert from "node:assert/strict";
import { createPrehistoricRushResolutionPolicy } from "../src/domains/prehistoric-rush/prehistoric-rush-resolution-policy.js";

const RunState = Object.freeze({ kind: "resource", name: "prehistoric-rush.run-state" });
const events = {
  RunFailed: Object.freeze({ kind: "event", name: "prehistoric-rush.run-failed" }),
  RunWon: Object.freeze({ kind: "event", name: "prehistoric-rush.run-won" }),
  ShardCollected: Object.freeze({ kind: "event", name: "prehistoric-rush.shard-collected" })
};
const policy = createPrehistoricRushResolutionPolicy({ runStateResource: RunState, events });

function state(overrides = {}) {
  return {
    runId: 4,
    status: "game",
    x: 10,
    y: 2,
    z: 20,
    distance: 100,
    shards: 0,
    collectedShardIds: [],
    lastCollision: null,
    ...overrides
  };
}

function resolve({ next = state(), pickups = [], goal = false, contacts = [], fallback = null } = {}) {
  const proposals = [
    { id: "run", type: "prehistoric-rush.run-state", value: { nextState: next } },
    { id: "pickups", type: "prehistoric-rush.pickups", value: { pickupIds: pickups } },
    { id: "goal", type: "prehistoric-rush.goal", value: { reached: goal } }
  ];
  const observations = [
    ...(contacts.length ? [{ id: "physics", type: "physics.frame", value: { contacts } }] : []),
    ...(fallback ? [{ id: "fallback", type: "prehistoric-rush.fallback-collision", value: fallback }] : [])
  ];
  return policy.resolve({ proposals, observations });
}

const continueResult = resolve();
assert.equal(continueResult.outcome, "continue");
assert.equal(continueResult.statePatch.resources[0].value.status, "game");

const goalResult = resolve({ goal: true });
assert.equal(goalResult.outcome, "win");
assert.equal(goalResult.statePatch.resources[0].value.status, "win");
assert.equal(goalResult.transition.toSceneId, "win");

const collision = { actorId: "dino", colliderId: "tree-1", tags: ["tree"] };
const failResult = resolve({ contacts: [collision] });
assert.equal(failResult.outcome, "fail");
assert.equal(failResult.statePatch.resources[0].value.status, "run-over");
assert.equal(failResult.transition.toSceneId, "run-over");

const collisionGoal = resolve({ goal: true, contacts: [collision] });
assert.equal(collisionGoal.outcome, "fail", "fatal collision beats goal");
assert.equal(collisionGoal.rejected.goal, true);

const collisionPickup = resolve({ pickups: ["shard-a"], contacts: [collision] });
assert.equal(collisionPickup.outcome, "fail");
assert.deepEqual(collisionPickup.accepted.pickupIds, []);
assert.deepEqual(collisionPickup.rejected.pickupIds, ["shard-a"]);
assert.equal(collisionPickup.statePatch.resources[0].value.shards, 0);

const pickupGoal = resolve({ pickups: ["shard-a"], goal: true });
assert.equal(pickupGoal.outcome, "win");
assert.deepEqual(pickupGoal.accepted.pickupIds, ["shard-a"]);
assert.equal(pickupGoal.statePatch.resources[0].value.shards, 1);
assert.deepEqual(pickupGoal.statePatch.resources[0].value.collectedShardIds, ["shard-a"]);
assert.deepEqual(pickupGoal.events.map((entry) => entry.event.name), [
  "prehistoric-rush.shard-collected",
  "prehistoric-rush.run-won"
]);

const duplicatePickup = resolve({
  next: state({ shards: 1, collectedShardIds: ["shard-a"] }),
  pickups: ["shard-a", "shard-a"]
});
assert.deepEqual(duplicatePickup.accepted.pickupIds, []);
assert.equal(duplicatePickup.statePatch.resources[0].value.shards, 1);
assert.equal(duplicatePickup.events.length, 0);

const fallbackFail = resolve({
  fallback: { hit: true, kind: "tree-impact", colliderId: "tree-fallback" }
});
assert.equal(fallbackFail.outcome, "fail");
assert.equal(fallbackFail.statePatch.resources[0].value.lastCollision.source, "fallback-collision");

assert.doesNotThrow(() => structuredClone(pickupGoal), "policy output is serializable");
console.log("prehistoric rush resolution policy tests ok");
