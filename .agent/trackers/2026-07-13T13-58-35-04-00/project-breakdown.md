# Project Breakdown: PrehistoricRush Player Character Composition Transition

**Timestamp:** `2026-07-13T13-58-35-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `0c181c308716eb4a143768a0c674177c33c2264c`  
**Status:** `player-character-composition-transition-authority-central-reconciled`  
**Technical status:** `player-character-composition-transition-authority-audited`

## Summary

PrehistoricRush now composes the playable dinosaur and creator preview through Core Creature, Core Character and Core Player rather than treating the procedural mesh as the full gameplay identity. The composition publishes neutral creature support/presentation descriptors, active character bindings and player possession, while the creator uses the same composition path for grounding, framing and articulated posing.

The remaining boundary is atomic composition adoption. `installPrehistoricRushPlayerCharacter()` mutates the articulated rig, creature registry, character registry and player registry sequentially. The creator calls this mutation path before topology validation, mesh creation, crossfade completion and visible adoption. A later failure can therefore leave Core registries on a successor profile while the visible preview, camera framing or persisted profile remains on the predecessor.

## Plan ledger

**Goal:** preserve the new Core Creature/Character/Player composition while defining one revisioned transaction that prepares, validates and adopts every registry and visible-preview participant together.

- [x] Enumerate all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare all nine eligible repositories with `LuminaryLabs-Dev/LuminaryLabs`.
- [x] Confirm every eligible repository has a central ledger entry and root `.agent` entrypoint.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` because it had the oldest central timestamp and 18 source/test commits after its documented runtime revision.
- [x] Inspect the player-character composition helper, Core Creature/Character/Player contracts, game-domain adoption, creator transition, support-anchor placement, camera framing, persistence scheduling and tests.
- [x] Identify the full interaction loop, domains, kits and offered services.
- [x] Add this timestamped tracker and architecture/render/gameplay/interaction/composition/deploy/central-sync audit family.
- [x] Refresh every required root `.agent` document and machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement atomic composition preparation/adoption and executable failure fixtures later.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
central ledger entries: 9
root .agent entrypoints: 9
new or ledger-missing repositories: 0
root-agent-missing repositories: 0

PrehistoricRush    last central update 2026-07-13T08-39-12-04-00
                   documented runtime 666ab306
                   current runtime 0c181c30 selected
TheUnmappedHouse   2026-07-13T09-03-20-04-00
AetherVale         2026-07-13T10-05-15-04-00
IntoTheMeadow      2026-07-13T10-59-22-04-00
PhantomCommand     2026-07-13T11-41-10-04-00
HorrorCorridor     2026-07-13T11-58-45-04-00
MyCozyIsland       2026-07-13T12-38-45-04-00
ZombieOrchard      2026-07-13T13-01-03-04-00
TheOpenAbove       2026-07-13T13-39-10-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` was modified in the Publish organization.

## Runtime changes reconciled

```txt
32a6894 feat: add player character composition authority
ef1cf08 feat: compose PrehistoricRush through Core Creature Character Player
7ba3c5e feat: preview the composed articulated character
a96da35 feat: frame and ground the composed character preview
aba44a9 test: cover player character composition
da64b39 test: cover composed character creator authority
5b820fa fix: preserve idempotent player character composition
700b9b3 test: model idempotent Core composition behavior
7bab2c1 chore: pin Core Creature Character Player runtime
226747a test: cover Core player character pose authority
84a05df test: run player character and creator coverage
76a1eb3 fix: publish unscaled character presentation bounds
0cbe893 fix: ground preview from composed character bounds
8e5d23a fix: frame composed character bounds without double scaling
cfa2ad2 test: cover composed bounds grounding and framing
fd22b72 test: cover unscaled composed character bounds
6eb16ab fix: place character from composed support anchors
0c181c3 test: cover support-anchor character placement
```

## Complete interaction loop

```txt
game boot
  -> load persisted player profile
  -> load commit-pinned Nexus Engine and official kits
  -> install Core Creature, Core Character and Core Player
  -> procedural body kit creates a body descriptor
  -> player-character composition creates an articulated rig
  -> register or replace creature definition
  -> create or replace active character bindings
  -> register and possess player
  -> product domain resolves the controlled character
  -> simulation publishes pose through the character binding
  -> Three.js renders the controlled creature

creator boot
  -> load the same profile and composition-capable runtime
  -> compose preview creature, rig and character without player possession
  -> evaluate support bones from an empty support pose
  -> derive one support-local Y and ground the mesh on the platform
  -> derive camera bounds from registered presentation metadata
  -> animate the articulated preview and render

creator edit
  -> input mutates draft profile
  -> setTargetProfile calls composition immediately
  -> live rig/creature/character registries change
  -> topology decides damped morph versus mesh crossfade
  -> pose, placement and camera framing converge
  -> appliedRevision changes only after visible transition settles
  -> delayed persistence writes profile and invokes composition again

failure boundary
  -> registry mutation can complete before mesh preparation or crossfade
  -> no composition attempt, participant receipt, rollback or visible acknowledgement
