# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T18-18-59-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `player-character-profile-commit-convergence-authority-audited`

## Summary

PrehistoricRush normalizes and revisions a browser-stored procedural-player profile, but its revision is assigned through non-atomic read-increment-write. Creator edits are delayed by 160 ms, cross-tab updates arrive through two uncoordinated channels, pending saves are not rebased after remote updates, and navigation does not flush or acknowledge the visible draft before game boot.

The current audit defines one profile commit/convergence authority spanning writer identity, expected predecessor admission, conflicts, durable write/readback, monotonic delivery, creator save leases, navigation barriers, runtime binding and first-visible-profile-frame proof.

## Plan ledger

**Goal:** make Customize → Save → Menu/Play and every cross-tab update reference one durable profile commit rather than a timer, numeric revision guess or unsequenced event.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush` as the oldest eligible synchronized repository.
- [x] Trace schema, store, creator, menu and game profile paths.
- [x] Identify non-atomic revision, lost-update, stale-delivery and navigation-before-save paths.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Define the profile commit/convergence parent DSK and fixture boundary.
- [x] Add the `18-18-59` tracker and architecture/system audit family.
- [x] Refresh root routing and machine registry.
- [x] Synchronize central tracking on `main`.
- [x] Create no branch or pull request.
- [ ] Runtime implementation and executable multi-tab/navigation fixtures remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T18-18-59-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T18-18-59-04-00.md
.agent/architecture-audit/2026-07-12T18-18-59-04-00-player-profile-commit-convergence-dsk-map.md
.agent/render-audit/2026-07-12T18-18-59-04-00-profile-commit-visible-creature-gap.md
.agent/gameplay-audit/2026-07-12T18-18-59-04-00-stale-draft-navigation-profile-loop.md
.agent/interaction-audit/2026-07-12T18-18-59-04-00-profile-edit-commit-delivery-binding-map.md
.agent/profile-convergence-audit/2026-07-12T18-18-59-04-00-revision-conflict-debounce-navigation-contract.md
.agent/deploy-audit/2026-07-12T18-18-59-04-00-profile-convergence-fixture-gate.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
```

## Current profile loop

```txt
creator input
  -> mutate draft and preview
  -> show Saving
  -> schedule/replace 160 ms timeout
  -> reload storage and merge captured patch
  -> assign numeric revision
  -> setItem full profile
  -> BroadcastChannel plus local listener publication

external event
  -> normalize
  -> replace projection without monotonic/duplicate admission
  -> leave pending local timer active

navigation
  -> dispose preview only
  -> do not flush or acknowledge pending save

game boot
  -> load one current storage profile
  -> bind creature to numeric revision only
```

## Main findings

```txt
two tabs can read R and both write conflicting R+1 snapshots
same logical commit can arrive through BroadcastChannel and storage events
older delivery can replace a newer creator/menu projection
remote admission does not cancel or rebase a predecessor-draft timer
Play/Menu can navigate while the visible edit exists only in a timeout
setItem failure has no typed durable/volatile result
game first frame exposes revision but not commit/fingerprint provenance
```

## Required parent domain

```txt
prehistoric-rush-player-character-profile-commit-convergence-authority-domain
```

Required flow:

```txt
edit/reset intent
  -> writer, command, sequence and draft identity
  -> expected predecessor and patch admission
  -> conflict detection and explicit merge/reject policy
  -> normalized candidate, successor revision and fingerprint
  -> durable write plus readback verification
  -> terminal PlayerProfileCommitResult
  -> one commit envelope
  -> monotonic duplicate-safe delivery
  -> pending-save rebase/cancel
  -> navigation flush/barrier
  -> runtime profile binding
  -> first visible profile-dependent frame acknowledgement
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        2
total surfaces:                   45
candidate profile-authority kits: 31
```

## Validation boundary

```txt
runtime/profile/creator/game behavior changed: no
rendering changed: no
package scripts/dependencies/deployment changed: no
npm test: not run
multi-tab browser fixtures: not run
navigation flush fixtures: not run
Pages profile fixtures: not run
branch created: no
pull request created: no
```

A numeric revision, `Saved` label or matching-looking creature does not prove durable convergence. Completion requires a terminal profile commit result, monotonic delivery, navigation binding and first-visible-frame evidence for one fingerprint.