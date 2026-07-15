# PrehistoricRush Known Gaps

**Audit:** `2026-07-15T04-03-03-04-00`  
**Status:** `creator-profile-navigation-commit-authority-central-reconciled`

## Summary

Creator edits can be visible in the preview while their delayed persistence remains pending. Menu and Play navigation are not gated by an accepted commit, so the destination can consume the predecessor stored profile.

## Plan ledger

**Goal:** keep draft, storage, navigation, composition, presentation, and proof gaps explicit.

### Draft and scheduler

- [ ] No stable creator document generation or mutation IDs.
- [ ] No explicit `DraftRevision` or typed dirty-state result.
- [ ] The persistence scheduler exposes no `flush`, `getPending`, `cancel`, or verified `dispose` contract.
- [ ] Timer supersession is implicit through `clearTimeout`.
- [ ] The status text is not bound to a commit result.

### Commit and storage

- [ ] No `CreatorProfileCommitCommand`.
- [ ] No `CreatorProfileCommitResult`.
- [ ] No expected-base compare-and-set at local navigation settlement.
- [ ] No verified readback after storage write.
- [ ] Storage unavailable and `setItem` failures have no typed terminal result.
- [ ] No payload fingerprint in commit receipts.
- [ ] No explicit reconciliation of a remote update with the pending local mutation.

### Navigation

- [ ] Menu and Play remain unconditional anchors while dirty.
- [ ] No pending-write prerequisite before route transfer.
- [ ] No duplicate navigation suppression.
- [ ] No route result carrying profile ID, revision, and payload hash.
- [ ] `beforeunload` disposes preview resources but does not flush the pending profile mutation.
- [ ] No pagehide settlement policy.

### Game composition and rendering

- [ ] Destination startup does not require an expected profile receipt.
- [ ] No profile payload hash to creature content-hash binding receipt.
- [ ] No accepted profile revision to character, player, and run sealing result.
- [ ] Creator frames do not identify draft versus committed profile state.
- [ ] No `FirstCommittedProfileFrameAck`.

### Tests and deployment

- [ ] `npm test` was not run in this audit.
- [ ] No immediate Play or Menu fixture within the debounce window.
- [ ] No keyboard or repeated-activation fixture.
- [ ] No pagehide or beforeunload fixture.
- [ ] No storage unavailable or quota-failure fixture.
- [ ] No BroadcastChannel/storage-event conflict fixture for pending local work.
- [ ] No destination receipt, body-hash, visible-frame, built-output, or GitHub Pages fixture.

## Retained gaps

Feedback surfaces, route progress, runtime-provider convergence, outcome settlement, cross-document profile revision admission, patch adoption, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run-start/restart, and browser-runtime retirement remain separate.