# Render Audit: Double Rebuild and Visible Content Gap

**Timestamp:** `2026-07-12T07-09-49-04-00`

## Summary

The render host can rebuild all grass and shard instances twice in one RAF: once after releases and once after activating a ready patch. Only the final state is rendered, but both intermediate states mutate GPU-facing instance buffers and recompute bounds without a render revision or frame receipt.

## Plan ledger

**Goal:** require one coalesced render-content plan and one visible-frame acknowledgement for each committed active-content revision.

- [x] Trace grass, shard, tree and terrain mutations.
- [x] Trace render ordering relative to release and activation.
- [x] Identify missing render-content revision and frame correlation.
- [ ] Implement delta uploads and browser proof.

## Current frame path

```txt
release patches
  -> hide terrain slots
  -> release tree cells
  -> flush all tree batches
  -> rewrite all active grass matrices
  -> rewrite all uncollected shard matrices
  -> recompute grass and shard bounds

activate one patch
  -> upload terrain attributes
  -> replace tree cells
  -> flush all tree batches
  -> rewrite all active grass matrices again
  -> rewrite all uncollected shard matrices again
  -> recompute bounds again

render final scene
```

## Missing render evidence

```txt
render-content revision
patch-set digest
per-layer grass active count result
shard projection revision
matrix upload ranges
bounds revision
terrain slot revision
tree batch revision
visible frame ID
first-frame acknowledgement
```

## Required render contract

```txt
aggregate patch delta
  -> prepare terrain/tree/grass/shard render plan
  -> enforce capacities
  -> stage matrix and attribute updates
  -> commit one render-content revision
  -> render one frame
  -> acknowledge exact patch set and consumer revisions
```

## Proof matrix

```txt
release only
activation only
release plus activation in one frame
multiple releases plus one activation
no-op controller update
capacity pressure
stale plan rejection
consumer failure rollback
render/physics patch-set digest parity
first visible frame after commit
```

Documentation only. No render behavior changed.