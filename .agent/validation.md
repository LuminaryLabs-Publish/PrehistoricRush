# Validation: PrehistoricRush

**Updated:** `2026-07-11T22-29-24-04-00`

## Summary

Documentation-only audit of the public browser host, raw runtime-owner exposure, independently sampled diagnostics, command admission and committed read-model requirements.

## Plan ledger

**Goal:** separate source-backed proof of the current mutable host from unimplemented host isolation and coherence guarantees.

- [x] Confirm selected repository and `main` branch.
- [x] Confirm no branch or pull request was created.
- [x] Read current root `.agent` state and central ledger.
- [x] Read `game.html`, `src/pages/game.js` and `src/game.js`.
- [x] Trace engine, patch, physics, camera, render, HUD and host construction.
- [x] Confirm public raw owner exposure.
- [x] Confirm `getState()` independently samples mutable owners.
- [x] Identify complete interaction, domain, kit and service inventory.
- [x] Define authority and fixtures.
- [ ] Execute browser or Pages host-isolation tests.
- [ ] Implement the host gateway.

## Source-backed findings

```txt
PrehistoricRushHost exists: yes
raw engine exposed: yes
raw physics service exposed: yes
raw Three adapter exposed: yes
raw patch controller exposed: yes
raw camera-follow service exposed: yes
adapter includes scene/camera/renderer references: yes
adapter includes activate/release/render/reset mutation services: yes
getState samples multiple mutable owners: yes
committedFrameId in host state: no
shared subsystem epoch set in host state: no
owner quarantine: no
typed public command gateway: no
```

## Static reasoning proof

```txt
1. same-page consumer obtains PrehistoricRushHost.adapter
2. consumer invokes activatePatch, releasePatches, resetCamera or render
3. mutation occurs outside normal RAF and subsystem admission
4. no host command or epoch result is journaled
5. getState samples current owners independently
6. returned diagnostics cannot prove one coherent committed frame
```

## Validation performed

```txt
GitHub organization and central-ledger comparison
root .agent presence check
current source inspection
public object and adapter surface inspection
interaction/domain/kit/service inventory
authority and fixture derivation
documentation consistency review
```

## Validation not performed

```txt
local clone
Node fixtures
browser automation
public-host property traversal
mutation bypass execution
committed-frame coherence execution
Rapier or Worker execution
GitHub Pages smoke
deployment workflow run
```

## Change classification

```txt
runtime source changed: no
dependencies changed: no
profile implementation changed: no
route files changed: no
render behavior changed: no
physics behavior changed: no
Worker behavior changed: no
deployment configuration changed: no
branch created: no
pull request created: no
target branch: main
```

## Missing executable gates

```txt
raw owner isolation fixture
prototype/returned-value traversal fixture
unsupported-command zero-mutation fixture
stale-run/epoch fixture
duplicate command fixture
committed read-model coherence fixture
read-model clone/freeze fixture
host browser smoke
host Pages smoke
```

## Claim boundary

This audit proves that live mutable owners are publicly exposed and that host state is independently sampled. It does not claim the public host has been isolated, that commands are safe, that readback is frame-coherent or that Pages deployment currently passes the proposed gates.