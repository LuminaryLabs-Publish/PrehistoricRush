# Interaction audit: input and scene command authority map

Timestamp: `2026-07-10T16-28-47-04-00`

## Inputs

```txt
button click
Enter
Space
A / ArrowLeft
D / ArrowRight
W / ArrowUp
keyup
resize
```

## Current command behavior

| Input | Current effect | Missing result |
|---|---|---|
| Start button | direct `scene = game` | start result/session id |
| Enter | direct start | accepted/rejected reason |
| Space in menu | direct start | start result |
| Space in game | sets jump flag | jump accepted/no-op result |
| Space in terminal scene | direct `scene = game` | restart transaction |
| A/Left | sets left flag | input snapshot/frame id |
| D/Right | sets right flag | input snapshot/frame id |
| W/Up | sets boost flag | input snapshot/frame id |
| keyup | clears flags | release result/frame id |

## Authority issue

Input flags are sampled by the primary live loop, while the secondary presentation loop reads the resulting mutable state at an unrelated time. There is no immutable input snapshot for a source frame.

## Required command rows

```txt
InputCommand
InputStateSnapshot
JumpCommandResult
SceneTransitionCommand
SceneTransitionResult
RestartCommand
RestartTransaction
```

Every row should carry `sessionId`, `sourceFrameId`, and a stable reason code.
