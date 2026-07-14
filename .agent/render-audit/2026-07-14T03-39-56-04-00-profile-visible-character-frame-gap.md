# Profile Revision Visible Character Frame Audit

**Timestamp:** `2026-07-14T03-39-56-04-00`

## Summary

The creator preview updates toward whichever profile event arrived last, and the game renderer uses the profile captured before provider loading. Neither surface emits a frame acknowledgement carrying profile revision, creature fingerprint and body content hash.

## Plan ledger

**Goal:** prove that the visible preview or active raptor frame matches one accepted profile artifact.

- [x] Inspect creator transition input and status projection.
- [x] Inspect game boot profile capture and public readback.
- [x] Confirm profile revision and body content hash are exposed separately.
- [ ] Add one renderer submission receipt and matching frame acknowledgement.

## Current gap

```txt
accepted profile event
  -> creator setTargetProfile(profile)
  -> transition and render
  -> status Ready or Updating
  -> no profile/frame correlation

game boot
  -> load profile
  -> await remote providers
  -> compose player body
  -> render frames
  -> host exposes profile revision and body content hash separately
  -> no binding receipt or first visible frame acknowledgement
```

## Required proof

```txt
ProfileVisibleFrameAck {
  surfaceId
  documentGeneration
  profileId
  profileRevision
  profileFingerprint
  bodyContentHash
  rendererFrameId
  result
}
```
