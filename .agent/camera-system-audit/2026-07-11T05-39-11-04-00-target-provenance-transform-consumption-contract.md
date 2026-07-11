# Camera System Audit: Target Provenance / Transform Consumption Contract

**Timestamp:** `2026-07-11T05-39-11-04-00`

## Summary

The camera system now has a strong reusable smoothing core. The product needs a thin consumption authority around it, not a replacement algorithm.

## Plan ledger

**Goal:** Specify the complete camera contract from authoritative target sources through disposal.

- [x] Record shared-kit ownership.
- [x] Record product-policy ownership.
- [x] Record renderer ownership.
- [x] Define typed records.
- [x] Define invariants.
- [x] Define lifecycle.
- [ ] Implement and fixture-test.

## Contract layers

### 1. Target policy

Inputs:

```txt
run state
route sample
height source
product tuning
```

Output:

```txt
immutable CameraTargetDescriptor
```

### 2. Smooth controller

Inputs:

```txt
accepted target
delta time
reset policy
```

Output:

```txt
CameraControllerStepResult
```

The upstream kit remains renderer-agnostic.

### 3. Three consumer

Inputs:

```txt
validated controller transform
PerspectiveCamera identity
projection revision
```

Output:

```txt
CameraTransformApplicationResult
```

### 4. Frame acknowledgement

Inputs:

```txt
applied camera revision
committed world/render state
```

Output:

```txt
CameraFrameConsumptionRow
```

### 5. Lifecycle owner

Owns:

```txt
controller registration/removal
run/session epoch
RAF and listener ordering
renderer/camera disposed state
bounded journal
public observation lease
```

## Invariants

```txt
- target arrays are finite and detached
- each accepted target has one sequence and fingerprint
- controller revisions are monotonic
- reset reasons are explicit
- output quaternion is normalized
- Three application names the consumed controller revision
- rendered frame names the consumed application revision
- stale run/session commands do not mutate state
- disposal is idempotent
- no update/reset succeeds after disposal
```

## Existing upstream behavior to retain

```txt
SmoothDamp overshoot prevention
maximum position/look speeds
maximum delta time
teleport threshold
quaternion shortest-path slerp
snapshot/load validation by version and ID
controller registry create/get/has/remove/list/reset
```

## Product-specific behavior to retain locally

```txt
6.6 m chase distance
2.35 m chase height
12-sample route look-ahead
1.15 m terrain-relative look height
run-change reset policy
```

## Proof matrix

```txt
controller math          Node deterministic fixture
target composition       Node product-policy fixture
Three application        adapter fixture with camera double
frame correlation        headless frame-ledger fixture
restart/teleport         scenario fixture
lifecycle                stop/dispose/reject fixture
browser integration      browser/Pages smoke
```
