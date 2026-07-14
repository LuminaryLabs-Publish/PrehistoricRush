# Player Character Profile Revision Admission DSK Map

**Timestamp:** `2026-07-14T03-39-56-04-00`  
**Parent authority:** `prehistoric-rush-player-character-profile-revision-admission-authority-domain`

## Summary

The current profile store is a browser adapter, not an authoritative multi-writer settlement service. Profile identity, revision, content hash, writer generation, run admission and visible presentation must be joined without moving localStorage, BroadcastChannel or Three.js into Nexus Engine core.

## Plan ledger

**Goal:** separate neutral profile settlement contracts from browser persistence and product composition adapters.

- [x] Map current producers and consumers.
- [x] Preserve existing profile schema/store/composition kits.
- [x] Keep browser storage and channels as adapters.
- [x] Define command, conflict, run-admission and visible-frame results.
- [ ] Implement after executable contract tests exist.

## Current ownership

```txt
player-character-schema-kit
  owns normalization and defaults

player-character-profile-store-kit
  owns browser persistence and event publication
  currently assigns revision without compare-and-set

character-creator-page-kit
  owns draft controls and local save scheduling

player-character-composition-kit
  owns body/rig/creature/character/player composition

game runtime host
  chooses one profile before async provider readiness

Three.js adapters
  present preview and active run meshes
```

## Required coordinating family

```txt
player-profile-artifact-kit
profile-write-command-kit
profile-writer-generation-kit
profile-expected-revision-kit
profile-payload-fingerprint-kit
profile-conflict-result-kit
profile-event-admission-kit
profile-monotonic-sequence-kit
profile-pending-write-rebase-kit
run-character-admission-command-kit
run-character-artifact-kit
profile-to-body-binding-receipt-kit
profile-visible-frame-ack-kit
profile-store-retirement-result-kit
profile-conflict-fixture-kit
```

## Boundary rules

```txt
Nexus/product contracts:
  immutable profile artifact
  expected revision
  conflict and stale results
  run admission artifact
  binding receipt and visible-frame acknowledgement

Browser adapters:
  localStorage
  BroadcastChannel
  storage events
  timers
  page lifecycle

Presentation adapters:
  creator preview mesh
  game raptor mesh
  frame submission
```
