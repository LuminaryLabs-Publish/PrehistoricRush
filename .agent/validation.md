# PrehistoricRush Validation

**Audit timestamp:** `2026-07-17T14-40-21-04-00`  
**Scope:** organization selection, runtime pin reconciliation, complete kit/service inventory, Nexus Foliage binding repair, main/Worker provider consumption and release-proof boundaries

## Summary

Source inspection confirms that PrehistoricRush moved its Nexus Engine pin to `d41992636de2752f1ad9047b80701e6313f19b87`. That Nexus revision repairs the public Foliage service binding to `createFoliagePlacementRecipe`. Both the browser main realm and patch Worker import the shared pinned provider and construct the product Vegetation runtime.

## Confirmed by inspection

```txt
Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledgers: 10
root .agent states: 10
runtime-ahead eligible repositories: 1
selected: PrehistoricRush

previous documented head: 8cd649cb87fd98442116b2f3eff7496ea4c74e9c
reviewed runtime-ahead head: 47788818edec7d49753f942a69ef392a8b092037
old Nexus pin: c82782d00c135de0418bee777d30b463de6ff4ca
new Nexus pin: d41992636de2752f1ad9047b80701e6313f19b87
Foliage binding repair: present in Nexus commit
main realm consumes RUNTIME_URLS.nexus: present
Worker consumes RUNTIME_URLS.nexus: present
both realms construct product Vegetation runtime: present
local product-module test imports live provider: no
provider parity settlement: absent
```

## Source inspected

```txt
src/shared/runtime-versions.js
src/shared/prehistoric-vegetation-domain.js
src/game-runtime-lod.js
src/workers/prehistoric-patch-worker.js
tests/vegetation-module-imports.mjs
package.json
Nexus Engine commit d41992636de2752f1ad9047b80701e6313f19b87
current .agent tracker and kit registry
central PrehistoricRush ledger
```

## Required executable fixtures

```txt
npm test
exact pinned-provider source import
Core Object Vegetation construction
Foliage createPlacementRecipe callable assertion
full catalog registration and digest
browser main provider probe
browser Worker provider probe
main/Worker catalog and patch digest parity
stale Worker message rejection
built-output smoke
Pages-origin smoke
FirstProviderBoundVegetationFrameAck
```

## Change scope

```txt
documentation changed: yes
runtime JavaScript changed by audit: no
provider pin changed by audit: no
Worker behavior changed by audit: no
gameplay, rendering and physics changed by audit: no
tests and package scripts changed by audit: no
workflows and deployment changed by audit: no
branch created: no
pull request created: no

npm test: not run
live provider fixture: unavailable
browser main fixture: not run
browser Worker fixture: not run
artifact smoke: not run
Pages smoke: not run
```

## Claim boundary

The pin repair and production dependency are documented. Live CDN resolution, browser construction, Worker parity, patch parity, visible-frame convergence, artifact parity, Pages parity and production readiness are not claimed.