# Render Audit: Profile Commit to Visible Creature Gap

**Timestamp:** `2026-07-12T18-18-59-04-00`

## Summary

Menu, creator preview and game rendering all display profile-dependent output, but none publishes a receipt joining the visible frame to one durable profile commit and content fingerprint.

## Plan ledger

**Goal:** require every profile-dependent visual surface to identify the committed profile that produced its first accepted frame.

- [x] Trace menu profile projection.
- [x] Trace creator draft and preview transition.
- [x] Trace game-boot profile loading and creature composition.
- [x] Identify stale/volatile visual states.
- [x] Define frame acknowledgement requirements.
- [ ] Implement and capture browser/Pages evidence.

## Current visual paths

```txt
menu
  -> load profile
  -> render material colors, scale, tail and revision
  -> apply every storage/broadcast profile event

creator
  -> update draft immediately
  -> animate preview toward draft before durable commit
  -> show Saving
  -> later attempt storage commit
  -> apply external profile events without monotonic admission

game
  -> load profile once
  -> compose procedural creature and physics descriptor
  -> render frames for that boot-time profile
  -> expose profileId and revision only
```

## Visible-state gaps

```txt
creator can show a draft that has not committed
creator can show Saved without a durable readback receipt
menu can regress to an older delivered revision
game can start from the predecessor profile during creator navigation
the same numeric revision can represent conflicting cross-tab snapshots
no surface cites commit ID, fingerprint or storage status
no first visible frame cites runtime profile binding
```

## Required frame evidence

```txt
ProfileProjectionFrameAck
  surface: menu | creator | game
  profileId
  profileCommitId
  profileRevision
  profileFingerprint
  projectionRevision
  renderFrameId
  status: draft | volatile | durable | rejected
  predecessorFrameId
```

## Required rules

```txt
menu accepts only monotonic nonduplicate commit envelopes
creator distinguishes draft preview from durable committed preview
Saved is projected only from PlayerProfileCommitResult
navigation to game cites the flushed commit or an explicit predecessor choice
game boot binds one immutable profile commit for the run
first game frame acknowledges the same profile fingerprint used for creature generation
public readback exposes commit/fingerprint, not revision alone
```

## Proof matrix

```txt
single-tab edit -> durable commit -> creator frame
creator edit -> immediate navigation -> game first frame
remote newer commit -> local pending save -> deterministic conflict result
BroadcastChannel and storage duplicate delivery -> one projected revision
stale event after newer event -> zero visual regression
storage write failure -> volatile/error projection, never Saved
deployed Pages behavior matches local browser behavior
```

No visual correctness claim is made until those fixtures produce retained frame evidence.