# Next Steps: PrehistoricRush

**Updated:** `2026-07-10T07-50-29-04-00`

## Next safe ledge

```txt
PrehistoricRush Runner Event Journal Readback Catch-up + DOM-Free Presentation Gate
```

## Why this comes next

The project already has a useful DSK wrapper, an event bus, a domain host, and a `dino-pose-domain-kit` that consumes `runner.moved`.

The live runtime does not emit `runner.moved` yet, does not retain input or movement result rows, and does not expose presentation proof through `PrehistoricRushHost.getState()`.

## Implementation order

1. Add pure presentation source modules.

```txt
src/presentation/presentation-events.js
src/presentation/runner-source-state.js
src/presentation/runner-step-delta.js
src/presentation/runner-moved-event.js
src/presentation/input-result-row.js
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
```

2. Add the DOM-free fixture.

```txt
scripts/prehistoric-rush-runner-event-fixture.mjs
```

3. Wire runtime movement to source records without changing game feel.

```txt
runtime current state
  -> RunnerSourceState
  -> RunnerStepDelta
  -> InputResultRow
  -> MovementResultRow
  -> eventBus.emit("runner.moved", RunnerMovedEvent)
```

4. Add additive host readback.

```txt
PrehistoricRushHost.getState().presentation
```

5. Add package validation after the fixture exists.

```txt
npm run check
```

## Fixture rows to cover

```txt
menu no-run frame
start transition
straight movement
left turn
right turn
boost movement
jump start
jump rejected/no-op while airborne
falling frame
grounded recovery
rock/tree contact to run-over
shard pickup
win threshold
best distance write
legacy host shape preserved
presentation pass does not erase source frame ids
render readback row shape
```

## Stop conditions

Do not start these until the event bridge and fixture pass exist:

```txt
visual expansion
new terrain pass
movement retune
renderer extraction
camera feel retune
new pickup economy
ProtoKit promotion
```
