# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, input adapter binding, debug host exposure, and repo-local smoke fixtures while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T10-21-39-04-00/project-breakdown.md
```

This run keeps the prior action-replay / diagnostics direction, but narrows the next slice into **Scene Result Alias + ActionFrame Smoke Fixture**.

The runner is playable, but `src/runtime-terrain-v6.mjs` still duplicates tuning already described by `runner-tuning.json`, `game-scenes.json` uses `run-over` while `scenes/game.json` still uses `fail`, Space has scene-dependent meaning, accepted inputs are not journaled, and `PrehistoricRushHost` exposes only a partial state surface.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, the live Rapier ProtoKit dependency, the missing `run-movement-kit`, existing ProtoKit families to consume first, repo-local extraction candidates, service ownership, known blockers, and the next scene-result/action-frame smoke cutover slice.

## Prior documented runs

```txt
.agent/trackers/2026-07-07T09-11-33-04-00/project-breakdown.md
.agent/trackers/2026-07-07T08-00-48-04-00/project-breakdown.md
.agent/trackers/2026-07-07T06-50-26-04-00/project-breakdown.md
.agent/trackers/2026-07-07T05-39-22-04-00/project-breakdown.md
.agent/trackers/2026-07-07T04-30-19-04-00/project-breakdown.md
```

## Standing agent rules

- Work on only this repo while documenting this repo.
- Push findings to this root `.agent` folder.
- Keep every run in a timestamped tracker folder.
- Do not move reusable behavior deeper into product code when it belongs in core kits or ProtoKits.
- Prefer kit cutover work over product-side gameplay accumulation.
- Keep `TheCavalryOfRome` excluded from this scheduled documentation sequence.

## Current highest-value direction

Run the `PrehistoricRush Scene Result Alias + ActionFrame Smoke Fixture Cutover`:

```txt
keep index.html and src/runtime.mjs thin
-> add prehistoric-rush-manifest-loader-kit
-> load runner-tuning.json, game-scenes.json, scenes/game.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> add prehistoric-rush-scene-result-alias-kit
-> make run-over the canonical loss result
-> accept fail only as a compatibility alias and report the alias in diagnostics
-> add prehistoric-rush-action-frame-contract-kit
-> define ActionFrame fields: frame, time, scene, action, value, source, accepted, rejected, reason
-> add scene validity matrix for start, retry, menu, steer-left, steer-right, boost, jump, force-run-over, force-win, and force-pickup
-> guarantee Space emits start outside game and jump only while scene is game
-> add prehistoric-rush-action-frame-replay-kit
-> journal accepted frames and rejected frame diagnostics separately
-> add prehistoric-rush-scripted-action-fixture-kit
-> fixture scripts: start-from-menu, space-starts-menu, space-jumps-game, fail-alias-run-over, forced-pickup, forced-run-over, forced-win, replay-parity
-> promote PrehistoricRushHost into prehistoric-rush-gamehost-kit
-> expose getDiagnostics, getSceneSnapshot, getInputSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and runSmoke
-> defer terrain/render/raptor extraction until action/result smoke passes
```

Do not add new visible content first. Make runtime authority, result aliases, replayable input intent, scene flow, diagnostics, and smoke coverage explicit first, then improve route readability and hazard/pickup clarity through config-driven services.
