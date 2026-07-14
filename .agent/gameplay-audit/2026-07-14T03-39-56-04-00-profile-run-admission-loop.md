# Player Profile Run Admission Gameplay Audit

**Timestamp:** `2026-07-14T03-39-56-04-00`

## Summary

The active run uses the profile loaded before asynchronous module imports. A newer saved profile can become authoritative during loading while the run still starts with the predecessor character.

## Plan ledger

**Goal:** seal the latest accepted profile only after providers are ready and before run composition mutates gameplay state.

- [x] Trace profile load into `createPrehistoricRushKitGraph`.
- [x] Confirm the game does not subscribe or revalidate.
- [x] Confirm the run starts immediately after composition.
- [ ] Add deterministic run admission and restart policy.

## Gameplay loop gap

```txt
profile A loaded
  -> remote providers begin loading
  -> creator saves profile B
  -> storage/menu now show B
  -> game providers finish
  -> engine composes A
  -> run begins and renders A
  -> no stale-profile result
```

## Required policy

```txt
new run:
  use latest accepted revision after provider readiness

active run:
  remain sealed to admitted artifact
  or apply an explicit restart/recompose command

late profile update:
  never mutate an active run implicitly
  return DeferredForNextRun, RequiresRestart or Rejected
```
