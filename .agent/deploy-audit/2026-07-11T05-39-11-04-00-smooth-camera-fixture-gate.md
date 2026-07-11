# Deploy Audit: Smooth Camera Fixture Gate

**Timestamp:** `2026-07-11T05-39-11-04-00`

## Summary

The static Pages route loads a pinned candidate camera kit directly from jsDelivr. Current deployment has no executable gate proving that the pinned export, product composition, controller behavior and browser renderer remain compatible.

## Plan ledger

**Goal:** Add deterministic pre-deploy proof for the exact camera module graph and browser integration.

- [x] Verify current pins and import paths.
- [x] Verify required factory name.
- [x] Verify composition API name.
- [x] Identify missing fixtures.
- [x] Define deployment gate.
- [ ] Implement scripts/workflow.
- [ ] Run deployed browser smoke.

## Pinned graph

```txt
NexusEngine
  e8252e51878a08eeef46f54b1aae9e8349a2442b

NexusEngine-Kits
  5d3613b140ca33395f180acde014c167addf0ccc
  kits/camera-feedback/camera-smooth-follow-kit/index.js

required export
  createCameraSmoothFollowKit

installed API
  engine.n.cameraSmoothFollow
```

## Missing deployment proof

```txt
- CDN import success
- expected camera factory export
- kit graph installation
- controller create/reset/update/snapshot
- product target composition
- Three transform application
- first rendered frame after reset
- resize projection revision
- restart/run-change reset
- browser console error absence
- public host detached observation
```

## Proposed fixture chain

```bash
node scripts/prehistoric-rush-module-graph-fixture.mjs
node scripts/prehistoric-rush-camera-controller-fixture.mjs
node scripts/prehistoric-rush-camera-target-fixture.mjs
node scripts/prehistoric-rush-camera-frame-correlation-fixture.mjs
node scripts/prehistoric-rush-camera-lifecycle-fixture.mjs
```

Then:

```txt
static source checks
  -> camera fixtures
  -> patch activation fixtures
  -> static build
  -> Pages artifact
  -> browser smoke against deployed route
```

## Browser smoke assertions

```txt
PrehistoricRushHost.getState().camera exists
camera controller initialized
revision advances during play
reset reason is initial-run after boot
restart changes run ID and records restart/run-change reset
position and quaternion remain finite
renderer label matches smooth-camera version
no missing CDN module/export error
no render-loop exception
```

## Gate policy

A deployment must fail when the pinned camera module cannot load, the expected factory/API is missing, deterministic fixtures fail, or the first committed browser frame cannot prove camera consumption.
