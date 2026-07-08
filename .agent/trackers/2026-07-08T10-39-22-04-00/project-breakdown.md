# Project Breakdown: PrehistoricRush

**Timestamp:** `2026-07-08T10:39:22-04:00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Plan ledger

**Goal:** Compare the full `LuminaryLabs-Publish` repo list against central tracking, select one eligible repo, refresh repo-local `.agent` docs, identify its interaction loop/domains/services/kits, and log the central `LuminaryLabs-Dev/LuminaryLabs` change.

**Checklist**

- [x] Checked accessible `LuminaryLabs-Publish` repo list.
- [x] Compared against central repo ledger and latest summary context.
- [x] Excluded `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Selected one repo only: `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Read repo-local `.agent` state.
- [x] Read README and runtime source.
- [x] Read domain runtime, dino pose, camera, and HUD kits.
- [x] Identified interaction loop.
- [x] Identified domains in use.
- [x] Identified services.
- [x] Identified kits.
- [x] Updated root `.agent` docs.
- [x] Added timestamped architecture audit.
- [x] Added timestamped render audit.
- [x] Added timestamped presentation authority audit.
- [x] Added timestamped tracker entry.
- [x] Added timestamped turn-ledger entry.
- [x] Updated central repo ledger.
- [x] Added central internal change-log entry.

## Repo-list comparison

```txt
AetherVale            tracked; root .agent observed
HorrorCorridor        tracked; root .agent observed
IntoTheMeadow         tracked; root .agent observed
MyCozyIsland          tracked; root .agent observed
PhantomCommand        tracked; root .agent observed
PrehistoricRush       selected fallback follow-up: runner event bridge and presentation frame fixture gate
TheCavalryOfRome      excluded by rule
TheOpenAbove          tracked; root .agent observed
TheUnmappedHouse      tracked; root .agent observed; stale rollup gap closed
ZombieOrchard         tracked; root .agent observed
```

No checked non-Cavalry repo was fully new, central-ledger absent, missing sampled root `.agent/START_HERE.md`, or otherwise undocumented.

`PrehistoricRush` was selected because it has a real local DSK scaffold, but the live route still does not emit fixture-readable runner and presentation events.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> create eventBus / domainHost / tickScheduler
  -> install dino, camera, and HUD domains
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import runtime-terrain-v6.mjs
  -> load Three.js, Rapier, and rapier-physics-domain-kit
  -> mount menu shell
  -> player starts run
  -> input mutates runner state
  -> movement, jump, boost, terrain, contacts, pickups, and scene state mutate inline
  -> presentation pass reads PrehistoricRushHost.app
  -> camera, HUD DOM, dino stride, and render frame are applied directly
  -> PrehistoricRushHost.getState() exposes state
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
camera-domain
hud-domain
legacy-visual-runtime-bridge
cdn-dependency-loading
three-render-runtime
rapier-physics-runtime
keyboard-input-adapter
button-input-adapter
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
camera-frame-request-contract
hud-frame-request-contract
presentation-frame-contract
presentation-descriptor-journal
host-diagnostics
repo-local-agent-state
central-ledger-readback
```

## Services that kits offer

Current services:

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
camera.preset.ready
cameraDomain.getDescriptor
cameraDomain.snapshot
createHudDomainKit
hud.ready
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
rapier-physics-domain-kit services
```

Needed next services:

```txt
snapshotRunnerSourceState
createRunnerMovedEvent
emitRunnerMoved
bridgeRunnerMovedToDinoPose
createDinoPoseFrame
createCameraFrameRequest
createHudFrameRequest
appendPresentationFrameRecord
readHostPresentationSnapshot
runPresentationFrameFixture
createActionFrame
classifyActionAcceptance
appendActionResult
reduceRunnerStep
snapshotContactResult
appendSceneDispatchResult
createRunMovementPromotionReport
```

## Kits identified

Current kits:

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
rapier-physics-domain-kit
```

Target kits:

```txt
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-event-bridge-kit
prehistoric-rush-dino-pose-frame-kit
prehistoric-rush-camera-frame-request-kit
prehistoric-rush-hud-frame-request-kit
prehistoric-rush-presentation-frame-contract-kit
prehistoric-rush-presentation-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-dom-free-presentation-fixture-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-action-result-journal-kit
prehistoric-rush-runner-step-result-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-replay-parity-smoke-kit
prehistoric-rush-run-movement-promotion-report-kit
```

## Files changed in this repo

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-08T10-39-22-04-00-dsk-domain-breakdown.md
.agent/render-audit/2026-07-08T10-39-22-04-00-render-event-readback.md
.agent/presentation-authority-audit/2026-07-08T10-39-22-04-00-event-bridge-fixture-readiness.md
.agent/trackers/2026-07-08T10-39-22-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T10-39-22-04-00.md
```

## Central files changed

```txt
LuminaryLabs-Dev/LuminaryLabs:repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
LuminaryLabs-Dev/LuminaryLabs:internal-change-log/2026-07-08T10-39-22-04-00-prehistoric-rush-event-bridge-fixture-gate.md
```

## Validation

Performed:

```txt
repo-list comparison
central ledger readback
repo-local .agent readback
README readback
src/runtime.mjs readback
src/game.js readback
src/runtime-terrain-v6.mjs readback
domain runtime readback
dino pose domain readback
camera domain readback
HUD domain readback
repo-local .agent documentation update
central repo-ledger update
central internal change-log entry
```

Not performed:

```txt
local checkout
npm install
npm run check
local static server
browser route check
Playwright smoke
live GitHub Pages check
runtime source edit
```

## Next safe ledge

```txt
PrehistoricRush Runner Event Bridge + Presentation Frame Fixture Gate
```

Build additive event and descriptor records beside the current visual route before moving deeper movement, contact, terrain, or scene-dispatch logic into shared kits.
