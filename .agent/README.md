# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, adapter bindings, debug host exposure, repo-local composition bridges, and repo-local smoke fixtures while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-08T00-49-44-04-00/project-breakdown.md
```

This run corrects the active route and tightens the next implementation slice into **PrehistoricRush Dino Domain Bridge + Runtime Authority Fixture Gate**.

The active route is now:

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> dino/domain-runtime scaffold
  -> src/runtime-terrain-v6.mjs
```

The important change is that `src/game.js` now installs a repo-local domain runtime and dino domain scaffold before importing the legacy visual runtime. The dino form, pose, and material domain kits exist, but the live runner still manually creates and animates the raptor inside `src/runtime-terrain-v6.mjs`. The next pass should bridge live runner movement into `runner.moved`, let `dino-pose-domain-kit` emit real pose snapshots, and add manifest/action/contact/scene-dispatch fixtures without changing visible gameplay first.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, the live Rapier ProtoKit dependency, the repo-local domain runtime kits, the dino domain kits, the missing `run-movement-kit`, existing ProtoKit families to consume first, service ownership, blockers, and the next dino-domain bridge plus runtime-authority fixture gate.

## Prior documented runs

```txt
.agent/trackers/2026-07-07T23-21-18-04-00/project-breakdown.md
.agent/trackers/2026-07-07T21-59-06-04-00/project-breakdown.md
.agent/trackers/2026-07-07T20-38-27-04-00/project-breakdown.md
.agent/trackers/2026-07-07T19-18-58-04-00/project-breakdown.md
.agent/trackers/2026-07-07T18-00-19-04-00/project-breakdown.md
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

Run the `PrehistoricRush Dino Domain Bridge + Runtime Authority Fixture Gate`:

```txt
preserve index.html
preserve src/runtime.mjs
preserve current visible Three.js/Rapier behavior
preserve current PrehistoricRushHost.getState()
make active route documentation canonical: runtime.mjs -> game.js -> dino scaffold -> runtime-terrain-v6
load manifests before runtime setup
emit ManifestLoadStatus and ManifestDriftReport
normalize fail -> run-over through explicit SceneAliasCatalog
adapt runner-tuning.json into RuntimeRunnerTuning with inline values as fallback only
add RuntimeSourceSnapshot, SpawnBudgetSource, and WinThresholdSource
add ActionFrame records for start, retry, run-again, menu, left, right, boost, jump, and future touch
add ActionAcceptanceMatrix with stable accepted/rejected reasons
add RunnerSourceState snapshots and RunnerStepResult records
emit runner.moved from the live movement step
connect runner.moved to dino-pose-domain-kit as the first real domain bridge
surface dino form, pose, and material snapshots in PrehistoricRushComposition and PrehistoricRushHost diagnostics
add RunnerEvent journal entries for movement, jump, boost, terrain rebuild, pickup, impact, goal, and scene requests
add ContactEvent records for hazard-hit, shard-pickup, and distance-goal
add SceneDispatchResult records for run-over and win
expand PrehistoricRushHost with getDiagnostics(), getSnapshot(), getReplayJournal(), dispatch(actionFrame), runSmoke(name), and runReplayParitySmoke()
add DOM-free smoke fixtures for manifest load, tuning drift, fail alias, start, retry, jump accepted/rejected, hazard run-over, shard pickup, distance win, dino pose bridge, and replay parity
emit RunMovementPromotionReport after fixture parity defines the shared run-movement-kit surface
```

Do not add new visible content first. Make route authority, manifest authority, scene alias authority, dino domain bridge events, ActionFrame intake, ActionResult/RunnerStepResult/ContactEvent/SceneDispatchResult records, replayable intent, host diagnostics, fixture coverage, and the run-movement promotion boundary explicit first. Then improve route readability, hazard clarity, pickup clarity, camera polish, terrain density, raptor animation, and flock visuals through config-driven services.
