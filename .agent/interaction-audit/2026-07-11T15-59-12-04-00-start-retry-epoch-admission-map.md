# Start / Retry Epoch Admission Map

**Timestamp:** `2026-07-11T15-59-12-04-00`

## Summary

The UI button, Enter and Space all call the same untyped `start()` path whenever the product is not in `game` status. There is no command ID, expected predecessor identity, lifecycle admission, duplicate policy or result projection.

## Current map

```txt
button / Enter / Space
  -> start()
  -> game.start()
  -> updateStreaming(..., true)
  -> resetCamera()
  -> return no product result
```

## Missing admission

```txt
commandId
reason
expected runtimeSessionId
expected predecessor runSessionId
allowed lifecycle state
duplicate command cache
reset-in-progress exclusion
consumer readiness
rollback result
first-frame acknowledgement
```

## Required map

```txt
input binding
  -> ResetRunCommand
  -> capability/lifecycle admission
  -> duplicate and stale-predecessor check
  -> build ResetRunPlan
  -> prepare all consumers
  -> commit or roll back
  -> ResetRunResult
  -> button/HUD result projection
  -> first committed-frame acknowledgement
```

## Interaction rules

- Repeated Enter/Space during reset must return the same idempotent result or a typed in-progress rejection.
- Jump must not be admitted until the new run is committed.
- Browser input booleans must be neutralized before frame admission resumes.
- Stale controls from a revoked host lease must not mutate the new run.
