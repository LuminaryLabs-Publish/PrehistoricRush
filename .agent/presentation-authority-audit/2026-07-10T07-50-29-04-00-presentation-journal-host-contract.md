# Presentation Authority Audit: Presentation Journal Host Contract

Timestamp: 2026-07-10T07-50-29-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Current host readback

`PrehistoricRushHost.getState()` exposes:

```txt
scene
runner
physics
terrain.chunks
renderer
```

## Missing host readback

```txt
presentation.latestFrame
presentation.recentFrames
presentation.eventCounts
presentation.inputRows
presentation.movementRows
presentation.contactRows
presentation.pickupRows
presentation.sceneRows
presentation.bestDistanceRows
presentation.renderReadback
presentation.fixtureContract
```

## Required additive contract

Preserve the existing host shape.

Add:

```txt
PrehistoricRushHost.getState().presentation = {
  version,
  latestFrame,
  recentFrames,
  eventCounts,
  movementRows,
  contactRows,
  pickupRows,
  sceneRows,
  bestDistanceRows,
  renderReadback,
  fixtureContract
}
```

## Main finding

The host needs presentation proof before more visual work. The proof should be additive and serializable so the DOM-free fixture can assert it.

## Next safe ledge

```txt
PrehistoricRush Runner Event Journal Readback Catch-up + DOM-Free Presentation Gate
```
