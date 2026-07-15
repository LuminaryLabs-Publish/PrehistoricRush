# Render Audit: Draft Profile Visible Character Frame Gap

**Timestamp:** `2026-07-15T04-03-03-04-00`

## Summary

The creator preview renders the in-memory draft before the delayed persistence write is accepted. The game later renders from a separately loaded stored profile. No frame receipt proves these surfaces represent the same profile revision or creature body content hash.

## Plan ledger

**Goal:** require visible creator and game frames to identify the accepted profile artifact they present.

- [x] Trace creator preview target updates.
- [x] Trace delayed persistence.
- [x] Trace game startup profile loading and character composition.
- [x] Trace current public readback.
- [ ] Add profile-bound creator frame receipts.
- [ ] Add profile/body-bound game frame receipts.
- [ ] Add browser and Pages parity fixtures.

## Current frame path

```txt
creator input
  -> draft changes
  -> previewTransition.setTargetProfile(draft)
  -> Three.js preview renders candidate immediately
  -> storage commit remains pending

route change
  -> candidate may never reach storage
  -> game loads the predecessor stored revision
  -> character composition builds predecessor body
  -> Three.js game frame renders predecessor body
```

## Current evidence

```txt
creator preview status: Updating or Ready
game public readback: profileId and revision
player body readback: body ID, contentHash, topology
creator draft revision in frame: absent
creator stored revision in frame: absent
commit result in destination startup: absent
profile revision to body contentHash receipt: absent
first matching game frame acknowledgement: absent
```

## Required receipts

```txt
CreatorProfileFrameAck
  documentGeneration
  draftRevision
  committedProfileRevision
  profilePayloadHash
  previewCompositionRevision
  creatureContentHash
  frameId

FirstCommittedProfileFrameAck
  navigationResultId
  runId
  profileId
  profileRevision
  profilePayloadHash
  creatureContentHash
  characterId
  playerId
  presentationRevision
  frameId
```

A preview may intentionally display an uncommitted draft, but it must label that state as draft-only. A route destination may claim the selected character only after the accepted commit receipt and rendered body converge.