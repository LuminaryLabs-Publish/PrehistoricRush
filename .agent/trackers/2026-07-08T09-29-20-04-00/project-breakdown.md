# Project Breakdown — PrehistoricRush

**Timestamp:** `2026-07-08T09:29:20-04:00`

## Plan Ledger

**Goal:** Compare the full accessible `LuminaryLabs-Publish` repo list against central tracking, select one eligible repo, update repo-local `.agent` docs, and log the result centrally.

**Checklist:**

- [x] Used `LuminaryLabs-Publish` repo list search.
- [x] Compared checked Publish repos against `LuminaryLabs-Dev/LuminaryLabs` repo-ledger/latest-summary state.
- [x] Excluded `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Selected one repo only: `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Refreshed root `.agent` operating docs.
- [x] Added timestamped architecture audit.
- [x] Added timestamped render audit.
- [x] Added timestamped presentation-authority source wire map.
- [x] Added timestamped tracker entry.
- [x] Added timestamped turn-ledger entry.
- [x] Updated repo-local kit registry.
- [x] Updated central repo ledger.
- [x] Added central internal change-log entry.
- [ ] Did not edit runtime source files.
- [ ] Did not run browser validation.
- [ ] Did not run local fixture validation.

## Repo selection

```txt
selected repo: LuminaryLabs-Publish/PrehistoricRush
excluded repo: LuminaryLabs-Publish/TheCavalryOfRome
selection mode: fallback oldest/high-value follow-up after no new/missing/root-agent-missing repo was found
```

## Publish repo comparison

```txt
LuminaryLabs-Publish/AetherVale          tracked; root .agent observed
LuminaryLabs-Publish/HorrorCorridor      tracked; root .agent observed
LuminaryLabs-Publish/IntoTheMeadow       tracked; root .agent observed
LuminaryLabs-Publish/MyCozyIsland        tracked; root .agent observed
LuminaryLabs-Publish/PhantomCommand      tracked; root .agent observed
LuminaryLabs-Publish/PrehistoricRush     selected follow-up: presentation source wire map
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/TheOpenAbove        tracked; root .agent observed
LuminaryLabs-Publish/TheUnmappedHouse    tracked; root .agent observed; stale rollup gap already closed
LuminaryLabs-Publish/ZombieOrchard       tracked; root .agent observed
```

## Current product read

`PrehistoricRush` is a standalone static browser infinite runner.

The product route is thin at the page edge but still has a legacy live runtime underneath:

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> repo-local event bus / domain host / scheduler
  -> dino, camera, and HUD domain kits
  -> PrehistoricRushComposition.snapshot()
  -> src/runtime-terrain-v6.mjs
  -> Three.js + Rapier visual runner
  -> PrehistoricRushHost.getState()
```

## Interaction loop

```txt
page loads
  -> composition installs dino/camera/HUD domain scaffold
  -> legacy terrain runner initializes menu scene
  -> player starts game
  -> keyboard/button input mutates live runner state
  -> terrain chunks, props, hazards, pickups, physics, and scene state update inline
  -> presentation pass reads PrehistoricRushHost.app
  -> camera, HUD, raptor stride, and renderer frame mutate directly
  -> host exposes snapshots
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
dom-mount-ownership
keyboard-input-adapter
button-input-adapter
scene-file-authority
scene-transition-authority
runner-motion-policy
lane-shift-policy
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
presentation-frame-contract
presentation-descriptor-journal
host-diagnostics
repo-local-agent-state
central-ledger-readback
```

## Services in use

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

Needed next:

```txt
snapshotRunnerSourceState
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

Current repo-local kits:

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

Current external kit:

```txt
rapier-physics-domain-kit
```

Target / candidate kits:

```txt
createCoreSkyboxKit
createCoreSceneKit
createCoreInputKit
createCoreMotionKit
createCoreCameraKit
createCoreGraphicsKit
createCoreAnimationKit
createCoreUIKit
createCoreDiagnosticsKit
createCoreCompositionKit
run-movement-kit
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-moved-event-kit
prehistoric-rush-dino-domain-bridge-kit
prehistoric-rush-dino-pose-frame-kit
prehistoric-rush-camera-frame-descriptor-kit
prehistoric-rush-hud-frame-descriptor-kit
prehistoric-rush-presentation-frame-contract-kit
prehistoric-rush-presentation-descriptor-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-action-result-journal-kit
prehistoric-rush-runner-step-result-kit
prehistoric-rush-runner-event-journal-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-replay-parity-smoke-kit
prehistoric-rush-runtime-source-bundle-kit
prehistoric-rush-manifest-load-status-kit
prehistoric-rush-run-movement-promotion-report-kit
```

## Main finding

The repo has enough domain scaffolding to become DSK-readable, but the current presentation frame still depends on direct state reads and renderer/DOM mutation.

The next source pass should not start by changing visuals. It should add a source wire map and fixture-readable presentation contract around the existing behavior.

## Files changed in `LuminaryLabs-Publish/PrehistoricRush`

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-08T09-29-20-04-00-dsk-domain-breakdown.md
.agent/render-audit/2026-07-08T09-29-20-04-00-render-presentation-readback.md
.agent/presentation-authority-audit/2026-07-08T09-29-20-04-00-source-wire-map.md
.agent/trackers/2026-07-08T09-29-20-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T09-29-20-04-00.md
```

## Files changed in `LuminaryLabs-Dev/LuminaryLabs`

```txt
repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
internal-change-log/2026-07-08T09-29-20-04-00-prehistoric-rush-presentation-source-wire-map.md
```

## Next safe ledge

```txt
PrehistoricRush Presentation Source Wire Map + Frame Contract Fixture Gate
```

Implementation should stop when this chain is fixture-readable:

```txt
RunnerSourceState
  -> RunnerMovedEvent
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> PresentationFrameRecord
  -> PrehistoricRushHost.getState().presentation
```

## Validation

Docs-only update.

No runtime source files were changed.

No local checkout, static server, browser route, WebGL runtime, Rapier runtime, or fixture script was run.
