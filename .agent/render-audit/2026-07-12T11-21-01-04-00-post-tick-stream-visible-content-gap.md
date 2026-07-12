# Render Audit: Post-Tick Stream / Visible Content Gap

**Timestamp:** `2026-07-12T11-21-01-04-00`

## Summary

The renderer draws a content set that may have changed after the outcome tick. The visible frame has no receipt linking it to the patch, collider and pickup sets used during collision and pickup resolution.

## Plan ledger

**Goal:** make each rendered frame prove which committed simulation and content revisions produced its visible world.

- [x] Trace content rebuild, collider synchronization and render ordering.
- [x] Identify false-positive and false-negative visibility paths.
- [x] Define the missing render receipt.
- [ ] Add runtime frame correlation and pixel/browser proof.

## Current order

```txt
engine.tick(dt)
  -> outcome commit

post-tick host work
  -> optional pickup-driven rebuild
  -> patch release
  -> content rebuild and collider sync
  -> patch generation/activation
  -> content rebuild and collider sync
  -> renderer.render(scene, camera)
```

## Visible mismatch

```txt
released collider
  simulation: present
  rendered frame: absent

activated collider/pickup
  simulation: absent
  rendered frame: present
```

## Missing render evidence

```txt
render command ID
simulation revision
activeContentRevision
active patch digest
collider digest
pickup digest
camera revision
surface revision
render submission result
first visible frame acknowledgement
```

## Required receipt

```txt
VisibleContentFrameAck {
  frameId,
  runEpoch,
  tickRevision,
  simulationRevision,
  activeContentRevision,
  activePatchDigest,
  colliderDigest,
  pickupDigest,
  cameraRevision,
  surfaceRevision,
  submitted,
  presented
}
```

No visible correctness claim is valid until browser proof shows that released content cannot produce invisible failures and newly activated content cannot appear before admission.
