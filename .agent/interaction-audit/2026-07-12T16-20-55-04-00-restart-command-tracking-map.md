# Interaction Audit: Restart Command Tracking Map

**Timestamp:** `2026-07-12T16-20-55-04-00`

## Summary

Restart inputs currently dispatch directly into mutable product and host state. They do not produce a command identity, admission result, participant receipts or first-frame acknowledgement.

## Plan ledger

**Goal:** route every restart source through one command/result path and expose the same committed identity to gameplay, rendering and diagnostics.

- [x] Map browser source events to product restart mutation.
- [x] Map product reset to host content/camera refresh.
- [x] Identify missing command and result identities.
- [x] Reconcile this map with central documentation.
- [ ] Implement the command pipeline and public receipt.

## Current map

```txt
button / Space / Enter
  -> browser start()
  -> game.start()
  -> product mutation
  -> host refreshDynamicContent()
  -> host updateStreaming()
  -> host resetCamera()
  -> no shared result
```

## Required map

```txt
browser observation
  -> RunRestartCommand
  -> source/repeat/sequence normalization
  -> phase and expected-run admission
  -> reset transaction allocation
  -> participant prepare results
  -> commit or rollback result
  -> coherent public RunRestartResult
  -> first-visible-run-frame acknowledgement
```

## Required identities

```txt
commandId
sourceEventId
expectedRunId
expectedRunGeneration
resetTransactionId
nextRunId
nextRunGeneration
participantResultIds
commitFingerprint
rendererFrameId
visibleFrameAckId
```

Documentation synchronization does not satisfy any runtime interaction contract.