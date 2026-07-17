# Pause Overlay Moving-World Frame Gap

**Timestamp:** `2026-07-17T10-59-32-04-00`

## Finding

The host presents a full-screen Pause/Settings overlay, but the accepted frame continues to update simulation, streaming, camera and Three.js rendering. The overlay can therefore be visually stationary while the authoritative run advances behind it.

## Current frame

```txt
menu open
  -> overlay mounts
  -> gameplay input may still change
  -> engine.tick(dt)
  -> collision, pickup, score and route state advance
  -> patches stream
  -> camera and world render
  -> overlay remains on top
```

## Missing frame evidence

```txt
PauseGeneration
PausedSimulationRevision
neutral gameplay input digest
suspended participant receipts
overlay focus owner
FirstPausedFrameAck
FirstResumedGameplayFrameAck
```

## Required proof

A browser fixture must open the menu while steering and boosting, verify neutral gameplay input, verify unchanged gameplay/physics/world revisions across several rendered overlay frames, close the menu, verify clock rebasing, and bind the first resumed world frame to the matching close result.
