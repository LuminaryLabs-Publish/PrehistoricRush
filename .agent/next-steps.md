# PrehistoricRush Next Steps

**Updated:** `2026-07-08T03:01:20-04:00`

## Next safe ledge

Build the runner authority fixture gate and dino bridge without changing the visible route.

```txt
preserve index.html
preserve src/runtime.mjs
preserve current Three.js/Rapier look and feel
preserve current PrehistoricRushHost.getState()
add pure action/result records around current behavior
emit runner.moved from the live movement step
let dino-pose-domain-kit consume runner.moved
surface pose bridge proof through host diagnostics
```

## Implementation checklist

- [ ] Add a runtime source bundle loader that reads `game-scenes.json`, `runner-tuning.json`, `flock-generation.json`, `kit-composition.json`, and `kit-cutover-inventory.json` before live setup.
- [ ] Add manifest load status output.
- [ ] Add manifest drift diagnostics comparing inline values against manifest values.
- [ ] Add an explicit scene alias catalog for `game:runOver -> run-over` and any `fail -> run-over` drift.
- [ ] Add `ActionFrame` records for start, retry, run-again, menu, left, right, boost, jump, and future touch input.
- [ ] Add an action acceptance matrix with stable accepted/rejected reasons.
- [ ] Add runner source state snapshots before movement mutation.
- [ ] Add runner step result records wrapping the current movement math.
- [ ] Emit `runner.moved` from the live movement step.
- [ ] Confirm `dino-pose-domain-kit` receives `runner.moved` and emits `dino.pose.changed`.
- [ ] Bridge dino pose descriptors back into the raptor visual rig.
- [ ] Add contact event records for hazard hit, shard pickup, and distance goal.
- [ ] Add scene dispatch result records for run-over and win.
- [ ] Add a replay/action journal exposed through `PrehistoricRushHost`.
- [ ] Add DOM-free smoke fixtures for accepted/rejected action paths.
- [ ] Write a run movement promotion report defining the first shared `run-movement-kit` API candidate.

## DSK extraction order

```txt
1. prehistoric-rush-runtime-source-bundle-kit
2. prehistoric-rush-manifest-load-status-kit
3. prehistoric-rush-action-frame-contract-kit
4. prehistoric-rush-action-acceptance-matrix-kit
5. prehistoric-rush-action-result-journal-kit
6. prehistoric-rush-runner-source-state-kit
7. prehistoric-rush-runner-step-result-kit
8. prehistoric-rush-runner-event-journal-kit
9. prehistoric-rush-dino-domain-bridge-kit
10. prehistoric-rush-contact-result-snapshot-kit
11. prehistoric-rush-scene-dispatch-result-kit
12. prehistoric-rush-replay-parity-smoke-kit
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
run-over scene dispatch fixture
win scene dispatch fixture
manifest drift report fixture
replay parity smoke
```
