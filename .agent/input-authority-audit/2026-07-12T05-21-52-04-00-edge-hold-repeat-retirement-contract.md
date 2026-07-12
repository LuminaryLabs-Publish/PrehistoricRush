# Input Authority Audit: Edge, Hold, Repeat and Retirement Contract

**Timestamp:** `2026-07-12T05-21-52-04-00`

## Summary

The required input authority must distinguish one-shot edges from held state, retire state at every lifecycle boundary and reject browser repeat as a source of new edge commands.

## Plan ledger

**Goal:** define the canonical input state machine and ownership contract before runtime changes.

- [x] Define edge and hold semantics.
- [x] Define repeat and phase admission.
- [x] Define focus, visibility, reset and disposal retirement.
- [x] Define step consumption and readback.
- [ ] Implement and verify.

## Semantic classes

```txt
edge actions
  start
  retry
  jump
  optional explicit restart

held actions
  steer-left
  steer-right
  boost
```

## Edge state machine

```txt
released
  -> physical press observation
  -> admitted edge command
  -> pressed

pressed
  -> browser repeat observation
  -> rejected as repeat-edge

pressed
  -> release observation
  -> released
```

An edge command is consumed at most once. Clearing the product-domain jump pulse does not return the physical key to `released`.

## Hold state machine

```txt
inactive
  -> admitted press
  -> active

active
  -> repeated press
  -> remains active, no new edge

active
  -> release, blur, visibility hidden, run reset or disposal
  -> inactive with retirement result
```

## Ownership

```txt
browser adapters observe only
input authority owns semantic state
core-input-kit owns engine-facing input snapshot
product domain consumes immutable per-step input
host diagnostics expose detached results only
```

The browser-local `{ left, right, boost }` object must not remain a parallel authoritative state owner.

## Start/retry policy

```txt
menu -> start accepted
run-over -> retry accepted
win -> retry accepted
game -> start rejected
explicit restart -> separate named command and policy
```

## Retirement barriers

```txt
window blur
document visibility hidden
pagehide
run reset/runtime generation change
runtime disposal
input source disconnect
```

Each barrier must publish which active holds and pending edges were retired.

## Step consumption

```txt
InputStepSnapshot {
  inputRevision
  activeHolds
  acceptedEdges
}

InputStepConsumptionResult {
  simulationStepId
  runId
  inputRevision
  consumedEdgeCommandIds
  activeHolds
}
```

## Required invariants

```txt
one press produces one edge
repeat never produces a new edge
release is required before another edge from the same source/code
gameplay phase controls start/retry/restart admission
all held state has deterministic retirement
input state is immutable for one simulation step
frame readback cites the consumed input revision
```

No runtime input state machine was implemented in this audit.