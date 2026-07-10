# Lifecycle Audit: Mount, Dispose, and Remount Ownership Contract

Timestamp: `2026-07-10T18-01-03-04-00`

## Current mount side effects

```txt
replace #app contents
mutate document.body styles
append WebGL canvas
register resize listener
register keydown listener
register keyup listener
register Start button listener
create primary RAF chain
create secondary RAF chain
install event-bus listeners through domains
create renderer / scene / geometry / materials / instanced meshes
create physics world / actor / colliders
publish PrehistoricRushComposition
publish PrehistoricRushHost
```

## Current dispose behavior

```txt
none
```

The scheduler has a `stop()` flag, but it is not the live frame owner and does not retain a RAF handle. The primary and secondary runtime loops always schedule their next callback. The physics kit and Three.js resources have no product-level disposal adapter.

## Required ownership model

```txt
RuntimeLifecycle
  state: idle | mounting | mounted | running | stopped | disposing | disposed
  mount()
  start()
  stop(reason)
  dispose(reason)
  snapshot()
```

Ownership registries:

```txt
listenerRegistry
rafRegistry
subscriptionRegistry
graphicsResourceRegistry
physicsResourceRegistry
globalExposureRegistry
```

## Dispose order

```txt
1. reject new commands
2. stop source-frame scheduling
3. cancel primary and secondary RAF handles
4. remove keyboard, resize, and button listeners
5. unsubscribe event-bus/domain listeners
6. stop/dispose physics actors, colliders, and world
7. dispose renderer, geometries, materials, and other GPU resources
8. remove canvas and transient DOM
9. clear or mark global host exposures disposed
10. publish detached LifecycleDisposeResult
```

## Idempotency

`dispose()` must be safe to call repeatedly. Every owned resource needs a stable identity and a released flag so shared geometry/material resources are not double-disposed.

## Required observations

```txt
LifecycleSnapshot
  lifecycleId
  state
  activeListeners
  activeRafs
  activeSubscriptions
  rendererCount
  geometryCount
  materialCount
  physicsActorCount
  canvasCount
  disposedResources
  duplicateDisposeCount
```

## Fixture sequence

```txt
mount A
start A
advance fixed frames
dispose A
dispose A again
mount B
start B
advance fixed frames
dispose B
```

Assertions:

```txt
one active runtime after each mount
zero active RAF/listener/subscription owners after dispose
zero mounted canvases after dispose
second dispose has no side effects
remount does not inherit prior input/session state
best distance persists only through the designated persistence owner
host exposes disposed state rather than stale mutable objects
```