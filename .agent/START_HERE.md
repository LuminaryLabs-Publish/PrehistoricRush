# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T08-39-12-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime revision reviewed:** `666ab306b94c9fefcd8bb4230b61854f121dab86`  
**Status:** `terrain-aware-hind-leg-ik-central-reconciled`  
**Technical status:** `terrain-aware-hind-leg-ik-implemented-static-proof`  
**Retained audits:** `authoritative-player-pose-publication-central-reconciled`, `collision-source-convergence-publication-central-reconciled`, `browser-input-core-input-adoption-central-reconciled`, `game-viewport-render-surface-central-reconciled`, `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`, `browser-runtime-lifecycle-authority-audited`

## Summary

PrehistoricRush now evaluates the animated dinosaur pose through articulated FK, generates weighted terrain targets for both hind feet and feeds those targets into the simulation-owned articulated solve. The domain advertises `ground-leg-ik`, the runtime pin was advanced to the current-pose solver and target/path tests are wired into `npm test`.

The remaining boundary is terrain-sample coherence. IK samples the current active-patch map or fallback height during `engine.tick(dt)`, then the browser host updates patch streaming before rendering. The solved pose and visible terrain therefore do not share a patch-stream revision, target-frame ID or coherent visible-frame acknowledgement.

## Plan ledger

**Goal:** preserve the implemented terrain IK and define one revisioned evidence chain from streamed terrain through foot targets, authoritative pose and visible terrain/skeleton presentation.

- [x] Compare all ten Publish repositories and exclude `TheCavalryOfRome`.
- [x] Confirm nine eligible ledger and root `.agent` entries.
- [x] Select only PrehistoricRush because five runtime/test commits made its prior documentation stale.
- [x] Preserve the complete interaction loop, domain map and 46-surface service inventory.
- [x] Add the `2026-07-13T08-39-12-04-00` tracker and audit family.
- [x] Refresh every required root `.agent` file and machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement terrain revisions, target frames and browser coherence fixtures later.

## Current audit family

```txt
.agent/trackers/2026-07-13T08-39-12-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T08-39-12-04-00.md
.agent/architecture-audit/2026-07-13T08-39-12-04-00-terrain-foot-target-coherence-dsk-map.md
.agent/render-audit/2026-07-13T08-39-12-04-00-terrain-pose-visible-frame-coherence-gap.md
.agent/gameplay-audit/2026-07-13T08-39-12-04-00-terrain-ik-patch-revision-loop.md
.agent/interaction-audit/2026-07-13T08-39-12-04-00-terrain-sample-target-solve-admission-map.md
.agent/terrain-ik-audit/2026-07-13T08-39-12-04-00-sample-revision-foot-target-contract.md
.agent/deploy-audit/2026-07-13T08-39-12-04-00-terrain-ik-fixture-gate.md
.agent/central-sync-audit/2026-07-13T08-39-12-04-00-terrain-ik-runtime-reconciliation.md
```

## Complete interaction loop

```txt
boot and compose
  -> create body and articulated rig
  -> install browser height sampler
  -> initialize and start PlayerPose
  -> prime streamed terrain

active frame
  -> browser input
  -> engine.tick
  -> movement and root terrain sample
  -> legacy gait and FK foot evaluation
  -> left/right terrain samples
  -> weighted ground targets
  -> authoritative articulated solve and PlayerPose publication
  -> patch streaming activation/release
  -> render current terrain and damped skeleton
```

## Required parent domain

```txt
prehistoric-rush-terrain-foot-target-coherence-authority-domain
```

```txt
TerrainFootTargetCommand
  -> bind run/tick/rig/source-pose and terrain revisions
  -> issue typed root/left/right sample results
  -> publish immutable TerrainFootTargetFrame
  -> solve only from an accepted target frame
  -> publish PlayerPoseFrame with terrain provenance
  -> render terrain and skeleton from the same admitted generation
  -> acknowledge the first matching visible frame
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        3
total surfaces:                   46
```

## Validation boundary

Documentation only. Source and tests were inspected through GitHub. No runtime, renderer, package or deployment source changed. `npm test`, browser patch-boundary behavior, built output and Pages terrain-IK parity were not independently executed.