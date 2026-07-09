# PrehistoricRush Project Breakdown Tracker

**Timestamp:** `2026-07-08T21-50-56-04-00`

## Goal

Compare the current `LuminaryLabs-Publish` org repo list against the central `LuminaryLabs-Dev/LuminaryLabs` ledger, select one eligible repo, update its root `.agent` docs, identify its loop/domains/services/kits, and log the result centrally.

## Checklist

- [x] Compared accessible `LuminaryLabs-Publish` repositories.
- [x] Compared against `LuminaryLabs-Dev/LuminaryLabs` central repo ledger.
- [x] Excluded `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Selected one repo only: `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Read repo metadata and root `.agent` state.
- [x] Read `README.md`, `src/game.js`, and `src/runtime-terrain-v6.mjs` anchors.
- [x] Identified interaction loop.
- [x] Identified domains in use.
- [x] Identified services that kits offer.
- [x] Identified implemented, implied, and next-cut kits.
- [x] Updated required root `.agent` docs.
- [x] Added timestamped architecture audit.
- [x] Added timestamped render audit.
- [x] Added timestamped gameplay audit.
- [x] Added timestamped presentation-authority audit.
- [x] Added timestamped deploy audit.
- [x] Added timestamped turn-ledger entry.
- [x] Updated central repo ledger.
- [x] Added central internal change log.
- [x] Pushed only to `main`.

## Publish repo comparison

```txt
LuminaryLabs-Publish/IntoTheMeadow       tracked / root .agent present / central alignment 2026-07-08T20-21-59-04-00
LuminaryLabs-Publish/HorrorCorridor      tracked / root .agent present / central alignment 2026-07-08T20-38-28-04-00
LuminaryLabs-Publish/AetherVale          tracked / root .agent present / central alignment 2026-07-08T21-31-35-04-00
LuminaryLabs-Publish/ZombieOrchard       tracked / root .agent present / central alignment 2026-07-08T21-18-39-04-00
LuminaryLabs-Publish/TheUnmappedHouse    tracked / root .agent present / central alignment 2026-07-08T21-00-12-04-00
LuminaryLabs-Publish/MyCozyIsland        tracked / root .agent present / central alignment 2026-07-08T19-50-20-04-00
LuminaryLabs-Publish/TheOpenAbove        tracked / root .agent present / central alignment 2026-07-08T20-10-32-04-00
LuminaryLabs-Publish/PhantomCommand      tracked / root .agent present / central alignment 2026-07-08T20-52-00-04-00
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/PrehistoricRush     selected / central catch-up + source-projection seam unresolved
```

## Selection reason

No checked non-Cavalry repo was fully new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`PrehistoricRush` was selected because central tracking was behind repo-local `.agent` state and the source-projection / host-readback fixture seam remains unresolved.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js composition scaffold
  -> event bus / domain host / scheduler
  -> dino, camera, and HUD kits install
  -> live runtime-terrain-v6 visual route starts
  -> menu waits for start
  -> runner input mutates app.state
  -> terrain, hazards, pickups, scene, raptor rig, camera, and HUD mutate inline
  -> presentation pass applies camera/HUD/stride readability overrides
  -> PrehistoricRushHost.getState() exposes a runtime snapshot
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
scene-transition-authority
runner-motion-policy
runner-source-state-contract
runner-step-delta-contract
runner-moved-event-contract
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
hazard-contact-detection
pickup-contact-detection
distance-goal-detection
raptor-visual-rig
raptor-pose-animation
dino-pose-event-bridge
camera-frame-request-contract
hud-frame-request-contract
contact-result-contract
scene-dispatch-result-contract
presentation-frame-contract
presentation-journal-contract
render-readback-contract
host-presentation-snapshot
fixture-replay-contract
```

## Services

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
createHudDomainKit
hudDomain.render
hudDomain.getDescriptor
styleHud
renderHud
applyCloseCamera
applyReadableStride
startPresentationPass
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit services
```

## Kits

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

Runtime-implied kits:

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
prehistoric-rush-runner-step-delta-kit
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

## Files changed in repo

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-08T21-50-56-04-00-presentation-source-projection-dsk-map.md
.agent/render-audit/2026-07-08T21-50-56-04-00-render-readback-consumer-host-map.md
.agent/gameplay-audit/2026-07-08T21-50-56-04-00-runner-event-contact-scene-loop.md
.agent/presentation-authority-audit/2026-07-08T21-50-56-04-00-source-projection-fixture-contract.md
.agent/deploy-audit/2026-07-08T21-50-56-04-00-static-fixture-validation-map.md
.agent/trackers/2026-07-08T21-50-56-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T21-50-56-04-00.md
```

## Central files changed

```txt
LuminaryLabs-Dev/LuminaryLabs:repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
LuminaryLabs-Dev/LuminaryLabs:internal-change-log/2026-07-08T21-50-56-04-00-prehistoric-rush-source-projection-host-readback.md
```

## Main finding

The repo is playable and visually active, but live behavior is still direct mutable app state plus direct presentation mutation. The DSK scaffold already has a natural first consumer: `dino-pose-domain-kit` is ready to consume `runner.moved`, but the live route does not emit the event yet.

## Next safe ledge

```txt
PrehistoricRush Presentation Source Projection + Host Readback Fixture Gate
```
