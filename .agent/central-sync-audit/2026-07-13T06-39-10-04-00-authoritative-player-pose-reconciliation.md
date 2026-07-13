# Central Sync Audit: Authoritative Player Pose Reconciliation

**Timestamp:** `2026-07-13T06-39-10-04-00`

## Summary

PrehistoricRush runtime advanced from the centrally recorded collision-convergence documentation head to a new authoritative player-pose implementation. This audit records the exact reconciliation boundary for `LuminaryLabs-Dev/LuminaryLabs`.

## Plan ledger

**Goal:** make repo-local root state, machine state, central ledger and internal change log cite the same reviewed runtime and audit generation.

- [x] Verify the Publish inventory contains ten repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Verify nine eligible root `.agent` entrypoints.
- [x] Verify nine eligible central ledger files.
- [x] Detect PrehistoricRush runtime head newer than its central documentation head.
- [x] Add repo-local tracker and audit family.
- [x] Refresh root state and machine registry.
- [x] Update central ledger and internal change log.
- [x] Push only to `main`; create no branch or pull request.

## Reconciliation evidence

```txt
prior central last updated: 2026-07-13T03-20-58-04-00
prior central repo-local documentation head: d109d7b531e879a0c58b8977bbaf655fe14ce43d
runtime revision reviewed: 3d448c4e26e8f68cb99de00564ac8dca42624a8d
new audit generation: 2026-07-13T06-39-10-04-00
```

## Runtime changes reconciled

```txt
PlayerPose resource added
player-pose service added
initial/start/tick authoritative solve added
clone-safe getPlayerPose readback added
snapshot playerPose added
renderer switched to getPlayerPose()
renderer uses damped pose application
static player-pose authority test added
npm test script extended
```

## Central records

```txt
repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
internal-change-log/2026-07-13T06-39-10-04-00-prehistoric-rush-authoritative-player-pose-reconciliation.md
```

## Validation boundary

This reconciliation documents source already present on `main`. It does not claim independent execution of `npm test`, browser rendering, built output or GitHub Pages.