# PrehistoricRush Project Breakdown

**Timestamp:** `2026-07-15T04-03-03-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Reviewed repository head:** `34be1adad1ef169a14dd48d9e3016e9477684039`  
**Runtime source revision retained:** `ab3c63fed62b70e776ee56c4295f359bc3660274`  
**Status:** `creator-profile-navigation-commit-authority-audited`

## Summary

The character creator applies edits immediately to its in-memory draft and live Three.js preview, but persists them only from a 160 ms timeout. The Menu and Play links navigate normally, and the `beforeunload` handler only disposes preview resources. A user who edits a value and immediately activates either link can leave before the timeout writes the final patch.

`src/game-runtime.js` then calls `loadPlayerCharacterProfile()` once before composing the player creature. The creator can therefore display the newest raptor while the next route constructs the previous stored revision.

## Plan ledger

**Goal:** make creator draft acceptance, durable profile persistence, route navigation, run-character sealing, and the first matching visible raptor frame one correlated transaction.

- [x] Enumerate all 11 accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm ten eligible central ledgers and ten root `.agent` states.
- [x] Compare current repository heads with recorded documentation heads.
- [x] Confirm zero new, ledger-missing, root-agent-missing, undocumented, or runtime-ahead repositories.
- [x] Select only PrehistoricRush through the oldest synchronized timestamp rule.
- [x] Trace creator draft mutation, debounce, localStorage, BroadcastChannel, route links, unload handling, game profile loading, composition, and public readback.
- [x] Identify the complete interaction loop, domains, all 59 implemented surfaces, and their offered services.
- [x] Add the timestamped creator-profile navigation audit family.
- [x] Change no runtime, HTML, gameplay, renderer, package, test, workflow, or deployment source.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement durable navigation settlement and executable browser fixtures later.

## Selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
undocumented: 0
runtime-ahead: 0

last documented timestamps:
  PrehistoricRush   2026-07-15T00-00-35-04-00
  TheLongHaul       2026-07-15T00-38-54-04-00
  MyCozyIsland      2026-07-15T01-04-57-04-00
  IntoTheMeadow     2026-07-15T01-39-38-04-00
  HorrorCorridor    2026-07-15T02-00-17-04-00
  TheOpenAbove      2026-07-15T02-09-29-04-00
  ZombieOrchard     2026-07-15T02-38-45-04-00
  TheUnmappedHouse  2026-07-15T02-59-31-04-00
  PhantomCommand    2026-07-15T03-24-35-04-00
  AetherVale        2026-07-15T03-41-50-04-00

selected: LuminaryLabs-Publish/PrehistoricRush
rule: oldest synchronized eligible repository
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
menu or creator route
  -> load and normalize the stored player profile
  -> creator keeps one mutable in-memory draft
  -> slider or color input updates the draft and preview immediately
  -> mark the status as Saving
  -> cancel the previous timeout
  -> schedule a profile patch after 160 ms

fast navigation path
  -> user activates Menu or Play before the timeout fires
  -> normal anchor navigation begins
  -> beforeunload disposes the preview only
  -> no pending profile flush or commit result is required
  -> the final visible draft can remain unpersisted

game route
  -> loadPlayerCharacterProfile reads localStorage once
  -> compose the procedural creature from that stored profile
  -> start physics, streaming, simulation, camera, and Three.js rendering
  -> public readback exposes the loaded profile ID and revision
  -> no route receipt proves that the creator draft, stored revision,
     composed body hash, and visible character frame match
```

## Domains in use

