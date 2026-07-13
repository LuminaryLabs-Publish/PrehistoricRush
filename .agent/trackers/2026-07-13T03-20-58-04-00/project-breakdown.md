# Project Breakdown: PrehistoricRush Collision Convergence Publication Reconciliation

**Timestamp:** `2026-07-13T03-20-58-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `collision-source-convergence-publication-central-reconciled`  
**Technical status:** `collision-source-convergence-authority-audited`

## Summary

PrehistoricRush already contains a source-backed collision-source audit, but central tracking and several required root `.agent` projections were still on the preceding browser-input audit. This run reconciles the complete collision breakdown without changing runtime code. The technical finding remains that Core Physics/Rapier contacts and the browser fallback radial sampler can decide the same fatal tree collision without one collider-set revision, comparison result, disagreement policy or visible-frame receipt.

## Plan ledger

**Goal:** make the repo-local tracker, required root `.agent` files, machine registry and central ledger publish one consistent collision-authority record.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` because it was the oldest central entry and its repo-local collision audit was newer than central tracking.
- [x] Preserve the complete interaction loop, domains, 45 surfaces and offered services.
- [x] Reconcile root `.agent` routing, gaps, validation and machine state to the collision audit.
- [x] Add a new timestamped tracker, turn ledger and reconciliation audit family.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime convergence and executable parity fixtures remain future work.

## Selection comparison

```txt
accessible Publish repositories: 10
eligible after Cavalry exclusion: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0

PrehistoricRush    2026-07-13T00-58-50-04-00  selected; repo-local audit newer than central
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
  -> load profile and commit-pinned modules
  -> compose Nexus Engine, product and provider kits
  -> install Rapier and the kinematic player body
  -> create patch controller plus Worker/fallback generation
  -> create Three.js presentation and start the run

streaming
  -> generate deterministic patches
  -> activate terrain, trees, grass, shards, pickups and collider descriptors
  -> rebuild active collider list
  -> synchronize colliders into Core Physics

simulation
  -> integrate candidate run state
  -> submit Core Motion and Core Physics requests
  -> step Rapier and obtain contact evidence
  -> independently sample the host collider list using fallback radial math
  -> apply physics-first resolution precedence
  -> commit continue, fail or win

presentation
  -> apply committed state to creature, camera, world and HUD
  -> render the Three.js frame
  -> expose physics and patch-controller snapshots
  -> omit fallback evidence, collider-set revision, source comparison and visible collision-frame acknowledgement
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
Three.js camera, renderer, lighting, shadows, instancing, skeleton, HUD and public host
collision-source identity, collider-set revision, candidate normalization, source comparison, canonical decision and visible-frame proof
validation, build and GitHub Pages deployment
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

- Patch generation emits stable tree collider descriptors.
- Active-content rebuilding publishes those descriptors to the host view and Core Physics.
- Core Physics/Rapier and the browser fallback sampler evaluate collision independently.
- The fallback uses horizontal radial distance and a fixed jump-height exclusion.
- Resolution chooses a fatal physics contact first and consults fallback only when physics has no fatal contact.
- Neither source cites a shared collider-set revision or candidate-transform identity.
- Agreement, disagreement, stale evidence and provider-degradation results do not exist.
- Public readback includes the physics frame and patch-controller snapshot but omits fallback evidence and visible-frame provenance.
- Existing tests cover physics-only and fallback-only failure separately, not parity, disagreement or stale release races.

## Main finding

```txt
one streamed collider descriptor set
  -> Core Physics/Rapier representation
  -> browser fallback radial representation
  -> two independent observations
  -> implicit physics-first precedence
  -> one terminal run result
  -> no source-convergence result
```

The code does not prove that both paths evaluated the same collider generation, player candidate, geometry or threshold. A disagreement is silently collapsed by control-flow precedence.

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
  -> collect typed fallback evidence when enabled
  -> normalize source, collider, actor and geometry identities
  -> classify agreement, disagreement, absence and stale evidence
  -> apply explicit canonical-source and degradation policy
  -> publish one CollisionDecisionResult
  -> commit fail or continue exactly once
  -> acknowledge the first visible collision-outcome frame
```

## Required invariants

```txt
all accepted evidence cites one run, tick, candidate and collider-set revision
released collider generations cannot fail a successor frame
agreement and disagreement are explicit terminal results
one canonical source policy controls gameplay resolution
pickup, goal and fatal-collision precedence remains explicit
the visible outcome frame cites the committed collision decision
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
.agent/trackers/2026-07-13T03-20-58-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T03-20-58-04-00.md
.agent/architecture-audit/2026-07-13T03-20-58-04-00-collision-convergence-publication-dsk-map.md
.agent/render-audit/2026-07-13T03-20-58-04-00-collision-publication-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T03-20-58-04-00-collision-source-precedence-reconciliation-loop.md
.agent/interaction-audit/2026-07-13T03-20-58-04-00-collider-evidence-decision-publication-map.md
.agent/collision-system-audit/2026-07-13T03-20-58-04-00-collider-revision-comparison-contract.md
.agent/central-sync-audit/2026-07-13T03-20-58-04-00-repo-local-central-publication-contract.md
.agent/deploy-audit/2026-07-13T03-20-58-04-00-collision-convergence-fixture-gate.md
```

## Validation boundary

Documentation only. Runtime source, physics, streaming, gameplay, rendering, dependencies and deployment are unchanged. No test, browser smoke, built-output smoke or Pages fixture was run.
