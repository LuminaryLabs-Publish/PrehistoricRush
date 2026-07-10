# Validation: PrehistoricRush

**Updated:** `2026-07-10T19-30-36-04-00`

## This pass

```txt
runtime source changed: no
agent docs changed: yes
central ledger changed: yes
central internal change log added: yes
branch created: no
pull request created: no
target branch: main
```

## Repository comparison performed

```txt
accessible LuminaryLabs-Publish repositories: 10
eligible non-Cavalry repositories: 9
all eligible repos in central ledger: yes
all eligible repos with root .agent evidence: yes
selected repo: PrehistoricRush
selection basis: recent giant-forest/skinned-dino runtime cutover post-dated the 2026-07-10T18-01-03-04-00 audit state
TheCavalryOfRome: excluded
```

## Readback performed

```txt
README.md
index.html
src/runtime.mjs
src/game.js
src/domains/route/route-field-domain-kit.js
src/domains/surface/surface-traversal-domain-kit.js
src/domains/forest/forest-archetype-domain-kit.js
src/domains/grass/grass-patch-domain-kit.js
src/domains/grass/grass-wind-domain-kit.js
src/domains/dino/procedural-dino-body-domain-kit.js
src/domain-runtime/event-bus.js
current root .agent state
central PrehistoricRush ledger
recent PrehistoricRush commits
current Publish repository inventory
```

## Static findings confirmed

```txt
current runtime route: index.html -> src/runtime.mjs -> src/game.js
current src/runtime.mjs imports only ./game.js
current route uses one RAF
active repo-local kits: route, surface, forest, grass patch, grass wind, procedural dino body
root InstancedMesh capacity: 400
configured maximum root requests before route rejection: 7 x 49 x 4 = 1,372
root writes have no explicit capacity guard
grass admission checks layer.mesh.count
grass population later overwrites layer.mesh.count with active count
tree pools have no explicit typed overflow result
host snapshot has no pool generation or capacity rows
Start/Retry/Run Again perform only a partial reset
```

## Runtime validation

```txt
local checkout: no
root package.json found: no
npm install: not run
npm run check: unavailable
npm test: unavailable
browser smoke: not run
GitHub Pages smoke: not run
population capacity fixture: not available
tree/collider parity fixture: not available
shard/pickup parity fixture: not available
```

## Push validation

```txt
repo-local documentation pushed to main: yes
central ledger updated on main: yes
central internal change log pushed to main: yes
```

## Next validation target

```txt
node scripts/prehistoric-rush-population-capacity-fixture.mjs
```

The fixture must prove immutable capacities, bounded matrix writes, deterministic overflow, grass sparse-to-dense recovery, generation IDs, render/gameplay parity, and detached JSON-safe pool observations.