# Interaction Audit: Browser Input / Core Action Bypass Map

**Timestamp:** `2026-07-10T23-08-11-04-00`

## Configured core-input contract

The graph configures:

```txt
actions:
  jump
  boost
  start
  retry

binding:
  steer / axis
```

## Active browser interaction map

```txt
Start Rush button
  status != game -> start()
  status == game -> game.setInput({ jump: true })

Enter
  -> start()

A / ArrowLeft keydown
  -> local input.left = true

D / ArrowRight keydown
  -> local input.right = true

W / ArrowUp keydown
  -> local input.boost = true

Space
  status == game -> game.setInput({ jump: true })
  otherwise -> start()

keyup
  -> clear local directional/boost booleans

blur
  -> clear local booleans
  -> game.setInput({ steer: 0, boost: false, jump: false })

frame
  -> derive steer from left/right booleans
  -> game.setInput({ steer, boost })
```

## Bypass finding

The configured core-input actions and bindings do not appear in the active event path. Browser events mutate local variables and call the game-domain API directly.

This creates three separate representations:

```txt
core-input declared actions/bindings
browser-local input booleans
game-domain InputState resource
```

There is no correlation or readback proving these representations agree.

## Interaction result gaps

```txt
- start/retry intent is inferred from current status, not a typed command
- the same button means jump or start depending on mutable state
- Enter always calls start, including during an active run
- input actions have no IDs, timestamps, sequence numbers or admission results
- repeated keydown behavior is not explicitly normalized
- jump is consumed by the run system through direct mutation of InputState
- blur clears state without a result row
- no input snapshot appears in the public host
- no core-input service-consumption evidence exists
```

## Target adapter

```txt
BrowserInputAdapter
  capture DOM event
  -> normalize InputIntent
  -> submit to core-input capability
  -> project accepted action/axis state to PrehistoricRush command
  -> record InputResult
```

Suggested normalized intents:

```txt
run.start
run.retry
run.jump
run.boost.set
run.steer.set
input.clear
```

Suggested result fields:

```txt
inputId
source
kind
value
runId
frameId
accepted
reason
before input revision
after input revision
```

## Required proof

```txt
- core-input is either the actual authority or removed from the graph
- every browser event has one normalized intent
- every accepted intent produces at most one game-domain input mutation
- blur produces a deterministic clear result
- active-run Enter behavior is explicit
- button action and label derive from one interaction policy
- input and game-domain revisions are exposed through JSON-safe readback
```

## Next safe ledge

```txt
PrehistoricRush Core-Kit Consumption Authority
+ Kit-Graph / Thin-Adapter Fixture Gate
```

Do not add more bindings until the current core-input declaration and active browser path converge.