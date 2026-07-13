# Run Lifecycle Audit: Participant Reset and Start Result Contract

**Timestamp:** `2026-07-12T21-51-38-04-00`  
**Authority:** `prehistoric-rush-run-start-restart-admission-authority-domain`

## Summary

A run generation is broader than RunState. It includes engine input, simulation resolution, scene transition, player physics, patch/Worker work, active content, camera state, render observations, HUD, and public readback. Start currently has no manifest proving which participants reset, rebuild, or remain valid.

## Plan ledger

**Goal:** define the participant contract required for a complete and recoverable run-generation transition.

- [x] Inventory run-scoped participants.
- [x] Classify current reset and retention behavior.
- [x] Define preparation, commit, rollback, and observation records.
- [x] Define acceptance criteria.
- [ ] Implement later.

## Participant matrix

| Participant | Current start behavior | Required result |
|---|---|---|
| RunState | replaced, runId incremented | prepared/committed successor revision |
| engine InputState | replaced | input retirement and successor revision |
| host local input | retained | explicit clear/preserve policy |
| simulation resolution | reset | reset receipt |
| Core Scene | direct transition requested | admitted transition receipt |
| Rapier body/provider | retained | transform/generation reset or preserve receipt |
| colliders | retained/rebuilt through content | collider generation receipt |
| patch controller | retained and updated | reset/preserve receipt with run generation |
| Worker executor/results | retained | generation fence and stale rejection |
| active patches/content | retained then refreshed | content reset/preserve receipt |
| instance batches | retained | batch generation receipt |
| camera follower | reset after start | camera reset receipt under barrier |
| Three renderer/resources | retained | render preserve receipt |
| HUD/public host | next-frame readback | projection and first-frame receipt |

## Required lifecycle phases

```txt
IDLE/TERMINAL
  -> START_PREPARING
  -> START_COMMITTED
  -> RUNNING

START_PREPARING
  -> START_ROLLING_BACK
  -> predecessor restored or indeterminate result
```

## Required records

```txt
RunStartCommand
RunParticipantManifest
RunParticipantPlan
RunParticipantReceipt
RunStartCommitResult
RunStartRollbackResult
RunGenerationObservation
RunStartJournalRow
FirstRunGenerationFrameAck
```

## Required preparation order

```txt
close predecessor input and async admission
  -> freeze participant revisions
  -> prepare state/input/simulation/scene
  -> fence Worker and patch deliveries
  -> prepare physics/content/camera/render participants
  -> validate complete manifest
  -> commit successor generation
  -> publish event/transition
  -> reopen successor input and async admission
```

## Required rollback order

```txt
close candidate admission
  -> cancel candidate async work
  -> undo candidate content/physics/camera changes
  -> restore predecessor state/input/simulation/scene
  -> publish truthful rollback or indeterminate result
```

## Acceptance criteria

- [ ] Every participant appears in the manifest.
- [ ] Every participant emits reset, rebuild, preserve, reject, or rollback status.
- [ ] No predecessor Worker/input event enters successor generation.
- [ ] Duplicate command returns the sealed result.
- [ ] Failed preparation does not silently leave mixed generations.
- [ ] One committed result emits one RunStarted event and transition.
- [ ] First visible frame cites all required participant generations.

## Validation boundary

Contract documentation only. No runtime lifecycle, participant, or rendering implementation changed.