# PrehistoricRush Runner Action / Contact / Scene Contract

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T16-40-56-04-00`

## Current gameplay loop

The live gameplay loop is still owned by `src/runtime-terrain-v6.mjs`.

```txt
menu scene
  -> Start button / Enter / Space switches scene to game
  -> game scene reads keyboard booleans
  -> turn input mutates yaw
  -> boost input ramps speed
  -> jump input mutates vertical velocity and grounded state
  -> movement advances x/z/distance
  -> terrain sample sets y
  -> terrain update/populate refreshes chunks, colliders, and pickups
  -> Rapier actor transform is updated when available
  -> hazard contact can switch scene to run-over
  -> pickup contact can add shard and repopulate
  -> distance > 3600 switches scene to win
  -> HUD and button text are rewritten directly
```

## Gameplay domains in use

```txt
scene-state-domain:
  menu
  game
  run-over
  win

input domains:
  keyboard-left-right
  keyboard-jump
  keyboard-boost
  button-start-jump-retry

runner domains:
  turn-steering-policy
  yaw-integration-policy
  boost-speed-ramp-policy
  jump-policy
  gravity-policy
  grounded-policy
  forward-motion-policy
  distance-score-policy
  best-distance-localstorage-policy

contact domains:
  hazard-contact-detection
  pickup-contact-detection
  physics-contact-bridge
  collider-descriptor-generation
  pickup-descriptor-generation

scene dispatch domains:
  start-game-dispatch
  run-over-dispatch
  win-dispatch
  retry-dispatch
```

## Current service ownership

```txt
runtime-terrain-v6.mjs owns:
  start()
  keydown handlers
  keyup handlers
  loop(now)
  turn/yaw update
  boost speed ramp
  jump/gravity/grounded update
  movement and distance update
  terrain sampling and chunk updates
  collider and pickup population
  Rapier actor transform update
  hazard hit detection
  pickup hit detection
  scene transition mutation
  best-distance persistence
  HUD/button projection
```

## Missing source/result contract

The following records are still missing as source-backed modules:

```txt
ActionFrame:
  source
  inputType
  actionId
  accepted
  reason
  frame

RunnerSourceState:
  scene
  x/z/y
  jumpY/vy/grounded
  yaw/turn/speed
  distance/best/shards
  input snapshot
  collider count
  pickup count

ContactResultSnapshot:
  hazardHit
  hazardReason
  pickupHit
  pickupKey
  shardDelta
  physicsContactCount
  fallbackContactCount

SceneDispatchResult:
  previousScene
  nextScene
  reason
  source
  accepted

PresentationFrameRecord:
  action
  runner
  movement
  dino
  camera
  hud
  contact
  scene
  render
```

## Gameplay kits identified

Current/source-backed:

```txt
domain-runtime-event-bus-kit
domain-runtime-domain-host-kit
dino-pose-domain-kit
camera-domain-kit
hud-domain-kit
rapier-physics-domain-kit
```

Runtime-implied:

```txt
prehistoric-runner-motion-policy-kit
prehistoric-turn-steering-kit
prehistoric-jump-policy-kit
prehistoric-boost-policy-kit
prehistoric-distance-goal-kit
prehistoric-hazard-contact-kit
prehistoric-pickup-contact-kit
prehistoric-scene-dispatch-kit
prehistoric-best-distance-persistence-kit
```

Next-cut:

```txt
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-presentation-frame-record-kit
prehistoric-rush-host-presentation-snapshot-kit
```

## Next implementation rule

Do not rewrite movement or scene flow first.

Add source/result records beside the current loop, prove them in DOM-free fixtures, and only then split movement/contact/scene authority into smaller reusable kits.
