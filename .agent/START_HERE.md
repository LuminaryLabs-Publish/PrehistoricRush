# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T21-38-52-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `patch-owned-streaming-adoption-authority-central-reconciled`  
**Technical status:** `patch-owned-streaming-adoption-authority-audited`  
**Retained audits:** `non-blocking-pause-menu-command-lifecycle-authority-central-reconciled`, `player-character-composition-transition-authority-central-reconciled`, `terrain-aware-hind-leg-ik-central-reconciled`, `authoritative-player-pose-publication-central-reconciled`, `collision-source-convergence-publication-central-reconciled`, `browser-input-core-input-adoption-central-reconciled`, `game-viewport-render-surface-central-reconciled`, `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`, `browser-runtime-lifecycle-authority-audited`

## Summary

PrehistoricRush now consumes streamed terrain, trees, grass, shards, colliders and pickups through explicit patch ownership. Stable per-cell instance ranges and changed-range GPU uploads replace the prior full active-world rebuild path.

The remaining gap is patch adoption atomicity. The controller marks a patch active before terrain, instance, physics and pickup consumers settle, and release intent is cleared before consumer retirement returns any result. No activation/release identity, rollback receipt or visible patch-frame acknowledgement exists.

## Plan ledger

**Goal:** preserve incremental patch ownership while making controller membership and every mandatory consumer settle under one revision-bound activation or release result.

- [x] Compare all ten Publish repositories and exclude `TheCavalryOfRome`.
- [x] Confirm nine eligible ledger and root `.agent` entries.
- [x] Select only PrehistoricRush because it was one substantive commit ahead of its documentation head.
- [x] Reconcile the extracted adapter, stable-range kit pin, runtime orchestration and authority test.
- [x] Preserve the complete interaction loop, domain map and 59-surface inventory.
- [x] Add the `2026-07-13T21-38-52-04-00` tracker and audit family.
- [x] Refresh all required root `.agent` files and registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement transactional adoption and executable Worker/WebGL/Rapier/Pages fixtures later.

## Current audit family

```txt
.agent/trackers/2026-07-13T21-38-52-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T21-38-52-04-00.md
.agent/architecture-audit/2026-07-13T21-38-52-04-00-patch-owned-streaming-adoption-dsk-map.md
.agent/render-audit/2026-07-13T21-38-52-04-00-patch-cell-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T21-38-52-04-00-streaming-membership-collision-pickup-loop.md
.agent/interaction-audit/2026-07-13T21-38-52-04-00-patch-activation-release-result-map.md
.agent/streaming-audit/2026-07-13T21-38-52-04-00-patch-generation-adoption-contract.md
.agent/grass-system-audit/2026-07-13T21-38-52-04-00-patch-cell-range-lifecycle.md
.agent/deploy-audit/2026-07-13T21-38-52-04-00-patch-owned-streaming-fixture-gate.md
.agent/central-sync-audit/2026-07-13T21-38-52-04-00-patch-owned-streaming-runtime-reconciliation.md
```

## Complete interaction loop

```txt
boot
  -> load pinned engine, kits, Three.js and Rapier
  -> compose Core and product domains
  -> create patch controller, Worker executor, stable instance batches and Three adapter
  -> prime center patch and start run

frame
  -> engine.tick(dt)
  -> refresh affected pickup shard cells
  -> update patch focus and desired membership
  -> release departed patch cells
  -> pump generation and activate bounded ready patches
  -> render and publish diagnostics

activation
  -> controller marks ready patch active
  -> adapter assigns terrain and patch-owned tree, grass, shard, collider and pickup state
  -> flush changed instance ranges and physics membership
  -> no terminal adoption result or visible-frame acknowledgement
```

## Required parent domain

```txt
prehistoric-rush-patch-owned-streaming-adoption-authority-domain
```

```txt
PatchActivationCommand
  -> bind controller revision, patch key and adapter generation
  -> prepare terrain, instances, physics and pickup consumers
  -> validate capacity and overflow policy
  -> commit controller membership and consumers together
  -> publish PatchActivationResult
  -> acknowledge the matching visible frame
  -> otherwise restore the predecessor

PatchReleaseCommand
  -> preserve durable release intent until consumer retirement settles
  -> commit controller and consumer release together
  -> publish PatchReleaseResult
  -> reject late predecessor callbacks
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        7
total surfaces:                   59
```

## Validation boundary

Documentation only. Source, pinned kit implementations, tests and package wiring were inspected through GitHub. The runtime commit had no combined status checks. `npm test`, Worker, WebGL, Rapier, fault-injection, built-output and Pages fixtures were not independently executed.
