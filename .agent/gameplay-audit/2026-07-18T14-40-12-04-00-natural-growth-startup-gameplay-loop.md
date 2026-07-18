# Gameplay Audit: Natural Growth Startup and Gameplay Loop

**Timestamp:** `2026-07-18T14-40-12-04-00`

## Interaction loop

```txt
open game route
  -> preflight runtime modules
  -> prepare required tree-fidelity bundle
  -> generate and validate natural tree growth plans
  -> build tree-fidelity packages
  -> hydrate package images
  -> create game runtime
  -> stream tree instances by patch
  -> select fidelity form from projected size
  -> run, jump, collect and reach the goal
```

## Gameplay ownership

Natural-growth preparation is startup asset work. It does not own run state, movement, collision, pickups, score or outcomes. Its gameplay responsibility is to provide deterministic, ready tree fidelity packages before the required startup preparation can complete.

## Current settlement

```txt
natural growth plan readiness: implemented
natural growth validation: implemented
tree package readiness: implemented
required startup gating: implemented
growth plan used by package source geometry: not proven
```

The game can continue to use valid tree packages, but the package source remains the legacy tree object. No gameplay failure is confirmed.

## Compatibility constraints

Any future binding must preserve:

- deterministic archetype identity and seed behavior;
- current package IDs and bundle dependencies or provide migration;
- current near/medium/far/horizon thresholds and crossfade semantics;
- tree collision dimensions used by the streamed world;
- patch placement, ecology selection and density;
- startup progress and typed failure behavior;
- current player movement, collision, pickup, scoring and outcome rules.