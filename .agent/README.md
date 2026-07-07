# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, input adapter binding, and debug host exposure while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T06-50-26-04-00/project-breakdown.md
```

This run re-confirms that `src/runtime-terrain-v6.mjs` is the main extraction target, but sharpens the next slice from general service extraction to **Config Authority + Behavior Smoke**.

The runner is playable, but the runtime still duplicates values that already exist in `runner-tuning.json`, still has `fail` / `run-over` naming drift across scene manifests, and still exposes only a partial host surface through `PrehistoricRushHost.getState()`.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, the live Rapier ProtoKit dependency, the missing `run-movement-kit`, existing ProtoKit families to consume first, repo-local extraction candidates, service ownership, known blockers, and the next config-authority cutover slice.

## Prior documented runs

```txt
.agent/trackers/2026-07-07T05-39-22-04-00/project-breakdown.md
.agent/trackers/2026-07-07T04-30-19-04-00/project-breakdown.md
.agent/trackers/2026-07-07T03-20-27-04-00/project-breakdown.md
```

## Standing agent rules

- Work on only this repo while documenting this repo.
- Push findings to this root `.agent` folder.
- Keep every run in a timestamped tracker folder.
- Do not move reusable behavior deeper into product code when it belongs in core kits or ProtoKits.
- Prefer kit cutover work over product-side gameplay accumulation.
- Keep `TheCavalryOfRome` excluded from this scheduled documentation sequence.

## Current highest-value direction

Run the `PrehistoricRush Config Authority + Behavior Smoke Cutover`:

```txt
keep index.html and src/runtime.mjs thin
-> add prehistoric-rush-manifest-loader-kit
-> load runner-tuning.json, game-scenes.json, scenes/game.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> make inline tuning constants fallback-only
-> normalize loss naming so run-over is canonical and fail is only a compatibility alias
-> add scene-flow, runner-state, terrain, scatter, contact, raptor, camera, HUD, and GameHost service seams
-> add getDiagnostics, getSceneSnapshot, getKitStatus, and behavior-smoke commands
-> add smoke fixtures for start, run-over, win, shard pickup, and tuning parity
```

Do not add new visible content first. Make runtime authority explicit first, then improve route readability and hazard/pickup clarity through config-driven services.
