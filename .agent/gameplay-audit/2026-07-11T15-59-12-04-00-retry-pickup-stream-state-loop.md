# Retry Pickup / Stream State Loop

**Timestamp:** `2026-07-11T15-59-12-04-00`

## Summary

Retry creates a fresh gameplay ledger but does not force world-consumer reprojection. This is a gameplay correctness bug, not only a diagnostics concern.

## Reproduction model

```txt
1. Start run.
2. Prime center patch.
3. Collect shard S.
4. collectShard(S) adds S to collectedShardIds.
5. adapter.refreshDynamicContent removes S from view.pickups and shard instances.
6. Fail or finish without moving far enough to change active patch membership.
7. Retry.
8. game.start creates collectedShardIds=[].
9. updateStreaming sees the same active patch set.
10. No release/activation means rebuildActiveContent is not called.
11. S remains absent although the new run has not collected it.
```

## Other gameplay leakage

```txt
host input.left/right/boost can survive the run command
old physics contacts can be observed after reset
old collider membership can remain fatal
old Worker results can alter streaming after the new run starts
old committed-frame or host observations can be mistaken for new-run state
```

## Required game result

```txt
ResetRunResult {
  accepted
  predecessorRunSessionId
  runSessionId
  runEpoch
  streamEpoch
  colliderEpoch
  workerGeneration
  frameEpoch
  resetReceipts
  firstCommittedFrameId
}
```

A run is not playable until every required reset receipt and the first committed frame acknowledgement exist.
