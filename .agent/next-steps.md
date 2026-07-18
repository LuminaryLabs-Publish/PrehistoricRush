# PrehistoricRush Next Steps

**Audit:** `2026-07-18T02-39-16-04-00`  
**Authority:** `prehistoric-rush-required-startup-asset-failure-recovery-authority-domain`

## Intent

Turn observable startup exceptions into one bounded, generation-owned recovery capability without changing gameplay or asset fidelity.

## Checklist

### Phase 1: Unified startup generation

- [ ] Create one startup generation before module preflight.
- [ ] Bind module URLs, Nexus revision, bundle version, provider revision and foliage atlas revision.
- [ ] Publish `StartupGenerationResult`.

### Phase 2: Required preparation settlement

- [ ] Normalize module preflight, bundle request and image hydration into `RequiredStartupPreparationResult`.
- [ ] Classify failure stage, code, retryability and partial ownership.
- [ ] Separate concise public text from detailed diagnostics.

### Phase 3: Cleanup and retry

- [ ] Retire the temporary provider on every terminal path.
- [ ] Retire partial runtime and decoded images when ownership is not transferred.
- [ ] Add bounded retry attempts and backoff.
- [ ] Reject stale progress and completion from earlier generations.
- [ ] Prevent duplicate game-host construction.

### Phase 4: User recovery

- [ ] Project accessible Retry and Return to Menu actions.
- [ ] Disable duplicate actions while retry is active.
- [ ] Publish `StartupRecoveryResult` and `StartupNavigationResult`.
- [ ] Publish `FirstRecoveredGameFrameAck` after successful recovery.

### Phase 5: Executable proof

- [ ] Run `npm test`.
- [ ] Add module, bundle, fetch, decode, dimension, canvas and readback failure fixtures.
- [ ] Add retry success, retry exhaustion and stale-generation fixtures.
- [ ] Add built-artifact and GitHub Pages failure/recovery fixtures.

### Retained work

- [ ] Complete foliage family/atlas convergence proof.
- [ ] Complete pinned-provider admission proof.
- [ ] Resolve pause/menu input and simulation semantics.
- [ ] Implement parent render-host generation retirement.

## Recommended file cut

```txt
src/pages/game.js
src/game.js
src/shared/tree-fidelity-runtime-images.js
src/shared/prehistoric-tree-fidelity-runtime.js
tests/startup-failure-recovery.mjs
tests/browser/startup-failure-recovery.html
```

## Compatibility constraints

Preserve required tree fidelity, existing progress behavior, runtime versions, deterministic generation, tree/ground-cover density, route readability, collision, pickups, score, pause and outcome tuning.