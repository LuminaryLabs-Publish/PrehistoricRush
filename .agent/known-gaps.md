# PrehistoricRush Known Gaps

**Audit:** `2026-07-14T03-39-56-04-00`  
**Status:** `player-character-profile-revision-admission-authority-central-reconciled`

## Summary

Profile persistence works in the common single-document path, but concurrent writers, delayed messages and game boot can diverge without explicit conflict or stale results.

## Plan ledger

**Goal:** keep every profile identity, conflict, lifecycle, run and proof gap explicit.

### Identity and sequencing

- [ ] No writer ID or document generation.
- [ ] No write/message ID.
- [ ] No payload fingerprint.
- [ ] No monotonic event admission.
- [ ] No duplicate or out-of-order classification.

### Settlement

- [ ] Revision allocation is not compare-and-set.
- [ ] Two writers may derive the same next revision.
- [ ] Same-revision conflicting payloads are not rejected.
- [ ] Storage failure has no typed durable result.
- [ ] Pending creator writes are not explicitly rebased after remote updates.

### Run composition

- [ ] Game profile is captured before asynchronous providers settle.
- [ ] No revalidation immediately before engine composition.
- [ ] No immutable RunCharacterArtifact.
- [ ] No explicit active-run policy for later profile updates.
- [ ] Profile revision and body content hash are not joined by a receipt.

### Presentation and lifecycle

- [ ] Creator status does not cite a profile/frame revision.
- [ ] Game frames do not acknowledge the admitted profile artifact.
- [ ] Menu and creator do not retain subscription disposers.
- [ ] `closePlayerCharacterProfileStore()` is not page-lifecycle governed.
- [ ] No first visible profile frame proof.

### Tests

- [ ] Existing tests were not run in this audit.
- [ ] No real multi-tab conflict fixture.
- [ ] No delayed-provider profile race fixture.
- [ ] No creator pending-write race fixture.
- [ ] No visible-frame or Pages parity fixture.

## Retained gaps

Patch adoption, pause-menu lifecycle, player composition transition, terrain IK, PlayerPose provenance, collision convergence, Core Input, viewport, articulation, run lifecycle and browser runtime retirement remain separate.
