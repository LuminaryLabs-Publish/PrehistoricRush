# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T13-58-35-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `0c181c308716eb4a143768a0c674177c33c2264c`  
**Status:** `player-character-composition-transition-authority-central-reconciled`  
**Technical status:** `player-character-composition-transition-authority-audited`  
**Retained audits:** `terrain-aware-hind-leg-ik-central-reconciled`, `authoritative-player-pose-publication-central-reconciled`, `collision-source-convergence-publication-central-reconciled`, `browser-input-core-input-adoption-central-reconciled`, `game-viewport-render-surface-central-reconciled`, `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`, `browser-runtime-lifecycle-authority-audited`

## Summary

PrehistoricRush now composes the playable dinosaur and creator preview through Core Creature, Core Character and Core Player. Neutral creature definitions own body/rig references, support anchors and presentation hints; active characters own runtime bindings; players own possession and control authority.

The remaining boundary is atomic composition adoption. The product helper registers the rig, creature, character and optional player sequentially. The creator performs those mutations before topology validation, successor mesh preparation, crossfade completion and camera-framing adoption. Registry state can therefore identify a successor profile while the visible preview or durable profile still identifies the predecessor.

## Plan ledger

**Goal:** preserve the new bounded Core composition and add one product transaction for participant preparation, typed conflict policy, atomic adoption, rollback and first-visible-frame proof.

- [x] Compare all ten Publish repositories and exclude `TheCavalryOfRome`.
- [x] Confirm nine eligible central ledger and root `.agent` entries.
- [x] Select only PrehistoricRush because it had the oldest central timestamp and 18 newer source/test commits.
- [x] Reconcile Core Creature/Character/Player, player-character composition, creator support placement, framing and tests.
- [x] Preserve the full interaction loop, domain map and 52-surface service inventory.
- [x] Add the `2026-07-13T13-58-35-04-00` tracker and audit family.
- [x] Refresh every required root `.agent` file and machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement atomic composition and executable failure/browser fixtures later.

## Current audit family

```txt
.agent/trackers/2026-07-13T13-58-35-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T13-58-35-04-00.md
.agent/architecture-audit/2026-07-13T13-58-35-04-00-player-character-composition-transition-dsk-map.md
.agent/render-audit/2026-07-13T13-58-35-04-00-composition-visible-preview-coherence-gap.md
.agent/gameplay-audit/2026-07-13T13-58-35-04-00-core-player-character-composition-loop.md
.agent/interaction-audit/2026-07-13T13-58-35-04-00-profile-composition-transition-result-map.md
.agent/character-composition-audit/2026-07-13T13-58-35-04-00-registry-support-preview-atomicity-contract.md
.agent/deploy-audit/2026-07-13T13-58-35-04-00-character-composition-fixture-gate.md
.agent/central-sync-audit/2026-07-13T13-58-35-04-00-player-character-composition-runtime-reconciliation.md
```

## Complete interaction loop

```txt
game boot
  -> profile and pinned runtime
  -> body and articulated rig
  -> Core Creature definition
  -> Core Character bindings
  -> Core Player possession
  -> controlled-character simulation and pose publication
  -> Three.js presentation

creator edit
  -> draft profile revision
  -> immediate live composition mutation
  -> support-anchor evaluation
  -> morph or crossfade preparation
  -> articulated pose, placement and camera framing
  -> visible applied revision
  -> delayed durable profile commit and second composition call
```

## Required parent domain

```txt
prehistoric-rush-player-character-composition-transition-authority-domain
```

```txt
PlayerCharacterCompositionCommand
  -> bind profile, engine and expected participant revisions
  -> prepare body, rig, creature, character and optional player candidates
  -> evaluate support anchors, bounds, topology, placement and framing
  -> reject stale, duplicate, conflicting or failed work without live mutation
  -> atomically adopt every registry participant or preserve every predecessor
  -> publish PlayerCharacterCompositionResult
  -> admit one preview transition generation
  -> acknowledge the first matching visible frame
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 18
official NexusEngine-Kits:         5
product/page/Worker kits:         15
external/host adapters:            9
proof kits:                        5
total surfaces:                   52
```

## Validation boundary

Documentation only. Source, tests, package wiring and pinned Core contracts were inspected through GitHub. No runtime, renderer, package or deployment source changed. `npm test`, browser composition failures, built output and Pages parity were not independently executed.