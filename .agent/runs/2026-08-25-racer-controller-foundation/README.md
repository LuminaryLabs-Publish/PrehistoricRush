# PrehistoricRush Racer Controller Foundation

**Date:** `2026-08-25`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

**Status:** `implemented-and-scope-validated`

## Summary

The production Velociraptor now runs through one data-driven racer controller. Gameplay tuning, actor binding, presentation, camera framing, stamina, active ability, and passive ability are resolved from an immutable `RacerProfile` rather than hard-coded inside the Player implementation.

The legacy `createPrehistoricRushPlayerImplementation()` export remains as a compatibility wrapper. Its default Velociraptor movement matches the prior controller at every recorded deterministic checkpoint.

## Authority map

```text
RacerProfile
  -> actor binding
  -> shared racer controller
  -> ability/passive registry
  -> racer presentation
  -> camera framing

normalized intent
  -> shared racer controller
  -> Nexus motion intent
  -> race gameplay state
  -> renderer and world focus
```

The cosmetic player profile remains separate and continues to own only the procedural body recipe.

## Current profiles

| Racer | State | Purpose |
| --- | --- | --- |
| Velociraptor | `playable` | Production default with exact legacy movement parity |
| Triceratops | `controller-proof` | Non-live proof of different speed, turning, terrain response, stamina, charge, passive, actor, presentation, and camera data |

`controller-proof` profiles cannot enter the production route. This prevents a gameplay profile from selecting a body or rig that the live procedural creature kit cannot build yet.

## Extension contract

Add a racer by defining:

- one validated `RacerProfile`;
- one registered active ability, when required;
- one registered passive, when required;
- one compatible procedural body and pose provider before changing availability to `playable`.

Do not subclass the controller. Player, AI, replay, and tests provide the same normalized intent:

```js
{ steer, boost, jump, ability }
```

## Live input

- `A` / Left Arrow: steer left
- `D` / Right Arrow: steer right
- `W` / Up Arrow: boost
- Space: jump
- `E`: active ability

Velociraptor Vine Swing remains anchor-gated. The live route does not fabricate an anchor, so pressing `E` cannot alter normal movement until a course traversal-anchor provider is implemented.

## Deferred by design

- Triceratops procedural body, rig, collision contact, and live selection
- Vine Swing traversal-anchor provider
- Charge Ram collision results
- menu roster UI and selected-racer persistence
- AI intent providers and twelve-racer spawning
- complete twelve-profile catalog
- canonical resolution of the Compsognathus roster conflict

World streaming, terrain ownership, forest generation, the shared GPU wrapper, legacy runtimes, and workflow files were not changed.
