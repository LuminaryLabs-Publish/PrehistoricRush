# PrehistoricRush Camera/HUD Render Readback Wire Map

**Timestamp:** `2026-07-08T14:51:11-04:00`

## Current render surface

The current render path is visually owned by `src/runtime-terrain-v6.mjs` plus the overlay presentation pass in `src/game.js`.

```txt
runtime-terrain-v6.mjs
  -> creates Three.js renderer, scene, camera, terrain, instanced rocks/shards/trees, and raptor visual rig
  -> mutates baseline camera and baseline HUD every loop
  -> renders v.renderer.render(v.scene, v.camera)

src/game.js presentation pass
  -> reads globalThis.PrehistoricRushHost.app
  -> applyReadableStride(app)
  -> applyCloseCamera(app, app.THREE, dt)
  -> renderHud(app)
  -> app.view.renderer.render(app.view.scene, app.view.camera)
```

## Render authority issue

The route now has useful presentation domains, but the renderer does not yet report which source descriptors were consumed.

```txt
camera-domain-kit descriptor exists
  -> applyCloseCamera still directly mutates camera

hud-domain-kit descriptor exists
  -> renderHud still directly mutates app.ui.status.innerHTML

dino-pose-domain-kit descriptor exists
  -> applyReadableStride still directly mutates raptor rig nodes

PrehistoricRushHost.getState() exists
  -> reports renderer as "three-terrain-v6-raptor"
  -> does not expose presentation/render readback
```

## Required render readback object

```txt
RenderReadback
  frame
  scene
  rendererId
  sourceStateId
  camera:
    descriptorVersion
    requestId
    appliedBy
    fallbackReason
  hud:
    descriptorVersion
    requestId
    appliedBy
    fallbackReason
  dino:
    poseVersion
    requestId
    appliedBy
    fallbackReason
  terrain:
    chunkCount
    source
  physics:
    enabled
    source
```

## Readback reasons

```txt
camera.descriptor.consumed
camera.direct-legacy-apply
camera.missing-domain
hud.descriptor.consumed
hud.direct-dom-apply
hud.missing-domain
dino.pose-domain-consumed
dino.direct-rig-apply
contact.not-recorded-yet
scene.not-recorded-yet
render.frame-recorded
render.legacy-compatible
```

## Next additive wire points

```txt
src/game.js
  startPresentationPass()
    before applyReadableStride/applyCloseCamera/renderHud:
      sourceState = snapshotRunnerSourceState(app)
      cameraRequest = createCameraFrameRequest(cameraDescriptor, sourceState)
      hudRequest = createHudFrameRequest(hudDescriptor, sourceState)
      dinoPoseFrame = createDinoPoseFrame(domainSnapshot, sourceState)

    after legacy visual mutation:
      readback = createRenderReadback({ sourceState, cameraRequest, hudRequest, dinoPoseFrame }, app)
      appendPresentationJournalEntry({ readback, ... })

runtime-terrain-v6.mjs
  globalThis.PrehistoricRushHost.getState()
    presentation: projectHostPresentationSnapshot(journal)
```

## Fixture rows

```txt
01_camera_frame_request_matches_close_camera_visual_policy
02_hud_frame_request_matches_readability_hud_descriptor
03_dino_pose_frame_matches_current_stride_inputs
04_render_readback_marks_legacy_camera_apply
05_render_readback_marks_legacy_hud_dom_apply
06_render_readback_marks_legacy_dino_rig_apply
07_host_state_contains_presentation_readback
08_legacy_renderer_output_unchanged_by_readback_layer
```

## Cutline

Do not change the current raptor visual, camera distance, HUD copy, terrain style, or render loop behavior in the next pass.

The next pass should only add records that prove the current behavior.
