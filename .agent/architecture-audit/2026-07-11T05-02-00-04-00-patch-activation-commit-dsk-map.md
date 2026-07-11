# Architecture Audit: Patch Activation Commit DSK Map

**Timestamp:** `2026-07-11T05-02-00-04-00`

## Summary

The existing controller correctly owns deterministic patch identity, desired sets, cache, generation queue, ready delivery and release scheduling. The missing parent boundary is a product-side transaction that admits patch content, prepares every consumer, commits them together and acknowledges the controller only after success.

## Plan ledger

**Goal:** Define a minimal composition that updates existing controller and host adapter responsibilities without duplicating the official seeded patch or instance-batch kits.

- [x] Preserve `seeded-world-patch-controller-kit` as scheduling and cache authority.
- [x] Preserve `instanced-render-batch-kit` as tree capacity and cell authority.
- [x] Preserve the product patch generator as deterministic content authority.
- [x] Separate delivery, admission, preparation, commit, acknowledgement and observation.
- [x] Define release as a transaction equal in rigor to activation.
- [x] Define rollback and retry outcomes.
- [ ] Implement the composition.
- [ ] Add deterministic fixtures.

## Current ownership

```txt
seeded-world-patch-controller-kit
  owns patch/cache identity
  owns desired active, retain and prefetch sets
  owns generation queue and ready delivery
  owns controller-active and released sets

prehistoric-patch-generator
  owns deterministic patch payload construction

createThreeAdapter
  owns activePatches
  owns terrain slot writes
  owns tree batch consumer calls
  owns grass and shard instance writes
  owns gameplay collider projection
  owns height sampling source

rapier-physics-domain-kit
  owns fixed-collider submission and physics contacts
```

## Current invalid boundary

```txt
controller.takeReadyPatches()
  -> controller marks patch active
  -> host begins consumer mutation

controller.takeReleasedPatchIds()
  -> controller clears release evidence
  -> host begins consumer retirement
```

The host has no way to reject a delivery while leaving the controller record ready, or to fail a release while retaining retriable release evidence.

## Required parent domain

```txt
prehistoric-patch-activation-authority-domain
```

## Required composition

```txt
prehistoric-patch-activation-authority-domain
  -> patch-content-schema-kit
  -> patch-content-admission-kit
  -> patch-consumer-capability-kit
  -> patch-activation-plan-kit
  -> patch-release-plan-kit
  -> terrain-slot-preflight-kit
  -> tree-batch-preflight-kit
  -> dynamic-instance-preflight-kit
  -> patch-collider-preflight-kit
  -> patch-height-preflight-kit
  -> patch-consumer-commit-kit
  -> patch-consumer-rollback-kit
  -> patch-controller-acknowledgement-kit
  -> patch-consumer-revision-kit
  -> patch-activation-result-kit
  -> patch-release-result-kit
  -> patch-parity-observation-kit
  -> patch-activation-journal-kit
  -> patch-activation-fixture-kit
```

## Update existing kits first

```txt
seeded-world-patch-controller-kit
  add peek or claim delivery without immediate active mutation
  add explicit acknowledgeActivation(id, result)
  add explicit rejectActivation(id, reason)
  add explicit acknowledgeRelease(id, result)
  retain backwards-compatible takeReadyPatches/takeReleasedPatchIds temporarily

instanced-render-batch-kit
  expose deterministic replace/release preflight
  return capacity and rejected-ID results before mutation

prehistoric-rush-domain-kit
  own product activation command/result events
  retain patch and run identity in gameplay outcomes

host adapters
  prepare detached render, collision and height plans
  commit only admitted plans
  return bounded results instead of mutating without acknowledgement
```

## Activation transaction

```txt
ready delivery
  -> validate patch schema and identity
  -> allocate activationId and candidate revision
  -> prepare terrain slot
  -> prepare tree cell replacements
  -> prepare grass and shard instance ranges
  -> prepare gameplay and Rapier colliders
  -> prepare height-source change
  -> reject without mutation on any failed preflight
  -> commit all consumers in deterministic order
  -> publish consumer revision
  -> acknowledge controller active
  -> publish first render/physics acknowledgement
```

## Release transaction

```txt
release candidate
  -> verify controller and consumer ownership
  -> prepare terrain retirement
  -> prepare tree cell release
  -> prepare grass, shard, collider and height rebuild
  -> commit consumer retirement
  -> acknowledge controller release
  -> retire resources and publish parity
```

## Required invariants

```txt
controller-active IDs == admitted consumer-active IDs
consumer revision changes once per committed transaction
failed preflight mutates no consumer
failed commit produces rollback or terminal fault result
release evidence remains retriable until acknowledged
all result rows contain patchId, cacheKey, activationId and revision
public observations are detached and JSON-safe
```

## Follow-on

Run-session reset must consume this transaction boundary rather than directly rebuilding active content. A retry can then request deterministic re-commit of run-owned dynamic consumers while retaining validated immutable patch payloads.