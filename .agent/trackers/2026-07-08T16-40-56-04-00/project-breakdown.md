# PrehistoricRush Project Breakdown

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-08T16-40-56-04-00`

**Branch target:** `main`

**Runtime/source files changed:** no

## Plan ledger

**Goal:** Compare the full accessible `LuminaryLabs-Publish` repo list against `LuminaryLabs-Dev/LuminaryLabs`, choose one eligible non-Cavalry repo, refresh its root `.agent` documentation, and log the central ledger update.

**Checklist**

```txt
[x] List current accessible LuminaryLabs-Publish repositories.
[x] Exclude TheCavalryOfRome.
[x] Compare against central repo-ledger state in LuminaryLabs-Dev/LuminaryLabs.
[x] Select one repo only.
[x] Read repo-local .agent docs.
[x] Read README and runtime source files.
[x] Identify interaction loop.
[x] Identify domains in use.
[x] Identify services offered by kits.
[x] Identify implemented, runtime-implied, and next-cut kits.
[x] Add timestamped tracker entry.
[x] Add timestamped turn-ledger entry.
[x] Add architecture audit.
[x] Add render audit.
[x] Add gameplay audit.
[x] Add presentation-authority audit.
[x] Refresh root .agent docs and kit registry.
[x] Update central repo ledger.
[x] Add central internal change-log entry.
[x] Push to main only.
```

## Selection reason

No checked non-Cavalry Publish repo was fully new, absent from the central ledger, undocumented, recently added but undocumented, or missing sampled root `.agent/START_HERE.md` state.

`PrehistoricRush` was selected as the oldest eligible fallback after current central catch-ups for `ZombieOrchard` and `TheUnmappedHouse`.

## Publish repo comparison

```txt
LuminaryLabs-Publish/IntoTheMeadow       tracked / root .agent present / central update observed 2026-07-08T15-28-13-04-00
LuminaryLabs-Publish/HorrorCorridor      tracked / root .agent present / central update observed 2026-07-08T15-39-43-04-00
LuminaryLabs-Publish/AetherVale          tracked / root .agent present / central update observed 2026-07-08T15-20-41-04-00
LuminaryLabs-Publish/ZombieOrchard       tracked / root .agent present / central update observed 2026-07-08T16-20-00-04-00
LuminaryLabs-Publish/TheUnmappedHouse    tracked / root .agent present / central update observed 2026-07-08T16-19-57-04-00
LuminaryLabs-Publish/MyCozyIsland        tracked / root .agent present / central update observed 2026-07-08T14-58-49-04-00
LuminaryLabs-Publish/TheOpenAbove        tracked / root .agent present / central update observed 2026-07-08T15-11-18-04-00
LuminaryLabs-Publish/PhantomCommand      tracked / root .agent present / central update observed 2026-07-08T15-58-59-04-00
LuminaryLabs-Publish/TheCavalryOfRome    excluded by rule
LuminaryLabs-Publish/PrehistoricRush     selected fallback / previous central update 2026-07-08T14-51-11-04-00
```

## Current product read

`PrehistoricRush` is a standalone static browser infinite runner.

The repo has a local DSK/domain scaffold, but the live route still relies on inline runtime authority for movement, contacts, scene dispatch, presentation, and host state.

## Interaction loop

```txt
page opens index.html
  -> src/runtime.mjs imports ./game.js
  -> src/game.js creates eventBus/domainHost/scheduler
  -> dino, camera, and HUD domains install
  -> PrehistoricRushComposition.snapshot() becomes available
  -> composition.ready is emitted
  -> runtime-terrain-v6.mjs loads Three.js, Rapier, and rapier-physics-domain-kit
  -> menu scene waits for Start/Enter/Space
  -> game scene mutates turn, yaw, speed, jump, distance, terrain, contacts, pickups, and scene inline
  -> src/game.js presentation pass applies camera, stride, HUD, and render frame directly
  -> PrehistoricRushHost.getState() exposes scene, runner, physics, terrain, and renderer string
```

## Domains in use

```txt
static-browser-shell
module-runtime-entry
composition-bootstrap
event-bus-history
domain-host-installation
tick-scheduler-scaffold
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
scene-state-domain
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
presentation-journal-contract
render-readback-contract
host-presentation-snapshot
fixture-replay-contract
```

## Services that kits offer

```txt
createEventBus:
  on, emit, snapshot

createDomainHost:
  install, get, tick, snapshot

createTickScheduler:
  start, stop, snapshot

dino-pose-domain-kit:
  listens for runner.moved
  emits dino.pose.changed
  update({ speed, turn, jump, time })
  getDescriptor
  snapshot

camera-domain-kit:
  emits camera.preset.ready
  getDescriptor
  snapshot

hud-domain-kit:
  emits hud.ready
  render(snapshot)
  getDescriptor
  snapshot

runtime-terrain-v6 route:
  setup scene/render/camera
  create terrain chunks
  populate scatter/colliders/pickups
  create physics bridge
  mutate runner state
  check hazard/pickup contacts
  dispatch scene state
  render frame
  expose PrehistoricRushHost.getState
```

## Kits identified

Implemented/source-backed:

```txt
domain-runtime-event-bus-kit
domain-runtime-domain-host-kit
domain-runtime-tick-scheduler-kit
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle-kit
camera-domain-kit
hud-domain-kit
rapier-physics-domain-kit
```

Runtime-implied:

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
prehistoric-rush-presentation-frame-record-kit
prehistoric-rush-presentation-journal-kit
prehistoric-rush-host-presentation-snapshot-kit
prehistoric-rush-render-readback-kit
prehistoric-rush-dom-free-presentation-fixture-kit
```

## Files changed in this repo

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-08T16-40-56-04-00-event-source-fixture-source-file-manifest.md
.agent/render-audit/2026-07-08T16-40-56-04-00-presentation-render-readback-source-manifest.md
.agent/gameplay-audit/2026-07-08T16-40-56-04-00-runner-action-contact-scene-contract.md
.agent/presentation-authority-audit/2026-07-08T16-40-56-04-00-source-file-manifest-and-host-projection.md
.agent/trackers/2026-07-08T16-40-56-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-08T16-40-56-04-00.md
```

## Main finding

The highest-value next implementation is still not a renderer rewrite.

The route needs additive source files and a DOM-free fixture proving the current live behavior can be projected into `PrehistoricRushHost.getState().presentation`.

## Next safe ledge

```txt
PrehistoricRush Source File Manifest + Host Presentation Projection Fixture Gate
```

## Validation status

```txt
runtime source changed: no
branch created: no
pull request created: no
local npm commands run: no, root package.json is absent
browser smoke run: no
pushed to main: yes
```
