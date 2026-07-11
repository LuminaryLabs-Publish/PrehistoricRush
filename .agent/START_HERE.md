# START HERE: PrehistoricRush

**Last aligned:** `2026-07-10T21-00-16-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Current implementation gate

```txt
PrehistoricRush Instance Pool Capacity Authority
+ Deterministic Population Fixture Gate
```

The population-capacity gate remains first because the active root pool can receive more writes than its allocation, and grass admission currently reuses the previous active draw count as the next capacity limit.

## Newly documented follow-on

```txt
PrehistoricRush Runtime Source Contract Reconciliation
+ Deployed Artifact Fixture Gate
```

The deployed repository currently presents several JSON files as configuration and composition authority, but the active route does not read them. The runtime source of truth is hardcoded inside `src/game.js`.

## Selection

The accessible `LuminaryLabs-Publish` installation contains ten repositories. `TheCavalryOfRome` remains excluded. All nine eligible repositories are tracked and have root `.agent` state, so the oldest documented-selection rule applied.

`PrehistoricRush` was selected because its prior central and root audit timestamp, `2026-07-10T19-30-36-04-00`, was the oldest eligible timestamp.

## Read first

```txt
.agent/trackers/2026-07-10T21-00-16-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-10T21-00-16-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-10T21-00-16-04-00-runtime-source-contract-dsk-map.md
.agent/render-audit/2026-07-10T21-00-16-04-00-deployed-render-source-authority-gap.md
.agent/gameplay-audit/2026-07-10T21-00-16-04-00-runtime-config-scene-authority-loop.md
.agent/interaction-audit/2026-07-10T21-00-16-04-00-input-scene-config-bypass-map.md
.agent/source-contract-audit/2026-07-10T21-00-16-04-00-deployed-manifest-runtime-consumption-contract.md
.agent/deploy-audit/2026-07-10T21-00-16-04-00-artifact-source-contract-fixture-gate.md
```

## Active interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> construct six repo-local domain kits
  -> import Three.js, Rapier, and the external Rapier physics kit
  -> create shell, terrain window, instance pools, raptor, input, physics, HUD, and camera
  -> populate trees, roots, grass, rocks, shards, colliders, and pickups
  -> Start Rush performs a partial state reset
  -> one RAF advances simulation, presentation, and rendering
  -> run-over or win changes the scene string
  -> Retry / Run Again re-enter the game with another partial reset
  -> PrehistoricRushHost exposes live objects and aggregate snapshots
```

## Active repo-local kits

```txt
route-field-domain-kit
surface-traversal-domain-kit
forest-archetype-domain-kit
grass-patch-domain-kit
grass-wind-domain-kit
procedural-dino-body-domain-kit
```

## Source-authority finding

The Pages workflow deploys `game-scenes.json`, `runner-tuning.json`, `flock-generation.json`, `kit-composition.json`, `kit-cutover-inventory.json`, and scene JSON files. The active browser route imports none of them.

Examples:

```txt
src/game.js base speed:             16
runner-tuning.json base speed:      13.5

src/game.js terrain chunk size:     56
runner-tuning.json chunk size:      44

src/game.js active composition:     six local domain kits + Three/Rapier/physics adapter
kit-composition.json declaration:   NexusEngine core kit stack + ProtoKit cutover plan

src/game.js scene authority:        inline state.scene strings
game-scenes.json authority claim:   scene files, transition map, NexusEngine CDN/core kits
```

Changing the deployed JSON files can therefore appear valid while producing no runtime change.

## Safe order

```txt
1. Finish population-capacity authority and its fixture.
2. Choose one canonical runtime source contract.
3. Either consume the deployed JSON files or explicitly mark them archival/non-runtime.
4. Emit requested/resolved source fingerprints through PrehistoricRushHost.
5. Gate Pages deployment on source-contract parity.
6. Return to restart, persistence, dependency admission, and lifecycle disposal.
```

## Validation state

Documentation only. Runtime source, dependencies, routes, and deployment behavior were not changed. No branch or pull request was created.
