# Current Audit: PrehistoricRush Motion / Articulation / Presentation Parity

**Updated:** `2026-07-12T12-08-05-04-00`  
**Runtime revision reviewed:** `68c821a4864b6ad0edc12bc51514752e4ada750c`  
**Pinned Nexus Engine:** `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`

## Summary

The runtime now composes `createCoreMotionDomain()` and `createCorePhysicsDomain()`. It records player movement intent and Core Motion frames, submits kinematic motion to Core Physics, registers an articulated raptor rig and exposes an articulated solver.

The game renderer still derives a legacy procedural pose directly from run state. The creator preview installs no motion domain and also derives a legacy pose directly from the procedural-creature API. No typed result proves that Core Motion, articulated motion, Core Physics and the visible skeleton describe the same frame.

## Plan ledger

**Goal:** make every visible raptor pose an acknowledged consumer of one authoritative motion source revision.

- [x] Review all post-audit motion, physics, articulation, test and runtime-pin commits.
- [x] Verify the final Core Motion root API preservation fix.
- [x] Trace parent/subdomain composition and product dependencies.
- [x] Trace intent, motion-frame and physics-request creation.
- [x] Trace rig registration, articulated solving, legacy pose creation and Three bone application.
- [x] Trace creator preview composition and pose behavior.
- [x] Reconcile the kit census to 45 implemented/adapted/proof surfaces.
- [x] Publish a fresh timestamped tracker and complete audit family.
- [x] Refresh required root `.agent` state and machine registry.
- [x] Synchronize central tracking.
- [ ] Implement and execute the runtime authority.

## Source-backed ordering

```txt
browser input
  -> product InputState
  -> runSystem integrates RunState
  -> coreMotion.submitIntent()
  -> coreMotion.commitMotionFrame({ requests: [motionRequest] })
  -> corePhysics.submitMotionRequests([motionRequest])
  -> coreSimulation commits outcome

browser presentation
  -> derive pose state again from current RunState/InputState
  -> game.createPlayerPose()
  -> procedural-creature-body-kit createPose()
  -> applyCreaturePose() to Three skeleton
  -> render
```

The implemented alternative path is not called:

```txt
legacy creature pose
  -> createPlayerArticulatedPose()
  -> articulatedMotion.solve()
  -> articulated motion frame
  -> selected presentation result
```

## Source-backed gaps

```txt
no product motionSourceRevision
no physics request reference to coreMotionFrameId
no articulated solve command in gameplay frame
no articulated solve command in creator frame
no explicit pose-selection policy
no typed legacy fallback result
no renderer bone-application receipt
no creator/game motion-profile parity result
no run/profile generation on pose application
no first visible pose-frame acknowledgement
```

## Concrete mismatch paths

### Installed articulation without presentation consumption

```txt
articulated rig registers successfully
Core Motion frame commits successfully
visible raptor uses legacy procedural pose
articulated current frame remains null or stale
public diagnostics expose all owners without a parity result
```

### Physics authorization is implicit

```txt
motionRequest is embedded in Core Motion frame
same object data is submitted separately to Core Physics
physics frame does not cite the authorizing Core Motion frame
consumer must infer equality from request fields
```

### Creator and game can drift

```txt
creator installs seed + procedural creature only
creator uses creature API pose generation
game installs Core Motion/Physics domains but still uses createPlayerPose()
no shared motion profile or selected-pose fingerprint proves parity
```

## Domains in use

```txt
page routes, profile lifecycle and creator draft/preview
runtime source identity, import map and module preflight
Core Input, Spatial, Scene and Simulation
Core Physics and articulated-dynamics subdomain
Core Motion and articulated-motion subdomain
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
seed, procedural creature, instanced batch, patch controller and camera follow
product run, route, surface, score, outcome policy and player articulation
Rapier provider, body, collider, motion request and physics frame
Worker/fallback patch generation and active-content materialization
Three mesh, skeleton, pose application, camera, lighting, rendering and HUD
public host snapshots, Node proof and Pages deployment
motion/articulation/presentation parity authority: missing
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

Exact names and services are retained in `.agent/kit-registry.json` and the current tracker.

## Required domain

```txt
prehistoric-rush-motion-presentation-parity-authority-domain
```

## Required invariants

```txt
one product motion source revision per admitted gameplay tick
Core Physics request cites the authorizing Core Motion frame
articulated solving is either consumed or explicitly disabled by typed policy
renderer applies only the selected pose result
legacy fallback is explicit and observable
creator and game declare comparable rig/profile/motion-policy fingerprints
stale pose cannot apply after run or profile replacement
first visible raptor frame cites run, motion, physics, pose and renderer revisions
public readback cannot imply articulated presentation without a consumption receipt
```

The streamed-content/outcome parity audit remains an active dependency. This documentation pass changes no runtime behavior.