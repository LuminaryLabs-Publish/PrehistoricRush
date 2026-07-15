# PrehistoricRush Next Steps

**Audit:** `2026-07-15T04-03-03-04-00`  
**Authority:** `prehistoric-rush-creator-profile-navigation-commit-authority-domain`

## Summary

Keep the responsive creator preview and debounced editing. Make explicit Menu and Play intents flush the complete candidate, verify one stored revision, transfer a receipt, seal the run character to it, and acknowledge the first matching frame.

## Plan ledger

**Goal:** remove timing-dependent profile loss without broadening Core or replacing the existing profile store.

### Phase 1: Draft and scheduler state

- [ ] Add stable mutation, document-generation, draft-revision, and dirty-state identities.
- [ ] Replace the raw timeout variable with a scheduler exposing `schedule`, `flush`, `cancel`, `getPending`, and `dispose`.
- [ ] Normalize the complete candidate before scheduling.
- [ ] Mark the draft clean only after verified stored readback.

### Phase 2: Commit authority

- [ ] Add `CreatorProfileCommitCommand` and typed terminal results.
- [ ] Bind each commit to the expected stored revision and latest mutation ID.
- [ ] Classify invalid, stale, conflicting, unavailable, quota-failed, duplicate, and superseded work.
- [ ] Reuse the retained profile-revision authority for concurrent document settlement.
- [ ] Expose recoverable failure state instead of silently navigating.

### Phase 3: Navigation admission

- [ ] Convert Menu and Play activation into `CreatorRouteIntent` commands while dirty.
- [ ] Await an accepted commit result before route ownership changes.
- [ ] Prevent repeated activation from producing duplicate writes or navigations.
- [ ] Carry profile ID, revision, and payload hash into destination startup.
- [ ] Keep pagehide/beforeunload handling as best-effort fallback only.

### Phase 4: Run sealing and presentation

- [ ] Verify the destination receipt against stored profile readback.
- [ ] Seal the accepted profile revision to creature body content hash, character ID, player ID, and run ID.
- [ ] Expose expected and accepted profile identities through public readback.
- [ ] Label creator preview frames as draft or committed.
- [ ] Publish `FirstCommittedProfileFrameAck`.

### Phase 5: Fixtures

- [ ] Add immediate Play and immediate Menu fixtures after each supported input.
- [ ] Add keyboard activation, repeated activation, pagehide, and beforeunload fixtures.
- [ ] Add localStorage unavailable and quota-failure fixtures.
- [ ] Add BroadcastChannel/storage-event conflict fixtures.
- [ ] Add destination receipt, body-hash, and visible-frame fixtures.
- [ ] Run `npm test`.
- [ ] Run source, static artifact, and GitHub Pages parity checks.