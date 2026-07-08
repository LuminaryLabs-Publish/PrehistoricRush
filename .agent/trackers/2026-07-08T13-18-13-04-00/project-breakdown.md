# Project Breakdown: PrehistoricRush

**Timestamp:** `2026-07-08T13:18:13-04:00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

**Change type:** documentation-only `.agent` breakdown

## Goal

Compare current `LuminaryLabs-Publish` repository state against the central ledger, select one eligible repo, update its internal `.agent` docs, and record the next safe implementation ledge.

## Checklist

- [x] Listed accessible `LuminaryLabs-Publish` repositories.
- [x] Compared checked repositories against `LuminaryLabs-Dev/LuminaryLabs` repo ledger state.
- [x] Excluded `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Selected one repo only: `LuminaryLabs-Publish/PrehistoricRush`.
- [x] Read repo-local `.agent` state.
- [x] Read central ledger state.
- [x] Read `README.md`.
- [x] Read `src/game.js`.
- [x] Read `src/domains/dino/dino-pose-domain-kit.js`.
- [x] Read `src/domains/camera/camera-domain-kit.js`.
- [x] Read `src/domains/hud/hud-domain-kit.js`.
- [x] Read `src/runtime-terrain-v6.mjs`.
- [x] Identified interaction loop.
- [x] Identified domains in use.
- [x] Identified kit services.
- [x] Identified current and next-cut kits.
- [x] Updated required root `.agent` docs.
- [x] Added architecture, render, gameplay, and presentation-authority audits.
- [x] Added timestamped tracker and turn-ledger entries.
- [x] Updated central repo ledger.
- [x] Added central internal change-log entry.
- [ ] Did not run local/browser validation.
- [ ] Did not edit runtime/source implementation files.

## Repo selected

```txt
LuminaryLabs-Publish/PrehistoricRush
```

## Selection reason

```txt
No checked non-Cavalry Publish repo was fully new, absent from tracking, undocumented, or missing sampled root .agent/START_HERE.md state.

PrehistoricRush was selected as the eligible fallback because its live runner still needs source-journal, contact-result, scene-dispatch, and presentation-frame fixture proof before additional runtime work.
```

## Publish repo list observed

```txt
LuminaryLabs-Publish/IntoTheMeadow
LuminaryLabs-Publish/HorrorCorridor
LuminaryLabs-Publish/AetherVale
LuminaryLabs-Publish/ZombieOrchard
LuminaryLabs-Publish/TheUnmappedHouse
LuminaryLabs-Publish/MyCozyIsland
LuminaryLabs-Publish/TheOpenAbove
LuminaryLabs-Publish/PhantomCommand
LuminaryLabs-Publish/TheCavalryOfRome
LuminaryLabs-Publish/PrehistoricRush
```

## Current interaction loop

```txt
page load
  -> src/runtime.mjs
  -> src/game.js composition bootstrap
  -> dino/camera/HUD domain install
  -> composition.ready event
  -> runtime-terrain-v6.mjs live runner load
  -> menu start
  -> game input
  -> runner movement and terrain update
  -> physics/contact/pickup/win checks
  -> scene mutation
  -> raptor/camera/HUD/render mutation
  -> PrehistoricRushHost.getState()
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
host-presentation-snapshot
fixture-replay-contract
host-diagnostics
repo-local-agent-state
central-ledger-readback
```

## Services that the kits offer

```txt
createEventBus: on, emit, snapshot
createDomainHost: install, get, tick, snapshot
createTickScheduler: start, stop, snapshot
createDinoFormDomainKit: install, getDescriptor, snapshot
createDinoPoseDomainKit: install, update, getDescriptor, snapshot, runner.moved listener
createDinoMaterialDomainKit: install, getDescriptor, snapshot
createCameraDomainKit: install, getDescriptor, snapshot
createHudDomainKit: install, render, getDescriptor, snapshot
rapier-physics-domain-kit: configure, registerKinematicActor, setActorTransform, setFixedColliders, step, getSnapshot
PrehistoricRushComposition: snapshot
PrehistoricRushHost: getState
```

## Kits identified

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

## Main finding

The repo has a strong composition scaffold and a playable Three.js/Rapier runner, but the live game is not yet fixture-readable.

The next safe work is not visual polish. It is an additive source journal that captures runner movement, dino pose, camera request, HUD request, contact result, scene dispatch result, and presentation frame records beside the current direct runtime mutations.

## Files changed in `LuminaryLabs-Publish/PrehistoricRush`

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-08T13-18-13-04-00-runner-source-journal-dsk-map.md
.agent/render-audit/2026-07-08T13-18-13-04-00-presentation-frame-readback-contract.md
.agent/gameplay-audit/2026-07-08T13-18-13-04-00-contact-scene-result-loop.md
.agent/presentation-authority-audit/2026-07-08T13-18-13-04-00-runner-source-journal-gate.md
.agent/trackers/2026-07-08T13-18-13-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T13-18-13-04-00.md
```

## Files changed in `LuminaryLabs-Dev/LuminaryLabs`

```txt
repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
internal-change-log/2026-07-08T13-18-13-04-00-prehistoric-rush-runner-source-journal-gate.md
```

## Next safe ledge

```txt
PrehistoricRush Runner Source Journal + Contact/Scene Result Fixture Gate
```

## Validation

Performed:

```txt
GitHub repo-list read
central ledger readback
repo-local .agent readback
repo-local source readback
repo-local .agent write
central ledger write
central internal change-log write
```

Not performed:

```txt
local checkout
npm install
npm run check
browser smoke
GitHub Pages smoke
runtime source edit
```

No runtime success is claimed.
