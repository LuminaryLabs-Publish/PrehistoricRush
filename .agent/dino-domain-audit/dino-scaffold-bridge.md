# PrehistoricRush Dino Domain Scaffold Bridge

**Updated:** `2026-07-08T03:01:20-04:00`

## Current scaffold

`src/game.js` installs three dino domain kits before loading the legacy visual runtime:

```txt
createDinoFormDomainKit({ entityId: "dino" })
createDinoPoseDomainKit({ entityId: "dino" })
createDinoMaterialDomainKit({ entityId: "dino" })
```

It then exposes:

```txt
globalThis.PrehistoricRushComposition.snapshot()
```

## Current bridge gap

The dino pose domain is structurally ready to receive movement facts, but the live visual runner does not yet emit the movement event the scaffold needs.

Known missing event:

```txt
runner.moved
```

Expected output:

```txt
dino.pose.changed
```

## Target bridge

```txt
legacy movement step
  -> RunnerStepResult
  -> eventBus.emit("runner.moved", movement payload)
  -> dino-pose-domain-kit updates pose descriptor
  -> eventBus.emit("dino.pose.changed", pose descriptor)
  -> raptor visual rig consumes descriptor
  -> host diagnostics exposes bridge proof
```

## Required movement payload

```txt
entityId
scene
lane
speed
forwardDistance
lateralOffset
verticalOffset
grounded
jumping
boosting
lean
yaw
velocity
inputFrameId
tick
```

## First proof fixture

```txt
Given an accepted jump ActionFrame in game scene
When RunnerStepResult is produced
Then runner.moved is emitted
And dino-pose-domain-kit updates pose state
And dino.pose.changed is emitted
And PrehistoricRushComposition.snapshot() includes the updated dino pose domain state
```

## Boundary rule

Do not make dino domain kits depend on Three.js, Rapier, DOM, keyboard listeners, or renderer frame objects.

The dino domain should own descriptor state only.
