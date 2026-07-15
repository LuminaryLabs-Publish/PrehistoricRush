# Oldest-Selection Accessibility Reconciliation

**Timestamp:** `2026-07-15T16-00-32-04-00`  
**Status:** `accessible-gameplay-projection-focus-authority-audited`

## Summary

The full current Publish inventory contains 11 repositories. `TheCavalryOfRome` was excluded. The remaining ten all have central ledger entries, root `.agent` state and current heads equal to their recorded repo-local documentation heads. PrehistoricRush was therefore selected by the oldest documented timestamp.

## Plan ledger

**Goal:** preserve one-project-at-a-time selection and provide the central repository with enough evidence to reproduce the choice.

- [x] Enumerate 11 current Publish repositories.
- [x] Exclude Cavalry of Rome.
- [x] Confirm ten eligible ledger files.
- [x] Confirm ten root `.agent/START_HERE.md` files.
- [x] Compare ten current heads with ten documented heads.
- [x] Select PrehistoricRush only.
- [x] Prepare central ledger and internal change-log reconciliation.

## Ordered eligible timestamps

```txt
PrehistoricRush   2026-07-15T10-58-45-04-00
HorrorCorridor    2026-07-15T11-39-04-04-00
TheOpenAbove      2026-07-15T12-02-38-04-00
ZombieOrchard     2026-07-15T12-39-01-04-00
TheUnmappedHouse  2026-07-15T12-59-24-04-00
PhantomCommand    2026-07-15T13-41-25-04-00
AetherVale        2026-07-15T14-01-52-04-00
TheLongHaul       2026-07-15T14-40-11-04-00
MyCozyIsland      2026-07-15T15-01-22-04-00
IntoTheMeadow     2026-07-15T15-41-21-04-00
```

## Selected finding

```txt
selected repository: LuminaryLabs-Publish/PrehistoricRush
selection reason: oldest synchronized eligible central timestamp
new/ledger-missing: 0
root-agent-missing: 0
undocumented: 0
runtime-ahead: 0
current authority: prehistoric-rush-accessible-gameplay-projection-focus-authority-domain
```

## Central output

```txt
repo-ledger/LuminaryLabs-Publish/PrehistoricRush.md
internal-change-log/2026-07-15T16-00-32-04-00-prehistoric-rush-accessible-gameplay-projection-focus.md
```

## Boundary

This record documents selection and reconciliation only. It does not claim runtime accessibility implementation.