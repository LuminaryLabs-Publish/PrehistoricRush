# Gameplay Audit: Tree Fidelity Generation and Startup Loop

**Timestamp:** `2026-07-16T12-02-38-04-00`

## Summary

Required startup preparation now has a live consumer and the first rendered frame is acknowledged. The remaining gameplay-level issue is that world/cache identity binds only package count, so exact asset changes are not part of deterministic streamed-world identity.

## Plan ledger

**Goal:** bind the accepted fidelity generation to deterministic patch/cache identity and startup evidence.

- [x] Trace startup preparation into package consumption.
- [x] Trace package values into the tree-fidelity renderer.
- [x] Confirm first-frame acknowledgement.
- [x] Inspect generator and vegetation identity.
- [ ] Bind exact package revisions and digests.

## Current loop

```txt
game route
  -> required tree bundle preparation
  -> provider retirement
  -> package values retained
  -> game runtime imports
  -> canonical treeTypes drive patch generation
  -> package values drive fidelity rendering
  -> first frame reports package count and visible tree count
```

## Remaining deterministic gap

```txt
generatorVersion: prehistoric-patch-v3-tree-fidelity
vegetationSettingsHash: trees + grass + package count

missing:
bundle version
manifest revision
package versions/digests
capture policy revision
material/transition policy revision
```

Two different five-package generations can therefore share the same vegetation settings hash. Cached patches still contain compatible type indices, but the runtime cannot prove that their semantic tree generation matches the currently adopted package generation.

## Required settlement

```txt
TreeFidelityGenerationResult
  -> exact generation digest
  -> patch controller generator/vegetation identity
  -> package-bound renderer generation
  -> first exact-generation frame acknowledgement
```

Required startup readiness should remain tied to package preparation, but readiness proof must carry exact generation identity rather than counts alone.