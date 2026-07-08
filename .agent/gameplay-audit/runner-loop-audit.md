# PrehistoricRush Runner Loop Audit

**Updated:** `2026-07-08T03:01:20-04:00`

## Current gameplay loop

```txt
menu scene
  -> player starts run
  -> game scene begins
  -> input booleans mutate runner state
  -> lane movement and jump update dino actor
  -> terrain/scatter stream ahead of runner
  -> hazards, shards, and distance goal are checked
  -> run-over or win state mutates the scene
  -> retry/menu actions reset or navigate
```

## Current scenes

`game-scenes.json` declares:

```txt
entryScene: menu
sceneOrder: menu, game, run-over, win
transitions:
  menu:start -> game
  game:runOver -> run-over
  game:win -> win
  run-over:menu -> menu
  run-over:retry -> game
  win:menu -> menu
  win:again -> game
```

## Gameplay domains

```txt
menu-state
run-state
run-over-state
win-state
input-action-frame
input-acceptance
action-result-journal
lane-motion
jump-policy
boost-policy
runner-step-result
runner-event-journal
terrain-stream-state
hazard-contact
pickup-contact
distance-goal
scene-dispatch
retry-reset
host-diagnostics
```

## Authority gap

The gameplay loop needs an explicit command/result layer before the repo does more visual polish.

Current problem:

```txt
input -> inline mutation -> render/contact/scene mutation
```

Target:

```txt
input adapter
  -> ActionFrame
  -> ActionAcceptanceMatrix
  -> RunnerSourceState
  -> RunnerStepResult
  -> RunnerEventJournal
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> renderer/HUD consume outputs
```

## Needed fixture cases

```txt
1. menu accepts start
2. menu rejects jump-only movement
3. game accepts left lane action
4. game accepts right lane action
5. game accepts jump when grounded
6. game rejects jump when not allowed
7. game accepts boost if boost rules allow it
8. hazard contact emits run-over request
9. shard contact emits pickup result
10. distance threshold emits win request
11. run-over accepts retry
12. win accepts again
13. run-over accepts menu
14. win accepts menu
15. replay of same action sequence produces same journal
```

## First implementation target

The next safe implementation target is a small additive wrapper around current behavior:

```txt
ActionFrame -> ActionResultJournal -> RunnerStepResult -> runner.moved -> dino.pose.changed
```

Do this before changing major runner feel, camera, terrain, or visuals.
