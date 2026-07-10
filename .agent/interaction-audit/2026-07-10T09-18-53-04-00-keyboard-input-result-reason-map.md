# Interaction Audit: Keyboard Input Result Reason Map

**Timestamp:** `2026-07-10T09-18-53-04-00`

## Input surface

```txt
Start button click -> start()
Enter key -> start()
Space in menu -> start()
Space in game -> app.input.jump = true
A / ArrowLeft -> app.input.left = true/false
D / ArrowRight -> app.input.right = true/false
W / ArrowUp -> app.input.boost = true/false
```

## Current behavior

Input mutates flags directly. The frame loop consumes those flags and clears `jump` at the end of the frame.

There is no stable reason row for accepted, rejected, unsupported, no-op, or already-in-state input.

## Missing result rows

```txt
InputResultRow
MovementResultRow
RunnerMovedEvent
SceneDispatchResult
BestDistanceResult
PresentationFrameRecord
```

## Next interaction contract

```txt
input event
  -> normalize command
  -> InputResultRow { accepted, rejected, no_change, reason }
  -> frame movement source
  -> MovementResultRow { dx, dz, yaw, speed, jump, grounded, reason }
  -> RunnerMovedEvent if movement source changes
  -> host presentation journal readback
```

## Do not do first

```txt
control remap
camera retune
movement retune
new actions
mobile controls
```
