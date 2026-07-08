# PrehistoricRush Validation

**Updated:** `2026-07-08T03:01:20-04:00`

## Validation status for this pass

No runtime source files were changed in this pass.

This pass created documentation and operating memory under `.agent/` only.

## Checks performed

```txt
- GitHub connector read of full LuminaryLabs-Publish installation repo list.
- GitHub connector read of PrehistoricRush README.md.
- GitHub connector read of PrehistoricRush index.html.
- GitHub connector read of PrehistoricRush src/runtime.mjs.
- GitHub connector read of PrehistoricRush src/game.js.
- GitHub connector read of PrehistoricRush game-scenes.json.
- GitHub connector read of PrehistoricRush kit-cutover-inventory.json.
- GitHub connector read of PrehistoricRush src/domains/dino/index.js.
- GitHub connector read of PrehistoricRush src/domain-runtime/domain-host.js.
- GitHub connector read of central LuminaryLabs-Dev/LuminaryLabs repo ledger for PrehistoricRush.
```

## Checks not performed

```txt
- No local checkout was available in this connector pass.
- No `npm install` was run.
- No `npm run check` was run.
- No browser route validation was run.
- No Playwright smoke was run.
- No live GitHub Pages route was opened.
- No Rapier/Three.js runtime execution was performed.
```

## Next validation commands

There is no `package.json` in the repo root at the time of this pass, so do not assume `npm run check` exists.

Recommended next checks:

```bash
# If working from a local checkout:
python3 -m http.server 4173
# open http://localhost:4173/
```

Browser console checks:

```js
globalThis.PrehistoricRushComposition?.snapshot?.()
globalThis.PrehistoricRushHost?.getState?.()
```

Expected route facts:

```txt
index.html loads ./src/runtime.mjs
src/runtime.mjs imports ./game.js
src/game.js installs dino domain scaffold
src/game.js imports ./runtime-terrain-v6.mjs
```

## Future smoke tests needed

```txt
manifest-load-smoke
manifest-drift-smoke
scene-alias-smoke
action-acceptance-smoke
action-result-journal-smoke
runner-source-state-smoke
runner-step-smoke
runner-moved-dino-pose-bridge-smoke
contact-event-smoke
scene-dispatch-smoke
host-diagnostics-smoke
replay-parity-smoke
run-movement-promotion-smoke
```

## Pass/fail rule

Do not mark the game as DSK-authority-complete until a DOM-free fixture can replay start, jump, lane move, hazard, pickup, run-over, retry, and win paths into stable action/result journals without depending on renderer frame timing.
