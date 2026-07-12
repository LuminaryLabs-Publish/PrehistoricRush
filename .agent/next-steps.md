# Next Steps: PrehistoricRush Player Character Profile Convergence

**Updated:** `2026-07-12T18-18-59-04-00`

## Plan ledger

**Goal:** replace read-increment-write profile persistence and best-effort creator debounce with one conflict-aware durable commit protocol, monotonic cross-tab projection and commit-bound game navigation.

### Gate 0: preserve current content

- [ ] Preserve the current v1 profile shape, defaults and field clamps.
- [ ] Preserve current creator controls, preview behavior and route structure.
- [ ] Preserve one immutable profile binding per active run.
- [ ] Keep profile authority separate from procedural creature and renderer implementation.

### Gate 1: freeze identities and schemas

- [ ] Add `writerSessionId`, `commandId` and command sequence.
- [ ] Add durable `commitId` and `profileFingerprint`.
- [ ] Define `PlayerProfileEditCommand`, `PlayerProfileResetCommand` and `PlayerProfileCommitResult`.
- [ ] Define expected predecessor revision/fingerprint fields.
- [ ] Define field-path patch schema and changed-path extraction.
- [ ] Define explicit schema migration/rejection policy.

### Gate 2: replace revision allocation

- [ ] Read one durable predecessor envelope.
- [ ] Validate expected predecessor before commit.
- [ ] Detect same-revision/different-fingerprint divergence.
- [ ] Allocate successor revision only after admission.
- [ ] Verify storage readback after write.
- [ ] Return typed durable, volatile, rejected or failed result.
- [ ] Never publish durable success before verified readback.

### Gate 3: define conflict and merge policy

- [ ] Compare changed field paths against the predecessor.
- [ ] Permit deterministic disjoint-field merge only under explicit policy.
- [ ] Reject overlapping stale field writes with conflict paths.
- [ ] Prevent stale nested-group patches from replacing remote subfields.
- [ ] Define reset as an exclusive profile-epoch barrier.
- [ ] Record merge/rejection decisions in a bounded journal.

### Gate 4: make delivery monotonic

- [ ] Publish one `PlayerProfileCommitEnvelope` per accepted commit.
- [ ] Include event ID, commit ID, writer, revision and fingerprint.
- [ ] Treat BroadcastChannel and storage events as delivery adapters.
- [ ] Deduplicate the same commit across both adapters.
- [ ] Reject lower revisions.
- [ ] Fault or reconcile same-revision/different-fingerprint events.
- [ ] Return a typed subscriber delivery result.

### Gate 5: replace creator timeout with a save lease

- [ ] Track local draft revision separately from durable profile revision.
- [ ] Give every scheduled save a lease ID and captured predecessor.
- [ ] Cancel or rebase the lease when a remote commit is admitted.
- [ ] Preserve disjoint local edits through explicit rebase.
- [ ] Surface overlapping conflict rather than silently overwriting.
- [ ] Project `Saving`, `Saved`, `Conflict`, `Volatile` and `Failed` from results.

### Gate 6: bind navigation to save outcome

- [ ] Intercept Play and Menu navigation while a save lease is unresolved.
- [ ] Flush and await commit, reject navigation, or explicitly choose predecessor policy.
- [ ] Clear/cancel timers during terminal creator disposal.
- [ ] Unsubscribe profile listeners on creator disposal.
- [ ] Include the accepted commit ID in route transition context.
- [ ] Add timeout/failure handling that never labels an uncommitted draft as saved.

### Gate 7: bind runtime and render proof

- [ ] Read and verify one durable profile envelope at game boot.
- [ ] Create `RuntimePlayerProfileBinding` with commit, revision and fingerprint.
- [ ] Pass that binding into engine composition and creature generation.
- [ ] Expose binding in `PrehistoricRushHost` readback.
- [ ] Publish the first menu, creator and game frame acknowledgements.
- [ ] Keep the active run stable even if later profile commits arrive.

### Gate 8: storage capability and lifecycle

- [ ] Classify unavailable, denied, quota, serialization and readback failures.
- [ ] Define explicit volatile-session behavior.
- [ ] Close BroadcastChannel only when store ownership ends.
- [ ] Keep per-subscriber disposal separate from global store shutdown.
- [ ] Define reset and page-unload ordering.

### Gate 9: executable proof

- [ ] Add same-predecessor conflicting-write fixture.
- [ ] Add same-predecessor disjoint-merge fixture.
- [ ] Add duplicate BroadcastChannel/storage delivery fixture.
- [ ] Add stale and same-revision-divergence fixtures.
- [ ] Add remote-update-during-debounce fixture.
- [ ] Add reset-during-debounce fixture.
- [ ] Add edit-then-immediate-Play/Menu fixtures.
- [ ] Add storage failure/readback mismatch fixtures.
- [ ] Add runtime profile-binding fixture.
- [ ] Add browser and deployed Pages first-frame matrices.

## Candidate kit order

```txt
prehistoric-rush-player-character-profile-commit-convergence-authority-domain
player-profile-writer-session-kit
player-profile-command-id-kit
player-profile-command-sequence-kit
player-profile-revision-kit
player-profile-content-fingerprint-kit
player-profile-edit-command-kit
player-profile-patch-schema-kit
player-profile-expected-predecessor-kit
player-profile-commit-admission-kit
player-profile-conflict-detection-kit
player-profile-conflict-policy-kit
player-profile-merge-plan-kit
player-profile-storage-write-result-kit
player-profile-storage-readback-kit
player-profile-commit-result-kit
player-profile-reset-command-kit
player-profile-reset-result-kit
player-profile-event-id-kit
player-profile-channel-envelope-kit
player-profile-monotonic-subscription-kit
player-profile-duplicate-delivery-rejection-kit
player-profile-stale-delivery-rejection-kit
creator-draft-revision-kit
creator-save-lease-kit
creator-save-rebase-kit
creator-save-flush-kit
creator-navigation-barrier-kit
runtime-player-profile-binding-kit
player-profile-visible-frame-ack-kit
player-profile-observation-kit
player-profile-journal-kit
```

## Validation order

```txt
npm test
fixture:profile-normalization-stability
fixture:same-predecessor-conflict
fixture:disjoint-field-merge
fixture:same-revision-fingerprint-conflict
fixture:duplicate-delivery-rejection
fixture:stale-delivery-rejection
fixture:remote-commit-during-debounce
fixture:reset-during-debounce
fixture:navigation-save-flush
fixture:storage-write-and-readback-failure
fixture:runtime-profile-binding
fixture:first-visible-profile-frame
browser multi-tab matrix
Pages multi-tab/navigation matrix
```

Do not remove current storage compatibility until the replacement proves normalized content parity, deterministic conflict handling and creator-to-game profile binding.