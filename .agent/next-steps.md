# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T05-39-11-04-00`

## Summary

Keep the existing shared smooth-follow implementation. Add product-side target provenance, typed update/reset results, Three transform-consumption proof and rendered-frame correlation. Do not let this camera work displace the P0 seeded patch activation transaction.

## Plan ledger

**Goal:** Make every camera frame traceable from authoritative run/terrain state through the shared controller to the exact Three.js transform and rendered frame.

### Phase 0: preserve ownership

- [ ] Keep `camera-smooth-follow-kit` as the persistent smoothing-state authority.
- [ ] Keep `prehistoric-rush-domain-kit` as run and route authority.
- [ ] Keep the Three adapter as camera-object and render authority.
- [ ] Update existing reusable kits before adding a new shared kit.
- [ ] Do not reintroduce local `lerp()` plus immediate `lookAt()` logic.

### Phase 1: define the product target contract

- [ ] Create a JSON-safe `CameraTargetDescriptor`.
- [ ] Include `runId`, simulation/frame sequence, route index and target policy version.
- [ ] Include height-source/patch consumer revision when available.
- [ ] Include target position, target look point, up vector and reset policy.
- [ ] Add a deterministic target fingerprint.
- [ ] Return typed invalid-target results for non-finite or missing route data.

### Phase 2: admit reset and update operations

- [ ] Add monotonic camera command/target sequence.
- [ ] Classify initial-run, run-restart, run-change, teleport and manual reset.
- [ ] Reject stale run/session targets.
- [ ] Record the exact delta time requested and clamped.
- [ ] Return controller revision, reset flag/reason and transform fingerprint.
- [ ] Preserve idempotent duplicate results.

### Phase 3: prove Three transform consumption

- [ ] Replace result-free `applyCameraTransform()` with a typed application result.
- [ ] Validate finite normalized transform data before camera mutation.
- [ ] Record controller revision and applied camera matrix/quaternion fingerprint.
- [ ] Record projection revision after resize.
- [ ] Reject stale transforms after camera/session disposal.

### Phase 4: correlate the rendered frame

- [ ] Assign a committed render-frame ID.
- [ ] Record target, controller and Three-application revisions consumed.
- [ ] Record run ID and current patch/height revision.
- [ ] Publish bounded camera consumption rows.
- [ ] Expose detached JSON-safe observation only.
- [ ] Remove mutable controller and adapter owners from public readback.

### Phase 5: own lifecycle

- [ ] Retain the camera service and controller ID in a session owner.
- [ ] Remove the controller on terminal disposal.
- [ ] Fence updates by run/session epoch.
- [ ] Cancel RAF and listeners before renderer/controller disposal.
- [ ] Make stop/dispose idempotent.
- [ ] Reject update/reset after disposal.

### Phase 6: fixture gates

- [ ] Prove deterministic convergence for a fixed target stream.
- [ ] Prove equivalent results across representative frame-time partitions.
- [ ] Prove delta-time clamping during frame stalls.
- [ ] Prove initial/restart/run-change reset semantics.
- [ ] Prove teleport-threshold reset.
- [ ] Prove route-index and terrain-height discontinuities remain bounded.
- [ ] Prove quaternion output remains finite and normalized.
- [ ] Prove one rendered frame references one applied controller revision.
- [ ] Prove disposed sessions cannot mutate the camera.
- [ ] Add browser and Pages smoke.

## Preferred kit changes

Update the existing `camera-smooth-follow-kit` only for reusable controller-result or validation behavior. Keep product policy local.

```txt
existing:
  camera-smooth-follow-kit
    reusable smoothing, reset, snapshot and controller registry

product-side:
  prehistoric-camera-target-policy-kit
  prehistoric-camera-target-provenance-kit
  three-camera-transform-consumer-kit
  camera-frame-correlation-kit
  prehistoric-camera-observation-kit
  prehistoric-camera-lifecycle-owner-kit
  prehistoric-camera-fixture-kit
```

## Required future fixture commands

```bash
node scripts/prehistoric-rush-camera-controller-fixture.mjs
node scripts/prehistoric-rush-camera-target-fixture.mjs
node scripts/prehistoric-rush-camera-frame-correlation-fixture.mjs
node scripts/prehistoric-rush-camera-lifecycle-fixture.mjs
```

## Overall order

```txt
1. Patch-content admission and acknowledged patch activation/release.
2. Camera target/transform/frame consumption proof.
3. Run-session reset with stream and camera epochs.
4. Worker stale-result quarantine.
5. Full runtime lifecycle ownership.
```

## Do not do next

Do not tune smoothing constants blindly, create a second camera controller, expose more mutable debug owners, or claim success from visual inspection without deterministic target/controller/frame fixtures.
