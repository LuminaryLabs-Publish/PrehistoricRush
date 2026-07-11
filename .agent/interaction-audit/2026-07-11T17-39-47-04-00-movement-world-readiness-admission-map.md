# Interaction Audit: Movement and World Readiness Admission Map

**Timestamp:** `2026-07-11T17-39-47-04-00`

## Summary

Keyboard input is converted directly into movement before any route-ahead readiness check. The interaction boundary needs one command/result path that binds user intent to the world revision eligible to consume it.

## Plan ledger

**Goal:** prevent input from advancing the actor into uncommitted terrain while preserving responsive steering, boost and jump behavior.

- [x] Trace browser input booleans and engine input projection.
- [x] Trace movement before streaming update.
- [x] Identify missing admission and rejection reasons.
- [x] Define command/result and observation boundaries.
- [ ] Implement after patch and collider transaction authority.

## Current interaction path

```txt
keydown / keyup
  -> host booleans
  -> game.setInput
  -> engine.tick
  -> movement mutates run state
  -> stream focus follows new position
```

## Required path

```txt
MovementIntent {
  commandId
  runtimeSessionId
  runSessionId
  frameId
  steer
  boost
  jump
  observedWorldReadinessRevision
}

  -> input admission
  -> required corridor calculation
  -> world readiness validation
  -> movement policy classification
  -> deterministic simulation application
  -> MovementResult
  -> committed frame acknowledgement
```

## Required result reasons

```txt
accepted-ready
accepted-degraded-policy
authorized-speed-cap
deferred-patch-generation
deferred-consumer-activation
rejected-stale-run
rejected-stale-world-revision
failed-readiness-preparation
```

## Observation rule

The HUD and public host may expose detached readiness and movement results. They must not expose raw controller, renderer or physics owners as the interaction API.
