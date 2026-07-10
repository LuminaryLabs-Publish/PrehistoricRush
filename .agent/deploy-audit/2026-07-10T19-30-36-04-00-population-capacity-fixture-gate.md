# Deploy Audit: Population Capacity Fixture Gate

**Timestamp:** `2026-07-10T19-30-36-04-00`

## Current deploy surface

GitHub Pages uploads the static repository root from `main`. The route has no root `package.json`, no local dependency install, and no deterministic population validation command.

## Required pre-deploy fixture

```txt
node scripts/prehistoric-rush-population-capacity-fixture.mjs
```

The fixture should run without DOM, WebGL, Three.js, or Rapier by separating population requests and admission results from renderer mutation.

## Required assertions

```txt
all pool capacities are positive and immutable
active count never exceeds capacity
all matrix write indices are within capacity
root overflow is typed and deterministic
grass sparse -> dense sequence does not ratchet capacity
same seed/window yields identical admitted IDs and transforms
tree render rows and collider rows have parity
shard render rows and pickup rows have parity
population snapshot is detached and JSON-safe
```

## Browser smoke after fixture

```txt
load GitHub Pages route
start run
cross at least two terrain-window boundaries
confirm no console errors
confirm grass can increase after a sparse window
confirm no invisible tree collider in sampled contacts
confirm host snapshot reports pool generation and counts
```

## Validation state

```txt
runtime source changed: no
workflow changed: no
fixture exists: no
fixture run: no
browser smoke run: no
branch created: no
pull request created: no
target branch: main
```