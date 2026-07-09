# PrehistoricRush Known Gaps

**Updated:** `2026-07-09T18-11-58-04-00`

## Highest-priority gaps

```txt
1. src/game.js installs dino, camera, and HUD domain scaffolds, but the live runner still does not emit stable runner movement facts.
2. dino-pose-domain-kit already listens for runner.moved, but runtime-terrain-v6.mjs does not yet emit runner.moved from live state changes.
3. There is no RunnerSourceState record projected from current app.state.
4. There is no RunnerStepDelta record that compares previous runner source state against current runner source state.
5. There is no RunnerMovedEvent record consumed by the existing dino pose kit.
6. src/game.js can read PrehistoricRushHost.app, but it does not snapshot RunnerSourceState before applying direct presentation mutations.
7. applyCloseCamera still directly mutates the Three.js camera and does not leave behind a CameraFrameRequest.
8. renderHud still directly writes DOM and does not leave behind a HudFrameRequest.
9. applyReadableStride directly mutates the raptor rig and does not leave behind a DinoPoseFrame or pose consumer readback.
10. Contact checks still mutate scene/shards inline without a ContactResultSnapshot.
11. Scene dispatch still mutates menu/game/run-over/win inline without a SceneDispatchResult.
12. PrehistoricRushHost.getState() lacks a nested presentation snapshot.
13. Render readback is only the string renderer field, not structured frame consumption evidence.
14. The event bus records composition.ready and can record runner.moved, but the live loop does not feed it presentation events.
15. No DOM-free fixture proves menu idle, first movement, turning, boost, jump, pickup, collision, win, render readback, or host legacy-field compatibility.
16. There is no root package.json, so there is no package-script validation contract yet.
```

## Non-gaps for this pass

```txt
The static route exists.
The game is playable.
The raptor visual exists.
The terrain stream exists.
Five tree pool types exist.
Rapier bridge/fallback path exists.
The close-camera/HUD presentation pass exists.
The DSK scaffold exists.
The current problem is not lack of visuals.
```

## Do not fix first

```txt
Do not start with new art.
Do not start with terrain rewrite.
Do not start with movement rewrite.
Do not start with renderer extraction.
Do not start with ProtoKit promotion.
Do not start with collision feel tuning.
Do not start with a new package script before the DOM-free fixture contract exists.
```
