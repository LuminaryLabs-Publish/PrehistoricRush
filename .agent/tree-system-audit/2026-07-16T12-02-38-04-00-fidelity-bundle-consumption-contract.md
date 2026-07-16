# Tree System Audit: Fidelity Bundle Consumption Contract

**Timestamp:** `2026-07-16T12-02-38-04-00`

## Summary

The tree-fidelity package is a strong portable descriptor, but it currently terminates at asset preparation. This contract defines how one accepted package generation must become patch identity, render resources and visible proof.

## Plan ledger

**Goal:** establish one source of truth from archetype registration through visible tree form selection.

- [x] Inspect archetype, package, manifest and bundle schemas.
- [x] Inspect patch tree records and renderer inputs.
- [x] Define the consumption contract.
- [ ] Implement and validate the contract.

## Canonical identity

```txt
TreeFidelityGeneration
  bundleId
  bundleVersion
  manifestAssetId
  manifestRevision
  packageDigests by archetypeId
  providerId and version
  capture policy revision
  material policy revision
```

The numeric six-field tuple may remain as a derived compatibility view. It must not remain an independent authored source.

## Patch contract

Each generated tree record must contain:

```txt
treeId
patchId
archetypeId
packageAssetId
packageDigest
position
rotation
scale
collision descriptor
```

Patch controller identity must include the accepted fidelity generation digest so cached patches cannot silently outlive the package generation that defined their tree records.

## Render contract

```txt
near
  -> materialize package near mesh recipe
medium
  -> materialize package medium mesh recipe
far
  -> use multi-angle atlas and crossed cards
horizon
  -> use single-frame atlas and one card
```

Selection uses projected size and the package thresholds. Cross-form changes use package hysteresis and dither-crossfade policy. Each render resource is keyed by package digest and renderer generation.

## Failure contract

```txt
cache miss -> provider generation
capture unavailable -> typed fallback or startup failure according to required policy
invalid package -> reject preparation
partial materialization -> reject adoption
stale package -> reject patch/render work
route exit -> cancel request and retire provider/capture/renderer resources
```

## Diagnostics

```txt
preparation result and duration
cache hits/misses
provider generation count
package IDs and digests
patches by package generation
visible trees by form
active transitions
materialized GPU resources
retired resources
first bound frame acknowledgement
```

## Proof

A valid fixture must request the bundle, inspect all five package payloads, generate a patch using package-bound records, render at least two forms, cross one threshold, acknowledge a frame and repeat from the staged build and Pages origin.