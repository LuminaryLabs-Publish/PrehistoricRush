const clone = (value) => value === undefined ? undefined : structuredClone(value);

function proposalOf(proposals, type) {
  return proposals.find((entry) => entry.type === type) ?? null;
}

function observationsOf(observations, type) {
  return observations.filter((entry) => entry.type === type);
}

function unique(values) {
  return Array.from(new Set((values ?? []).map(String)));
}

function physicsContacts(observations) {
  return observationsOf(observations, "physics.frame")
    .flatMap((entry) => entry.value?.contacts ?? []);
}

function fatalPhysicsContact(observations) {
  return physicsContacts(observations).find((contact) => {
    const actorId = String(contact.actorId ?? contact.bodyA ?? "");
    const tags = new Set((contact.tags ?? []).map(String));
    return actorId === "dino" || tags.has("fatal-obstacle") || tags.has("hazard") || tags.has("tree");
  }) ?? null;
}

function fallbackCollision(observations) {
  return observationsOf(observations, "prehistoric-rush.fallback-collision")
    .map((entry) => entry.value)
    .find((value) => value?.hit === true) ?? null;
}

export function createPrehistoricRushResolutionPolicy({
  runStateResource,
  events
} = {}) {
  if (!runStateResource || runStateResource.kind !== "resource") {
    throw new TypeError("PrehistoricRush resolution policy requires runStateResource.");
  }
  if (!events?.RunFailed || !events?.RunWon || !events?.ShardCollected) {
    throw new TypeError("PrehistoricRush resolution policy requires run outcome events.");
  }

  return {
    id: "prehistoric-rush-outcome-policy",
    version: 1,
    resolve({ proposals = [], observations = [] }) {
      const runProposal = proposalOf(proposals, "prehistoric-rush.run-state");
      if (!runProposal?.value?.nextState) {
        return {
          outcome: "continue",
          accepted: {},
          rejected: {},
          statePatch: { resources: [] },
          events: [],
          transition: null
        };
      }

      const nextState = clone(runProposal.value.nextState);
      const pickupProposal = proposalOf(proposals, "prehistoric-rush.pickups");
      const goalProposal = proposalOf(proposals, "prehistoric-rush.goal");
      const requestedPickupIds = unique(pickupProposal?.value?.pickupIds ?? []);
      const physicsContact = fatalPhysicsContact(observations);
      const fallback = fallbackCollision(observations);
      const collision = physicsContact
        ? {
            kind: "tree-impact",
            source: "core-physics",
            actorId: physicsContact.actorId ?? physicsContact.bodyA ?? "dino",
            colliderId: physicsContact.colliderId ?? physicsContact.bodyB ?? null,
            contactId: physicsContact.contactId ?? null,
            x: nextState.x,
            z: nextState.z
          }
        : fallback
          ? {
              kind: fallback.kind ?? "tree-impact",
              source: fallback.source ?? "fallback-collision",
              colliderId: fallback.colliderId ?? null,
              x: nextState.x,
              z: nextState.z
            }
          : null;

      if (collision) {
        nextState.status = "run-over";
        nextState.lastCollision = collision;
        return {
          outcome: "fail",
          accepted: { movement: true, pickupIds: [] },
          rejected: {
            pickupIds: requestedPickupIds,
            goal: goalProposal?.value?.reached === true
          },
          statePatch: {
            resources: [{ resource: runStateResource, value: nextState }]
          },
          events: [{
            event: events.RunFailed,
            payload: { runId: nextState.runId, collision }
          }],
          transition: {
            transitionId: `run:${nextState.runId}:fail`,
            toSceneId: "run-over",
            payload: { collision }
          }
        };
      }

      const collected = new Set((nextState.collectedShardIds ?? []).map(String));
      const acceptedPickupIds = requestedPickupIds.filter((id) => !collected.has(id));
      for (const pickupId of acceptedPickupIds) collected.add(pickupId);
      nextState.collectedShardIds = Array.from(collected);
      nextState.shards = nextState.collectedShardIds.length;

      const acceptedEvents = acceptedPickupIds.map((shardId, index) => ({
        event: events.ShardCollected,
        payload: {
          runId: nextState.runId,
          shardId,
          shards: nextState.shards - acceptedPickupIds.length + index + 1
        }
      }));

      const reachedGoal = goalProposal?.value?.reached === true;
      if (reachedGoal) {
        nextState.status = "win";
        acceptedEvents.push({
          event: events.RunWon,
          payload: {
            runId: nextState.runId,
            distance: nextState.distance,
            shards: nextState.shards
          }
        });
      }

      return {
        outcome: reachedGoal ? "win" : "continue",
        accepted: {
          movement: true,
          pickupIds: acceptedPickupIds,
          goal: reachedGoal
        },
        rejected: {
          pickupIds: requestedPickupIds.filter((id) => !acceptedPickupIds.includes(id))
        },
        statePatch: {
          resources: [{ resource: runStateResource, value: nextState }]
        },
        events: acceptedEvents,
        transition: reachedGoal ? {
          transitionId: `run:${nextState.runId}:win`,
          toSceneId: "win",
          payload: { distance: nextState.distance, shards: nextState.shards }
        } : null
      };
    }
  };
}

export default createPrehistoricRushResolutionPolicy;
