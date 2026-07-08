# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-08T19-30-31-04-00`

## Goal

Compare the full accessible `LuminaryLabs-Publish` repo list against central tracking, select one eligible repo, refresh repo-local `.agent` docs, and log the result in `LuminaryLabs-Dev/LuminaryLabs`.

## Checklist

- [x] Read accessible `LuminaryLabs-Publish` repo list.
- [x] Compared Publish repos against central `LuminaryLabs-Dev/LuminaryLabs` ledger state.
- [x] Excluded `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Selected one repo: `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Read repo-local `.agent` state.
- [x] Read README and route/source anchors.
- [x] Identified interaction loop.
- [x] Identified domains in use.
- [x] Identified services offered by kits.
- [x] Identified implemented, external, runtime-implied, and next-cut kits.
- [x] Updated root `.agent` docs.
- [x] Added timestamped architecture audit.
- [x] Added timestamped render audit.
- [x] Added timestamped gameplay audit.
- [x] Added timestamped presentation authority audit.
- [x] Added timestamped deploy audit.
- [x] Added timestamped turn-ledger entry.
- [x] Updated repo-local kit registry.
- [x] Updated central repo ledger.
- [x] Added central internal change-log entry.
- [ ] Runtime source was not changed.
- [ ] Local npm/build/browser validation was not run.

## Publish repo comparison

```txt
LuminaryLabs-Publish/HorrorCorridor      tracked / root .agent present / sampled alignment 2026-07-08T18-19-43-04-00
LuminaryLabs-Publish/AetherVale          tracked / root .agent present / sampled alignment 2026-07-08T18-58-10-04-00
LuminaryLabs-Publish/TheOpenAbove        tracked / root .agent present / sampled alignment 2026-07-08T17-31-22-04-00
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/PhantomCommand      tracked / root .agent present / sampled alignment 2026-07-08T18-41-41-04-00
LuminaryLabs-Publish/PrehistoricRush     selected / oldest eligible fallback / previous alignment 2026-07-08T16-51-11-04-00
LuminaryLabs-Publish/ZombieOrchard       tracked / root .agent present / sampled alignment 2026-07-08T19-21-15-04-00
LuminaryLabs-Publish/IntoTheMeadow       tracked / root .agent present / sampled alignment 2026-07-08T18-09-21-04-00
LuminaryLabs-Publish/MyCozyIsland        tracked / root .agent present / sampled alignment 2026-07-08T17-09-48-04-00
LuminaryLabs-Publish/TheUnmappedHouse    tracked / root .agent present / sampled alignment 2026-07-08T18-51-55-04-00
```

## Selection reason

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, missing root `.agent`, or otherwise undocumented.

`PrehistoricRush` was selected as the oldest eligible fallback and because its presentation authority proof remains unresolved.

## Current product read

`PrehistoricRush` is a static browser infinite runner.

It has a repo-local DSK composition scaffold in `src/game.js`, but its live route still runs through `src/runtime-terrain-v6.mjs` with direct app state mutation, direct presentation mutation, and direct host projection.

## Current route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> event bus / domain host / tick scheduler
  -> dino form, pose, and material domains
  -> camera-domain-kit
  -> hud-domain-kit
  -> PrehistoricRushComposition.snapshot()
  -> src/runtime-terrain-v6.mjs
  -> Three.js + Rapier + rapier-physics-domain-kit CDN imports
  -> terrain runner loop
  -> src/game.js presentation pass
  -> PrehistoricRushHost.getState()
```

## Interaction loop

```txt
page load
  -> composition installs dino, camera, and HUD domain scaffold
  -> legacy visual runner loads menu scene
  -> player starts game
  -> keyboard/button input drives turn, jump, and boost behavior
  -> runtime-terrain-v6.mjs mutates movement, terrain, contacts, pickups, scene state, and baseline renderer frame
  -> src/game.js presentation pass mutates close camera, readable stride, HUD DOM, and renderer frame
  -> host exposes runtime snapshots
```

## Target proof loop

```txt
app.state + previous frame snapshot
  -> RunnerSourceState
  -> RunnerStepDelta
  -> RunnerMovedEvent
  -> runner.moved eventBus emission
  -> dino-pose-domain-kit update
  -> dino.pose.changed event readback
  -> DinoPoseFrame
  -> CameraFrameRequest
  -> HudFrameRequest
  -> ContactResultSnapshot
  -> SceneDispatchResult
  -> RenderReadback
  -> PresentationFrameRecord
  -> bounded PresentationJournalSnapshot
  -> PrehistoricRushHost.getState().presentation
  -> DOM-free presentation fixture
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
runner-step-delta-contract
turn-steering-policy
jump-policy
boost-policy
speed-ramp-policy
distance-score-policy
terrain-height-sampling
terrain-chunk-streaming
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
render-readback-contract
host-presentation-snapshot
fixture-replay-contract
```

## Services in use

```txt
createEventBus / on / emit / snapshot
createDomainHost / install / get / tick / snapshot
createTickScheduler / start / stop / snapshot
createDinoFormDomainKit
createDinoPoseDomainKit / runner.moved listener / dino.pose.changed emitter / getDescriptor / snapshot
createDinoMaterialDomainKit
createDinoDomainBundle
createCameraDomainKit / getDescriptor / snapshot
createHudDomainKit / render / getDescriptor / snapshot
styleHud
renderHud
applyCloseCamera
applyReadableStride
startPresentationPass
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit live bridge services
```

Needed next services:

```txt
snapshotRunnerSourceState
createRunnerStepDelta
createRunnerMovedEvent
emitRunnerMoved
readLatestDinoPoseChangedEvent
createDinoPoseFrame
createCameraFrameRequest
createHudFrameRequest
createContactResultSnapshot
createSceneDispatchResult
createRenderReadback
createPresentationFrameRecord
appendPresentationJournalEntry
projectHostPresentationSnapshot
runPresentationFrameFixture
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

External live kit:

```txt
rapier-physics-domain-kit
```

Runtime-implied product kits:

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

## Files changed in PrehistoricRush

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-08T19-30-31-04-00-presentation-authority-consumer-dsk-map.md
.agent/render-audit/2026-07-08T19-30-31-04-00-render-readback-consumer-fixture-map.md
.agent/gameplay-audit/2026-07-08T19-30-31-04-00-runner-step-contact-scene-loop.md
.agent/presentation-authority-audit/2026-07-08T19-30-31-04-00-consumer-fixture-acceptance-map.md
.agent/deploy-audit/2026-07-08T19-30-31-04-00-static-fixture-validation-without-package-json.md
.agent/trackers/2026-07-08T19-30-31-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T19-30-31-04-00.md
```

## Main finding

The existing `dino-pose-domain-kit` already has the right consumer seam: it listens for `runner.moved` and emits `dino.pose.changed`. The live route simply does not emit that event yet, so the next source pass should start by adding source-state and movement-event projection rather than rewriting the raptor animation.

## Next safe ledge

```txt
PrehistoricRush Presentation Authority Consumer Fixture Gate
```

## Validation status

```txt
runtime source changed: no
branch created: no
pull request created: no
local npm test: no
local browser smoke: no
fixture run: no
pushed to main: yes
```
