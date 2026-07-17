# Gameplay Audit: Mixed Runtime Composition Loop

**Timestamp:** `2026-07-16T20-01-41-04-00`

## Goal

Keep gameplay truth on one engine generation so seed streams, creature descriptors, instance batches, patch controllers, camera state and product systems share one contract.

## Current loop

```txt
shared Nexus Engine 80146b8…
  -> createRealtimeGame
  -> create core product kits

route-linked official kits
  -> seed factory from bare nexusengine generation
  -> creature object factory from bare nexusengine generation
  -> instance, patch and camera factories from route-linked module graph

combined kit array
  -> install into host engine
  -> fixed-step run, physics, streaming and outcomes
```

## Gameplay risk

The current factories return ordinary descriptors and can remain compatible across revisions. The split becomes material when revisions change validation, symbols, resource/event contracts, descriptor schemas, snapshot semantics or installation behavior. A future apparently compatible update can then alter deterministic seed, creature, patch, instance or camera behavior without one admitted generation change.

## Missing gameplay authority

```txt
expected runtime generation on run start: absent
kit factory generation on run start: absent
seed primitive provenance: absent
creature object primitive provenance: absent
patch/controller provenance: absent
camera provider provenance: absent
mixed-generation run rejection: absent
RuntimeModuleAdmissionResult in run receipt: absent
```

## Required settlement

```txt
admit one generation
  -> compose every kit from that generation
  -> create run and providers
  -> bind digest into startup and replay identity
  -> reject stale or mixed factories
  -> start simulation
```

## Boundary

No deterministic replay failure, gameplay divergence or player-facing defect was reproduced.