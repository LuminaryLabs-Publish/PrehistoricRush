# Interaction Audit: Input to Population Generation Map

**Timestamp:** `2026-07-10T19-30-36-04-00`

## Input path

```txt
button / Enter / Space
  -> start or jump flag
A / D / arrows
  -> turn flags
W / ArrowUp
  -> boost flag
RAF
  -> movement
  -> terrain chunk key
  -> terrain rebuild
  -> population rebuild
  -> collider and pickup replacement
  -> interaction result
```

## Current correlation gap

The runtime has no stable IDs connecting:

```txt
input frame
movement frame
terrain chunk key
population generation
instance-pool commit
collider replacement
pickup replacement
contact or collection result
```

A user-visible collision or pickup can be observed only as aggregate state mutation. The host cannot state which population generation produced the source object, whether its render instance was admitted, or whether a capacity decision removed one side of the visual/gameplay pair.

## Required interaction rows

```txt
InputFrame
MovementFrame
TerrainWindowRequest
PopulationGenerationResult
InstancePoolCommitResult
ColliderCommitResult
PickupCommitResult
ContactResult
CollectionResult
```

Each row should retain `sourceFrameId`, `windowKey`, `generationId`, and stable object IDs where applicable.

## Immediate scope

The next cut does not need a general event bus rewrite. It needs detached result rows around the current `populate()` and interaction boundaries so dense-window and restart fixtures can prove correlation.