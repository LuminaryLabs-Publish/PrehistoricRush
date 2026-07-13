# PrehistoricRush Current Audit

**Timestamp:** `2026-07-13T16-41-10-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Runtime revision reviewed:** `66a219fea4bb886fb4fff41c9b31c67ba7e4eaee`  
**Status:** `non-blocking-pause-menu-command-lifecycle-authority-central-reconciled`  
**Technical status:** `non-blocking-pause-menu-command-lifecycle-authority-audited`

## Summary

PrehistoricRush now includes a product pause-menu child DSK with bounded state, commands, events, snapshot/reset and renderer-neutral Core UI/Core Presentation descriptors. The authored policy keeps simulation running while the overlay is open.

The current gap is the browser boundary. The public entry polls for runtime readiness, installs an Escape listener, starts a perpetual menu synchronization RAF, owns overlay DOM and navigates immediately after an exit request. Those participants have no shared identity, typed terminal results, visible-frame acknowledgement or retirement receipt.

## Plan ledger

**Goal:** retain non-blocking gameplay while unifying menu command admission, overlay projection, input policy, exit settlement and host retirement.

- [x] Reconcile the full Publish inventory and central ledger.
- [x] Select only PrehistoricRush because it had two newer commits.
- [x] Inspect the DSK, Core Presentation graph, host, runtime, test and package wiring.
- [x] Identify the complete interaction loop and all domains.
- [x] Update the inventory to 58 implemented surfaces.
- [x] Define the pause-menu command lifecycle authority.
- [x] Add the timestamped audit family and refresh root projections.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Implement and execute lifecycle/input/navigation/visible-frame fixtures later.

## Interaction loop

```txt
runtime boot
  -> Core Presentation and product pause DSK install
  -> run, streaming and render loop start
  -> public entry polls until PrehistoricRushHost exists
  -> Escape listener and menu sync RAF install

Escape
  -> pauseMenu.toggle
  -> semantic sequence changes
  -> host recreates or removes overlay
  -> gameplay simulation and rendering continue

Settings
  -> semantic view becomes settings
  -> overlay is rebuilt

Exit
  -> selectedAction becomes exit
  -> one exit event emits
  -> location.href changes immediately
```

## Domains in use

```txt
browser boot, provider admission, fatal projection, DOM, resize and RAF
browser gameplay and menu input admission
Core Input, Spatial, Scene, Creature, Character, Player, Physics, Simulation and Motion
articulated dynamics and articulated motion
Core Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
Core Presentation composition, output, UI scale and camera framing
product run, route, score, outcome, player pose and terrain IK
product pause-menu semantic state, commands, descriptors, events and snapshots
profile schema/persistence and player-character composition
Rapier, patch Worker, terrain, vegetation, pickups and collisions
Three.js world/creature/camera and DOM overlay presentation
exit navigation, host retirement, validation, build and Pages deployment
```

## Implemented state

```txt
Core Presentation installed: yes
product pause-menu child DSK installed: yes
Core UI menu descriptor: yes
Core Presentation overlay policy: yes
menu and overlay blocksSimulation false: yes
clone-safe state and snapshot: yes
open/close/toggle/settings/exit/reset commands: yes
duplicate exit event suppression: yes
Escape and clicks delegate to DSK: yes
simulation ticking remains unconditional: yes
pause test wired into npm test: yes
```

## Current gaps

```txt
PauseMenuCommandId and generation: absent
expected semantic sequence: absent
typed duplicate/stale/failed/retired command result: absent
browser host identity/generation: absent
bounded cancellable attach poll: absent
sync RAF retirement: absent
Escape listener retirement: absent
overlay projection result/fingerprint: absent
first matching visible overlay frame ack: absent
explicit gameplay-input policy while open: absent
exit event consumer and settlement: absent
runtime/Worker/render cleanup before navigation: absent
exactly-once navigation result: absent
browser/build/Pages fixtures: absent
```

## Required authority

```txt
prehistoric-rush-pause-menu-command-lifecycle-authority-domain
```

```txt
PauseMenuCommand
  -> bind runtime, menu, overlay and host generations
  -> validate command identity and expected sequence
  -> publish accepted or typed non-accepted result
  -> project one matching overlay revision
  -> apply explicit retained-gameplay-input policy
  -> acknowledge the first matching frame

accepted exit
  -> retire all browser-host and runtime participants
  -> collect bounded receipts
  -> publish ExitSettlementResult
  -> navigate exactly once
```

## Current output

See `.agent/trackers/2026-07-13T16-41-10-04-00/project-breakdown.md` and its linked audit family.

## Validation

Documentation only. No runtime code changed. Source, pinned Core Presentation and tests were inspected, but GitHub reported no combined status checks and `npm test`, browser behavior, built output and Pages parity were not independently executed.