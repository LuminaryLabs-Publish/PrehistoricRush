# Architecture Audit: Motion Presentation Parity DSK Map

**Timestamp:** `2026-07-12T12-08-05-04-00`

## Summary

PrehistoricRush now composes the Core Motion and Core Physics parent domains with articulated-motion and articulated-dynamics subdomains. Product movement writes motion intent and frame data, but visual pose generation remains owned by the procedural-creature legacy path.

## Plan ledger

**Goal:** define one domain boundary that makes motion intent, physical request, articulated pose and visible skeleton application one revisioned transaction.

- [x] Map current motion, physics, simulation, procedural-creature and renderer owners.
- [x] Separate generic Core Motion/Physics responsibilities from product-specific pose policy.
- [x] Identify missing identities, results, commit barriers and visible proof.
- [x] Define a product parent domain and candidate kits.
- [ ] Implement and validate the domain.

## Current ownership

```txt
prehistoric-rush-domain-kit
  -> integrates run state
  -> submits Core Motion intent
  -> commits Core Motion frame
  -> submits matching raw request to Core Physics
  -> exposes legacy createPlayerPose()
  -> exposes unused solvePlayerArticulatedPose()

core-motion-kit
  -> movement modes
  -> intent ledger
  -> trajectory/motion frames

articulated-motion-domain-kit
  -> rig registration
  -> pose and IK solve
  -> articulated frames

core-physics-kit
  -> body/collider ownership
  -> motion requests
  -> provider step and physics frame

articulated-dynamics-domain-kit
  -> joints, motors, physical articulation and ragdoll state

procedural-creature-body-kit
  -> body descriptor, skeleton and legacy procedural pose

Three host adapters
  -> mesh creation
  -> direct bone pose application
  -> visible frame submission
```

## Missing parent domain

```txt
prehistoric-rush-motion-presentation-parity-authority-domain
```

This is a product coordination domain. It must not duplicate generic Core Motion, Core Physics, Core Animation or Core Graphics. It binds their typed results to the PrehistoricRush actor, profile, rig and renderer.

## Candidate composition

```txt
motion-source-policy-kit
run-motion-revision-kit
motion-intent-sequence-kit
motion-frame-reference-kit
physics-request-motion-link-kit
player-rig-generation-kit
player-pose-profile-kit
creator-pose-profile-kit
articulated-solve-command-kit
articulated-solve-admission-kit
articulated-solve-result-kit
legacy-pose-fallback-policy-kit
pose-source-selection-kit
stale-pose-result-rejection-kit
renderer-pose-application-command-kit
renderer-bone-application-result-kit
motion-pose-observation-kit
motion-pose-journal-kit
visible-pose-frame-ack-kit
motion-presentation-parity-fixture-kit
browser-motion-presentation-smoke-kit
```

## Required transaction

```txt
RunMotionCommand
  -> validate run epoch, actor and profile revision
  -> submit ordered Core Motion intent
  -> commit Core Motion frame
  -> submit Core Physics request citing motion-frame ID
  -> prepare articulated solve against the admitted rig generation
  -> return ArticulatedSolveResult or explicit LegacyFallbackResult
  -> select one pose source by policy
  -> reject stale run/profile/rig/mesh generations
  -> apply pose to Three.js skeleton
  -> publish RendererBoneApplicationResult
  -> publish VisiblePoseFrameAck
```

## Required result identity

```txt
runId
runRevision
actorId
profileRevision
rigId
rigGeneration
motionIntentId
motionFrameId
motionFrameRevision
physicsRequestId
physicsFrameId
poseSource
poseResultId
poseRevision
meshGeneration
renderFrameId
visibleFrameId
```

## Invariants

```txt
one tick has one selected motion source
physics request cites the admitted motion frame
articulated result cites the admitted rig and profile generations
legacy fallback is a typed result, not an ambient alternate call
renderer applies exactly one selected pose revision
creator and game publish comparable pose-profile descriptors
public diagnostics distinguish installed articulation from consumed articulation
visible frame proves which pose source actually reached the skeleton
```

## Dependency order

```txt
Core Motion and Core Physics composed domains
  -> player articulation adapter
  -> product motion/presentation authority
  -> Three renderer pose receipt
  -> public readback and browser fixtures
```

## Validation boundary

Architecture documentation only. No DSK, runtime or renderer implementation was added.