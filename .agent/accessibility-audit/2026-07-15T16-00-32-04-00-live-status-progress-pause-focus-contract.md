# Live Status, Progress and Pause Focus Contract

**Timestamp:** `2026-07-15T16-00-32-04-00`  
**Status:** `accessible-gameplay-projection-focus-authority-audited`

## Summary

The required accessibility layer must expose accepted gameplay state without turning every animation frame into speech, and it must treat pause as an owned dialog-focus transaction rather than a visual overlay alone.

## Plan ledger

**Goal:** define the semantic, announcement and focus invariants required for a complete keyboard and assistive-technology loop.

- [x] Define stable semantic control identities.
- [x] Define progress and announcement policies.
- [x] Define pause-dialog focus admission and restoration.
- [x] Define lifecycle and deduplication rules.
- [ ] Implement and validate the contract.

## Semantic invariants

```txt
one stable gameplay status node per document generation
one stable progress node per run generation
status updates only when authored meaning changes
continuous distance updates do not force continuous speech
progress exposes minimum, maximum, current and value text
terminal outcomes emit one assertive or authored-priority announcement
button label and accessible name reflect the same accepted action state
```

## Pause-dialog invariants

```txt
pause open result creates one role=dialog surface
accepted modal pause sets aria-modal=true
background gameplay controls become inert or equivalently unavailable
prior accepted focus target is captured before adoption
initial focus moves to the authored first action
Tab and Shift+Tab stay inside the active dialog
Escape settles through pause authority before the dialog retires
close restores the prior valid target or an explicit fallback
route exit and runtime retirement clear inertness and focus leases
```

## Stable control IDs

```txt
prehistoric-rush-game-status
prehistoric-rush-distance-progress
prehistoric-rush-primary-action
prehistoric-rush-pause-dialog
prehistoric-rush-pause-settings
prehistoric-rush-pause-exit
prehistoric-rush-announcement
```

## Announcement policy

```txt
polite
  run-started
  authored distance milestones
  shard collection when enabled
  retry-started

assertive or authored terminal priority
  run-over
  win

not announced every RAF
  speed
  region
  surface multiplier
  tick revision
  patch counts
  LOD diagnostics
```

## Lifecycle

The projection generation must retire on pagehide, route replacement or runtime replacement. No detached overlay, stale live region, inert background state or focus lease may survive retirement.

## Boundary

No accessibility runtime behavior or assistive-technology verification was added.