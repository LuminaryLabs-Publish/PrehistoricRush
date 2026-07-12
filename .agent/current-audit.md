# Current Audit: PrehistoricRush Pose Contract and Rig Binding

**Updated:** `2026-07-12T14-10-22-04-00`  
**Runtime revision reviewed:** `e6ee17024ec3f3f1f4de80ea520b5cd7d6ba7c28`  
**Pinned Nexus Engine:** `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`

## Summary

The current renderer adapter accepts both legacy Euler transforms and articulated-style quaternion transforms. It also accepts array or object positions. This is a useful compatibility advance, but the accepted data is not an explicit product contract.

The adapter does not validate pose identity, schema version, transform space, quaternion order, full-versus-partial semantics, rig identity, bone-set fingerprint, finite numeric values or bone completeness. Unknown bones are skipped, omitted bones retain previous state and no application receipt is returned. The game and creator still render legacy procedural poses, so quaternion support remains unconsumed capability.

## Plan ledger

**Goal:** make every creature-pose application a deterministic transaction from admitted pose data to one compatible rig and one acknowledged visible frame.

- [x] Review the post-audit quaternion renderer commit.
- [x] Trace procedural pose creation and articulated pose conversion.
- [x] Trace game direct application and creator damped application.
- [x] Trace rig construction, bone IDs and articulated solve output.
- [x] Identify silent coercion, omission and unknown-bone behavior.
- [x] Reconcile all domains, kits and offered services.
- [x] Define the missing pose-contract and rig-binding authority.
- [x] Publish a new timestamped tracker and audit family.
- [x] Refresh root `.agent` routing and machine registry.
- [x] Synchronize central tracking.
- [ ] Implement and execute pose-contract fixtures.

## Source-backed ordering

```txt
legacy gameplay path
  -> run state and input state
  -> game.createPlayerPose()
  -> procedural-creature-body-kit createPose()
  -> applyCreaturePose(mesh, pose)
  -> position array/object coercion
  -> quaternion rotation when present, otherwise Euler rotation
  -> unknown bones skipped
  -> omitted bones unchanged
  -> renderer.render()

legacy creator path
  -> preview state
  -> creatureApi.createPose()
  -> applyCreaturePoseDamped(mesh, pose)
  -> position damping
  -> quaternion slerp when present, otherwise Euler damping
  -> renderer.render()

articulated-compatible but unused path
  -> createPlayerArticulatedPose(legacyPose)
  -> Euler-to-quaternion conversion
  -> articulatedMotion.solve()
  -> quaternion bone transforms
  -> no production application call
```

## Source-backed gaps

```txt
no poseId or poseRevision required by renderer adapter
no pose schema/version discriminator
no coordinate-space or handedness declaration
no quaternion component-order declaration
no absolute/full versus partial/delta mode
no finite-value or non-zero quaternion admission result
no rigId comparison against the target mesh
no skeleton or bone-set fingerprint comparison
no required-bone completeness policy
no unknown-bone rejection or observation policy
no omitted-bone reset/rest-pose policy
no stale run/profile/mesh generation rejection
no typed application plan
no applied/missing/rejected bone result
no first-visible-frame acknowledgement
```

## Concrete mismatch paths

### Partial pose residue

```txt
pose A writes a leg and tail transform
pose B omits the tail
adapter applies pose B
previous tail transform remains active
no result classifies the omission as intended partial data or stale residue
```

### Wrong rig with overlapping IDs

```txt
pose was produced for rig generation A
mesh now owns rig generation B
several bone IDs overlap
adapter applies those transforms silently
unknown IDs are ignored
no rig mismatch result is emitted
```

### Malformed quaternion coercion

```txt
rotation object omits one or more components
adapter defaults x/y/z to 0 and w to 1
quaternion is normalized
application succeeds without reporting input repair
```

### Capability without consumption

```txt
articulated solve can emit quaternion transforms
renderer can now consume quaternion transforms
production game still calls createPlayerPose()
creator still calls creatureApi.createPose()
no receipt proves an articulated result reached visible bones
```

## Domains in use

```txt
page routes, profile lifecycle and creator draft/preview
runtime source identity, import map and module preflight
Core Input, Spatial, Scene and Simulation
Core Physics and articulated dynamics
Core Motion and articulated motion
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
seed, procedural creature, instanced batch, patch controller and camera follow
product run, route, surface, score, outcome and player articulation
procedural pose and articulated pose construction
pose-format decoding, transform-space convention and quaternion admission
rig identity, skeleton fingerprints and bone membership
Three mesh, skeleton, direct application, damped application and rendering
Rapier, Worker streaming, active content, camera, HUD and public readback
Node proof, static Pages deployment and audit tracking
pose-contract/rig-binding authority: missing
```

## Kit/service census

```txt
15 Nexus Engine root/subdomain kits
5 official NexusEngine-Kits
14 product/page/Worker kits
9 external/host adapters
2 proof kits
45 implemented/adapted/proof surfaces total
```

The existing `three-procedural-creature-adapter-kit` now offers skinned-mesh construction, position array/object acceptance, Euler application, quaternion application, damped quaternion slerp, bone lookup and disposal. It still returns no pose-application result.

Exact names and services are retained in `.agent/kit-registry.json` and the current tracker.

## Required domain

```txt
prehistoric-rush-pose-contract-rig-binding-authority-domain
```

## Required invariants

```txt
one declared pose schema and transform-space convention
one explicit absolute or partial pose mode
all admitted transform components are finite
quaternion order and normalization policy are versioned
pose rigId and skeleton fingerprint match the target mesh generation
unknown and missing bones follow explicit typed policy
full poses restore omitted bones to admitted rest state
partial poses cite their predecessor pose revision
application returns applied, missing, rejected and repaired bone IDs
stale pose results cannot apply after run/profile/rig/mesh replacement
first visible frame cites pose, rig, mesh and renderer revisions
```

The previous motion/presentation parity audit remains active. Pose-contract authority is a narrower renderer-boundary dependency, not a replacement for Core Motion and Core Physics provenance.