# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T05-21-52-04-00`

## Summary

Implement one browser-input command authority before further gameplay expansion. It must route button and keyboard observations through the installed core input capability, distinguish edges from holds, reject repeat/stale commands, retire state at lifecycle barriers and correlate accepted input with simulation and visible frames.

## Plan ledger

**Goal:** prevent active-run replacement, repeat-generated start/jump edges and parallel input ownership while preserving responsive steering, boost and jump controls.

- [ ] Define normalized input source, code, modality and repeat descriptors.
- [ ] Add monotonic sample IDs and command IDs.
- [ ] Define edge actions: start, retry, jump and optional explicit restart.
- [ ] Define held actions: steer-left, steer-right and boost.
- [ ] Reject browser repeat as a source of new edge commands.
- [ ] Require release before a second edge from the same source/code.
- [ ] Gate start/retry/restart against current phase and run revision.
- [ ] Route the button through the same semantic command adapters as keyboard input.
- [ ] Replace the browser-local held-state owner with a core-input adapter.
- [ ] Produce one immutable input snapshot per simulation step.
- [ ] Return typed command and step-consumption results.
- [ ] Retire held state on keyup, blur, visibility hidden, reset and disposal.
- [ ] Reject predecessor-run and stale-generation commands.
- [ ] Project detached input observations through diagnostics and host readback.
- [ ] Acknowledge the first frame consuming each accepted input revision.
- [ ] Execute deterministic, browser and Pages fixtures.

## Required command

```txt
InputCommand {
  commandId
  runtimeGeneration
  runId
  expectedRunRevision
  sampleId
  source
  code
  action
  semanticKind
  phase
  repeat
  observedAt
}
```

## Required result

```txt
InputCommandResult {
  status
  reason
  commandId
  sampleId
  runtimeGeneration
  runId
  action
  semanticKind
  beforeInputRevision
  afterInputRevision
  edgeAccepted
  holdState
  idempotentReplay
  consumedSimulationStepId
  visibleFrameId
}
```

## Ordered queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Browser Input Command Admission and Edge/Hold Authority
0b. Render Surface Resolution and Frame Correlation
1. Route/Profile Artifact Proof
2. Creator Draft/Commit/Preview Authority
3. Patch Activation and Release Commit Authority
3a. Shard Identity, Collection Commit and Visible Removal Authority
4. Collider Replacement and Admission
5. Run-Step Outcome and Terminal Frame
6. Stream Cadence and Time Budget
7. World Readiness
8. Committed Frame and Read Model
8a. Public Host Gateway
9. Coordinated Reset Epochs
10. Lifecycle and Disposal
```

## Required fixtures

```txt
active-run Enter rejection
single accepted start under held Enter
single jump edge under held Space
release/press second jump edge
button/keyboard start parity
button/keyboard jump parity
wrong phase/run/revision rejection
duplicate command receipt
held steer/boost press-repeat-release
blur retirement
visibility retirement
run reset retirement
runtime disposal retirement
immutable per-step input snapshot
input/state/frame correlation
browser and Pages input smoke
```

Do not create another keyboard state owner. Adapt the existing listeners and button into `core-input-kit`, then make `prehistoric-rush-domain-kit` consume the resulting per-step snapshot.