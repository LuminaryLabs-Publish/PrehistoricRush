# PrehistoricRush Next Steps

**Audit:** `2026-07-12T22-19-11-04-00`  
**Authority:** `prehistoric-rush-run-start-restart-admission-authority-domain`  
**Status:** `run-start-restart-central-reconciled`

## Summary

The next implementation should convert boot, UI, Space, Enter, and public start requests into one status-gated command, retire predecessor input and asynchronous delivery, and atomically reset, rebuild, or preserve every participant under a new run generation.

## Plan ledger

**Goal:** make Start, Retry, and Run Again deterministic, exactly once, and complete across all run-scoped owners.

### Phase 1: Command admission

- [ ] Add `RunStartCommandId`, sequence, expected runtime session, scene, status, and run generation.
- [ ] Distinguish Start, Retry, Run Again, and explicit active-run restart intent.
- [ ] Reject `KeyboardEvent.repeat`, duplicate, stale, and wrong-session commands.
- [ ] Reject active-game Start unless an explicit restart policy permits it.
- [ ] Route boot, button, Space, Enter, and public capabilities through one command path.
- [ ] Return the same sealed result for duplicate delivery.

### Phase 2: Participant manifest

- [ ] Inventory RunState, engine InputState, host-local input, simulation resolution, Core Scene, physics body/colliders, patch controller, Worker deliveries, active content, instance batches, camera follower, renderer, HUD, and public observations.
- [ ] Mark each participant reset, rebuilt, or explicitly preserved.
- [ ] Require predecessor and successor revisions for every participant.
- [ ] Close predecessor input and async delivery admission before preparation.

### Phase 3: Atomic run start

- [ ] Prepare fresh RunState and engine InputState without publishing them.
- [ ] Clear host-local left/right/boost state.
- [ ] Reset simulation resolution and transition state under the command.
- [ ] Fence or retire predecessor Worker and patch results.
- [ ] Reset player physics transform and collider generation.
- [ ] Rebuild or validate active content for the origin generation.
- [ ] Reset camera follower and render/HUD observations.
- [ ] Commit one `RunStartResult`, one `RunStarted` event, and one scene transition.

### Phase 4: Failure and idempotency

- [ ] Preserve the predecessor if preparation fails.
- [ ] Report partial rollback or indeterminate state truthfully.
- [ ] Reject stale callbacks and Worker deliveries after commit.
- [ ] Journal participant preparation, commit, rollback, and observation receipts.

### Phase 5: First-frame proof

- [ ] Bind HUD, player pose, patches, physics, camera, and renderer to the accepted run generation.
- [ ] Publish `FirstRunGenerationFrameAck`.
- [ ] Expose immutable command, participant, journal, and frame observations through a bounded public capability.

### Phase 6: Fixtures

- [ ] Hold Enter and verify one run start.
- [ ] Enter during active gameplay.
- [ ] Boot, button, Space, Enter, and public-command parity.
- [ ] Retry after collision and Run Again after win.
- [ ] Held steering/boost state across restart.
- [ ] Pending Worker result from predecessor run.
- [ ] Physics/player reset at origin.
- [ ] Patch/cache reset or explicit preserve policy.
- [ ] Participant preparation failure and rollback.
- [ ] First visible successor frame.
- [ ] Source, built output, and Pages parity.

## Completion gate

Do not mark the authority implemented until repeated, duplicate, stale, and disallowed commands cause zero effects; every participant has a reset/rebuild/preserve receipt; predecessor async work cannot enter the successor run; rollback is truthful; and the first visible frame cites the committed start result and participant generations.