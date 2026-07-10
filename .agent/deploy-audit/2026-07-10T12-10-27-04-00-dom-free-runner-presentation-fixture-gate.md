# Deploy Audit: DOM-Free Runner Presentation Fixture Gate

**Timestamp:** `2026-07-10T12-10-27-04-00`

## Current deploy/validation state

```txt
static browser route: yes
root package.json found: no
npm run check: unavailable
browser smoke: not run in this docs-only pass
DOM-free runner presentation fixture: missing
runtime source changed: no
```

## Gate before runtime work is complete

Add a fixture that can run without DOM/Three.js/Rapier and prove the source ledger contract.

```txt
scripts/prehistoric-rush-runner-presentation-fixture.mjs
```

## Required fixture assertions

```txt
source rows have stable frame ids
input rows cover start/turn/boost/jump/no-op
movement rows cover accepted/no-change results
runner.moved rows are emitted for movement frames
dino pose rows can be derived from runner.moved
camera/HUD/render rows reference the same source frame
contact, pickup, scene, and best-distance rows have reason codes
HostPresentationSnapshot is JSON-safe
legacy PrehistoricRushHost shape is preserved
```

## Package gate

After the fixture exists, add a minimal package validation script.

```txt
package.json
scripts/prehistoric-rush-runner-presentation-fixture.mjs
npm run check
```

## Recommendation

Do not treat browser smoke as enough. The next deploy gate should be DOM-free source proof first, then browser smoke after the additive host readback is wired.
