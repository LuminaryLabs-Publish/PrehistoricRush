# Pause Context Command and Result Map

**Timestamp:** `2026-07-17T10-59-32-04-00`

## Commands

```txt
PausePolicyAdmissionCommand
PauseOpenCommand
PauseInputCommand
PauseSettingsCommand
PauseExitCommand
PauseCloseCommand
```

## Results

```txt
PausePolicyAdmissionResult
PauseOpenResult
PauseInputResult
PauseSettingsResult
PauseExitResult
PauseCloseResult
FirstPausedFrameAck
FirstResumedGameplayFrameAck
```

## Admission keys

```txt
RuntimeGeneration
RunGeneration
PauseGeneration
MenuSequence
InputContextRevision
SimulationRevision
PhysicsFrameRevision
WorldStreamingRevision
FrameId
IdempotencyKey
```

## Rejection cases

```txt
stale open or close generation
duplicate command
gameplay command while true pause owns input
focus event from predecessor overlay
resume before all required participants settle
frame acknowledgement for a different pause generation
```
