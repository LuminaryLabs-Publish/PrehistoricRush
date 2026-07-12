# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T11-11-34-04-00`

## Plan ledger

**Goal:** close the stream/content parity gap without creating a second simulation or renderer owner in the browser host.

### Gate 0: preserve implemented outcome authority
- [ ] Keep movement, collision, pickup and goal arbitration in Nexus Engine `core-simulation`.
- [ ] Preserve collision-over-goal precedence and duplicate-pickup rejection.
- [ ] Keep the product policy renderer-agnostic.

### Gate 1: content snapshot identity
- [ ] Add monotonic `activeContentRevision`.
- [ ] Add deterministic active patch-set digest.
- [ ] Add collider-set and pickup-set digests.
- [ ] Include stream/controller generation and run epoch.
- [ ] Publish an immutable `ActiveContentSnapshot`.

### Gate 2: pre-tick admission
- [ ] Decide release/activation deltas before outcome observation.
- [ ] Prepare terrain/tree/grass/shard/pickup/collider changes without publishing them.
- [ ] Admit one content snapshot for pickup and collision sampling.
- [ ] Reject stale Worker and patch results.
- [ ] Bound activation/materialization work.

### Gate 3: outcome provenance
- [ ] Add content revision to run, pickup and goal proposal context.
- [ ] Add content revision to physics and fallback observations.
- [ ] Reject mixed-revision proposals/observations.
- [ ] Return typed content provenance in the product outcome result.
- [ ] Project the provenance into the public committed read model.

### Gate 4: atomic content and physics commit
- [ ] Commit active patches, visible instances and physics colliders together.
- [ ] Roll back all consumers when one participant fails.
- [ ] Retire predecessor tree cells, terrain slots and colliders exactly once.
- [ ] Coalesce release and activation into one materialization pass.

### Gate 5: visible-frame proof
- [ ] Add first-visible-frame acknowledgement with tick, simulation and content revisions.
- [ ] Prove released colliders cannot cause invisible failures.
- [ ] Prove newly visible colliders/pickups are not rendered before admission.
- [ ] Prove browser and deployed Pages behavior match.

## Candidate kit order

```txt
prehistoric-rush-streamed-content-outcome-parity-authority-domain
active-content-revision-kit
active-patch-set-digest-kit
collider-set-digest-kit
pickup-set-digest-kit
stream-generation-kit
active-content-snapshot-kit
stream-delta-command-kit
stream-delta-admission-kit
content-prepare-plan-kit
content-participant-result-kit
content-observation-context-kit
physics-content-observation-kit
fallback-content-observation-kit
pickup-content-observation-kit
mixed-content-revision-rejection-kit
outcome-content-provenance-kit
content-physics-commit-kit
content-physics-rollback-kit
stale-worker-content-rejection-kit
content-parity-observation-kit
content-parity-journal-kit
visible-content-frame-ack-kit
released-collider-false-positive-fixture-kit
activated-content-false-negative-fixture-kit
browser-stream-outcome-parity-smoke-kit
```

## Validation order

```txt
npm test
fixture:policy-baseline
fixture:released-collider-no-invisible-failure
fixture:activated-tree-not-visible-before-admission
fixture:activated-pickup-not-visible-before-admission
fixture:mixed-revision-rejection
fixture:content-physics-rollback
fixture:stale-worker-result-rejection
fixture:first-visible-content-frame
browser stream traversal matrix
Pages stream traversal smoke
```
