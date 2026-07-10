# Interaction audit: keyboard input frame result map

Timestamp: `2026-07-10T14-59-00-04-00`

## Inputs in use

```txt
Start button: start run
Enter: start run
Space: start run or jump
A / ArrowLeft: turn left flag
D / ArrowRight: turn right flag
W / ArrowUp: boost flag
keyup: clears turn and boost flags
```

## Current issue

Input handlers mutate `app.input` and `app.scene` directly. The frame loop consumes flags, but no row explains which input state was accepted, ignored, rejected, or converted into movement.

## Required input row

```txt
InputResultRow {
  frameId
  inputSource
  inputType
  sceneBefore
  accepted
  reason
  inputSnapshot
}
```

## Important rejection/no-op rows

```txt
Space starts game from menu
Space jumps while grounded
Space is no-op/rejected while airborne
turn flags clear on keyup
boost affects target speed only in game scene
input in run-over/win should not advance movement
```

## Fixture gate

The DOM-free fixture should be able to feed input snapshots and read accepted/rejected rows without a browser.