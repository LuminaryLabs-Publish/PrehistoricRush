# PrehistoricRush Deploy Audit: Static Fixture Validation Map

**Timestamp:** `2026-07-08T21-50-56-04-00`

## Deploy surface

`PrehistoricRush` is a static browser repo deployed from `main` through GitHub Pages.

The README states that Pages deploys from the `main` branch and uploads the static repository root.

## Current route facts

```txt
index.html
src/runtime.mjs
src/game.js
src/runtime-terrain-v6.mjs
static JSON manifests
static scene descriptors
```

## Validation constraints

```txt
- No package.json was observed in the root during this pass.
- Do not assume npm scripts exist.
- Do not add package.json only for docs validation.
- Do not create a branch for validation.
- Use main only.
- Browser route validation still requires a static server or Pages check.
```

## Future validation flow after implementation

```bash
node scripts/prehistoric-rush-presentation-frame-fixture.mjs
python3 -m http.server 4173
# open http://localhost:4173/
```

## Browser console checks

```js
globalThis.PrehistoricRushComposition?.snapshot?.()
globalThis.PrehistoricRushHost?.getState?.()
globalThis.PrehistoricRushHost?.getState?.().presentation
```

## Fixture build gate

The next source implementation should be considered incomplete until these pass:

```txt
DOM-free fixture can run without document/window.
Fixture can construct RunnerSourceState.
Fixture can construct RunnerStepDelta.
Fixture can construct RunnerMovedEvent.
Fixture can construct DinoPoseFrame.
Fixture can construct CameraFrameRequest.
Fixture can construct HudFrameRequest.
Fixture can construct ContactResultSnapshot.
Fixture can construct SceneDispatchResult.
Fixture can construct RenderReadback.
Fixture can construct PresentationFrameRecord.
Fixture can project HostPresentationSnapshot.
Existing browser route remains playable.
Existing host fields remain present.
```

## Deploy risk

The main deploy risk is not build failure from this docs pass. The risk is a future implementation accidentally coupling pure fixtures to browser-only APIs.

Keep fixture modules pure and browser adapters thin.
