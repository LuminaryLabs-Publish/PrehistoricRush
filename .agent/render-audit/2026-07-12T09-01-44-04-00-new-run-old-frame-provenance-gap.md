# Render Audit: New Run / Old Frame Provenance Gap

**Generated:** `2026-07-12T09-01-44-04-00`

## Summary

`game.start()` publishes a new run state before a new committed simulation tick or rendered-frame receipt exists. Camera/content/stream changes occur separately, while public readback exposes each owner independently.

## Mixed-evidence window

```txt
start accepted by direct function call
  -> RunState.runId increments
  -> status becomes game
  -> prior committed simulation/physics/tick frames still exist
  -> content/stream/camera mutate separately
  -> next RAF eventually ticks and renders
```

## Missing provenance

```txt
run epoch on simulation frame
run epoch on physics frame
run epoch on patch/content revisions
run epoch on camera reset
run epoch on scene transition
run epoch on rendered frame
first-run-frame acknowledgement
read-model compatibility check
```

## Required rule

A new run may become externally observable only when the committed read model can identify one compatible run epoch across run state, simulation, physics, stream/content, camera, scene and visible frame. Before that point, observation must report STARTING or the predecessor committed run.
