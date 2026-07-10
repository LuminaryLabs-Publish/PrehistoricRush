# Architecture audit: runner frame correlation source DSK map

Timestamp: `2026-07-10T14-59-00-04-00`

## Current route

```txt
index.html -> src/runtime.mjs -> src/game.js -> src/runtime-terrain-v6.mjs
```

## Current DSK split

```txt
src/domain-runtime/event-bus.js      owns event subscription, emit, and recent history
src/domain-runtime/domain-host.js    owns domain install/get/tick/snapshot
src/domain-runtime/tick-scheduler.js owns requestAnimationFrame tick scheduling
src/domains/dino/*                   owns dino form, pose descriptor, and material descriptor
src/domains/camera/*                 owns close-camera descriptor
src/domains/hud/*                    owns HUD descriptor and model renderer
runtime-terrain-v6.mjs               still owns live game state and rendering inline
```

## Source-domain gap

`dino-pose-domain-kit` subscribes to `runner.moved`, but the live runner never emits that event. The event bus is ready, but the source of truth is still the monolithic frame loop.

## Required next source kits

```txt
frame-id-source-kit
runner-source-state-kit
runner-step-delta-kit
runner-moved-event-kit
input-result-row-kit
movement-result-row-kit
contact-result-snapshot-kit
pickup-result-snapshot-kit
scene-dispatch-result-kit
best-distance-result-kit
dino-pose-frame-kit
camera-frame-request-kit
hud-frame-request-kit
render-readback-kit
presentation-frame-record-kit
presentation-journal-kit
host-presentation-snapshot-kit
```

## DSK boundary rule

Do not extract the renderer first. First add additive proof rows around the current frame loop so the same runtime behavior can be replayed and inspected without the DOM.

## Next safe ledge

```txt
PrehistoricRush Runner Frame Correlation Source Ledger Refresh + DOM-Free Host Fixture Gate
```