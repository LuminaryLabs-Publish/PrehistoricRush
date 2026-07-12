# Public Owner Bypass Loop

**Timestamp:** `2026-07-11T22-29-24-04-00`

## Current bypass surface

```txt
page script or automation
  -> globalThis.PrehistoricRushHost
  -> raw engine, physics, patch controller, camera or render adapter
  -> direct mutation outside gameplay command admission
```

## Reachable examples

```txt
engine.tick(dt)
  -> simulation advances outside the product RAF

patchController.generateSync / pump / reset
  -> stream state changes outside world-consumer transaction

physics.setFixedColliders / step / reset
  -> collider or contact state changes outside patch and frame authority

adapter.activatePatch / releasePatches
  -> render, pickup and collider projections mutate without controller acknowledgement

cameraFollow.reset / update
  -> camera state changes without run or frame correlation
```

## Gameplay consequence

A host consumer can create state combinations that the normal product loop never admits. The next RAF then continues from partially mutated owners, and `getState()` cannot prove which mutation occurred or whether rendering and HUD consumed it.

## Required rule

All public mutation must be expressed as a typed command and routed through the existing authoritative owner. Raw service references remain private.

```txt
SubmitHostCommand
  -> validate host session and capability
  -> validate run and expected epochs
  -> route to owner
  -> receive typed owner result
  -> journal result
  -> commit observation only through normal frame authority
```

## Required proof

A fixture must attempt representative engine, streaming, physics, camera and render mutations through the public object and prove that no raw owner or bypass callable is reachable.