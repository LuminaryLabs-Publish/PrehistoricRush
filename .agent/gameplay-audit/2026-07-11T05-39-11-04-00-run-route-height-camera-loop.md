# Gameplay Audit: Run / Route / Height / Camera Loop

**Timestamp:** `2026-07-11T05-39-11-04-00`

## Summary

The camera target is downstream of three gameplay authorities: run state, route sampling and patch-backed height sampling. The smoothing controller reduces visible discontinuities but does not identify which source revision caused a target change.

## Plan ledger

**Goal:** Make camera behavior explainable from gameplay state without moving gameplay policy into the shared camera kit.

- [x] Trace player/run inputs.
- [x] Trace route-ahead selection.
- [x] Trace height sampling.
- [x] Trace restart/run-change behavior.
- [x] Identify source-revision gaps.
- [ ] Add target provenance and stale-source rejection.

## Current gameplay-to-camera loop

```txt
engine.tick(dt)
  -> update player x/y/z/yaw
  -> update nearest route index
  -> update patch streaming and active height sources
  -> choose route sample routeIndex + 12
  -> derive chase position from player yaw
  -> sample terrain height for look point
  -> smooth and render
```

## Source authorities

```txt
runId, x, y, z, yaw, routeIndex
  prehistoric-rush-domain-kit

route sample positions
  drunk-route-generator

look target ground height
  Three host patch-height sampler over activePatches
```

## Gameplay gaps

```txt
- target does not identify the RunState revision
- route samples have no revision in the target row
- active patch/height source has no consumer revision
- desired-but-inactive terrain may use fallback height
- patch activation can change look height between frames
- run reset does not share one world/camera transaction
- first gameplay-ready and camera-ready frame is unidentified
```

## Required target provenance

```txt
runId
runSessionId
simulationSequence
routeIndex
routeRevision
patchConsumerRevision
heightSourceRevision
targetPolicyVersion
targetFingerprint
```

## Reset policy

```txt
initial-run
run-restart
run-change
teleport-threshold
world-rebase
height-source-rebase
manual-debug
```

Every reset reason must be explicit and testable. Patch or height changes should not silently masquerade as ordinary smoothing updates when a rebase policy is required.

## Ordering requirement

```txt
committed gameplay/world state
  -> target descriptor
  -> controller result
  -> applied camera
  -> rendered frame
```

Camera updates must not consume half-committed patch state. This is why patch activation authority remains P0.
