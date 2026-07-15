# Deploy Audit: Terrain Owner Browser Fixture Gate

**Timestamp:** `2026-07-15T06-39-22-04-00`

## Summary

The existing terrain test proves policy, topology and source wiring, but it does not instantiate the composed Three.js adapters or verify allocation, upload, release, disposal, built output or Pages behavior.

## Plan ledger

**Goal:** require executable evidence that source, package test, browser build and deployed page all use one terrain owner.

- [x] Inspect the current package test gate.
- [x] Identify missing adapter and browser fixtures.
- [x] Define source/build/Pages acceptance rows.
- [ ] Execute the rows after implementation.

## Required matrix

| Row | Required evidence |
|---|---|
| Node adapter fixture | controlled Three.js double records exactly 25 terrain meshes and one terrain provider |
| Patch activation fixture | one patch causes one terrain upload and one adoption result |
| Release fixture | one patch release clears one slot and emits one retirement receipt |
| Disposal fixture | repeated create/dispose returns geometry, material, texture, canvas and listener counts to baseline |
| Browser fixture | first patch renders with near/medium/far diagnostics and no legacy terrain objects |
| Visual fixture | mixed LOD, skirts, geomorph and clay maps remain visually accepted |
| Build fixture | built entry imports the single-owner runtime and passes the same diagnostics |
| Pages fixture | deployed page reports the source revision and one-provider terrain census |

## Current evidence

```txt
npm script includes terrain-lod-renderer-authority.mjs: yes
geometry and policy assertions: yes
source regex integration assertions: yes
actual WebGLRenderer construction: no
adapter allocation count: no
upload count: no
release/dispose count: no
browser screenshot: no
built-output smoke: no
Pages smoke: no
```

## Gate

Do not claim the terrain ownership repair complete until every required row records the exact source commit, provider generation, patch generation and visible-frame result.