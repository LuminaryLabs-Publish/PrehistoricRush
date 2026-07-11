# Interaction Audit: RAF, Visibility and Cadence Result Map

**Timestamp:** `2026-07-11T19-09-25-04-00`

## Summary

The browser host converts RAF callbacks directly into gameplay, streaming, physics and render work. It does not admit visibility changes or return a typed cadence result before accepting input and simulation.

## Plan ledger

**Goal:** define the browser ingress and result path for active, throttled, hidden and resumed runtime states.

- [x] Trace key, blur, resize and RAF ingress.
- [x] Confirm no `visibilitychange` admission path exists.
- [x] Map current mutable side effects.
- [x] Define command and result envelopes.
- [ ] Implement browser parity fixtures.

## Current ingress map

```txt
keydown/keyup
  -> mutate host input booleans

blur
  -> clear host booleans and game input

RAF callback
  -> sample/clamp dt
  -> project host input
  -> mutate game state
  -> mutate stream controller
  -> mutate physics
  -> mutate render consumers
  -> render and update HUD

visibilitychange
  -> no product handler
```

## Missing command envelope

```txt
CadenceFrameCommand {
  runtimeSessionId
  runSessionId
  frameSequence
  wallNow
  wallDelta
  visibilityState
  visibilityRevision
  inputSnapshotId
}
```

## Missing result envelope

```txt
CadenceFrameResult {
  accepted
  reason
  cadenceRevision
  simulationStepResult
  generationAdmissionResult
  activationAdmissionResult
  backlogObservation
  worldReadinessRevision
  frameCommitId
}
```

## Required admission rules

```txt
reject stale runtime or run session
reject non-monotonic frame sequence
classify hidden and throttled state before input projection
cap simulation catch-up
cap stream credits
prioritize required active patches
reject stale Worker and ready results after resume revision
hold input until first coherent visible frame commits
```

## Observation requirements

```txt
current visibility state and revision
wall versus admitted simulation delta
stream budget available and spent
queued/inflight/ready counts
oldest backlog age
required-route starvation count
latest committed cadence/frame pair
last rejection reason
```

## Fixture gate

```txt
normal visible RAF
30/60/120 Hz RAF sequences
250 ms and 1000 ms long frames
hidden interval with Worker completions
resume with stale ready entries
blur and visibility transition ordering
first input after visible-frame acknowledgement
```