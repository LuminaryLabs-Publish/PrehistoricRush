# Required Tree Assets Startup Gameplay Loop

**Timestamp:** `2026-07-18T02-39-16-04-00`

## Interaction loop

```txt
open game route
  -> preflight runtime modules
  -> prepare required tree bundle
  -> decode tree impostor images
  -> import LOD runtime
  -> construct game host
  -> spawn player and streamed world
  -> run, collide, collect, score, pause and finish
```

## Gameplay dependency

Tree fidelity is marked required before the game runtime imports. A failed required preparation therefore prevents the route, player and world loop from becoming available. That is a valid product policy, but the current route does not settle what the player can do after failure.

## Missing gameplay states

```txt
startup-failed: not product-owned
retrying-startup: absent
returning-to-menu: direct fallback absent
recovered-startup: absent
terminal-unavailable: absent
```

## Proposed settlement

```txt
failure.retryable && attemptsRemaining
  -> expose Retry
  -> start a new generation
  -> preserve no stale partial world state

failure.nonRetryable || attemptsExhausted
  -> expose Return to Menu
  -> retire partial startup resources

recovery.ready
  -> import runtime once
  -> construct one active host
  -> acknowledge first recovered gameplay frame
```

## Compatibility constraints

Do not change run tuning, route generation, tree density, LOD thresholds, collision, pickups, score, pause semantics or outcome rules. Recovery must happen before one authoritative gameplay host is admitted.