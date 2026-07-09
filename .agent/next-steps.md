# PrehistoricRush Next Steps

**Updated:** `2026-07-09T18-11-58-04-00`

## Next safe ledge

Build the presentation event bridge and DOM-free host readback fixture without changing the visible route.

```txt
PrehistoricRush Presentation Event Bridge Readback + Host Fixture Gate
```

## Preserve first

```txt
preserve index.html
preserve src/runtime.mjs
preserve src/game.js route composition
preserve src/runtime-terrain-v6.mjs visual route
preserve current Three.js/Rapier look and feel
preserve current raptor visual
preserve current terrain streaming
preserve current input controls
preserve current menu/game/run-over/win scenes
preserve current PrehistoricRushComposition.snapshot() shape
preserve current PrehistoricRushHost.getState() top-level fields
```

## Implementation order

```txt
1. Add src/presentation/presentation-events.js with stable event names and payload contracts.
2. Add src/presentation/runner-source-state.js to clone only serializable runner state fields.
3. Add src/presentation/runner-step-delta.js to compare previous/current runner records.
4. Add src/presentation/runner-moved-event.js to create the payload expected by dino-pose-domain-kit.
5. Add src/presentation/dino-pose-frame.js to record dino pose kit output without depending on the rig mesh.
6. Add src/presentation/camera-frame-request.js to describe the close-camera intent before mutating Three camera objects.
7. Add src/presentation/hud-frame-request.js to describe the HUD projection before mutating DOM.
8. Add src/presentation/contact-result-snapshot.js to record collision and shard pickup facts.
9. Add src/presentation/scene-dispatch-result.js to record scene transition reason and result.
10. Add src/presentation/render-readback.js to capture renderer/camera/scene consumption facts.
11. Add src/presentation/presentation-frame-record.js to bundle the frame proof.
12. Add src/presentation/presentation-journal.js as a bounded proof history.
13. Add src/presentation/host-presentation-snapshot.js for additive PrehistoricRushHost.getState().presentation.
14. Wire src/game.js presentation pass to produce records and emit runner.moved while preserving existing visible behavior.
15. Add scripts/prehistoric-rush-presentation-frame-fixture.mjs.
16. Add or wire an explicit check command only after the fixture exists.
17. Confirm root .agent pointers and central ledger paths reference files that actually exist.
```

## Required fixture rows

```txt
menu_idle
game_first_movement_frame
turn_left
turn_right
boost
jump_start
jump_recover
shard_pickup
collision_run_over
win_threshold
render_readback_unchanged
host_legacy_fields_unchanged
```

## Acceptance contract

```txt
RunnerSourceState is serializable.
RunnerStepDelta is deterministic.
RunnerMovedEvent matches dino-pose-domain-kit update payload shape.
dino.pose.changed can be produced from the live runner moved payload.
CameraFrameRequest is serializable and does not require Three.js.
HudFrameRequest is serializable and does not require DOM.
ContactResultSnapshot captures hit/pickup/no-op branches.
SceneDispatchResult captures menu, game, run-over, and win transitions.
RenderReadback records frame consumption without becoming renderer authority.
PrehistoricRushHost.getState().presentation exists additively.
Existing PrehistoricRushHost.getState() top-level fields remain stable.
The fixture runs without DOM, WebGL, Three.js, or Rapier.
Repo-local .agent and central ledger pointers resolve to real files.
```

## Defer

```txt
terrain extraction
Rapier extraction
renderer extraction
new visual assets
new enemy systems
flock rewrite
ProtoKit promotion
scene manifest rewrite
```
