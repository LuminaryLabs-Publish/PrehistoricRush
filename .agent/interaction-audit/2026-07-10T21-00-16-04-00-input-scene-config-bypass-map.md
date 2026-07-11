# Interaction Audit: Input and Scene Configuration Bypass Map

**Timestamp:** `2026-07-10T21-00-16-04-00`

## Input paths

```txt
button click
  game -> jump
  non-game -> start()

Enter
  -> start()

A / ArrowLeft
  -> input.left

D / ArrowRight
  -> input.right

W / ArrowUp
  -> input.boost

Space
  game -> input.jump
  non-game -> start()

blur
  -> clear input flags
```

## Bypass

Input handlers call `start()` or mutate input flags directly. They do not produce command envelopes, transition requests, or source-linked results.

`start()` bypasses the declared transition map and performs a partial reset inline. Contact and goal checks also write terminal scene strings directly.

## Missing interaction rows

```txt
inputId
inputOrigin
inputType
sceneBefore
transitionRequested
transitionSource
transitionAccepted
sceneAfter
restartGeneration
tuningFingerprint
frameId
```

## Consequences

```txt
button and keyboard starts cannot be compared
declared transitions cannot be proven active
rejected or duplicate start commands cannot be represented
restart scope is implicit
input cannot be correlated with a resolved runtime source fingerprint
```

## Safe implementation boundary

Do not replace controls. Wrap the existing paths with a small command/result adapter after source-contract reconciliation:

```txt
RunnerCommand
SceneTransitionRequest
SceneTransitionResult
RestartResult
InputObservation
```

The adapter should use the same scene/tuning source fingerprint exposed by the runtime host.
