# Deploy Audit: Browser Input Fixture Gate

**Timestamp:** `2026-07-12T05-21-52-04-00`

## Summary

Static source inspection proves the current input wiring but does not prove browser event-repeat behavior, focus retirement, button/keyboard parity, simulation-step consumption or visible-frame acknowledgement. Deployment readiness requires executable browser fixtures.

## Plan ledger

**Goal:** define the minimum automated and browser proof required before claiming input-command correctness on GitHub Pages.

- [x] Identify source-backed behavior.
- [x] Identify unavailable runtime evidence.
- [x] Define deterministic and browser fixture gates.
- [ ] Execute the gates after implementation.

## Required deterministic fixtures

```txt
active-run Enter rejection
menu Enter single start
run-over Enter single retry
held Enter duplicate/idempotency
Space press one jump edge
Space repeat no second edge
Space release/press second edge
button/keyboard semantic parity
stale run command rejection
stale runtime generation rejection
focus retirement
visibility retirement
reset retirement
disposal retirement
input step snapshot immutability
```

## Required browser fixtures

```txt
real KeyboardEvent repeat sequence
real keyup sequence
window blur
visibilitychange hidden/visible
button activation
active-run Enter
held Space across landing
RAF input-step receipt
first visible player/camera response receipt
public host detached readback
```

## Required Pages smoke

```txt
load deployed game page
start once with Enter
verify active-run Enter does not reset
hold Space and verify one jump per press/release cycle
hold A/D/W and verify release and blur retirement
retry with button and keyboard and compare results
capture frame/readback correlation
```

## Current validation state

```txt
runtime input fixture: unavailable
browser repeat fixture: unavailable
focus/visibility fixture: unavailable
button/keyboard parity fixture: unavailable
step consumption fixture: unavailable
visible-frame acknowledgement fixture: unavailable
Pages input smoke: not run
```

## Gate rule

Do not claim input correctness from listener presence, a changed run state, movement on screen or a successful page load. The implementation must produce typed admission, retirement, step-consumption and visible-frame results under real browser event delivery.

No deployment configuration changed in this audit.