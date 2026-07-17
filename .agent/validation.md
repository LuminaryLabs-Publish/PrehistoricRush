# PrehistoricRush Validation

**Audit timestamp:** `2026-07-17T02-02-06-04-00`  
**Scope:** organization selection, Object Vegetation composition, semantic catalog generation, fidelity package binding, Worker parity, cache identity, patch/collision activation, visible-frame proof, and deployment parity

## Summary

Source inspection confirms that PrehistoricRush now uses Core Vegetation for species selection and deterministic instance variation on both main-thread and Worker patch paths. The latest reviewed runtime also computes collider radius from the varied instance radius. It also confirms that asset preparation, the game host, and the Worker create separate catalogs; semantic fidelity profiles are derived but not registered by the package provider; package generations omit semantic descriptor hashes; and Worker readiness publishes no catalog digest.

## Intent

Separate completed vegetation-domain and collision-scale adoption from unproven semantic generation, cache, Worker, patch, and frame convergence claims.

## Checklist

- [x] Compare all 11 Publish repositories and exclude Cavalry.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Identify two runtime-ahead repositories and select only PrehistoricRush.
- [x] Compare prior documentation head with runtime head.
- [x] Inspect eleven runtime commits and ten changed files.
- [x] Inspect catalog registration, services, package creation, game host, Worker, patch generator, tests, cache identity, startup receipt, and collision tail.
- [x] Add and route the timestamped audit family on `main`.
- [ ] Execute source, deterministic, Worker, collision, browser/cache, build, and Pages fixtures.

## Confirmed by inspection

```txt
reviewed runtime head: 25691598bd4ff5fd38bfdd25c46edb8a9e2cfece
previous documentation head: 946290c5af573ee14026cbde80f37c7591d8ed52
runtime delta: 11 commits / 10 files / +491 / -166

Core Vegetation composition present: yes
Vegetation Ecology present: yes
Vegetation Tree present: yes
Vegetation Foliage present: yes
Vegetation Object Bridge present: yes
main-thread placement uses domain API: yes
Worker placement uses domain API: yes
domain-backed test fixture present: yes
instance-scaled collider radius present: yes

independent asset/host/Worker catalogs: yes
semantic fidelity profiles derived: yes
semantic profiles registered for package build: no
semantic hashes in package generation: no
Worker catalog digest handshake: no
patch generation digest: no
species/package binding table: no
composite frame acknowledgement: no
```

## Source inspection performed

```txt
LuminaryLabs-Publish organization inventory
LuminaryLabs-Dev/LuminaryLabs Publish ledgers
PrehistoricRush runtime compare and collision-tail commit
src/shared/prehistoric-vegetation-domain.js
src/shared/prehistoric-tree-fidelity-runtime.js
src/shared/tree-fidelity-assets.js
src/game.js
src/pages/menu.js
src/game-runtime-lod.js
src/workers/prehistoric-patch-worker.js
src/world/prehistoric-patch-generator.js
tests/helpers/vegetation-placement-fixture.mjs
tests/terrain-lod-renderer-authority.mjs
tests/tree-spawn-variation.mjs
Nexus Engine Core Vegetation, Ecology, Tree, Foliage, and Object Bridge source
package.json
```

## Required fixtures

```txt
semantic descriptor and package generation identity
semantic fidelity profile package adoption
speciesId/package binding completeness
main-thread/Worker deterministic parity
Worker generation mismatch rejection
patch request/result generation binding
instance-scaled collision and replay parity
semantic descriptor change cache invalidation
stale IndexedDB generation retirement
menu preload and game startup generation equality
FirstDomainBoundMenuAssetAck
FirstDomainBoundGameAssetAck
FirstDomainBoundPatchAck
FirstDomainBoundTreeFrameAck
source/build/Pages generation parity
```

## Change scope

```txt
documentation changed: yes
runtime JavaScript changed by audit: no
tree packages or cache keys changed by audit: no
Worker protocol changed by audit: no
gameplay, rendering, physics, or camera changed by audit: no
tests or package scripts changed by audit: no
workflow or deployment changed by audit: no
branch created: no
pull request created: no

npm test: not run
collision fixtures: not run
browser and cache fixtures: not run
Worker mismatch fixtures: not run
built-output smoke: not run
Pages smoke: not run
```

No current visual defect, semantic profile adoption, composite generation guarantee, Worker catalog equality, cache invalidation correctness, species-package convergence, artifact parity, Pages parity, or production readiness is claimed.
