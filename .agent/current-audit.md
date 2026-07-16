# PrehistoricRush Current Audit

**Timestamp:** `2026-07-16T12-02-38-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `tree-fidelity-asset-adoption-projection-authority-audited`

## Summary

The runtime now prepares and caches five portable tree-fidelity packages before gameplay. The live patch generator and Three.js renderer do not consume them. They remain bound to a separate hard-coded type list and legacy instanced geometry.

## Plan ledger

**Goal:** make preparation, adoption and visible presentation one bounded, revision-bound transaction.

- [x] Inspect the async asset provider and portable package schema.
- [x] Inspect menu background preload and game required startup preparation.
- [x] Inspect the new source contract test.
- [x] Inspect active patch tree input and renderer allocation.
- [x] Define adoption/projection authority and proof boundary.
- [ ] Implement and execute the authority.

## Current interaction loop

```txt
menu
  -> create Core Assets runtime
  -> register provider/assets/bundle
  -> request bundle in background
  -> project progress/cache status

game boot
  -> create Core Assets + Core Startup runtime
  -> register provider/assets/bundle
  -> track the bundle as required
  -> capture/generate or load five packages
  -> store runtime and receipt globally
  -> import game runtime

game runtime
  -> create normal realtime engine
  -> declare independent treeTypes tuples
  -> generate patch trees by typeIndex
  -> create cylinder and icosahedron InstancedMeshes
  -> render without package identity or atlas data
```

## Domains in use

```txt
browser routes, modules, DOM, canvas, globals, RAF and lifecycle
Core Assets providers, asset graph, bundles, requests, progress, cache and receipts
Core Startup launch, preparations and required readiness
IndexedDB cache and Three.js object capture
prehistoric tree archetypes, package schema, manifest, bundle and provider
menu preload and game startup preparation
PrehistoricRush simulation, patch streaming, terrain LOD, rendering and physics
package admission, patch binding, form selection, resource materialization, retirement and visible-frame proof
validation, static deployment, Pages and central tracking
```

## Current gaps

```txt
portable package generation: present
manifest dependency graph: present
menu preload: present
game required preparation: present
source contract test: present

single authored tree-archetype authority: absent
preparation result consumed by game: absent
package digest in patch/cache identity: absent
package asset ID in tree records: absent
near/medium/far/horizon selection: absent
captured atlas materialization: absent
crossfade/hysteresis application: absent
stale package rejection: absent
route/provider/capture retirement result: absent
TreeFidelityAdoptionResult: absent
FirstTreeFidelityBoundFrameAck: absent
browser/build/Pages parity fixture: absent
```

## Required authority

`prehistoric-rush-tree-fidelity-asset-adoption-projection-authority-domain`

## Boundary

Documentation only. Runtime source, gameplay, rendering, tests and deployment were not changed by this audit.