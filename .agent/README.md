# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, adapter bindings, debug host exposure, and repo-local smoke fixtures while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T16-40-29-04-00/project-breakdown.md
```

This run keeps the RunnerStep / ContactEvent direction, but tightens the next implementation slice into **Manifest Drift Gate + Runner Replay Source Lock**.

The runner is playable, but `src/runtime-terrain-v6.mjs` still owns live tuning, scene mutation, input booleans, runner motion, jump consumption, contact resolution, result transitions, terrain streaming, visual rigging, camera, HUD, physics bridge, and partial host snapshots inline. The next pass should first load manifests, emit a stable drift report, adapt `runner-tuning.json` into live constants, normalize scene result aliases, and add replayable ActionFrame / RunnerStepResult / ContactEvent / SceneDispatchResult records before any renderer, terrain, raptor, or Rapier extraction.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, the live Rapier ProtoKit dependency, the missing `run-movement-kit`, existing ProtoKit families to consume first, repo-local extraction candidates, service ownership, known blockers, and the next Manifest Drift / Runner Replay source-lock cutover.

## Prior documented runs

```txt
.agent/trackers/2026-07-07T15-29-27-04-00/project-breakdown.md
.agent/trackers/2026-07-07T14-11-48-04-00/project-breakdown.md
.agent/trackers/2026-07-07T13-01-09-04-00/project-breakdown.md
.agent/trackers/2026-07-07T11-29-07-04-00/project-breakdown.md
.agent/trackers/2026-07-07T10-21-39-04-00/project-breakdown.md
.agent/trackers/2026-07-07T09-11-33-04-00/project-breakdown.md
.agent/trackers/2026-07-07T08-00-48-04-00/project-breakdown.md
.agent/trackers/2026-07-07T06-50-26-04-00/project-breakdown.md
.agent/trackers/2026-07-07T05-39-22-04-00/project-breakdown.md
```

## Standing agent rules

- Work on only this repo while documenting this repo.
- Push findings to this root `.agent` folder.
- Keep every run in a timestamped tracker folder.
- Do not move reusable behavior deeper into product code when it belongs in core kits or ProtoKits.
- Prefer kit cutover work over product-side gameplay accumulation.
- Keep `TheCavalryOfRome` excluded from this scheduled documentation sequence.

## Current highest-value direction

Run the `PrehistoricRush Manifest Drift Gate + Runner Replay Source Lock`:

```txt
preserve index.html
preserve src/runtime.mjs
preserve current visual runtime behavior
add prehistoric-rush-manifest-loader-kit
load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json before setup()
add prehistoric-rush-manifest-drift-report-kit
report all live-vs-manifest drift without changing visuals first
add prehistoric-rush-runtime-tuning-adapter-kit
drive motion and terrain constants from runner-tuning.json
keep inline constants as fallback only
add prehistoric-rush-scene-id-catalog-kit
keep menu, game, run-over, and win canonical
add prehistoric-rush-scene-result-alias-kit
treat fail as compatibility alias for run-over
add ActionFrame records for start, retry, menu, again, left, right, boost, and jump
add ActionFrame acceptance/rejection records by scene
add RunnerSourceState snapshot
add RunnerStepResult for speed, yaw, boost, jump, gravity, position, distance, terrain sample, and rebuild request
add RunnerEvent journal
add ContactEvent records for hazard-hit, shard-pickup, and distance-goal
add SceneDispatchResult records for run-over and win
expand PrehistoricRushHost with getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(actionFrame), and runSmoke(name)
add DOM-free smoke fixtures for manifest load, tuning drift report, fail alias, start, jump acceptance/rejection, hazard run-over, shard pickup, distance win, retry, and replay parity
defer terrain/render/raptor/Rapier extraction until source-lock smokes pass
```

Do not add new visible content first. Make manifest authority, tuning parity, runtime drift diagnostics, ActionFrame intake, RunnerStep results, ContactEvent records, scene dispatch results, replayable intent, and smoke coverage explicit first. Then improve route readability and hazard/pickup clarity through config-driven services.
