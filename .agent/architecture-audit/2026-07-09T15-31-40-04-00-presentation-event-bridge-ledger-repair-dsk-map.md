# Architecture Audit: Presentation Event Bridge Ledger Repair

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T15-31-40-04-00`

## Architecture read

`PrehistoricRush` currently has two overlapping layers:

```txt
repo-local DSK scaffold
  -> event bus
  -> domain host
  -> tick scheduler
  -> dino/camera/HUD descriptor kits

legacy playable runtime
  -> Three.js scene
  -> Rapier bridge
  -> terrain streaming
  -> procedural raptor
  -> input/motion/jump/contact/pickup/score/scene inline state
```

The scaffold is useful but underfed. The existing `dino-pose-domain-kit` already expects movement facts, yet the live runner never emits a stable `runner.moved` record.

## Current boundaries

```txt
src/game.js
  owns: DSK scaffold bootstrap, composition snapshot, presentation pass
  consumes: PrehistoricRushHost.app, Three camera, DOM HUD, raptor rig
  problem: second-pass mutations are not recorded as source-readable facts

src/runtime-terrain-v6.mjs
  owns: live game runtime, scene, terrain, input, movement, contacts, pickups, scene result
  consumes: Three.js, Rapier kit, DOM, requestAnimationFrame
  problem: mutates source state and render consumers inline without event/result ledgers

PrehistoricRushHost.getState()
  owns: legacy top-level readback
  problem: lacks nested presentation proof state
```

## Domain split to preserve

```txt
composition bootstrap stays in src/game.js
visual runner remains in runtime-terrain-v6.mjs for now
presentation proof modules sit under src/presentation/
fixture proof sits under scripts/
existing host fields remain additive-compatible
```

## DSK/domain breakdown

```txt
runner-source-state-kit
  input: PrehistoricRushHost.app.state
  output: serializable runner source record

runner-step-delta-kit
  input: previous/current runner source records
  output: deterministic delta record

runner-moved-event-kit
  input: runner source + runner delta
  output: runner.moved payload for dino-pose-domain-kit

presentation-events-kit
  input: stable event name catalog
  output: event name constants and payload shape helpers

dino-pose-frame-kit
  input: dino.pose.changed event and/or pose descriptor
  output: serializable pose frame record

camera-frame-request-kit
  input: runner source state and camera preset
  output: serializable camera consumer request

hud-frame-request-kit
  input: runner source state, scene, physics, terrain count
  output: serializable HUD consumer request

contact-result-snapshot-kit
  input: contact/pickup branches
  output: hit, pickup, no-op, win, and run-over result records

scene-dispatch-result-kit
  input: previous scene, current facts, target condition
  output: serializable scene transition result

render-readback-kit
  input: renderer/camera/scene frame consumption
  output: render readback record without becoming renderer authority

presentation-frame-record-kit
  input: event, pose, camera, HUD, contact, scene, render records
  output: single frame proof bundle

presentation-journal-kit
  input: frame records
  output: bounded history and latest frame snapshot

host-presentation-snapshot-kit
  input: presentation journal
  output: additive PrehistoricRushHost.getState().presentation

dom-free-presentation-fixture-kit
  input: pure presentation modules
  output: fixture rows for menu, movement, boost, jump, pickup, collision, win, host compatibility
```

## Main architecture constraint

Do not extract terrain, physics, movement, renderer, or visual content first.

The next implementation should be a thin proof layer that records what the current runtime already does, then exposes that proof through host readback and a DOM-free fixture.
