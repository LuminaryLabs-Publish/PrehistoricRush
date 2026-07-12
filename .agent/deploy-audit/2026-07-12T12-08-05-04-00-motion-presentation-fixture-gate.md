# Deploy Audit: Motion Presentation Fixture Gate

**Timestamp:** `2026-07-12T12-08-05-04-00`

## Summary

Current tests prove outcome-policy behavior and player-articulation adapter conversion, but they do not execute the full browser path from input through Core Motion, Core Physics, articulated solving, Three.js bone application and visible-frame readback.

## Plan ledger

**Goal:** block motion/articulation readiness claims until browser and deployed Pages proof show that the visible raptor consumed the admitted motion and pose result.

- [x] Inventory current proof surfaces.
- [x] Identify missing headless and browser fixtures.
- [x] Define required pass/fail evidence.
- [ ] Implement fixtures.
- [ ] Run local browser matrix.
- [ ] Run deployed Pages smoke.

## Existing proof

```txt
prehistoric-rush-resolution-policy test
  -> continue/win/collision precedence
  -> pickup idempotency
  -> serializable policy results

player-articulation adapter test
  -> rig conversion
  -> pose conversion
  -> structured cloning
```

These tests do not prove production call-site consumption.

## Required fixture matrix

```txt
fixture:motion-frame-created
  one tick produces one ordered Core Motion frame

fixture:physics-request-linked
  Core Physics request cites the authorizing motion frame

fixture:articulated-solve-consumed
  production game loop calls solve and renderer consumes result

fixture:legacy-fallback-explicit
  fallback is a typed result and readback reports it

fixture:stale-run-rejected
  prior-run solve cannot mutate current mesh

fixture:stale-profile-rig-rejected
  prior profile or rig generation cannot apply

fixture:creator-game-profile-parity
  both surfaces publish comparable pose-policy descriptors

fixture:renderer-pose-receipt
  applied bone count and pose revision are observable

fixture:first-visible-pose-frame
  visible frame cites run, motion, physics, pose and render revisions

fixture:public-readback-truth
  installed articulation is distinct from consumed articulation
```

## Browser matrix

```txt
menu -> creator -> game
creator profile edits and mesh replacement
run start and restart
grounded running
turning
jump/airborne
surface resistance
articulated solve accepted
articulated solve rejected with fallback
WebGL mesh recreation
visibility pause/resume
```

## Required evidence

```txt
command output and exit code
runtime source revision
pinned Nexus Engine/Kits/ProtoKits revisions
fixture result IDs
motion, physics, pose and render revisions
browser screenshot or frame hash
public readback snapshot
Pages URL and deployed commit
```

## Failure conditions

```txt
visible mesh moves while pose source is unknown
articulated capability is reported as consumed without solve receipt
physics request lacks motion-frame reference
renderer applies stale pose generation
creator and game policy descriptors diverge silently
first visible frame lacks pose provenance
local and Pages results differ
```

## Validation boundary

No command was executed in this documentation pass. Deployment and runtime behavior were not changed.