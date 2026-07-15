# Architecture Audit: Creator Profile Navigation Commit DSK Map

**Timestamp:** `2026-07-15T04-03-03-04-00`  
**Status:** `creator-profile-navigation-commit-authority-audited`

## Summary

The creator draft, delayed store write, browser route change, game composition, and visible character are owned by separate surfaces. No parent domain correlates their revisions or prevents route transfer while a local mutation is still pending.

## Plan ledger

**Goal:** define the smallest authority boundary that can settle creator mutations before route ownership changes without moving browser storage or rendering into Core.

- [x] Keep profile schema and normalization renderer-neutral.
- [x] Keep localStorage and BroadcastChannel in browser adapters.
- [x] Keep Three.js preview and game presentation in host adapters.
- [x] Reuse the existing profile store and character composition kits.
- [x] Add one product-level authority coordinating commit, route, sealing, and proof.
- [ ] Implement after contract and fixture review.

## Existing owners

```txt
player-character-schema-kit
  normalize profile
  merge profile
  create defaults

player-character-profile-store-kit
  load stored profile
  assign numeric revision and updatedAt
  save, patch, and reset
  publish local listeners
  publish BroadcastChannel updates
  consume storage events

character-creator-page-kit
  own controls and draft
  update preview immediately
  schedule delayed persistence
  expose Menu and Play navigation

character-preview-transition-kit
  compose and transition the preview creature
  publish preview mode and resource lifecycle

player-character-composition-kit
  compose creature, rig, character, and player artifacts

game-page-entry and game runtime
  load one stored profile
  compose the run character
  expose profile ID and revision in public readback
```

## Missing parent domain

```txt
prehistoric-rush-creator-profile-navigation-commit-authority-domain
```

### Required coordinating surfaces

```txt
creator-profile-draft-kit
creator-profile-dirty-state-kit
creator-profile-commit-command-kit
creator-profile-normalization-kit
creator-profile-base-revision-kit
creator-profile-conflict-resolution-kit
creator-profile-storage-adapter-kit
creator-profile-readback-verification-kit
creator-profile-commit-result-kit
creator-route-intent-kit
creator-navigation-admission-kit
creator-navigation-result-kit
profile-receipt-transfer-kit
game-profile-startup-admission-kit
run-character-profile-sealing-kit
profile-body-hash-binding-kit
profile-public-readback-kit
creator-profile-failure-presentation-kit
first-committed-profile-frame-kit
creator-profile-navigation-fixture-kit
```

## Command flow

```txt
CreatorDraftMutation
  -> produce DraftRevision and dirty state

CreatorRouteIntent(Menu | Play)
  -> submit CreatorProfileCommitCommand
  -> normalize complete candidate
  -> compare expected stored revision
  -> settle concurrent update policy
  -> write and read back storage
  -> publish CreatorProfileCommitResult

accepted result
  -> publish CreatorNavigationAdmissionResult
  -> navigate with profile receipt
  -> game validates receipt against stored profile
  -> composition seals profile revision to creature body hash
  -> render and publish FirstCommittedProfileFrameAck

rejected result
  -> remain in creator
  -> retain draft
  -> display recoverable failure
  -> do not transfer route ownership
```

## Boundary rules

- The authority coordinates existing kits; it does not duplicate schema, store, composition, or renderer implementations.
- Route transfer is forbidden while the current draft is dirty and lacks an accepted commit result.
- `beforeunload` is not the primary commit mechanism. Explicit Menu and Play intents must settle first.
- Page lifecycle handling may attempt a best-effort final flush, but it cannot claim navigation success without a verified result.
- The game must not infer creator success from localStorage presence alone. It must admit the expected profile revision and payload hash.
- The first game frame receipt must bind profile ID, profile revision, creature content hash, run ID, render revision, and frame ID.

## Relationship to retained audit

The existing player-profile revision admission audit covers cross-document ordering, stale writers, and immutable run sealing. This audit is a narrower child boundary covering pending local mutation durability at route transfer.