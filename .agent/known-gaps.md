# Known Gaps: PrehistoricRush

**Updated:** `2026-07-10T18-01-03-04-00`

## Runtime dependency admission gaps

```txt
rapier-physics-domain-kit resolves from mutable NexusRealtime-ProtoKits@main
no immutable commit pin for the external physics kit
no RuntimeDependencyRequest or RuntimeDependencyResult
no required / optional / fallback classification
load() suppresses import errors and returns null
no resolved module version, commit, checksum, or capability fingerprint
no distinction between network failure, export mismatch, init failure, or unsupported browser
Three.js failure is discovered later by setup instead of rejected at admission
Rapier/ProtoKit failure silently selects fallback collision behavior
GameHost cannot report why a dependency was accepted, degraded, or rejected
```

## Frame authority gaps

```txt
tick scheduler is created but never started
domainHost.tick is never driven by the live route
primary runtime owns an independent RAF
secondary presentation owns another independent RAF
no sourceFrameId shared by simulation, presentation, and render
no render commit owner
no one-render-per-source-frame invariant
no phase ordering contract
no duplicate/dropped render decision row
```

## Session lifecycle gaps

```txt
Start changes scene only
Retry changes scene only
Run Again changes scene only
no SessionStartResult
no SceneTransitionResult
no RestartTransaction
no sessionId, restartId, or terminal cause
position, distance, speed, jump, collected pickups, contacts, and time are not reset
terminal conditions can immediately re-trigger
best-distance persistence is mixed into mutable runner state
```

## Mount/dispose gaps

```txt
resize listener has no retained removal handle
keydown listener has no retained removal handle
keyup listener has no retained removal handle
primary RAF has no cancellation owner
secondary RAF has no cancellation owner
event-bus subscriptions are not collected by a composition disposer
domain host has no dispose fan-out
tick scheduler stop does not cancel an already scheduled RAF handle
WebGLRenderer is never disposed
terrain, raptor, instanced geometry, and materials are never disposed
physics world/actor/collider resources have no teardown path
PrehistoricRushHost has no disposed state
remount/re-import can duplicate listeners, loops, DOM, and GPU work
```

## Domain consumption gaps

```txt
dino-pose-domain-kit waits for runner.moved but live runtime never emits it
camera-domain-kit preset is duplicated by direct camera code
hud-domain-kit projection is bypassed by direct innerHTML
tick-scheduler snapshot remains dormant
event-bus history records setup events but not gameplay frames
domain snapshots prove installation, not live consumption
```

## Source contract gaps

```txt
README describes a manifest-driven multi-scene loader
live runtime imports no scene or tuning manifest
game-scenes.json declares transitions the runtime does not consume
runner-tuning.json differs from hardcoded live constants
game-scenes.json points at NexusEngine@main while the live route does not load it
live runtime points at legacy NexusRealtime-ProtoKits@main
no authoritative source manifest distinguishes consumed, ignored, and fallback sources
```

## Host/readback gaps

```txt
PrehistoricRushHost exposes mutable app
getState returns runner state by reference
runner.collected is a Set, not a detached JSON-safe row
no dependency admission rows
no source provenance fingerprint
no degraded-mode reason
no source-frame or render-commit rows
no scene transition or restart result
no mount/dispose state
no resource counts before and after dispose
no fixture metadata
```

## Validation gaps

```txt
no root package.json
no npm run check
no DOM-free dependency-admission fixture
no single-frame fixture
no restart lifecycle fixture
no mount/dispose/remount fixture
no browser smoke in this pass
no Pages smoke in this pass
```

## Do not solve first

```txt
visual expansion
terrain rewrite
movement retune
new dinosaur mesh
new pickups
new obstacle families
renderer extraction
ProtoKit promotion
```

## Current ledge

```txt
PrehistoricRush Runtime Dependency Admission + Single-Owner Session Lifecycle Fixture Gate
```