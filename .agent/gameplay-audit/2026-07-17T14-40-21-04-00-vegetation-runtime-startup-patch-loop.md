# Vegetation Runtime Startup and Patch Gameplay Loop

**Timestamp:** `2026-07-17T14-40-21-04-00`

## Interaction loop

```txt
start game
  -> import pinned Nexus provider
  -> construct product Vegetation runtime
  -> register tree and ground-cover catalogs
  -> create deterministic patch generator
  -> initialize optional Worker with same provider URL
  -> generate center patch
  -> activate trees, foliage, ground cover, colliders and pickups
  -> run, steer, jump, collide and score through streamed patches
```

## Gameplay dependency

The provider pin participates before the first playable patch. Failure to construct the Foliage domain prevents product Vegetation registration. A main/Worker mismatch can also make patches differ by execution path even when the route seed and product settings are unchanged.

## Current gap

```txt
provider admission before game.start(): partial export checks only
Foliage service-construction probe: absent
main/Worker catalog digest comparison: absent
worker-ready deadline and settlement: absent
provider generation on patch result: absent
fallback policy after Worker provider failure: implicit
FirstVegetationRuntimeReadyAck: absent
FirstWorkerPatchAck bound to provider generation: absent
```

## Required policy

Gameplay should start streaming only after the main provider probe succeeds. Worker execution should be admitted only after the Worker echoes the same provider revision and catalog digest. A failed or stale Worker should settle to an explicit synchronous fallback without changing the deterministic patch contract.

## Boundary

No gameplay tuning, route generation, ecology weights, collision, pickup or scoring behavior changed in this audit.