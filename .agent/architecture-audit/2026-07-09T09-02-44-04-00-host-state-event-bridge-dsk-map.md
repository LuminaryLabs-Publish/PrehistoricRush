# Architecture Audit: Host-State Event Bridge DSK Map

**Timestamp:** `2026-07-09T09-02-44-04-00`

## Current composition

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> event bus / domain host / tick scheduler
  -> dino, camera, HUD domain kits
  -> runtime-terrain-v6 visual runtime
```

## Architecture read

`src/game.js` is a hybrid composition bootstrap and presentation adapter. It installs DSK-like descriptors but then waits for `globalThis.PrehistoricRushHost` from the monolithic visual runtime and mutates presentation state directly.

`src/runtime-terrain-v6.mjs` is the live game authority for motion, terrain, collisions, pickups, scene transitions, camera baseline, HUD baseline, renderer frame, and host readback.

## Current domains

```txt
composition-bootstrap
runtime-event-bus
domain-host
tick-scheduler
dino-form
dino-pose
dino-material
camera-preset
hud-preset
visual-runtime
runner-motion
terrain-streaming
spawn-population
rapier-bridge
collision-contact
pickup-collection
scene-dispatch
render-frame
host-readback
```

## Current service map

```txt
event-bus -> on / emit / snapshot
domain-host -> install / get / tick / snapshot
tick-scheduler -> start / stop / snapshot
dino-pose-domain-kit -> update / getDescriptor / snapshot / runner.moved consumer
camera-domain-kit -> getDescriptor / snapshot
hud-domain-kit -> project / getDescriptor / snapshot
runtime-terrain-v6 -> live motion, terrain, collision, pickup, scene, render, host state
rapier-physics-domain-kit -> kinematic actor, contacts, physics snapshot
```

## Target DSK split

```txt
presentation/runner-source-state-kit
presentation/runner-step-delta-kit
presentation/runner-moved-event-kit
presentation/dino-pose-frame-kit
presentation/camera-frame-request-kit
presentation/hud-frame-request-kit
presentation/contact-result-snapshot-kit
presentation/scene-dispatch-result-kit
presentation/render-readback-kit
presentation/presentation-frame-record-kit
presentation/presentation-journal-kit
presentation/host-presentation-snapshot-kit
```

## Required source boundary

Keep the bridge additive.

```txt
runtime-terrain-v6.mjs owns gameplay mutation for now.
game.js can observe host state.
presentation/* modules derive records from observed host state.
eventBus emits runner.moved from derived deltas.
dino-pose-domain-kit consumes runner.moved.
PrehistoricRushHost.getState().presentation exposes additive proof.
```

## Do not promote yet

None of these planned kits should move to ProtoKits until the fixture proves stable rows for movement, contact, scene, camera, HUD, render readback, and host projection.
