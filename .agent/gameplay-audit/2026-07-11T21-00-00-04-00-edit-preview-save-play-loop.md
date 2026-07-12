# Gameplay Audit: Edit, Preview, Save and Play Loop

**Timestamp:** `2026-07-11T21-00-00-04-00`

## Summary

The game now admits the saved creature profile, but the creator can temporarily display a draft that is not the profile the Play route will load. The player can therefore see one raptor in the preview and start a run with an earlier profile after rapid cross-group edits.

## Plan ledger

**Goal:** make the visible creator result and the next gameplay creature one committed identity.

- [x] Trace creator edit and save behavior.
- [x] Trace game profile loading and creature admission.
- [x] Identify preview/game divergence paths.
- [x] Define profile fingerprint handoff proof.
- [ ] Implement and execute parity fixtures.

## Current loop

```txt
creator draft
  -> immediate preview target
  -> delayed partial-patch save
  -> Play link can navigate at any time

game startup
  -> load localStorage profile
  -> pass profile.creature into product kit graph
  -> procedural creature descriptor
  -> shared Three mesh
  -> Rapier collision recommendation
```

## Divergence path

```txt
edit Size
  -> preview shows larger body
edit Skin before timer fires
  -> Size timer cancelled
  -> preview shows larger body + new skin
click Play after final save
  -> durable profile may contain old size + new skin
  -> game creates old-size raptor with new skin
```

The generator and renderer can be perfectly shared while the admitted profile differs.

## Missing handoff evidence

```txt
creatorSessionId
draftRevision
committedProfileRevision
profileFingerprint
descriptorFingerprint
collisionFingerprint
lastSavedPreviewFrameId
gameAdmissionResult
gameCreatureFrameReceipt
```

## Required play admission

```txt
Play request
  -> inspect creator save state
  -> flush complete canonical draft if dirty
  -> receive committed profile result
  -> require preview frame for committed profile fingerprint
  -> navigate with committed profile identity available

game startup
  -> load committed profile
  -> validate schema and fingerprint
  -> generate descriptor
  -> bind collision recommendation
  -> publish game admission result
  -> acknowledge first gameplay creature frame
```

## Required parity result

```txt
CreatorGameProfileParityResult {
  profileRevision
  profileFingerprint
  creatorDescriptorFingerprint
  gameDescriptorFingerprint
  creatorCollisionFingerprint
  gameCollisionFingerprint
  creatorFrameId
  gameFrameId
  matches
}
```

## Acceptance conditions

```txt
Play cannot silently leave a dirty draft behind
creator and game use the same committed profile fingerprint
descriptor and collision fingerprints match across pages
first gameplay frame acknowledges the admitted profile
rapid multi-group edits remain present after navigation
reset defaults produces identical creator and game descriptors
cross-tab conflict prevents ambiguous navigation
```