# Interaction Audit: Input, Run, Pose and Render Correlation

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T00-39-25-04-00`

## Active interaction map

```txt
button / keydown / keyup / blur
  -> local browser input object
  -> game.setInput patch
  -> PrehistoricRush InputState resource
  -> engine.tick
  -> RunState mutation
  -> game.createPlayerPose(state summary)
  -> procedural creature pose descriptor
  -> applyCreaturePose live bone mutation
  -> renderer.render
  -> HUD mutation
```

## Current disconnects

```txt
browser event has no command id
input patch has no accepted/rejected result
run-state mutation has no revision
pose request has no request id
pose descriptor has no frame target
pose application returns no result
render has no committed frame id
HUD has no consumption row
```

The interaction is visually continuous but not replayable as an ordered evidence stream. An inspector cannot determine whether a pose corresponds to the state before or after a collision/collection mutation in the same browser frame.

## Required sequence

```txt
BrowserInputIntent
  sequence
  source
  action
  value

RunInputResult
  sequence
  runId
  accepted patch
  rejected fields

RunTickResult
  frameId
  runRevision
  state fingerprint

CreaturePoseRequest
  frameId
  runRevision
  creatureId
  descriptor hash
  speed/time/turn/jump/resistance

PoseConsumptionRow
  frameId
  bindingId
  applied bone count
  status

RenderConsumptionRow
  frameId
  bindingId
  pose sequence
  render status
```

## Admission rules

```txt
ignore/reject input after run-over or win except explicit restart
reject pose requests for inactive runId
reject pose requests whose creature ID does not match the active binding
reject content-hash mismatch
reject non-finite pose channels
classify unknown bone IDs rather than silently skipping them
publish no rendered success until pose and render consumers complete
```

## Host/editor observation

A JSON-safe public snapshot should expose bounded rows, not mutable engine, physics or adapter owners:

```txt
moduleGraph
composition
activeRun
creatureDescriptor
renderBinding
collisionBinding
latestInputResult
latestRunTick
latestPoseConsumption
latestRenderConsumption
recentJournal
```

## Follow-on

After creature consumption is correlated, reuse the same sequence/frame model for tree/grass/shard population admission, Rapier contacts, scene transitions and HUD publication.