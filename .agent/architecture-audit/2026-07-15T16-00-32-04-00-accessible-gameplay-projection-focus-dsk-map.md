# Accessible Gameplay Projection and Focus DSK Map

**Timestamp:** `2026-07-15T16-00-32-04-00`  
**Status:** `accessible-gameplay-projection-focus-authority-audited`

## Summary

PrehistoricRush has authoritative simulation, outcome and pause state, plus visual DOM and Three.js presentation. It lacks a coordinating domain that converts accepted gameplay revisions into stable semantic status, progress, terminal announcements and dialog-focus results.

## Plan ledger

**Goal:** keep accessibility projection downstream of accepted game state and upstream of browser DOM effects.

- [x] Identify simulation and pause authorities.
- [x] Identify current browser projection adapters.
- [x] Separate semantic truth from DOM mutation.
- [x] Define command, result and frame acknowledgement boundaries.
- [ ] Implement the DSK family.

## Current ownership

```txt
prehistoric-rush-domain-kit
  owns run, distance, shards, speed, region, surface and terminal state

prehistoric-rush-pause-menu-domain-kit
  owns open/view/sequence and pause commands

game-runtime-lod-host-adapter
  samples input, ticks, renders and mutates visual status/button content

game-page-entry-kit
  creates and removes the pause overlay

missing
  semantic snapshot identity
  meaningful-change announcement policy
  progress semantics
  terminal announcement settlement
  dialog admission and focus lifecycle
  accessible frame acknowledgement
```

## Required parent domain

`prehistoric-rush-accessible-gameplay-projection-focus-authority-domain`

## Planned kit map

```txt
accessible-gameplay-projection-domain-kit
  composes semantic snapshot, dialog and focus services

gameplay-semantic-snapshot-kit
  derives named run status from accepted engine revisions

status-message-throttle-kit
  emits meaningful changes without RAF-frequency announcement spam

progressbar-projection-kit
  exposes minimum, maximum, current distance and accessible value text

terminal-announcement-kit
  settles start, retry, run-over and win announcements once per transition

pause-dialog-semantics-kit
  publishes dialog identity, label, modal state and active view

focus-capture-kit
  records the accepted pre-dialog focus target

initial-focus-policy-kit
  chooses and acknowledges the first pause action

focus-containment-kit
  owns Tab and Shift+Tab traversal while the dialog is active

focus-restore-kit
  restores the prior accepted target or declared fallback

inert-background-kit
  prevents background command activation during modal pause

keyboard-command-equivalence-kit
  proves button and keyboard paths settle the same semantic command

action-label-state-kit
  binds Start Rush, Jump, Retry and Run Again labels to accepted state

live-region-deduplication-kit
  rejects duplicate and superseded announcement revisions

reduced-announcement-policy-kit
  limits high-frequency speed and terrain narration

accessible-projection-result-kit
  publishes applied, rejected, duplicate and retired results

first-accessible-gameplay-frame-ack-kit
  binds game, semantic DOM and visible frame revisions

keyboard-only-fixture-kit
screen-reader-tree-fixture-kit
pause-focus-fixture-kit
source-build-pages-accessibility-parity-kit
```

## Command flow

```txt
accepted game or pause revision
  -> AccessibleGameplayProjectionCommand
  -> semantic snapshot derivation
  -> announcement/progress/dialog/focus planning
  -> stale and duplicate rejection
  -> atomic DOM adoption
  -> AccessibleGameplayProjectionResult
  -> FirstAccessibleGameplayFrameAck
```

## Dependency rule

The DOM may project accepted state, but it must not infer gameplay success from raw key or click events. Focus and announcement effects must carry the game, pause and projection revisions they represent.

## Boundary

Architecture documentation only. No runtime DSK, semantic DOM or focus behavior was implemented.