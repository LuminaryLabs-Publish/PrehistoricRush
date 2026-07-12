# Known Gaps: PrehistoricRush

**Updated:** `2026-07-12T12-01-04-04-00`

## Implemented advance

```txt
Core Motion and articulated-motion domains are composed
Core Physics and articulated-dynamics domains are composed
player movement intent is submitted to Core Motion
one Core Motion frame is committed per active run tick
same kinematic request data is submitted to Core Physics
player articulated rig adapter exists and registers the raptor rig
articulated solve API exists
Core Motion root API is preserved by the final pinned Nexus Engine revision
player articulation adapter test exists
streamed-content/outcome audit remains documented
```

## Primary current gap

```txt
visible game pose is created through game.createPlayerPose()
visible creator pose is created through creatureApi.createPose()
solvePlayerArticulatedPose() has no active render call site
articulated-motion result is not selected or applied
physics request does not cite its authorizing Core Motion frame
no visible pose-frame acknowledgement joins the domains
```

## Concrete consequences

```txt
Core Motion can advance while presentation ignores its frame
articulated rig can be registered while current articulated frame is null or stale
public snapshots can imply articulation is active without proving renderer consumption
physics and motion histories require consumers to infer field equality rather than follow IDs
creator and game may drift in motion policy while sharing the same creature profile
legacy pose fallback is ambient and cannot be distinguished from intended architecture
run restart or profile replacement can leave no typed stale-pose rejection trail
```

## Domain-state ambiguity

The current product cannot classify each installed motion surface as:

```txt
inactive
configured
active
consumed
stale
failed
```

Installation and snapshot availability are therefore easy to mistake for active product consumption.

## Retained gaps

```txt
streamed content and committed outcome still lack a shared active-content revision
run start/restart still bypasses authoritative TickContext
runtime-module admission fingerprint remains incomplete
browser input command authority remains incomplete
render-surface/frame correlation remains incomplete
creator draft/commit/frame proof remains incomplete
stream cadence and world readiness remain host-managed
raw PrehistoricRushHost exposes mutable owners
coordinated Worker/stream/motion/physics/frame reset remains absent
ordered runtime disposal remains absent
```

## Required fixtures

```txt
final pinned Core Motion root API imports and composes
one game tick correlates input, motion frame and physics request
legacy presentation emits an explicit fallback result
articulated solve result is consumed by the intended Three mesh
creator and game resolve the same profile/skeleton/rig fingerprints
stale run/profile pose result is rejected
renderer reports applied/missing/rejected bones
first visible frame shares run, motion, physics and pose identities
browser and deployed Pages behavior match
```

## Proof warning

The existing player-articulation test proves rig/pose conversion and cloning only. It does not prove that the composed domains drive physics or the visible game/creator raptor.

Do not describe articulated motion as product-consumed until an articulated result is selected, applied and acknowledged by a visible renderer frame.