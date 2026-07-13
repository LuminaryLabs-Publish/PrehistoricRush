# Pause Menu Fixture Gate

**Timestamp:** `2026-07-13T16-41-10-04-00`

## Summary

The current pause-menu test validates DSK semantics and static source markers. It does not execute the pinned runtime in a browser, inspect real DOM frames, prove one host scheduler, validate gameplay-input policy or observe cleanup before navigation.

## Plan ledger

**Goal:** define the executable proof required before the non-blocking pause lifecycle can be considered production-ready.

- [x] Confirm the new test is wired into `npm test`.
- [x] Confirm semantic open/settings/exit/reset coverage.
- [x] Confirm static checks for unconditional simulation ticking.
- [ ] Run clean-checkout `npm test`.
- [ ] Add real pinned-runtime composition coverage.
- [ ] Add browser command, DOM and frame correlation fixtures.
- [ ] Add input-policy and focus-race fixtures.
- [ ] Add exit cleanup and navigation fixtures.
- [ ] Run built-output and GitHub Pages parity checks.

## Required fixtures

```txt
semantic command fixture
  open/close/toggle/settings/exit/reset
  duplicate and stale commands
  expected sequence

host installation fixture
  delayed runtime availability
  exactly one attach loop
  exactly one Escape listener
  exactly one sync RAF
  replacement and cancellation

visible overlay fixture
  accepted command sequence
  DOM projection fingerprint
  first matching animation frame
  close and stale projection rejection

non-blocking gameplay fixture
  simulation continues
  authored steer/boost/jump policy
  held input clear/retain rules
  Escape repeat, blur and focus restoration

exit settlement fixture
  duplicate exit intent
  Worker/runtime/render cleanup receipts
  late callback rejection
  timeout and partial failure
  exactly one navigation

parity fixture
  source runtime
  built output
  GitHub Pages
```

## Current coverage boundary

`tests/pause-menu-authority.mjs` uses a small in-memory world and source-text assertions. It proves semantic descriptors, state transitions, duplicate exit-event suppression and source-level non-blocking markers. It does not instantiate the actual Nexus runtime, load Three.js/Rapier, execute browser RAFs, inspect paint, exercise navigation or prove cleanup.

## Gate

Do not mark the pause-menu lifecycle complete until all command outcomes are typed, one active browser host generation is proven, gameplay input while open follows an explicit policy, exit collects terminal retirement evidence and the first visible overlay frame matches the accepted menu revision across source, build and Pages.