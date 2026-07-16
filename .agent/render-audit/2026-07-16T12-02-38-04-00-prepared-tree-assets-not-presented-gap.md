# Render Audit: Tree Fidelity Form Transition Gap

**Timestamp:** `2026-07-16T12-02-38-04-00`

## Summary

Prepared packages are now presented through near, medium and far resources. The renderer does not implement the package horizon form or transition descriptor, and the visible frame does not identify the exact package generation.

## Plan ledger

**Goal:** make every visible tree form and transition consume the accepted package revision and publish matching frame evidence.

- [x] Inspect current package materialization.
- [x] Inspect projected-size classification.
- [x] Inspect startup and diagnostics receipts.
- [x] Identify horizon and transition gaps.
- [ ] Implement and execute four-form transition proof.

## Implemented rendering

```txt
legacy tree suppression
near trunk/crown instances
medium trunk/crown instances
far angle-selected billboards
package colors and roughness
projected-pixel classification
near/medium/far counts
resource disposal
```

## Remaining render gap

```txt
horizon descriptor: present in package, absent in renderer
far minimum threshold: loaded, not used for classification
maximum thresholds: not enforced
form state retained per tree: absent
hysteresis: absent
dither crossfade: absent
transition duration: absent
transition budget: absent
exact package IDs/digests in renderer view: absent
exact-generation first frame acknowledgement: absent
```

Current classification is stateless:

```txt
pixels >= near minimum   -> near
pixels >= medium minimum -> medium
otherwise                -> far
```

This permits abrupt form changes and threshold oscillation. It also assigns horizon-scale trees to far instead of the declared horizon form.

## Required frame receipt

`FirstExactTreeFidelityFrameAck`

```txt
frameId
route/game/render generations
bundle and manifest revisions
package digests by archetype
active patch revision
visible near/medium/far/horizon counts
active transition count
transition policy revision
```

## Claim boundary

No visual comparison, threshold-oscillation reproduction, crossfade fixture or deployed browser smoke was run.