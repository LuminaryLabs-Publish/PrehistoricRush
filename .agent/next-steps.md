# PrehistoricRush Next Steps

**Audit:** `2026-07-14T03-39-56-04-00`  
**Authority:** `prehistoric-rush-player-character-profile-revision-admission-authority-domain`

## Summary

Keep the existing schema, store, creator and composition kits. Add only the identities, conflict rules, run sealing and proof needed for deterministic multi-document use.

## Plan ledger

**Goal:** make each profile update and run admission terminate with a typed result and immutable artifact.

### Phase 1: Identity

- [ ] Add writer ID, document generation, write ID and message ID.
- [ ] Fingerprint normalized profile payloads.
- [ ] Enforce one fingerprint per accepted revision.
- [ ] Add bounded profile journal readback.

### Phase 2: Write settlement

- [ ] Add expected-base revision and fingerprint.
- [ ] Implement compare-and-set around persistence.
- [ ] Return Accepted, Conflict, Duplicate, Stale, Failed or Retired.
- [ ] Define recovery after quota/storage failure.

### Phase 3: Event admission

- [ ] Suppress duplicate and out-of-order broadcast/storage events.
- [ ] Reject same-revision different-fingerprint events.
- [ ] Cancel or rebase pending creator writes explicitly.
- [ ] Retire listeners, timers and channel ownership on page shutdown.

### Phase 4: Run admission

- [ ] Re-read the accepted profile after providers are ready.
- [ ] Seal profile revision, fingerprint and body content hash.
- [ ] Keep active runs immutable under ambient profile events.
- [ ] Define restart/recompose policy for later edits.

### Phase 5: Presentation proof

- [ ] Bind creator preview submissions to accepted profile artifacts.
- [ ] Bind game renderer submission to RunCharacterArtifact.
- [ ] Publish first matching visible frame acknowledgements.
- [ ] Expose conflict and binding diagnostics through the host.

### Phase 6: Fixtures

- [ ] Run existing `npm test`.
- [ ] Add two-tab concurrent writer tests.
- [ ] Add storage/broadcast reordering tests.
- [ ] Add pending debounce versus remote-update tests.
- [ ] Add delayed-provider versus profile-update tests.
- [ ] Add visible preview/game frame correlation.
- [ ] Run built-output and Pages parity.
