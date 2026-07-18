# PrehistoricRush Validation

**Audit timestamp:** `2026-07-18T13-39-48-04-00`  
**Scope:** organization selection, full kit/service inventory, streamed collider membership, Core Physics/fallback collision convergence and executable-proof boundaries

## Summary

Source inspection confirms that patch generation emits tree collider records; the base adapter stores them by patch; activation and effective release rebuild a sorted flattened complete collider view; and the complete view is passed to `corePhysics.syncColliders()`.

Source inspection also confirms that accepted simulation ticks run a Core Physics observation and a separate fallback collision observation. The resolution policy selects a fatal physics contact first and a fallback hit only when no fatal physics contact exists.

## Confirmed by inspection

```txt
Publish repositories observed: 11
eligible after Cavalry exclusion: 10
selected: PrehistoricRush
selection reason: oldest synchronized documented eligible repository
reviewed repository head: 8ebddd3d89e02227898fbcd7ce75d7fb56efeaa4
reviewed runtime source revision: 9462a74d747286d937d5dbfb2b245a2e7ae8371b

patch tree collider records: present
collidersByPatch map: present
complete ordered view rebuild: present
corePhysics.syncColliders complete-view call: present
physics.frame observation: present
fallback collision observation: present
physics-first resolution precedence: present
membership generation and parity result: absent
```

## Source inspected

```txt
package.json
src/game-runtime-lod.js
src/world/prehistoric-patch-generator.js
src/render/three-patch-stream-adapter.js
src/render/three-patch-stream-lod-adapter.js
src/domains/prehistoric-rush/prehistoric-rush-domain-runtime.js
src/domains/prehistoric-rush/prehistoric-rush-resolution-policy.js
current .agent tracker and kit registry
central PrehistoricRush ledger
```

## Source-derived limits

```txt
active radius: 2
maximum active patch positions: 25
maximum tree candidates per patch: 7
maximum candidate tree colliders across active positions: 175
```

Actual collider counts can be lower. No runtime count or cost was measured.

## Required executable fixtures

```txt
npm test
collider membership ordering and digest
added/retained/removed delta settlement
unchanged membership synchronization suppression
provider synchronization result
physics/fallback agreement
physics-only and fallback-only collisions
collider-ID divergence
stale patch and stale run rejection
restart isolation
jump-threshold boundary
browser Rapier convergence
built-output smoke
Pages-origin smoke
FirstCollisionBoundFrameAck
```

## Change scope

```txt
documentation changed by audit: yes
runtime JavaScript changed by audit: no
tests and package scripts changed by audit: no
Worker behavior changed by audit: no
gameplay, rendering and physics changed by audit: no
workflows and deployment changed by audit: no
branch created: no
pull request created: no

source inspection performed: yes
npm test run by audit: no
physics provider fixture run: no
browser fixture run: no
artifact smoke run: no
Pages smoke run: no
```

## Execution boundary

The environment could not resolve `github.com` for a direct checkout. Validation therefore used the GitHub connector and source inspection only. No Node command, browser fixture, physics profiler, artifact download or Pages-origin smoke was executed.

The package test script has syntax and contract/source tests, but no real collider membership, provider synchronization, physics/fallback parity, browser, built artifact or Pages fixture.

## Claim boundary

Collision generation, full-view submission, physics observation, fallback observation and resolution precedence are documented as implemented. Collision correctness under disagreement, provider-side incremental behavior, performance, resource lifetime, browser parity, artifact parity, Pages parity and production readiness are not claimed.