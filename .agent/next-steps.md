# PrehistoricRush Next Steps

**Updated:** `2026-07-08T05:10:47-04:00`

## Next safe ledge

Build the runner action/result authority gate and dino pose bridge without changing the visible route.

```txt
preserve index.html
preserve src/runtime.mjs
preserve src/game.js route composition
preserve current Three.js/Rapier look and feel
preserve current PrehistoricRushComposition.snapshot()
preserve current PrehistoricRushHost.getState()
add pure ActionFrame records around current behavior
add ActionAcceptance with stable reasons
add ActionResult journal entries
wrap current movement math in RunnerStepResult
emit runner.moved from the live movement step
let dino-pose-domain-kit consume runner.moved
surface dino pose bridge proof through host diagnostics
```

## Implementation checklist

- [ ] Add `ActionFrame` records for start, retry, run-again, menu, left, right, boost, jump, and future touch input.
- [ ] Add an action acceptance matrix with stable accepted/rejected reasons.
- [ ] Add action result journal entries for accepted and rejected paths.
- [ ] Add runner source state snapshots before movement mutation.
- [ ] Add runner step result records wrapping the current movement math.
- [ ] Emit `runner.moved` from the live movement step.
- [ ] Confirm `dino-pose-domain-kit` receives `runner.moved` and emits `dino.pose.changed`.
- [ ] Bridge dino pose descriptors back into the raptor visual rig without making the renderer own pose truth.
- [ ] Add contact event records for hazard hit, shard pickup, and distance goal.
- [ ] Add scene dispatch result records for run-over and win.
- [ ] Add a replay/action journal exposed through `PrehistoricRushHost` without replacing the existing host surface.
- [ ] Add DOM-free smoke fixtures for accepted/rejected action paths.
- [ ] Write a run movement promotion report defining the first shared `run-movement-kit` API candidate.

## DSK extraction order

```txt
1. prehistoric-rush-action-frame-contract-kit
2. prehistoric-rush-action-acceptance-matrix-kit
3. prehistoric-rush-action-result-journal-kit
4. prehistoric-rush-runner-source-state-kit
5. prehistoric-rush-runner-step-result-kit
6. prehistoric-rush-runner-event-journal-kit
7. prehistoric-rush-dino-domain-bridge-kit
8. prehistoric-rush-contact-result-snapshot-kit
9. prehistoric-rush-scene-dispatch-result-kit
10. prehistoric-rush-replay-parity-smoke-kit
11. prehistoric-rush-runtime-source-bundle-kit
12. prehistoric-rush-manifest-load-status-kit
13. prehistoric-rush-run-movement-promotion-report-kit
```

## Do not do next

```txt
- Do not redesign the visible scene before authority extraction.
- Do not replace the whole runtime in one pass.
- Do not move everything into ProtoKits before local proof exists.
- Do not create a generic kit if the behavior is still PrehistoricRush-specific.
- Do not let renderer, DOM, keyboard handlers, or Rapier frame stepping own reusable logic.
```

## Validation target after implementation

```txt
node-based smoke if available
browser route smoke
host snapshot check
accepted/rejected action fixture
runner.moved bridge fixture
dino.pose.changed fixture
hazard contact fixture
pickup contact fixture
run-over scene dispatch fixture
win scene dispatch fixture
manifest drift report fixture
replay parity smoke
```

## Stop condition

Stop the implementation ledge when start, retry, menu, lane move, boost, jump, hazard, pickup, run-over, and win paths can be replayed into a stable journal without depending on DOM or renderer frame timing.
