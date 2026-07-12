# Gameplay Audit: Release, Activation and Rebuild Loop

**Timestamp:** `2026-07-12T07-09-49-04-00`

## Summary

Streaming work occurs inside the gameplay frame before collision and rendering. When movement changes patch membership, release and activation can each rebuild the complete active collision and pickup view. Gameplay then consumes only the final arrays, but the host pays for and commits intermediate materialization that has no gameplay result identity.

## Plan ledger

**Goal:** make gameplay collision, shard detection and height sampling consume one committed active-content revision per step.

- [x] Trace simulation to streaming to collision ordering.
- [x] Identify full collider and pickup replacement points.
- [x] Identify missing gameplay-content revision evidence.
- [ ] Implement one-step materialization admission and parity fixtures.

## Current gameplay loop

```txt
engine tick advances player
  -> controller updates focus
  -> released patches remove content
  -> complete collider/pickup view rebuilt
  -> ready patch activates
  -> complete collider/pickup view rebuilt again
  -> actor transform and physics step
  -> fallback collision scans final collider array
  -> pickup scan uses final pickup array
  -> state may fail or collect shard
  -> render
```

## Gameplay gaps

```txt
simulation step ID is not bound to content revision
height sampler can observe host activePatches directly
physics fixed-collider revision is not reported
fallback collider array has no digest
pickup set has no revision
release/activation intermediate commits have no result
collision and collection events do not cite content revision
```

## Required gameplay contract

```txt
SimulationStep
  -> determine focus and controller delta
  -> prepare one materialization transaction
  -> commit or preserve predecessor content revision
  -> sample height from committed terrain revision
  -> step physics against committed collider revision
  -> scan pickups from committed shard revision
  -> arbitrate collision, pickup and goal
  -> render and acknowledge the same revision
```

## Required fixtures

```txt
cross one patch boundary without collision divergence
cross a boundary while collecting a shard
release and activate during a jump
release and activate near a tree collider
materialization failure preserves previous gameplay view
Rapier and fallback collider digest parity
step/content/outcome/frame correlation
```

Documentation only. No gameplay behavior changed.