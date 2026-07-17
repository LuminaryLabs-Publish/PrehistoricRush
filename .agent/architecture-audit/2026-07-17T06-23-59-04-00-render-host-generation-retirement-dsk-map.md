# Render Host Generation Retirement DSK Map

**Timestamp:** `2026-07-17T06-23-59-04-00`  
**Reviewed runtime source:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`

## Intent

Define one semantic authority above the existing base and LOD adapters without restructuring Vegetation, patch generation, fidelity, physics or gameplay.

## Current ownership map

```txt
game-runtime-lod-host-adapter
  owns module loading, engine composition, Worker, controller, RAF,
  browser listeners, startup receipt and global host exposure

three-patch-stream-adapter-kit
  owns renderer, canvas, scene, camera, base lights, base terrain,
  legacy trees, grass, shards, player, base patch memberships and render

three-patch-stream-lod-adapter
  composes terrain LOD, tree fidelity, foliage atlas,
  lush foliage, ground cover and jungle atmosphere

child disposal
  terrain LOD: present
  tree fidelity: present
  lush foliage: present
  ground cover: present
  foliage atlas: present

parent disposal
  base adapter: absent
  atmosphere restoration/removal: absent
  host RAF/listener/Worker retirement: absent
  generation result and acknowledgement: absent
```

## Required parent domain

`prehistoric-rush-render-host-generation-retirement-authority-domain`

## Command and result contract

```txt
RenderHostGenerationAdmissionCommand
  input:
    routeRevision
    runtimeRevision
    engineGeneration
    patchControllerGeneration
    workerGeneration
    rendererGeneration
    sceneGeneration
    atmosphereGeneration
    viewportGeneration
  result:
    RenderHostGenerationAdmissionResult

RenderHostRetirementCommand
  input:
    renderHostGeneration
    reason
    expectedActivePatchRevision
    expectedFrameRevision
    idempotencyKey
  settlement:
    stop frame and patch admission
    cancel or reject stale RAF and Worker results
    release patch memberships and instance-batch cells
    remove browser listeners and terminate Worker
    dispose base and child geometries, materials, textures and batches
    remove owned lights and restore/retire predecessor atmosphere state
    dispose renderer/context and detach canvas
  result:
    RenderHostRetirementResult
    FirstRetiredRenderHostAck

RenderHostReplacementCommand
  input:
    predecessorRetirementResult
    replacementDescriptor
  result:
    RenderHostReplacementResult
    FirstReplacementRenderHostFrameAck
```

## DSK breakdown

```txt
render-host-generation-kit
  generation identity, ownership registry, admission and snapshots

render-frame-admission-latch-kit
  open/closed frame state, stale callback rejection and frame receipts

patch-membership-retirement-kit
  active patch release, collider/pickup cleanup and batch-cell settlement

worker-generation-retirement-kit
  pending request rejection, Worker termination and stale result handling

browser-listener-retirement-kit
  keyboard, blur, resize and button handler removal

base resource retirement kits
  terrain, legacy trees, grass, shards, pickups, player and base lights

child resource retirement kits
  terrain LOD, tree fidelity, lush foliage, ground cover and foliage atlas

jungle-atmosphere-state-restoration-kit
  predecessor snapshot, owned-light removal and apply-once restoration

renderer-context-and-canvas-retirement-kit
  renderer disposal, context loss policy and host canvas detachment

render-host-retirement-result-kit
  per-participant applied/failed/indeterminate receipts and final digest

first-retired-render-host-ack-kit
  proof that no retired generation submits another visible frame
```

## Compatibility boundary

Preserve the current catalog identities, seeds, Worker payloads, patch controller, terrain LOD, tree fidelity, foliage-card hysteresis/crossfade, atmosphere appearance, collision, player pose, camera, route, score, pause, outcomes and startup frame admission.