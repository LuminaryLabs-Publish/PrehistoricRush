# Known Gaps: PrehistoricRush

**Updated:** `2026-07-10T01-31-29-04-00`

## Source and event gaps

```txt
no RunnerSourceState module
no RunnerStepDelta module
no RunnerMovedEvent module
no MovementResultRow module
runtime-terrain-v6 does not emit runner.moved
live raptor pose bypasses dino-pose-domain-kit
movement has no accepted/rejected/no-change result row
jump/contact/pickup/scene transitions have no reason codes
best-distance localStorage write has no proof row
```

## Presentation gaps

```txt
src/game.js applies readable stride directly to the rig
src/game.js applies close camera directly to the camera
src/game.js rewrites HUD DOM directly
src/game.js submits a second renderer frame
no DinoPoseFrame record
no CameraFrameRequest record
no HudFrameRequest record
no RenderReadback record
no PresentationFrameRecord
no PresentationJournalSnapshot
```

## Host readback gaps

```txt
PrehistoricRushHost.getState() has no presentation object
no latest presentation frame
no recent presentation frames
no event counts
no movement result rows
no contact result rows
no pickup result rows
no scene dispatch result rows
no best-distance result rows
no render readback
no fixture contract metadata
```

## Render gaps

```txt
baseline runtime render has no render-readback row
secondary presentation render has no render-readback row
no stable frame id shared between movement, pose, camera, HUD, and render
no serialized instanced count summary per frame
```

## Gameplay proof gaps

```txt
contact resolution is not represented as ContactResultSnapshot
pickup collection is not represented as PickupResultSnapshot
win/run-over scene changes are direct scene mutation
best distance localStorage update has no proof row
```

## Validation gaps

```txt
no root package.json found
no npm run check
no DOM-free presentation fixture
no browser smoke in this pass
no GitHub Pages smoke in this pass
```

## Do not solve these first

```txt
visual expansion
terrain rewrite
movement tuning
renderer extraction
new pickups
new obstacle set
ProtoKit promotion
```

## Current ledge

```txt
PrehistoricRush Movement Event Readback Catch-up + Host Presentation Fixture Gate
```
