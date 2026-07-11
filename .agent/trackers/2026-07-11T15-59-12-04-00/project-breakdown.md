# Project Breakdown: PrehistoricRush Run / Stream Epoch Reset

**Timestamp:** `2026-07-11T15-59-12-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

The product resets gameplay state but not the full running world. Patch, Worker, physics, render-consumer, RAF and host objects survive retry without a shared epoch transfer. This tracker defines the missing atomic reset authority and a concrete pickup-projection failure.

## Plan ledger

**Goal:** document one Start/Retry transaction that produces a fresh run across every mutable consumer while preserving only explicitly reusable immutable world cache data.

- [x] Compare full Publish inventory and central ledgers.
- [x] Exclude `TheCavalryOfRome`.
- [x] Avoid active same-window work in `IntoTheMeadow`.
- [x] Select only `PrehistoricRush`.
- [x] Trace initial boot and repeated start paths.
- [x] Trace all retained run-scoped owners.
- [x] Identify interaction loop, domains, kits and services.
- [x] Define DSK/domain boundary.
- [x] Add render, gameplay, interaction, run-session and deploy audits.
- [x] Refresh root `.agent` routing files.
- [x] Push directly to `main`.
- [ ] Implement and execute reset/epoch fixtures.

## Selection snapshot

```txt
PrehistoricRush    2026-07-11T14-31-27-04-00 selected
MyCozyIsland       2026-07-11T14-41-28-04-00
TheOpenAbove       2026-07-11T14-50-59-04-00
HorrorCorridor     2026-07-11T15-01-33-04-00
PhantomCommand     2026-07-11T15-08-41-04-00
ZombieOrchard      2026-07-11T15-20-27-04-00
TheUnmappedHouse   2026-07-11T15-30-50-04-00
AetherVale         2026-07-11T15-38-27-04-00
IntoTheMeadow      active same-window documentation writes
TheCavalryOfRome   excluded
```

## Finding

```txt
new RunState != new runtime run
```

Only the game resource and engine input resource are replaced. Every other mutable owner remains live.

## Output

See the timestamp-matched architecture, render, gameplay, interaction, run-session, deploy and turn-ledger files.
