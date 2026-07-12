# Gameplay Audit: Simulation and Surface Frame Acknowledgement

**Timestamp:** `2026-07-12T02-21-55-04-00`

## Loop

```txt
resize observation
  -> direct camera/renderer mutation

next RAF
  -> input
  -> engine tick
  -> patch streaming
  -> collision and pickup processing
  -> camera update
  -> render
  -> HUD projection
```

Simulation does not receive a surface commit result and the rendered frame does not acknowledge which size, DPR or camera projection revision it used.

## Gap

```txt
no surface-ready gate for renderer construction
no surface revision on the gameplay frame
no post-resize frame acknowledgement
no correlation between HUD state and physical render size
no public proof that the latest simulation state was visibly presented through the latest surface revision
```

This is an observability and transaction gap. It does not prove that ordinary gameplay is visually incorrect.

## Required invariant

```txt
A committed gameplay frame cites:
  runId
  simulation/frame identity
  camera revision
  surfaceId
  surface revision
  actual physical dimensions
  sourceGraphFingerprint
```

## Required fixtures

```txt
resize during active run
resize during jump
resize during patch activation
rapid resize coalescing
DPR change during active run
first visible frame after each accepted surface revision
```