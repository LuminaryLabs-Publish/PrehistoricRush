# Deploy Audit: Runtime Admission and Lifecycle Fixture Gate

Timestamp: `2026-07-10T18-01-03-04-00`

## Current deployment

GitHub Pages serves the static repository from `main`. The browser resolves Three.js, Rapier, and the external physics kit at runtime.

## Deployment risks

```txt
physics kit uses mutable @main source
Pages artifact does not contain the admitted physics-kit implementation
same Pages commit can behave differently after upstream changes
CDN/network failure policy is not fixture-proven
fallback collision mode is not declared in build metadata
no root package.json or automated static check command
no mount/dispose browser lifecycle gate
```

## Required fixture files

```txt
scripts/prehistoric-rush-runtime-admission-fixture.mjs
scripts/prehistoric-rush-frame-session-fixture.mjs
scripts/prehistoric-rush-dispose-remount-fixture.mjs
```

## Required checks

```txt
external URLs are immutable production sources
requested source matches admitted source revision
required module failure rejects boot cleanly
optional failure admits named fallback with reason
source provenance snapshot is JSON-safe and stable
one source frame produces one accepted render commit
Retry / Run Again reset transient session state
mount/dispose/remount leaves bounded listeners, RAFs, canvases, graphics, and physics resources
README/manifests are classified as consumed or ignored
```

## Proposed gate order

```txt
1. source/static URL and export validation
2. DOM-free dependency admission matrix
3. DOM-free frame/session fixture
4. browser mount/dispose/remount smoke
5. static build/package check
6. Pages deployment smoke
```

## Current validation status

```txt
runtime source changed: no
root package.json: absent
npm checks: unavailable
browser smoke: not run
Pages smoke: not run
admission fixture: unavailable
frame/session fixture: unavailable
dispose/remount fixture: unavailable
```

Do not use a successful static upload as proof that runtime dependencies, frame authority, session restart, or resource disposal are correct.