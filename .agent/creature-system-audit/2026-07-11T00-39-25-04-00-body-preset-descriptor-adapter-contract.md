# Creature System Audit: Body, Preset, Descriptor and Adapter Contract

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Timestamp:** `2026-07-11T00-39-25-04-00`

## Source-of-truth split

### Product preset owns

```txt
creature instance id
product seed
theropod archetype choice
radial and tail segment requests
body, hip, chest, head, tail, leg and arm proportions
skin and underbelly colors
roughness and metalness
stride, hip, tail, head and turn tuning
capsule shape, radius, half-height and center Y
```

### Official procedural creature kit owns

```txt
recipe normalization and defaults
deterministic descriptor generation
geometry positions, normals, colors and indices
bone hierarchy and bone indices
skin indices and weights
attachment points
collision recommendation scaling
bounds and topology counts
content hash
pose descriptor generation
snapshot, load, reset and record management
```

### Product game domain owns

```txt
which creature is the player
run state and simulation
speed, turn, jump and resistance facts sent to pose generation
when player descriptor and pose services are queried
```

### Three adapter owns

```txt
Three BufferGeometry and attributes
Bone, Skeleton, Material and SkinnedMesh objects
scene attachment
pose-to-bone application
GPU/Three resource lifecycle
render-binding evidence
```

### Rapier adapter owns

```txt
actor registration from collision descriptor
actor transform projection
physics stepping and contact projection
collision-binding evidence
physics lifecycle
```

## Current contract strengths

```txt
shared generator is commit-pinned
product configuration remains repo-local
body descriptor is renderer-agnostic
content hash is deterministic
snapshot/load verifies hash continuity
pose generation is descriptor-driven
collision recommendation is produced by the same body recipe
local duplicate generator and wrapper were removed
```

## Current contract gaps

```txt
index import map and runtime URL constants are separate revision authorities
no module graph fingerprint covers all loaded modules
no descriptor schema/version field is asserted by the consumer
no product preset hash is published
no descriptor admission result exists
no render binding result exists
no collision binding result exists
no pose consumption journal exists
no resource lifecycle result exists
no parity fixture proves game, renderer and physics consumed one descriptor
host readback omits most of the above evidence
```

## Required invariant set

```txt
one player preset resolves to one normalized recipe
one recipe resolves to one deterministic content hash
all consumers retain that content hash
render and physics bindings reference the same creature ID
bone hierarchy and skin indices validate before binding
pose application targets the active binding only
collision dimensions match the admitted descriptor exactly
resource disposal occurs once and is observable
snapshot/readback remains JSON-safe
```

## Promotion boundary

Do not move the product preset into NexusEngine-Kits. Do not move Three.js or Rapier integration into the renderer-agnostic body kit. A reusable Three adapter could later be promoted only after the local contract, lifecycle and fixtures are stable across more than one product.