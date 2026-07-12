# Validation: PrehistoricRush Motion / Articulation / Presentation Parity

**Updated:** `2026-07-12T12-08-05-04-00`

## Scope

Documentation-only review of PrehistoricRush runtime source through `68c821a4864b6ad0edc12bc51514752e4ada750c`, pinned Nexus Engine revision `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`, pinned NexusEngine-Kits revision `9673594de5669b4691737b91a9d56fa282e74370` and pinned NexusEngine-ProtoKits revision `534e249346d94351baa4cfce9f2d3cd837362920`.

## Plan ledger

**Goal:** distinguish installed Core Motion/articulation capability from executable proof that physics and the visible raptor consume the same committed motion result.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush`.
- [x] Review recent articulation, composition, test and runtime-pin commits.
- [x] Review the final Core Motion root API fix.
- [x] Review Core Motion and articulated-motion domain contracts.
- [x] Review Core Physics and articulated-dynamics domain contracts.
- [x] Review product movement, intent, motion-frame and physics-request ordering.
- [x] Review game and creator pose/render paths.
- [x] Review the current Node articulation test.
- [x] Confirm no end-to-end consumption or visible-frame proof exists.
- [x] Publish and reconcile the complete `12-08-05` audit family.
- [x] Change no runtime source, dependencies or deployment configuration.
- [x] Create no branch or pull request.

## Source-backed validation performed

```txt
verified game and creator import maps pin Nexus Engine cf2fe3d...
verified runtime-versions pins final Core Motion runtime
verified createCoreMotionDomain installs root and articulated-motion domains
verified createCorePhysicsDomain installs root and articulated-dynamics domains
verified final engine.coreMotion alias preserves built-in and extension APIs
verified runSystem submits intent and commits Core Motion frame
verified same motion request is separately submitted to Core Physics
verified player articulated rig is registered
verified solvePlayerArticulatedPose API exists
verified game renderer calls createPlayerPose instead of articulated solve
verified creator preview calls creatureApi.createPose and installs no motion domain
verified player-articulation test covers adapter conversion only
```

## Executable proof currently present

```txt
npm test command exists
pure outcome-policy test exists
player rig/pose adapter test exists
runtime module preflight reports the first failed import
```

## Proof currently absent

```txt
exact pinned browser-module admission fixture
headless composed Core Motion/Core Physics game tick
Core Motion frame -> physics request linkage fixture
articulated solve consumption fixture
explicit legacy fallback fixture
creator/game motion-profile parity fixture
stale run/profile pose rejection fixture
Three bone-application result fixture
first visible motion/pose frame acknowledgement
browser and Pages game/creator parity smoke
```

## Commands not run in this pass

```txt
npm test
headless composed runtime fixture
browser game smoke
browser creator smoke
Pages game smoke
Pages creator smoke
```

The GitHub connector supplied current source and write access but no checked-out browser runtime. No executable result is claimed.

## Change-state validation

```txt
runtime source changed by audit: no
gameplay changed by audit: no
motion behavior changed by audit: no
physics behavior changed by audit: no
articulation behavior changed by audit: no
render behavior changed by audit: no
creator behavior changed by audit: no
package/dependencies changed by audit: no
deployment changed by audit: no
branch created: no
pull request created: no
.agent documentation changed: yes
central ledger and internal change log synchronized: yes
```

## Completion boundary

Do not claim motion/articulation/presentation parity until one admitted product motion revision links input, Core Motion frame, Core Physics request/frame, selected pose result, renderer bone application and the first visible raptor frame. Articulated motion must be either explicitly consumed or explicitly disabled through a typed legacy fallback policy.