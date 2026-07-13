# Deploy Audit: Start/Restart Central Fixture Gate

**Timestamp:** `2026-07-12T22-19-11-04-00`

## Summary

The repository's Node tests cover resolution policy and player articulation. They do not instantiate browser keyboard events, key repeat, route/status admission, Worker delivery, Rapier reset, active content, camera/render generations, or Pages behavior. Start/restart authority cannot be marked implemented until source, built output, and deployed Pages pass the same fixture matrix.

## Plan ledger

**Goal:** define the executable gate required before start/restart behavior is considered production-ready.

- [x] Inspect package test surface.
- [x] Identify browser-only participants.
- [x] Define source, build, and Pages parity requirements.
- [x] Define failure, duplicate, stale, and first-frame fixtures.
- [ ] Implement and run later.

## Required fixture matrix

```txt
boot start creates exactly one run generation
button Start from menu
Space Start from menu
Enter Start from menu
held Enter emits one accepted start
Enter during active gameplay is rejected unless explicit restart policy allows it
Retry after collision
Run Again after win
public command parity with UI and keyboard
held steering and boost are retired before successor input
pending predecessor Worker result is rejected
patch controller reset or preserve policy is proven
Rapier player body and colliders match successor origin
active content and instance batches cite successor generation
camera and renderer cite successor generation
participant preparation failure preserves predecessor or reports indeterminate state
same command ID returns same sealed result
first visible successor frame cites accepted start result
source and built output agree
GitHub Pages agrees with source behavior
```

## Required observation

```txt
runtime session and generation
command ID and sequence
predecessor and successor run generation
scene/status admission result
participant receipt manifest
Worker and patch generations
physics and content revisions
camera and render revisions
RunStarted and transition counts
first visible frame acknowledgement
```

## Current validation state

```txt
npm test: not run during this audit
browser fixture: unavailable
built-output fixture: unavailable
Pages fixture: unavailable
runtime source changed: no
deployment changed: no
```

## Completion gate

Do not mark the authority implemented until repeat, duplicate, stale, active-run, held-input, pending-Worker, participant-failure, and first-frame cases pass across source, built output, and Pages.