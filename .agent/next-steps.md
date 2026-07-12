# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T02-21-55-04-00`

## Summary

Implement one surface policy and transaction shared by the creator preview and gameplay renderer, then correlate each accepted surface revision with the first visible frame and detached public diagnostics.

## Plan ledger

**Goal:** prevent CSS size, device scale, physical buffer, camera projection, visible frames and public observations from diverging.

- [ ] Define one versioned render-surface policy.
- [ ] Assign stable creator and gameplay surface IDs.
- [ ] Capture CSS size and DPR in one observation.
- [ ] Add a named quality tier and maximum physical-pixel budget.
- [ ] Route creator `ResizeObserver` data through the authority.
- [ ] Observe the actual gameplay host instead of mutating from global window data directly.
- [ ] Coalesce duplicate resize ingress and reject stale runtime generations.
- [ ] Commit renderer size and camera projection under one atomic result.
- [ ] Read back actual drawing-buffer dimensions and accepted camera aspect.
- [ ] Publish a monotonic surface revision.
- [ ] Require the next rendered frame to acknowledge that revision.
- [ ] Add detached surface state to the committed read model.
- [ ] Execute creator, gameplay, DPR, pixel-budget and Pages fixtures.

## Required result

```txt
SurfaceCommitResult {
  status
  surfaceId
  revision
  runtimeGeneration
  observationSource
  policyVersion
  qualityTier
  cssWidth
  cssHeight
  deviceScale
  requestedPhysicalWidth
  requestedPhysicalHeight
  actualPhysicalWidth
  actualPhysicalHeight
  cameraAspect
  rejectionReason
}
```

## Ordered queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Render Surface Resolution and Frame Correlation
1. Route/Profile artifact proof
2. Creator draft/commit/preview authority
3. Patch activation/release
4. Collider replacement/admission
5. Run-step outcome and terminal frame
6. Stream cadence/time budget
7. World readiness
8. Committed frame/read model
8a. Public host gateway
9. Coordinated reset epochs
10. Lifecycle/disposal
```

## Required fixtures

```txt
surface policy canonicalization
creator container resize
game host resize
DPR increase and decrease
physical-pixel budget clamp
invalid or zero-area observation policy
stale observation rejection
duplicate resize coalescing
actual drawing-buffer readback
camera aspect/projection readback
creator/game policy parity
first frame after surface revision
late resize after disposal
Pages creator and gameplay smoke
```

Do not add another renderer, camera, observer loop or RAF. Adapt the existing owners.