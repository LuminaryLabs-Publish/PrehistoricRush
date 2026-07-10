# Presentation Authority Audit: Host Journal Readback Contract

**Timestamp:** `2026-07-10T02-51-39-04-00`

## Current authority split

Presentation authority is split across:

```txt
src/domains/dino/dino-pose-domain-kit.js
  -> source-shaped pose consumer for runner.moved

src/game.js
  -> direct readable stride mutation
  -> direct close camera mutation
  -> direct HUD DOM mutation
  -> secondary render submission

src/runtime-terrain-v6.mjs
  -> direct raptor pose mutation
  -> direct camera mutation
  -> direct HUD mutation
  -> direct render submission
```

## Current host readback

```txt
PrehistoricRushHost.getState()
  -> scene
  -> runner
  -> physics
  -> terrain.chunks
  -> renderer
```

## Required additive readback

Do not remove existing host fields.

Add:

```txt
PrehistoricRushHost.getState().presentation
  -> latestFrame
  -> recentFrames
  -> eventCounts
  -> movementRows
  -> contactRows
  -> pickupRows
  -> sceneRows
  -> bestDistanceRows
  -> renderReadback
  -> fixtureContract
```

## Journal contract

Each frame record should be serializable and include:

```txt
frameId
sceneBefore
sceneAfter
sourceState
stepDelta
movementResult
runnerMovedEvent
dinoPoseFrame
cameraFrameRequest
hudFrameRequest
contactResult
pickupResult
sceneDispatchResult
bestDistanceResult
renderReadback
consumers
```

## Acceptance rule

The first implementation should be additive.

It should prove that the current route can emit records without changing game feel.

## Next ledge

```txt
PrehistoricRush Runner Moved Event Host Journal Catch-up + DOM-Free Fixture Gate
```
