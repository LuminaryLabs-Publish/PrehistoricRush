# START HERE: PrehistoricRush Pause Input and Simulation Arbitration

**Last aligned:** `2026-07-17T10-59-32-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed repository head:** `0194fc7b3962528cb5233d0180f7b33a30eb5050`  
**Reviewed runtime source revision:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`  
**Status:** `pause-overlay-input-context-simulation-arbitration-authority-audited`

## Summary

PrehistoricRush was selected as the oldest synchronized eligible Publish repository. The current Pause interface is explicitly non-modal and non-blocking: its full-screen overlay captures pointer input, but gameplay keyboard listeners and `engine.tick(dt)` remain active.

## Intent

Make the menu’s semantic promise, input ownership, simulation participation, focus behavior and visible frame agree through one pause generation.

## Checklist

- [x] Compare all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Work only on PrehistoricRush.
- [x] Preserve the complete 97-surface kit/service inventory.
- [x] Document the active pause interaction loop and source fixture.
- [x] Add the `2026-07-17T10-59-32-04-00` tracker and focused audit family.
- [ ] Implement accepted pause or explicit non-pausing-menu semantics.
- [ ] Execute browser, artifact and Pages fixtures.
- [ ] Complete the retained render-host retirement work.

## Read this pass first

```txt
.agent/trackers/2026-07-17T10-59-32-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-17T10-59-32-04-00.md
.agent/architecture-audit/2026-07-17T10-59-32-04-00-pause-input-simulation-dsk-map.md
.agent/render-audit/2026-07-17T10-59-32-04-00-pause-overlay-moving-world-frame-gap.md
.agent/gameplay-audit/2026-07-17T10-59-32-04-00-menu-open-active-run-loop.md
.agent/interaction-audit/2026-07-17T10-59-32-04-00-pause-context-command-result-map.md
.agent/pause-system-audit/2026-07-17T10-59-32-04-00-input-simulation-focus-contract.md
.agent/deploy-audit/2026-07-17T10-59-32-04-00-pause-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-17T10-59-32-04-00-oldest-selection-pause-arbitration-reconciliation.md
.agent/validation.md
```

## Required authority

`prehistoric-rush-pause-overlay-input-context-simulation-arbitration-authority-domain`

## Census

```txt
implemented named surfaces: 97
planned pause-arbitration surfaces: 19
retained planned render-host-retirement surfaces: 19
```

## Claim boundary

The pause policy mismatch is confirmed by source inspection. No runtime behavior changed, no incident was reproduced, and true-pause correctness, focus behavior, artifact parity, Pages parity and production readiness are not claimed.
