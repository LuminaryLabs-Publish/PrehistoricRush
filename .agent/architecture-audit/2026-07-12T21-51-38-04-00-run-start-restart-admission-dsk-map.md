# Architecture Audit: Run Start and Restart Admission DSK Map

**Timestamp:** `2026-07-12T21-51-38-04-00`  
**Parent domain:** `prehistoric-rush-run-start-restart-admission-authority-domain`

## Summary

Run start currently spans browser input, Core Scene, product state, simulation resolution, physics, streaming, Worker execution, active content, camera, renderer, and HUD without one coordinator. The parent domain should own command admission and participant commit while leaving each participant's internal mechanics in its existing kit.

## Plan ledger

**Goal:** define a DSK composition that creates one complete successor run generation or preserves the predecessor.

- [x] Map input, scene, simulation, physics, streaming, Worker, camera, and render participants.
- [x] Separate command admission from participant implementation.
- [x] Define reset, rebuild, preserve, rollback, and frame-proof contracts.
- [x] Define candidate kits and invariants.
- [ ] Implement later.

## Ownership boundary

```txt
owns:
  Start/Retry/Run Again command identity and sequence
  scene/status/repeat/duplicate/stale admission
  run generation
  predecessor admission closure
  participant preparation barrier
  reset/rebuild/preserve classification
  atomic commit/rollback result
  RunStarted/transition exactly-once publication
  start journal and first visible run frame

does not own:
  simulation rules
  Rapier implementation
  patch generation semantics
  Worker transport internals
  camera interpolation
  Three.js drawing
```

## Candidate kits

```txt
run-start-command-id-kit
run-start-command-sequence-kit
run-start-intent-kit
run-start-scene-status-admission-kit
run-start-key-repeat-rejection-kit
run-start-duplicate-rejection-kit
run-start-stale-rejection-kit
run-generation-kit
run-predecessor-freeze-kit
run-input-retirement-kit
run-simulation-reset-plan-kit
run-scene-transition-plan-kit
run-physics-reset-plan-kit
run-patch-stream-reset-plan-kit
run-worker-generation-fence-kit
run-active-content-reset-plan-kit
run-camera-reset-plan-kit
run-render-reset-plan-kit
run-participant-barrier-kit
run-participant-receipt-kit
run-start-commit-result-kit
run-start-rollback-result-kit
run-start-journal-kit
first-run-generation-frame-ack-kit
```

## Required participant receipts

```txt
BrowserInputRetirementReceipt
RunStatePreparationReceipt
SimulationResetReceipt
SceneTransitionPreparationReceipt
PhysicsResetReceipt
PatchControllerResetOrPreserveReceipt
WorkerGenerationFenceReceipt
ActiveContentResetReceipt
CameraResetReceipt
RenderResetOrPreserveReceipt
HudProjectionReceipt
```

## Required invariants

```txt
one command ID commits at most one run generation
no active-run restart unless explicit policy admits it
repeat/duplicate/stale commands cause zero effects
all predecessor input and async delivery admission closes before commit
all retained participants explicitly cite successor generation
failed preparation publishes rollback or indeterminate state truthfully
one committed start emits one RunStarted and one transition
first visible frame cites the committed run and participant receipts
```

## Required transaction

```txt
RunStartCommand
  -> admit session/scene/status/event/command/predecessor
  -> close predecessor input and async admission
  -> prepare participant reset/rebuild/preserve plans
  -> validate complete candidate generation
  -> recheck predecessor and leases
  -> atomically commit or preserve predecessor
  -> publish receipts, result, event, and transition
  -> acknowledge first visible frame
```

## Validation boundary

Architecture documentation only. No DSK, runtime, participant, or deployment implementation changed.