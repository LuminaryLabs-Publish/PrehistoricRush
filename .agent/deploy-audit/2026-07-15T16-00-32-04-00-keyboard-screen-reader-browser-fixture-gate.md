# Keyboard and Screen-Reader Browser Fixture Gate

**Timestamp:** `2026-07-15T16-00-32-04-00`  
**Status:** `accessible-gameplay-projection-focus-authority-audited`

## Summary

Source inspection is sufficient to identify missing roles, values, announcements and focus ownership, but it is not sufficient to claim keyboard or assistive-technology correctness. Production readiness requires executable source, built-output and Pages fixtures.

## Plan ledger

**Goal:** require observable semantic and focus evidence before accessibility readiness is claimed.

- [x] Define source-level checks.
- [x] Define browser accessibility-tree checks.
- [x] Define keyboard focus and lifecycle checks.
- [x] Define artifact and Pages parity checks.
- [ ] Execute the gate after implementation.

## Required source checks

```txt
stable status and progress control IDs exist
status and progress roles are explicit
progress minimum, maximum and current values are bound to accepted state
pause surface has dialog semantics
focus capture, initial focus, containment and restoration are owned
announcement deduplication is revision-bound
retirement clears inertness and stale focus state
```

## Required browser fixtures

```txt
keyboard-only start, jump, pause, settings, exit, retry and run-again
accessibility tree exposes named game status and distance progress
rapid RAF updates do not produce duplicate live announcements
run-over and win produce one accepted terminal announcement
pause open focuses the authored first action
Tab and Shift+Tab remain inside the pause dialog
Escape closes and restores the prior accepted target
blur, pagehide and route exit clear active focus/inert leases
```

## Required parity fixtures

```txt
source route
static built artifact
GitHub Pages deployment

all three must expose the same control IDs, roles, progress values,
announcement transitions, dialog semantics and focus behavior
```

## Evidence not collected

```txt
npm test: not run
browser keyboard fixture: not run
accessibility-tree capture: not run
screen-reader fixture: not run
pause focus fixture: not run
built-output smoke: not run
Pages smoke: not run
```

## Boundary

No accessibility compliance, assistive-technology compatibility, artifact parity, Pages parity or production readiness is claimed.