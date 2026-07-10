# Render Audit: Instanced Capacity Commit Gap

**Timestamp:** `2026-07-10T19-30-36-04-00`

## Render surface

The current route uses one Three.js renderer and one RAF. It renders:

```txt
49 terrain meshes
five tree trunk pools
five tree crown pools
one root pool
three grass pools
one rock pool
one shard pool
one procedural skinned raptor
```

## Capacity map

```txt
tree trunk/crown capacity: 100 per archetype
root capacity: 400
grass capacities: carpet 3,600; main 2,600; verge 1,300
rock capacity: 320
shard capacity: 220
```

At configured density, a full 7 x 7 population window can request up to:

```txt
trees: 343 before route rejection
roots: 1,372 before route rejection
rocks: 98 before route rejection
shards: 98 before collection filtering
grass candidates: 3,430 before route and LOD rejection
```

## Main render gap

The renderer has no explicit instance-pool commit contract.

```txt
root writes do not check capacity
root active count can exceed allocation capacity
tree writes do not return overflow results
grass admission checks mutable mesh.count
grass mesh.count is overwritten with the prior active count
sparse generations can restrict later dense generations
no generation ID proves which matrix set is visible
no stale-slot or zero-fill policy is documented
```

## Required render proof

```txt
activeCount <= capacity for every pool
all matrix writes use index < capacity
capacity remains immutable across generations
sparse -> dense population can grow back to capacity
repeated same generation produces identical admitted rows and matrices
overflow policy is deterministic and visible in host readback
renderer draw count equals admitted count, not requested count
```

## Deferred

Do not begin renderer replacement, shader expansion, tree mesh fidelity, grass texture work, shadow retuning, or post-processing changes before pool admission and commit proof exists.