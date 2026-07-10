# Presentation Authority Audit: Host Source Event Readback Contract

**Timestamp:** `2026-07-10T13-30-15-04-00`

## Current host contract

```txt
PrehistoricRushHost.getState() -> {
  scene,
  runner,
  physics,
  terrain: { chunks },
  renderer: "three-terrain-v6-raptor"
}
```

## Missing source readback

```txt
no presentation block
no source frame id
no recent runner.moved rows
no input result ledger
no movement result ledger
no contact result ledger
no pickup result ledger
no scene dispatch ledger
no best distance ledger
no dino pose frame
no camera frame request
no HUD frame request
no render readback
no fixture contract metadata
```

## Additive contract target

```txt
PrehistoricRushHost.getState().presentation = {
  contract: "prehistoric-runner-source-event-readback-v1",
  latestFrame,
  recentFrames,
  eventCounts,
  inputResults,
  movementResults,
  contactResults,
  pickupResults,
  sceneResults,
  bestDistanceResults,
  renderReadback
}
```

## Main finding

Keep the legacy host shape intact and add source-event readback. Do not rewrite the renderer, terrain, or runner before the additive host proof surface exists.
