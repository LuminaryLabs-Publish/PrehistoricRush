# Jungle Presentation Adoption Gameplay Loop

**Timestamp:** `2026-07-17T05-58-55-04-00`

## Intent

Adopt the new foliage and atmosphere capabilities without changing route generation, collision authority, player movement, scoring, or deterministic patch identity.

## Existing loop

```txt
start run
  -> generate route and initial patches
  -> move player through streamed terrain
  -> activate/deactivate terrain, trees, grass, pickups and colliders
  -> resolve collisions, pickups, route progress and outcomes
  -> render the accepted world state
```

## Intended jungle loop

```txt
accepted patch demand
  -> Core Vegetation selects semantic species
  -> foliage catalog resolves tree-card family and ground-cover candidates
  -> ecology/route/slope masks admit bounded ground cover
  -> tree instance identity seeds local card placement
  -> Worker/main-thread parity settles patch payload
  -> renderer allocates/reuses card batches and atmosphere generation
  -> first matching frame acknowledges the adopted presentation
```

## Current gap

The two runtime commits only add source modules. No gameplay or patch consumer changed, so:

```txt
route exclusion for ground cover: unproven
slope/moisture/elevation adoption: unproven
main-thread/Worker deterministic parity: unproven
patch activation/release ownership: unproven
card/ground-cover collision policy: unspecified
quality budgets during fast traversal: unspecified
run restart and scene replacement retirement: unproven
```

## Gameplay constraints

- Foliage cards and ground cover are presentation-only unless explicitly admitted into collision authority.
- Existing tree collision proxies remain the sole tree-collision source.
- Ground cover must honor route clearance, terrain height, slope and active patch ownership.
- Placement seeds must include patch, species, tree instance and local-card identity.
- Fast travel must not create unbounded card allocation or Worker transfer payloads.
- Pause, fail, win and restart must retire presentation generations without mutating simulation truth.
- Atmosphere may affect visibility but must not silently alter gameplay physics or route eligibility.

## Required results

```txt
FoliagePatchProjectionResult
GroundCoverProjectionResult
MainWorkerFoliageParityResult
JunglePresentationProjectionResult
JunglePresentationRetirementResult
FirstJunglePatchAck
FirstJunglePresentationFrameAck
```

## Boundary

No gameplay code was changed. This audit preserves current gameplay authority and documents the adoption boundary for presentation-only jungle systems.
