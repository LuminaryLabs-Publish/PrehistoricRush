# Render Audit: Presentation Render Frame Readback Gap

Timestamp: 2026-07-10T07-50-29-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Current render path

```txt
runtime-terrain-v6 frame loop
  -> mutate raptor pose
  -> mutate camera
  -> mutate HUD
  -> renderer.render(scene, camera)

src/game.js presentation pass
  -> apply readable stride
  -> apply close camera
  -> rewrite HUD DOM
  -> renderer.render(scene, camera) again
```

## Gap

There are two render submissions and no stable `RenderReadback` row tying movement, pose, camera, HUD, and renderer submission to one source frame ID.

## Required rows

```txt
DinoPoseFrame
CameraFrameRequest
HudFrameRequest
RenderReadback
PresentationFrameRecord
PresentationJournalSnapshot
```

## Main finding

Do not extract or rewrite the renderer next. Add frame IDs and render readback rows that make both the baseline render and secondary presentation render fixture-readable.

## Next safe ledge

```txt
PrehistoricRush Runner Event Journal Readback Catch-up + DOM-Free Presentation Gate
```
