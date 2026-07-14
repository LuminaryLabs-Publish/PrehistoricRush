# Runtime Provider Revision Convergence DSK Map

**Timestamp:** `2026-07-14T14-01-07-04-00`  
**Authority:** `prehistoric-rush-runtime-provider-revision-convergence-authority-domain`

## Summary

PrehistoricRush composes one game from modules that can depend on two NexusEngine revisions. The root engine is imported directly from `682c9fa...`; bare imports inside stable kits and ProtoKits resolve through the page import map to `cf2fe3d...`.

## Plan ledger

**Goal:** define the smallest authority that makes provider identity, dependency resolution, kit factories, composition, diagnostics, and visible presentation one admitted graph.

- [x] Map HTML import-map ownership.
- [x] Map direct runtime URL ownership.
- [x] Map stable-kit and ProtoKit bare imports.
- [x] Map game and creator composition.
- [x] Map public diagnostic limitations.
- [x] Preserve existing gameplay and presentation domains.
- [ ] Add runtime implementation and fixture proof later.

## Current graph

```txt
route HTML
  -> import map: nexusengine = cf2fe3d...

page bootstrap
  -> direct NexusEngine = 682c9fa...
  -> direct NexusEngine-Kits = 9fd5b100...
  -> direct NexusEngine-ProtoKits = 534e2493...

stable kits
  -> bare nexusengine
  -> import-map NexusEngine = cf2fe3d...

ProtoKit core
  -> bare nexusengine
  -> import-map NexusEngine = cf2fe3d...

product composition
  -> createRealtimeGame from 682c9fa...
  -> Core/product factories from 682c9fa...
  -> stable-kit/protokit helpers and descriptors may originate from cf2fe3d...
```

## Existing domains retained

```txt
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion
Articulated Dynamics and Motion
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition, Presentation
Presentation Output, UI Scale, Camera Framing
Seed, Procedural Creature, Instancing, Patch Streaming, Camera Follow
Rapier provider, Worker executor, Three.js renderer
PrehistoricRush run, route, surface, score, outcome, pose, IK, pause, profile, creator
validation, deployment, audit tracking
```

## New coordinating surfaces

```txt
ProviderManifest
ProviderRevision
ModuleIdentity
ModuleDependencyReceipt
BareSpecifierResolution
RouteProviderAttempt
ProviderCompatibilityProbe
ProviderCompositionCandidate
RouteProviderAdmissionCommand
RouteProviderAdmissionResult
ModuleGraphManifest
ProviderConflictResult
ProviderRollbackReceipt
PublicProviderGraphSnapshot
FirstProviderConvergedFrameAck
SourceProviderFixture
BuiltProviderFixture
PagesProviderFixture
```

## Admission transaction

```txt
RouteProviderAdmissionCommand
  -> resolve one canonical provider revision
  -> derive direct URLs and import-map entries from one manifest
  -> load candidate root, stable-kit, ProtoKit, Three.js, and Rapier modules
  -> collect provider dependency receipts
  -> reject split or unknown NexusEngine revisions
  -> probe required factories and descriptor compatibility
  -> compose engine, physics, streaming, renderer, and route host
  -> publish RouteProviderAdmissionResult
  -> expose ModuleGraphManifest through diagnostics
  -> acknowledge FirstProviderConvergedFrameAck
```

## Ownership rule

The route bootstrap owns provider identity. Stable kits and ProtoKits may declare a dependency on `nexusengine`, but they must resolve to the exact provider revision admitted by the route. A successful shape check is not a substitute for identity and compatibility evidence.
