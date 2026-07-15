# Streamed Patch Activation Failure Loop

**Timestamp:** `2026-07-15T05-38-36-04-00`

## Summary

The first ready terrain patch enters the active adapter with 64-segment fields while the terrain slot remains 30 segments. The failure occurs during patch activation before terrain, vegetation, collision, pickup and frame settlement complete as one coherent adoption.

## Plan ledger

**Goal:** make ready-patch adoption all-or-nothing across terrain presentation and dependent patch membership.

- [x] Trace generation, ready queue and activation.
- [x] Trace terrain upload before vegetation and collision publication.
- [x] Identify missing rollback and terminal result.
- [ ] Implement transactional adoption and fixtures later.

## Interaction loop

```txt
controller produces ready patch
  -> adapter.activatePatch
  -> activePatches.set(patch.id, patch)
  -> applyTerrainPatch
  -> oversized color/normal upload rejects
  -> tree, grass, collider, pickup and ownership refresh do not complete
  -> activePatches already contains the candidate patch
  -> height sampling can resolve that patch even though presentation adoption failed
```

## Gameplay implications

The architecture permits mixed membership: a patch can become available to height sampling while its terrain mesh and dependent presentation membership did not settle. This audit does not claim a reproduced player fall, invisible collision or gameplay incident; it records the source-permitted partial-adoption state.

## Required settlement

```txt
prepare candidate terrain
prepare vegetation and pickup membership
prepare collider membership
validate all participant receipts
atomically publish active patch
otherwise retain predecessor and retire candidate
```

## Required fixtures

```txt
first center patch activation
failed terrain upload
activePatches rollback
height sampler excludes rejected patch
vegetation/collider/pickup membership remains coherent
retry with corrected schema
```

## Boundary

Documentation only. No gameplay behavior changed.