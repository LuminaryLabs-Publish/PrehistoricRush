# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, input adapter binding, debug host exposure, and repo-local smoke fixtures while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T14-11-48-04-00/project-breakdown.md
```

This run keeps the scene-dispatch/contact-result direction, but narrows the next slice into **Manifest/Tuning Authority + Runner Event Replay Fixture**.

The runner is playable, but `src/runtime-terrain-v6.mjs` still owns live tuning, scene mutation, input booleans, runner motion, contact resolution, result transitions, terrain streaming, visual rigging, camera, HUD, physics bridge, and partial host snapshots inline. The manifests already describe the intended game shape: `game-scenes.json` owns canonical scene order, `runner-tuning.json` owns intended motion/camera/terrain/streaming/rule tuning, `kit-composition.json` owns kit dependency direction, and `kit-cutover-inventory.json` owns promotion decisions. The next source pass should make those manifests authoritative before extracting terrain, renderer, raptor, or Rapier services.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, the live Rapier ProtoKit dependency, the missing `run-movement-kit`, existing ProtoKit families to consume first, repo-local extraction candidates, service ownership, known blockers, and the next manifest/tuning + runner-event replay cutover slice.

## Prior documented runs

```txt
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

Run the `PrehistoricRush Manifest/Tuning Authority + Runner Event Replay Fixture Cutover`:

```txt
keep index.html and src/runtime.mjs thin
-> keep current browser loop visually playable
-> add prehistoric-rush-manifest-loader-kit
-> load game-scenes.json, scenes/*.json, runner-tuning.json, kit-composition.json, and kit-cutover-inventory.json before runtime setup
-> add prehistoric-rush-runtime-tuning-adapter-kit
-> map runner-tuning.json motion, terrain, camera, streaming, and rule fields into runtime setup
-> make inline tuning fallback-only
-> add prehistoric-rush-manifest-drift-diagnostics-kit
-> publish config load success, fallback use, manifest drift, scene alias drift, and tuning drift through diagnostics
-> add prehistoric-rush-scene-id-catalog-kit
-> assert menu, game, run-over, and win are the only canonical scene ids
-> add prehistoric-rush-scene-result-alias-kit
-> make run-over canonical and fail compatibility-only
-> add prehistoric-rush-scene-authority-reducer-kit
-> replace direct app.scene mutation paths with sceneAuthority.dispatch(event)
-> add prehistoric-rush-scene-dispatch-result-kit
-> return accepted=false for unknown scene, invalid transition, duplicate transition, stale fixture event, and compatibility-only canonical write attempts
-> add prehistoric-rush-action-frame-contract-kit
-> define ActionFrame fields: id, frame, time, scene, action, value, source, accepted, rejected, reason
-> add prehistoric-rush-action-acceptance-matrix-kit
-> route button, Enter, Space, left/right, boost, retry, menu, and run-again through ActionFrame validation
-> add prehistoric-rush-runner-step-result-kit
-> return per-tick movement delta, consumed actions, rejected actions, speed/yaw/jump changes, and diagnostics
-> add prehistoric-rush-runner-event-contract-kit
-> emit runner events for start, jump, boost, steering, chunk rebuild, pickup contact, hazard contact, win threshold, and scene request
-> add prehistoric-rush-runner-event-journal-kit
-> add prehistoric-rush-contact-event-contract-kit
-> convert hazard hit, shard pickup, and distance goal into ContactEvent records
-> add prehistoric-rush-contact-result-snapshot-kit
-> snapshot lastContactEvent, impactEvents, pickupEvents, goalEvents, and pendingSceneRequest
-> expand PrehistoricRushHost into prehistoric-rush-gamehost-kit
-> expose getDiagnostics, getSceneSnapshot, getInputSnapshot, getRunnerSnapshot, getContactSnapshot, getReplayJournal, getKitStatus, dispatch, subscribe, and runSmoke
-> add DOM-free fixture scripts for tuning parity, scene alias, start, space-start, jump, rejected-jump, hazard-run-over, pickup, win, retry, menu, runner-event replay, and replay parity
-> defer terrain/render/raptor extraction until manifest/tuning, scene dispatch, runner event, and contact result smoke pass
```

Do not add new visible content first. Make manifest authority, tuning parity, runtime drift diagnostics, scene dispatch, runner event records, rejected input diagnostics, replayable intent, and smoke coverage explicit first, then improve route readability and hazard/pickup clarity through config-driven services.
