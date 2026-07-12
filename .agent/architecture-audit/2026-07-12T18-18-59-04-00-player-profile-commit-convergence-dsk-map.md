# Architecture Audit: Player Profile Commit and Convergence DSK

**Timestamp:** `2026-07-12T18-18-59-04-00`

## Summary

The profile store combines schema normalization, browser persistence, revision assignment, cross-tab distribution and listener publication inside one helper module, while creator debounce, navigation and game boot remain separate consumers. The numeric `revision` does not provide atomic commit or convergence authority.

## Plan ledger

**Goal:** define one parent DSK that owns profile command admission, conflict resolution, durable commit, monotonic delivery, creator save leases, navigation barriers and runtime binding.

- [x] Map existing owners and adapters.
- [x] Identify revision and delivery races.
- [x] Define the parent domain and candidate kit boundaries.
- [x] Define commit, conflict and binding results.
- [x] Define migration path without replacing existing schema/creator/render owners.
- [ ] Implement after fixture contracts exist.

## Existing ownership map

```txt
player-character-schema-kit
  -> defaults
  -> normalization
  -> field clamps
  -> deep merge

player-character-profile-store-kit
  -> storage capability lookup
  -> load
  -> save
  -> patch
  -> reset
  -> numeric revision
  -> BroadcastChannel publication
  -> storage-event subscription

character-creator-page-kit
  -> mutable draft
  -> control events
  -> 160 ms save timer
  -> external-update admission
  -> reset
  -> navigation links

creator-persistence-scheduler
  -> timer replacement
  -> delayed patch commit

menu-page-kit
  -> initial profile load
  -> cross-tab projection

game-page-entry/runtime
  -> one profile load at boot
  -> engine/creature composition
  -> public profile revision readback
```

## Missing parent domain

```txt
prehistoric-rush-player-character-profile-commit-convergence-authority-domain
```

This parent coordinates existing owners. It must not absorb field normalization, creator UI, procedural creature generation or renderer implementation.

## Candidate kit map

### Identity and revision

```txt
player-profile-writer-session-kit
player-profile-command-id-kit
player-profile-command-sequence-kit
player-profile-revision-kit
player-profile-content-fingerprint-kit
player-profile-event-id-kit
```

### Command and admission

```txt
player-profile-edit-command-kit
player-profile-patch-schema-kit
player-profile-expected-predecessor-kit
player-profile-commit-admission-kit
player-profile-reset-command-kit
```

### Conflict and planning

```txt
player-profile-conflict-detection-kit
player-profile-conflict-policy-kit
player-profile-merge-plan-kit
creator-draft-revision-kit
creator-save-rebase-kit
```

### Durable effects and results

```txt
player-profile-storage-write-result-kit
player-profile-storage-readback-kit
player-profile-commit-result-kit
player-profile-reset-result-kit
```

### Distribution and convergence

```txt
player-profile-channel-envelope-kit
player-profile-monotonic-subscription-kit
player-profile-duplicate-delivery-rejection-kit
player-profile-stale-delivery-rejection-kit
```

### Creator and navigation lifecycle

```txt
creator-save-lease-kit
creator-save-flush-kit
creator-navigation-barrier-kit
```

### Runtime and proof

```txt
runtime-player-profile-binding-kit
player-profile-visible-frame-ack-kit
player-profile-observation-kit
player-profile-journal-kit
```

## Required command flow

```txt
Edit intent
  -> PlayerProfileEditCommand
  -> writer/session and command identity
  -> expected predecessor and draft revision
  -> patch schema validation
  -> durable predecessor observation
  -> conflict detection
  -> reject or deterministic merge plan
  -> normalized candidate and content fingerprint
  -> storage write
  -> durable readback verification
  -> PlayerProfileCommitResult
  -> one channel envelope
  -> monotonic subscriber admission
  -> menu/creator projection
  -> runtime binding when entering game
  -> first visible profile-dependent frame acknowledgement
```

## Conflict policy boundary

The parent must declare a policy per field group rather than relying on full-snapshot last-writer-wins.

```txt
proportions: reject overlapping stale writes or merge disjoint field paths
material: reject overlapping stale writes or merge disjoint field paths
topology/collision/animation: same explicit rule
reset: barrier/tombstone or exclusive successor commit
unknown schema: migrate or reject
```

## Migration plan

1. Keep `normalizePlayerCharacterProfile()` as the canonical field normalizer.
2. Wrap `savePlayerCharacterProfile()` behind typed commands and results.
3. Add writer, command, predecessor and fingerprint fields to persisted metadata or an adjacent envelope.
4. Replace raw BroadcastChannel payloads with commit envelopes.
5. Make subscriptions monotonic and duplicate-safe.
6. Replace the creator timeout with a save lease that can rebase, flush or reject navigation.
7. Bind game boot to a committed profile receipt and publish a first-frame acknowledgement.

## Architectural invariants

```txt
profile schema normalization is separate from commit admission
numeric revision is allocated only during accepted commit
one predecessor can produce at most one conflicting-field successor
subscribers never mutate durable state
stale delivery never replaces a newer projection
creator navigation never guesses whether a timer committed
runtime profile binding remains immutable for one run session
visible profile-dependent frames cite the exact binding
```
