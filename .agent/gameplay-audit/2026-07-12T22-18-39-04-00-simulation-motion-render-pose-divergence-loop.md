# Gameplay Audit: Simulation, Motion, and Render Pose Divergence Loop

**Timestamp:** `2026-07-12T22-18-39-04-00`

## Summary

Gameplay commits movement through RunState, Core Motion, Core Physics, and Core Simulation, but the visible pose is rebuilt independently from a subset of RunState values. The rendered gait can therefore be plausible without being authoritative, and no result proves that the skeleton reflects the motion or physical observations committed for that tick.

## Plan ledger

**Goal:** make movement outcome and visible body articulation share one run/tick-scoped evidence chain.

- [x] Trace gameplay movement and jump integration.
- [x] Trace Core Motion and Physics submissions.
- [x] Trace post-tick pose generation.
- [x] Identify missing revision and failure boundaries.
- [ ] Implement later.

## Current loop

```txt
input
  -> RunState movement and jump integration
  -> desired velocity and facing
  -> Core Motion intent and frame
  -> Core Physics motion request
  -> Core Simulation resolution
  -> committed RunState

independent visual branch
  -> speed/time/steer/jump/surface scalars
  -> legacy procedural pose
  -> direct skeleton mutation
  -> visible frame
```

## Divergence risks

```txt
motion correction
  -> committed motion or physics may differ from desired scalars
  -> visual pose still uses desired RunState-derived values

articulated target or IK result
  -> solver can produce a corrected pose
  -> active renderer never requests it

physical articulation
  -> dynamics frame can exist in readback
  -> visible skeleton cites no dynamics observation

run restart
  -> pose has no run generation
  -> predecessor pose work has no stale rejection
```

## Required gameplay rule

The player outcome remains owned by existing simulation and physics kits. The new authority only binds the committed gameplay observations into an admitted pose candidate and result.

## Required proofs

- Same tick, same run generation, and same player identity across RunState, Core Motion, Physics, pose, and render.
- Solver output changes the visible skeleton when articulation policy is active.
- Typed fallback when solver input is absent or invalid.
- Zero skeleton mutation on stale or rejected pose commands.
- Restart cannot display a predecessor-run pose.

## Validation boundary

No gameplay, movement, collision, scoring, failure, win, or animation behavior changed.