# Tree System Audit: Exact Fidelity Generation and Four-Form Contract

**Timestamp:** `2026-07-16T12-02-38-04-00`

## Summary

Bundle consumption and three-form rendering are implemented. This contract covers the remaining exact generation identity and package-defined horizon/transition behavior.

## Plan ledger

**Goal:** make one immutable fidelity generation control deterministic patch identity and stable four-form rendering.

- [x] Inspect package, patch and render inputs.
- [x] Confirm package consumption and provider retirement.
- [x] Compare package form policy with renderer behavior.
- [x] Define the remaining contract.
- [ ] Implement and validate it.

## Canonical generation

```txt
TreeFidelityGeneration
  bundleId and version
  manifestAssetId and revision
  provider ID and version
  package ID/version/digest by archetype
  capture-policy revision
  material-policy revision
  form-transition-policy revision
  combined digest
```

The combined digest must enter generator and vegetation cache identity. Type tuples remain a derived compatibility projection only.

## Patch contract

```txt
treeId
patchId
archetypeId
typeIndex
fidelityGenerationDigest
packageAssetId
packageDigest
transform
bounds
collision
```

A cached patch from another fidelity generation must be regenerated or explicitly migrated.

## Four-form contract

```txt
near     -> package near mesh recipe
medium   -> package medium mesh recipe
far      -> multi-angle impostor within declared range
horizon  -> horizon impostor below far range
```

Each tree retains its accepted form. Crossing a threshold first satisfies package hysteresis, then runs the package transition mode/duration. Old and new forms coexist only within a bounded transition budget.

## Current deviation

```txt
near/medium/far: implemented
horizon: not implemented
far minimum: not enforced
hysteresis: not implemented
dither crossfade: not implemented
exact generation digest: not implemented
```

## Diagnostics and proof

```txt
generation digest and package revisions
patches by generation
visible near/medium/far/horizon counts
active transitions and budget pressure
stale-generation rejections
first exact-generation frame acknowledgement
source/build/Pages parity
```

## Claim boundary

No four-form or transition fixture was executed.