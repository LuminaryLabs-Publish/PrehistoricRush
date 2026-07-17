# PrehistoricRush Next Steps

**Audit:** `2026-07-17T10-59-32-04-00`  
**Authority:** `prehistoric-rush-pause-overlay-input-context-simulation-arbitration-authority-domain`

## Intent

Make Pause semantically truthful with the smallest targeted coordination layer.

## Checklist

### Phase 1: Admit policy

- [ ] Choose true pause for the current Pause label, or rename it to an explicitly non-pausing menu.
- [ ] Add `PauseGeneration`, `InputContextRevision` and idempotency keys.
- [ ] Publish `PausePolicyAdmissionResult`.

### Phase 2: Open settlement

- [ ] Clear held steer, boost and jump.
- [ ] Route keyboard and pointer to the menu context.
- [ ] Capture focus and record the predecessor focus target.
- [ ] Suspend admitted gameplay, physics and streaming participants.
- [ ] Publish `PauseOpenResult` and `FirstPausedFrameAck`.

### Phase 3: Close settlement

- [ ] Restore focus.
- [ ] Rebase the frame clock so no catch-up step occurs.
- [ ] Resume participants exactly once.
- [ ] Publish `PauseCloseResult` and `FirstResumedGameplayFrameAck`.
- [ ] Reject stale or duplicate close commands.

### Phase 4: Fixtures

- [ ] Extend the pause source fixture to validate the accepted policy rather than unconditional ticking.
- [ ] Add a browser held-input/open/close fixture.
- [ ] Verify stable player, route, physics and streaming revisions while paused.
- [ ] Verify rapid open/close idempotency and focus restoration.
- [ ] Run `npm test`, built-output smoke and Pages smoke.

### Retained work

- [ ] Implement parent render-host generation retirement.
- [ ] Prove route replacement, remount and WebGL recovery.

## Recommended file cut

```txt
src/domains/prehistoric-rush/pause-menu-domain-kit.js
src/game.js
src/game-runtime-lod.js
tests/pause-menu-authority.mjs
tests/browser/pause-input-simulation.html
```

## Compatibility constraints

Preserve gameplay tuning, route generation, physics, patch streaming, Vegetation, rendering, camera, score, outcomes and current menu commands.
