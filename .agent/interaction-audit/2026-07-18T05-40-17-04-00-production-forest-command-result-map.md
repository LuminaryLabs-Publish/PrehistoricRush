# Production Forest Command/Result Map

**Timestamp:** `2026-07-18T05-40-17-04-00`

## Implemented interactions

```txt
patch ready
  -> terrain/tree/foliage/ground-cover/production/base activation

patch released
  -> each host removes patch membership

frame update
  -> production distance classification
  -> production instance-buffer writes
  -> base gameplay/camera/render update

startup presentation
  -> production counts copied into startup receipt
```

## Current implicit decisions

```txt
production presentation selected by composition side effect
legacy grass retired only by visible=false
capacity overflow accepted by clipping and counter
patch replacement accepted without a production generation result
frame accepted without legacy-retirement evidence
```

## Proposed command/result flow

```txt
ProductionForestGenerationAdmissionCommand
  input: renderer, density, atlas, material, capacity and patch revisions
  result: admitted | rejected | fallback

VegetationPresentationAuthorityCommand
  input: available production and legacy hosts
  result: authoritative host set and fallback policy

LegacyVegetationRetirementCommand
  input: superseded hosts, batches, patch work and resources
  result: retired | retained-fallback | failed with ownership receipt

ProductionForestCapacitySettlementCommand
  input: requested records, capacities, culling and writes
  result: admitted counts, classified overflow and degradation

ProductionForestProjectionCommitCommand
  input: accepted generation, patch membership and retirement result
  result: ProductionForestFrameDigest and FirstProductionForestBoundFrameAck
```

## Required invariants

```txt
one presentation authority per accepted generation
no hidden superseded work unless explicitly retained as fallback
one settlement per patch generation
stale patch results rejected
all overflow classified
all retired resources accounted for
visible frame digest matches accepted generation and membership
```

## Status

The command/result authority is proposed. Existing production rendering and counters remain implemented.