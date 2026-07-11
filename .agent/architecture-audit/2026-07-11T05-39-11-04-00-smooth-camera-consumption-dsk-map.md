# Architecture Audit: Smooth Camera Consumption DSK Map

**Timestamp:** `2026-07-11T05-39-11-04-00`

## Summary

The reusable smoothing state is correctly owned by `camera-smooth-follow-kit`. Product target composition and renderer consumption still need an explicit parent boundary so camera behavior can be validated without coupling the shared kit to Three.js or PrehistoricRush route rules.

## Plan ledger

**Goal:** Map existing and missing Domain Service Kit ownership for the camera path.

- [x] Identify authoritative inputs.
- [x] Identify current shared kit services.
- [x] Identify product policy.
- [x] Identify renderer consumer.
- [x] Identify observation/lifecycle gaps.
- [x] Define update-first kit strategy.
- [ ] Implement only after patch activation P0.

## Current DSK graph

```txt
core-camera-kit
  camera capability marker

prehistoric-rush-domain-kit 0.5.0
  run position/yaw/runId
  route samples and route index
  game lifecycle

seeded-world-patch-controller-kit + host height sampler
  active terrain source used by camera look target

camera-smooth-follow-kit 0.1.0
  controller registry
  persistent position/look velocities
  position and look SmoothDamp
  quaternion damping
  reset/teleport reset
  snapshots and load/reset

Three host adapter
  target policy
  PerspectiveCamera
  transform application
  projection
  render
```

## Current service boundary

The upstream kit declares:

```txt
services:
  position-smooth-damp
  look-target-smooth-damp
  rotation-damping
  camera-reset

provides:
  camera:smooth-follow
  camera:smooth-position
  camera:smooth-look-target
  camera:smooth-rotation
```

Its declared boundary is correct: it owns damped transform state and reset behavior; renderers own camera objects, projection, scene graph, collision queries and final application.

## Missing parent domain

```txt
prehistoric-camera-consumption-authority-domain
```

Responsibilities:

```txt
target descriptor and product policy version
run/route/height-source provenance
target admission and stale rejection
controller reset/update result
Three transform application result
render-frame acknowledgement
bounded observation
session lifecycle
```

## Update-first kit strategy

```txt
camera-smooth-follow-kit
  extend only when validation/result behavior is renderer-agnostic and reusable

prehistoric-camera-target-policy-kit
  keep chase offset, look-ahead and terrain-aware target product-local

three-camera-transform-consumer-kit
  keep Three validation/application renderer-local

camera-frame-correlation-kit
  compose product target, controller result and render acknowledgement
```

Do not add a second smoothing kit or move route/terrain rules into the shared camera kit.

## Required typed records

```txt
CameraTargetDescriptor
CameraTargetAdmissionResult
CameraControllerStepResult
CameraTransformApplicationResult
CameraFrameConsumptionRow
CameraLifecycleResult
```

Each record must include run/session identity, monotonic sequence, exact reason/status and a deterministic fingerprint.

## Dependency order

```txt
authoritative run/height revision
  -> target descriptor
  -> target admission
  -> controller reset/update
  -> transform application
  -> frame acknowledgement
  -> observation
  -> lifecycle disposal
```
