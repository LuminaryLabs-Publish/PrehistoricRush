# Deploy audit: DOM-free frame correlation fixture gate

Timestamp: `2026-07-10T14-59-00-04-00`

## Current validation status

```txt
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free frame-correlation fixture: not available
runtime source changed: no
```

## Required fixture

```txt
scripts/prehistoric-rush-frame-correlation-fixture.mjs
```

## Required assertions

```txt
fixture can create deterministic runner source state
fixture can step movement without DOM
frameId increments monotonically
input result row links to movement result row
movement result row emits runner.moved-compatible payload
pose/camera/HUD rows keep sourceFrameId
render readback keeps sourceFrameId
contact and pickup rows retain reasons
scene transition rows retain reasons
legacy host shape remains compatible
presentation host snapshot is JSON-safe
```

## Package gate

Add a package script only after the fixture exists:

```txt
npm run check
```

## Do not gate on visual smoke first

The browser route can stay playable while proof rows are added. The next gate should be deterministic and DOM-free.