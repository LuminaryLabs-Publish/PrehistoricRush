# Articulation Audit: Rig, Solve, and Render Admission Contract

**Timestamp:** `2026-07-12T22-18-39-04-00`

## Summary

The repository converts the procedural creature skeleton into an articulated rig and exposes an articulated solve API, but active gameplay never turns that capability into an admitted render pose. Rig registration, solve input, solve result, fallback, and skeleton application are not one transaction.

## Plan ledger

**Goal:** require a complete articulated pose result or an explicit fallback before any player skeleton mutation.

- [x] Verify procedural skeleton to rig adaptation.
- [x] Verify hind-leg chain registration.
- [x] Verify legacy pose to quaternion conversion.
- [x] Verify active renderer bypasses the solve API.
- [x] Define admission and failure contracts.
- [ ] Implement later.

## Existing capability

```txt
procedural creature body
  -> skeleton descriptor
  -> createPlayerArticulatedRig
  -> register articulated rig

legacy procedural pose
  -> createPlayerArticulatedPose
  -> normalize Euler rotations to quaternions
  -> articulatedMotion.solve
```

The rig adapter conditionally registers two-bone hind-leg chains for left and right legs when all named bones exist.

## Missing authority

```txt
rig revision: absent
pose command identity: absent
target-set identity: absent
solver-result admission: absent
required-bone coverage: absent
finite-transform validation: absent
fallback classification: absent
application receipt: absent
visible-frame acknowledgement: absent
```

## Required contract

```txt
PreparePlayerPose
  -> resolve body/profile/rig/skeleton identities
  -> bind run/tick/motion/physics inputs
  -> adapt base pose
  -> construct target set
  -> solve articulation
  -> validate result and bone coverage
  -> commit articulated pose or typed fallback
  -> apply committed pose
  -> publish frame acknowledgement
```

## Failure policy

- Missing optional chain may produce a declared partial-coverage result.
- Missing required root or required locomotion bones rejects the candidate.
- Non-finite transforms reject before skeleton mutation.
- Solver failure may use legacy fallback only when policy explicitly permits it.
- Stale run, tick, rig, or profile revisions reject with zero effects.
- Application mismatch publishes failure and cannot be reported as a visible articulated frame.

## Required fixtures

```txt
full hind-leg chain solve
missing optional chain
missing required bone
non-finite solver output
solver failure with allowed fallback
solver failure with forbidden fallback
stale run/tick pose
body/rig/skeleton mismatch
first visible pose frame
```

## Validation boundary

No articulation, dynamics, procedural creature, or Three.js code changed.