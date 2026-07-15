# START HERE: PrehistoricRush

**Last aligned:** `2026-07-15T10-58-45-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed repository head:** `4808f05cff438ff5a9d013cd7ddec5127bbcf213`  
**Status:** `host-clock-fixed-step-frame-authority-audited`

## Summary

PrehistoricRush was selected by the oldest synchronized eligible-repository rule after all 11 accessible Publish repositories were compared with ten central ledgers and current repo-local documentation heads. `TheCavalryOfRome` remained excluded, and no eligible repository was new, missing, undocumented or runtime-ahead.

The active LOD host clips each RAF interval to 50 ms and performs exactly one engine tick. The PrehistoricRush run system clips the admitted tick to 50 ms again. Any callback interval above 50 ms therefore loses wall time instead of producing bounded fixed-step catch-up, residual time or an overload receipt.

## Plan ledger

**Goal:** preserve deterministic bounded simulation while preventing low callback rates from silently slowing elapsed time, movement, jumping, distance and goal progress.

- [x] Compare the complete Publish inventory and central ledger.
- [x] Select only PrehistoricRush by the oldest synchronized timestamp.
- [x] Trace RAF timing through input, simulation, physics, streaming and rendering.
- [x] Preserve all 66 source-backed kits, adapters and proof surfaces.
- [x] Define one host-clock parent authority with 20 coordinating surfaces.
- [x] Add the `2026-07-15T10-58-45-04-00` audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement and execute fixed-step, overload, suspension, resume, interpolation and deployment fixtures.

## Main finding

```txt
RAF wall interval
  -> min(0.05, interval)
  -> one engine.tick
  -> product run system min(0.05, tick.delta)
  -> one gameplay integration
  -> remainder is not accumulated or reported
```

```txt
10 FPS: 100 ms wall -> 50 ms simulation
5 FPS: 200 ms wall -> 50 ms simulation
```

## Current audit family

```txt
.agent/trackers/2026-07-15T10-58-45-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-15T10-58-45-04-00.md
.agent/architecture-audit/2026-07-15T10-58-45-04-00-host-clock-fixed-step-frame-dsk-map.md
.agent/render-audit/2026-07-15T10-58-45-04-00-clock-aligned-render-frame-gap.md
.agent/gameplay-audit/2026-07-15T10-58-45-04-00-low-fps-slow-run-loop.md
.agent/interaction-audit/2026-07-15T10-58-45-04-00-host-clock-command-result-map.md
.agent/simulation-clock-audit/2026-07-15T10-58-45-04-00-raf-delta-accumulator-contract.md
.agent/deploy-audit/2026-07-15T10-58-45-04-00-host-clock-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-15T10-58-45-04-00-oldest-selection-host-clock-reconciliation.md
```

## Required authority

`prehistoric-rush-host-clock-fixed-step-frame-authority-domain`

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits: 5
product/page/Worker kits: 17
external/host/render adapters: 14
proof kits: 8
total source-backed surfaces: 66
planned host-clock surfaces: 20
```

## Next safe ledge

Add a versioned host-clock policy and accumulator above `engine.tick`. Sample input once, execute bounded fixed steps, retain residual time or publish an overload receipt, rebase after suspension, pass explicit budgets to patch streaming and render the accepted simulation revision with an interpolation descriptor.

## Claim boundary

Documentation only. No fixed-step implementation, pacing correction, overload recovery, interpolation, passing test, artifact parity, Pages parity or production readiness is claimed.