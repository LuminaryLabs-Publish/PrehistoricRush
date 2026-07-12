# Architecture Audit: Streamed Content / Outcome Parity DSK Map

**Timestamp:** `2026-07-12T11-21-01-04-00`

## Summary

PrehistoricRush has authoritative outcome resolution but no composed authority that binds stream membership, collider/pickup observations, committed outcomes and visible rendering to one immutable content revision.

## Plan ledger

**Goal:** define one parent domain that coordinates content identity, observation admission, participant preparation, atomic commit, rollback and visible-frame proof without creating a second simulation owner.

- [x] Trace current core-simulation, patch controller, content adapter, physics and renderer ownership.
- [x] Separate implemented services from missing authority services.
- [x] Define the parent domain and candidate kits.
- [x] Preserve existing kit ownership boundaries.
- [ ] Implement and validate the composed domain.

## Current ownership

```txt
Nexus Engine core-simulation
  owns proposal/observation resolution and committed outcome

seeded-world-patch-controller-kit
  owns desired membership, generation queue, cache, ready/released results

active-content-consumer-adapter
  owns active patch map, terrain/tree/grass/shard/pickup/collider materialization

core-physics + Rapier provider
  own installed body/collider state and physics frames

Three host adapter
  owns visible meshes, camera, render submission, HUD and public readback
```

## Missing parent domain

```txt
prehistoric-rush-streamed-content-outcome-parity-authority-domain
```

## Candidate DSK composition

```txt
identity
  active-content-revision-kit
  active-patch-set-digest-kit
  collider-set-digest-kit
  pickup-set-digest-kit
  stream-generation-kit
  active-content-snapshot-kit

admission
  stream-delta-command-kit
  stream-delta-admission-kit
  content-observation-context-kit
  mixed-content-revision-rejection-kit
  stale-worker-content-rejection-kit

preparation and commit
  content-prepare-plan-kit
  content-participant-result-kit
  content-physics-commit-kit
  content-physics-rollback-kit

observation and outcome
  physics-content-observation-kit
  fallback-content-observation-kit
  pickup-content-observation-kit
  outcome-content-provenance-kit

proof
  content-parity-observation-kit
  content-parity-journal-kit
  visible-content-frame-ack-kit
  released-collider-false-positive-fixture-kit
  activated-content-false-negative-fixture-kit
  browser-stream-outcome-parity-smoke-kit
```

## Required transaction

```txt
Observe/plan stream delta
  -> assign expected predecessor content revision
  -> prepare patch membership and materialization candidates
  -> compute patch/collider/pickup digests
  -> prepare physics collider candidate
  -> admit one immutable ActiveContentSnapshot for the tick
  -> collect physics, fallback and pickup observations against that snapshot
  -> resolve product outcome with content provenance
  -> atomically commit content and physics participants
  -> render the committed revision
  -> publish VisibleContentFrameAck

failure
  -> reject mixed or stale revisions
  -> discard candidate materialization
  -> preserve predecessor content and physics state
  -> publish typed failure and rollback observations
```

## Invariant

One committed outcome and its first visible frame must cite the same run epoch, simulation step, active-content revision, active patch digest, collider digest and pickup digest.
