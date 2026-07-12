# Current Audit: PrehistoricRush Character Creator Draft and Preview Frame Authority

**Updated:** `2026-07-11T21-00-00-04-00`

## Summary

`PrehistoricRush` now has working `game.html` and `charactercreator.html` hosts, a saved profile handoff into gameplay, one shared Three.js procedural-creature adapter, a real skinned-mesh showcase, damped compatible-topology morphing, topology crossfades, and a condensed centered creator UI.

The current gap is no longer route existence or generator parity. The gap is authority across **draft edits, debounced persistence, preview transition, camera framing, and the first visible saved frame**.

Two concrete defects remain:

1. The debounce callback persists only the final captured partial patch. Rapid edits across different groups can cancel an earlier unsaved patch and then replace the in-memory draft with a stored profile that lacks that earlier edit.
2. Draft edits reuse the last stored profile revision. The preview transition can therefore report `settled` while geometry is still morphing, because `appliedRevision` and `targetRevision` are numerically equal even though the descriptor changed.

The new viewport framing pass also uses a local bind-pose geometry box and a scalar `span * 1.9` heuristic. It does not prove that the animated skinned creature fits the current horizontal and vertical field of view.

## Plan ledger

**Goal:** establish one creator transaction that preserves every edit, commits one canonical profile revision, applies the exact descriptor to the preview, computes projection-correct framing, and acknowledges the first rendered frame carrying that committed profile.

- [x] Compare the full ten-repository Publish inventory against central tracking.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledgers and root `.agent` state.
- [x] Prioritize `PrehistoricRush` because substantive creator runtime changes landed after its previous audit.
- [x] Trace creator controls, draft mutation, debounce save, profile store, cross-context updates, generator, morph/crossfade, framing, render and game handoff.
- [x] Identify the interaction loop, domains, kits and offered services.
- [x] Define draft, commit, transition, viewport-fit and visible-frame authority.
- [x] Add timestamped architecture and system audits.
- [ ] Implement the authority and executable fixtures.

## Repository selection

```txt
accessible LuminaryLabs-Publish repositories: 10
eligible non-Cavalry repositories: 9
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

selected: LuminaryLabs-Publish/PrehistoricRush
reason: character creator UX, framing and workflow commits landed after the
        previous 2026-07-11T19-09-25-04-00 audit
excluded: LuminaryLabs-Publish/TheCavalryOfRome
other Publish repositories changed: none
```

## Complete interaction loops

### Menu and page routing

```txt
index.html / menu.html
  -> load saved character profile
  -> render active raptor summary
  -> Character Creator -> charactercreator.html
  -> Start Run -> game.html
```

### Creator edit, preview and save

```txt
charactercreator.html
  -> load profile into local draft
  -> load pinned Nexus Engine, seed kit, creature kit and Three.js
  -> create generator-backed creature descriptor
  -> create shared-adapter SkinnedMesh
  -> start preview RAF

control input
  -> merge a partial group patch into local draft
  -> render controls
  -> set preview target from draft
  -> mark Saving
  -> cancel previous 160 ms timer
  -> schedule a timer that captures only this partial patch

preview RAF
  -> generate pose from current target descriptor
  -> damp compatible geometry/material/scale or crossfade topology
  -> compute local geometry bounding box
  -> damp camera target and scalar distance
  -> render
  -> map transition mode to Ready or Updating

debounce completion
  -> reload stored profile
  -> merge only the captured final partial patch
  -> increment stored revision
  -> write localStorage
  -> broadcast profile
  -> replace local draft with returned stored profile
  -> set preview target again
  -> mark Saved
```

### Game handoff

```txt
game.html
  -> load saved profile
  -> pass profile.creature into createPrehistoricRushKitGraph
  -> procedural-creature-body-kit creates game descriptor
  -> shared Three adapter creates the player SkinnedMesh
  -> Rapier uses the descriptor collision recommendation
  -> gameplay pose and rendering consume the saved creature
```

## Concrete draft-loss defect

