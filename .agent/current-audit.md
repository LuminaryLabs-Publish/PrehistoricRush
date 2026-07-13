# PrehistoricRush Current Audit

**Timestamp:** `2026-07-13T08-39-12-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Runtime revision reviewed:** `666ab306b94c9fefcd8bb4230b61854f121dab86`  
**Status:** `terrain-aware-hind-leg-ik-central-reconciled`  
**Technical status:** `terrain-aware-hind-leg-ik-implemented-static-proof`

## Summary

Terrain-aware hind-leg IK is implemented in the authoritative simulation path. The game evaluates the animated base pose through articulated FK, projects each hind foot into world space, samples terrain, creates weighted rig-space targets and feeds them into `articulatedMotion.solve()` before replacing `PlayerPose`.

The current gap is terrain and target-frame provenance. The scalar height callback does not identify exact patch versus fallback source or any patch/sampler revision. The frame loop samples during simulation, updates streamed patch membership afterward and then renders, so the accepted pose and visible terrain do not prove they use the same ground revision.

## Plan ledger

**Goal:** keep one inspectable chain from committed terrain membership through root/foot samples, target generation, articulated solve, PlayerPose publication and visible terrain/skeleton submission.

- [x] Reconcile the full Publish inventory and central ledger.
- [x] Select only PrehistoricRush because five source/test commits advanced behavior.
- [x] Preserve all domains, 46 kit surfaces and offered services.
- [x] Document implemented FK, target math, authoritative solve and tests.
- [x] Define the remaining terrain-foot-target coherence DSK.
- [x] Add the `2026-07-13T08-39-12-04-00` tracker and audit family.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement and execute terrain-revision and visible-frame proof later.

## Interaction loop

```txt
RunState + InputState + TickContext
  -> movement and root height sample
  -> Core Motion frame
  -> procedural gait
  -> articulated FK foot positions
  -> exact active-patch or fallback height samples
  -> weighted left/right ground targets
  -> articulated IK solve
  -> PlayerPose replacement
  -> simulation resolution
  -> patch streaming release/activation
  -> renderer reads PlayerPose and current terrain
  -> bone damping and Three.js submission
```

## Domains in use

```txt
browser boot, pinned providers, profile binding, input, resize and RAF
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion FK, targets, two-bone IK, solve frames and reset
articulated dynamics
procedural creature body, rig, gait pose, collision and snapshots
terrain-aware player articulation and authoritative PlayerPose publication
Rapier bodies, colliders, requests, contacts and frames
seeded route and patch Worker/fallback streaming
terrain heights, normals, active membership, fallback sampling, activation and release
run movement, jump, surface, scoring, collisions and outcomes
Three.js terrain, skeleton, damping, camera, lighting, instancing, HUD and diagnostics
terrain-sample revision, target-frame identity and visible terrain/skeleton proof
validation, build and GitHub Pages deployment
```

## Implemented state

```txt
hind-leg chains: present
animated source pose FK evaluation: present
world-space foot projection: present
exact/fallback scalar height sampling: present
vertical rig-space targets: present
proximity weight and maximum: present
airborne zero weight: present
authoritative target-to-solve path: present
ground-leg-ik service: present
domain version 0.9.0: present
current-pose Nexus runtime pin: present
deterministic target tests: present
static authority path tests: present and wired
```

## Current gaps

```txt
terrain sampler identity/generation: absent
patch-stream revision: absent
exact versus fallback typed result: absent
patch ID/content hash in sample receipt: absent
root/left/right sample batch identity: absent
TerrainFootTargetFrame: absent
target commit/stale result: absent
PlayerPose terrain/target provenance: absent
patch activation versus solve ordering receipt: absent
visible terrain/skeleton coherent frame: absent
planted-foot lifecycle and slope orientation: not implemented
runtime/browser deployment proof: absent in this run
```

## Required authority

```txt
prehistoric-rush-terrain-foot-target-coherence-authority-domain
```

```txt
TerrainFootTargetCommand
  -> bind session/run/tick/rig/source-pose revisions
  -> bind sampler and patch-stream revisions
  -> return typed root/left/right terrain samples
  -> publish immutable target frame
  -> admit accepted targets into articulated solve
  -> publish PlayerPoseFrame citing terrain and target revisions
  -> render terrain and skeleton from one admitted generation
  -> acknowledge the first matching visible frame
```

## Current output

See `.agent/trackers/2026-07-13T08-39-12-04-00/project-breakdown.md` and its linked audit family.

## Validation

Documentation only. No runtime code changed in this pass. Test source and package wiring were inspected, but `npm test`, browser patch-boundary behavior, built output and GitHub Pages were not independently executed.