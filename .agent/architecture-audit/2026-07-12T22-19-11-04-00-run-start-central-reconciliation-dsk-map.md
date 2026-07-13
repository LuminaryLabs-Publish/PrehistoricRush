# Architecture Audit: Run Start/Restart Central Reconciliation DSK Map

**Timestamp:** `2026-07-12T22-19-11-04-00`  
**Parent domain:** `prehistoric-rush-run-start-restart-admission-authority-domain`

## Summary

Run start crosses browser input, Core Scene, product state, Core Simulation, Rapier, patch streaming, Worker execution, active content, camera, Three rendering, HUD, and public observations. None of those participants should be absorbed into one monolith. The parent domain should own command admission, successor-generation coordination, participant receipts, atomic commit or truthful rollback, and first-frame correlation.

## Plan ledger

**Goal:** reconcile the local architecture map with central tracking while preserving bounded domain ownership.

- [x] Identify all start ingress paths.
- [x] Separate admission authority from participant mechanics.
- [x] Identify reset, rebuild, preserve, rollback, and observation responsibilities.
- [x] Define the candidate composition and participant receipts.
- [x] Define exactly-once and first-frame invariants.
- [ ] Implement later.

## Ownership boundary

```txt
parent owns:
  Start/Retry/Run Again command identity and sequence
  browser/runtime session and expected run generation
  scene/status/repeat/duplicate/stale admission
  predecessor input and async-delivery closure
  participant preparation barrier
  reset/rebuild/preserve manifest
  atomic RunStartResult or rollback classification
  exactly-once RunStarted and scene transition publication
  start journal and first visible successor-frame acknowledgement

participants retain:
  Core Scene topology and transition implementation
  simulation resolution policy
  Rapier body/collider implementation
  patch generation and controller internals
  Worker transport and generation implementation
  content materialization and instancing
  camera interpolation
  Three.js drawing and HUD formatting
```

## Candidate composition

```txt
run-start-command-id-kit
run-start-command-sequence-kit
run-start-intent-kit
run-start-session-admission-kit
run-start-scene-status-admission-kit
run-start-key-repeat-rejection-kit
run-start-duplicate-stale-rejection-kit
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
run-hud-observation-plan-kit
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
ActiveContentResetOrPreserveReceipt
CameraResetReceipt
RenderResetOrPreserveReceipt
HudObservationReceipt
PublicReadbackReceipt
```

## Required invariants

```txt
one command ID commits at most one successor run generation
repeat, duplicate, stale, and disallowed active-run commands cause zero effects
predecessor input and asynchronous delivery admission closes before commit
all retained participants explicitly cite the successor generation
failed preparation preserves the predecessor or reports indeterminate state truthfully
one committed start emits one RunStarted event and one scene transition
first visible frame cites the accepted RunStartResult and complete participant manifest
```

## Validation boundary

Architecture documentation only. No runtime kit, participant, test, or deployment implementation changed.