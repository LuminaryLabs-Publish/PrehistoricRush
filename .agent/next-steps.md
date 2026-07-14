# PrehistoricRush Next Steps

**Audit:** `2026-07-13T21-38-52-04-00`  
**Authority:** `prehistoric-rush-patch-owned-streaming-adoption-authority-domain`

## Summary

Patch-owned maps and stable cell ranges are implemented. Next work should keep those boundaries and add only the orchestration needed for revisioned activation, rollback, release settlement and visible-frame proof.

## Plan ledger

**Goal:** make each streamed patch either completely adopted, explicitly degraded under policy, or rejected with the predecessor restored.

### Phase 1: Identity and provenance

- [ ] Add `PatchActivationId`, `PatchReleaseId` and adapter generation.
- [ ] Bind controller revision, patch key, runtime session and run ID.
- [ ] Retain generation request and payload fingerprints through adoption.
- [ ] Reject stale Worker results and predecessor adapter callbacks.
- [ ] Add bounded activation/release journal readback.

### Phase 2: Preparation

- [ ] Reserve a terrain slot before controller membership commits.
- [ ] Prepare tree, grass and shard cell replacements without visible mutation.
- [ ] Prepare collider and pickup candidates by patch ID.
- [ ] Validate all fixed capacities and authored overflow policy.
- [ ] Return typed preparation results for every mandatory consumer.

### Phase 3: Commit and rollback

- [ ] Commit controller active membership and consumer revisions together.
- [ ] Return `PatchActivationResult` with complete consumer receipts.
- [ ] Restore predecessor maps, ranges, meshes and physics after failure.
- [ ] Preserve release intent until all mandatory retirement work settles.
- [ ] Return `PatchReleaseResult` and reject duplicate or stale releases.

### Phase 4: Presentation proof

- [ ] Bind terrain and instance revisions to one renderer submission.
- [ ] Publish `PatchVisibleFrameAck` for the matching activation.
- [ ] Classify Complete, Degraded, Partial, Failed, Stale or Retired.
- [ ] Preserve the last complete patch frame after partial failure.
- [ ] Expose patch-level readback through `PrehistoricRushHost`.

### Phase 5: Physics and gameplay parity

- [ ] Replace aggregate collider republish with a cell-diff result where supported.
- [ ] Bind height, collision and pickup queries to accepted membership revisions.
- [ ] Define whether gameplay may enter a patch before visible acknowledgement.
- [ ] Verify collected pickup changes never mutate unrelated patches.
- [ ] Verify mandatory gameplay consumers never silently degrade.

### Phase 6: Fixtures

- [ ] Run clean-checkout `npm test`.
- [ ] Execute the exact pinned official kits.
- [ ] Test Worker and fallback generation.
- [ ] Stress maximum active patches and every fixed cell capacity.
- [ ] Inject terrain, batch, GPU and Rapier failures.
- [ ] Test rapid boundary crossing, restart and late Worker completion.
- [ ] Correlate activation results with visible frames.
- [ ] Run built-output and GitHub Pages parity smokes.

## Retained priorities

Pause-menu command lifecycle, player-character composition, terrain-foot-target coherence, PlayerPose provenance, collision-source convergence, Core Input adoption, viewport authority and browser-runtime retirement remain unresolved independent boundaries. Patch adoption should cite those revisions rather than absorb their responsibilities.

## Completion gate

Do not mark patch-owned streaming complete until controller membership, terrain, instance cells, collision, pickups and the first matching visible frame settle under one terminal activation or release result, including injected failure and rollback proof.
