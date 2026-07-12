# Read Model and Command Gateway Contract

**Timestamp:** `2026-07-11T22-29-24-04-00`

## Purpose

Separate public observation from internal ownership. Diagnostics may read committed evidence. Automation may submit bounded commands. Neither may receive live engine, physics, streaming, camera or render objects.

## Public read model

```txt
PrehistoricRushCommittedState {
  apiVersion
  runtimeSessionId
  hostGeneration
  runSessionId
  runEpoch
  streamEpoch
  workerGeneration
  colliderEpoch
  frameEpoch
  committedFrameId
  game
  patchStreaming
  camera
  composition
  scene
  playerProfileFingerprint
  playerBodyContentHash
  worldContentFingerprint
  renderResult
  hudResult
}
```

Every nested value must be cloned, immutable and sourced from the same committed frame record.

## Public capability descriptor

```txt
HostCapability {
  id
  kind: read | command
  schemaVersion
  lifecycleStates
  requiredEpochs
  workBudget
  owner
}
```

## Command guarantees

```txt
commands are uniquely identified
commands declare expected run and relevant epochs
unsupported capabilities cause zero mutation
stale commands cause zero mutation
duplicate commands return the prior result
owner results are preserved rather than translated into booleans
commands do not automatically imply a committed visible frame
public journal rows are bounded and detached
```

## Quarantine guarantees

The public object must not expose:

```txt
Nexus Engine instance or namespaces
Rapier world or domain API
Three renderer, scene, camera or Object3D references
patch controller instance or executor
Worker instance
camera-follow mutable service
adapter closures that mutate active content
```

## Migration

```txt
phase 1: add getCommittedState, capabilities and submit
phase 2: make getState return committed state only
phase 3: remove raw owner properties
phase 4: fail validation when mutable owners are publicly reachable
```

## Acceptance

A hostile same-page fixture must be unable to locate or invoke a raw mutating owner through property enumeration, prototype traversal, returned values or compatibility methods.