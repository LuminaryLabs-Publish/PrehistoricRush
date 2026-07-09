# Deploy Audit: DOM-Free Fixture Wire Map

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Timestamp:** `2026-07-09T06-10-35-04-00`

## Current deploy surface

`PrehistoricRush` is currently a static browser route.

Current validation constraints:

```txt
root package.json is not present
npm scripts must not be assumed
runtime depends on browser APIs
runtime imports Three.js and Rapier from CDNs
runtime imports rapier-physics-domain-kit from NexusRealtime-ProtoKits main CDN
DOM-free fixture does not exist yet
```

## Current route checks needed

```txt
python3 -m http.server 4173
open http://localhost:4173/
console: globalThis.PrehistoricRushComposition?.snapshot?.()
console: globalThis.PrehistoricRushHost?.getState?.()
console: globalThis.PrehistoricRushHost?.getState?.().presentation
```

## Next fixture command

After source files exist:

```bash
node scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

Do not add a package script until the root package file exists for a broader reason.

## Fixture wire map

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
  -> imports src/presentation/runner-source-state.js
  -> imports src/presentation/runner-step-delta.js
  -> imports src/presentation/runner-moved-event.js
  -> imports src/presentation/dino-pose-frame.js
  -> imports src/presentation/camera-frame-request.js
  -> imports src/presentation/hud-frame-request.js
  -> imports src/presentation/contact-result-snapshot.js
  -> imports src/presentation/scene-dispatch-result.js
  -> imports src/presentation/render-readback.js
  -> imports src/presentation/presentation-frame-record.js
  -> imports src/presentation/presentation-journal.js
  -> imports src/presentation/host-presentation-snapshot.js
  -> runs deterministic rows without WebGL, Rapier, DOM, or network
```

## Deployment risk

The next implementation must not break the browser route while adding diagnostics.

Risk controls:

```txt
keep existing index.html route
keep src/runtime.mjs import shape
keep src/game.js dynamic import of runtime-terrain-v6.mjs
keep existing host state fields
add nested presentation state only
preserve double-render behavior until parity proof exists
avoid package.json assumptions
avoid branch creation
```

## Finding

The safe deploy ledge is a DOM-free fixture plus browser readback, not a build-system change.
