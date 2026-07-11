# Architecture Audit: Player Profile Handoff DSK Map

**Timestamp:** `2026-07-11T10-58-10-04-00`

## Summary

The repository has separate menu, creator, store and game modules, but no parent domain owns route admission, durable profile commit or profile-to-game binding.

## Plan ledger

**Goal:** define the domain and kit boundaries required for one profile revision to cross page, persistence, creature, collision and render boundaries safely.

- [x] Map implemented profile/page services.
- [x] Map missing authority services.
- [x] Preserve official procedural creature generation as reusable authority.
- [x] Define typed inputs, results, revisions and observations.
- [ ] Implement after documentation approval.

## Implemented boundaries

```txt
player-character-schema-kit
player-character-profile-store-kit
menu-page-kit
character-creator-page-kit
game-page-entry-kit
player-raptor-preset-kit
procedural-creature-body-kit
rapier-physics-domain-kit
three-procedural-creature-adapter-kit
```

## Missing parent domain

```txt
prehistoric-rush-player-profile-authority-domain
```

## Required kits

```txt
route-manifest-kit
  canonical page IDs, artifact paths and module paths

page-artifact-admission-kit
  source/deployed existence checks and typed route result

player-profile-schema-kit
  versioned normalized profile contract

player-profile-fingerprint-kit
  canonical serialization and complete profile hash

profile-load-result-kit
  found/defaulted/rejected/corrupt evidence

profile-write-command-kit
  expected revision, writer, transaction and candidate

profile-write-result-kit
  accepted/rejected/conflicted/failed result

profile-revision-authority-kit
  ordered commit sequence and compare-and-swap

profile-conflict-resolution-kit
  rebase/retry/reject policy

creator-draft-transaction-kit
  full candidate snapshot, debounce lease and commit state

profile-cross-context-sync-kit
  transaction deduplication across local/storage/broadcast delivery

game-profile-admission-kit
  load and validate before game-domain construction

profile-to-creature-descriptor-kit
  map accepted profile into official procedural creature recipe

profile-to-collision-binding-kit
  bind accepted profile collision to Rapier result

profile-render-binding-result-kit
  bind profile/creature/material resources to Three

profile-frame-receipt-kit
  correlate profile, creature, collision, camera, patch and frame

profile-observation-kit
  bounded detached JSON-safe state

profile-lifecycle-kit
  timer/listener/channel leases and stale-epoch rejection

route-profile-fixture-kit
  source, deployment, conflict, binding and frame proof
```

## Authority flow

```txt
PageManifest
  -> PageAdmissionResult
  -> ProfileLoadResult
  -> CreatorDraftTransaction or GameProfileAdmission
  -> ProfileWriteResult / accepted ProfileRevision
  -> ProfileDescriptorResult
  -> CollisionBindingResult
  -> RenderBindingResult
  -> RenderFrameReceipt
  -> ProfileObservation
```

## Invariants

```txt
no menu link targets an absent artifact
no game construction begins without a resolved profile result
one accepted profile fingerprint maps to one normalized recipe
collision and render binding name that same fingerprint
one logical write produces one deduplicated cross-context event
stale page/profile epochs cannot overwrite or publish
```
