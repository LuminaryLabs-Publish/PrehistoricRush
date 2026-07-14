# Patch-Owned Streaming Fixture Gate

**Timestamp:** `2026-07-13T21-38-52-04-00`

## Summary

The new static test proves source structure and pinning. It does not execute the pinned kit, Worker, Three.js uploads, Rapier collider publication or failure recovery.

## Plan ledger

**Goal:** define the minimum executable proof required before patch-owned streaming can be treated as runtime-complete.

- [x] Inspect the new authority test and package wiring.
- [x] Separate static assertions from executable runtime proof.
- [x] Define source, runtime, browser, fault and deployment gates.
- [ ] Execute the gates in later implementation work.

## Existing static coverage

```txt
no rebuildActiveContent function
patch-owned maps exist
incremental ranges configured
replaceCell and releaseCell are used
changed ranges reach instanceMatrix update ranges
collider sync has one bounded call site
pickup refresh does not resync colliders
runtime delegates release and pickup IDs
stable-range kit revision is pinned
```

## Required executable fixtures

### Pinned-kit fixture

- [ ] Install the exact pinned `instanced-render-batch-kit` and `seeded-world-patch-controller-kit`.
- [ ] Activate and release the maximum active patch set.
- [ ] Verify stable cell ranges and non-overlap.
- [ ] Verify changed ranges touch only affected cells.
- [ ] Verify snapshot and stats revisions.

### Browser fixture

- [ ] Run real Worker and fallback generation paths.
- [ ] Cross patch boundaries repeatedly at normal and high speed.
- [ ] Collect shards while patch membership remains stable.
- [ ] Verify unrelated grass, tree and collider revisions do not change.
- [ ] Correlate accepted activation with a visible frame.

### Fault fixture

- [ ] Inject terrain-slot failure.
- [ ] Inject one tree, grass and shard flush failure.
- [ ] Inject Rapier collider publication failure.
- [ ] Inject late Worker completion after release and restart.
- [ ] Verify predecessor restoration and no orphaned ownership.

### Capacity fixture

- [ ] Force tree, grass and shard overflow.
- [ ] Verify explicit Complete or Degraded results.
- [ ] Verify mandatory collision and pickup consumers never degrade silently.

### Deployment fixture

- [ ] Run clean-checkout `npm test`.
- [ ] Run built-output smoke.
- [ ] Run GitHub Pages patch-boundary smoke.
- [ ] Confirm source, build and Pages use the same pinned kit revisions.

## Current non-claims

No claim is made for passing `npm test`, real incremental GPU uploads, Worker correctness, Rapier parity, rollback, visible-frame correlation, capacity behavior, built output or GitHub Pages parity.
