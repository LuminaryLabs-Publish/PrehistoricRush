# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-09T12-00-36-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Mode:** docs-only internal audit and central-ledger catch-up

## Goal

Refresh repo-local `.agent` operating memory, identify the current loop/domains/services/kits, and update the central `LuminaryLabs-Dev/LuminaryLabs` ledger so the next implementation pass has a precise source seam.

## Selection

`PrehistoricRush` was selected after comparing the full accessible `LuminaryLabs-Publish` repository list against the central ledger and sampled root `.agent` state.

No checked non-Cavalry Publish repo was new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`TheCavalryOfRome` remains excluded.

`PrehistoricRush` was the oldest eligible central-ledger fallback. Central tracking still pointed at `2026-07-09T09-10-50-04-00`, while repo-local `.agent` state had advanced to `2026-07-09T11-46-08-04-00`.

## Publish repositories observed

```txt
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central latest 2026-07-09T10-10-32-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central latest 2026-07-09T11-30-50-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central latest 2026-07-09T09-36-24-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central latest 2026-07-09T10-29-02-04-00
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central-ledger fallback / repo-local state ahead of central tracking
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central latest 2026-07-09T10-40-00-04-00
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central latest 2026-07-09T09-50-00-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central latest 2026-07-09T11-39-50-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central latest 2026-07-09T11-00-39-04-00
```

## Current interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> load Three.js from jsDelivr
  -> load Rapier from jsDelivr
  -> load rapier-physics-domain-kit from NexusRealtime-ProtoKits CDN
  -> create DOM shell, Start button, status panel, Three scene, camera, renderer, terrain, raptor, rocks, trees, shards
  -> menu waits for Start / Enter / Space
  -> keyboard input mutates app.input
  -> game loop mutates runner speed, yaw, jump, x/z, distance, terrain height, chunks, colliders, pickups, scene, and score inline
  -> baseline runtime-terrain-v6 camera/HUD/raptor/render pass runs
  -> src/game.js presentation pass styles HUD, applies readable stride, applies close camera, rewrites HUD, and renders a second frame
  -> PrehistoricRushHost.getState() returns scene, runner, physics, terrain count, and renderer string
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
camera-preset-domain
hud-preset-domain
presentation-pass-domain
three-render-host-domain
rapier-physics-bridge-domain
terrain-streaming-domain
terrain-height-sampling-domain
spawn-population-domain
runner-motion-domain
runner-input-domain
runner-contact-domain
pickup-collection-domain
scene-dispatch-domain
score-state-domain
host-readback-domain
presentation-event-ledger-domain
presentation-frame-record-domain
presentation-fixture-target-domain
central-ledger-sync-domain
```

## Services offered by kits

```txt
createEventBus: event registration, event emit, recent history snapshot
createDomainHost: idempotent install, domain lookup, tick dispatch, domain snapshot
createTickScheduler: frame-backed host tick scaffold
createDinoFormDomainKit: source descriptor for dino form
createDinoPoseDomainKit: runner.moved consumer, pose calculator, dino.pose.changed emitter
createDinoMaterialDomainKit: material descriptor for dino visual surface
createDinoDomainBundle: bundled dino domain descriptor surface
createCameraDomainKit: close third-person camera preset descriptor
createHudDomainKit: readability HUD descriptor and projection helper
rapier-physics-domain-kit: external Rapier bridge, kinematic actor registration, collider contacts, snapshot
globalThis.PrehistoricRushComposition.snapshot: composition/domain/event/scheduler readback
runtime-terrain-v6 inline loop: state mutation, terrain streaming, spawn population, collision, pickups, scene routing, baseline render
src/game.js presentation pass: secondary camera/HUD/stride/render readability pass
globalThis.PrehistoricRushHost.getState: scene, runner, physics, terrain, and renderer readback
```

## Kits identified

### Implemented repo-local kits

```txt
src/domain-runtime/event-bus.js
src/domain-runtime/domain-host.js
src/domain-runtime/tick-scheduler.js
src/domains/dino/dino-form-domain-kit.js
src/domains/dino/dino-pose-domain-kit.js
src/domains/dino/dino-material-domain-kit.js
src/domains/dino/index.js
src/domains/camera/camera-domain-kit.js
src/domains/hud/hud-domain-kit.js
```

### Live external kit

```txt
rapier-physics-domain-kit from LuminaryLabs-Agents/NexusRealtime-ProtoKits@main CDN
```

### Runtime-implied kits still inline

```txt
prehistoric-static-shell-kit
prehistoric-runtime-entry-kit
prehistoric-legacy-visual-runtime-kit
runner-input-kit
runner-motion-kit
runner-terrain-stream-kit
runner-spawn-population-kit
runner-contact-kit
runner-pickup-kit
runner-scene-dispatch-kit
runner-score-kit
raptor-render-adapter-kit
presentation-camera-consumer-kit
presentation-hud-consumer-kit
presentation-raptor-stride-consumer-kit
render-readback-kit
host-state-projection-kit
```

### Next-cut kits

```txt
runner-source-state-kit
runner-step-delta-kit
runner-moved-event-kit
presentation-events-kit
dino-pose-frame-kit
camera-frame-request-kit
hud-frame-request-kit
contact-result-snapshot-kit
scene-dispatch-result-kit
render-readback-kit
presentation-frame-record-kit
presentation-journal-kit
host-presentation-snapshot-kit
central-ledger-readback-kit
dom-free-presentation-fixture-kit
```

## Findings

The runner is playable and already has the right repo-local composition scaffold for a gradual DSK cutover.

The blocker is not rendering fidelity. The blocker is proof continuity: `dino-pose-domain-kit` is ready to consume `runner.moved`, but the live route never emits that event from the runtime state loop. The visual runtime mutates state and scene directly, and the presentation pass reads mutable state after the fact.

## Next safe ledge

```txt
PrehistoricRush Host Presentation Readback Central Catch-up + DOM-Free Fixture Gate
```

## Files updated in this pass

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-09T12-00-36-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-09T12-00-36-04-00.md
.agent/architecture-audit/2026-07-09T12-00-36-04-00-host-presentation-readback-central-catchup-dsk-map.md
.agent/render-audit/2026-07-09T12-00-36-04-00-render-readback-frame-consumption-map.md
.agent/gameplay-audit/2026-07-09T12-00-36-04-00-runner-event-pose-proof-loop.md
.agent/presentation-authority-audit/2026-07-09T12-00-36-04-00-host-presentation-snapshot-readback-contract.md
.agent/deploy-audit/2026-07-09T12-00-36-04-00-dom-free-fixture-central-ledger-gate.md
```

## Validation

```txt
runtime source changed: no
local checkout: no
npm validation: no
browser smoke: no
fixture run: no
branch created: no
write target: main
```
