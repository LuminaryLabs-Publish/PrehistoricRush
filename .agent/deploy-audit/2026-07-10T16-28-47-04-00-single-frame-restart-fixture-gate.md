# Deploy audit: single-frame and restart fixture gate

Timestamp: `2026-07-10T16-28-47-04-00`

## Current deployment

GitHub Pages deploys the static repository root from `main`.

## Current validation status

```txt
root package.json found: no
npm validation: unavailable
browser smoke: not run
single-frame fixture: unavailable
restart fixture: unavailable
runtime source changed: no
```

## Required fixture

```txt
scripts/prehistoric-rush-frame-authority-fixture.mjs
```

## Required assertions

```txt
scheduler/adapter produces monotonic source frames
domain host ticks once per source frame
movement emits one runner.moved row
pose, camera, HUD, and render share sourceFrameId
one render commit is accepted
duplicate render request is rejected with reason
host snapshot is detached and JSON-safe
retry resets session state and preserves best distance
run-again resets distance below win threshold
runtime source manifest reports consumed and ignored manifests
legacy public host fields remain available
```

## Gate order

```txt
1. pure DOM-free fixture
2. package check command
3. browser smoke
4. Pages deployment smoke
```

Do not make visual polish the first deployment gate.
