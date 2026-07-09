# Deploy Audit: DOM-free Fixture Validation Freeze

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T03-10-05-04-00`

## Current deploy surface

`PrehistoricRush` is a static browser app on the `main` branch.

The root route is expected to keep this chain:

```txt
index.html
  -> ./src/runtime.mjs
  -> ./src/game.js
  -> ./src/runtime-terrain-v6.mjs
```

There is no root `package.json` documented as live, so validation should not assume npm scripts.

## Validation available now

```txt
GitHub connector read of repo metadata
GitHub connector read of repo-local .agent files
GitHub connector read of source files
GitHub connector writes to main
central ledger update in LuminaryLabs-Dev/LuminaryLabs
```

## Validation blocked until next implementation

```txt
node scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

The script does not exist yet.

## Fixture gate to add next

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
  -> imports pure src/presentation/* modules
  -> builds synthetic previous/current runner states
  -> projects RunnerSourceState
  -> projects RunnerStepDelta
  -> projects RunnerMovedEvent
  -> drives dino-pose-domain-kit through eventBus
  -> records DinoPoseFrame
  -> records CameraFrameRequest
  -> records HudFrameRequest
  -> records ContactResultSnapshot
  -> records SceneDispatchResult
  -> records RenderReadback
  -> records PresentationFrameRecord
  -> projects HostPresentationSnapshot
  -> exits nonzero on failed row
```

## Future browser smoke

After fixture proof exists:

```bash
python3 -m http.server 4173
# open http://localhost:4173/
```

Console checks:

```js
globalThis.PrehistoricRushComposition?.snapshot?.()
globalThis.PrehistoricRushHost?.getState?.()
globalThis.PrehistoricRushHost?.getState?.().presentation
```

## Do not add only for docs

```txt
Do not add package.json only to make this documentation pass look validated.
Do not invent npm scripts.
Do not change deployment workflow in a docs-only run.
Do not create branches.
```

## This pass validation result

```txt
runtime source changed: no
.agent docs changed: yes
central ledger changed: yes
branch created: no
PR created: no
local build run: no
browser smoke run: no
DOM-free fixture run: no
```
