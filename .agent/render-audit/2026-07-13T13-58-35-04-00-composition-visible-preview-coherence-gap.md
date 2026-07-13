# Render Audit: Composition and Visible Preview Coherence

**Timestamp:** `2026-07-13T13-58-35-04-00`

## Goal

Require the visible mesh, support placement, camera framing and Core registry readback to cite one accepted composition revision.

## Current render path

```txt
setTargetProfile(profile)
  -> compose(profile) mutates rig, creature and character registries
  -> targetRevision changes
  -> topology comparison
  -> compatible: mutate descriptor target and damp current mesh
  -> incompatible: create successor mesh and begin crossfade
  -> each RAF updates placement, pose, camera framing and renderer
  -> appliedRevision changes after visual convergence
```

## Coherence gap

The Core registries identify the successor profile before the visible transition is prepared or completed. `getCharacter()` resolves current live registry state through `coreCharacter.resolve()`, while `getMesh()` can still return the predecessor mesh during a crossfade. Camera framing reads creature presentation bounds from the live registry and combines them with the current mesh transform. Those values have no shared composition or presentation generation.

## Failure windows

```txt
composition succeeds, successor mesh creation fails
  -> Core registries identify successor
  -> predecessor mesh remains visible

composition succeeds, crossfade update fails
  -> registries identify successor
  -> two partial meshes may remain
  -> appliedRevision remains predecessor

composition succeeds, camera framing fails
  -> registry and mesh may identify successor
  -> camera may retain predecessor frame

rapid edits
  -> finishCrossfade force-adopts the prior target visually
  -> next composition mutates registries again
  -> no retired generation result identifies skipped frames
```

## Missing evidence

```txt
CompositionAttemptId: absent
CompositionRevision: absent
registry participant revisions in preview state: absent
support-anchor evaluation revision: absent
mesh candidate receipt: absent
crossfade generation: implicit only
camera framing revision: absent
visible mesh fingerprint: absent
first composed frame acknowledgement: absent
fallback/rollback projection: absent
```

## Required frame envelope

```txt
ComposedCharacterFrameEnvelope
  compositionAttemptId
  compositionRevision
  profileRevision
  creatureRevision
  characterRevision
  optionalPlayerRevision
  rigRevision
  supportAnchorRevision
  presentationBoundsRevision
  meshGeneration
  transitionGeneration
  cameraFramingRevision
  viewportRevision
  visibleFingerprint
```

## Required presentation result

```txt
Prepared
Adopted
Duplicate
Stale
Conflict
MeshPreparationFailed
TransitionFailed
FramingFailed
RolledBack
VisibleAcknowledged
```

## Completion gate

A creator frame is coherent only when registry readback, mesh geometry/materials, articulated pose, support placement and camera framing cite the same accepted composition revision, and the first complete rendered frame publishes a matching acknowledgement.