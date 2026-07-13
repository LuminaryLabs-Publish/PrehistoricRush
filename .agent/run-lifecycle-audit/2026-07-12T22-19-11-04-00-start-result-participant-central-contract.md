# Run Lifecycle Audit: Start Result and Participant Central Contract

**Timestamp:** `2026-07-12T22-19-11-04-00`

## Summary

The current `start()` operation resets three engine-owned surfaces but has no manifest for the other run-scoped participants. A successor run is therefore an inferred condition rather than an accepted cross-owner transaction. This audit records the required participant contract and central reconciliation state.

## Plan ledger

**Goal:** require every participant to reset, rebuild, or explicitly preserve itself under one successor run generation before the run becomes visible.

- [x] Inventory run-scoped participants.
- [x] Classify current reset and retained behavior.
- [x] Define preparation, commit, rollback, and idempotency contracts.
- [x] Define required receipts.
- [ ] Implement later.

## Participant matrix

| Participant | Current behavior | Required result |
|---|---|---|
| RunState | replaced | preparation and commit receipt |
| engine InputState | replaced | input retirement and successor receipt |
| host-local input | retained | clear or explicit preserve policy |
| Core Simulation resolution | reset | reset receipt with predecessor/successor revision |
| Core Scene | direct transition requested | prepared transition and commit receipt |
| Rapier provider/body/colliders | retained | reset/rebuild/preserve receipt |
| patch controller/cache/queue | retained and immediately updated | successor generation and reset/preserve receipt |
| pending Worker work | retained | predecessor fence and successor generation receipt |
| active patch/content maps | retained and refreshed | content generation receipt |
| instance batches | retained | reset/preserve receipt |
| camera follower | reset after state commit | prepared camera reset receipt |
| Three renderer/resources | retained | render generation receipt |
| HUD/public readback | independently projected | observation receipt bound to start result |

## Required phases

```txt
Admit
  validate command, session, scene, status, repeat, duplicate, and expected run

Freeze
  close predecessor input and async delivery admission
  capture participant predecessor revisions

Prepare
  build detached reset/rebuild/preserve plans
  obtain participant receipts

Commit
  recheck predecessor
  install one successor generation atomically
  emit one event and transition

Rollback
  restore predecessor or report partial/indeterminate state truthfully

Observe
  publish immutable result, journal, participant manifest, and first visible frame ack
```

## Idempotency

```txt
same command ID returns the same sealed RunStartResult
no participant resets twice for duplicate delivery
no predecessor Worker or callback enters after admission closure
one successor generation has one accepted participant manifest
```

## Validation boundary

Lifecycle documentation only. No participant reset, Worker fencing, rollback, or runtime lifecycle implementation changed.