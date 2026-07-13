# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T16-41-10-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `66a219fea4bb886fb4fff41c9b31c67ba7e4eaee`  
**Status:** `non-blocking-pause-menu-command-lifecycle-authority-central-reconciled`  
**Technical status:** `non-blocking-pause-menu-command-lifecycle-authority-audited`  
**Retained audits:** `player-character-composition-transition-authority-central-reconciled`, `terrain-aware-hind-leg-ik-central-reconciled`, `authoritative-player-pose-publication-central-reconciled`, `collision-source-convergence-publication-central-reconciled`, `browser-input-core-input-adoption-central-reconciled`, `game-viewport-render-surface-central-reconciled`, `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`, `browser-runtime-lifecycle-authority-audited`

## Summary

PrehistoricRush now installs Core Presentation and a renderer-agnostic pause-menu child DSK. The menu intentionally does not stop simulation and provides bounded state, commands, events, snapshots and Core UI/Presentation descriptors.

The remaining gap is browser command and lifecycle ownership. Escape admission, runtime polling, the synchronization RAF, overlay DOM, retained gameplay input and immediate exit navigation live outside the DSK without command generations, terminal results, visible-frame evidence or cleanup receipts.

## Plan ledger

**Goal:** preserve the non-blocking menu while making input admission, semantic state, DOM projection, gameplay-input policy, exit settlement and host retirement one observable transaction.

- [x] Compare all ten Publish repositories and exclude `TheCavalryOfRome`.
- [x] Confirm nine eligible central ledger and root `.agent` entries.
- [x] Select only PrehistoricRush because it was two commits ahead of central tracking.
- [x] Reconcile Core Presentation, pause-menu DSK, browser host, preserved runtime and tests.
- [x] Preserve the complete interaction loop, domain map and 58-surface inventory.
- [x] Add the `2026-07-13T16-41-10-04-00` tracker and audit family.
- [x] Refresh all required root `.agent` files and registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement the lifecycle authority and executable browser/build/Pages fixtures later.

## Current audit family

```txt
.agent/trackers/2026-07-13T16-41-10-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T16-41-10-04-00.md
.agent/architecture-audit/2026-07-13T16-41-10-04-00-pause-menu-command-lifecycle-dsk-map.md
.agent/render-audit/2026-07-13T16-41-10-04-00-pause-overlay-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T16-41-10-04-00-non-blocking-menu-input-simulation-loop.md
.agent/interaction-audit/2026-07-13T16-41-10-04-00-pause-command-exit-settlement-map.md
.agent/pause-menu-audit/2026-07-13T16-41-10-04-00-command-generation-host-retirement-contract.md
.agent/deploy-audit/2026-07-13T16-41-10-04-00-pause-menu-fixture-gate.md
.agent/central-sync-audit/2026-07-13T16-41-10-04-00-pause-menu-runtime-reconciliation.md
```

## Complete interaction loop

```txt
boot
  -> load pinned runtime and profile
  -> compose Core game domains and Core Presentation
  -> install product run and pause-menu DSKs
  -> start simulation, streaming and Three.js RAF
  -> poll until the public runtime host exists
  -> install Escape listener and menu sync RAF

pause interaction
  -> DSK commits menu state and semantic event
  -> browser host projects overlay DOM
  -> simulation and gameplay rendering continue
  -> gameplay keyboard policy remains implicit

exit
  -> DSK emits one exit request
  -> browser host immediately navigates
  -> no terminal cleanup or settlement result
```

## Required parent domain

```txt
prehistoric-rush-pause-menu-command-lifecycle-authority-domain
```

```txt
PauseMenuCommand
  -> bind runtime, menu and host generations
  -> validate command ID and expected sequence
  -> commit or reject semantic state
  -> project one matching overlay revision
  -> apply explicit non-blocking gameplay-input policy
  -> publish terminal command result
  -> acknowledge the matching visible frame

accepted exit
  -> retire poll, RAF, listeners, DOM and runtime participants
  -> publish ExitSettlementResult
  -> navigate exactly once
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        6
total surfaces:                   58
```

## Validation boundary

Documentation only. Source, pinned Core Presentation, tests and package wiring were inspected through GitHub. No runtime, renderer, package or deployment source changed. GitHub reported no combined status checks; `npm test`, browser lifecycle fixtures, built output and Pages parity were not independently executed.