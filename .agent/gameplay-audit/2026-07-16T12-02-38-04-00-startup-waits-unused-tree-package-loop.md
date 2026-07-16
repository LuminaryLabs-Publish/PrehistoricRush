# Gameplay Audit: Startup Waits for an Unused Tree Package

**Timestamp:** `2026-07-16T12-02-38-04-00`

## Summary

The player cannot enter the run until the required tree bundle is ready, but the run does not consume that bundle. Startup latency and failure are therefore authoritative while gameplay fidelity remains bound to the legacy path.

## Plan ledger

**Goal:** make every required startup preparation correspond to an admitted gameplay or presentation dependency.

- [x] Trace game-route gating.
- [x] Trace package publication.
- [x] Trace patch generation and active tree rendering.
- [x] Define adoption settlement.
- [ ] Remove the unbound required-preparation state.

## Current loop

```txt
open game route
  -> create isolated asset/startup engine
  -> request five packages and manifest
  -> potentially build and capture five tree objects
  -> wait until required preparation resolves
  -> publish receipt to globalThis
  -> import game runtime
  -> ignore receipt
  -> generate patches from local treeTypes
  -> render legacy tree instances
```

## Gameplay risks

```txt
startup can be delayed by work that does not affect the run
capture/provider failure can block the run without a fidelity fallback policy
menu and game create separate asset runtimes
package revision is absent from world-generation identity
patch cache identity does not bind the tree package digest
same seed can present different intended asset generations without explicit invalidation
route exit does not settle asset-runtime ownership
```

## Required settlement

```txt
required preparation
  -> validated TreeFidelityPreparationResult
  -> accepted TreeFidelityAdoptionResult
  -> generator/cache identity includes package digest
  -> renderer adopts matching resources
  -> FirstTreeFidelityBoundFrameAck
```

A package that is optional must not block the run. A package marked required must have a proven consumer before startup is declared ready.