# PrehistoricRush Validation

**Audit timestamp:** `2026-07-15T06-39-22-04-00`  
**Scope:** active terrain LOD runtime, legacy terrain composition, allocation, upload, release and visible-frame evidence

## Summary

Source review confirms that the repaired LOD runtime now creates the LOD terrain layer and then invokes the full base patch adapter, which independently allocates and updates fixed-grid terrain. The wrapper hides the legacy meshes rather than preventing their construction and upload.

## Plan ledger

**Goal:** distinguish direct source findings from runtime, allocation, visual and deployment checks that were not executed.

- [x] Verify the nine-commit runtime-ahead range from `a882bce...` to `1a37e914...`.
- [x] Inspect the active LOD runtime, wrapper, terrain layer, geometry and test.
- [x] Inspect base terrain allocation, activation, release and content services.
- [x] Count source-defined terrain slot ownership.
- [x] Preserve the complete inventory and record 66 source-backed surfaces.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Execute terrain ownership and lifecycle fixtures later.

## Verified source findings

```txt
prior repo-local documentation head: a882bce237ae6a404bb3fecf58b38cdf6b580928
reviewed runtime-ahead head: 1a37e9141c9a3afd28db865d1df9b01cdd4cb7d2
runtime-ahead commits: 9
active page boots game-runtime-lod.js: yes
LOD policy consumed by runtime: yes
LOD terrain layer created: yes
clay normal/roughness textures bound: yes
terrain LOD authority test added to npm test: yes
base patch adapter still created: yes
legacy terrain slots allocated: 25
LOD terrain slots allocated: 25
total terrain mesh slots allocated: 50
legacy terrain hidden after activation: yes
legacy terrain patch upload still executed: yes
single terrain map: no
complete adapter disposer: no
```

## Source-derived execution path

`createThreePatchStreamLodAdapter()` first calls `createThreePatchStreamAdapter()`, which allocates the fixed-grid terrain slots. It then creates the LOD layer in the same scene. During activation the LOD layer writes the patch first, then `baseActivatePatch()` writes the same patch into a legacy terrain slot. `hideLegacyTerrain()` suppresses those meshes after the base path completes.

This proves duplicate source work and ownership. It does not measure browser memory, GPU allocation, upload duration or visual output.

## Change boundary

```txt
documentation changed: yes
runtime JavaScript changed by audit: no
HTML or CSS changed by audit: no
gameplay or rendering changed by audit: no
packages, tests or workflows changed by audit: no
deployment changed by audit: no
branch created: no
pull request created: no
```

## Checks not completed

```txt
npm test
controlled Three.js adapter instantiation
browser boot and patch activation
terrain mesh allocation count
CPU/GPU upload trace
mixed-LOD and geomorph visual checks
restart and disposal lifecycle
built-output smoke
GitHub Pages terrain smoke
```

## Non-claims

No allocation reduction, upload reduction, runtime repair, visual correctness, performance gain, passing test, artifact parity, deployment parity or production readiness is claimed.