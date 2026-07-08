# PrehistoricRush Render Audit

**Updated:** `2026-07-08T03:01:20-04:00`

## Current render surface

The visible runner is still rendered by the legacy live runtime file after `src/game.js` installs the domain scaffold.

Current route shape:

```txt
src/game.js
  -> installs dino domains
  -> await import("./runtime-terrain-v6.mjs")
  -> Three.js/Rapier visual runner starts
```

## Render domains

```txt
three-renderer-host
scene-camera-lighting-fog
procedural-terrain-rendering
terrain-height-sampling
terrain-chunk-streaming
procedural-scatter-placement
rock-instance-pool
shard-pickup-pool
tree-instance-pools
collider-descriptor-generation
pickup-descriptor-generation
raptor-visual-rig
raptor-pose-animation
camera-follow-policy
hud-telemetry-projection
sky-background-policy
route-readability-policy
```

## Current renderer concern

The renderer and the gameplay authority are still too interleaved.

The render file should not permanently own:

```txt
- movement rules
- jump buffering / coyote rules
- boost rules
- scene transition rules
- score and win rules
- contact reduction
- source manifest drift decisions
- dino pose authority
```

## Target render handoff

```txt
pure runtime/domain kits
  -> RunnerStepResult
  -> RunnerEventJournal
  -> DinoFormDescriptor
  -> DinoPoseDescriptor
  -> DinoMaterialDescriptor
  -> TerrainChunkDescriptor
  -> ScatterPlacementDescriptor
  -> ContactResultSnapshot
  -> CameraPolicyDescriptor
  -> HudTelemetryDescriptor
  -> SceneDispatchResult
  -> Three.js renderer consumes descriptors
```

## Render next steps

- [ ] Keep the current visual scene stable during authority extraction.
- [ ] Add descriptor snapshots before changing meshes.
- [ ] Make raptor animation consume `dino-pose-domain-kit` output.
- [ ] Make camera consume a camera policy descriptor.
- [ ] Make HUD consume telemetry descriptors.
- [ ] Make scatter/pickup/hazard pools consume data descriptors.
- [ ] Move visual polish after runner authority fixtures exist.

## Do not cut yet

Do not delete `runtime-terrain-v6.mjs` in one pass.

Treat it as a legacy visual host that will gradually become a descriptor consumer.
