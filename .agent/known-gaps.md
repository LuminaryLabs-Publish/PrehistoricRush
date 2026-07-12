# Known Gaps: PrehistoricRush

**Updated:** `2026-07-12T02-21-55-04-00`

## Summary

The current leading presentation gap is render-surface authority. Creator and gameplay use separate size-observation rules, both sample DPR only at startup, and neither publishes an accepted physical-size result or first-frame acknowledgement.

## Plan ledger

**Goal:** close surface policy and frame-correlation gaps through existing renderer, camera, diagnostics and lifecycle owners while preserving every prior product authority gap.

- [x] Add CSS-size, DPR, physical-buffer, revision and frame gaps.
- [x] Preserve runtime graph, route, creator, streaming, collision, outcome, frame, host, reset and lifecycle gaps.
- [ ] Implement in dependency order.

## Render-surface gaps

```txt
no shared creator/game surface policy
no stable surface ID
no monotonic surface revision
no coherent CSS-size and DPR observation
no named quality tier
no maximum physical-pixel budget
gameplay does not observe actual host bounds
gameplay does not resample DPR after startup
creator does not resample DPR after startup
no stale or duplicate resize rejection
no renderer/camera atomic commit result
no actual drawing-buffer receipt
no creator/game parity result
no first post-resize frame acknowledgement
no detached public surface observation
```

## Frame and diagnostics gaps

```txt
committed gameplay frames do not cite a surface revision
HUD state does not cite physical render dimensions
PrehistoricRushHost exposes mutable renderer ownership
host readback contains no surface policy, revision or actual size
no proof the latest simulation state was visibly presented through the latest surface commit
```

## Lifecycle gaps

```txt
gameplay global resize listener is not leased through a runtime session owner
late resize observations are not generation-fenced
surface observers/listeners have no retirement receipt
surface state has no reset or clean-restart baseline
```

## Preserved gaps

```txt
runtime module graph admission and source fingerprint
route/profile artifact handoff
creator draft/commit/preview convergence
patch activation/release acknowledgement
exact collider retirement and contact provenance
run-step collision/goal/pickup arbitration
stream cadence and hidden-tab policy
world readiness before movement
committed gameplay frame and read model
public host owner quarantine and command gateway
coordinated run/stream/Worker/collider/frame epochs
startup rollback and ordered disposal
```

## Missing proof matrix

```txt
surface policy fixtures
creator container resize fixture
gameplay host resize fixture
DPR change fixture
pixel-budget fixture
zero-area policy fixture
stale/duplicate observation fixtures
actual renderer/camera readback fixture
creator/game parity fixture
surface/frame acknowledgement fixture
late observation after disposal fixture
browser and Pages surface smoke
all previously documented runtime/gameplay fixtures
```

## Priority

```txt
0 runtime module graph admission
0a render-surface authority
1 route/profile
2 creator
3 patch activation/release
4 collider admission
5 run-step outcome
6 cadence/readiness
7 committed frame/read model
7a public host gateway
8 coordinated reset
9 lifecycle/disposal
```

Do not treat requested CSS dimensions or a successful `renderer.setSize()` call as proof of physical resolution or visible-frame commitment.