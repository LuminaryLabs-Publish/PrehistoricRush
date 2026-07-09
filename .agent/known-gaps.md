# PrehistoricRush Known Gaps

**Updated:** `2026-07-09T11-46-08-04-00`

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
14. Movement authority still lives inside the legacy visual runtime.
15. The README still describes older scene manifests/tuning files that are not the live route authority.
16. The repo has no DOM-free presentation fixture script.
17. The central ledger can lag behind repo-local .agent state when scheduled passes land close together; each docs pass needs explicit central catch-up.
```

## Do not solve next

```txt
Do not add more dinosaur art.
Do not add more trees.
Do not tune terrain visuals.
Do not extract renderer authority.
Do not replace Rapier integration.
Do not promote anything to ProtoKits yet.
Do not rewrite runtime-terrain-v6.mjs wholesale.
```

## Exact blocker

The blocker is proof, not playability.

The game plays, but the domain composition cannot yet prove that live runner state flows into the dino pose kit, camera descriptor, HUD descriptor, contact results, scene dispatch, render readback, and host diagnostics.

## Fixture gaps

```txt
missing fixture row for menu idle
missing fixture row for first game movement frame
missing fixture row for turn left / turn right
missing fixture row for boost
missing fixture row for jump start
missing fixture row for jump fall / grounded recovery
missing fixture row for shard pickup
missing fixture row for collision run-over
missing fixture row for win threshold
missing fixture row for render readback unchanged by presentation proof layer
missing fixture row for host legacy fields unchanged
missing fixture row for central ledger newest-tracker readback
```

## Host-state gaps

```txt
PrehistoricRushHost.getState().presentation missing
PrehistoricRushHost.getState().presentation.latestFrame missing
PrehistoricRushHost.getState().presentation.journal missing
PrehistoricRushHost.getState().presentation.runnerSource missing
PrehistoricRushHost.getState().presentation.runnerDelta missing
PrehistoricRushHost.getState().presentation.runnerMoved missing
PrehistoricRushHost.getState().presentation.dinoPose missing
PrehistoricRushHost.getState().presentation.cameraRequest missing
PrehistoricRushHost.getState().presentation.hudRequest missing
PrehistoricRushHost.getState().presentation.contact missing
PrehistoricRushHost.getState().presentation.sceneDispatch missing
PrehistoricRushHost.getState().presentation.renderReadback missing
```

## Current next safe ledge

```txt
PrehistoricRush Host Presentation Event Ledger + DOM-Free Fixture Gate
```
