# Interaction Audit: Viewport Change Admission Map

**Timestamp:** `2026-07-13T00-49-53-04-00`

## Summary

Browser resize delivery is currently treated as an imperative side effect rather than a command with identity, predecessor revision and a typed result.

## Plan ledger

**Goal:** admit viewport changes exactly once and reject stale, duplicate or invalid measurements before camera or renderer mutation.

- [x] Identify current resize ingress.
- [x] Identify mutable targets.
- [x] Define command identity and predecessor checks.
- [x] Define rejection classes and zero-effect behavior.
- [ ] Implement after API review.

## Current interaction

```txt
window "resize"
  -> read innerWidth / innerHeight
  -> mutate camera.aspect
  -> update projection matrix
  -> mutate renderer size
```

## Required interaction

```txt
ViewportObservation
  -> normalize to ViewportChangeCommand
  -> validate surface/session identity
  -> validate predecessor viewport revision
  -> measure actual host box
  -> sample DPR and quality policy
  -> reject non-finite, zero, stale, duplicate or over-budget candidate
  -> prepare camera and buffer changes
  -> commit one result
  -> apply once during render admission
  -> acknowledge first visible frame
```

## Rejection classes

```txt
missing-surface
stale-session
stale-predecessor
non-finite-size
zero-size-deferred
invalid-dpr
over-pixel-budget
duplicate-fingerprint
camera-candidate-failed
renderer-candidate-failed
application-failed
```

## Required zero-effect rule

Rejected candidates cannot partially update camera projection, canvas CSS size, drawing-buffer size, DPR, quality revision or public readback.