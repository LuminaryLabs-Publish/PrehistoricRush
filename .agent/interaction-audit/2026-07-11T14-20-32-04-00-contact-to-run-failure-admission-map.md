# Interaction Audit: Contact to Run-Failure Admission Map

**Timestamp:** `2026-07-11T14-20-32-04-00`

## Summary

Collision is an interaction command even though it originates from physics. The current host forwards raw contact presence directly into run failure without a typed admission boundary.

## Plan ledger

**Goal:** replace Boolean hit inference with a typed collision observation and admission result.

- [x] Map Rapier contact ingress.
- [x] Map fallback ingress.
- [x] Map failure mutation.
- [x] Define admission checks.
- [ ] Implement one collision command path.

## Current ingress

```txt
Rapier:
  physics.step(dt).contacts
  -> contacts.some(actorId === "dino")

fallback:
  current collider descriptors
  -> XZ overlap and jumpHeight threshold

host:
  rapierHit || fallbackHit
  -> game.fail(tree-impact)
```

## Admission checks required

```txt
runtime session is running
run session is active
contact actor matches active player
collider exists in committed membership
collider patch is active
collider tags include hazard/tree
contact revision equals current collider revision
contact phase is enter or accepted policy phase
run has no terminal result
source parity policy passes
```

## Typed result

```json
{
  "collisionObservationId": "collision:run-7:step-442:tree-2-3-0",
  "accepted": true,
  "reason": "current-hazard-contact-enter",
  "runSessionId": "run-7",
  "colliderMembershipRevision": 42,
  "actorId": "dino",
  "colliderId": "tree-2-3-0",
  "patchId": "2:3",
  "source": "rapier",
  "runFailureResultId": "failure:run-7:1"
}
```

## Rejection examples

```txt
stale collider revision
retired patch
unknown collider
non-hazard collider
prior run epoch
duplicate contact-stay
run already terminal
source parity failure
```
