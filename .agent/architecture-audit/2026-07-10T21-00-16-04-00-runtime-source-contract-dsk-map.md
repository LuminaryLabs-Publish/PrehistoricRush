# Architecture Audit: Runtime Source Contract DSK Map

**Timestamp:** `2026-07-10T21-00-16-04-00`

## Current composition

```txt
src/runtime.mjs
  -> src/game.js

src/game.js
  -> route-field-domain-kit
  -> surface-traversal-domain-kit
  -> forest-archetype-domain-kit
  -> grass-patch-domain-kit
  -> grass-wind-domain-kit
  -> procedural-dino-body-domain-kit
  -> Three.js
  -> Rapier
  -> rapier-physics-domain-kit
```

## Current authority map

| Concern | Actual owner | Competing declaration |
|---|---|---|
| movement tuning | inline `tuning.motion` | `runner-tuning.json` |
| terrain tuning | inline `tuning.terrain` | `runner-tuning.json` |
| forest density | inline `tuning.forest` | legacy generation/cutover files |
| scene state | inline `state.scene` | `game-scenes.json` and `scenes/*.json` |
| transitions | inline assignments in loop/start | `game-scenes.json.transitions` |
| active kit composition | direct imports | `kit-composition.json` |
| NexusEngine coordinate | not consumed | `game-scenes.json` and `kit-composition.json` |
| deployed artifact | Pages copy list | no runtime consumption ledger |

## Architectural problem

There are two apparent source graphs:

```txt
declared graph:
  NexusEngine @main
  core kits
  scene manifests
  tuning JSON
  cutover inventory

executed graph:
  src/game.js
  six local domain kits
  Three.js
  Rapier
  one external physics kit
```

Only the executed graph affects the product, but the declared graph is copied into the public artifact and appears authoritative to agents, maintainers, and tooling.

## Existing DSKs to update first

```txt
route-field-domain-kit
surface-traversal-domain-kit
forest-archetype-domain-kit
grass-patch-domain-kit
grass-wind-domain-kit
procedural-dino-body-domain-kit
```

These kits should remain intact. The source-contract work belongs around composition and admission, not inside their domain logic.

## Proposed narrow DSK layer

```txt
runtime-source-manifest-kit
  schema/version
  entrypoint
  active local kits
  external coordinates
  configuration sources
  scene source
  deployment source list

source-contract-validator-kit
  one owner per field
  declared-versus-consumed parity
  active-kit parity
  transition parity
  tuning parity
  immutable external coordinate policy

source-fingerprint-kit
  stable canonical serialization
  deterministic hash
  requested fingerprint
  resolved fingerprint

source-observation-kit
  JSON-safe requested/resolved rows
  consumed files
  ignored archival files
  validation errors
  host projection
```

## Required contract

```txt
every deployed authoritative file is consumed
or
every deployed unconsumed file is explicitly marked archival

every consumed file is declared
every active kit is declared
every external module has a resolved coordinate
every scene transition has one owner
every tuning field has one owner
```

## Order

Population-capacity authority remains the prerequisite runtime fix. Source-contract reconciliation is the next architecture slice because it prevents future edits from landing in dead configuration surfaces.
