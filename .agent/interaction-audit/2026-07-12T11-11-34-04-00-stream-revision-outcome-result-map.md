# Interaction Audit: Stream Revision to Outcome Result Map

**Timestamp:** `2026-07-12T11-11-34-04-00`

## Plan ledger

**Goal:** make every gameplay proposal, observation, commit and presentation result carry compatible streamed-content identity.

- [x] Map current commands and results.
- [x] Identify missing revision fields.
- [x] Define typed result surfaces.
- [ ] Implement mixed-revision rejection.

## Current map

| Surface | Current input | Current output | Missing authority |
|---|---|---|---|
| Movement proposal | Tick context, input, route and height sampler | Candidate run state | Active-content revision and patch digest |
| Pickup sample | Candidate player position and `adapter.view.pickups` | Pickup ID list | Pickup-set revision and immutable evidence |
| Physics observation | Motion request and provider's current colliders | Physics frame and contacts | Collider-set revision and content snapshot ID |
| Fallback observation | Candidate state and `adapter.view.colliders` | Optional collision | Collider-set revision and query evidence |
| Outcome policy | Proposals and observations | State patch, events and transition | Mixed-revision admission and content provenance |
| Stream update | New committed state and controller queues | Release/activation/materialization side effects | Predecessor revision, typed delta result and rollback |
| Render | Current state plus current adapter content | Visible Three frame | Simulation/content frame receipt |

## Required result surfaces

```txt
ContentSnapshotResult {
  accepted,
  contentRevision,
  predecessorRevision,
  streamGeneration,
  activePatchSetDigest,
  colliderSetDigest,
  pickupSetDigest,
  participantResults,
  rejectionReason
}

OutcomeResult {
  simulationStepId,
  simulationRevision,
  contentRevision,
  colliderSetDigest,
  pickupSetDigest,
  outcome,
  accepted,
  rejected,
  events,
  transition
}

VisibleContentFrameReceipt {
  frameId,
  simulationRevision,
  contentRevision,
  activePatchSetDigest,
  colliderSetDigest,
  pickupSetDigest,
  presented
}
```

## Admission rule

```txt
proposal content revision
  == physics observation content revision
  == fallback observation content revision
  == pickup observation content revision
  == committed outcome content revision
```

Any mismatch must return a typed `stale-content-revision` or `mixed-content-revision` result. It must not silently continue, fail, collect, win or render.
