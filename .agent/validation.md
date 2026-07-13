# PrehistoricRush Validation

**Audit timestamp:** `2026-07-13T08-39-12-04-00`  
**Scope:** terrain-aware hind-leg IK implementation documentation and central reconciliation

## Summary

This run compared the complete Publish inventory with central tracking, selected PrehistoricRush because five source/test commits advanced its behavior, inspected terrain-target generation, authoritative solve adoption, runtime pinning, patch-stream order, rendering and test wiring, then refreshed the required `.agent` projections. No runtime source was changed by this documentation pass.

## Plan ledger

**Goal:** record exactly what was verified, changed and left unproven.

- [x] Verify `LuminaryLabs-Publish/PrehistoricRush` and `main`.
- [x] Enumerate ten Publish repositories and exclude `TheCavalryOfRome`.
- [x] Verify nine eligible central-ledger and root-agent states.
- [x] Detect five commits after the prior reviewed runtime revision.
- [x] Inspect `createPlayerGroundLegTargets()` math and metadata.
- [x] Inspect FK evaluation and target admission into `articulatedMotion.solve()`.
- [x] Inspect `ground-leg-ik`, domain version and metadata changes.
- [x] Inspect browser height sampling and patch streaming/render ordering.
- [x] Inspect deterministic target tests and authority-path static coverage.
- [x] Inspect `npm test` wiring.
- [x] Preserve the complete interaction loop, domain map and 46-surface service inventory.
- [x] Add the timestamped audit family and refresh required root files.
- [x] Change no runtime, renderer, package or deployment source.
- [x] Create no branch or pull request.
- [ ] Execute runtime/browser/build/Pages terrain-IK fixtures later.

## Documentation changes

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
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

## Source findings verified

```txt
hind-leg chains declared: yes
FK evaluated source pose: yes
world-space foot X/Z projection: yes
scalar terrain sample: yes
rig-space target Y conversion: yes
proximity weighting: yes
airborne zero weight: yes
targets passed to authoritative solve: yes
ground-leg-ik service: yes
domain version 0.9.0: yes
terrainGroundLegIK metadata: yes
Nexus runtime pin f3c880b7...: yes
flat/raised/swing/airborne/determinism tests: yes
static FK/target/solve path markers: yes
npm test includes both updated tests: yes
```

## Coherence findings verified

```txt
sampleHeight uses active patch or fallback: yes
engine.tick precedes updateStreaming: yes
updateStreaming can release/activate patches: yes
render follows updateStreaming: yes
sample result source classification: absent
patch-stream revision in target: absent
patch/content identity in target: absent
TerrainFootTargetFrame: absent
PlayerPose target/terrain provenance: absent
visible terrain/skeleton frame receipt: absent
```

## Change boundary

```txt
runtime source changed by this pass: no
IK behavior changed by this pass: no
gameplay changed by this pass: no
rendering or streaming changed by this pass: no
package scripts or dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
```

## Commands and fixtures not completed

```txt
npm test
composed-engine terrain IK execution
patch-boundary exact/fallback fixture
patch activation/release coherence fixture
browser visible terrain/skeleton readback
30/60/120/144 Hz comparison
built-output smoke
GitHub Pages smoke
```

## External status

The reviewed commit had no combined status checks reported through GitHub. This is not a pass or failure result.

## Existing coverage limitation

`tests/player-articulation.mjs` executes pure target math against a synthetic evaluated pose and height sampler. `tests/player-pose-authority.mjs` verifies source markers and ordering. Neither test runs the composed browser host, asynchronous patch streaming, a real articulated solve through the pinned CDN runtime or visible Three.js terrain/skeleton correlation.

## Non-claims

No claim is made for independently passing tests, streamed-patch coherence, planted-foot stability, slope alignment, stale-result handling, visible-frame equivalence or deployed parity.