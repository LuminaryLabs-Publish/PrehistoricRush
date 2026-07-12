# Gameplay Audit: Restart Outside the Authoritative Tick

**Generated:** `2026-07-12T09-01-44-04-00`

## Summary

Terminal step resolution is authoritative, but restart is not. Button, Enter and Space terminal actions call `game.start()` directly, then the host resets content, streaming and camera outside `TickContext`.

## Current loop

```txt
terminal state
  -> user action
  -> game.start direct resource mutation/event/transition
  -> host content refresh
  -> host stream update/prime
  -> host camera reset
  -> next RAF tick
```

## Failure classes

```txt
duplicate browser start events can create multiple run IDs
participant failure has no rollback
predecessor Worker/stream results have no new-run rejection token
physics body remains on predecessor frame until next tick motion request
public observation can see new run with old committed evidence
initial boot and retry are not proven equivalent
```

## Required gameplay invariant

One accepted command creates one run epoch. Every required participant either commits that epoch or the transaction fails without publishing a partial new run. Input is not admitted until the start result is committed.
