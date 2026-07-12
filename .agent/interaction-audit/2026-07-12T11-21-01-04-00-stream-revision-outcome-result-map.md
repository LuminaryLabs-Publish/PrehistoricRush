# Interaction Audit: Stream Revision / Outcome Result Map

**Timestamp:** `2026-07-12T11-21-01-04-00`

## Summary

Browser input, the authoritative tick, streaming, physics, rendering and public readback communicate through mutable owners rather than one revisioned command/result chain.

## Plan ledger

**Goal:** define explicit command, admission, result and observation boundaries from stream planning through the visible response to player input.

- [x] Map current ingress and egress paths.
- [x] Identify ambient mutable state crossings.
- [x] Define command/result boundaries.
- [ ] Implement typed adapters and stale-result rejection.

## Current interaction map

```txt
keyboard/button
  -> mutable browser input object or direct game input patch
  -> engine.tick
  -> product proposals and physics observations
  -> committed outcome
  -> mutable adapter content rebuild
  -> patch-controller release/ready queues
  -> corePhysics.syncColliders
  -> Three render
  -> independent HUD and global host snapshots
```

## Missing command/result chain

```txt
StreamDeltaCommand
  commandId
  expectedRunEpoch
  expectedContentRevision
  focus observation
  ready/released patch candidates

StreamDeltaAdmissionResult
  accepted/rejected
  reason
  candidateRevision
  patch/collider/pickup digests

ContentParticipantResult
  participantId
  prepared
  predecessorRevision
  candidateRevision
  rollbackToken

OutcomeContentProvenance
  simulation result plus admitted content identity

VisibleContentFrameAck
  committed simulation and content revisions shown to the player
```

## Admission rules

```txt
reject a stream result from an older run epoch
reject a Worker result for a superseded controller generation
reject mixed collider/pickup observation revisions
reject a render command that does not cite the committed content revision
reject public readback that combines unrelated participant revisions
```

Button, keyboard, engine, Worker, physics and renderer adapters should remain thin. The parent authority owns semantic admission and correlation.
