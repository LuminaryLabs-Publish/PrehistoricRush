# PrehistoricRush Agent Ledger

This folder stores automation-authored repo analysis, tracker entries, kit registry state, and future implementation recommendations for `LuminaryLabs-Publish/PrehistoricRush`.

## Current repo role

`PrehistoricRush` is a standalone additive publish repo for a NexusEngine-powered prehistoric infinite runner.

The product repo should stay thin. It should own the browser shell, scene manifests, theme/config data, renderer bootstrap, adapter bindings, debug host exposure, repo-local composition bridges, and repo-local smoke fixtures while reusable behavior moves into NexusEngine core kits or ProtoKits.

## Current active run

```txt
.agent/runs/2026-08-25-prehistoric-race-world-update-verification/
```

This run documents and verifies **PrehistoricRush playable race and streamed-world verification**.

## Racer controller foundation

The compatibility-first racer controller implementation and its validation record are documented here:

```txt
.agent/runs/2026-08-25-racer-controller-foundation/README.md
.agent/runs/2026-08-25-racer-controller-foundation/validation.md
```

Velociraptor remains the only production-playable body. Triceratops is a controller-only extension proof until its procedural body, rig, collision, and presentation are validated.

The active route is now:

```txt
menu.html
  -> game.html
  -> src/pages/game.js
  -> src/game-runtime-semantic-v2.js
  -> Nexus World + Course + Player + Renderer
  -> streamed terrain and forest patches
  -> framebuffer and Headless Editor evidence
```

The character-selection card remains menu-only. The race page is the authoritative playable result. World-update proof must show that player traversal changes Nexus World focus, updates local patch plans, retains the terrain ring and forest patches, and produces no streaming holes.

## Kit registry

```txt
.agent/kit-registry.json
```

The registry is historical kit ownership data. The active verification authority is now the playable race and streamed-world evidence run linked above.

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

Run the `PrehistoricRush Playable Race + Streamed World Verification Gate`:

```txt
preserve menu.html as selection-only
make game.html the primary playable result
preserve current Nexus World, Course, Player, Camera, HUD, and Renderer ownership
update Nexus World focus when traversal crosses a world cell
expose world revision, focus cell, terrain patch IDs, forest patch IDs, and streaming-hole count
verify seeded terrain/forest patch plans before and after movement
capture world-before, race-before, race-after, and world-after-movement framebuffers
verify character visibility, course visibility, movement, camera follow, HUD, and card absence
run the pinned NexusEngine-Editor nine-stage Headless lifecycle
verify Pages deployment and the deployed game URL
```

Do not add a parallel world manager or redesign the visible race first. Keep the change limited to world-update authority, diagnostics, evidence, documentation, and deployment validation.
