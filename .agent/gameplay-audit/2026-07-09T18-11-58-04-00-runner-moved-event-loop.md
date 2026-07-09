# Gameplay Audit — Runner Moved Event Loop

**Timestamp:** `2026-07-09T18-11-58-04-00`

## Player loop

```txt
menu
  -> Start Rush / Enter / Space starts game
  -> A/D or arrows turn
  -> W/ArrowUp boosts speed target
  -> Space jumps while grounded
  -> runner moves forward continuously
  -> terrain chunks rebuild around runner
  -> trees and rocks can end the run
  -> shards increment score
  -> distance over 3600m wins
  -> HUD shows scene, distance, speed, heading, shards, best, terrain chunks, and Rapier status
```

## Current authority

`runtime-terrain-v6.mjs` owns movement, jump, terrain sampling, collider checks, shard pickups, scene changes, score, baseline camera, baseline HUD, raptor pose, and render submission inline.

`src/game.js` owns a second presentation pass that improves camera, HUD, and stride but does not create source records.

## Main gameplay gap

The DSK scaffold already has a `dino-pose-domain-kit` that consumes `runner.moved`. The live runner never emits `runner.moved`, so pose, camera, HUD, contact, scene, and render behavior cannot be proven through a source event ledger.

## Next gameplay proof

Add a `RunnerMovedEvent` and presentation frame journal first. Do not tune collision feel, speed, terrain, or visuals until the event bridge can prove menu idle, first movement, turn, boost, jump, pickup, collision, win, and host legacy compatibility rows.
