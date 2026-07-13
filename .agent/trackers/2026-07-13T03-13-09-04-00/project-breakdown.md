# Project Breakdown: PrehistoricRush Collision Source Convergence

**Timestamp:** `2026-07-13T03-13-09-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `collision-source-convergence-authority-audited`

## Summary

PrehistoricRush uses the same streamed tree descriptors to feed two independent fatal-collision paths: Rapier/Core Physics contacts and a browser-host radial fallback sampler. Both observations are resolved in the same simulation step, but they have no shared collider-set revision, candidate identity, comparison result, disagreement policy or visible-frame provenance. Physics silently wins whenever both paths report a hit.

## Plan ledger

**Goal:** define one canonical collision-decision transaction from streamed collider publication through physics/fallback evidence, outcome resolution and the first visible run-over frame.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories remain centrally tracked with root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` using the oldest eligible central timestamp.
- [x] Trace collider generation, activation, Core Physics synchronization, fallback sampling, observation ordering and resolution.
- [x] Preserve the complete 45-surface kit and service inventory.
- [x] Add the timestamped tracker, turn ledger and collision audit family.
- [x] Refresh all required root `.agent` documents and machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime convergence implementation and executable parity fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush    2026-07-13T00-58-50-04-00  selected
HorrorCorridor     2026-07-13T01-08-28-04-00
ZombieOrchard      2026-07-13T01-18-20-04-00
MyCozyIsland       2026-07-13T01-40-00-04-00
TheUnmappedHouse   2026-07-13T01-49-49-04-00
AetherVale         2026-07-13T02-15-51-04-00
TheOpenAbove       2026-07-13T02-18-03-04-00
IntoTheMeadow      2026-07-13T02-39-44-04-00
PhantomCommand     2026-07-13T02-49-07-04-00
TheCavalryOfRome   excluded
```

Only `LuminaryLabs-Publish/PrehistoricRush` is modified in the Publish organization.

## Complete interaction loop

```txt
game boot
  -> load profile and pinned modules
  -> compose Nexus Engine domains and product kit
  -> install Rapier provider and kinematic player body
  -> create patch controller and Worker/fallback generator
  -> create Three.js scene and start run

streaming update
  -> generate deterministic patch
  -> activate patch terrain, trees, grass, pickups and colliders
  -> rebuild active collider list
  -> corePhysics.syncColliders(view.colliders)

simulation tick
  -> integrate candidate run state
  -> submit Core Motion frame and Core Physics kinematic request
  -> Core Physics observation steps provider and returns contacts
  -> fallback observation samples the same active collider descriptors using host radial math
  -> resolution policy chooses first fatal physics contact, otherwise fallback hit
  -> commit continue, fail or win result

presentation
  -> apply committed run state to creature/camera/world
  -> render Three.js frame and HUD
  -> expose physics frame and game snapshot
  -> omit fallback evidence, collider-set revision, comparison result and visible collision-frame acknowledgement
```

## Domains in use

```txt
browser page shell and pinned module admission
player-profile schema, persistence, distribution and boot binding
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion and articulated dynamics
Rapier provider, bodies, colliders, motion requests, stepping, contacts and frames
procedural creature descriptor, geometry, skeleton, skinning, pose and rig adaptation
seeded route and patch generation, Worker execution, queue, cache, activation, release and fallback
terrain, trees, grass, shards, pickups, collider descriptors and height sampling
run lifecycle, movement, jump, surface, scoring, collision, failure and win
Three.js camera, WebGL renderer, lighting, shadows, instancing, skeleton, HUD and public host
collision-source identity, collider-set revision, candidate normalization, source comparison, canonical decision and visible-frame proof
validation, build and Pages deployment
```

## Complete kit and offered-service inventory

### Nexus Engine root and subdomain kits: 15

| Kit | Offered services |
|---|---|
| `core-input-kit` | actions; bindings; input state |
| `core-spatial-kit` | transforms; spatial queries |
| `core-scene-kit` | scene registry; transitions; host descriptor |
| `core-physics-kit` | provider; bodies; colliders; motion requests; step; contact frame |
| `articulated-dynamics-domain-kit` | articulations; joints; motors; ragdoll state; frames; snapshot; reset |
| `core-simulation-kit` | tick context; proposals; observations; resolution; commit; frame |
| `core-motion-kit` | movement modes; intents; trajectories; motion frames; validation; snapshot; reset |
| `articulated-motion-domain-kit` | rigs; poses; targets; IK; resolution; frames; snapshot; reset |
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
| `seeded-world-patch-controller-kit` | focus; membership; queue; cache; generation; delivery; eviction; snapshot; reset |
| `camera-smooth-follow-kit` | damping; reset; teleport handling; snapshot |

### Product, page and Worker kits: 14

| Kit | Offered services |
|---|---|
| `prehistoric-rush-domain-kit` | run resources; input; movement proposals; motion frames; observations; events; transitions; snapshots |
| `prehistoric-rush-resolution-policy` | physics/fallback collision precedence; pickup and goal precedence; state patch; events; transitions |
| `player-articulation-adapter-kit` | skeleton-to-rig conversion; legacy-pose conversion; quaternion normalization |
| `player-character-schema-kit` | defaults; normalization; clamps; merge |
| `player-character-profile-store-kit` | load; save; patch; reset; revision; browser distribution |
| `menu-page-kit` | shell; profile projection; routes; profile subscription |
| `character-creator-page-kit` | controls; draft; persistence; reset; subscription; preview; RAF; navigation |
| `character-preview-transition-kit` | morph; crossfade; pose damping; revision; disposal |
| `three-procedural-creature-adapter-kit` | skinned mesh; bone lookup; pose application; damping; topology checks; disposal |
| `game-page-entry-kit` | module preflight; failure projection; import; profile boot binding |
| `drunk-route-generator` | samples; nearest point; progress; classification; snapshot |
| `player-raptor-preset-kit` | creature recipe and collision capsule |
| `prehistoric-patch-generator` | terrain; trees; grass; shards; collider descriptors; bounds; transferables |
| `prehistoric-patch-worker` | initialization; generation; error protocol; transfer |

### External and host adapters: 9

| Adapter | Offered services |
|---|---|
| `three-runtime-module` | scene; geometry; materials; instancing; skeleton; camera; lighting; rendering |
| `rapier-physics-domain-kit` | Nexus physics provider bridge |
| `rapier-runtime-module` | bodies; colliders; queries; world step; contacts |
| `message-worker-executor-adapter-kit` | request correlation; pending rejection; listener removal; Worker termination |
| `active-content-consumer-adapter` | terrain; trees; grass; shards; pickups; collider activation/release; height |
| `creator-viewport-framing-adapter` | bounds; target; distance |
| `creator-persistence-scheduler` | timer replacement and delayed profile commit |
| `browser-input-adapter` | keyboard; buttons; keyup; blur; input patch; restart activation |
| `creature-camera-render-host-adapters` | pose; collision fallback; pickups; camera; HUD; profile; frame readback |

### Proof kits: 2

| Kit | Offered services |
|---|---|
| `prehistoric-rush-resolution-policy-test-kit` | continue; win; physics collision; precedence; pickup idempotency; fallback collision; serialization |
| `player-articulation-test-kit` | rig adaptation; Euler/quaternion conversion; cloneability |

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        2
total surfaces:                   45
```

