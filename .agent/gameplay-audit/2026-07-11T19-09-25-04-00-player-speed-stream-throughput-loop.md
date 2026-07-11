# Gameplay Audit: Player Speed and Stream Throughput Loop

**Timestamp:** `2026-07-11T19-09-25-04-00`

## Summary

Player travel is integrated from seconds while patch generation and activation are admitted from RAF counts. World readiness per meter therefore changes with refresh rate and frame throttling.

## Plan ledger

**Goal:** require movement policy and stream capacity to consume one elapsed-time and cadence revision.

- [x] Trace movement delta and speed integration.
- [x] Trace stream request and activation budgets.
- [x] Compare throughput per wall-clock second.
- [x] Identify low-refresh and throttled-frame consequences.
- [ ] Implement cadence-aware movement/readiness fixtures.

## Current loop

```txt
input
  -> engine.tick(dt)
  -> speed and movement integrate from dt
  -> distance increases in meters
  -> stream focus follows moved player
  -> fixed work count admitted for this RAF
  -> physics, collision, pickups and render
```

## Throughput relationship

Assuming equal player speed:

```txt
stream activations per meter
  = refresh frames per second * 1 activation per frame / meters per second
```

At 20 m/s:

```txt
30 Hz  -> maximum 1.5 activations per meter
60 Hz  -> maximum 3.0 activations per meter
120 Hz -> maximum 6.0 activations per meter
```

The controller may have fewer ready patches, but the admission ceiling itself is cadence dependent.

## Low-frame behavior

```txt
wall delta > 0.05 seconds
  -> simulation consumes only 0.05 seconds
  -> discarded wall time is not reported
  -> one stream pump still occurs
  -> one ready activation still occurs
```

This changes the relationship between real time, gameplay time, Worker completion and visible world preparation.

## Gameplay consequences

```txt
low-refresh clients can approach the readiness frontier with less stream work per meter
high-refresh clients can drain ready queues faster
hidden-tab resume can reveal patches over several frames while movement resumes
speed cap/defer policy cannot explain whether pressure came from content latency or cadence throttling
outcome, pickup and collision evidence has no cadence revision
```

## Required gameplay result

```txt
MovementCadenceResult {
  runSessionId
  frameId
  cadenceRevision
  wallDelta
  simulationDelta
  movementDistance
  requiredPatchIds
  streamBudgetSpent
  readinessClassification
  movementPolicy
}
```

## Acceptance gate

```txt
equal wall time and equal inputs produce equivalent route progress at 30/60/120 Hz
required-route readiness remains within declared tolerance per meter
throttled frames produce typed time-drop or bounded catch-up results
movement does not resume after visibility restore before world and frame acknowledgement
```