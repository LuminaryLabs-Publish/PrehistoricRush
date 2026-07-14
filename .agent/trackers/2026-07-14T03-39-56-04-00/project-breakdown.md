# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-14T03-39-56-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Runtime revision reviewed:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Prior documentation head:** `ffe71fe93671b4ada5a473232fddf9e26754862a`  
**Status:** `player-character-profile-revision-admission-authority-audited`

## Summary

PrehistoricRush has one shared player-character profile store used by the menu, character creator and game. The store normalizes values and increments a numeric revision, but cross-document writes and events have no writer identity, expected-base revision, message ID, payload fingerprint or conflict result.

The game reads the profile once before its asynchronous provider imports. A newer accepted profile can arrive while the engine is loading, yet the run still composes the earlier creature. The public host reports profile revision and player-body content hash separately, without an admission receipt or first visible frame proving which profile was rendered.

## Plan ledger

**Goal:** make every menu, creator and game document converge on one accepted profile revision, then bind the run and first visible raptor frame to that immutable profile artifact.

- [x] Compare all 11 accessible Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm 10 eligible repositories are centrally tracked and have root `.agent` state.
- [x] Find no new, ledger-missing, root-agent-missing or runtime-ahead eligible repository.
- [x] Select only PrehistoricRush by the oldest eligible central documentation timestamp.
- [x] Inspect the profile store, menu projection, creator draft/save path, preview lifecycle and game composition.
- [x] Preserve the full 59-surface kit, adapter and proof inventory.
- [x] Identify the complete interaction loop, domains and offered services.
- [x] Add the `2026-07-14T03-39-56-04-00` tracker and focused audit family.
- [x] Change no runtime, renderer, package, test, workflow or deployment source.
- [x] Use `main` only and create no branch or pull request.
- [ ] Implement compare-and-set profile writes, monotonic event admission, run sealing and visible-frame proof later.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible non-Cavalry repositories: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing repositories: 0
root-agent-missing repositories: 0
runtime-ahead repositories: 0
selected repository: PrehistoricRush
selection rule: oldest eligible central documentation timestamp
excluded repository: TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` was modified in the Publish organization.

## Complete interaction loop

```txt
menu document
  -> load profile from localStorage or defaults
  -> render profile ID-independent visual summary and numeric revision
  -> subscribe to local, BroadcastChannel and storage events
  -> replace the card with every admitted normalized profile

creator document
  -> load one draft from localStorage
  -> import pinned preview providers asynchronously
  -> mutate local draft immediately on controls
  -> schedule one profile patch after 160 ms
  -> accept remote profile events without revision ordering
  -> transition preview toward whichever profile arrived last

game document
  -> load one profile before pinned runtime imports settle
  -> asynchronously load Nexus Engine, kits, Three.js and Rapier
  -> compose creature/character/player state from that earlier profile
  -> start deterministic run, streaming, physics and rendering
  -> expose profile ID/revision and player-body content hash separately
  -> never revalidate storage or acknowledge a visible frame for the admitted profile
```

## Domains in use

```txt
browser documents, navigation, lifecycle, DOM, localStorage, BroadcastChannel and storage events
profile schema normalization, persistence, revision assignment, subscription and reset
creator draft state, debounced writes, remote-update intake and preview transition
run admission, immutable character composition and public host readback
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation and Motion
articulated dynamics and articulated motion
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition and Presentation
product run, route, surface, score, outcomes, player pose, terrain IK and pause menu
seeded patch generation, Worker execution, stable instance cells and patch-owned rendering
Rapier physics, Three.js creator/game presentation, validation, build and Pages deployment
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, references, registry, snapshot and reset
core-character-kit: character registry, bindings, status, snapshot and reset
core-player-kit: player registry, possession, control and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution and committed frames
core-motion-kit: motion intents, requests and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral graphics descriptors
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation composition graph and snapshots
core-presentation-output-kit: surface input, viewport policy, render resolution and safe area
core-ui-scale-kit: reference resolution, viewport scale and scale policy
core-camera-framing-kit: subject framing, perspective/orthographic fit and damping
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic random streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision and legacy pose
instanced-render-batch-kit: batch registry, cell membership, stable ranges, changed-range flush, overflow diagnostics and bounds invalidation
seeded-world-patch-controller-kit: focus, desired active/prefetch sets, generation queue, Worker execution, cache, ready/release queues, stats and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta and snapshots
```

### Product, page and Worker kits: 16

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, character/control, pose and ground IK
prehistoric-rush-pause-menu-domain-kit: menu state, commands, events and snapshot
prehistoric-rush-resolution-policy: collisions, pickups, goal and transition resolution
player-character-composition-kit: body, rig, creature, character and optional possession
player-articulation-adapter-kit: legacy-pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: localStorage persistence, revision assignment, BroadcastChannel and storage-event publication
menu-page-kit: title, selected-profile projection and game/creator navigation
character-creator-page-kit: controls, draft state, reset, external-profile intake and preview startup
character-preview-transition-kit: morph and crossfade preview lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application and disposal
game-page-entry-kit: HUD removal, runtime import and pause host
player-raptor-preset-kit: authored player creature content
drunk-route-generator: deterministic route queries
prehistoric-patch-generator: terrain, trees, grass, pickups and colliders
prehistoric-patch-worker: patch Worker init, request and result protocol
```

