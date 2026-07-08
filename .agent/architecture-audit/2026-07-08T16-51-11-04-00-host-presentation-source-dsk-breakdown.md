# PrehistoricRush Host Presentation Source DSK Breakdown

**Timestamp:** `2026-07-08T16-51-11-04-00`

## Scope

This audit refreshes the DSK/domain breakdown for `LuminaryLabs-Publish/PrehistoricRush`.

Runtime source was not changed. This pass documents the exact source-to-host seam that should be implemented next.

## Selection result

The accessible `LuminaryLabs-Publish` repo list was compared against the central `LuminaryLabs-Dev/LuminaryLabs` repo ledger.

No checked non-Cavalry repo was fully new, missing from the central ledger, missing sampled root `.agent/START_HERE.md`, or otherwise completely undocumented.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded.

`PrehistoricRush` was selected because repo-local `.agent` state had already advanced to `2026-07-08T16-40-56-04-00`, while the central ledger still pointed at `2026-07-08T14:51:11-04:00`. The remaining unresolved seam is still host-presentation proof: the live route is playable, but runner, contact, scene, camera, HUD, dino pose, render, and presentation facts are not yet projected as fixture-readable records.

## Active route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus()
  -> createDomainHost()
  -> createTickScheduler()
  -> dino form / pose / material domains
  -> camera-domain-kit
  -> hud-domain-kit
  -> PrehistoricRushComposition.snapshot()
  -> src/runtime-terrain-v6.mjs
  -> Three.js + Rapier + rapier-physics-domain-kit
  -> src/game.js presentation pass
  -> PrehistoricRushHost.getState()
```

## Current interaction loop

```txt
page load
  -> composition installs repo-local domains
  -> legacy visual runner mounts
  -> player starts from menu
  -> keyboard/button input mutates turn, jump, boost, speed, distance, contacts, pickup, and scene state
  -> runtime-terrain-v6.mjs owns terrain streaming, Rapier bridge, raptor rig, hazards, pickups, baseline camera, and scene mutation
  -> src/game.js presentation pass reads PrehistoricRushHost.app
  -> styleHud(), renderHud(), applyCloseCamera(), and applyReadableStride() directly mutate DOM / Three objects
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain, and renderer data
```

## Domains in use

```txt
static-browser-shell
module-runtime-entry
composition-bootstrap
event-bus-history
domain-host-installation
domain-idempotency
tick-scheduler-scaffold
dino-entity-domain
dino-form-domain
dino-pose-domain
dino-material-domain
dino-domain-bundle
camera-domain
hud-domain
legacy-visual-runtime-bridge
cdn-dependency-loading
three-render-runtime
rapier-physics-runtime
rapier-physics-domain-kit-bridge
dom-mount-ownership
keyboard-input-adapter
button-input-adapter
scene-file-authority
scene-transition-authority
runner-motion-policy
turn-steering-policy
jump-policy
boost-policy
speed-ramp-policy
distance-score-policy
procedural-terrain-rendering
terrain-height-sampling
terrain-chunk-streaming
procedural-scatter-placement
collider-descriptor-generation
pickup-descriptor-generation
rapier-runtime-bridge
kinematic-actor-transform
hazard-contact-detection
pickup-contact-detection
distance-goal-detection
raptor-visual-rig
raptor-pose-animation
camera-follow-policy
hud-telemetry-projection
presentation-pass-authority
runner-source-state-contract
runner-moved-event-contract
dino-pose-event-bridge
dino-pose-frame-contract
camera-frame-request-contract
hud-frame-request-contract
contact-result-contract
scene-dispatch-result-contract
presentation-frame-contract
presentation-descriptor-journal
render-readback-contract
host-presentation-snapshot
fixture-replay-contract
host-diagnostics
repo-local-agent-state
central-ledger-readback
```

## Services currently offered

```txt
createEventBus
  -> on(type, handler)
  -> emit(type, payload)
  -> snapshot()

createDomainHost
  -> install(domain)
  -> get(id)
  -> tick(dt, context)
  -> snapshot()

createTickScheduler
  -> start()
  -> stop()
  -> snapshot()

createDinoFormDomainKit
  -> form descriptor
  -> snapshot

createDinoPoseDomainKit
  -> listens for runner.moved
  -> emits dino.pose.changed
  -> update({ speed, turn, jump, time })
  -> getDescriptor()
  -> snapshot()

createDinoMaterialDomainKit
  -> material descriptor
  -> snapshot

createCameraDomainKit
  -> close-third-person-v1 descriptor
  -> cameraDomain.getDescriptor()
  -> cameraDomain.snapshot()

createHudDomainKit
  -> readability HUD descriptor
  -> hudDomain.render(snapshot)
  -> hudDomain.getDescriptor()
  -> hudDomain.snapshot()

src/game.js presentation services
  -> styleHud(app.ui)
  -> renderHud(app)
  -> applyCloseCamera(app, THREE, dt)
  -> applyReadableStride(app)
  -> startPresentationPass()

runtime-terrain-v6.mjs services
  -> load Three.js / Rapier / rapier-physics-domain-kit
  -> build terrain chunks
  -> sample terrain height
  -> create raptor visual rig
  -> animate raptor pose
  -> create shell DOM
  -> read input
  -> update movement, contacts, shards, distance, run-over, and win state
  -> expose PrehistoricRushHost.getState()
```

## Kits identified

Implemented repo-local kits:

```txt
domain-runtime/event-bus
domain-runtime/domain-host
domain-runtime/tick-scheduler
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle
camera-domain-kit
hud-domain-kit
```

External kit in live use:

```txt
rapier-physics-domain-kit via jsDelivr NexusRealtime-ProtoKits main
```

Runtime-implied kits still embedded in the monolith:

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
prehistoric-legacy-visual-runtime-kit
prehistoric-raptor-visual-rig-kit
prehistoric-terrain-streaming-kit
prehistoric-contact-check-kit
prehistoric-scene-dispatch-kit
prehistoric-hud-dom-render-kit
prehistoric-close-camera-apply-kit
```

Next-cut kits:

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-event-bridge-kit
prehistoric-rush-dino-pose-frame-kit
prehistoric-rush-camera-frame-request-kit
prehistoric-rush-hud-frame-request-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-render-readback-kit
prehistoric-rush-presentation-frame-record-kit
prehistoric-rush-presentation-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-dom-free-presentation-fixture-kit
```

## Implementation cutline

The next implementation should not replace the runner.

It should add pure `src/presentation/*` projection modules, a bounded presentation journal, additive `PrehistoricRushHost.getState().presentation`, and a DOM-free fixture proving that the current live route can be described without relying on DOM, WebGL, or Rapier execution.
