# Terminal Outcome and Retry Gameplay Loop

## Summary

The gameplay loop resolves win and failure deterministically, but retry can replace the terminal state before a durable result is accepted or acknowledged.

## Plan ledger

**Goal:** make terminal settlement mandatory before successor-run admission.

- [x] Trace collision, pickup and goal priority.
- [x] Trace control suspension and scene transition.
- [x] Trace all retry inputs.
- [x] Identify predecessor-result loss.
- [ ] Add transactional outcome and retry commands later.

## Current terminal flow

```txt
movement proposal
pickup proposal
goal proposal
physics/fallback observations
  -> resolution policy
  -> collision: fail, reject pickups and goal
  -> otherwise accept unique pickups
  -> goal reached: win
  -> mutate RunState
  -> emit events
  -> publish transition
  -> disable control and suspend character
```

## Current retry flow

```txt
Retry/Run Again button, Enter or Space
  -> start()
  -> reset resolution
  -> advance spawn
  -> enable control
  -> replace run, input and pose resources
  -> increment RunId
  -> transition to game
  -> refresh streaming and reset camera
```

## Gaps

```txt
terminal result is not sealed
score is not a versioned rule
elapsed time is not included in RunWon
failure result lacks final distance/shards/elapsed summary
retry does not cite predecessor result
retry is not rejected while terminal frame is unacknowledged
no bounded result history
no exact replay input fingerprint
```

## Required terminal artifact

```txt
RunOutcomeArtifact
  outcomeId
  runId
  outcome: win | fail
  terminalStepId
  seed
  routeFingerprint
  configFingerprint
  profileRevision
  bodyContentHash
  scorePolicyRevision
  elapsed
  distance
  shards
  collision
  score
```

## Non-claim

The resolution policy is deterministic for the tested proposal set. Durable result settlement and retry lineage are not implemented.