# Run Result, Score and Retry Contract

## Summary

This contract keeps the current resolution policy intact and adds a durable settlement layer above it.

## Plan ledger

**Goal:** make run results reproducible, queryable and safe across retry.

- [x] Define outcome identity and required fingerprints.
- [x] Define score-policy ownership.
- [x] Define retry lineage and retention.
- [x] Define terminal presentation acknowledgement.
- [ ] Implement the contract later.

## Invariants

```txt
one accepted terminal outcome per RunId
one score-policy revision per outcome artifact
all replay inputs are fingerprinted
terminal artifact is immutable
retry cites exactly one accepted predecessor
predecessor remains readable after successor starts
late predecessor work cannot mutate successor state
visible terminal frame cites the same outcome fingerprint
```

## Score policy

The current code reports distance and shards but does not define a score. A future policy must be explicit and versioned rather than inferred by UI consumers.

```txt
ScorePolicy
  id
  revision
  distanceWeight
  shardWeight
  elapsedPenalty
  collisionPenalty
  completionBonus
  clamp/rounding rules
```

## Persistence boundary

A persistence adapter is optional for gameplay, but the in-memory bounded journal is mandatory for authority. Persistence must use a versioned schema and cannot silently replace an accepted result.

## Retry boundary

Retry may reuse the same seed and configuration, but it must allocate a new RunId, cite the predecessor OutcomeId and publish a typed result after simulation, player, input, pose, camera and streaming participants settle.

## Diagnostics

Expose:

```txt
latestOutcome
outcomeHistory
scorePolicy
currentRunId
retryLineage
terminalFrameReceipt
rejectedTerminalWork
```