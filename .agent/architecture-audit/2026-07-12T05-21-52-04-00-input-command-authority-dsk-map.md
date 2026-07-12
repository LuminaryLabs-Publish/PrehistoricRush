# Architecture Audit: Input Command Authority DSK Map

**Timestamp:** `2026-07-12T05-21-52-04-00`

## Summary

The runtime installs `core-input-kit`, but the browser host remains the effective input owner. Global listeners mutate host flags, directly invoke `game.start()` or `game.setInput()`, and copy held values into product state during RAF. This bypasses one authoritative command/admission boundary.

## Plan ledger

**Goal:** route all browser input through one composed domain that owns source observation, semantic classification, run admission, edge/hold state, retirement, step consumption and frame correlation.

- [x] Identify existing input owners and mutation points.
- [x] Separate press-edge actions from held controls.
- [x] Identify status, run, repeat and focus admission gaps.
- [x] Define the parent domain and candidate kits.
- [ ] Implement adapters without creating a second input owner.

## Existing architecture

```txt
window keydown/keyup/blur
  -> host input object
  -> direct game.start/game.setInput calls
  -> RAF copies steer/boost into product InputState
  -> product simulate system consumes and mutates run state

button onclick
  -> separate status-aware start/jump policy

core-input-kit
  -> installed in engine graph
  -> not used as browser ingress authority
```

## Required parent domain

```txt
prehistoric-rush-input-command-authority-domain
```

## DSK composition

```txt
Observation
  input-source-descriptor-kit
  input-sample-id-kit
  input-sample-observation-kit
  input-code-normalization-kit
  input-repeat-classification-kit

Policy and state
  input-action-policy-kit
  input-edge-state-kit
  input-hold-state-kit

Commands and admission
  input-command-kit
  input-command-id-kit
  input-command-admission-kit
  input-command-idempotency-kit
  run-start-command-adapter-kit
  jump-command-adapter-kit
  steer-hold-adapter-kit
  boost-hold-adapter-kit

Lifecycle and consumption
  input-focus-retirement-kit
  input-visibility-retirement-kit
  core-input-browser-adapter-kit
  input-step-consumption-result-kit
  input-frame-correlation-kit

Observation and proof
  input-observation-kit
  input-journal-kit
  active-run-enter-rejection-fixture-kit
  key-repeat-start-idempotency-fixture-kit
  jump-press-release-fixture-kit
  focus-visibility-retirement-fixture-kit
  button-keyboard-parity-fixture-kit
  browser-input-frame-smoke-kit
```

## Required command envelope

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
  semanticKind: edge | hold
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
  beforeInputRevision
  afterInputRevision
  action
  semanticKind
  edgeAccepted
  holdState
  idempotentReplay
  consumedSimulationStepId
  visibleFrameId
}
```

## Authority rules

```txt
start/restart is phase-admitted
jump is a press edge, not a browser-repeat pulse
steer and boost are held-state controls
release/blur/visibility/reset/disposal retire held state
button and keyboard adapters emit the same semantic commands
core-input-kit owns engine-facing input state
product gameplay consumes immutable step input
```

## Integration order

```txt
1. Add browser event adapters producing normalized samples.
2. Define named action policy for Enter, Space, A/D, arrows and W.
3. Route button activation through the same command layer.
4. Move held state into core input ownership.
5. Convert product simulation to consume one immutable step snapshot.
6. Add focus, visibility, reset and disposal retirement.
7. Publish command and step results through diagnostics.
8. Add frame acknowledgement and browser fixtures.
```

No runtime architecture changed in this audit.