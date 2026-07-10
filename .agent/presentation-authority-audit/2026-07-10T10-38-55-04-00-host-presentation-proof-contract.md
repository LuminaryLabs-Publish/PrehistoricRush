# Presentation Authority Audit: Host Presentation Proof Contract

Timestamp: 2026-07-10T10-38-55-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Current host surface

```txt
PrehistoricRushHost.getState()
  -> scene
  -> runner
  -> physics
  -> terrain chunk count
  -> renderer label
```

## Missing host surface

```txt
presentation
  -> latestFrame
  -> recentFrames
  -> eventCounts
  -> inputResults
  -> movementResults
  -> contactResults
  -> pickupResults
  -> sceneDispatchResults
  -> bestDistanceResults
  -> renderReadback
  -> fixtureContract
```

## Required additive contract

Do not remove existing `PrehistoricRushHost.getState()` fields.

Add:

```txt
PrehistoricRushHost.getState().presentation = {
  latestFrame,
  recentFrames,
  eventCounts,
  inputResults,
  movementResults,
  contactResults,
  pickupResults,
  sceneDispatchResults,
  bestDistanceResults,
  renderReadback,
  fixtureContract
}
```

## Contract rules

- Source rows must be JSON-safe.
- Each row needs a stable frame id.
- `runner.moved` must carry enough data for `dino-pose-domain-kit` to consume.
- Presentation pass must not erase source frame ids.
- Fixture must prove host shape without browser rendering.

## Next safe ledge

```txt
Host presentation proof contract + runner event fixture
```
