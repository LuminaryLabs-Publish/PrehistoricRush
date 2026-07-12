# Render Audit: Post-Tick Stream / Visible Collider Gap

**Timestamp:** `2026-07-12T11-11-34-04-00`

## Plan ledger

**Goal:** require the visible frame to identify the same content and collider snapshot used by the committed simulation outcome.

- [x] Trace tick, streaming and render order.
- [x] Identify false-positive and false-negative visible states.
- [x] Define required frame provenance.
- [ ] Add executable frame-parity proof.

## Finding

The browser renders after patch release and activation, while collision and pickup resolution occurred before those mutations. The rendered frame can therefore show a different world than the one used by the committed outcome.

## Mismatch cases

### Released collider false positive

```txt
physics/fallback observation includes tree collider C
  -> policy commits run failure
  -> stream update releases C's patch
  -> active content and core-physics colliders are rebuilt
  -> renderer presents a frame without C
```

The player can see a failure whose obstacle is no longer visible.

### Activated collider false negative

```txt
tick does not include ready patch P
  -> policy commits continue
  -> stream update activates P
  -> tree collider C becomes visible and is synchronized to physics
  -> renderer presents C before any committed outcome has admitted it
```

### Activated pickup false negative

```txt
tick does not include pickup S
  -> stream update activates S's patch
  -> renderer presents S
  -> S is not eligible for collection until a later tick
```

## Missing visible proof

```txt
render frame ID
simulation step/revision
active content revision
active patch-set digest
collider-set digest
pickup-set digest
stream generation
camera revision
first-visible-after-content-commit acknowledgement
```

## Required render contract

```txt
VisibleContentFrameReceipt {
  frameId,
  simulationStepId,
  simulationRevision,
  activeContentRevision,
  activePatchSetDigest,
  colliderSetDigest,
  pickupSetDigest,
  streamGeneration,
  cameraRevision,
  presented: true
}
```

The renderer must reject or visibly quarantine a frame plan whose simulation and content revisions do not match the committed read model.
