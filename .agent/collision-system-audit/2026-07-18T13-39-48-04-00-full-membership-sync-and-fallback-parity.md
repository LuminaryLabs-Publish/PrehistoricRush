# Full Membership Sync and Fallback Parity

**Timestamp:** `2026-07-18T13-39-48-04-00`

## Source-backed behavior

### Generation

`prehistoric-patch-generator` emits at most one tree collider for each admitted tree candidate. With `trees: 7`, a patch contains no more than seven tree collider descriptors before route and ecology rejection.

### Membership

`three-patch-stream-adapter` stores collider arrays in `collidersByPatch`. On patch activation and any effective patch release, it:

```txt
copies all map entries
sorts entries by patch ID
flattens every collider array
replaces view.colliders
calls corePhysics.syncColliders(view.colliders)
```

The product does not expose whether Core Physics or Rapier apply a full rebuild, an internal diff, retention or partial rejection.

### Fallback

The runtime also registers a collision sampler that scans `adapter.view.colliders` for the first planar overlap. The simulation invokes that sampler as an observation source on every accepted game tick with a run-state proposal.

### Arbitration

The outcome policy selects the first fatal physics contact. It uses fallback evidence only when no fatal physics contact exists.

## Limits derived from configuration

```txt
activeRadius: 2
maximum active patch positions: (2 * 2 + 1)^2 = 25
maximum tree candidates per patch: 7
maximum candidate tree colliders across active positions: 175
```

Actual counts are lower when route clearance, species selection or density rejects a tree. These are configuration-derived limits, not profiler observations.

## Gaps

```txt
membership generation: absent
added/retained/removed delta: absent
unchanged membership result: absent
provider sync receipt: absent
provider rejection classification: absent
fallback spatial index: absent
physics/fallback parity result: absent
stale patch result rejection: absent
collider retirement receipt: absent
collision frame digest: absent
```

## Proposed smallest implementation

1. Build one deterministic collider membership manifest after patch deltas settle.
2. Compare the manifest digest with the last accepted digest.
3. Skip synchronization when unchanged.
4. Submit explicit added/removed/retained sets when the provider supports deltas; otherwise submit the full set with a declared mode.
5. Build the fallback index from the accepted manifest.
6. Attach membership generation to physics and fallback observations.
7. Record agreement/divergence before the resolution policy selects the current physics-first outcome.

## Proof boundary

A source test should not be treated as provider or browser proof. Required execution must construct the actual patch adapter, physics provider and resolution policy.