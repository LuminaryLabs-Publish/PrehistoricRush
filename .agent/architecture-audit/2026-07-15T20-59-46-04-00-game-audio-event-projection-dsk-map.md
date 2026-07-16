# Game Audio Event Projection DSK Map

**Timestamp:** `2026-07-15T20-59-46-04-00`  
**Status:** `game-audio-event-projection-authority-audited`

## Summary

PrehistoricRush owns semantic gameplay events and renderer-neutral state, but no domain owns their projection into browser audio.

## Plan ledger

**Goal:** place audio at a clear domain boundary downstream of accepted simulation results and upstream of browser audio effects.

- [x] Map current gameplay, event, camera, presentation, and lifecycle ownership.
- [x] Preserve Core Simulation and PrehistoricRush as truth authorities.
- [x] Keep Web Audio as an effect adapter.
- [x] Define command, result, acknowledgement, and retirement boundaries.
- [ ] Implement the domain and fixtures.

## Current DSK path

```txt
Core Input
  -> PrehistoricRush run proposals
  -> Core Physics observations
  -> PrehistoricRush resolution policy
  -> committed state + semantic events
  -> Three.js / DOM projection
```

## Missing DSK path

```txt
committed state + semantic events
  -> AudioProjectionAdmissionCommand
  -> game-audio-event-projection-authority-domain
  -> cue descriptors + lifecycle decisions
  -> browser audio adapter
  -> AudioProjectionResult
  -> FirstAudibleCueAck
  -> FirstAudioVisualConvergenceAck
```

## Parent authority

`prehistoric-rush-game-audio-event-projection-authority-domain`

## Coordinating surfaces

```txt
capability and gesture admission
audio context lifecycle
semantic event identity
cue descriptor registry
run, movement, jump, landing, surface, pickup, collision, win, and ambience cues
listener and spatial-source projection
preferences and buses
cue deduplication
voice pooling and budgets
projection results and browser fixtures
```

## Ownership rule

Gameplay domains decide what happened. The audio authority decides whether and how an accepted result becomes a cue. Browser adapters only execute accepted cue descriptors and publish receipts.
