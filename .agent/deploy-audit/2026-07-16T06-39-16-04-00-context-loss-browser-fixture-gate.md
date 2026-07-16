# Deploy Audit: WebGL Context-Loss Browser Fixture Gate

**Timestamp:** `2026-07-16T06-39-16-04-00`

## Summary

The package test command covers eight deterministic Node fixtures. The Pages workflow stages the static site, but neither surface exercises browser WebGL loss and restoration.

## Plan ledger

**Goal:** block recovery claims until source, staged artifact and deployed Pages all pass the same forced-loss scenario.

- [x] Inspect package test coverage.
- [x] Inspect Pages staging.
- [x] Define browser fixture gates.
- [ ] Execute the gates.

## Required browser fixture

```txt
1. load game and wait for first normal frame
2. record run, patch, LOD and renderer-generation revisions
3. acquire WEBGL_lose_context
4. force context loss
5. verify one RenderLossResult and authored simulation/input policy
6. restore the context
7. verify one replacement render generation
8. verify active patch, terrain, vegetation, pickups, player, shadows and camera
9. verify stale callbacks cannot mutate the replacement
10. verify FirstRecoveredFrameAck
11. repeat to test retry budget and resource retirement
```

## Required failure cases

```txt
restoration never arrives
resource reconstruction throws
texture reconstruction fails
active patch replay fails
second loss occurs during recovery
route exits during recovery
pagehide occurs during recovery
fallback policy executes
```

## Deployment matrix

```txt
source browser run
staged _site artifact
GitHub Pages deployed origin
warm-cache reload
mobile DPR and resize after recovery
```

## Boundary

No workflow, test, artifact or deployed page was executed.
