# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T10-58-10-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` is now a multi-page browser product with a menu runtime, a character-creator runtime, a shared browser profile schema/store, and the existing 3D game runtime. The current entry route is the menu, but its `game.html` and `charactercreator.html` destinations do not exist on `main`, and the 3D game still constructs its creature from the static `player-raptor-preset-kit` rather than the saved player profile.

The immediate authority gap is therefore route and profile handoff, not visual tuning. The product needs one admitted page manifest and one committed player-profile revision that the creator, menu, game, procedural creature descriptor, Rapier collision and rendered frame all acknowledge.

## Plan ledger

**Goal:** restore a truthful menu-to-creator-to-game loop and make one saved player-character revision the authoritative input to gameplay, collision and rendering.

- [x] Compare the complete accessible `LuminaryLabs-Publish` inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have a central ledger and root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` because runtime changes landed after its previous audit.
- [x] Inspect the new page runtimes, profile schema, profile store and current 3D game boot.
- [x] Identify the interaction loop, domains, kits and offered services.
- [x] Record route, persistence, synchronization, descriptor-binding and frame-correlation gaps.
- [x] Add a new timestamped tracker, turn ledger and system audits.
- [x] Change documentation only and push directly to `main`.
- [ ] Implement route admission and profile consumption fixtures.

## Selection result

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
central ledger entries: 9/9
root .agent state: 9/9
selected: LuminaryLabs-Publish/PrehistoricRush
selection rule: substantive runtime change after previous audit
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is changed in the Publish organization during this pass.

## Current route and interaction loop

```txt
index.html or menu.html
  -> src/pages/menu.js
  -> load browser profile
  -> subscribe to profile events
  -> render Active Raptor card
  -> Start Run href ./game.html             [target absent]
  -> Character Creator href ./charactercreator.html [target absent]

intended creator route
  -> src/pages/character-creator.js
  -> load profile into draft
  -> slider/color input mutates draft
  -> 140 ms debounce
  -> patch localStorage profile
  -> broadcast and notify listeners

intended game route
  -> src/pages/game.js
  -> src/game.js
  -> pinned Nexus Engine/Kits/ProtoKits/Three/Rapier
  -> prehistoric-rush-domain-kit
  -> static player-raptor-preset-kit
  -> procedural creature + Rapier actor
  -> patch streaming, gameplay, rendering and HUD
```

## Main findings

```txt
route admission:
  index is now the menu
  game.html is absent
  charactercreator.html is absent
  both primary menu actions resolve to missing files

profile consumption:
  schema and store exist
  creator and menu use them
  src/game.js does not import or load them
  gameplay still uses game.getPlayerBody() from the static preset

profile transaction:
  localStorage write has no typed result
  concurrent tabs can derive the same next revision
  debounce persists only the final patch object
  rapid edits across different profile groups can lose earlier unsaved changes

render/physics proof:
  no profile fingerprint
  no profile-to-creature descriptor result
  no accepted profile revision on Rapier collision
  no rendered-frame receipt names the profile revision
```

## Domains in use

```txt
multi-page route hosting and navigation
player-character schema, normalization and merge
browser profile persistence and revisioning
BroadcastChannel and storage-event synchronization
character-creator draft, debounce, controls and preview
menu profile projection
Nexus Engine composition and core domains
procedural creature generation, skeleton, skinning and pose
Rapier actor, collider and contacts
seeded patch streaming and world consumers
run lifecycle, movement, score and outcomes
Three rendering, grass, lighting, shadows and camera
HUD, public host, lifecycle, validation and Pages deployment
```

## Kits and services

New source-backed boundaries:

```txt
player-character-schema-kit
  default profile, normalization, clamping, color validation and deep merge

player-character-profile-store-kit
  load, save, patch, reset, subscribe, BroadcastChannel sync,
  storage-event sync and close

menu-page-kit
  profile card projection and route links

character-creator-page-kit
  draft editing, numeric/color controls, CSS preview, debounce save,
  reset and remote-update projection

game-page-entry-kit
  imports the existing 3D game runtime
```

Existing runtime inventory remains active: 12 Nexus Engine core kits; `seed-kit`; `procedural-creature-body-kit`; `instanced-render-batch-kit`; `seeded-world-patch-controller-kit`; `camera-smooth-follow-kit`; `prehistoric-rush-domain-kit`; route, preset, patch generator and Worker kits; Rapier and Three adapters; terrain, tree, grass, pickup, collider, height, camera, render, HUD and host kits.

## Priority order

```txt
P0 Multi-Page Route Admission + Player Profile Handoff Authority
P1 Seeded Patch Activation Commit Authority
P2 Visual Policy Graph Identity and Render-Frame Correlation
P3 Run Session Reset + Shared Epoch Authority
P4 Worker Quarantine + Ordered Runtime Disposal
```

## Read this pass first

```txt
.agent/trackers/2026-07-11T10-58-10-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T10-58-10-04-00.md
.agent/architecture-audit/2026-07-11T10-58-10-04-00-player-profile-handoff-dsk-map.md
.agent/render-audit/2026-07-11T10-58-10-04-00-profile-preview-game-frame-gap.md
.agent/gameplay-audit/2026-07-11T10-58-10-04-00-menu-creator-run-profile-loop.md
.agent/interaction-audit/2026-07-11T10-58-10-04-00-route-edit-save-consume-result-map.md
.agent/player-profile-audit/2026-07-11T10-58-10-04-00-cross-page-profile-commit-contract.md
.agent/deploy-audit/2026-07-11T10-58-10-04-00-page-route-profile-fixture-gate.md
```

## Do not start next with

- more creator controls before the game consumes a committed profile
- a second product-local creature generator
- route redirects that hide missing page artifacts
- treating `revision` alone as a collision-safe profile identity
- claiming creator-to-game continuity without route, persistence and frame fixtures
