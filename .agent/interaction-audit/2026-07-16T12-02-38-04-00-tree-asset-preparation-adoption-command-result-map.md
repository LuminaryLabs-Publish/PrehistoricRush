# Interaction Audit: Tree Fidelity Generation and Form Command Map

**Timestamp:** `2026-07-16T12-02-38-04-00`

## Summary

The runtime now coordinates preparation, package lookup and rendering. The missing command/result contract is exact generation admission plus stateful form-transition settlement.

## Plan ledger

**Goal:** replace count-based and stateless coordination with typed generation and transition results.

- [x] Map implemented calls and receipts.
- [x] Map current renderer selection.
- [x] Define exact generation and transition commands.
- [ ] Implement the command/result map.

## Implemented map

```txt
route preparation
  -> request bundle
  -> load/capture packages
  -> unregister provider
  -> expose package values

game composition
  -> read package values
  -> construct tree-fidelity layer
  -> activate/release patches
  -> update projected-size forms
  -> present first frame
  -> publish package/tree counts
```

## Required map

```txt
TreeFidelityGenerationAdmissionCommand
  inputs:
    route and game generations
    bundle/manifest revisions
    package IDs, versions and digests
    provider/cache provenance
    capture/material policy revisions
  outputs:
    TreeFidelityGenerationResult
    exact generation digest
    patch/cache identity
    renderer admission identity

TreeFidelityFormProjectionCommand
  inputs:
    generationResultId
    treeId and previous form state
    projected size
    package form ranges
    hysteresis and crossfade policy
    frame/render generation
  outputs:
    accepted form state
    optional transition state
    TreeFidelityProjectionResult
    FirstExactTreeFidelityFrameAck
```

## Rejections

```txt
mixed package generations
unknown or stale package digest
patch cache from another generation
missing form descriptor
invalid overlapping range
stale render generation
transition budget exhaustion
route retirement during projection
```

## Lifecycle

Menu cache warming remains non-authoritative. The game admits one immutable generation, binds it to patch/cache and renderer identity, and rejects callbacks or resources from replaced generations.