### External and host adapters: 9

```txt
three-runtime-module: scene, resource and render submission primitives
rapier-physics-domain-kit: Nexus Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling and disposal
three-patch-stream-adapter-kit: terrain slots, patch activation/release, instance cells, collider membership, pickup refresh, height sampling, camera/render and ownership readback
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: 160 ms debounced profile write scheduling
browser-input-adapter: keyboard, blur and restart input projection
creature-camera-render-host-adapters: player pose, camera, HUD and public diagnostics projection
```

### Proof kits: 7

```txt
prehistoric-rush-resolution-policy-test-kit
player-articulation-test-kit
player-character-composition-test-kit
player-pose-authority-test-kit
character-creator-authority-test-kit
pause-menu-authority-test-kit
patch-owned-streaming-authority-test-kit
```

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits:         5
product/page/Worker kits:         16
external/host adapters:            9
proof kits:                        7
total surfaces:                   59
```

## Source-backed findings

```txt
profile normalization and defaults: present
numeric revision increment: present
localStorage persistence: present
BroadcastChannel publication: present
storage-event publication: present
menu live profile projection: present
creator debounced persistence: present
creator remote profile intake: present
game profile read before async provider load: present
public profile revision readback: present
public player body content hash readback: present

writer/page generation: absent
ProfileWriteId and message ID: absent
expected-base compare-and-set: absent
same-revision conflict classification: absent
payload fingerprint: absent
monotonic event admission: absent
duplicate/out-of-order suppression: absent
pending creator write cancellation after newer remote revision: absent
run-time revalidation after provider load: absent
sealed RunCharacterArtifact: absent
profile revision to body-content-hash receipt: absent
first matching visible character-frame acknowledgement: absent
profile subscription/channel retirement from page hosts: absent
cross-tab and delayed-provider executable fixture: absent
```

## Main architecture finding

`savePlayerCharacterProfile()` computes the next revision from the profile currently visible in localStorage, then writes and broadcasts without an expected-base check. Two documents can derive the same next revision and overwrite each other. Subscribers normalize and accept every BroadcastChannel or storage payload without comparing revision or fingerprint.

The creator schedules writes 160 ms after input while also replacing its draft from remote events. The game captures one profile before asynchronous imports and never revalidates before engine composition. These paths can produce a menu, creator preview, stored profile and active run that cite different character content while each appears locally valid.

## Required authority

```txt
prehistoric-rush-player-character-profile-revision-admission-authority-domain
```

```txt
ProfileWriteCommand
  -> bind ProfileWriteId, WriterId, DocumentGeneration and expected base revision
  -> normalize and fingerprint the candidate
  -> compare-and-set against the accepted profile artifact
  -> return Accepted, Conflict, Duplicate, Stale, Failed or Retired
  -> publish one immutable ProfileRevisionAccepted event

ProfileEventAdmission
  -> validate schema, profile ID, revision, writer, message ID and fingerprint
  -> suppress duplicate, same-revision-conflicting and out-of-order events
  -> cancel or rebase pending local writes explicitly
  -> project one accepted profile revision into menu and creator state

RunCharacterAdmissionCommand
  -> wait for provider readiness
  -> resolve the latest accepted profile revision
  -> seal profile ID, revision, creature fingerprint and body content hash
  -> compose the run from that immutable artifact
  -> publish RunCharacterAdmissionResult
  -> acknowledge the first visible frame carrying the same artifact
```

## Validation boundary

Source and existing documentation were inspected through GitHub. No runtime source changed. `npm test`, multi-tab conflict tests, delayed-provider run-admission tests, creator pending-write race tests, visible-frame correlation, built-output and Pages fixtures were not executed.
