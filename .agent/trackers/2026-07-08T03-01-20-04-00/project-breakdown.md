# PrehistoricRush Project Breakdown

**Run timestamp:** `2026-07-08T03:01:20-04:00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Selection

Selected `LuminaryLabs-Publish/PrehistoricRush` after comparing the current `LuminaryLabs-Publish` installation list against central tracking state.

The repo was eligible because it was tracked centrally but missing the required root `.agent` operating files in the actual publish repo.

Skipped `LuminaryLabs-Publish/TheCavalryOfRome` by rule.

## Publish repo list observed

```txt
LuminaryLabs-Publish/HorrorCorridor
LuminaryLabs-Publish/AetherVale
LuminaryLabs-Publish/TheOpenAbove
LuminaryLabs-Publish/TheCavalryOfRome
LuminaryLabs-Publish/PhantomCommand
LuminaryLabs-Publish/PrehistoricRush
LuminaryLabs-Publish/ZombieOrchard
LuminaryLabs-Publish/IntoTheMeadow
LuminaryLabs-Publish/MyCozyIsland
LuminaryLabs-Publish/TheUnmappedHouse
```

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus
  -> createDomainHost
  -> createTickScheduler
  -> install dino form, pose, material domains
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import runtime-terrain-v6.mjs
  -> legacy visual runner initializes Three.js/Rapier route
  -> player starts from menu
  -> movement/input/contact/scene state update inline
  -> HUD/camera/raptor/terrain/render frame update
```

## Domains in use

```txt
static-browser-shell
module-runtime-entry
composition-bootstrap
event-bus-history
domain-host-installation
tick-scheduler-scaffold
dino-entity-domain
dino-form-domain
dino-pose-domain
dino-material-domain
legacy-visual-runtime-bridge
cdn-dependency-loading
dom-mount-ownership
keyboard-input-adapter
button-input-adapter
scene-file-authority
scene-transition-authority
runner-motion-policy
jump-policy
boost-policy
hazard-contact-detection
pickup-contact-detection
distance-goal-detection
procedural-terrain-rendering
terrain-chunk-streaming
procedural-scatter-placement
rapier-runtime-bridge
raptor-visual-rig
camera-follow-policy
hud-telemetry-projection
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
PrehistoricRushComposition.snapshot
PrehistoricRushHost.getState
rapier-physics-domain-kit runtime bridge services
```

## Kits identified

Existing repo-local kits:

```txt
domain-runtime/event-bus
domain-runtime/domain-host
domain-runtime/tick-scheduler
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle
```

External live kit:

```txt
rapier-physics-domain-kit
```

Core kits targeted in repo docs:

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
```

First missing ProtoKit:

```txt
run-movement-kit
```

## Files created in this run

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/architecture-audit/domain-service-breakdown.md
.agent/render-audit/runner-render-audit.md
.agent/gameplay-audit/runner-loop-audit.md
.agent/dino-domain-audit/dino-scaffold-bridge.md
.agent/kit-registry.json
.agent/trackers/2026-07-08T03-01-20-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T03-01-20-04-00.md
```

## Current finding

`PrehistoricRush` has a valid route shell and dino-domain scaffold, but the playable runner is still controlled by a legacy visual runtime. The next implementation should extract action/result and runner-step authority while preserving the public route.

## Next safe ledge

Build the runner authority fixture gate and dino pose bridge:

```txt
ActionFrame -> RunnerStepResult -> runner.moved -> dino.pose.changed -> host diagnostics proof
```
