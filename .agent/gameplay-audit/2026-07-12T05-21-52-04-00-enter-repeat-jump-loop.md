# Gameplay Audit: Enter, Repeat and Jump Loop

**Timestamp:** `2026-07-12T05-21-52-04-00`

## Summary

The active keyboard policy permits Enter to start a new run in every phase and does not reject browser key repeat. Space is treated as a direct jump pulse during gameplay and as start outside gameplay, so repeated keydown delivery can synthesize additional jump pulses or repeated starts without a new physical press.

## Plan ledger

**Goal:** define phase-safe start/restart and one-press/one-edge jump behavior while preserving held steering and boost semantics.

- [x] Trace Enter, Space, button, keyup and RAF behavior.
- [x] Confirm active-run Enter replacement.
- [x] Confirm repeat is not inspected.
- [x] Confirm simulation clears jump after consumption.
- [x] Derive gameplay fixtures.
- [ ] Implement command admission and edge state.

## Current gameplay sequence

```txt
Enter keydown
  -> start()
  -> increment runId
  -> replace RunState
  -> replace InputState
  -> emit RunStarted
  -> transition to game
  -> prime streaming
  -> reset camera

Space keydown during game
  -> setInput({ jump: true })
  -> next engine tick consumes jump when grounded
  -> product system clears input.jump
  -> later browser repeat may set jump true again

A/D or arrows and W
  -> mutate host held flags
  -> RAF copies flags into product InputState
```

## Gameplay defects

```txt
active-run Enter guard: absent
explicit restart action: absent
keydown repeat guard: absent
press/release edge state: absent
start command idempotency: absent
jump command idempotency: absent
input/run revision admission: absent
```

## Failure examples

### Active-run replacement

A player can press Enter during an active run and silently replace the run with a new `runId`, zero distance, zero shards and reset movement state.

### Repeated start

A held Enter can produce multiple `keydown` events, causing repeated run replacement, repeated `RunStarted` events, repeated stream priming and repeated camera reset.

### Auto-hop

A held Space can produce a repeat after the simulation has cleared the prior jump pulse. When the player becomes grounded, a later repeat can create another jump without key release.

## Required policy

```txt
Enter in menu/run-over/win: StartRun or RetryRun edge
Enter in active game: reject, unless explicit restart chord/policy is enabled
Space in active game: Jump edge on physical press transition only
Space outside active game: one StartRun edge
A/D/arrows/W: held state with explicit release and retirement
browser repeat: never creates a new edge command
```

## Required fixtures

```txt
Enter during active game does not replace run
held Enter emits one accepted start result
held Space emits one jump edge until release
Space release then press emits a second edge
button and keyboard start produce equivalent results
blur and visibility loss retire held controls
reset rejects predecessor-run input commands
```

No gameplay behavior changed in this audit.