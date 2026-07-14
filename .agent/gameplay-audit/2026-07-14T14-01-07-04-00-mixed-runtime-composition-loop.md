# Mixed Runtime Composition Gameplay Loop

**Timestamp:** `2026-07-14T14-01-07-04-00`

## Summary

Gameplay is driven by an engine created from NexusEngine `682c9fa...`, while stable-kit and ProtoKit modules can create helpers or descriptors using the import-map revision `cf2fe3d...`. The current game relies on structural compatibility and does not settle provider identity before starting the run.

## Plan ledger

**Goal:** prevent gameplay from starting until every Core, product, stable-kit, and provider participant belongs to one accepted compatibility graph.

- [x] Trace route bootstrap into game composition.
- [x] Trace Core and product kit creation.
- [x] Trace Seed, Creature, streaming, camera, and Rapier dependencies.
- [x] Identify the missing pre-run provider admission result.
- [ ] Add mixed-revision rejection and same-revision success fixtures later.

## Current loop

```txt
load direct root runtime
  -> load stable kits and ProtoKits
  -> resolve their bare imports through an older import map
  -> verify required functions by shape
  -> compose engine
  -> install physics provider
  -> start run
  -> stream patches and render gameplay
```

## Risk boundary

Possible failure classes include:

```txt
definition objects created by a different runtime revision
factory behavior changed across revisions
namespace or capability contract drift
resource or event identity mismatch
fallback behavior masking incompatible providers
public diagnostics reporting only configured, not resolved, identities
```

No specific runtime failure is asserted. The source-backed finding is that mixed revisions are admitted without an explicit compatibility contract or result.

## Required gameplay gate

```txt
RouteProviderAdmissionResult.accepted
  -> Core and product composition may proceed
  -> Rapier provider may attach
  -> streaming controller may start
  -> run may allocate RunId
  -> input and RAF may begin

RouteProviderAdmissionResult.rejected
  -> no run state mutation
  -> no physics or Worker start
  -> no renderer submission lease
  -> DOM fallback and retry remain available
```
