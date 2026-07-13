# Gameplay Audit: Terrain IK and Patch Revision Loop

**Timestamp:** `2026-07-13T08-39-12-04-00`

## Summary

The gameplay loop now conforms both hind legs vertically to sampled terrain while grounded. It is deterministic for a fixed rig, run state, evaluated pose, sampler and settings. Gameplay does not yet retain which terrain revision produced the target, and it has no planted-foot lifecycle or cross-frame contact state.

## Plan ledger

**Goal:** describe the implemented gameplay behavior precisely and separate it from future planting, slope and presentation work.

- [x] Document target position and weight rules.
- [x] Document grounded/airborne behavior.
- [x] Document the patch/fallback source boundary.
- [x] Document current test coverage.
- [ ] Add revisioned contact and boundary fixtures later.

## Implemented gameplay path

```txt
animated legacy gait
  -> articulated FK foot positions
  -> transform foot X/Z into world space
  -> sample terrain height
  -> convert sampled height into rig-space target Y
  -> keep animated target X/Z
  -> weight by foot proximity to ground
  -> force weight to zero while airborne
  -> solve both hind-leg chains
  -> publish authoritative PlayerPose
```

Defaults:

```txt
foot clearance:       0.03
maximum IK weight:    0.80
activation height:    0.45
visual root offset Y: 0.05
```

## Positive behavior

- The procedural gait remains the source pose rather than being replaced by a static stance.
- FK provides current animated foot positions before target generation.
- Terrain correction is vertical and bounded by a maximum weight.
- Raised swing feet receive less influence.
- Airborne targets remain present but have zero weight.
- Target generation is deterministic for identical inputs.
- Both hind-leg chains use authored pole directions.

## Current gameplay limits

```txt
foot planting state: absent
stance/swing phase identity: inferred only from animated height
contact lock position: absent
contact enter/exit result: absent
slope normal sampling: absent
foot orientation to slope: absent
maximum vertical correction policy: absent
leg reach/clamp result: delegated to solver without product receipt
patch/fallback source status: absent from gameplay state
cross-frame target smoothing: absent
```

## Patch-boundary behavior

The height sampler chooses an active patch when present and procedural fallback otherwise. Since patch streaming updates after simulation, the source can change on the next frame without a terrain generation, contact transition or explicit resample result.

## Required gameplay result

```txt
TerrainFootContactResult {
  footId
  targetFrameId
  sampleResult
  stanceClassification
  requestedPosition
  admittedPosition
  weight
  reachStatus
  predecessorContactId
  status
}
```

The current vertical IK does not require full planting to be useful. The immediate improvement is to make each correction attributable to one terrain sample and one admitted target frame.

## Fixtures

- [x] Flat terrain produces two rig-space targets.
- [x] Raised terrain changes target Y by height/visualScale.
- [x] Raised swing foot receives less weight.
- [x] Airborne state produces zero weights.
- [x] Duplicate inputs produce identical targets.
- [ ] Exact-patch versus fallback classification.
- [ ] Patch activation at a foot coordinate.
- [ ] Patch release while foot is near contact.
- [ ] Maximum leg reach and unreachable target.
- [ ] Restart and first grounded frame.
- [ ] Visible terrain/skeleton correlation.