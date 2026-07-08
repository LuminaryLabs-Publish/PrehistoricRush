# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-08T16-51-11-04-00`

## Goal

Refresh internal docs for one eligible `LuminaryLabs-Publish` repo, keep work scoped to one project, push findings to root `.agent/`, and update the central `LuminaryLabs-Dev/LuminaryLabs` ledger.

## Checklist

- [x] Looked through accessible `LuminaryLabs-Publish` repo list.
- [x] Compared the list against `LuminaryLabs-Dev/LuminaryLabs` repo ledger state.
- [x] Excluded `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Selected one repo only: `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Read repo-local `.agent/START_HERE.md`.
- [x] Read repo-local `.agent/current-audit.md`.
- [x] Read repo-local `.agent/known-gaps.md`.
- [x] Read repo-local `.agent/next-steps.md`.
- [x] Read repo-local `.agent/validation.md`.
- [x] Read repo-local `.agent/kit-registry.json`.
- [x] Read `src/game.js`.
- [x] Read `src/runtime-terrain-v6.mjs` source anchors.
- [x] Read `src/domain-runtime/event-bus.js`.
- [x] Read `src/domain-runtime/domain-host.js`.
- [x] Read `src/domains/dino/dino-pose-domain-kit.js`.
- [x] Identified interaction loop.
- [x] Identified domains in use.
- [x] Identified kit services.
- [x] Identified implemented, external, implied, and next-cut kits.
- [x] Added timestamped architecture audit.
- [x] Added timestamped render audit.
- [x] Added timestamped gameplay audit.
- [x] Added timestamped presentation-authority audit.
- [x] Added timestamped tracker entry.
- [x] Added timestamped turn-ledger entry.
- [x] Updated root `.agent` files.
- [x] Updated central repo ledger.
- [x] Added central internal change log.
- [x] Pushed only to `main`.

## Publish repo comparison

```txt
LuminaryLabs-Publish/AetherVale          tracked / root .agent present / latest sampled central update 2026-07-08T15-20-41-04-00
LuminaryLabs-Publish/HorrorCorridor      tracked / root .agent present / latest sampled central review 2026-07-08T15-39-43-04-00
LuminaryLabs-Publish/IntoTheMeadow       tracked / root .agent present / latest sampled central update 2026-07-08T15-28-13-04-00
LuminaryLabs-Publish/MyCozyIsland        tracked / root .agent present / latest sampled central update 2026-07-08T14-58-49-04-00
LuminaryLabs-Publish/PhantomCommand      tracked / root .agent present / latest sampled central update 2026-07-08T15-58-59-04-00
LuminaryLabs-Publish/PrehistoricRush     selected / root .agent newer than central ledger / source-to-host fixture seam unresolved
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/TheOpenAbove        tracked / root .agent present / latest sampled central update 2026-07-08T15-11-18-04-00
LuminaryLabs-Publish/TheUnmappedHouse    tracked / root .agent present / latest sampled central review 2026-07-08T16-19-57-04-00
LuminaryLabs-Publish/ZombieOrchard       tracked / root .agent present / latest sampled central update 2026-07-08T16-20-00-04-00
```

## Selection reason

No checked non-Cavalry repo was fully new, absent from the ledger, missing root `.agent` state, or otherwise undocumented.

`PrehistoricRush` was selected because its repo-local `.agent` state had advanced to `2026-07-08T16-40-56-04-00`, while the central ledger still pointed at `2026-07-08T14:51:11-04:00`. It also still has the highest-value unresolved presentation seam: host-readable source, contact, scene, camera, HUD, dino, render, and presentation records.

## Interaction loop

```txt
page load
  -> src/runtime.mjs imports src/game.js
  -> src/game.js installs event bus, domain host, scheduler, dino, camera, and HUD domains
  -> composition.ready is emitted
  -> runtime-terrain-v6.mjs imports Three.js, Rapier, and rapier-physics-domain-kit
  -> player starts run from menu
  -> keyboard/button input mutates turn, jump, boost, speed, distance, pickups, hazards, and scene state
  -> terrain chunks, raptor rig, hazards, pickups, camera, and HUD update
  -> src/game.js presentation pass mutates readable stride, close camera, HUD DOM, and renderer frame
  -> PrehistoricRushHost.getState() exposes runtime snapshots
```

## Domains in use

```txt
static-browser-shell, module-runtime-entry, composition-bootstrap, event-bus-history, domain-host-installation, domain-idempotency, tick-scheduler-scaffold, dino-entity-domain, dino-form-domain, dino-pose-domain, dino-material-domain, dino-domain-bundle, camera-domain, hud-domain, legacy-visual-runtime-bridge, cdn-dependency-loading, three-render-runtime, rapier-physics-runtime, rapier-physics-domain-kit-bridge, dom-mount-ownership, keyboard-input-adapter, button-input-adapter, scene-transition-authority, runner-motion-policy, turn-steering-policy, jump-policy, boost-policy, speed-ramp-policy, distance-score-policy, procedural-terrain-rendering, terrain-height-sampling, terrain-chunk-streaming, procedural-scatter-placement, collider-descriptor-generation, pickup-descriptor-generation, hazard-contact-detection, pickup-contact-detection, distance-goal-detection, raptor-visual-rig, raptor-pose-animation, camera-follow-policy, hud-telemetry-projection, presentation-pass-authority, runner-source-state-contract, runner-moved-event-contract, dino-pose-event-bridge, dino-pose-frame-contract, camera-frame-request-contract, hud-frame-request-contract, contact-result-contract, scene-dispatch-result-contract, render-readback-contract, host-presentation-snapshot, fixture-replay-contract
```

## Services

```txt
createEventBus/on/emit/snapshot
createDomainHost/install/get/tick/snapshot
createTickScheduler/start/stop/snapshot
createDinoFormDomainKit descriptor/snapshot
createDinoPoseDomainKit update/getDescriptor/snapshot/runner.moved listener/dino.pose.changed emitter
createDinoMaterialDomainKit descriptor/snapshot
createCameraDomainKit getDescriptor/snapshot
createHudDomainKit render/getDescriptor/snapshot
styleHud
renderHud
applyCloseCamera
applyReadableStride
startPresentationPass
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit live bridge services
```

## Kits

Implemented repo-local:

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

Live external:

```txt
rapier-physics-domain-kit
```

Next-cut:

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

## Files added or updated

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-08T16-51-11-04-00-host-presentation-source-dsk-breakdown.md
.agent/render-audit/2026-07-08T16-51-11-04-00-render-readback-host-projection-map.md
.agent/gameplay-audit/2026-07-08T16-51-11-04-00-runner-contact-scene-fixture-loop.md
.agent/presentation-authority-audit/2026-07-08T16-51-11-04-00-source-to-host-fixture-contract.md
.agent/trackers/2026-07-08T16-51-11-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T16-51-11-04-00.md
```

Central files:

```txt
LuminaryLabs-Dev/LuminaryLabs:repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
LuminaryLabs-Dev/LuminaryLabs:internal-change-log/2026-07-08T16-51-11-04-00-prehistoric-rush-source-to-host-fixture-contract.md
```

## Next safe ledge

```txt
PrehistoricRush Source-to-Host Presentation Fixture Contract
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
local package scripts assumed: no
browser smoke: no
connector read/write validation: yes
pushed to main: yes
```