```

## Domains in use

```txt
browser page shell, module preflight, fatal projection, resize and RAF
player-profile schema, browser persistence, revision and cross-page distribution
Core Creature neutral embodiment definitions, body/rig references, support anchors and presentation hints
Core Character active identity, creature binding, pose/motion/physics bindings, status and lifecycle revision
Core Player identity, possession, control authority and spawn generation
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion rig registration, FK evaluation, target solving, pose frames and reset
articulated dynamics bodies, joints, motors and ragdoll state
procedural creature descriptor, geometry, skeleton, skinning, collision and legacy gait pose
player-character composition across body, rig, creature, character and player registries
support-anchor evaluation, local bounds, preview grounding and camera framing
profile draft, persistence debounce, topology morph and crossfade lifecycle
Rapier bodies, colliders, requests, contacts and frames
seeded route and Worker/fallback patch streaming
terrain, trees, grass, shards, colliders and height sampling
run lifecycle, movement, jumping, scoring, collision, failure and victory
Three.js creature/terrain rendering, camera, lighting, instancing, HUD and diagnostics
composition attempt identity, participant preparation, atomic adoption, rollback and visible proof
validation, build and GitHub Pages deployment
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 18

| Kit | Offered services |
|---|---|
| `core-input-kit` | actions; bindings; input state |
| `core-spatial-kit` | transforms; spatial queries |
| `core-scene-kit` | scene registry; transitions; host descriptor |
| `core-creature-kit` | creature definitions; registry; reference validation; support/presentation descriptors; snapshot; reset |
| `core-character-kit` | character descriptors; registry; creature resolution; pose/motion/physics bindings; status; snapshot; reset |
| `core-player-kit` | player registry; possession; control authority; spawn generation; controlled-character resolution; snapshot; reset |
| `core-physics-kit` | provider; bodies; colliders; motion requests; step; contact frame |
| `articulated-dynamics-domain-kit` | articulations; joints; motors; ragdoll state; frames; snapshot; reset |
| `core-simulation-kit` | tick context; proposals; observations; resolution; commit; frame |
| `core-motion-kit` | movement modes; intents; trajectories; motion frames; validation; snapshot; reset |
| `articulated-motion-domain-kit` | rigs; FK pose evaluation; targets; two-bone IK; resolution; frames; snapshot; reset |
| `core-camera-kit` | camera capability |
| `core-animation-kit` | animation capability |
| `core-graphics-kit` | graphics and frame capability |
| `core-skybox-kit` | sky descriptor |
| `core-ui-kit` | UI capability and projection |
| `core-diagnostics-kit` | diagnostics and readback |
| `core-composition-kit` | composition metadata and capability graph |

### Official NexusEngine-Kits: 5

| Kit | Offered services |
|---|---|
| `seed-kit` | deterministic seed and random streams |
| `procedural-creature-body-kit` | descriptor; geometry; skeleton; skinning; collision; legacy pose; snapshot |
| `instanced-render-batch-kit` | cell replace/release; flush; overflow; bounds; stats |
| `seeded-world-patch-controller-kit` | focus; membership; queue; cache; generation; delivery; activation; eviction; snapshot; reset |
| `camera-smooth-follow-kit` | damping; reset; teleport handling; snapshot |

### Product, page and Worker kits: 15

| Kit | Offered services |
|---|---|
| `prehistoric-rush-domain-kit` | run; route; surface; score; outcome policy; player creature; player character; player control; articulation; PlayerPose; ground-leg IK; snapshots |
| `prehistoric-rush-resolution-policy` | physics/fallback collision precedence; pickups; goal; state patch; events; transitions |
| `player-character-composition-kit` | body creation; rig registration; creature definition; character binding; optional player possession; clone-safe composition result |
| `player-articulation-adapter-kit` | skeleton-to-rig conversion; legacy-pose conversion; quaternion normalization; terrain hind-leg targets |
| `player-character-schema-kit` | defaults; normalization; clamps; merge |
| `player-character-profile-store-kit` | load; save; patch; reset; revision; browser distribution |
| `menu-page-kit` | shell; profile projection; routes; profile subscription |
| `character-creator-page-kit` | controls; draft; persistence; reset; subscription; preview; RAF; navigation |
| `character-preview-transition-kit` | composition; support-anchor grounding; morph; crossfade; pose damping; target/applied revision; disposal |
| `three-procedural-creature-adapter-kit` | skinned mesh; bone lookup; exact/damped pose application; topology checks; opacity; disposal |
| `game-page-entry-kit` | module preflight; failure projection; import; profile boot binding |
| `drunk-route-generator` | samples; nearest point; progress; classification; snapshot |
| `player-raptor-preset-kit` | creature recipe; skeleton; collision capsule |
| `prehistoric-patch-generator` | terrain heights/normals/colors; trees; grass; shards; colliders; bounds; transferables |
| `prehistoric-patch-worker` | initialization; generation; error protocol; transfer |

### External and host adapters: 9

