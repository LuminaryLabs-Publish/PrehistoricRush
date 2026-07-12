# Deploy Audit: Pose Contract Browser Fixture Gate

**Timestamp:** `2026-07-12T14-10-22-04-00`

## Summary

The current `npm test` command validates outcome policy and player-articulation conversion only. It does not instantiate Three.js bone application, malformed pose admission, rig mismatch handling or visible-frame correlation.

## Plan ledger

**Goal:** prevent pose-contract or articulated-presentation claims from shipping without executable Node, browser and deployed Pages proof.

- [x] Inspect current package test surface.
- [x] Identify renderer and browser proof gaps.
- [x] Define local, browser and deployed fixture gates.
- [ ] Implement and run the gates.

## Existing proof

```txt
npm test
  -> prehistoric-rush-resolution-policy.mjs
  -> player-articulation.mjs
```

This proves product outcome logic and adapter-level rig/pose conversion. It does not execute the Three.js pose adapter or either visible page.

## Required local fixtures

```txt
valid Euler pose application
valid quaternion-array pose application
valid quaternion-object pose application
Euler/quaternion equivalent orientation
non-finite quaternion rejection
zero quaternion policy
incomplete quaternion object policy
unknown bone policy
absolute omitted-bone rest restoration
partial pose predecessor merge
wrong rig rejection
stale mesh generation rejection
typed application result contents
```

## Required browser matrix

```txt
creator legacy pose -> admitted result -> visible preview frame
game legacy pose -> admitted result -> visible player frame
articulated result -> admitted result -> visible player frame
profile replacement -> old pose rejected
run restart -> predecessor partial pose rejected
unknown/malformed pose -> no bone mutation
```

## Required Pages smoke

```txt
commit-pinned modules load
creator and game use the expected adapter revision
application result appears in detached diagnostics
visible frame cites the application result
no console error or NaN bone transform
```

## Release gate

Do not claim pose-contract completion, articulated rendering, creator/game parity or production readiness until all fixture groups pass against the exact deployed commit and the results are recorded with commit, route, browser and artifact identity.