```txt
stored profile: proportions A, material A

edit Size
  -> local draft becomes proportions B, material A
  -> timer captures { proportions: B }

within 160 ms edit Skin
  -> local draft becomes proportions B, material B
  -> first timer is cancelled
  -> second timer captures { material: B }

second timer commits
  -> store reloads proportions A, material A
  -> merges only { material: B }
  -> stored result becomes proportions A, material B
  -> returned profile replaces local draft
  -> Size silently reverts to A
```

The preview can temporarily show both edits while the durable profile receives only the last group.

## Concrete preview-state defect

```txt
stored revision: 12
applied preview revision: 12

unsaved slider edit
  -> descriptor changes
  -> draft revision remains 12
  -> targetRevision remains 12
  -> appliedRevision is already 12
  -> getState() may report settled while vertices are still damping
```

Revision equality is therefore not sufficient to identify descriptor equality or visible-frame completion.

## Concrete framing defect

The creator currently computes framing from `mesh.geometry.boundingBox`, multiplies its center and size by mesh scale, and selects:

```txt
desiredDistance = clamp(max(sizeX, sizeY * 1.35, sizeZ) * 1.9, 4.4, 11)
```

This does not account for:

```txt
current viewport aspect ratio
horizontal field of view
animated skin deformation
bone pose extents
mesh rotation and complete world transform
topology-crossfade union bounds
screen-space margin
near/far plane safety
profile/descriptor/frame revision correlation
```

A centered local bind-pose box is useful as a fallback, but it is not proof that the visible animated creature is centered and unclipped.

## Domains in use

```txt
page routing and static host artifacts
player-profile schema, normalization and persistence
local draft editing and dirty-field accumulation
cross-tab BroadcastChannel and storage synchronization
pinned module/dependency identity
Nexus Engine composition and scene routing
procedural creature recipe, geometry, topology, skeleton, skinning and pose
shared Three.js creature creation, damping, posing, opacity and disposal
preview morph/crossfade transition
preview viewport, camera fit, lighting, platform and render loop
run simulation, input, route, score and outcomes
seeded patch generation, Worker execution and controller
terrain, tree, grass, pickup, collider and height consumers
Rapier actor, fixed colliders, step and contacts
camera smoothing and Three gameplay rendering
HUD, host diagnostics and Pages deployment
creator draft/commit/frame authority: missing
stream cadence, readiness, frame, reset and lifecycle authorities: missing
```

## Complete kit inventory and services

### Nexus Engine core kits

```txt
core-input-kit
  actions, bindings and input state
core-spatial-kit
  transforms and spatial queries
core-scene-kit
  scene registry, transitions and host descriptor
core-physics-kit
  physics-provider contract
core-motion-kit
  motion capability
core-camera-kit
  camera capability
core-animation-kit
  animation capability
core-graphics-kit
  graphics and frame capability
core-skybox-kit
  sky descriptor
core-ui-kit
  UI capability and projection
core-diagnostics-kit
  diagnostics and readback
core-composition-kit
  composition metadata and capability graph
```

### Official NexusEngine-Kits

```txt
seed-kit
  deterministic seed and random streams
procedural-creature-body-kit
  recipe normalization, descriptor generation, topology, geometry, skeleton,
  skinning, collision recommendation, content hash, poses and snapshots
instanced-render-batch-kit
  cell replace/release, flush, overflow, bounds, statistics and snapshots
seeded-world-patch-controller-kit
  patch identity, focus, desired membership, cache, queue, executor,
  ready/release delivery, budgets, eviction, reset and snapshots
camera-smooth-follow-kit
  position/look/quaternion damping, reset, teleport handling and snapshots
```

### Product, page and Worker kits

