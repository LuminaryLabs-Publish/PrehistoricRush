# Architecture Audit: Pose Contract and Rig Binding DSK Map

**Timestamp:** `2026-07-12T14-10-22-04-00`

## Summary

PrehistoricRush now has producers capable of legacy Euler poses and articulated quaternion poses, plus a Three.js adapter capable of applying both. The missing architecture is not another pose solver. It is the bounded authority that validates pose meaning, binds it to the intended rig and records what the renderer actually applied.

## Plan ledger

**Goal:** separate pose generation, pose admission and renderer application into explicit domain responsibilities without moving Three.js ownership into Nexus Engine core.

- [x] Identify existing pose producers.
- [x] Identify rig and skeleton authorities.
- [x] Identify renderer adapter behavior.
- [x] Separate renderer-neutral contracts from Three.js implementation.
- [x] Define parent domain, kits, commands, results and invariants.
- [ ] Implement and validate the domain.

## Existing domain map

```txt
Core Motion
  -> actor intent and movement frames

Articulated Motion
  -> rig registry, target solving and quaternion pose frames

Procedural Creature Body
  -> creature descriptor, skeleton and legacy procedural pose

PrehistoricRush product domain
  -> player rig conversion and procedural/articulated pose APIs

Three procedural-creature adapter
  -> mesh construction and direct/damped bone mutation
```

## Missing boundary

```txt
pose producer
  -> pose contract admission
  -> rig/skeleton binding
  -> transform validation
  -> full/partial merge planning
  -> renderer application command
  -> typed application result
  -> first-visible-frame acknowledgement
```

## Required parent domain

```txt
prehistoric-rush-pose-contract-rig-binding-authority-domain
```

## Candidate kit composition

```txt
pose-schema-version-kit
pose-id-revision-kit
pose-source-kind-kit
pose-mode-kit
pose-transform-space-kit
quaternion-convention-kit
pose-rig-binding-kit
skeleton-fingerprint-kit
bone-membership-policy-kit
pose-transform-admission-kit
quaternion-admission-kit
absolute-pose-completeness-kit
partial-pose-predecessor-kit
rest-pose-reconstruction-kit
pose-application-command-kit
pose-application-plan-kit
pose-application-result-kit
stale-pose-rejection-kit
pose-application-observation-kit
pose-application-journal-kit
visible-pose-frame-ack-kit
pose-contract-fixture-kit
browser-pose-contract-smoke-kit
pages-pose-contract-smoke-kit
```

## Service ownership

| Service | Owner |
|---|---|
| Legacy procedural pose generation | `procedural-creature-body-kit` |
| Articulated pose solving | `articulated-motion-domain-kit` |
| Player rig conversion | `player-articulation-adapter-kit` |
| Pose schema and transform convention | new parent domain |
| Rig/skeleton admission | new parent domain |
| Full/partial merge planning | new parent domain |
| Three.js bone mutation | `three-procedural-creature-adapter-kit` |
| Application result and visible receipt | new parent domain plus host adapter |

## Command and result model

```txt
PoseApplicationCommand {
  commandId
  poseId
  poseRevision
  schemaVersion
  sourceKind
  mode
  transformSpace
  quaternionConvention
  rigId
  skeletonFingerprint
  profileRevision
  meshGeneration
  predecessorPoseRevision?
  bones
}

PoseApplicationResult {
  commandId
  accepted
  poseId
  poseRevision
  rigId
  meshGeneration
  appliedBoneIds
  missingBoneIds
  ignoredBoneIds
  rejectedBoneIds
  repairedBoneIds
  reasonCodes
  applicationFingerprint
}
```

## Invariants

```txt
no renderer mutation before complete admission
no cross-rig application
no non-finite transform application
absolute poses have deterministic omission handling
partial poses cite a valid predecessor
unknown bones follow explicit policy
stale run/profile/rig/mesh generations are rejected
application result precedes visible-frame acknowledgement
```

## Dependency relation

This domain depends on the existing motion/presentation parity authority for source provenance. It does not decide movement, IK or physics. It decides whether a produced pose is safe and meaningful for a specific presentation rig.