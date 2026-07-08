# PrehistoricRush Runner Authority Audit

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Updated:** `2026-07-08T05:10:47-04:00`

## Purpose

This audit names the next authority seam to extract from `src/runtime-terrain-v6.mjs` without breaking the current public route.

The goal is not visual redesign.

The goal is stable, replayable runner facts.

## Current state

```txt
src/game.js
  -> installs repo-local domain runtime
  -> installs dino form, pose, and material domains
  -> exposes PrehistoricRushComposition.snapshot()
  -> imports runtime-terrain-v6.mjs

src/runtime-terrain-v6.mjs
  -> owns live Three.js scene
  -> owns Rapier bridge setup
  -> owns shell/HUD mutation
  -> owns current input handling
  -> owns movement, jump, boost, terrain, scatter, contact, win, run-over, camera, and raptor visual updates
```

## Problem

The repo already looks like it has a DSK cutover because `src/game.js` installs domain kits.

But the live loop still depends on a visual runtime monolith.

That makes it hard to prove whether lane movement, jumps, boosts, collision, pickups, run-over, win dispatch, dino pose, and replay state are deterministic.

## Desired split

```txt
runner-action-domain
  -> createActionFrame
  -> classifyActionAcceptance
  -> appendActionResult

runner-step-domain
  -> snapshotRunnerSourceState
  -> reduceRunnerStep
  -> emitRunnerMoved

runner-contact-domain
  -> snapshotHazardContact
  -> snapshotPickupContact
  -> snapshotDistanceGoal

scene-result-domain
  -> createSceneDispatchRequest
  -> appendSceneDispatchResult

dino-bridge-domain
  -> consume runner.moved
  -> emit dino.pose.changed
  -> expose bridge diagnostics

fixture-domain
  -> replay action journal
  -> verify accepted/rejected paths
  -> verify run-over and win dispatch
```

## Required action/result records

```txt
ActionFrame
  id
  atTick
  source
  type
  held
  pressed
  axis
  raw

ActionAcceptance
  actionId
  accepted
  reason
  normalizedIntent

RunnerSourceState
  tick
  scene
  position
  velocity
  grounded
  speed
  laneIntent
  jumpIntent
  boostIntent
  distance

RunnerStepResult
  tick
  acceptedActions
  rejectedActions
  previousState
  nextState
  emittedEvents

RunnerMoved
  tick
  position
  velocity
  speed
  grounded
  turning
  jumpPhase

ContactResult
  tick
  hazardHit
  pickupIds
  distanceGoalReached
  rejectedReason

SceneDispatchResult
  tick
  requestedScene
  accepted
  reason
  sourceEvent
```

## Minimum smoke intake cases

```txt
1. start from menu -> accepted start -> game scene requested
2. start while already running -> rejected already_running
3. left press -> accepted lane/turn intent
4. right press -> accepted lane/turn intent
5. jump while grounded -> accepted jump_consumed
6. jump while airborne -> rejected not_grounded or buffered
7. boost while running -> accepted boost intent
8. hazard contact -> run-over scene dispatch result
9. pickup contact -> pickup journal result
10. distance goal -> win scene dispatch result
```

## Bridge requirement

`dino-pose-domain-kit` should not infer pose from renderer state.

It should consume `runner.moved` or an equivalent runner fact event.

The raptor visual rig should eventually consume pose descriptors, not own locomotion truth.

## Promotion rule

Keep this behavior repo-local until the fixture gate proves stable.

Only promote a shared `run-movement-kit` after accepted/rejected action paths and replay parity are demonstrated without DOM, renderer, or Rapier frame timing.
