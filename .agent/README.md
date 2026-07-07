# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, adapter bindings, debug host exposure, and repo-local smoke fixtures while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T15-29-27-04-00/project-breakdown.md
```

This run keeps the manifest/tuning authority direction, but narrows the next implementation slice into **RunnerStep Authority + ContactEvent Replay Fixture**.

The runner is playable, but `src/runtime-terrain-v6.mjs` still owns live tuning, scene mutation, input booleans, runner motion, jump consumption, contact resolution, result transitions, terrain streaming, visual rigging, camera, HUD, physics bridge, and partial host snapshots inline. The next pass should make manifest loading, tuning adaptation, action intake, runner step results, contact events, scene dispatch, host diagnostics, and replay fixtures explicit before extracting terrain, render, raptor, or Rapier services.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, the live Rapier ProtoKit dependency, the missing `run-movement-kit`, existing ProtoKit families to consume first, repo-local extraction candidates, service ownership, known blockers, and the next RunnerStep/ContactEvent replay cutover slice.

## Prior documented runs

```txt
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

Run the `PrehistoricRush RunnerStep Authority + ContactEvent Replay Fixture Cutover`:

```txt
preserve index.html and src/runtime.mjs
-> preserve current visual Three.js/Rapier playable loop
-> add prehistoric-rush-manifest-loader-kit
-> load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, kit-cutover-inventory.json, and flock-generation.json before runtime setup
-> add prehistoric-rush-runtime-tuning-adapter-kit
-> map manifest tuning into live runtime values
-> mark inline tuning fallback-only
-> publish manifest/tuning drift diagnostics
-> add prehistoric-rush-scene-id-catalog-kit
-> keep menu, game, run-over, and win canonical
-> add prehistoric-rush-scene-result-alias-kit
-> normalize fail to run-over as compatibility-only alias
-> add prehistoric-rush-action-frame-contract-kit
-> route button and keyboard inputs through ActionFrame acceptance
-> add prehistoric-rush-runner-step-result-kit
-> isolate speed, yaw, boost, jump, gravity, terrain sample, and distance updates into one reducer result
-> add prehistoric-rush-runner-event-contract-kit
-> emit deterministic runner events from step results
-> add prehistoric-rush-contact-event-contract-kit
-> convert hazard hit, shard pickup, and distance goal into ContactEvent records
-> add prehistoric-rush-contact-result-snapshot-kit
-> request scene transitions from contacts instead of mutating app.scene directly
-> expand PrehistoricRushHost with diagnostics, snapshots, dispatch, smoke, and replay journal helpers
-> add DOM-free fixture smoke for tuning parity, scene aliasing, start, jump, rejected jump, hazard run-over, pickup, win, retry, menu, runner-event replay, contact replay, and replay parity
-> defer terrain/render/raptor/Rapier extraction until these fixtures pass
```

Do not add new visible content first. Make manifest authority, tuning parity, runtime drift diagnostics, ActionFrame intake, RunnerStep results, ContactEvent records, scene dispatch results, replayable intent, and smoke coverage explicit first. Then improve route readability and hazard/pickup clarity through config-driven services.
