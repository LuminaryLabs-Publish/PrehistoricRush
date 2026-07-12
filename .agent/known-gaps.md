# Known Gaps: PrehistoricRush

**Updated:** `2026-07-12T12-08-05-04-00`

## Implemented advance

```txt
Core Motion and articulated-motion domains are composed
Core Physics and articulated-dynamics domains are composed
player movement intent is submitted to Core Motion
one Core Motion frame is committed per active run tick
the same kinematic request data is submitted to Core Physics
player articulated rig conversion and registration exist
articulated solve API exists
Core Motion root API is preserved by the pinned Nexus Engine revision
player articulation adapter test exists
streamed-content/outcome parity audit remains active
motion-presentation audit family is complete
central reconciliation is part of this run
```

## Primary current gap

```txt
visible gameplay pose is created through game.createPlayerPose()
visible creator pose is created through the procedural creature API
solvePlayerArticulatedPose() has no production render call site
articulated-motion result is not selected or applied
physics request does not cite its authorizing Core Motion frame
no visible pose-frame acknowledgement joins the domains
```

## Concrete consequences

```txt
Core Motion can advance while presentation ignores its frame
articulated rig can be registered while the articulated frame is empty or older
public snapshots can show articulation capability without renderer consumption
physics and motion histories rely on field comparison instead of shared IDs
creator and game can diverge in pose policy while sharing one creature profile
legacy procedural pose use is ambient rather than an explicit fallback result
restart or profile replacement produces no typed prior-generation rejection trail
```

## Domain-state ambiguity

The current product cannot classify each installed motion surface as:

```txt
inactive
configured
active
consumed
superseded
failed
```

Installation and snapshot availability are therefore easy to mistake for active product consumption.

## Retained gaps

```txt
streamed content and committed outcome still lack a shared active-content revision
run start and restart still bypass authoritative TickContext
runtime-module admission fingerprint remains incomplete
browser input command authority remains incomplete
render-surface and frame correlation remains incomplete
creator draft, commit and frame proof remains incomplete
stream cadence and world readiness remain host-managed
raw PrehistoricRushHost exposes mutable owners
coordinated Worker, stream, motion, physics and frame reset remains absent
ordered runtime disposal remains absent
```

## Required fixtures

```txt
final pinned Core Motion root API imports and composes
one game tick correlates input, motion frame and physics request
legacy presentation emits an explicit fallback result
articulated solve result is consumed by the intended Three.js mesh
creator and game resolve matching profile, skeleton and rig fingerprints
prior run or profile pose result is rejected
renderer reports applied, missing and rejected bones
first visible frame shares run, motion, physics and pose identities
browser and deployed Pages behavior match
```

## Proof warning

The existing player-articulation test proves rig and pose conversion plus cloning. It does not prove that the composed domains drive physics or either visible raptor.

Do not describe articulated motion as product-consumed until a result is selected, applied and acknowledged by a visible renderer frame.