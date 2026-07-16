# PrehistoricRush Validation

**Audit timestamp:** `2026-07-16T12-02-38-04-00`  
**Scope:** tree-fidelity asset preparation, adoption, patch binding, render forms and visible-frame proof

## Summary

Source review confirms five portable tree packages, menu background preload, game required preparation, IndexedDB caching and a source contract test. Source review also confirms that active patch generation and Three.js tree rendering still use an independent hard-coded tuple list and legacy instanced geometry.

## Plan ledger

**Goal:** separate verified asset preparation from unverified package adoption and visual presentation.

- [x] Compare all 11 Publish repositories and select runtime-ahead PrehistoricRush.
- [x] Compare documented head `e83638ab` with runtime head `7159a414`.
- [x] Inspect all six changed files.
- [x] Inspect asset provider, package schema, manifest, bundle and cache setup.
- [x] Inspect menu and game startup integration.
- [x] Inspect patch tree inputs and renderer tree allocation.
- [x] Inspect the new source contract test.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Execute package, browser, build and Pages fixtures later.

## Verified source findings

```txt
Core Assets runtime: present
Core Startup runtime for game route: present
five tree archetypes: present
five package assets: present
manifest dependency graph: present
bundle registration: present
near and medium mesh recipes: present
far and horizon impostor descriptors: present
color and opacity capture request: present
IndexedDB cache adapter: present when supported
menu background request: present
game required preparation: present
progress projection: present
source contract test in npm test: present

runtime preparation-result input: absent
runtime receipt lookup: absent
single archetype/type source: absent
package identity in patch records: absent
package digest in cache/generator identity: absent
package mesh recipe materialization: absent
package atlas materialization: absent
projected-size form selection: absent
transition policy application: absent
stale package rejection: absent
route/provider retirement result: absent
TreeFidelityAdoptionResult: absent
FirstTreeFidelityBoundFrameAck: absent
browser/build/Pages fixture: absent
```

## Source-derived failure boundary

```txt
required preparation resolves
  -> receipt is stored globally
  -> game runtime imports
  -> independent treeTypes are used
  -> legacy tree resources are created
  -> frame contains no accepted package identity
```

This proves a missing adoption/projection contract. It does not prove provider failure, cache failure or a specific visual defect.

## Change boundary

```txt
documentation changed by audit: yes
runtime JavaScript changed by audit: no
package or test changed by audit: no
asset schema changed by audit: no
gameplay, rendering or physics changed by audit: no
workflow or deployment changed by audit: no
branch created: no
pull request created: no
```

## Checks not completed

```txt
npm test
provider package-generation fixture
manifest dependency fixture
IndexedDB miss/hit fixture
menu-to-game cache handoff fixture
package adoption fixture
near/medium/far/horizon render fixture
transition fixture
stale generation fixture
route retirement fixture
built-output smoke
GitHub Pages smoke
```

## Non-claims

No runtime package adoption, tree-fidelity visual improvement, cache correctness, lifecycle correctness, artifact parity, Pages parity or production readiness is claimed.