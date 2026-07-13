# Gameplay Audit: Global Key Repeat and Mid-Run Reset Loop

**Timestamp:** `2026-07-13T03-12-30-04-00`

## Summary

The active game admits global keyboard effects without route, focus, status or repeat policy. Enter can restart an active run, and Space auto-repeat can repeatedly re-arm jump after the simulation clears the one-shot flag.

## Plan ledger

**Goal:** make gameplay one-shots edge-triggered, status-admitted and generation-bound while preserving held steering/boost semantics.

- [x] Trace Enter, Space, A/D, arrows, W, blur and button behavior.
- [x] Separate held actions from one-shot commands.
- [x] Record the active-run restart and repeat-jump paths.
- [x] Preserve the retained cross-participant run lifecycle authority.
- [ ] Implement typed gameplay input admission later.

## Current gameplay loop

```txt
keydown Enter
  -> start()
  -> replace RunState
  -> reset product InputState and simulation resolution
  -> request scene transition
  -> refresh streaming/content/camera in host

keydown Space while status=game
  -> set jump=true
  -> run system consumes jump when grounded
  -> run system sets jump=false
  -> browser repeat may set jump=true again

keydown A/D/W or arrows
  -> mutate host-local held state
  -> RAF copies held state into product InputState
  -> run system consumes steer/boost
```

## Reachable defects

### Mid-run restart

```txt
active run
  -> user presses Enter
  -> no status gate
  -> successor run starts immediately
  -> predecessor participants are reset/preserved through the existing non-atomic start path
```

### Repeat-driven restart

```txt
physical Enter held
  -> first keydown starts a run
  -> repeated keydown events call start() again
  -> runId can advance multiple times from one physical hold
```

### Repeat-driven jump re-arm

```txt
physical Space held
  -> first keydown sets jump=true
  -> simulation consumes and clears jump
  -> repeat keydown sets jump=true again
  -> later grounded tick can admit another jump
```

The exact number and timing of repeated effects depend on browser repeat cadence and frame timing.

## Required gameplay policy

```txt
steer and boost
  -> held actions
  -> generation-bound state
  -> update only through Core Input

jump, start and retry
  -> one-shot edge commands
  -> reject event.repeat unless explicitly configured
  -> validate current status and expected runId
  -> return typed accepted/rejected/duplicate/stale results
```

## Required status matrix

| Command | Menu | Game | Run over | Win |
|---|---:|---:|---:|---:|
| start | accept | reject unless explicit restart | reject or map to retry by policy | reject or map to retry by policy |
| retry | reject | reject | accept | accept |
| jump | reject | accept when grounded under simulation policy | reject | reject |
| steer/boost | neutral | accept as held state | neutral | neutral |

## Non-claim

No gameplay input, run lifecycle, simulation or visible behavior was changed.