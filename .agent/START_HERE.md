# START HERE: PrehistoricRush

**Last aligned:** `2026-07-11T05-39-11-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

`PrehistoricRush` now uses the pinned `camera-smooth-follow-kit` for persistent SmoothDamp position, look-target smoothing and quaternion rotation damping. The integration removes the previous immediate `lookAt()` snap, but target generation, controller updates, Three.js application and rendered-frame proof are still spread across the browser host without one typed consumption result.

The previously documented seeded patch activation transaction remains the highest gameplay-integrity priority. This audit records the newer camera runtime change so the repository ledger matches the actual module graph and renderer path.

## Plan ledger

**Goal:** Preserve the shared smooth-follow kit while making the product camera target policy, reset/update admission, transform application, frame correlation, observation and lifecycle explicit.

- [x] Compare the full accessible `LuminaryLabs-Publish` inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm the nine eligible repositories are centrally tracked and have root `.agent` state.
- [x] Select only `PrehistoricRush` because camera runtime commits landed after its prior audit.
- [x] Re-read the pinned camera kit and active Three.js consumer.
- [x] Identify the interaction loop, domains, kits and services.
- [x] Record camera target, reset, update, render and lifecycle gaps.
- [x] Add timestamped architecture, render, gameplay, interaction, camera-system and deploy audits.
- [x] Refresh required root `.agent` files.
- [ ] Keep patch-content admission and acknowledged multi-consumer activation/release as P0 implementation work.
- [ ] Add camera target/transform/frame fixtures before further camera behavior changes.

## Latest documentation gate

```txt
PrehistoricRush Smooth Camera Consumption Authority
+ Target / Transform / Render-Frame Fixture Gate
```

## Overall implementation priority

```txt
P0 Seeded Patch Activation Commit Authority
P1 Camera Target / Transform Consumption Proof
P2 Run Session Reset + Stream/Camera Epoch Authority
```

## Read first

```txt
.agent/trackers/2026-07-11T05-39-11-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-11T05-39-11-04-00.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/architecture-audit/2026-07-11T05-39-11-04-00-smooth-camera-consumption-dsk-map.md
.agent/render-audit/2026-07-11T05-39-11-04-00-camera-transform-frame-correlation-gap.md
.agent/gameplay-audit/2026-07-11T05-39-11-04-00-run-route-height-camera-loop.md
.agent/interaction-audit/2026-07-11T05-39-11-04-00-camera-reset-update-admission-map.md
.agent/camera-system-audit/2026-07-11T05-39-11-04-00-target-provenance-transform-consumption-contract.md
.agent/deploy-audit/2026-07-11T05-39-11-04-00-smooth-camera-fixture-gate.md
```

Prior active world-streaming audit:

```txt
.agent/world-streaming-audit/2026-07-11T05-02-00-04-00-controller-consumer-activation-contract.md
```

## Selection

The accessible Publish inventory contains ten repositories. All nine eligible non-Cavalry repositories are centrally tracked. `PrehistoricRush` was selected because the runtime added the official smooth-follow camera kit and changed the renderer path after the prior `05-02-00` documentation audit.

## Product read

`PrehistoricRush` is a browser 3D runner. The player steers, boosts and jumps along a deterministic route while procedural terrain, vegetation, pickups and collision stream around a skinned raptor.

## Active interaction loop

```txt
browser input
  -> prehistoric-rush simulation updates position, yaw, route index and run ID
  -> seeded patch streaming changes active terrain and height sources
  -> product camera target policy derives follow position and route-ahead look point
  -> camera-smooth-follow controller resets or updates persistent state
  -> Three adapter applies controller position and quaternion
  -> renderer consumes the live camera
  -> HUD and PrehistoricRushHost expose aggregate snapshots
  -> RAF repeats
```

## Camera ownership split

```txt
camera-smooth-follow-kit
  owns persistent damped position, look point, velocities, quaternion,
  reset behavior, snapshots and controller registry

PrehistoricRush target policy
  owns chase offset, route-ahead sample, terrain-aware look height,
  run-change reset reasons and product tuning

Three adapter
  owns PerspectiveCamera, projection, transform application and rendering

browser host
  owns controller creation, run lifecycle calls, observation and eventual disposal
```

## Main finding

The smoothing algorithm is correctly centralized in a renderer-agnostic shared kit, but the product has no single immutable row proving:

```txt
runId + simulation frame + routeIndex + height-source revision
  -> target position + target look point
  -> camera controller revision/reset reason
  -> applied Three camera transform
  -> rendered frame acknowledgement
```

The target is recomputed from mutable run and patch state, `applyCameraTransform()` returns no result, and the host exposes mutable `cameraFollow` and `adapter` owners. There is also no teardown path that removes the controller or releases renderer/listener/RAF ownership.

## Safe implementation order

```txt
1. Keep camera-smooth-follow-kit as the smoothing-state authority.
2. Add a JSON-safe product CameraTargetDescriptor with run and source provenance.
3. Add typed reset/update admission and result rows.
4. Return an immutable Three camera-application result.
5. Correlate target revision, controller revision and rendered frame.
6. Expose detached bounded observation instead of mutable owners.
7. Add controller removal and session teardown ownership.
8. Add deterministic Node fixtures and browser/Pages camera smoke.
```

Do not replace the shared kit with local lerp/lookAt logic, add a second camera state machine, or treat a controller snapshot as proof that a particular rendered frame consumed it.
