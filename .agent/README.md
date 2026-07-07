# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, input adapter binding, and debug host exposure while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T05-39-22-04-00/project-breakdown.md
```

This run re-confirms that `src/runtime-terrain-v6.mjs` is the main extraction target. The runner is playable, but runtime tuning, scene transition names, terrain streaming, scatter, runner motion, raptor pose, contact, camera, HUD, and GameHost diagnostics still need service seams.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, existing ProtoKit families to consume first, the missing `run-movement-kit`, repo-local extraction candidates, service ownership, known blockers, and the next cutover slice.

## Prior documented runs

```txt
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

Run the `PrehistoricRush Tuning Source of Truth + Service Extraction Cutover`: keep the current playable runner behavior stable, add a manifest/tuning loader, make `runner-tuning.json` the runtime source of truth, normalize `fail`/`run-over` scene naming, split `src/runtime-terrain-v6.mjs` into terrain, scatter, runner-motion, contact, raptor, camera, UI, and GameHost services, then add behavior smoke fixtures for start, run-over, win, shard pickup, and config parity.
