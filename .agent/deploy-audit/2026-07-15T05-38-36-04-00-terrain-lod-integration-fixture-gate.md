# Terrain LOD Integration Fixture Gate

**Timestamp:** `2026-07-15T05-38-36-04-00`

## Summary

The current package test surface predates the terrain LOD changes. No executable gate proves producer/consumer schema compatibility, patch activation, mixed LOD rendering or clay resource lifecycle.

## Plan ledger

**Goal:** define the minimum evidence required before the terrain LOD work is treated as integrated in source, built output or Pages.

- [x] Review package scripts and changed files.
- [x] Define headless schema and topology fixtures.
- [x] Define browser and deployment fixtures.
- [ ] Add and execute them later.

## Headless fixtures

```txt
policy descriptor normalization and registration
30-config versus 64-source mismatch rejection
64-source field-length validation
near/medium/far index counts and bounds
skirt topology coverage
morph-offset determinism
hysteresis transition sequence
Worker and synchronous patch fingerprint parity
stale Worker result rejection
failed candidate preserves predecessor membership
```

## Renderer fixtures

```txt
matching BufferAttribute capacity before upload
near/medium/far geometry adoption
world-space UV continuity across patches
mixed-resolution edge coverage
normal and roughness map creation
material binding and anisotropy limits
texture and geometry disposal
context replacement rebuild
FirstTerrainLodFrameAck identity
```

## Browser and deployment matrix

```txt
source route first center patch
movement across LOD thresholds
rapid focus reversal across hysteresis boundary
Worker enabled and fallback generation
low/high device pixel ratio
WebGL context loss and restoration
static built output
GitHub Pages route and asset loading
```

## Required evidence

Each proof must record source commit, policy revision, patch schema revision, selected levels, renderer generation, frame IDs, artifact hashes and terminal status.

## Current state

```txt
npm test run: no
terrain integration test present: no
browser patch activation run: no
built-output smoke: no
Pages smoke: no
```

## Boundary

Workflow presence or source inspection alone is not runtime proof.