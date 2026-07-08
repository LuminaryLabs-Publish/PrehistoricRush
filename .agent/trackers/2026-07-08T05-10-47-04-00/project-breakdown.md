# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T05:10:47-04:00`

**Selection result:** follow-up selected from the checked `LuminaryLabs-Publish` repo set after excluding `LuminaryLabs-Publish/TheCavalryOfRome`.

## Selection comparison

```txt
LuminaryLabs-Publish/IntoTheMeadow       ledgered with root .agent
LuminaryLabs-Publish/HorrorCorridor      ledgered with root .agent
LuminaryLabs-Publish/AetherVale          ledgered with root .agent
LuminaryLabs-Publish/ZombieOrchard       ledgered with root .agent
LuminaryLabs-Publish/TheUnmappedHouse    ledgered with root .agent
LuminaryLabs-Publish/MyCozyIsland        ledgered with root .agent
LuminaryLabs-Publish/TheOpenAbove        ledgered with root .agent
LuminaryLabs-Publish/PhantomCommand      ledgered with root .agent
LuminaryLabs-Publish/TheCavalryOfRome    excluded by standing rule
LuminaryLabs-Publish/PrehistoricRush     selected follow-up: runner authority still unresolved
```

No checked non-excluded Publish repo was found that was fully new, absent from the central ledger, or missing root `.agent/START_HERE.md` state.

`PrehistoricRush` was selected because it still has a clean repo-local domain scaffold, but the live runner loop remains concentrated in `src/runtime-terrain-v6.mjs`.

## Source-backed current route

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, pose, and material domain kits
  -> expose globalThis.PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> await import("./runtime-terrain-v6.mjs")
  -> Three.js + Rapier + rapier-physics-domain-kit runner route
```

## Interaction loop

```txt
page load
  -> static app shell mounts
  -> module runtime imports game composition
  -> repo-local domain host installs dino descriptors
  -> legacy visual runner initializes Three.js and Rapier
  -> player starts from menu
  -> keyboard/button input mutates live runner state
  -> lane, jump, boost, speed, distance, terrain, scatter, hazard, pickup, and win state update inline
  -> Rapier bridge steps actor/colliders
  -> raptor visual rig, HUD, camera, terrain chunks, props, and flock render
  -> PrehistoricRushComposition.snapshot() and PrehistoricRushHost.getState() provide diagnostics
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
legacy-visual-runtime-bridge
cdn-dependency-loading
three-render-runtime
rapier-physics-runtime
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
terrain-height-sampling
terrain-chunk-streaming
scatter-placement
hazard-contact-detection
pickup-contact-detection
win-condition-detection
raptor-visual-rig
raptor-pose-animation
camera-follow-policy
hud-telemetry-projection
host-diagnostics
```

## Kit services identified

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
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit import/load/install services
```

Needed next services:

```txt
createActionFrame
classifyActionAcceptance
appendActionResult
snapshotRunnerSourceState
reduceRunnerStep
emitRunnerMoved
bridgeRunnerMovedToDinoPose
snapshotContactResult
appendSceneDispatchResult
appendRunnerJournal
readReplayJournal
runActionFixtureSmoke
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
```

Current external live kit:

```txt
rapier-physics-domain-kit
```

Next repo-local extraction candidates:

```txt
prehistoric-rush-action-frame-contract-kit
prehistoric-rush-action-acceptance-matrix-kit
prehistoric-rush-action-result-journal-kit
prehistoric-rush-runner-source-state-kit
prehistoric-rush-runner-step-result-kit
prehistoric-rush-runner-event-journal-kit
prehistoric-rush-dino-domain-bridge-kit
prehistoric-rush-contact-result-snapshot-kit
prehistoric-rush-scene-dispatch-result-kit
prehistoric-rush-replay-parity-smoke-kit
prehistoric-rush-run-movement-promotion-report-kit
```

## Main finding

`PrehistoricRush` should not receive more visual polish until the runner authority seam is testable.

The highest-leverage next cut is to wrap the current live behavior in stable action/result records, runner step results, contact snapshots, and scene dispatch results while preserving the current visible route.

## Next safe ledge

```txt
PrehistoricRush Runner Action/Result Authority + Dino Pose Bridge Fixture Gate
```

Stop when start, retry, menu, lane move, boost, jump, hazard, pickup, run-over, and win paths can be replayed into a stable journal without depending on DOM or renderer frame timing.

## Validation status

No runtime source files changed.

No browser, local server, package, Rapier, Three.js, or Playwright validation was run in this documentation pass.
