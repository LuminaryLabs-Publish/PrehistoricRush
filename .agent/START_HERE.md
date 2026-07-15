# START HERE: PrehistoricRush

**Last aligned:** `2026-07-15T04-03-03-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed repository head:** `34be1adad1ef169a14dd48d9e3016e9477684039`  
**Runtime source revision retained:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `creator-profile-navigation-commit-authority-central-reconciled`  
**Technical status:** `creator-profile-navigation-commit-authority-audited`

## Summary

The current audit covers creator-profile persistence during route navigation. Slider and color edits update the draft and Three.js preview immediately, but the store patch is delayed 160 ms. Menu and Play navigate normally, while `beforeunload` only disposes preview resources. The next route can therefore load the previous stored profile even though the creator visibly showed the newest draft.

## Plan ledger

**Goal:** make creator draft acceptance, durable profile storage, navigation, run-character sealing, and the first matching visible frame one transaction.

- [x] Compare all 11 Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm ten eligible ledgers, root `.agent` states, and synchronized heads.
- [x] Select only PrehistoricRush by the oldest eligible timestamp.
- [x] Trace creator input, debounce, store writes, route links, unload, destination load, composition, and readback.
- [x] Preserve the complete 59-surface inventory.
- [x] Add the `2026-07-15T04-03-03-04-00` audit family.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement explicit flush, route admission, profile sealing, and browser proof later.

## Main finding

```txt
creator input: updates draft and preview immediately
persistence: scheduled for 160 ms later
Menu/Play navigation: unconditional anchors
beforeunload: preview disposal only
pending write flush: absent
commit result: absent
destination expected revision: absent
game startup: loads stored profile once
profile-to-body binding receipt: absent
first committed profile frame acknowledgement: absent
```

## Current audit family

```txt
.agent/trackers/2026-07-15T04-03-03-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-15T04-03-03-04-00.md
.agent/architecture-audit/2026-07-15T04-03-03-04-00-creator-profile-navigation-commit-dsk-map.md
.agent/render-audit/2026-07-15T04-03-03-04-00-draft-profile-visible-character-frame-gap.md
.agent/gameplay-audit/2026-07-15T04-03-03-04-00-last-edit-navigation-loss-loop.md
.agent/interaction-audit/2026-07-15T04-03-03-04-00-creator-save-navigation-command-result-map.md
.agent/profile-store-audit/2026-07-15T04-03-03-04-00-debounce-flush-route-sealing-contract.md
.agent/deploy-audit/2026-07-15T04-03-03-04-00-profile-navigation-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-15T04-03-03-04-00-oldest-selection-profile-navigation-reconciliation.md
```

## Required authority

```txt
prehistoric-rush-creator-profile-navigation-commit-authority-domain
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        7
total surfaces:                   59
planned navigation-commit surfaces: 20
```

## Retained audit families

Feedback surfaces, route progress, runtime-provider convergence, outcome settlement, cross-document profile revision admission, patch adoption, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run-start/restart, and browser-runtime retirement remain separate unresolved boundaries.