| Adapter | Offered services |
|---|---|
| `three-runtime-module` | scene; geometry; materials; instancing; skeleton; camera; lighting; rendering |
| `rapier-physics-domain-kit` | Nexus physics provider bridge |
| `rapier-runtime-module` | bodies; colliders; queries; world step; contacts |
| `message-worker-executor-adapter-kit` | request correlation; pending rejection; listener removal; Worker termination |
| `active-content-consumer-adapter` | patch activation/release; terrain mesh; vegetation; pickups; colliders; height sampling |
| `creator-viewport-framing-adapter` | bounds; target; distance; near/far projection |
| `creator-persistence-scheduler` | timer replacement; delayed profile commit |
| `browser-input-adapter` | keyboard; buttons; keyup; blur; input patch; restart activation |
| `creature-camera-render-host-adapters` | controlled-character pose consumption; damping; streaming; fallback collision; camera; HUD; readback |

### Proof kits: 5

| Kit | Offered services |
|---|---|
| `prehistoric-rush-resolution-policy-test-kit` | continue; win; collision precedence; pickup idempotency; serialization |
| `player-articulation-test-kit` | rig adaptation; quaternion conversion; deterministic terrain-target math |
| `player-character-composition-test-kit` | composition identity; local bounds; support descriptors; idempotence; replacement; optional possession |
| `player-pose-authority-test-kit` | Core controlled-character path; pose binding; FK/target/solve markers; runtime pin; render ordering |
| `character-creator-authority-test-kit` | shared composition path; support-anchor placement; bounds framing; creator solve markers |

```txt
Nexus Engine root/subdomain kits: 18
official NexusEngine-Kits:         5
product/page/Worker kits:         15
external/host adapters:            9
proof kits:                        5
total surfaces:                   52
```

## Source-backed findings

- Core Creature, Character and Player are now installed in the game kit graph and the product domain requires them.
- The composition helper creates the procedural body, registers the articulated rig, registers or replaces the creature, creates or replaces the character, then registers/possesses the player.
- Those operations publish participant state independently; there is no detached candidate set or aggregate commit result.
- `registerOrReplace()` interprets an exception message containing `different data` as permission to replace. The product helper therefore depends on error text rather than a typed duplicate/conflict result.
- Character replacement preserves the prior pose binding and lifecycle revision while replacing creature/profile/motion/physics/status data.
- Creator composition uses `includePlayer: false`, but still mutates the rig, creature and character registries before visual transition admission.
- `setTargetProfile()` calls `compose(profile)` before topology testing and before creating the successor mesh.
- The registered creature stores local unscaled geometry bounds and support bone IDs. The creator separately evaluates an empty support pose and retains `supportLocalY` only in transition-local state.
- `targetRevision` is updated after composition; `appliedRevision` changes only after morph convergence or crossfade completion.
- Draft edits invoke composition immediately, then the delayed persistence callback invokes it again with the committed profile revision.
- Existing tests cover successful/idempotent composition and static creator markers. They do not inject failures after rig, creature, character, possession, mesh creation, crossfade or camera-framing preparation.

## Main finding

```txt
profile revision N+1
  -> register/replace rig
  -> register/replace creature
  -> create/replace character
  -> optional player possession
  -> Core registries now identify N+1
  -> topology/mesh/crossfade/framing work begins
  -> visible preview can still identify N
  -> persistence can still identify N
  -> no terminal composition result classifies the split
```

The new Core composition is the correct semantic direction. The missing layer is not another Creature, Character or Player domain. It is a product composition transaction that coordinates their existing APIs with support evaluation and presentation adoption.

## Required parent domain

```txt
prehistoric-rush-player-character-composition-transition-authority-domain
```

## Required transaction

```txt
PlayerCharacterCompositionCommand
  -> bind engine generation, profile revision and composition attempt ID
  -> bind expected body, rig, creature, character and player revisions
  -> build detached body/rig/creature/character/player candidates
  -> evaluate support anchors and presentation bounds from the candidate rig/body
  -> validate references, topology, bindings and possession policy
  -> prepare successor mesh, placement and framing without live mutation
  -> reject stale, duplicate, conflicting or failed work with zero adoption
  -> atomically adopt all registry participants or preserve all predecessors
  -> publish PlayerCharacterCompositionResult and participant receipts
  -> begin one visible morph/crossfade generation from the accepted result
  -> release predecessor resources only after accepted presentation adoption
  -> publish FirstComposedCharacterFrameAck
```

## Required proof

```txt
failure after rig preparation leaves every live registry unchanged
failure after creature preparation leaves character/player unchanged
failure during character or possession preparation rolls back every participant
changed composition produces one typed replacement result without parsing error text
identical composition returns one duplicate/idempotent result without revisions changing
support anchors and bounds cite the same candidate body/rig generation
creator registry state and visible mesh cite one accepted profile revision
rapid edits retire stale composition and crossfade generations
persistence, registry readback and visible preview converge on the same revision
source runtime, built output and Pages fixtures agree
```

## Validation boundary

Documentation only. Source, tests, package wiring and the pinned Core contracts were inspected through GitHub. No runtime, renderer, package or deployment source was changed. `npm test`, browser creator behavior, failure injection, built output and GitHub Pages parity were not independently executed.