# Render Audit: Input Step and Visible Response Gap

**Timestamp:** `2026-07-12T05-21-52-04-00`

## Summary

Input observations mutate host or product input state before the same RAF advances simulation and renders. The renderer, HUD and public host do not identify which accepted input command or input revision produced a movement, jump, restart or camera response.

## Plan ledger

**Goal:** correlate each accepted input edge or hold revision with the simulation step and first visible frame that consumed it.

- [x] Trace input mutation before `engine.tick(dt)`.
- [x] Trace product-state mutation, camera update, Three render and HUD projection.
- [x] Confirm no input command or revision reaches frame readback.
- [x] Define required render acknowledgement fields.
- [ ] Implement and execute frame proof.

## Current visible path

```txt
keydown/button
  -> direct input mutation or start
RAF
  -> host held-state copy
  -> engine tick
  -> run movement/jump/reset state
  -> streaming and collision
  -> camera follow
  -> renderer.render(scene, camera)
  -> HUD innerHTML
  -> request next RAF
```

## Missing render evidence

```txt
input command ID in frame: absent
input revision in frame: absent
simulation step ID: absent
run-start result in camera reset: absent
jump edge result in creature pose: absent
held steering revision in camera/player frame: absent
HUD input acknowledgement: absent
first visible response receipt: absent
```

## Concrete consequences

```txt
repeated Enter can replace run state and reset camera without one visible restart receipt
repeated Space can re-arm jump without a press/release proof
button and keyboard paths can produce different semantics with no parity observation
public snapshots cannot identify whether an input was accepted, rejected, pending or consumed
screenshots cannot be correlated to the command that produced them
```

## Required frame receipt

```txt
InputVisibleFrameReceipt {
  frameId
  runtimeGeneration
  runId
  runRevision
  inputRevision
  consumedCommandIds
  simulationStepId
  playerTransformRevision
  cameraRevision
  hudRevision
  presented
}
```

## Render invariant

A command is not visibly acknowledged until one committed frame cites the input revision and simulation step that consumed it. Rejected or stale commands must never appear as accepted in HUD or public readback.

No renderer or visual output changed in this audit.