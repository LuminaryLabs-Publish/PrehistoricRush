# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T00-39-25-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Current implementation gate

```txt
PrehistoricRush Procedural Creature Consumption Authority
+ Pinned Module Graph / Descriptor-Adapter Fixture Gate
```

## Immediate companion gate

```txt
PrehistoricRush Core-Kit Consumption Authority
+ Kit-Graph / Thin-Adapter Fixture Gate
```

## Selection

The accessible `LuminaryLabs-Publish` inventory contains ten repositories. `TheCavalryOfRome` remains excluded. All nine eligible repositories are centrally tracked and have root `.agent` state.

`PrehistoricRush` was selected before the oldest-documented fallback because six runtime commits newer than its prior audit replaced the local procedural dinosaur generator with the official pinned `procedural-creature-body-kit`, added the product-owned player raptor preset, pinned the engine/kit sources and added the import map required by the shared kit.

Only `LuminaryLabs-Publish/PrehistoricRush` was changed.

## Read first

```txt
.agent/trackers/2026-07-11T00-39-25-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T00-39-25-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-11T00-39-25-04-00-procedural-creature-consumption-dsk-map.md
.agent/render-audit/2026-07-11T00-39-25-04-00-descriptor-three-binding-lifecycle-gap.md
.agent/gameplay-audit/2026-07-11T00-39-25-04-00-run-pose-collision-consumption-loop.md
.agent/interaction-audit/2026-07-11T00-39-25-04-00-input-run-pose-render-correlation-map.md
.agent/creature-system-audit/2026-07-11T00-39-25-04-00-body-preset-descriptor-adapter-contract.md
.agent/deploy-audit/2026-07-11T00-39-25-04-00-pinned-module-descriptor-fixture-gate.md
```

The prior core-kit composition and population-capacity audits remain active:

```txt
.agent/composition-authority-audit/2026-07-10T23-08-11-04-00-declared-installed-consumed-contract.md
.agent/population-system-audit/2026-07-10T22-42-00-04-00-capacity-generation-commit-contract.md
```

## Product read

`PrehistoricRush` is a browser 3D infinite runner composed through Nexus Engine. The player follows a deterministic route, steers and boosts, jumps over hazards, collects shards and reaches a distance goal while streamed terrain, trees and layered grass move around a procedural skinned raptor.

## Active interaction loop

```txt
index import map and pinned CDN loader
  -> install 12 core kits, seed-kit, procedural-creature-body-kit and prehistoric-rush-domain-kit
  -> normalize PLAYER_RAPTOR_PRESET
  -> generate deterministic body/skeleton/skinning/collision descriptor
  -> build Three SkinnedMesh and Rapier actor from that descriptor
  -> browser input forwards run intent
  -> engine.tick advances run state
  -> adapter updates terrain, population and physics
  -> official kit creates pose descriptor
  -> Three adapter applies pose and renders
  -> HUD and host publish aggregate state
  -> RAF repeats
```

## Current finding

The migration has the correct ownership split:

```txt
product repo owns raptor configuration
official kit owns reusable descriptor generation
game domain owns run state and player-creature selection
Three adapter owns renderer objects
Rapier adapter owns physics consumption
```

The route does not yet prove that chain. The import map and runtime constants are separate source authorities; descriptor validation, Three binding, pose application, Rapier collision, resource disposal and host readback have no typed correlated results. A visible raptor therefore does not prove source identity, hash continuity, skeleton/skin validity, collision parity or cleanup.

## Safe implementation order

```txt
1. One immutable module graph and source-admission result.
2. Product preset and descriptor validation with stable fingerprints.
3. Named Three prepare/update/dispose adapter and render-binding result.
4. Pose and collision consumption rows tied to run/frame sequence.
5. JSON-safe creature host observation and deterministic fixtures.
6. Reconcile creature consumption with the core-kit consumption ledger.
7. Restore immutable population capacities and atomic generation commit.
8. Add typed run commands, lifecycle disposal and committed-frame publication.
```

Do not reintroduce a local generator, move product raptor configuration into the shared kit, add new creature archetypes, or expand visuals before the current descriptor-consumption boundary is observable and tested.