## Source-backed findings

- Patch generation emits tree colliders with stable IDs, ball shape and `hazard`/`tree` tags.
- Active-content rebuild copies those descriptors into `view.colliders` and synchronizes them into Core Physics.
- The browser fallback sampler independently scans `view.colliders` using horizontal radial distance and a fixed `jumpHeight >= 1.05` exclusion.
- Core Physics and fallback collision observations are both registered every simulation step.
- The resolution policy selects a fatal physics contact first and consults fallback only when no fatal physics contact exists.
- No observation records whether the two sources agreed, disagreed, cited the same collider revision or evaluated equivalent geometry.
- The existing test suite proves physics-only and fallback-only failures separately. It has no both-source agreement, disagreement, stale collider-set, release-race or source-parity fixture.
- Public readback exposes the Core Physics frame and patch-controller snapshot, but not the fallback candidate, collider-set revision, comparison result or first visible collision frame.

## Main finding

```txt
one streamed collider descriptor set
  -> Core Physics representation and contact semantics
  -> browser fallback radial representation and jump cutoff
  -> two independently produced observations
  -> implicit physics-first precedence
  -> one terminal run result
  -> no source convergence result
```

The code does not establish that both sources evaluated the same collider generation, geometry, player transform or contact threshold. A physics/fallback disagreement is silently collapsed by precedence rather than reported as a typed result.

## Required parent domain

```txt
prehistoric-rush-collision-source-convergence-authority-domain
```

## Required transaction

```txt
CollisionEvaluationCommand
  -> admit runtime session, run, tick and candidate player transform
  -> bind one collider-set ID, generation and fingerprint
  -> collect typed Core Physics evidence
  -> collect typed fallback evidence when policy enables it
  -> normalize collider, actor, geometry and source identities
  -> compare agreement, disagreement, absence and stale evidence
  -> apply explicit canonical-source and degradation policy
  -> publish CollisionDecisionResult
  -> commit fail/continue exactly once
  -> publish first visible collision-outcome frame acknowledgement
```

## Candidate kits

```txt
collision-session-id-kit
collider-set-id-kit
collider-set-revision-kit
collider-set-fingerprint-kit
collision-evaluation-command-kit
collision-source-policy-kit
physics-collision-evidence-kit
fallback-collision-evidence-kit
collision-candidate-normalization-kit
collision-source-comparison-kit
collision-disagreement-result-kit
stale-collider-evidence-rejection-kit
collision-decision-result-kit
collision-decision-journal-kit
collision-visible-frame-ack-kit
physics-fallback-agreement-fixture-kit
physics-only-fixture-kit
fallback-only-degradation-fixture-kit
disagreement-policy-fixture-kit
patch-release-collision-fixture-kit
jump-threshold-parity-fixture-kit
pages-collision-parity-smoke-kit
```

## Required invariants

```txt
all accepted evidence cites one run, tick and collider-set revision
released collider generations cannot fail a successor frame
one collision decision has one canonical source-policy result
agreement and disagreement are observable, not silently discarded
failure precedence remains explicit against pickups and goal completion
the visible run-over frame cites the committed collision decision
source, built-output and Pages fixtures use the same policy
```

## Repo-local output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-13T03-13-09-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T03-13-09-04-00.md
.agent/architecture-audit/2026-07-13T03-13-09-04-00-collision-source-convergence-dsk-map.md
.agent/render-audit/2026-07-13T03-13-09-04-00-collision-decision-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T03-13-09-04-00-dual-collision-source-resolution-loop.md
.agent/interaction-audit/2026-07-13T03-13-09-04-00-collision-evidence-admission-result-map.md
.agent/collision-system-audit/2026-07-13T03-13-09-04-00-collider-revision-source-parity-contract.md
.agent/deploy-audit/2026-07-13T03-13-09-04-00-collision-source-parity-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime, simulation, Core Motion, Core Physics, Rapier, fallback collision, streaming, rendering, package scripts, dependencies and deployment are unchanged. No collision-parity fixture was run.