# Retry Visible-State Membership Gap

**Timestamp:** `2026-07-11T15-59-12-04-00`

## Summary

A new product run can inherit prior-run render membership. Active terrain, trees, grass and shard instance buffers are process-lifetime. The new run resets its collected-shard ledger, but visible pickups are rebuilt only when patch membership changes or collection explicitly refreshes dynamic content.

## Current render path

```txt
retry
  -> new RunState with collectedShardIds=[]
  -> same activePatches
  -> same terrain slots/tree cells/grass/shard buffers
  -> updateStreaming
  -> no activation/release when desired membership is unchanged
  -> no rebuildActiveContent
  -> prior pickup visibility remains
```

## Required render reset receipt

```txt
runSessionId
runEpoch
streamEpoch
patchMembershipRevision
pickupProjectionRevision
colliderProjectionRevision
cameraResetRevision
frameEpoch
presentationFingerprint
```

## Required behavior

- Reproject pickups for every accepted new run, even when patch IDs are unchanged.
- Rebind terrain/tree/grass membership to the new stream epoch.
- Exact-replace collider projection before physics resumes.
- Reset creature pose and camera through typed acknowledgements.
- Publish no new-run frame until canvas and HUD consume the same run/frame epoch.
- Keep the predecessor committed frame visible if reset preparation fails.

## Fixture

Collect a known shard, finish/fail, retry at the same coordinates without changing active patch membership, and assert the shard is visible and collectible in the first committed new-run frame.
