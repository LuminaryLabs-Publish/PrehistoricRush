# Interaction Audit: Impostor View Continuity Command/Result Map

**Timestamp:** `2026-07-16T14-39-29-04-00`

## Command map

```txt
TreeImpostorViewContinuityCommand
  inputs:
    packageGeneration
    frameSetRevision
    treeId and bounds
    treeYaw
    cameraGeneration and position
    fidelityForm and formTransition
    priorContinuityState
    policyRevision

  admission:
    require exact package generation
    require valid unique frame records and UV rectangles
    reject stale camera, package, tree, or render evidence
    resolve lower and upper elevation rows
    resolve circular azimuth neighbors inside each row
    apply deadband or interpolation policy
    normalize weights and enforce frame-capacity budget

  result:
    TreeImpostorViewContinuityResult
      accepted/rejected
      generationDigest
      treeId and formId
      viewAzimuth and viewElevation
      admitted elevation rows
      exact frame IDs and UV rectangles
      normalized weights
      transition state and reason
      resultRevision
```

## Projection map

```txt
accepted result
  -> billboard instances
  -> exact frameRect attributes
  -> combined continuity × form-transition fade
  -> frame-binding digest
  -> rendered frame revision
  -> FirstContinuousImpostorFrameAck
```

## Rejection classes

```txt
stale package generation
missing or duplicate frame record
invalid UV rectangle
unsupported elevation coverage
stale camera or tree generation
non-normalized or over-budget frame weights
retired fidelity form
```

## Current mismatch

The runtime publishes an exact-frame acknowledgement after stateless nearest-row selection. It does not publish a result that explains row retention, row transition, interpolation weights, or rejection evidence.