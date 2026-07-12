# Interaction Audit: Browser Input Command Admission Map

**Timestamp:** `2026-07-12T05-21-52-04-00`

## Summary

Keyboard and button activation enter gameplay through different policy branches. The browser does not create typed samples or commands, and direct calls to `game.start()` and `game.setInput()` occur before any shared phase, run, repeat or revision admission.

## Plan ledger

**Goal:** map every input ingress into one command/result path with explicit rejection and consumption evidence.

- [x] Map button, keydown, keyup and blur ingress.
- [x] Map direct product-domain mutation calls.
- [x] Identify missing admission evidence.
- [x] Define shared command/result flow.
- [ ] Implement the adapters and fixtures.

## Current ingress map

```txt
button click
  -> read game.getState().status
  -> game: setInput({ jump: true })
  -> non-game: start()

keydown Enter
  -> start() in every phase

keydown Space
  -> game: setInput({ jump: true })
  -> non-game: start()

keydown A/D/arrows/W
  -> mutate host input flags

keyup A/D/arrows/W
  -> clear host input flags

blur
  -> clear host flags
  -> setInput({ steer: 0, boost: false, jump: false })

RAF
  -> setInput({ steer, boost })
```

## Missing admission fields

```txt
sampleId
commandId
source and modality
runtimeGeneration
runId
expected run revision
phase
physical press/release transition
repeat classification
input revision
simulation step ID
result status/reason
```

## Required map

```txt
DOM event or button activation
  -> InputSampleObservation
  -> normalize code/source/modality/repeat
  -> classify edge or hold
  -> produce semantic InputCommand
  -> admit against runtime, run, phase and expected revision
  -> apply command idempotently to core input state
  -> publish InputCommandResult
  -> consume immutable input snapshot in one simulation step
  -> publish InputStepConsumptionResult
  -> correlate first visible frame
```

## Required rejection reasons

```txt
unsupported-source
unsupported-code
repeat-edge
wrong-phase
wrong-run
stale-runtime-generation
stale-run-revision
duplicate-command
focus-not-active
runtime-disposed
```

## Parity requirement

Button and keyboard input must differ only at the source adapter. They must emit the same semantic start, retry and jump commands and receive the same admission policy and result schema.

No interaction behavior changed in this audit.