# Render Host Command and Result Map

**Timestamp:** `2026-07-17T06-23-59-04-00`

## Intent

Make route, runtime and browser lifecycle interactions explicit without moving gameplay or rendering logic into the host shell.

## Command map

```txt
RouteEnterCommand
  -> RenderHostGenerationAdmissionCommand
  -> RenderHostGenerationAdmissionResult

AnimationFrameCallback
  -> RenderFrameAdmissionCommand
  -> admitted: engine tick, stream update, layer update, render
  -> retired/stale: reject without mutation or submission
  -> RenderFrameResult

PatchReadyResult / WorkerResult
  -> PatchGenerationAdmissionCommand
  -> admit only when host, controller and Worker generations match
  -> PatchGenerationAdmissionResult

RunRestartCommand
  -> reset run/camera/stream state inside the current host generation
  -> RunRestartResult

RouteExitCommand / RuntimeReplaceCommand / WebGLRecoveryCommand
  -> RenderHostRetirementCommand
  -> RenderHostRetirementResult
  -> FirstRetiredRenderHostAck

Replacement admission
  -> require settled predecessor or explicit forced-retirement policy
  -> RenderHostReplacementCommand
  -> RenderHostReplacementResult
  -> FirstReplacementRenderHostFrameAck
```

## Interaction-owned services

```txt
frame admission latch
browser listener registration and retirement
button handler registration and retirement
RAF identity and cancellation
Worker identity and termination
late patch/result rejection
canvas attachment and detachment
replacement admission
```

## Result requirements

Every result should include:

```txt
renderHostGeneration
commandId
idempotencyKey
status: applied | duplicate | stale | failed | indeterminate
participant receipts
active patch revision
last admitted frame revision
renderer and canvas retirement state
atmosphere retirement state
error classification when present
```

## Existing direct interactions

```txt
window keydown/keyup/blur/resize listeners: direct
button onclick assignment: direct
requestAnimationFrame recursion: direct
Worker construction and postMessage: direct
renderer canvas append: direct
adapter child disposal: direct
parent lifecycle result: absent
```

## Boundary

No user-facing control semantics need to change. The required work is command admission and retirement around existing interactions.