# Gameplay Audit: Menu, Creator and Run Profile Loop

**Timestamp:** `2026-07-11T10-58-10-04-00`

## Summary

The intended loop is customize a raptor, return to the menu, then start a run with that raptor. The current loop stops at navigation because both destination HTML pages are absent, and the run runtime would still use the static preset if loaded directly.

## Plan ledger

**Goal:** define a playable loop where customization changes the actual creature and collision used by the next run.

- [x] Trace menu actions.
- [x] Trace creator save behavior.
- [x] Trace run creature construction.
- [x] Record gameplay divergence.
- [ ] Add route/profile/run fixtures.

## Intended loop

```txt
menu
  -> open creator
  -> edit body, tail, legs, head, motion and colors
  -> autosave committed profile
  -> return to menu
  -> start run
  -> procedural creature and collision use committed profile
  -> run, fail/win, retry
```

## Current loop

```txt
menu
  -> creator link 404
  -> game link 404

manual creator module host
  -> profile can be stored

manual game module host
  -> game ignores stored profile
  -> static preset creature is used
```

## Gameplay risks

```txt
- customization has no gameplay effect
- menu can report a revision that the run does not consume
- collision may not match user-selected proportions
- retry/run restart has no profile admission policy
- a profile change in another tab has no run-boundary policy
- no run snapshot names the accepted profile
```

## Required gameplay contract

```txt
StartRunCommand
  -> PageAdmissionResult
  -> ProfileLoadResult
  -> GameProfileAdmissionResult
  -> CreatureDescriptorResult
  -> CollisionBindingResult
  -> RunStartResult(profileRevision, profileFingerprint)
```

Profile changes after `RunStartResult` must either be deferred to the next run or admitted through an explicit live-rebind transaction. They must not silently mutate an active run.
