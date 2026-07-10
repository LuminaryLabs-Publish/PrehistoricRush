# Interaction Audit: Input Listener and Command Lifetime Map

Timestamp: `2026-07-10T18-01-03-04-00`

## Current inputs

```txt
button click
Enter
Space
A / Left Arrow
D / Right Arrow
W / Up Arrow
keyup for steering and boost
resize
```

## Current routing

```txt
click / Enter / Space outside game
  -> start()
  -> app.scene = game

A / Left Arrow
  -> app.input.left = true/false

D / Right Arrow
  -> app.input.right = true/false

W / Up Arrow
  -> app.input.boost = true/false

Space in game
  -> app.input.jump = true
  -> primary frame consumes and clears it
```

## Gaps

```txt
no input command IDs
no input origin row
no accepted/rejected/no-op result
no per-frame frozen input snapshot
no scene-transition command result
no retry/run-again distinction after both map to start()
no retained listener handles
no removeEventListener path
no input reset during restart
no proof that remount creates only one listener set
```

The button listener is attached to a newly created element and disappears with that element, but the global keyboard and resize listeners persist. Re-import or remount would add another listener set and cause duplicate input mutation and resize work.

## Required command map

```txt
InputCommand
  commandId
  origin: button | keyboard
  kind: start | turn_left | turn_right | boost | jump | retry | run_again | menu
  phase
  sessionId

InputResult
  commandId
  accepted
  reason
  sourceFrameId
  stateChanged
```

## Required listener ownership

```txt
ListenerRegistry.add(target, type, handler, options)
ListenerRegistry.disposeAll()
ListenerRegistry.snapshot()
```

Snapshot fields:

```txt
registered
removed
active
byType
disposed
```

## Fixture assertions

```txt
one mount creates one keyboard listener set and one resize listener
input command is consumed once per source frame
restart clears transient input flags
first dispose removes every active listener
second dispose changes nothing
remount returns to one active listener set
button and keyboard restart paths produce distinct origin with equivalent result
```