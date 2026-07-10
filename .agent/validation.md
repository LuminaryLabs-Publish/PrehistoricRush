# Validation: PrehistoricRush

**Updated:** `2026-07-10T18-01-03-04-00`

## This pass

```txt
runtime source changed: no
agent docs changed: yes
central ledger changed: pending until central sync
branch created: no
pull request created: no
target branch: main
```

## Repository comparison performed

```txt
accessible LuminaryLabs-Publish repositories: 10
eligible non-Cavalry repositories: 9
all eligible repos in central ledger: yes
all eligible repos with root .agent evidence: yes
selected repo: PrehistoricRush
selection basis: oldest eligible central update, 2026-07-10T16-28-47-04-00
TheCavalryOfRome: excluded
```

## Readback performed

```txt
README.md
index.html
game-scenes.json
runner-tuning.json
src/runtime.mjs
src/game.js
src/runtime-terrain-v6.mjs
src/domain-runtime/event-bus.js
src/domain-runtime/domain-host.js
src/domain-runtime/tick-scheduler.js
current root .agent state
central repo ledger entries and current recency
latest repository commits
```

## Static findings confirmed

```txt
Three.js source: jsDelivr three@0.179.1
Rapier source: jsDelivr rapier3d-compat@0.15.0
physics kit source: LuminaryLabs-Agents/NexusRealtime-ProtoKits@main
load() catches import errors and returns null
Three.js is passed directly into setup after admission suppression
Rapier/physics failure can degrade to fallback with no typed source result
scheduler.start is not called by src/game.js
primary runtime and secondary presentation own separate RAF loops
both loops mutate presentation and call renderer.render
Start / Retry / Run Again only change app.scene
resize / keydown / keyup listeners have no removal owner
renderer, geometry, material, physics, and RAF disposal is absent
PrehistoricRushHost exposes mutable app/state objects
scene and tuning manifests are not consumed by the live route
```

## Runtime validation

```txt
local checkout: no
root package.json found: no
npm install: not run
npm run check: unavailable
npm test: unavailable
browser smoke: not run
GitHub Pages smoke: not run
runtime dependency admission fixture: not available
single-frame fixture: not available
restart transaction fixture: not available
mount/dispose/remount fixture: not available
```

## Next validation target

```txt
node scripts/prehistoric-rush-runtime-lifecycle-fixture.mjs
```

The fixture must prove immutable dependency admission, explicit fallback reasons, one frame/render owner, real session restart, idempotent disposal, bounded remount ownership, and detached JSON-safe host observations.