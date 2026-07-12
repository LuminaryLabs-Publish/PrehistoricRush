# Current Audit: PrehistoricRush Player Character Profile Commit and Convergence

**Updated:** `2026-07-12T18-18-59-04-00`  
**Repository head reviewed before documentation writes:** `4b5b34b7610b7f428696a9e0bcd5a7b4868307f8`  
**Pinned Nexus Engine:** `cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1`

## Summary

PrehistoricRush has a normalized versioned player-character profile and distributes it across menu, creator and game routes. The storage helper assigns `revision` by reading the previous complete snapshot and writing a new complete snapshot, while creator persistence is deferred through a 160 ms timeout and cross-tab events are accepted without monotonic ordering or duplicate suppression.

This is not a profile commit or convergence protocol. Two writers can produce conflicting snapshots with the same revision, a stale event can regress a projection, a pending creator timer can overwrite a remote update, and navigation can enter the game before the visible draft is durable.

## Plan ledger

**Goal:** make every profile mutation a typed, expected-predecessor command that commits one durable successor or returns zero-mutation rejection, then converge all projections and bind game boot to the accepted commit.

- [x] Trace schema defaults, normalization and merge behavior.
- [x] Trace storage capability, read, save, patch and reset.
- [x] Trace BroadcastChannel, storage events and listener lifecycle.
- [x] Trace creator draft, debounce, external updates, reset and navigation.
- [x] Trace menu projection and game profile binding.
- [x] Inventory all domains, kits and services.
- [x] Define commit, conflict, delivery, navigation and visible-frame contracts.
- [x] Publish the timestamped audit family.
- [x] Refresh root routing and machine registry.
- [x] Synchronize central tracking.
- [ ] Implement and execute convergence fixtures.

## Source-backed current behavior

```txt
load
  -> get localStorage if available
  -> read one key
  -> JSON.parse
  -> normalize or return defaults

save
  -> load previous
  -> successor revision = max(previous + 1, input revision)
  -> normalize full snapshot
  -> localStorage.setItem
  -> BroadcastChannel post
  -> local listeners
  -> return profile object

patch
  -> load current profile
  -> recursively merge patch
  -> save complete snapshot

subscribe
  -> BroadcastChannel payload normalized and emitted
  -> storage-event payload normalized and emitted
  -> no revision/fingerprint/event admission

creator
  -> mutate draft and preview immediately
  -> schedule 160 ms patch save
  -> replace draft on external event
  -> keep pending timer alive
  -> navigate without save flush

game
  -> load profile once before composition
  -> use profile creature descriptor for the run
  -> expose profileId and revision only
```

## Concrete race paths

### Same-predecessor writers

```txt
Tab A reads revision R
Tab B reads revision R
Tab A writes snapshot A as R+1
Tab B writes snapshot B as R+1
last complete snapshot wins
no conflict or same-revision divergence is reported
```

### Remote update during local debounce

```txt
creator A schedules patch from draft R
creator B commits R+1
A receives R+1 and replaces visible draft
A's old timer still fires
A merges predecessor-derived nested patch and writes R+2
an overlapping B field can be silently replaced
```

### Duplicate or stale delivery

```txt
one commit is delivered through BroadcastChannel and storage event
both are accepted
or an older cross-writer event arrives after a newer event
projection is replaced without monotonic admission
```

### Immediate navigation

```txt
creator shows Saving and updated preview
player clicks Play or Menu before 160 ms
beforeunload disposes preview only
pending commit is not flushed or acknowledged
game/menu can load predecessor profile
```

### Storage failure

```txt
UI and preview already show new draft
localStorage.setItem throws
no typed durable/volatile result
no rollback or navigation policy
```

## Domains in use

```txt
route shells and browser lifecycle
profile schema/defaults/normalization/deep merge
profile identity/revision/time metadata
localStorage capability/read/write/reset
BroadcastChannel and storage-event distribution
listener lifecycle
creator draft/debounce/status/reset/navigation
creator procedural preview and render lifecycle
menu profile projection
runtime module admission and game composition
procedural creature generation and Three rendering
public runtime readback
Node tests, Pages deployment and audit tracking

missing profile commit/convergence authority
```

## Kit and service census

```txt
15 Nexus Engine root/subdomain kits
5 official NexusEngine-Kits
14 product/page/Worker kits
9 external/host adapters
2 proof kits
45 implemented/adapted/proof surfaces total
```

The full names and service lists are retained in `.agent/kit-registry.json` and the current tracker.

## Required domain

```txt
prehistoric-rush-player-character-profile-commit-convergence-authority-domain
```

## Required invariants

```txt
one profile command ID produces at most one terminal result
successor commit cites one expected predecessor revision and fingerprint
conflicting writers cannot both claim the same successor history
stale and duplicate delivery performs zero projection mutation
remote commit rebases, conflicts or cancels every pending local save lease
Saved is projected only from verified durable commit result
navigation resolves pending save policy before route change
reset invalidates predecessor drafts through an explicit barrier
runtime binds one profile commit/fingerprint for the run
first visible profile-dependent frame cites that binding
```

The previous coordinated-reset, pose, motion and streamed-content audits remain active. Profile authority feeds them an immutable runtime binding rather than changing their ownership.