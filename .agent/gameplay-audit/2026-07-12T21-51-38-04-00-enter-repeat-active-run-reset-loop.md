# Gameplay Audit: Enter Repeat and Active-Run Reset Loop

**Timestamp:** `2026-07-12T21-51-38-04-00`

## Summary

Enter is a hidden unconditional restart control. During active gameplay or browser key repeat it can repeatedly replace run progress, increment `runId`, reset simulation resolution, emit start events, reset camera, and reprime streaming.

## Plan ledger

**Goal:** require route/status and event evidence before any start/restart command can replace gameplay state.

- [x] Trace UI, Space, and Enter paths.
- [x] Inspect domain `start()` and scene topology.
- [x] Identify repeated and active-run effects.
- [x] Define gameplay admission and result rules.
- [ ] Implement later.

## Current behavior

```txt
button during game -> Jump
Space during game -> Jump
Enter during game -> start()
held Enter -> repeated start() calls
```

Each `start()`:

```txt
creates fresh run state
increments runId
resets simulation resolution
replaces engine InputState
emits RunStarted
requests direct game transition
refreshes content
primes streaming
resets camera
```

## Gameplay consequences

```txt
active progress can be erased unintentionally
one physical key hold can create multiple run generations
multiple start events/transitions can occur
predecessor held steering/boost can enter new run
predecessor streaming/Worker state can be observed by successor
public engine access can bypass UI status policy
```

## Required gameplay policy

```txt
menu -> Start allowed
run-over -> Retry allowed
win -> Run Again allowed
game -> Start rejected unless explicit confirmed restart command exists
KeyboardEvent.repeat -> rejected
same command ID -> sealed prior result, no re-execution
```

## Required result

```txt
RunStartResult {
  commandId
  intent
  predecessorRunGeneration
  successorRunGeneration
  status
  participantReceipts
  eventId
  transitionId
  errors
}
```

## Missing fixtures

- [ ] Enter during active game.
- [ ] Held Enter repeat.
- [ ] Button/Space/Enter parity by scene.
- [ ] Multiple RunStarted/transition suppression.
- [ ] Public capability bypass.
- [ ] Progress preservation on rejected start.

## Validation boundary

Documentation only. No gameplay, input, simulation, scene, or streaming behavior changed.