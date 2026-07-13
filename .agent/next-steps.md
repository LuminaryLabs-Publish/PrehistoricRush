# PrehistoricRush Next Steps

**Audit:** `2026-07-12T21-51-38-04-00`  
**Authority:** `prehistoric-rush-run-start-restart-admission-authority-domain`

## Summary

The next implementation should convert UI, Space, Enter, and public start requests into one status-gated command, retire host-local input, fence predecessor async work, and atomically reset or preserve every participant under a new run generation.

## Plan ledger

**Goal:** make Start, Retry, and Run Again deterministic, exactly once, and complete across all run-scoped owners.

### Phase 1: Command admission

- [ ] Add `RunStartCommandId`, sequence, expected runtime session, scene, status, and run generation.
- [ ] Distinguish Start, Retry, and Run Again intent.
- [ ] Reject `KeyboardEvent.repeat` and duplicate commands.
- [ ] Reject active-game Start unless an explicit restart policy permits it.
- [ ] Route button, Space, Enter, and public capabilities through one command path.

### Phase 2: Participant manifest

- [ ] Inventory RunState, InputState, simulation resolution, Core Scene, physics body/colliders, patch controller, Worker deliveries, active content, instance batches, camera follower, renderer, HUD, and public observations.
- [ ] Mark each participant reset, rebuilt, or preserved.
- [ ] Require predecessor and successor revisions for every participant.
- [ ] Close predecessor input and async delivery admission before preparation.

### Phase 3: Atomic run start

- [ ] Prepare fresh RunState and InputState without publishing them.
- [ ] Clear host-local left/right/boost state.
- [ ] Reset simulation resolution and transition state under the command.
- [ ] Fence or retire predecessor Worker/patch results.
- [ ] Reset player physics transform and collider generation.
- [ ] Rebuild or validate active content for the origin generation.
- [ ] Reset camera follower and render observation.
- [ ] Commit one `RunStartResult` and one `RunStarted` event.

### Phase 4: Failure and idempotency

- [ ] Preserve the predecessor if preparation fails.
- [ ] Report partial rollback or indeterminate state truthfully.
- [ ] Return the sealed result for duplicate command delivery.
- [ ] Reject stale callbacks and Worker deliveries after commit.
- [ ] Journal participant preparation and commit receipts.

### Phase 5: First-frame proof

- [ ] Bind HUD, player pose, patches, physics, camera, and renderer to the accepted run generation.
- [ ] Publish `FirstRunGenerationFrameAck`.
- [ ] Expose immutable start/participant/frame observations through `PrehistoricRushHost`.

### Phase 6: Fixtures

- [ ] Hold Enter and verify one run start.
- [ ] Enter during active gameplay.
- [ ] Button, Space, Enter, and public-command parity.
- [ ] Retry after collision and Run Again after win.
- [ ] Held steering/boost state across restart.
- [ ] Pending Worker result from predecessor run.
- [ ] Physics/player reset at origin.
- [ ] Patch/cache reset or explicit preserve policy.
- [ ] Participant preparation failure and rollback.
- [ ] First visible successor frame.
- [ ] Source, built output, and Pages parity.

## Completion gate

Do not mark the authority implemented until repeated or stale start commands cause zero duplicate effects, every participant has a reset/preserve receipt, predecessor async work cannot enter the successor run, and the first visible frame cites the committed run generation.