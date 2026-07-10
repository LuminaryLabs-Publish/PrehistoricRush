# Grass System Audit: Layer Capacity Ratchet Gap

**Timestamp:** `2026-07-10T19-30-36-04-00`

## Current layers

```txt
carpet: capacity 3,600; two planes; low height
main: capacity 2,600; three planes; medium height
verge: capacity 1,300; three planes; tall edge layer
```

Grass placement uses route classification, route distance scaling, deterministic random selection, distance-to-player LOD, and wind shader uniforms.

## Main defect

`InstancedMesh.count` is used for two incompatible meanings:

```txt
initially: allocation capacity
later: active draw count
next population: admission limit
```

After each population, `layer.mesh.count = grassCounts[index]`. The next generation checks `index >= layer.mesh.count`. A sparse generation can therefore reduce the maximum admitted count for later generations. The layer can ratchet downward and cannot reliably grow back to its allocation capacity.

## Required correction

```txt
pool.capacity: immutable allocation limit
pool.activeCount: current admitted draw count
mesh.count: assigned only after admission
admission check: index < pool.capacity
population result: requested, admitted, rejected, and reason by layer
```

## Required fixture sequence

```txt
initial dense generation
sparse generation
dense generation again
same dense generation repeated
route-edge generation
far-LOD generation
near-LOD generation
```

Assertions:

```txt
capacity never changes
activeCount can increase and decrease independently
same source generation produces identical admitted rows
no matrix write exceeds capacity
all three layers report requested/admitted/rejected counts
wind updates do not mutate population ownership
```