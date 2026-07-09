# PrehistoricRush Presentation Authority Audit: Host Presentation Snapshot Fixture Contract

**Generated:** `2026-07-09T11-46-08-04-00`

## Authority problem

Presentation authority currently exists as direct browser mutation.

```txt
applyReadableStride mutates raptor rig
applyCloseCamera mutates Three.js camera
renderHud mutates DOM
runtime-terrain-v6 mutates scene state and host state
PrehistoricRushHost.getState exposes only legacy fields
```

This is acceptable for playability, but not enough for DSK/domain proof.

## Required additive authority

Add a presentation proof layer that records what the browser already does without owning gameplay behavior.

```txt
source state read
  -> delta derivation
  -> movement event emission
  -> domain consumer output capture
  -> presentation frame record
  -> bounded journal
  -> host snapshot projection
  -> fixture rows
```

## Host snapshot target

```txt
PrehistoricRushHost.getState().presentation = {
  version,
  latestFrame,
  journal,
  runnerSource,
  runnerDelta,
  runnerMoved,
  dinoPose,
  cameraRequest,
  hudRequest,
  contact,
  sceneDispatch,
  renderReadback
}
```

## Contract boundaries

```txt
must be additive
must not remove scene, runner, physics, terrain, or renderer legacy fields
must not own movement integration
must not own collision resolution
must not own terrain streaming
must not own WebGL rendering
must not require DOM for core fixture assertions
```

## Fixture rows required

```txt
menu_idle
game_first_movement_frame
turn_left
turn_right
boost
jump_start
jump_recover
shard_pickup
collision_run_over
win_threshold
render_readback_unchanged
host_legacy_fields_unchanged
central_ledger_latest_tracker_readback
```

## Implementation notes

The first implementation should wire proof around the current `globalThis.PrehistoricRushHost.app` reference.

The bridge can read app state, derive records, emit through `globalThis.PrehistoricRushComposition.eventBus`, and publish a bounded journal back onto the host readback shape.

Do not start by rewriting `runtime-terrain-v6.mjs`.
