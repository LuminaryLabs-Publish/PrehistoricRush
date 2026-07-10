# Presentation Authority Audit: Host Presentation Source Contract

**Timestamp:** `2026-07-10T12-10-27-04-00`

## Current authority boundary

```txt
runtime-terrain-v6 owns baseline presentation mutation
  raptor pose
  camera
  HUD HTML
  renderer submission

src/game.js owns secondary presentation mutation
  readable stride
  close camera
  HUD HTML rewrite
  second renderer submission

dino-pose-domain-kit owns descriptor logic
  but only reacts to runner.moved
  runner.moved is not emitted by the live loop
```

## Contract gap

The current route has three presentation authorities and no source frame ledger connecting them. A fixture cannot prove which runner state each presentation pass consumed.

## Required additive contract

```txt
PrehistoricRushHost.getState().presentation = {
  contract: "prehistoric-runner-presentation-source-v1",
  latestFrame,
  recentFrames,
  eventCounts,
  inputResults,
  movementResults,
  contactResults,
  pickupResults,
  sceneResults,
  bestDistanceResults,
  renderReadbacks
}
```

## Source frame chain

```txt
RunnerSourceState
  -> RunnerStepDelta
  -> InputResultRow
  -> MovementResultRow
  -> RunnerMovedEvent
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> RenderReadbackRow
  -> PresentationFrameRecord
  -> HostPresentationSnapshot
```

## Recommendation

Make the host snapshot additive and JSON-safe. Preserve the legacy `scene`, `runner`, `physics`, `terrain`, and `renderer` shape so existing browser reads do not break.
