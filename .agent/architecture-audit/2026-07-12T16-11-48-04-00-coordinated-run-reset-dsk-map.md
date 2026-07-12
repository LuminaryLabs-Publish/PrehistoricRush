# Architecture Audit: Coordinated Run Reset DSK Map

**Timestamp:** `2026-07-12T16-11-48-04-00`

## Summary

PrehistoricRush has reset-capable product and engine services, but no parent domain owns restart admission or coordinates all participants under one generation. The browser host currently composes a partial reset procedurally.

## Plan ledger

**Goal:** define a bounded parent domain that coordinates run identity, participant preparation, atomic commit/rollback, stale-work rejection and visible-frame proof without moving domain-specific reset logic into one monolith.

- [x] Map current reset writers.
- [x] Map stateful participants.
- [x] Separate participant-owned reset logic from parent coordination.
- [x] Define commands, results, observations and fixtures.
- [x] Preserve runtime disposal as a separate terminal lifecycle.
- [ ] Implement the parent domain and adapters.

## Current ownership

```txt
prehistoric-rush-domain-kit
  owns product RunState/InputState replacement and runId increment

core-simulation-kit
  owns resolution state and committed simulation frames

core-motion-kit
  owns intents, trajectories, current frame and frame history

core-physics-kit
  owns provider, bodies, colliders, requests and physics frame

articulated-motion-domain-kit
  owns rigs, poses, targets and solved frames

articulated-dynamics-domain-kit
  owns physical articulations and frames

seeded-world-patch-controller-kit
  owns records, queues, inflight set, active/desired sets, cache and reset

message-worker-executor-adapter-kit
  owns pending request promises, message listener and Worker termination

active-content-consumer-adapter
  owns terrain slots, active patches, tree cells, grass, shards, pickups and collider projection

camera-smooth-follow-kit
  owns camera smoothing state and reset

Three/browser host
  owns renderer objects, animation time, RAF, listeners, HUD and public readback
```

## Missing parent

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
```

The parent must coordinate but not absorb participant internals.

## Proposed DSK composition

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
  run-restart-command-kit
  run-restart-admission-kit
  run-generation-kit
  reset-transaction-id-kit
  reset-participant-registry-kit
  reset-prepare-result-kit
  reset-commit-result-kit
  reset-rollback-kit
  stale-run-command-rejection-kit

  product-run-reset-participant-kit
  core-simulation-reset-participant-kit
  core-motion-reset-participant-kit
  core-physics-reset-participant-kit
  articulated-motion-reset-participant-kit
  articulated-dynamics-reset-participant-kit
  patch-controller-reset-participant-kit
  active-content-reset-participant-kit
  worker-generation-barrier-kit
  camera-reset-participant-kit
  renderer-reset-participant-kit
  input-reset-participant-kit

  public-host-reset-receipt-kit
  first-visible-run-frame-ack-kit
  run-reset-observation-kit
  run-reset-journal-kit
```

## Command

```txt
RunRestartCommand
  commandId
  source: menu | retry-button | keyboard | automation | test
  expectedRunId
  expectedRunGeneration
  requestedReason
  sequence
  issuedAtTickId
```

## Participant contract

```txt
prepareReset(context) -> ResetPrepareResult
commitReset(context)  -> ResetParticipantCommitResult
rollbackReset(context) -> ResetParticipantRollbackResult
```

Every result must carry:

```txt
resetTransactionId
previousRunId
nextRunId
previousRunGeneration
nextRunGeneration
participantId
previousRevision
nextRevision
status
fingerprint
issues
```

## Ordering

```txt
admit restart command
  -> freeze new browser/gameplay commands
  -> allocate next run generation
  -> prepare all participants without public commit
  -> validate required participants
  -> commit product and engine state
  -> commit stream/content/camera/renderer projections
  -> publish typed reset result
  -> reopen input for the new generation
  -> render and acknowledge first visible frame
```

## Rejection classes

```txt
active-run-restart-not-admitted
stale-expected-run
stale-command-sequence
participant-prepare-failed
participant-commit-failed
rollback-incomplete
worker-generation-stale
mixed-public-readback-generation
visible-frame-before-reset-commit
```

## Boundary

This domain must not own movement, physics integration, patch generation, camera interpolation or rendering. It owns only the transaction that tells those domains which run generation is current and whether a reset committed.