# Run / Stream Epoch Reset DSK Map

**Timestamp:** `2026-07-11T15-59-12-04-00`

## Summary

The current product has a product-domain reset, not a composed runtime reset. This audit maps the authority that must coordinate gameplay, streaming, Worker execution, consumers, physics, camera and committed-frame ownership.

## Existing owners

```txt
prehistoric-rush-domain-kit
  RunState, InputState, numeric runId, start/fail/win/collect

seeded-world-patch-controller-kit
  desired/active/cache/queue/ready/release state

prehistoric-patch-worker
  process-lifetime generator and request/response loop

active-content consumer adapter
  activePatches, terrain slots, tree cells, grass, pickups, colliders

rapier-physics-domain-kit
  process-lifetime world, actor, fixed bodies/colliders and contacts

camera-smooth-follow-kit
  process-lifetime smoothing state with local numeric runId reset

browser host
  external input booleans, listeners, RAF and public owner exposure
```

## Required composed domain

```txt
prehistoric-rush-run-stream-epoch-authority-domain
```

## Candidate kits

```txt
runtime-session-id-kit
run-session-id-kit
run-epoch-kit
stream-epoch-kit
collider-epoch-kit
worker-generation-kit
frame-epoch-kit
run-reset-command-kit
run-reset-admission-kit
run-reset-plan-kit
input-reset-kit
patch-cache-policy-kit
patch-membership-reset-kit
pickup-projection-reset-kit
physics-reset-or-replacement-kit
camera-reset-ack-kit
stale-work-rejection-kit
run-reset-commit-kit
run-reset-result-kit
run-reset-journal-kit
retry-reset-parity-fixture-kit
```

## Ownership rules

```txt
runtimeSessionId
  browser-host lifetime

runSessionId/runEpoch
  one accepted Start/Retry/Run Again

streamEpoch
  controller claims and consumer membership

workerGeneration
  asynchronous patch requests and replies

colliderEpoch
  descriptor membership, Rapier membership and contacts

frameEpoch
  RAF candidates, stage receipts and committed read model
```

## Reuse policy

Immutable deterministic patch payloads may remain cached across runs when their source fingerprint matches. Mutable membership, pickup filtering, collider projection, actor state and frame observations must always be rebound or rebuilt under the new epoch family.

## Transaction

```txt
admit ResetRunCommand
  -> allocate staged identity family
  -> freeze predecessor admissions
  -> quarantine old Worker/controller/contact/frame evidence
  -> prepare gameplay, input, stream, consumer, physics, camera and frame reset
  -> validate every receipt
  -> commit one authority transfer
  -> publish ResetRunResult
  -> render and acknowledge first new-run frame
  -> retire predecessor handles
```

## Dependency rule

This domain consumes:

```txt
route/profile identity
patch activation/release results
exact collider replacement results
committed-frame results
```

It must not duplicate those implementations.
