# Next Steps: PrehistoricRush

**Updated:** `2026-07-10T19-30-36-04-00`

## Next safe ledge

```txt
PrehistoricRush Instance Pool Capacity Authority
+ Deterministic Population Fixture Gate
```

## Goal

Make forest, grass, rock, shard, collider, and pickup population bounded, deterministic, correlated, and observable without changing the current visual target or movement feel.

## Plan ledger

- [ ] Add immutable `capacity` to every trunk, crown, root, grass, rock, and shard pool wrapper.
- [ ] Add mutable `activeCount` separate from renderer allocation capacity.
- [ ] Stop reading `InstancedMesh.count` as a capacity source.
- [ ] Build deterministic population request rows before any matrix write.
- [ ] Preflight every request against its target pool capacity.
- [ ] Return typed `admitted`, `truncated`, `rejected`, and `overflow` rows.
- [ ] Bound every `setMatrixAt` index to `index < capacity`.
- [ ] Bound final `mesh.count` to admitted count and capacity.
- [ ] Add stable `windowKey` and `generationId` values.
- [ ] Define stale-slot behavior when active count decreases.
- [ ] Correlate admitted tree render rows with collider rows.
- [ ] Correlate admitted shard render rows with pickup rows.
- [ ] Expose detached pool and generation observations through `PrehistoricRushHost.getState()`.
- [ ] Add a DOM-free dense/sparse/repeated population fixture.
- [ ] Add a browser smoke after the DOM-free fixture passes.

## Existing owner to update first

```txt
src/game.js
  createForestRenderer()
  populate()
  terrain-window rebuild path
  collider and pickup replacement
  PrehistoricRushHost.getState()
```

## Existing DSKs to preserve

```txt
route-field-domain-kit
surface-traversal-domain-kit
forest-archetype-domain-kit
grass-patch-domain-kit
grass-wind-domain-kit
procedural-dino-body-domain-kit
```

## New capability only where justified

```txt
src/domains/population/instance-pool-descriptor-kit.js
src/domains/population/population-request-kit.js
src/domains/population/population-admission-kit.js
src/domains/population/population-result-kit.js
src/domains/population/population-observation-kit.js
scripts/prehistoric-rush-population-capacity-fixture.mjs
```

## Required fixture assertions

```txt
root request above 400 never writes above index 399
root activeCount never exceeds 400
single-archetype tree concentration produces typed overflow
sparse grass generation does not reduce immutable capacity
sparse -> dense grass can grow back to original capacity
same seed/window produces identical request and admission rows
tree render count equals tree collider count
shard render count equals pickup count
repeated generation clears or overwrites stale active slots deterministically
host snapshot is detached and JSON-safe
```

## Follow-on work, not first

After population capacity proof passes, return to:

```txt
full restart transaction
immutable external dependency admission
mount/dispose/remount lifecycle
manifest/source-contract reconciliation
```

## Stop conditions

Do not begin visual expansion, new tree art, more grass layers, new obstacle families, higher population density, renderer replacement, or ProtoKit promotion until the population-capacity fixture passes.