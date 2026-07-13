# Render Audit: Input Result and Visible Frame Gap

**Timestamp:** `2026-07-13T03-12-30-04-00`

## Summary

The Three.js and HUD frame can reflect steering, boost, jump or restart effects, but neither frame identifies the browser sample, Core Input result or consumer receipt that produced it.

## Plan ledger

**Goal:** make the first visible consequence of an admitted input action cite the same input and simulation revisions.

- [x] Trace browser input through product state, simulation, camera, player pose, renderer and HUD.
- [x] Record missing input provenance in public diagnostics.
- [x] Preserve viewport, articulation and run-lifecycle audit boundaries.
- [ ] Add frame correlation after runtime input adoption.

## Current frame path

```txt
window event or button click
  -> direct product input mutation
  -> engine.tick
  -> run-state commit
  -> player transform and legacy pose
  -> camera follow
  -> renderer.render
  -> HUD innerHTML and button text
  -> no terminal input result or frame acknowledgement
```

## Missing frame provenance

```txt
inputSessionId
inputSurfaceId
focusGeneration
inputSampleId
inputCommandId
inputSequence
CoreInputAdmissionResult id
consumer receipt id
runId
simulation revision
render frame id
first visible input-frame acknowledgement
```

## Failure examples

```txt
Enter keydown during active run
  -> start() resets run
  -> visible run jumps to a new runId
  -> no frame record proves why restart was admitted

Space auto-repeat
  -> jump flag can be re-armed
  -> visible later jump may occur
  -> no edge command or repeat classification identifies its source

blur
  -> input is neutralized
  -> no clear result or visible neutral-frame acknowledgement exists
```

## Required projection contract

```txt
AcceptedInputResult
  -> ProductInputConsumptionReceipt
  -> SimulationCommitRevision
  -> RenderAdmissionResult
  -> HUDProjectionRevision
  -> FirstInputFrameAck {
       inputResultId,
       runId,
       simulationRevision,
       renderFrameId,
       visibleStateFingerprint
     }
```

## Non-claim

Rendering, camera, HUD and public diagnostics were not changed. No frame-provenance fixture was run.