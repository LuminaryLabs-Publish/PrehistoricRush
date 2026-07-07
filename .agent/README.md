# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, input adapter binding, debug host exposure, and repo-local smoke fixtures while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T11-29-07-04-00/project-breakdown.md
```

This run keeps the action-frame / diagnostics direction, but narrows the next slice into **Manifest Authority + Action Acceptance Fixture**.

The runner is playable, but `src/runtime-terrain-v6.mjs` still owns manifest loading assumptions, inline tuning, raw input booleans, scene transition requests, contact result transitions, accepted input behavior, rejected input behavior, and the partial `PrehistoricRushHost` snapshot. The next work should create manifest authority and explicit action acceptance before extracting terrain, render, or raptor systems.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, the live Rapier ProtoKit dependency, the missing `run-movement-kit`, existing ProtoKit families to consume first, repo-local extraction candidates, service ownership, known blockers, and the next manifest/action-acceptance fixture cutover slice.

## Prior documented runs

```txt
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

Run the `PrehistoricRush Manifest Authority + Action Acceptance Fixture Cutover`:

```txt
keep index.html and src/runtime.mjs thin
-> add prehistoric-rush-manifest-loader-kit
-> load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> report config load success, fallback use, and manifest drift through diagnostics
-> add prehistoric-rush-scene-result-alias-kit
-> make run-over the canonical loss result
-> accept fail only as a compatibility alias and report the alias in diagnostics
-> add prehistoric-rush-action-frame-contract-kit
-> define ActionFrame fields: frame, time, scene, action, value, source, accepted, rejected, reason
-> add prehistoric-rush-action-acceptance-matrix-kit
-> explicitly accept/reject actions by scene
-> guarantee Space emits start only outside game and jump only in game
-> journal accepted frames separately from rejected diagnostics
-> add prehistoric-rush-scripted-action-fixture-kit
-> fixture scripts: start-from-menu, space-starts-menu, space-jumps-game, rejected-jump-outside-game, retry-from-run-over, menu-from-run-over, forced-pickup, forced-run-over, forced-win, replay-parity
-> promote PrehistoricRushHost into prehistoric-rush-gamehost-kit
-> expose getDiagnostics, getSceneSnapshot, getInputSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and runSmoke
-> defer terrain/render/raptor extraction until action acceptance and replay smoke pass
```

Do not add new visible content first. Make runtime authority, action acceptance, rejected input diagnostics, replayable intent, scene flow, and smoke coverage explicit first, then improve route readability and hazard/pickup clarity through config-driven services.
