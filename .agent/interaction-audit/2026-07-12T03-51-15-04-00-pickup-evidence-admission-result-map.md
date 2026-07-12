# Interaction Audit: Pickup Evidence Admission and Result Map

**Timestamp:** `2026-07-12T03-51-15-04-00`

## Summary

The current shard interaction has no command envelope. A browser-side proximity branch passes only an ID to a boolean mutation service, so phase, descriptor, patch, player and frame evidence are not part of admission.

## Plan ledger

**Goal:** replace ambient caller trust with explicit shard-command evidence and typed accept/reject results.

- [x] Map current ingress and mutation.
- [x] Define required evidence and rejection reasons.
- [x] Define compatibility-adapter behavior.
- [ ] Implement command admission and result publication.

## Current map

```txt
browser RAF
  -> mutable view.pickups descriptor
  -> mutable game state position
  -> XZ distance branch
  -> collectShard(shardId)
  -> boolean true/false
```

The boolean cannot distinguish:

```txt
accepted
already collected
unknown shard
inactive patch
stale revision
wrong run
wrong phase
out of range
invalid identity
duplicate command
```

## Required evidence

```txt
runtime session and generation
run ID and phase
expected run-state revision
command ID and monotonic sequence
canonical shard identity
patch ID and activation revision
shard source fingerprint
authoritative player transform
shard transform and collection volume
source simulation/frame identity
```

## Admission sequence

```txt
receive command
  -> validate schema and capability
  -> validate session/generation
  -> validate active run and phase
  -> reject stale expected revision
  -> resolve identity from active-shard index
  -> validate patch activation and fingerprint
  -> capture player/shard transforms once
  -> evaluate 3D collection policy
  -> check prior command/identity receipt
  -> commit or reject with typed result
```

## Required rejection reasons

```txt
invalid-command
invalid-identity
stale-runtime-generation
wrong-run
wrong-phase
stale-state-revision
unknown-shard
inactive-patch
stale-active-shard-set
source-fingerprint-mismatch
out-of-range-horizontal
out-of-range-vertical
already-collected
duplicate-command
```

## Legacy adapter

`legacy-collect-shard-adapter-kit` may preserve the old API temporarily, but it must resolve a canonical active descriptor and construct a complete command. A bare unknown ID must never be converted into a successful award.

## Observation boundary

Public diagnostics should expose detached collection results and active-shard summaries, not raw engine or mutable adapter ownership.