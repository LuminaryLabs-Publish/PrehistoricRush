# Project Breakdown: PrehistoricRush Run Session Reset Authority

**Timestamp:** `2026-07-11T02-48-17-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Plan ledger

**Goal:** Reconcile the full Publish inventory, select one repository, document its complete runtime/kit surface and identify the highest-value unowned authority boundary without changing product behavior.

- [x] Review all 10 accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Compare the nine eligible repositories with the central ledger.
- [x] Select `PrehistoricRush`, the oldest central entry and a repo with newer local audit state.
- [x] Inspect the active route, game domain, patch controller, Worker executor, Three adapter, Rapier adapter and deployment workflow.
- [x] Identify interaction loop, domains, services and all kits.
- [x] Identify the run/world ownership split and retry gap.
- [x] Add root and timestamped `.agent` documentation.
- [x] Prepare central ledger and internal change-log synchronization.
- [x] Use only `main`; create no branch or pull request.

## Inventory comparison

```txt
AetherVale          2026-07-11T02-10-13-04-00
HorrorCorridor      2026-07-11T01-10-28-04-00
IntoTheMeadow       2026-07-11T02-28-12-04-00
MyCozyIsland        2026-07-11T02-02-59-04-00
PhantomCommand      2026-07-11T01-20-51-04-00
PrehistoricRush     2026-07-11T00-39-25-04-00
TheOpenAbove        2026-07-11T00-49-45-04-00
TheUnmappedHouse    2026-07-11T01-38-28-04-00
ZombieOrchard       2026-07-11T01-31-15-04-00
TheCavalryOfRome    excluded
```

All nine eligible repositories were tracked and had root `.agent` state. `PrehistoricRush` had the oldest central timestamp and repo-local documentation newer than that central record.

## Interaction loop

```txt
pinned source graph
  -> install core and official kits
  -> create game, patch controller, Worker and consumers
  -> start run and prime streaming
  -> browser input
  -> engine tick
  -> stream focus/update/release/generate/activate
  -> terrain/tree/grass/shard/collider/height consumption
  -> Rapier collision and pickup outcomes
  -> creature pose, camera, render, HUD and host
  -> RAF
  -> start/retry can create a new run without resetting all owners
```

## Primary finding

`game.start()` establishes a new gameplay run but no authoritative runtime session. The deterministic patch cache may be reusable, but dynamic pickup visibility, physics contacts, input, camera, Worker admission and committed-frame evidence are not reset or reconciled as one transaction.

The concrete retry path can leave a previously collected shard hidden when the player retries without causing any patch activation or release, because active-content reconstruction is not called unconditionally on start.

## Required architecture boundary

```txt
prehistoric-rush-run-session-authority
  -> run identity
  -> world-cache retention policy
  -> dynamic-consumer reset transaction
  -> stream epoch admission
  -> stale-result quarantine
  -> first committed frame
  -> lifecycle observation
```

## Validation boundary

No runtime code changed. Source inspection only. Retry, stream-epoch, dynamic-content and lifecycle fixtures do not exist and were not run.
