# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered infinite runner. The product repo should stay thin: it should own the browser shell, scene manifests, theme/config data, renderer bootstrap, and debug host exposure while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Latest documented run

```txt
.agent/trackers/2026-07-07T03-20-27-04-00/project-breakdown.md
```

## Standing agent rules

- Work on only this repo while documenting this repo.
- Push findings to this root `.agent` folder.
- Keep every run in a timestamped tracker folder.
- Do not move reusable behavior deeper into product code when it belongs in core kits or ProtoKits.
- Prefer kit cutover work over product-side gameplay accumulation.

## Current highest-value direction

Cut the current product-side runner, terrain, collision, camera, UI, and procedural dino behavior into explicit kit boundaries, then make `PrehistoricRush` a thin scene/data shell that composes those services.
