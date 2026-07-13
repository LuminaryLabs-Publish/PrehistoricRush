# Architecture Audit: Terrain Foot-Target Coherence DSK Map

**Timestamp:** `2026-07-13T08-39-12-04-00`  
**Authority:** `prehistoric-rush-terrain-foot-target-coherence-authority-domain`

## Summary

Terrain-aware hind-leg IK is now implemented inside the PrehistoricRush simulation domain. The missing architecture is a coordinating authority that binds streamed terrain identity, sample results, generated targets, articulated solve output and visible terrain/skeleton evidence without absorbing the existing owners.

## Plan ledger

**Goal:** define the smallest DSK boundary needed to make terrain sampling and foot-target application revisioned, deterministic and observable.

- [x] Keep patch generation and streaming in `seeded-world-patch-controller-kit` and the browser active-content adapter.
- [x] Keep rig/FK/IK mechanics in `articulated-motion-domain-kit`.
- [x] Keep run state and authoritative `PlayerPose` in `prehistoric-rush-domain-kit`.
- [x] Keep Three.js terrain and skeleton submission in the renderer adapter.
- [x] Introduce one coordination domain for shared revision admission and receipts.
- [ ] Implement the coordinating kits and executable fixtures later.

## Existing owners

| Owner | Current responsibility | Must remain bounded |
|---|---|---|
| `seeded-world-patch-controller-kit` | patch focus, queue, generation, cache, readiness, activation and release | does not own player pose or IK |
| `prehistoric-patch-generator` | deterministic terrain heights, normals, colors and content | does not own active membership |
| `active-content-consumer-adapter` | active patch map, terrain meshes, fallback height and browser sampling | does not own simulation truth |
| `prehistoric-rush-domain-kit` | run state, movement, height sampling callback, PlayerPose publication and game results | does not own provider internals |
| `player-articulation-adapter-kit` | body-to-rig conversion, pose conversion and terrain target math | does not own patch lifecycle |
| `articulated-motion-domain-kit` | FK evaluation, targets, two-bone IK, solve frames and snapshots | does not own terrain provenance |
| `three-procedural-creature-adapter-kit` | visible skeleton construction and pose damping | does not own target truth |
| Three.js host | terrain/skeleton submission and camera/HUD projection | does not own simulation admission |

## Current dependency path

```txt
browser activePatches Map
  -> sampleHeight(x,z)
  -> callback installed into PrehistoricRush
  -> RunSystem calls resolvePlayerPose()
  -> FK evaluated foot positions
  -> createPlayerGroundLegTargets()
  -> articulatedMotion.solve(targets)
  -> store only articulatedFrame.pose
  -> updateStreaming mutates activePatches
  -> render terrain and damped skeleton
```

## Required parent domain

```txt
prehistoric-rush-terrain-foot-target-coherence-authority-domain
```

This domain coordinates identity and results. It must not become a second terrain system, patch controller, IK solver, pose owner or renderer.

## Proposed coordinating kits

| Kit | Offered service |
|---|---|
| `terrain-sampler-generation-kit` | monotonic sampler/provider generation |
| `terrain-patch-stream-revision-kit` | committed active/retained patch membership revision |
| `terrain-patch-content-identity-kit` | patch ID, generator version and terrain-settings hash |
| `terrain-sample-command-kit` | identified sample request with run/tick/foot/world coordinates |
| `terrain-sample-result-kit` | ExactPatch, Fallback, Missing, Stale or Failed result |
| `terrain-sample-source-policy-kit` | authored exact/fallback admission policy |
| `terrain-sample-batch-kit` | immutable left/right sample batch |
| `terrain-foot-target-command-kit` | bind rig, source pose, run and sample revisions |
| `terrain-foot-target-frame-kit` | immutable target set plus sample receipts |
| `terrain-foot-target-commit-kit` | predecessor-preserving atomic target-frame commit |
| `stale-terrain-target-rejection-kit` | reject retired patch/sampler/run generations |
| `terrain-target-solve-admission-kit` | allow only accepted target frames into articulated solve |
| `player-pose-terrain-provenance-kit` | attach target-frame and terrain revisions to PlayerPoseFrame |
| `patch-activation-pose-fence-kit` | order patch revision adoption relative to simulation solve |
| `terrain-skeleton-frame-correlation-kit` | correlate visible terrain and skeleton source revisions |
| `terrain-ik-observation-journal-kit` | bounded sample/target/solve outcomes |
| `terrain-ik-fixture-kit` | flat, raised, boundary, fallback, stale and restart tests |
| `terrain-ik-pages-parity-kit` | source/build/deployed revision parity |

## Required transaction

```txt
TerrainFootTargetCommand
  -> validate runtime session and run generation
  -> bind tick, source PlayerPose revision and rig revision
  -> bind committed patch-stream and sampler generations
  -> evaluate source pose through FK
  -> issue left/right TerrainSampleCommand
  -> classify ExactPatch, Fallback, Missing, Stale or Failed
  -> apply authored fallback policy
  -> generate immutable TerrainFootTargetFrame
  -> atomically commit Accepted or preserve predecessor
  -> admit accepted target frame into articulated solve
  -> publish PlayerPoseFrame citing target and terrain revisions
  -> render terrain and skeleton from the admitted terrain generation
  -> publish TerrainSkeletonFrameAck
```

## Invariants

```txt
one target frame cites one run tick rig source-pose and terrain revision
one terrain sample cites one source class and patch/content identity
stale or failed samples cannot mutate the accepted target frame
patch activation cannot silently change the terrain revision used by the same visible frame
airborne zero-weight results remain explicit accepted results
fallback sampling is typed evidence, not an invisible implementation detail
restart retires predecessor run, target and presentation generations
every visible skeleton acknowledgement cites a visible terrain revision
```

## Non-goals

```txt
full foot planting
contact locking across gait cycles
slope-normal foot orientation
toe articulation
physical ragdoll coupling
new terrain generation
moving IK into Three.js
```

Those can build on the authority later. The immediate requirement is coherent identity and admission for the vertical terrain targets already implemented.