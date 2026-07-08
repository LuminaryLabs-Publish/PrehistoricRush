# PrehistoricRush Validation

**Updated:** `2026-07-08T10:39:22-04:00`

## Validation status for this pass

No runtime source files were changed in this pass.

This pass updated documentation and operating memory under `.agent/` only, then updated the central `LuminaryLabs-Dev/LuminaryLabs` tracking ledger.

## Checks performed

```txt
- GitHub connector read of accessible LuminaryLabs-Publish repo list.
- GitHub connector read of central LuminaryLabs-Dev/LuminaryLabs latest summary and PrehistoricRush repo ledger.
- GitHub connector read of PrehistoricRush README.md.
- GitHub connector read of PrehistoricRush src/runtime.mjs.
- GitHub connector read of PrehistoricRush src/game.js.
- GitHub connector read of PrehistoricRush src/runtime-terrain-v6.mjs.
- GitHub connector read of PrehistoricRush domain runtime files.
- GitHub connector read of PrehistoricRush dino-pose-domain-kit.
- GitHub connector read of PrehistoricRush camera-domain-kit.
- GitHub connector read of PrehistoricRush hud-domain-kit.
- GitHub connector read of PrehistoricRush existing .agent docs.
- GitHub connector create of new PrehistoricRush DSK/domain architecture audit.
- GitHub connector create of new PrehistoricRush render event readback audit.
- GitHub connector create of new PrehistoricRush event bridge fixture readiness audit.
- GitHub connector create of new PrehistoricRush tracker entry.
- GitHub connector create of new PrehistoricRush turn-ledger entry.
- GitHub connector update of PrehistoricRush root .agent docs.
- GitHub connector update of central PrehistoricRush repo ledger.
- GitHub connector create of central internal change-log entry.
```

## Checks not performed

```txt
- No local checkout was available in this connector pass.
- No npm install was run.
- No npm run check was run.
- No local static server was run.
- No browser route validation was run.
- No Playwright smoke was run.
- No live GitHub Pages route was opened.
- No Rapier/Three.js runtime execution was performed.
- No DOM-free presentation fixture was run.
```

## Next validation commands

There is no `package.json` in the repo root at the time of this pass, so do not assume `npm run check` exists.

Recommended next checks:

```bash
# If working from a local checkout:
python3 -m http.server 4173
# open http://localhost:4173/
```

Browser console checks:

```js
globalThis.PrehistoricRushComposition?.snapshot?.()
globalThis.PrehistoricRushHost?.getState?.()
globalThis.PrehistoricRushHost?.getState?.().presentation
```

Expected route facts:

```txt
index.html loads ./src/runtime.mjs
src/runtime.mjs imports ./game.js
src/game.js installs dino, camera, and HUD domain scaffolds
src/game.js imports ./runtime-terrain-v6.mjs
src/game.js starts the presentation pass
```

## Future smoke tests needed

```txt
manifest-load-smoke
manifest-drift-smoke
scene-alias-smoke
runner-source-state-smoke
runner-moved-smoke
dino.pose.changed-smoke
DinoPoseFrame-smoke
camera.frame.requested-smoke
hud.frame.requested-smoke
presentation-frame-record-smoke
presentation-descriptor-journal-smoke
host-presentation-snapshot-smoke
action-frame-smoke
action-acceptance-smoke
action-result-journal-smoke
runner-step-smoke
contact-event-smoke
scene-dispatch-smoke
host-diagnostics-smoke
replay-parity-smoke
run-movement-promotion-smoke
```

## Fixture cases required next

```txt
01_runner_source_state_projects_current_app_state
02_menu_scene_runner_source_does_not_emit_moved_delta
03_game_scene_runner_source_emits_runner_moved
04_runner_moved_feeds_dino_pose_domain
05_dino_pose_frame_matches_current_stride_inputs
06_camera_frame_request_matches_close_camera_visual_policy
07_hud_frame_request_matches_readability_hud_descriptor
08_presentation_frame_record_journals_all_subrecords
09_host_get_state_exposes_presentation_snapshot
10_dom_free_fixture_replays_source_to_presentation_chain
11_renderer_output_unchanged_by_contract_layer
12_legacy_runtime_remains_playable_during_cutover
```

## Pass/fail rule

Do not mark the game as DSK-authority-complete until a DOM-free fixture can replay start, jump, turn, boost, hazard, pickup, run-over, retry, and win paths into stable action/result journals without depending on renderer frame timing.

For the immediate presentation gate, do not mark the presentation seam complete until a fixture can prove:

```txt
RunnerSourceState
  -> RunnerMovedEvent
  -> runner.moved event
  -> dino.pose.changed event
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
```
