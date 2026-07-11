# Interaction Audit: Route, Edit, Save and Consume Results

**Timestamp:** `2026-07-11T10-58-10-04-00`

## Summary

User actions currently cross route, draft, storage and game boundaries without one typed result chain. Menu navigation can fail at the artifact boundary, creator saves can conflict or lose edits, and the game does not acknowledge the profile at all.

## Plan ledger

**Goal:** make every user action return evidence that reaches the intended page, durable profile and game binding.

- [x] Map menu navigation.
- [x] Map creator input and debounce.
- [x] Map profile persistence and notifications.
- [x] Map game construction.
- [x] Define missing results.
- [ ] Implement result projection and fixtures.

## Current map

```txt
click Start Run
  -> browser href game.html
  -> 404
  -> no product result

click Character Creator
  -> browser href charactercreator.html
  -> 404
  -> no product result

creator input
  -> mutate draft and preview
  -> schedule timer
  -> patch localStorage
  -> broadcast/listeners
  -> UI says Saved revision N
  -> no transaction/conflict/fingerprint result

start game module directly
  -> construct static preset creature
  -> no profile load/admission result
```

## Required results

```txt
PageNavigationResult
ProfileDraftResult
ProfileWriteResult
ProfileConflictResult
ProfileSyncResult
GameProfileAdmissionResult
CreatureDescriptorResult
CollisionBindingResult
RenderBindingResult
RenderFrameReceipt
```

## UI projection requirements

```txt
navigation failure is visible and recoverable
save state distinguishes dirty/saving/committed/conflicted/failed
menu names durable revision and fingerprint, not draft-only state
game HUD/host names accepted profile revision
creator and game expose one normalized descriptor identity
```
