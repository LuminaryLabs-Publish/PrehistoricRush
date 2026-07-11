# Project Breakdown: PrehistoricRush Player Profile Handoff

**Timestamp:** `2026-07-11T10-58-10-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

The new menu/profile/creator layer is present in source but does not form a complete product loop. The menu links to two absent HTML artifacts, while the game still uses the static player preset rather than the saved profile.

## Plan ledger

**Goal:** document one truthful menu → creator → committed profile → game creature/collision/frame path.

- [x] Compare the full Publish inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` due to newer undocumented runtime changes.
- [x] Inspect new page, schema and store source.
- [x] Inspect current game construction and host readback.
- [x] Inventory all domains, kits and services.
- [x] Add route, render, gameplay, interaction, profile and deploy audits.
- [x] Refresh required root `.agent` files.
- [x] Push documentation directly to `main`.
- [ ] Implement and execute route/profile fixtures.

## Interaction loop

```txt
menu loads saved profile
  -> projects active raptor
  -> links to absent creator/game pages

creator runtime, when hosted
  -> edits draft
  -> debounces final patch
  -> writes localStorage
  -> broadcasts update

game runtime, when hosted
  -> ignores saved profile
  -> constructs static preset creature
  -> runs patch streaming, physics and rendering
```

## Domains

```txt
route/page hosting
profile schema and normalization
persistence and cross-context sync
creator draft, controls and preview
menu projection
Nexus composition
creature generation and binding
Rapier physics
patch streaming and world consumers
run simulation, camera and rendering
host, lifecycle, validation and deployment
```

## Kit/service additions

```txt
player-character-schema-kit
  defaults, normalization, clamps, colors and merge

player-character-profile-store-kit
  load, save, patch, reset, subscribe, storage/BroadcastChannel sync and close

menu-page-kit
  profile projection and navigation

character-creator-page-kit
  draft controls, preview, debounce save, reset and remote projection

game-page-entry-kit
  existing game-runtime import
```

## Main finding

```txt
published entry now depends on page artifacts that are absent
saved profile is not admitted by the game
revision is not conflict-safe
creator debounce can drop cross-group edits
profile, creature, collision and frame have no shared identity
```

## Next safe ledge

```txt
PrehistoricRush Multi-Page Route Admission
+ Player Profile Commit and Game Binding Fixture Gate
```
