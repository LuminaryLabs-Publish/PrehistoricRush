# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, input adapter binding, and debug host exposure while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T04-30-19-04-00/project-breakdown.md
```

## Kit registry

```txt
.agent/kit-registry.json
```

The registry tracks current core-kit targets, existing ProtoKit families to consume first, the missing `run-movement-kit`, repo-local extraction candidates, service ownership, known blockers, and the next cutover slice.

## Prior documented runs

```txt
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

Run the `PrehistoricRush Kit Registry Cutover Slice`: keep the current playable runner behavior stable, split `src/runtime-terrain-v6.mjs` into terrain, runner-motion, scatter, raptor-pose, contact, camera, UI, and GameHost services, load `runner-tuning.json` as the source of truth, normalize scene result naming, then promote stable contracts into core kits or ProtoKits.
