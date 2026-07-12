# Known Gaps: PrehistoricRush

**Updated:** `2026-07-12T05-21-52-04-00`

## Summary

The current leading host/gameplay gap is browser input command authority. Keyboard, button and RAF ingress do not share one policy, the browser bypasses the installed core input capability, Enter can replace an active run and repeat events can synthesize repeated start or jump edges.

## Plan ledger

**Goal:** close input observation, edge/hold, admission, retirement, step-consumption and frame-correlation gaps while preserving every prior product authority gap.

- [x] Add browser input source, repeat, phase, ownership, retirement and frame gaps.
- [x] Preserve runtime graph, surface, profile, creator, streaming, shard, collision, outcome, frame, host, reset and lifecycle gaps.
- [ ] Implement in dependency order.

## Input ownership gaps

```txt
core-input-kit is installed but not used by browser ingress
browser-local held state is a parallel owner
product-domain InputState is mutated directly
RAF copies host held state into product state
button and keyboard use separate policy branches
raw game API remains reachable through public host owners
```

## Observation and command gaps

```txt
no input sample ID
no source/modality descriptor
no normalized semantic action result
no browser repeat classification
no physical press/release edge state
no input command ID
no command idempotency receipt
no input revision
no expected run/state revision
```

## Admission gaps

```txt
Enter calls start in active gameplay
no explicit restart command or policy
start/retry phase admission is outside a shared authority
button and keyboard parity is not enforced
predecessor-run input is not rejected by command identity
stale runtime generation input is not represented
```

## Edge, hold and retirement gaps

```txt
jump is a mutable pulse rather than an admitted edge result
simulation clearing jump is conflated with physical key release
browser repeat can re-arm jump
held steer/boost state has no typed revision
blur clearing has no retirement result
visibility hidden retirement is absent
run reset retirement result is absent
runtime disposal retirement result is absent
```

## Step and frame gaps

```txt
no immutable input snapshot per simulation step
no consumed edge command list
no simulation step ID in input result
no player/camera/HUD acknowledgement of input revision
no first visible-frame receipt
no public detached input observation
no bounded input journal
```

## Preserved gaps

```txt
runtime module graph admission and source fingerprint
render-surface policy and physical-buffer frame correlation
route/profile artifact handoff
creator draft/commit/preview convergence
patch activation/release acknowledgement
shard identity, collection and visible removal authority
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
active-run Enter rejection
held Enter single start
held Space single jump edge
release/press second jump edge
button/keyboard semantic parity
wrong phase/run/revision rejection
repeat-edge rejection
held-state revision
focus/visibility/reset/disposal retirement
immutable per-step input snapshot
input command/state/frame parity
public host bypass rejection
browser and Pages input smoke
all previously documented runtime/gameplay fixtures
```

## Priority

```txt
0 runtime module graph admission
0a browser input command authority
0b render-surface authority
1 route/profile
2 creator
3 patch activation/release
3a shard collection authority
4 collider admission
5 run-step outcome
6 cadence/readiness
7 committed frame/read model
7a public host gateway
8 coordinated reset
9 lifecycle/disposal
```

Do not treat movement, a jump animation or a changed `runId` as proof of a valid input command. Require typed admission and consumption results.