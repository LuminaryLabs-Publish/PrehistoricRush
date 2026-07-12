# Public Host Isolation Fixture Gate

**Timestamp:** `2026-07-11T22-29-24-04-00`

## Required pure fixtures

```txt
public API contains no raw engine reference
public API contains no physics or Rapier reference
public API contains no Three scene, renderer, camera or Object3D reference
public API contains no patch-controller, executor or Worker reference
public API contains no mutable camera-follow service
committed read model is deeply detached and immutable
unsupported command causes zero owner mutation
stale run/epoch command causes zero owner mutation
duplicate command returns the prior stable result
```

## Required browser fixture

```txt
open game.html
wait for first committed frame
inspect every enumerable public-host property and returned value
attempt representative engine, stream, collider, camera and render bypasses
assert no raw owner is reachable
submit one supported typed command
assert admission result identifies run and epochs
assert committed state changes only through a later correlated frame
```

## Required coherence fixture

The read model must report one shared correlation set:

```txt
runSessionId
runEpoch
streamEpoch
workerGeneration
colliderEpoch
frameEpoch
committedFrameId
```

Gameplay, patch, camera, render and HUD evidence must reference that set. Independent live sampling does not pass.

## Deployment rule

Pages validation must reject builds that expose raw mutable runtime owners through `globalThis.PrehistoricRushHost`. A diagnostics host is not acceptable when it can mutate production state outside admitted commands.

## Current status

```txt
raw owners exposed: yes
committed read model: no
typed host command gateway: no
capability descriptor: no
host epoch fence: no
mutation-isolation fixture: no
browser host smoke: no
```

No host isolation, command safety, read-model coherence or deployment-readiness claim is made.