# Interaction Audit: Browser Sample to Core Input Result Map

**Timestamp:** `2026-07-13T03-12-30-04-00`

## Summary

Browser samples currently mutate host-local or product input state directly and return no typed result. The required map separates event capture, admission, Core Input state, gameplay consumption and visible confirmation.

## Plan ledger

**Goal:** require every browser sample to terminate in one accepted, rejected, duplicate, stale or cleared result with zero mutation on rejection.

- [x] Map keyboard, button, blur and RAF paths.
- [x] Identify identity, focus, repeat, sequence and generation gaps.
- [x] Define terminal results and consumer receipts.
- [ ] Implement the result map later.

## Current map

```txt
KeyboardEvent
  -> direct window listener
  -> optional preventDefault
  -> mutate host-local held state
     or game.setInput({ jump: true })
     or start()
  -> undefined

Button click
  -> inspect current run status
  -> direct jump or start
  -> undefined

RAF
  -> copy host-local steer/boost
  -> game.setInput()
  -> engine.tick()

blur
  -> clear host-local held state
  -> patch product InputState neutral
  -> undefined
```

## Required sample envelope

```txt
BrowserInputSample {
  sampleId,
  inputSessionId,
  surfaceId,
  focusGeneration,
  lifecycleGeneration,
  source: keyboard | button,
  codeOrControlId,
  phase: down | up | activate | clear,
  repeat,
  targetClass,
  sequence,
  capturedAt
}
```

## Required admission results

```txt
AcceptedHeldInputResult
AcceptedEdgeCommandResult
RejectedUnfocusedResult
RejectedEditableTargetResult
RejectedRepeatResult
RejectedUnavailableActionResult
RejectedStatusResult
StaleGenerationResult
DuplicateInputResult
InputClearResult
FailedInputResult
```

## Required flow

```txt
BrowserInputSample
  -> validate session/surface/focus/lifecycle
  -> validate target and source
  -> classify held or edge action
  -> apply repeat policy
  -> map to Core Input action/binding
  -> sequence and duplicate admission
  -> CoreInputAdmissionResult
  -> product consumer adapter
  -> ProductInputConsumptionReceipt
  -> simulation/render projection
  -> FirstInputFrameAck
```

## Zero-mutation requirements

```txt
unfocused event: no held-state or product-state change
editable target: no gameplay effect
repeat-rejected edge: no runId/jump change
stale generation: no state change
duplicate command: return prior sealed result
unsupported status: no run or scene transition
```

## Non-claim

No event handler, Core Input API, product state or interaction behavior was changed.