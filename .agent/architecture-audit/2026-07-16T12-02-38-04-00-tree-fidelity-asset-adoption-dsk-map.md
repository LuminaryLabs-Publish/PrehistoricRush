# Architecture Audit: Tree Fidelity Generation and Form Transition DSK Map

**Timestamp:** `2026-07-16T12-02-38-04-00`  
**Status:** `tree-fidelity-generation-form-transition-authority-audited`

## Summary

Preparation, package consumption and three-form rendering are implemented. The architectural gap is now exact generation identity and stateful four-form transition ownership.

## Plan ledger

**Goal:** preserve implemented boundaries and add only the missing generation and transition authority.

- [x] Map Core Assets and Core Startup preparation.
- [x] Map live package adoption and tree-fidelity rendering.
- [x] Map provider retirement and startup acknowledgement.
- [x] Isolate generation, horizon and transition gaps.
- [ ] Implement the remaining DSK boundary.

## Implemented graph

```txt
Core Assets
  -> IndexedDB cache
  -> tree capture provider
  -> five packages + manifest + bundle
  -> package values and receipts

Core Startup
  -> required preparation
  -> first frame presentation
  -> input-ready entry

Game runtime
  -> canonical archetypes -> derived treeTypes
  -> package values -> patch-stream LOD adapter
  -> dedicated fidelity layer
  -> near / medium / far instances
  -> legacy tree suppression
  -> form counts and startup receipt
```

## Missing boundary

```txt
package count
  -X-> exact immutable generation digest
  -X-> patch/cache revision binding

per-frame projected pixels
  -X-> retained form state
  -X-> horizon range
  -X-> hysteresis
  -X-> dither crossfade
  -X-> exact-generation frame acknowledgement
```

## Required domain

`prehistoric-rush-tree-fidelity-generation-form-transition-authority-domain`

### Generation subdomain

```txt
tree-fidelity-generation-id-kit
tree-fidelity-bundle-revision-kit
tree-fidelity-package-digest-kit
tree-fidelity-generation-admission-kit
tree-fidelity-generation-result-kit
tree-fidelity-cache-identity-kit
tree-fidelity-patch-binding-kit
tree-fidelity-stale-generation-rejection-kit
```

Services:

```txt
bind bundle/manifest/package/provider/cache revisions
compute one immutable generation digest
bind patch controller and vegetation cache identity
reject mixed, stale or partial generations
```

### Form-transition subdomain

```txt
tree-fidelity-form-state-kit
tree-fidelity-projected-range-kit
tree-fidelity-horizon-form-kit
tree-fidelity-hysteresis-kit
tree-fidelity-dither-crossfade-kit
tree-fidelity-transition-budget-kit
```

Services:

```txt
retain accepted form per tree
apply near/medium/far/horizon ranges
prevent threshold thrashing
crossfade old/new forms within bounded budgets
```

### Proof subdomain

```txt
tree-fidelity-startup-receipt-kit
tree-fidelity-diagnostics-kit
first-exact-tree-fidelity-frame-ack-kit
tree-fidelity-functional-render-fixture-kit
tree-fidelity-source-build-pages-parity-fixture-kit
```

Services:

```txt
publish exact generation and form counts
acknowledge one matching visible frame
prove cache, render, transition and deployment parity
```

## Ownership rule

Core Assets owns portable values and receipts. Patch generation owns deterministic tree records. The tree-fidelity presentation domain owns form state and transitions. Route code may coordinate these authorities but may not replace revision identity with globals or package counts.