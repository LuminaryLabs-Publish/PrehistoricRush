# Input System Audit: Focus, Repeat, Generation and Core Input Contract

**Timestamp:** `2026-07-13T03-12-30-04-00`

## Summary

The browser adapter has no input session, surface ownership, focus generation, lifecycle generation, repeat policy or command ledger. Core Input is present but not authoritative.

## Plan ledger

**Goal:** define the exact input-system contract required before browser controls can be considered deterministic, focus-safe and replayable.

- [x] Separate capture, admission, held state, one-shot commands and consumption.
- [x] Define focus and lifecycle generation fences.
- [x] Define repeat and duplicate policy.
- [x] Define Core Input adoption and observation requirements.
- [ ] Implement and execute focused fixtures later.

## Focus contract

```txt
game input is admissible only when:
  current route is the game route
  current game surface is active
  document visibility is visible
  event target is not editable or explicitly excluded
  focus generation matches the current generation
```

The host may use an explicitly focusable canvas/host or a route-level focus capability. Window-global listeners alone are not sufficient evidence.

## Lifecycle generation contract

```txt
open generation
  -> admit samples and held state

blur, visibility loss, pagehide, route exit or runtime disposal
  -> close current generation
  -> release held actions
  -> terminate pending edge commands
  -> publish InputClearResult
  -> reject every predecessor-generation sample

resume or refocus
  -> allocate successor generation
  -> begin with neutral held state
```

## Repeat contract

```txt
held actions:
  steer left/right
  boost
  key repeat does not create extra commands
  state changes on admitted down/up edges

one-shot actions:
  jump
  start
  retry
  repeated keydown is rejected by default
  one accepted edge produces one command result
```

## Core Input adoption contract

```txt
browser adapter
  -> map DOM sample to configured Core Input action/binding
  -> submit once with command identity and generation

Core Input
  -> own admitted held/action state
  -> publish snapshot and terminal admission result

product adapter
  -> derive product InputState from Core Input result
  -> never accept direct browser mutation
```

## Required diagnostics

```txt
current input session
current surface and focus generation
current lifecycle generation
held actions
last admitted sample and sequence
last accepted/rejected command
repeat, stale and duplicate counters
last clear result
consumer receipts
first visible input-frame acknowledgement
```

## Required fixture matrix

```txt
focus acquire/loss
editable input target
Enter repeat
Space repeat and landing
A/D/W down/up
blur then queued keydown
visibility loss and restore
pagehide/pageshow
button/keyboard parity
mid-run Enter rejection
run-over retry acceptance
source/build/Pages parity
```

## Non-claim

The contract is documentation only. Core Input remains bypassed by the active browser host.