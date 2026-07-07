# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, adapter bindings, debug host exposure, and repo-local smoke fixtures while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T18-00-19-04-00/project-breakdown.md
```

This run keeps the manifest drift and RunnerStep direction, but tightens the next implementation slice into **Action Dispatch Smoke Gate + Contact Replay Fixture Lock**.

The runner is playable, but `src/runtime-terrain-v6.mjs` still owns live tuning, scene mutation, input booleans, runner motion, jump consumption, contact resolution, result transitions, terrain streaming, visual rigging, camera, HUD, physics bridge, and partial host snapshots inline. The next pass should make manifest load status, scene alias normalization, ActionFrame intake, ActionResult journals, RunnerStepResult records, ContactEvent records, SceneDispatchResult records, and DOM-free replay parity explicit before any renderer, terrain, raptor, or Rapier extraction.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, the live Rapier ProtoKit dependency, the missing `run-movement-kit`, existing ProtoKit families to consume first, repo-local extraction candidates, service ownership, known blockers, and the next Action Dispatch / Contact Replay fixture gate.

## Prior documented runs

```txt
.agent/trackers/2026-07-07T16-40-29-04-00/project-breakdown.md
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

Run the `PrehistoricRush Action Dispatch Smoke Gate + Contact Replay Fixture Lock`:

```txt
preserve index.html
preserve src/runtime.mjs
preserve current visual runtime behavior
load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json before setup()
emit ManifestLoadStatus and ManifestDriftReport
keep inline tuning as fallback-only until drift is visible
normalize fail -> run-over through an explicit compatibility alias
add ActionFrame records for start, retry, menu, again, left, right, boost, jump, and future touch intents
add ActionResult records with stable accepted/rejected reasons by scene
add RunnerSourceState snapshot helpers
wrap the current movement tick in RunnerStepResult without visible math changes first
record jump-consumed, boost-active, terrain-rebuild-requested, distance-delta, and heading-delta facts
emit RunnerEvent journal entries for movement, jump, boost, rebuild, pickup, impact, goal, and scene request
emit ContactEvent records for hazard-hit, shard-pickup, and distance-goal
emit SceneDispatchResult records for run-over and win
expand PrehistoricRushHost with getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(actionFrame), and runSmoke(name)
add DOM-free smoke fixtures for manifest load, tuning drift report, fail alias, start, retry, jump acceptance/rejection, hazard run-over, shard pickup, distance win, and replay parity
defer terrain/render/raptor/Rapier extraction until source-lock smokes pass
```

Do not add new visible content first. Make manifest authority, scene alias authority, runtime drift diagnostics, ActionFrame intake, ActionResult/RunnerStepResult/ContactEvent/SceneDispatchResult records, replayable intent, and smoke coverage explicit first. Then improve route readability and hazard/pickup clarity through config-driven services.
