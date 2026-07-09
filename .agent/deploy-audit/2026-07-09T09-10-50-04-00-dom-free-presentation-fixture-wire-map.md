# Deploy Audit: DOM-free Presentation Fixture Wire Map

**Timestamp:** `2026-07-09T09-10-50-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Current deploy surface

`PrehistoricRush` is a static browser route. The current source read does not show a root package workflow in the live path. The browser route can run without a build step.

## Current runtime entry

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> src/runtime-terrain-v6.mjs
```

## Fixture gap

There is no DOM-free fixture for the presentation bridge.

The next validation layer should be a script that imports pure presentation modules and verifies the event/readback records without launching WebGL, a browser, or Rapier.

## Proposed validation script

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Required fixture inputs

```txt
synthetic menu app state
synthetic first movement frame state
synthetic turn-left frame state
synthetic turn-right frame state
synthetic boost frame state
synthetic jump-start frame state
synthetic jump-recover frame state
synthetic pickup frame state
synthetic collision frame state
synthetic win frame state
legacy host state projection sample
```

## Required fixture outputs

```txt
RunnerSourceState valid
RunnerStepDelta valid
RunnerMovedEvent valid
DinoPoseFrame valid
CameraFrameRequest valid
HudFrameRequest valid
ContactResultSnapshot valid
SceneDispatchResult valid
RenderReadback valid
PresentationFrameRecord valid
PresentationJournal valid
HostPresentationSnapshot valid
legacy host fields unchanged
```

## Package workflow note

Do not invent npm validation unless package metadata is intentionally added in the implementation pass.

If package metadata is added, prefer a single validation entry:

```txt
npm run check
```

That check should run the DOM-free fixture before any static artifact copy.

## Deployment risk

Low for this documentation pass.

No runtime source changed.

No build/deploy workflow changed.

## Next deploy ledge

```txt
Fixture first, static route unchanged.
```
