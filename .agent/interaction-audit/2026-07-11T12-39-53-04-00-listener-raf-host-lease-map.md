# Interaction Audit: Listener, RAF and Host Lease Map

**Timestamp:** `2026-07-11T12-39-53-04-00`

## Summary

Browser callbacks and the public host are installed as permanent process-global access paths. They are not tied to a session lease, lifecycle state or revocation result, so old callbacks and external references can continue mutating live owners until the document is destroyed.

## Plan ledger

**Goal:** route every browser and public-host interaction through revocable session-scoped admission.

- [x] Inventory callbacks and global exposure.
- [x] Map current mutation paths.
- [x] Define leases and retirement order.
- [ ] Add typed admission and post-dispose rejection fixtures.

## Current callback map

```txt
button.onclick
  active game -> jump input
  terminal/not-started -> retry/start

window keydown
  prevent defaults
  Enter -> start
  A/D/left/right -> input latches
  W/up -> boost latch
  Space -> jump or start

window keyup
  clear movement latches

window blur
  clear latches and game input

window resize
  mutate camera projection and renderer size

RAF loop
  mutate game, streaming, physics, render and HUD

globalThis.PrehistoricRushHost
  expose engine, physics, adapter, controller and camera owner references
```

## Missing admission

```txt
callback session ID: absent
callback generation: absent
lifecycle phase check: absent
command ID/sequence: absent
listener removal handle: absent
RAF cancellation handle: absent
host capability lease: absent
host revocation: absent
post-dispose rejection: absent
```

## Required lease model

```txt
RuntimeInteractionLease
  runtimeSessionId
  generation
  phase
  active
  acquiredAtSequence
  retiredAtSequence
```

Every callback closes over the lease rather than raw owners. Admission rejects callbacks when the lease is inactive, generation is stale or phase is not allowed.

## Retirement order

```txt
set lifecycle phase STOPPING
  -> reject new start/retry/input commands
  -> cancel RAF lease
  -> retire button and window listener leases
  -> revoke public host command lease
  -> wait for active callback count to reach zero
  -> dispose Worker/physics/render resources
  -> remove detached observation global or mark DISPOSED
```

## Host contract

The public host should expose only detached observations and typed commands. Raw engine, physics, adapter, patch controller and camera references must not remain usable after revocation.

```txt
PrehistoricRushHost
  getObservation()
  start(command)
  retry(command)
  stop(command)
  dispose(command)
```

Each command returns accepted, rejected, stale, duplicate or disposed results carrying runtime/run/stream identity.

## Fixture matrix

```txt
keydown after STOPPING
resize after renderer disposal
RAF callback racing disposal
external host reference retained across dispose
repeated stop/dispose
old session callback after new session starts
```