```txt
prehistoric-rush-domain-kit
  run lifecycle, input, route, surface, score, outcomes, events,
  scene transitions, player creature and snapshot
player-character-schema-kit
  defaults, normalization, clamps, color validation and deep merge
player-character-profile-store-kit
  load, save, patch, reset, revision increment, localStorage,
  subscriptions, storage events, BroadcastChannel and close
menu-page-kit
  menu shell, active-profile projection and route links
character-creator-page-kit
  condensed responsive layout, controls, local draft, debounce save,
  reset, remote projection, showcase startup, resize and RAF
character-preview-transition-kit
  descriptor targeting, compatible morph, topology crossfade,
  pose damping, revision observation and disposal
three-procedural-creature-adapter-kit
  SkinnedMesh creation, pose application, pose damping, topology comparison,
  geometry/material/scale damping, opacity and disposal
game-page-entry-kit
  3D runtime loading
drunk-route-generator
  samples, nearest query, progress, classification and snapshot
player-raptor-preset-kit
  default creature recipe and capsule collision descriptor
prehistoric-patch-generator
  terrain, trees, grass, pickups, colliders, bounds and transferables
prehistoric-patch-worker
  initialization, generation, request/error protocol and transferable delivery
```

### External and host adapter boundaries

```txt
Three runtime module
  scene graph, geometry, materials, skeletons, skinning, cameras, lighting,
  fog, shadows, resizing and rendering
Rapier runtime and rapier-physics-domain-kit
  world bridge, actor, fixed colliders, transforms, step, contacts and reset
message Worker executor adapter
  request correlation and asynchronous generation
active-content consumer adapter
  patch render membership, pickup/collider projection and height sampling
creator viewport framing adapter, currently inline
  local bounds, damped camera target and heuristic distance
creator persistence scheduler, currently inline
  timer cancellation and partial-patch commit
creature/camera/render host adapters
  gameplay creature binding, pose, camera, lighting, HUD and readback
```

## Required authority domain

```txt
prehistoric-rush-character-creator-authority-domain
  -> creator-edit-command-kit
  -> creator-draft-id-kit
  -> creator-draft-revision-kit
  -> creator-dirty-field-set-kit
  -> creator-debounce-policy-kit
  -> creator-flush-command-kit
  -> canonical-profile-write-kit
  -> profile-write-result-kit
  -> profile-conflict-result-kit
  -> creature-descriptor-revision-kit
  -> preview-transition-plan-kit
  -> preview-transition-result-kit
  -> posed-creature-bounds-kit
  -> viewport-revision-kit
  -> projection-correct-fit-kit
  -> preview-frame-commit-kit
  -> saved-visible-parity-kit
  -> creator-observation-kit
  -> creator-journal-kit
  -> creator-draft-frame-fixture-kit
```

## Required transaction

```txt
control edit
  -> allocate draft revision
  -> merge into one canonical local draft
  -> record dirty fields
  -> generate descriptor with descriptor fingerprint
  -> prepare morph or topology transition
  -> compute posed/world-space bounds or declared conservative bounds
  -> solve camera distance from vertical and horizontal FOV plus margin
  -> render frame carrying draft/descriptor/viewport revisions
  -> publish preview-frame receipt

flush
  -> capture the complete canonical draft, not one final partial patch
  -> validate predecessor profile revision
  -> commit one new profile revision or return conflict
  -> broadcast committed result
  -> require a preview frame carrying the committed profile revision
  -> only then project Saved and Ready
```

## Acceptance conditions

```txt
rapid edits across Size, Body, Tail, Legs, Skin and Belly persist together
cancelled timers never discard dirty fields
remote writes return an explicit conflict or deterministic merge result
preview state distinguishes draft, descriptor, applied-mesh and rendered-frame revisions
Ready is impossible while a descriptor is still morphing
Saved is impossible before durable write success
Saved + Ready cites the same committed profile and visible frame
portrait, square and wide viewports retain declared screen-space margins
posed limbs, tail and topology crossfades remain inside the fitted frame
creator and gameplay descriptors share the committed profile fingerprint
```

## Priority placement

```txt
P0   route artifacts and game profile handoff: substantially implemented
P0a  character creator draft, commit and preview-frame authority: next
P1   patch activation/release transaction
P1a  exact collider retirement and collision admission
P1b  stream cadence and time-budget authority
P1c  world readiness and movement admission
P2   committed gameplay-frame observation and host read model
P3   run/stream/collider/Worker/frame epoch reset
P4   startup rollback, resource ownership and disposal
```

No runtime source was changed by this audit.