# Run Session Audit: Run / World Cache Reset Contract

**Timestamp:** `2026-07-11T02-48-17-04-00`

## Goal

Define exact retention and reset behavior for retry without discarding deterministic world work or leaking prior-run state.

## Contract table

| Owner | Retry policy | Required proof |
|---|---|---|
| Route samples | retain | route fingerprint |
| Creature body descriptor | retain | content hash |
| Validated patch payload cache | retain when world identity matches | cache fingerprint |
| Controller desired/active sets | recompute and acknowledge | stream epoch + parity result |
| Terrain/tree static bindings | retain or re-commit by policy | consumer fingerprint |
| Grass matrices | rebuild or prove immutable | admitted counts + revision |
| Pickup visibility | rebuild from new run state | pickup fingerprint |
| Gameplay colliders | rebuild | collider revision |
| Rapier fixed colliders | replace/acknowledge | physics revision |
| Rapier actor/contacts | reset | actor reset result |
| Browser input latches | clear | input reset result |
| Camera interpolation | reset | camera reset result |
| Worker pending results | epoch-fence or cancel | stale-result rows |
| RAF/listeners/resources | retain only within same live host session | lifecycle snapshot |
| Host journals | start new bounded run segment | run session ID |

## Atomic start transaction

```txt
1. admit start command
2. allocate runSessionId and next streamEpoch
3. prepare new RunState/InputState
4. classify cache and binding retention
5. reset/rebuild dynamic consumers
6. fence pending asynchronous results
7. reset physics, input, camera and frame-local state
8. commit run and scene transition
9. publish first committed frame
10. close prior run journal
```

## Rollback rule

If any required consumer fails preparation, the prior terminal state remains authoritative. No new run is published, and any prepared resources are released in reverse order.

## Stale-result rule

A generated patch can be reused as immutable cache data if its world identity matches, but a delivery carrying an old stream epoch cannot directly mutate current active consumers. It must be re-admitted through the current controller/session transaction.

## Terminal lifecycle

`stop()` and `dispose()` must cancel RAF, remove listeners, dispose/terminate Worker execution, release Three/Rapier resources and reject post-dispose commands. Repeated calls must return stable idempotent results.
