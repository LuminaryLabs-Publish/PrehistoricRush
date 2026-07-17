# Pause Input and Simulation DSK Map

**Timestamp:** `2026-07-17T10-59-32-04-00`  
**Status:** `pause-overlay-input-context-simulation-arbitration-authority-audited`

## Current composition

```txt
n:core-ui
  -> menu descriptor
n:presentation
  -> overlay descriptor
n:prehistoric-rush:pause-menu
  -> open, close, toggle, settings, exit state
browser DOM host
  -> full-screen overlay and buttons
browser input adapter
  -> global gameplay keys
n:prehistoric-rush
  -> input, simulation, route and outcome
Core Physics / Simulation
  -> unconditional frame participation
Three.js / patch controller
  -> unconditional stream update and render
```

## Current ownership split

The pause-menu DSK owns menu state and command events. It explicitly does not own engine clock, simulation, player control, physics, world streaming, animation, DOM rendering or navigation. The host renders the overlay, while the runtime independently owns keyboard input and frame advancement. No coordinating parent domain settles these participants.

## Required parent domain

`prehistoric-rush-pause-overlay-input-context-simulation-arbitration-authority-domain`

```txt
PausePolicyAdmissionResult
  -> accepted semantic mode
  -> participant list
  -> input and focus policy
  -> runtime/run/menu revisions

PauseOpenResult
  -> retired held input
  -> admitted menu context
  -> suspended participant receipts
  -> focus lease

PauseCloseResult
  -> restored participant receipts
  -> frame-clock rebase
  -> focus restoration
  -> matching resumed frame
```

## DSK rule

Do not move rendering, physics, route or input implementation into the pause-menu DSK. Add one small coordinating authority that composes existing services and publishes typed results.
