# Architecture Audit: Runtime Admission and Lifecycle DSK Map

Timestamp: `2026-07-10T18-01-03-04-00`

## Current authority map

```txt
src/game.js
  owns repo-local event bus, domain host, scheduler, domain installation, composition snapshot
  imports the live runtime
  starts a second presentation RAF

src/runtime-terrain-v6.mjs
  owns CDN URLs and dynamic import policy
  owns DOM shell and global listeners
  owns Three.js scene, camera, renderer, geometry, materials, and instanced meshes
  owns Rapier/physics-kit bridge creation
  owns runner state, terrain, spawn, contact, pickup, score, scenes, storage, HUD, render
  owns primary RAF
  exposes mutable PrehistoricRushHost
```

## DSK/domain boundary

| Domain / kit | Services | Current consumption | Gap |
|---|---|---|---|
| event-bus-kit | subscribe, emit, wildcard dispatch, recent history | setup events | no lifecycle reset or collected disposer |
| domain-host-kit | install, get, tick, snapshot | install/snapshot | live tick unused, no dispose fan-out |
| tick-scheduler-kit | start, stop, RAF tick, snapshot | constructed | not started; stop does not own a RAF handle |
| dino-form-domain-kit | raptor form descriptors | snapshot | live rig built independently |
| dino-pose-domain-kit | movement-to-pose service/events | listener installed | no live `runner.moved` input |
| dino-material-domain-kit | material descriptors | snapshot | live materials built independently |
| camera-domain-kit | camera preset | duplicated | direct camera constants own behavior |
| hud-domain-kit | HUD model/progress | bypassed | direct DOM composition owns behavior |
| external module loader | dynamic import and warning | live | all failures collapse to null |
| rapier-physics-domain-kit | Rapier actor/collider/step/contact bridge | live when admitted | mutable @main source, no admission/provenance result |
| legacy runtime | complete game host | live authority | no module, frame, session, or resource transaction boundary |

## Runtime dependency contract

```txt
RuntimeDependencyRequest
  id
  required
  requestedUrl
  requestedVersionOrRef
  expectedExports
  fallbackPolicy

RuntimeDependencyResult
  id
  status: admitted | fallback_admitted | rejected
  requestedUrl
  resolvedIdentity
  capabilityFingerprint
  reason
  errorClass
```

Three.js must be classified as required. Rapier and the physics kit may be fallback-capable only if fallback behavior is explicitly named and fixture-proven.

## Runtime lifecycle contract

```txt
RuntimeLifecycle
  mount()
  start()
  stop(reason)
  dispose(reason)
  snapshot()

owned resources
  listener handles
  RAF handles
  event subscriptions
  domain disposers
  WebGL renderer
  geometries
  materials
  instanced meshes
  physics world/actors/colliders
  host exposure
```

## Session contract

```txt
SessionStartResult
  sessionId
  accepted
  reason
  initialStateFingerprint

RestartTransaction
  previousSessionId
  nextSessionId
  terminalCause
  preservedBestDistance
  resetStateFingerprint
```

## Architecture decision

Update existing owners first:

```txt
runtime-terrain-v6: dependency admission, mount, session, renderer/physics ownership
src/game.js: one presentation/frame composition path and composition disposal
tick-scheduler: cancellable RAF ownership
domain-host: optional dispose fan-out
event-bus: bounded reset/dispose support
```

Add new modules only for shared contracts that have no current owner:

```txt
runtime-dependency-result
runtime-source-provenance
frame/render commit
session transaction
runtime lifecycle
host snapshot
fixture adapter
```

## Next safe ledge

```txt
PrehistoricRush Runtime Dependency Admission + Single-Owner Session Lifecycle Fixture Gate
```