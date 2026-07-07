# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, input adapter binding, debug host exposure, and repo-local smoke fixtures while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T09-11-33-04-00/project-breakdown.md
```

This run keeps the previous `Manifest Loader + Input Intent Scene Flow` direction, but sharpens the next slice into **Action Frame Replay + Host Diagnostics Contract**.

The runner is playable, but the runtime still duplicates values that already exist in `runner-tuning.json`, has `fail` / `run-over` naming drift across scene manifests, maps Space to different scene-scoped meanings, does not journal accepted action frames, and exposes only a partial host surface through `PrehistoricRushHost.getState()`.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, the live Rapier ProtoKit dependency, the missing `run-movement-kit`, existing ProtoKit families to consume first, repo-local extraction candidates, service ownership, known blockers, and the next action-replay/diagnostics cutover slice.

## Prior documented runs

```txt
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

Run the `PrehistoricRush Action Frame Replay + Host Diagnostics Contract`:

```txt
keep index.html and src/runtime.mjs thin
-> add prehistoric-rush-manifest-loader-kit
-> load runner-tuning.json, game-scenes.json, scenes/game.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> make inline tuning fallback-only and report each fallback in diagnostics
-> normalize run-over as canonical loss result and keep fail only as a compatibility alias
-> add prehistoric-rush-input-intent-kit
-> emit ActionFrame records for button, Enter, Space, A/D, arrows, W/ArrowUp, and touch controls
-> guarantee Space emits jump only while scene is game
-> add prehistoric-rush-action-frame-replay-kit
-> journal accepted action frames with frame, time, scene, action, value, and source
-> add replay smoke that can drive start, steer, boost, jump, shard pickup, forced run-over, and forced win
-> add prehistoric-rush-scene-flow-kit for start, run-over, win, retry, menu, and result aliasing
-> add prehistoric-rush-runner-state-kit fed by action frames and runner-tuning.json
-> split contact bridge enough to emit pickup, impact, run-over, and win events
-> promote PrehistoricRushHost into prehistoric-rush-gamehost-kit
-> expose getDiagnostics, getSceneSnapshot, getInputSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and smoke commands
```

Do not add new visible content first. Make runtime authority, replayable input intent, scene flow, diagnostics, and smoke coverage explicit first, then improve route readability and hazard/pickup clarity through config-driven services.
