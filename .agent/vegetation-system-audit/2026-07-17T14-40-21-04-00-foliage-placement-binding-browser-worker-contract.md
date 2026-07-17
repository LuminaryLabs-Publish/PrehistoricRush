# Foliage Placement Binding Browser and Worker Contract

**Timestamp:** `2026-07-17T14-40-21-04-00`

## Confirmed repair

```txt
old Nexus revision: c82782d00c135de0418bee777d30b463de6ff4ca
new Nexus revision: d41992636de2752f1ad9047b80701e6313f19b87
product pin commit: 47788818edec7d49753f942a69ef392a8b092037

old Foliage API member:
  createPlacementRecipe,

new Foliage API member:
  createPlacementRecipe: createFoliagePlacementRecipe,
```

The old object-literal member referenced an identifier that was not the placement-recipe factory. The new binding explicitly publishes the intended factory through `engine.n.vegetationFoliage.createPlacementRecipe`.

## Product dependency

`createPrehistoricVegetationRuntime()` creates the Core Object domain, which installs the Foliage subdomain even though the current product catalog registers complete foliage descriptors directly. Domain construction therefore depends on the service object being valid before any catalog registration can complete.

The same dependency exists in:

```txt
browser main realm: src/game-runtime-lod.js
Worker realm: src/workers/prehistoric-patch-worker.js
```

## Contract required

```txt
provider revision is exact
Core Object domain constructs
vegetationFoliage service exists
createPlacementRecipe is callable
12 tree species register
12 tree structures register
12 tree foliage descriptors register
6 ground-cover species register
6 ground-cover foliage descriptors register
object bridge registrations complete
main and Worker catalog digests match
one provider-bound patch generates and renders
```

## Failure classes

```txt
provider-import-failed
provider-revision-mismatch
core-object-construction-failed
foliage-service-binding-missing
catalog-registration-failed
worker-provider-timeout
worker-provider-mismatch
stale-worker-ready
stale-patch-result
provider-bound-frame-timeout
```

## Current proof gap

The local Node test checks product module exports and catalog constants but does not load the pinned provider. The Worker ready payload omits provider revision and catalog digest. No browser fixture constructs both realms and compares results.

## Boundary

The provider pin repair is already implemented. The admission, parity and fixture contract described here is proposed documentation only.