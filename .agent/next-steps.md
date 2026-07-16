# PrehistoricRush Next Steps

**Audit:** `2026-07-15T20-59-46-04-00`  
**Authority:** `prehistoric-rush-game-audio-event-projection-authority-domain`

## Summary

Add one revision-bound audio projection layer downstream of accepted gameplay events and state.

## Plan ledger

**Goal:** deliver reliable, bounded, lifecycle-safe game audio without coupling success cues to raw input or RAF frequency.

### Phase 1: Admission and context

- [ ] Add browser audio capability observation.
- [ ] Add explicit user-gesture unlock admission.
- [ ] Own one `AudioContext` generation with suspend, resume, close, and replacement results.
- [ ] Add master, category volume, and mute preferences.

### Phase 2: Semantic cue projection

- [ ] Add `AudioProjectionAdmissionCommand` and `AudioProjectionResult`.
- [ ] Bind document, runtime, run, committed-frame, event, camera, and policy revisions.
- [ ] Create stable cue descriptors for run start, movement, boost, jump, landing, surfaces, shard pickup, collision failure, victory, UI, and ambience.
- [ ] Consume accepted semantic events and committed state only.
- [ ] Reject stale, duplicate, muted, suspended, and retired work.

### Phase 3: Spatial and continuous audio

- [ ] Project listener transforms from the accepted camera revision.
- [ ] Project world-source transforms where spatial audio is authored.
- [ ] Key movement, boost, and ambience loops by run and projection generation.
- [ ] Settle loops on pause, blur, visibility, route exit, restart, and runtime replacement.

### Phase 4: Budgets and acknowledgements

- [ ] Add bounded pools, priorities, and voice budgets.
- [ ] Deduplicate by run, semantic event, cue descriptor, and policy revision.
- [ ] Publish `FirstAudibleCueAck`.
- [ ] Publish `FirstAudioVisualConvergenceAck`.
- [ ] Expose context, loop, cue, and budget diagnostics through the host snapshot.

### Phase 5: Fixtures

- [ ] Test unlock and rejected pre-unlock playback.
- [ ] Test start, jump, landing, boost, pickup, failure, win, and ambience cues.
- [ ] Test duplicate event and snapshot suppression.
- [ ] Test lifecycle settlement and run replacement.
- [ ] Test mute, volume, and budget persistence.
- [ ] Run `npm test`.
- [ ] Run source, built-output, and Pages parity fixtures.
