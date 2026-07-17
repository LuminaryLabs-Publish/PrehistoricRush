# Foliage Catalog, Patch and Play Loop

**Timestamp:** `2026-07-17T16-40-37-04-00`

## Interaction loop

```txt
menu and character setup
  -> start run
  -> initialize player, route, terrain and vegetation runtimes
  -> main generator or Worker creates deterministic patches
  -> patch controller activates terrain, trees, foliage and ground cover
  -> player runs and jumps along the route
  -> collision, pickups, score, pause and outcomes resolve
  -> rendered vegetation provides route readability and biome density
```

## Foliage role in gameplay

The foliage family system is presentation-focused but participates in gameplay readability. Tree species selection, trunk collision and route clearance remain authoritative elsewhere; card-family closure determines whether the accepted tree descriptor can be represented consistently without missing canopy or hanging elements.

## Implemented behavior

```txt
12 tree archetypes: registered
6 ground-cover archetypes: registered
8 foliage card families: registered
primary and secondary tree family references: closed
unknown family references: rejected
atlas revision v2: propagated through catalog, Worker ready and render frame evidence
```

## Remaining gameplay proof gap

```txt
run startup waits for family parity: no
patch result identifies atlas generation: no
stale patch after atlas replacement is rejected: no
route fixture proves every family can appear: no
broad-canopy hanging-vine visible-frame fixture: no
restart/new run generation settlement: no
```

## Proposed admission sequence

```txt
run startup
  -> FoliageFamilyClosureResult
  -> AtlasRevisionAdmissionResult
  -> FoliageRealmParityResult
  -> admit patch streaming
  -> activate revision-bound patches
  -> FirstFamilyCompleteFoliageFrameAck
  -> admit normal run presentation
```

## Compatibility boundary

Do not change route generation, player movement, tree density, ecological selection, collision, pickups, score, pause semantics or outcomes as part of the proposed proof work.