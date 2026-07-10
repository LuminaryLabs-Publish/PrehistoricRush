# Deploy Audit: DOM-Free Runner Event Fixture Gate

**Timestamp:** `2026-07-10T02-51-39-04-00`

## Current deploy surface

The repo is a static browser repo deployed from `main` by GitHub Pages.

The root has no `package.json` at this pass, so there is no root package validation command yet.

## Current validation state

```txt
root package.json found: no
npm run check: unavailable
browser smoke: not run
DOM-free presentation fixture: missing
GitHub Pages smoke: not run
```

## Required next validation files

```txt
src/presentation/presentation-events.js
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/movement-result-row.js
src/presentation/dino-pose-frame.js
src/presentation/camera-frame-request.js
src/presentation/hud-frame-request.js
src/presentation/contact-result-snapshot.js
src/presentation/pickup-result-snapshot.js
src/presentation/scene-dispatch-result.js
src/presentation/best-distance-result.js
src/presentation/render-readback.js
src/presentation/presentation-frame-record.js
src/presentation/presentation-journal.js
src/presentation/host-presentation-snapshot.js
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Required future command

After fixture files exist, add a root validation command.

```txt
npm run check
```

It should run:

```txt
node scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Fixture must fail on

```txt
missing runner.moved event row
missing movement result row
missing dino pose frame
missing camera frame request
missing HUD frame request
missing render readback
missing host presentation snapshot
legacy PrehistoricRushHost shape breakage
```

## Guardrail

Do not claim browser, Pages, or fixture validation until this fixture exists and is wired to a command.
