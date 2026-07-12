# Known Gaps: PrehistoricRush

**Updated:** `2026-07-12T14-10-22-04-00`

## Implemented advance

```txt
Core Motion and articulated-motion domains are composed
Core Physics and articulated-dynamics domains are composed
player articulated rig conversion and registration exist
articulated solve API exists
legacy Euler pose application exists
position arrays and position objects are accepted
quaternion arrays and quaternion objects are accepted
quaternion direct application and damped slerp exist
Euler fallback remains available
player articulation adapter tests exist
```

## Primary current gap

```txt
renderer adapter accepts multiple pose representations without a versioned pose contract
pose data is not bound to the intended rig or skeleton fingerprint
full versus partial pose semantics are not declared
unknown bones are skipped silently
omitted bones retain prior transforms silently
malformed quaternion objects can be repaired through default values silently
application returns no typed result
production game and creator still submit legacy procedural poses
```

## Concrete consequences

```txt
a pose from an earlier rig generation can partially apply to a replacement mesh
an omitted bone can preserve stale animation state across pose changes
an unknown bone typo can disappear without failing validation
an incomplete quaternion object can become a normalized but unintended rotation
creator and game can interpret the same pose shape differently without a parity result
articulated-compatible adapter code can be mistaken for articulated product consumption
public diagnostics cannot prove which pose changed which bones
```

## Contract ambiguity

The current adapter cannot classify a submitted pose as:

```txt
schema-valid or schema-invalid
absolute or partial
rig-compatible or rig-incompatible
complete or incomplete
clean or repaired
current or stale
applied, partially applied or rejected
visible or not yet visible
```

## Retained architecture gaps

```txt
Core Physics requests still do not cite the authorizing Core Motion frame
articulated solving is not called by game or creator render paths
streamed content and committed outcomes lack one shared active-content revision
run start and restart bypass authoritative TickContext
browser input command authority remains incomplete
render-surface and frame correlation remains incomplete
creator draft, commit and frame proof remains incomplete
stream cadence and world readiness remain host-managed
raw PrehistoricRushHost exposes mutable owners
coordinated Worker, stream, motion, physics, pose and frame reset remains absent
ordered runtime disposal remains absent
```

## Required fixtures

```txt
valid Euler pose produces a typed application result
valid quaternion array and object poses produce equivalent results
non-finite and zero-length quaternion cases follow explicit policy
incomplete quaternion object is rejected or records a repair
unknown bone follows explicit reject/ignore policy
absolute pose omission restores required bone rest state
partial pose cites and merges from one predecessor revision
wrong rig and skeleton fingerprint are rejected
stale run/profile/mesh pose is rejected
articulated solve result reaches the intended Three.js skeleton
renderer reports applied, missing, rejected and repaired bone IDs
first visible frame cites pose, rig, mesh and renderer identities
browser and deployed Pages behavior match
```

## Proof warning

The latest runtime commit proves only that the adapter can parse and apply quaternion-shaped rotations. It does not prove that the data is valid for the target rig, that omissions are intentional, that the articulated solver produced it, or that a visible frame consumed it.

Do not describe quaternion support as pose-contract safety or articulated presentation completion until admission, binding, typed application and visible-frame proof exist.