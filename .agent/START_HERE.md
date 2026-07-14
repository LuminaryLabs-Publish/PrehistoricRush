# START HERE: PrehistoricRush

**Last aligned:** `2026-07-14T03-39-56-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `player-character-profile-revision-admission-authority-central-reconciled`  
**Technical status:** `player-character-profile-revision-admission-authority-audited`

## Summary

The current audit covers player-character profile convergence across menu, creator and game documents. Numeric revision, localStorage and BroadcastChannel are present, but concurrent writes, out-of-order events, delayed provider loading and visible character frames do not share one accepted profile artifact.

## Plan ledger

**Goal:** bind profile writes, cross-document admission, run composition and the first visible raptor frame to one immutable revision and fingerprint.

- [x] Compare 11 Publish repositories and exclude `TheCavalryOfRome`.
- [x] Confirm 10 eligible ledgers and root `.agent` states.
- [x] Select only PrehistoricRush by the oldest eligible timestamp.
- [x] Inspect store, menu, creator, preview and game bootstrap.
- [x] Preserve the full 59-surface inventory.
- [x] Add the `2026-07-14T03-39-56-04-00` audit family.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement profile settlement and executable browser proof later.

## Current audit family

```txt
.agent/trackers/2026-07-14T03-39-56-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-14T03-39-56-04-00.md
.agent/architecture-audit/2026-07-14T03-39-56-04-00-player-profile-revision-admission-dsk-map.md
.agent/render-audit/2026-07-14T03-39-56-04-00-profile-visible-character-frame-gap.md
.agent/gameplay-audit/2026-07-14T03-39-56-04-00-profile-run-admission-loop.md
.agent/interaction-audit/2026-07-14T03-39-56-04-00-cross-document-profile-result-map.md
.agent/profile-store-audit/2026-07-14T03-39-56-04-00-conflict-run-sealing-contract.md
.agent/deploy-audit/2026-07-14T03-39-56-04-00-profile-revision-fixture-gate.md
.agent/central-sync-audit/2026-07-14T03-39-56-04-00-profile-revision-central-reconciliation.md
```

## Required authority

```txt
prehistoric-rush-player-character-profile-revision-admission-authority-domain
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

## Retained audit families

Patch adoption, pause-menu lifecycle, player composition, terrain IK, player-pose provenance, collision convergence, Core Input, viewport, articulation, run lifecycle and browser-runtime retirement remain separate unresolved boundaries.