```txt
browser document, input, timers, anchor navigation, pagehide, beforeunload, storage, BroadcastChannel, and RAF lifecycle
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation, Motion, Camera, Animation, Graphics, Skybox, UI, Diagnostics, Composition, and Presentation
product run, route, surface, score, outcome, pause, player composition, pose, and terrain IK
player-profile schema, draft state, revision, persistence, cross-document publication, navigation settlement, and run sealing
creator controls, preview transition, camera framing, Three.js rendering, and resource retirement
deterministic seed, procedural creature, instancing, patch streaming, Worker, Rapier, and camera follow
validation, static hosting, build, Pages, and central audit tracking
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 22

```txt
core-input-kit: actions, axes, bindings, and input snapshots
core-spatial-kit: transforms and spatial state
core-scene-kit: scene registry and transitions
core-creature-kit: creature definitions, references, registry, snapshot, and reset
core-character-kit: character registry, bindings, status, snapshot, and reset
core-player-kit: player registry, possession, control, and spawn generations
core-physics-kit: provider-backed bodies, colliders, motion requests, stepping, and frames
articulated-dynamics-domain-kit: articulated constraints and physics-provider integration
core-simulation-kit: proposals, observations, resolution, and committed frames
core-motion-kit: motion intents, requests, and committed motion frames
articulated-motion-domain-kit: rigs, FK, targets, IK solve, and snapshots
core-camera-kit: camera descriptors and state
core-animation-kit: animation descriptors and state
core-graphics-kit: renderer-neutral graphics descriptors
core-skybox-kit: skybox presets and state
core-ui-kit: UI descriptors and registry
core-diagnostics-kit: diagnostics state and snapshots
core-composition-kit: game composition capabilities
core-presentation-domain: presentation composition graph and snapshots
core-presentation-output-kit: surface input, viewport policy, render resolution, and safe area
core-ui-scale-kit: reference resolution, viewport scale, and scale policy
core-camera-framing-kit: subject framing, projection fit, damping, and clipping policy
```

### Official NexusEngine-Kits: 5

```txt
seed-kit: deterministic world seeds and named random streams
procedural-creature-body-kit: geometry, skeleton, skinning, collision, descriptors, and legacy pose
instanced-render-batch-kit: batch registry, stable ranges, cell membership, flush, and diagnostics
seeded-world-patch-controller-kit: focus, desired sets, generation queue, cache, adoption, release, and snapshots
camera-smooth-follow-kit: damped follow, reset, bounded delta, and snapshots
```

### Product, page, and Worker kits: 16

```txt
prehistoric-rush-domain-kit: run, route, surface, score, outcomes, player, pose, and ground IK
prehistoric-rush-pause-menu-domain-kit: pause state, commands, events, and snapshot
prehistoric-rush-resolution-policy: movement, collision, pickup, goal, and transition resolution
player-character-composition-kit: body, rig, creature, character, and possession
player-articulation-adapter-kit: legacy-pose conversion and terrain foot targets
player-character-schema-kit: profile normalization and validation
player-character-profile-store-kit: localStorage, revisions, BroadcastChannel, storage events, save, patch, reset, and subscriptions
menu-page-kit: title, selected-profile projection, and navigation
character-creator-page-kit: controls, draft state, debounce, reset, external updates, navigation, and preview startup
character-preview-transition-kit: morph, crossfade, pose, and resource lifecycle
three-procedural-creature-adapter-kit: mesh creation, pose application, and disposal
game-page-entry-kit: dependency preflight, runtime entry, feedback cleanup, and pause host
player-raptor-preset-kit: authored player creature content
drunk-route-generator: deterministic control points, samples, nearest query, classification, and progress
prehistoric-patch-generator: terrain, trees, grass, pickups, and colliders
prehistoric-patch-worker: Worker initialization, request, and result protocol
```

### External and host adapters: 9

```txt
three-runtime-module: scene, resource, and render submission primitives
rapier-physics-domain-kit: Core Physics to Rapier provider bridge
rapier-runtime-module: Rapier initialization and runtime types
message-worker-executor-adapter-kit: request correlation, response handling, and disposal
three-patch-stream-adapter-kit: patch presentation, colliders, pickups, height, camera, and ownership
creator-viewport-framing-adapter: creator camera and viewport projection
creator-persistence-scheduler: delayed profile writes and timer replacement
browser-input-adapter: keyboard, blur, jump, boost, steer, start, and restart projection
creature-camera-render-host-adapters: pose, camera, feedback, and diagnostics projection
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
total implemented surfaces:       59
planned navigation-commit surfaces: 20
```

## Source-backed findings

```txt
creator draft updates immediately: present
preview target updates immediately: present
Saving status: present
160 ms delayed persistence: present
replacement of prior save timer: present
normal Menu and Play anchors: present
beforeunload preview disposal: present
beforeunload or pagehide profile flush: absent
navigation interception pending commit: absent
typed profile commit result: absent
commit failure or storage-quota result: absent
expected persisted revision on destination: absent
game loads stored profile once before composition: present
public profile ID and revision readback: present
profile revision to body content hash receipt: absent
first matching creator or game character frame acknowledgement: absent
browser navigation durability fixtures: absent
```

## Main architecture finding

Draft mutation, delayed storage, route navigation, game composition, and visible presentation are separate side effects. The creator reports `Saving` and displays the candidate immediately, but route navigation is not gated by a successful stored-profile revision. The destination can therefore consume the predecessor profile without any rejected command, error surface, or mismatch receipt.

This does not replace the retained cross-document profile-revision audit. It narrows one concrete boundary: settlement of a pending local creator mutation before route ownership changes.

## Required authority

```txt
prehistoric-rush-creator-profile-navigation-commit-authority-domain
```

```txt
CreatorProfileCommitCommand
  -> bind creator document generation, mutation ID,
     base profile revision, draft revision, and destination intent
  -> normalize and fingerprint the complete candidate profile
  -> resolve concurrent storage or BroadcastChannel changes
  -> persist one accepted revision and verify readback
  -> reject stale, conflicting, invalid, unavailable,
     quota-failed, duplicate, or superseded work
  -> publish CreatorProfileCommitResult
     with stored revision and payload hash
  -> allow Menu or Play navigation only after acceptance
  -> carry the accepted profile receipt into destination startup
  -> seal the game creature against the accepted revision and body hash
  -> publish FirstCommittedProfileFrameAck
```

## Validation boundary

This is a documentation-only audit. Source inspection verified the creator input path, 160 ms timer, normal navigation links, unload cleanup, profile-store write behavior, game startup load, composition input, and public profile readback. No runtime, HTML, gameplay, renderer, package, test, workflow, or deployment source changed.

`npm test`, immediate-navigation, pagehide, storage failure, concurrent update, destination revision, body-hash, visible-frame, built-output, and GitHub Pages fixtures were not executed.