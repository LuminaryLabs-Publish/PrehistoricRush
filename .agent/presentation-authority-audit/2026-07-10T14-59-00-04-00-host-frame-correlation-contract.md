# Presentation authority audit: host frame correlation contract

Timestamp: `2026-07-10T14-59-00-04-00`

## Current host shape

```txt
PrehistoricRushHost.getState() -> {
  scene,
  runner,
  physics,
  terrain: { chunks },
  renderer: "three-terrain-v6-raptor"
}
```

## Contract gap

The host exposes aggregate live objects and labels, but not a JSON-safe presentation journal. It cannot answer which input and movement row produced the current pose, camera, HUD, and render frame.

## Additive contract next

```txt
PrehistoricRushHost.getState().presentation = {
  sourceRevision,
  latestFrameId,
  latestRunnerMovedEvent,
  latestInputResult,
  latestMovementResult,
  latestPoseFrame,
  latestCameraFrame,
  latestHudFrame,
  latestRenderReadback,
  recentFrames,
  fixtureContract
}
```

## Compatibility rule

Keep the existing `scene`, `runner`, `physics`, `terrain`, and `renderer` fields. Add the presentation block without breaking current consumers.

## Next safe ledge

```txt
PrehistoricRush Runner Frame Correlation Source Ledger Refresh + DOM-Free Host Fixture Gate
```