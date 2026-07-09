# PrehistoricRush Project Breakdown

**Generated:** `2026-07-09T11-46-08-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Selection result

The accessible `LuminaryLabs-Publish` repository list was compared against the tracked repo ledger in `LuminaryLabs-Dev/LuminaryLabs` and sampled repo-local `.agent/START_HERE.md` state.

No checked non-Cavalry Publish repo was fully new, central-ledger absent, undocumented, recently added but undocumented, or missing sampled root `.agent` state.

`LuminaryLabs-Publish/TheCavalryOfRome` remains excluded by rule.

`PrehistoricRush` was selected as the oldest eligible central-ledger fallback. Its repo-local and central tracking were still at `2026-07-09T09-10-50-04-00`, while later same-day passes had already refreshed most other checked non-Cavalry repos.

## Publish repository comparison

```txt
LuminaryLabs-Publish/HorrorCorridor       tracked / root .agent present / central latest 2026-07-09T10-10-32-04-00
LuminaryLabs-Publish/AetherVale           tracked / root .agent present / central latest 2026-07-09T11-30-50-04-00
LuminaryLabs-Publish/TheOpenAbove         tracked / root .agent present / central latest 2026-07-09T09-36-24-04-00
LuminaryLabs-Publish/TheCavalryOfRome     excluded by rule
LuminaryLabs-Publish/PhantomCommand       tracked / root .agent present / central latest 2026-07-09T10-29-02-04-00
LuminaryLabs-Publish/PrehistoricRush      selected / oldest eligible central-ledger fallback
LuminaryLabs-Publish/ZombieOrchard        tracked / root .agent present / central latest 2026-07-09T10-40-00-04-00
LuminaryLabs-Publish/IntoTheMeadow        tracked / root .agent present / central latest 2026-07-09T09-50-00-04-00
LuminaryLabs-Publish/MyCozyIsland         tracked / root .agent present / central latest 2026-07-09T11-21-06-04-00
LuminaryLabs-Publish/TheUnmappedHouse     tracked / root .agent present / central latest 2026-07-09T11-00-39-04-00
```

## Current product read

`PrehistoricRush` is a standalone static browser infinite runner with a repo-local DSK composition scaffold layered beside a live Three.js/Rapier terrain route.

The visible route already supports free steering, boost, jump, pickups, collision loss, a win threshold, a procedural raptor, terrain streaming, instanced environment props, and a second readability presentation pass.

## Interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> createEventBus / createDomainHost / createTickScheduler
  -> install dino form, dino pose, dino material, camera, and HUD domain kits
  -> expose PrehistoricRushComposition.snapshot()
  -> emit composition.ready
  -> import src/runtime-terrain-v6.mjs
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit
  -> menu waits for Start/Enter/Space
  -> keyboard input mutates left/right/boost/jump flags
  -> game loop mutates speed, yaw, jump, distance, terrain, colliders, pickups, contacts, scene, score, and renderer frame inline
  -> baseline runtime mutates raptor pose, camera, HUD DOM, and renderer frame
  -> src/game.js presentation pass applies close camera, readable stride, DSK HUD DOM, and a second renderer frame
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain, and renderer fields
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
rapier-runtime-bridge
kinematic-actor-transform
hazard-contact-detection
pickup-contact-detection
distance-goal-detection
raptor-visual-rig
raptor-pose-animation
dino-pose-event-bridge
camera-follow-policy
camera-frame-request-contract
hud-telemetry-projection
hud-frame-request-contract
contact-result-contract
scene-dispatch-result-contract
presentation-pass-authority
presentation-event-ledger
presentation-frame-contract
presentation-journal-contract
render-readback-contract
host-presentation-snapshot
fixture-replay-contract
host-diagnostics
repo-local-agent-state
central-ledger-readback
```

## Services that kits offer

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

## Kits

```txt
repo-local implemented:
  domain-runtime/event-bus
  domain-runtime/domain-host
  domain-runtime/tick-scheduler
  dino-form-domain-kit
  dino-pose-domain-kit
  dino-material-domain-kit
  dino-domain-bundle
  camera-domain-kit
  hud-domain-kit

live external:
  rapier-physics-domain-kit

runtime-implied:
  prehistoric-static-shell-kit
  prehistoric-runtime-entry-kit
  prehistoric-legacy-visual-runtime-kit
  prehistoric-raptor-visual-rig-kit
  prehistoric-terrain-streaming-kit
  prehistoric-contact-check-kit
  prehistoric-scene-dispatch-kit
  prehistoric-hud-dom-render-kit
  prehistoric-close-camera-apply-kit
  prehistoric-readable-stride-apply-kit

next-cut:
  prehistoric-rush-runner-source-state-kit
  prehistoric-rush-runner-step-delta-kit
  prehistoric-rush-runner-moved-event-kit
  prehistoric-rush-presentation-events-kit
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

## Main finding

`PrehistoricRush` does not need visual expansion, renderer extraction, terrain rewrite, movement rewrite, or ProtoKit promotion next.

The blocker is that `src/runtime-terrain-v6.mjs` mutates live app state directly and does not emit stable `runner.moved` records, while `dino-pose-domain-kit` already has the correct event consumer shape. The next pass should make the movement/presentation consumer path fixture-readable through `PrehistoricRushHost.getState().presentation`.

## Next safe ledge

```txt
PrehistoricRush Host Presentation Event Ledger + DOM-Free Fixture Gate
```

Required next files:

```txt
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/presentation-events.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Files changed in this documentation pass

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-09T11-46-08-04-00-host-presentation-event-ledger-dsk-map.md
.agent/render-audit/2026-07-09T11-46-08-04-00-render-readback-presentation-frame-contract.md
.agent/gameplay-audit/2026-07-09T11-46-08-04-00-runner-moved-dino-pose-loop.md
.agent/presentation-authority-audit/2026-07-09T11-46-08-04-00-host-presentation-snapshot-fixture-contract.md
.agent/deploy-audit/2026-07-09T11-46-08-04-00-dom-free-fixture-command-map.md
.agent/trackers/2026-07-09T11-46-08-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-09T11-46-08-04-00.md
```

## Validation status

```txt
runtime source changed: no
local npm install: no
local static server: no
browser smoke: no
DOM-free presentation fixture: no
branch created: no
pull request created: no
pushed to main: yes after write completion
```
