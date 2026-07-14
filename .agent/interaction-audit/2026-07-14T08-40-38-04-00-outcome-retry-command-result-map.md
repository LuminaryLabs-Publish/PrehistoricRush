# Outcome and Retry Command/Result Map

## Summary

Terminal resolution currently exposes events and scene transitions, while retry is a direct method call. Neither path has a complete command/result contract.

## Plan ledger

**Goal:** give terminal settlement and retry one explicit admission/result surface.

- [x] Map current producers and consumers.
- [x] Define terminal result classes.
- [x] Define retry result classes.
- [ ] Implement command handlers later.

## Current producers

```txt
core physics observation
fallback collision observation
product movement/pickup/goal proposals
resolution policy
cleanup transition system
browser button and keyboard handlers
```

## Current consumers

```txt
RunState resource
RunFailed, RunWon and ShardCollected events
Core Scene
Core Player and Core Character
HUD and renderer
streaming/camera restart adapters
public host readback
```

## Required results

```txt
RunOutcomeSettlementResult
  Accepted
  Duplicate
  Conflict
  Stale
  Incomplete
  Failed
  Retired

RunRetryResult
  Started
  Duplicate
  PredecessorMissing
  TerminalFramePending
  Stale
  Failed
  Retired
```

## Admission rules

```txt
one terminal outcome per RunId
collision priority remains authoritative
terminal StepId must match committed simulation frame
outcome artifact fingerprint must be stable
retry must cite accepted predecessor outcome
late terminal callbacks from predecessor are rejected
successor start cannot delete predecessor evidence
```

## Public readback

The host should expose the accepted outcome artifact, bounded history, current retry lineage and terminal frame receipt instead of requiring consumers to reconstruct them from unrelated snapshots.