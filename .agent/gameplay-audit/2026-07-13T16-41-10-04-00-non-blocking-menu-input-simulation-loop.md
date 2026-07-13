# Non-Blocking Menu Input and Simulation Loop

**Timestamp:** `2026-07-13T16-41-10-04-00`

## Summary

The pause menu explicitly does not block simulation. That is a valid product choice, but the current browser host leaves gameplay keyboard state and commands active while the overlay captures pointer input, without an authored policy describing which gameplay inputs remain admitted.

## Plan ledger

**Goal:** preserve uninterrupted running while preventing accidental or ambiguous gameplay commands during menu interaction.

- [x] Confirm `blocksSimulation: false` in both menu and overlay descriptors.
- [x] Confirm `engine.tick(dt)` remains unconditional.
- [x] Confirm gameplay keydown/keyup listeners remain installed.
- [x] Confirm the overlay captures pointer input.
- [ ] Define a revisioned non-blocking input policy.
- [ ] Classify Escape, menu clicks, steering, boost, jump and restart while open.
- [ ] Clear or retain held gameplay inputs deterministically on open/close.
- [ ] Correlate input-policy revision with menu and run generations.
- [ ] Add focus, repeat, blur and rapid-toggle fixtures.

## Current loop

```txt
browser keys
  -> gameplay listener mutates left/right/boost or jump
  -> Escape listener separately toggles pause state

runtime RAF
  -> project held gameplay state into game input
  -> engine.tick(dt)
  -> resolve movement, physics, pickups and outcome
  -> stream patches
  -> render world and creature

pause overlay open
  -> overlay receives pointer input
  -> keyboard gameplay admission remains unchanged
  -> no policy receipt identifies intended retained commands
```

## Required policy

```txt
NonBlockingPauseInputPolicy
  menuGeneration
  runGeneration
  allowSteer
  allowBoost
  allowJump
  allowRestart
  clearHeldOnOpen
  clearHeldOnClose
  escapeRepeatPolicy
  focusLossPolicy
  revision
```

## Recommended default

Continue simulation, camera, physics, streaming and rendering. Admit Escape and menu controls. Suppress new gameplay command edges while the overlay is open, clear held steering/boost at the accepted open boundary, and require an explicit product configuration to retain any gameplay action. The final choice belongs to PrehistoricRush, not Core UI or Core Presentation.

## Non-claim

The current source proves non-blocking simulation. It does not prove that retained keyboard behavior is intentional, deterministic across focus changes or correlated with the visible menu revision.