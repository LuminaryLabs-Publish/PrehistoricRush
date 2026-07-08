# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-08T14:51:11-04:00`

## Goal

Refresh repo-local `.agent` documentation for one eligible `LuminaryLabs-Publish` repo, identify the interaction loop, domains, services, and kits, and log the result centrally.

## Checklist

- [x] Listed accessible `LuminaryLabs-Publish` repositories.
- [x] Compared observed Publish repos against `LuminaryLabs-Dev/LuminaryLabs` ledger state.
- [x] Excluded `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Selected one repo: `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Read repo-local `.agent` state.
- [x] Read README and runtime route/source anchors.
- [x] Identified the interaction loop.
- [x] Identified domains in use.
- [x] Identified kit services.
- [x] Identified current, implied, and next-cut kits.
- [x] Added architecture, render, gameplay, and presentation-authority audits.
- [x] Updated required root `.agent` files.
- [x] Updated central ledger and internal change log.
- [x] Pushed everything to `main`.

## Repository selection

```txt
selected: LuminaryLabs-Publish/PrehistoricRush
excluded: LuminaryLabs-Publish/TheCavalryOfRome
reason: no checked non-Cavalry repo was new, missing from the central ledger, undocumented, or missing root .agent state; PrehistoricRush was the oldest eligible fallback needing presentation/event host proof.
```

## Publish repo comparison

```txt
LuminaryLabs-Publish/HorrorCorridor      tracked / root .agent present / latest central review 2026-07-08T13:59:50-04:00
LuminaryLabs-Publish/AetherVale          tracked / root .agent present / latest central update 2026-07-08T13:39:15-04:00
LuminaryLabs-Publish/TheOpenAbove        tracked / root .agent present / latest central update 2026-07-08T13:31:29-04:00
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/PhantomCommand      tracked / root .agent present / latest central update 2026-07-08T14:08:24-04:00
LuminaryLabs-Publish/PrehistoricRush     selected fallback / previous central update 2026-07-08T13:18:13-04:00
LuminaryLabs-Publish/ZombieOrchard       tracked / root .agent present / latest central update 2026-07-08T14:18:45-04:00
LuminaryLabs-Publish/IntoTheMeadow       tracked / root .agent present / latest central update 2026-07-08T13:50:37-04:00
LuminaryLabs-Publish/MyCozyIsland        tracked / root .agent present / repo-local alignment observed 2026-07-08T14:39:38-04:00
LuminaryLabs-Publish/TheUnmappedHouse    tracked / root .agent present / latest central review 2026-07-08T14:31:06-04:00
```

## Source files read

```txt
README.md
src/runtime.mjs
src/game.js
src/runtime-terrain-v6.mjs
src/domain-runtime/event-bus.js
src/domain-runtime/domain-host.js
src/domains/dino/index.js
src/domains/dino/dino-pose-domain-kit.js
src/domains/camera/camera-domain-kit.js
src/domains/hud/hud-domain-kit.js
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
```

## Current interaction loop

```txt
page load
  -> runtime entry imports game composition
  -> composition installs dino, camera, and HUD domain scaffold
  -> legacy visual runner loads menu scene
  -> player starts run
  -> keyboard/button input drives turn, jump, and boost behavior
  -> runtime-terrain-v6.mjs mutates movement, terrain, contacts, pickups, scene state, and baseline renderer frame
  -> src/game.js presentation pass mutates close camera, readable stride, HUD DOM, and renderer frame
  -> PrehistoricRushHost.getState() exposes scene/runner/physics/terrain/renderer
```

## Domains identified

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
```

## Services identified

```txt
createEventBus
eventBus.on
eventBus.emit
eventBus.snapshot
createDomainHost
domainHost.install
domainHost.get
domainHost.tick
domainHost.snapshot
createTickScheduler
scheduler.start
scheduler.stop
scheduler.snapshot
createDinoFormDomainKit
createDinoPoseDomainKit
createDinoMaterialDomainKit
createDinoDomainBundle
createCameraDomainKit
cameraDomain.getDescriptor
cameraDomain.snapshot
createHudDomainKit
hudDomain.render
hudDomain.getDescriptor
hudDomain.snapshot
styleHud
renderHud
applyCloseCamera
applyReadableStride
startPresentationPass
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit configure/register/step/snapshot services
```

## Kits identified

```txt
current explicit kits:
  domain-runtime/event-bus
  domain-runtime/domain-host
  domain-runtime/tick-scheduler
  dino-form-domain-kit
  dino-pose-domain-kit
  dino-material-domain-kit
  dino-domain-bundle
  camera-domain-kit
  hud-domain-kit
  rapier-physics-domain-kit

runtime-implied kits:
  prehistoric-static-shell-kit
  prehistoric-runtime-entry-kit
  prehistoric-legacy-visual-runtime-kit
  prehistoric-raptor-visual-rig-kit
  prehistoric-terrain-streaming-kit
  prehistoric-contact-check-kit
  prehistoric-scene-dispatch-kit
  prehistoric-hud-dom-render-kit
  prehistoric-close-camera-apply-kit

next-cut kits:
  prehistoric-rush-runner-source-state-kit
  prehistoric-rush-runner-moved-event-kit
  prehistoric-rush-dino-event-bridge-kit
  prehistoric-rush-dino-pose-frame-kit
  prehistoric-rush-camera-frame-request-kit
  prehistoric-rush-hud-frame-request-kit
  prehistoric-rush-contact-result-snapshot-kit
  prehistoric-rush-scene-dispatch-result-kit
  prehistoric-rush-presentation-frame-record-kit
  prehistoric-rush-presentation-journal-kit
  prehistoric-rush-host-presentation-snapshot-kit
  prehistoric-rush-render-readback-kit
  prehistoric-rush-dom-free-presentation-fixture-kit
```

## Main finding

`PrehistoricRush` has a useful repo-local DSK scaffold, but the live game still has two separate authorities:

```txt
src/game.js
  -> owns installed dino/camera/HUD domains and direct presentation pass

src/runtime-terrain-v6.mjs
  -> owns movement, collision, pickup, scene dispatch, terrain, Rapier stepping, renderer, and PrehistoricRushHost
```

The next implementation should not redesign visuals. It should add pure presentation/event host records and fixture rows first.

## Files changed in this repo

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-08T14-51-11-04-00-presentation-event-host-dsk-map.md
.agent/render-audit/2026-07-08T14-51-11-04-00-camera-hud-render-readback-wire-map.md
.agent/gameplay-audit/2026-07-08T14-51-11-04-00-contact-scene-result-splice-map.md
.agent/presentation-authority-audit/2026-07-08T14-51-11-04-00-event-host-wire-map.md
.agent/trackers/2026-07-08T14-51-11-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T14-51-11-04-00.md
```

## Central files changed

```txt
LuminaryLabs-Dev/LuminaryLabs:repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
LuminaryLabs-Dev/LuminaryLabs:internal-change-log/2026-07-08T14-51-11-04-00-prehistoric-rush-presentation-event-host-wire-map.md
```

## Validation

```txt
runtime source changed: no
branch created: no
pull request created: no
local package scripts assumed: no
local browser smoke: no
pushed to main: yes
```
