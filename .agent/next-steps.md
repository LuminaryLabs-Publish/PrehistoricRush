# PrehistoricRush Next Steps

**Updated:** `2026-07-08T08:11:28-04:00`

## Next safe ledge

Build the presentation frame contract acceptance gate without changing the visible route.

```txt
PrehistoricRush Presentation Frame Contract Acceptance Ledger
```

Preserve the current game first:

```txt
preserve index.html
preserve src/runtime.mjs
preserve src/game.js route composition
preserve current Three.js/Rapier look and feel
preserve current PrehistoricRushComposition.snapshot()
preserve current PrehistoricRushHost.getState()
preserve current camera distance/HUD readability pass visually
```

Then add fixture-readable facts around the current behavior:

```txt
snapshot RunnerSourceState from current app.state
emit runner.moved from the live movement step
let dino-pose-domain-kit consume runner.moved
emit DinoPoseFrame / dino.pose.changed from live runner facts
produce CameraFrameRequest from camera-domain-kit descriptor + RunnerSourceState
produce HudFrameRequest from hud-domain-kit descriptor + RunnerSourceState
append PresentationFrameRecord
surface presentation records through host diagnostics
add DOM-free smoke fixtures for the presentation chain
```

## Implementation checklist

- [ ] Add a `RunnerSourceState` snapshot object from current `app.state` without changing the state shape.
- [ ] Add a `RunnerMovedEvent` from the live movement step in `runtime-terrain-v6.mjs`.
- [ ] Confirm `dino-pose-domain-kit` receives `runner.moved` and emits `dino.pose.changed`.
- [ ] Keep current raptor visual pose behavior while recording the descriptor bridge.
- [ ] Add a `DinoPoseFrame` record derived from runner movement facts.
- [ ] Add a `CameraFrameRequest` derived from `camera-domain-kit` and runner source state.
- [ ] Keep the current `applyCloseCamera` visual result while recording `camera.frame.requested`.
- [ ] Add a `HudFrameRequest` derived from `hud-domain-kit.render()` and runner source state.
- [ ] Keep the current `renderHud` visual result while recording `hud.frame.requested`.
- [ ] Add a `PresentationFrameRecord` with runner/dino/camera/HUD subrecords and fallback reasons.
- [ ] Add `host.presentation.snapshot` or an equivalent nested field to `PrehistoricRushHost.getState()`.
- [ ] Add DOM-free fixtures for runner source -> dino pose -> camera frame -> HUD frame.
- [ ] Add action/result records for start, retry, run-again, menu, left, right, boost, and jump after the presentation chain is proven.
- [ ] Add contact event records for hazard hit, shard pickup, and distance goal after the runner source record exists.
- [ ] Write a run movement promotion report only after local fixture proof exists.

## DSK extraction order

```txt
1. prehistoric-rush-runner-source-state-kit
2. prehistoric-rush-runner-moved-event-kit
3. prehistoric-rush-dino-domain-bridge-kit
4. prehistoric-rush-dino-pose-frame-kit
5. prehistoric-rush-camera-frame-descriptor-kit
6. prehistoric-rush-hud-frame-descriptor-kit
7. prehistoric-rush-presentation-frame-contract-kit
8. prehistoric-rush-presentation-descriptor-journal-kit
9. prehistoric-rush-host-presentation-snapshot-kit
10. prehistoric-rush-action-frame-contract-kit
11. prehistoric-rush-action-acceptance-matrix-kit
12. prehistoric-rush-action-result-journal-kit
13. prehistoric-rush-runner-step-result-kit
14. prehistoric-rush-runner-event-journal-kit
15. prehistoric-rush-contact-result-snapshot-kit
16. prehistoric-rush-scene-dispatch-result-kit
17. prehistoric-rush-replay-parity-smoke-kit
18. prehistoric-rush-runtime-source-bundle-kit
19. prehistoric-rush-manifest-load-status-kit
20. prehistoric-rush-run-movement-promotion-report-kit
```

## Do not do next

```txt
- Do not redesign the visible scene before authority extraction.
- Do not replace the whole runtime in one pass.
- Do not move everything into ProtoKits before local proof exists.
- Do not create a generic kit if the behavior is still PrehistoricRush-specific.
- Do not let renderer, DOM, keyboard handlers, camera lerp code, HUD strings, or Rapier frame stepping own reusable logic.
```

## Validation target after implementation

```txt
node-based smoke if available
browser route smoke
host snapshot check
runner-source-state smoke
runner.moved bridge fixture
dino.pose.changed fixture
DinoPoseFrame fixture
camera.frame.requested fixture
hud.frame.requested fixture
PresentationFrameRecord fixture
host-presentation-snapshot smoke
action-frame smoke
action-acceptance smoke
action-result-journal smoke
runner-step smoke
hazard contact fixture
pickup contact fixture
run-over scene dispatch fixture
win scene dispatch fixture
manifest drift report fixture
replay parity smoke
```

## Stop condition

Stop the implementation ledge when the same runner source state can produce `runner.moved`, `dino.pose.changed`, `DinoPoseFrame`, `CameraFrameRequest`, `HudFrameRequest`, `PresentationFrameRecord`, and a host presentation snapshot without depending on DOM, WebGL, renderer frame timing, or Rapier execution.
