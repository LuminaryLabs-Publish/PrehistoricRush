# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T10-58-10-04-00`

## Summary

Restore valid page routes first, then make the saved player profile the only admitted source for the game creature, collision and frame evidence. Keep patch activation, visual identity and lifecycle work behind that user-facing handoff gate.

## Plan ledger

**Goal:** turn menu, creator and game into one route-safe, conflict-aware and observable player-character transaction.

### Phase 0: page route integrity

- [ ] Add a versioned page manifest for `index.html`, `menu.html`, `charactercreator.html` and `game.html`.
- [ ] Create the missing `charactercreator.html` host for `src/pages/character-creator.js`.
- [ ] Create the missing `game.html` host for `src/pages/game.js`.
- [ ] Validate every menu/navigation target against the deployed artifact.
- [ ] Keep `index.html` as an explicit menu alias or redirect with a tested contract.
- [ ] Add a browser route smoke that opens every page and rejects 404s.

### Phase 1: authoritative profile identity

- [ ] Define a canonical `PlayerCharacterProfile` schema descriptor.
- [ ] Canonically serialize and fingerprint the complete normalized profile.
- [ ] Add writer/session identity and a monotonic commit sequence.
- [ ] Replace local next-revision guessing with compare-and-swap or explicit conflict results.
- [ ] Add typed load, save, patch, reset and conflict results.
- [ ] Record durable revision, fingerprint, writer and commit time together.

### Phase 2: creator draft transaction

- [ ] Keep one complete draft snapshot per debounce window.
- [ ] Persist the full normalized candidate, not only the final captured group patch.
- [ ] Distinguish dirty, saving, committed, conflicted and failed states.
- [ ] Roll back or rebase after storage conflict/failure.
- [ ] Coalesce storage and BroadcastChannel delivery by transaction ID.
- [ ] Release timer, storage listener and BroadcastChannel leases on page exit.

### Phase 3: game profile admission

- [ ] Load the committed profile before constructing `prehistoric-rush-domain-kit`.
- [ ] Convert profile data into the official procedural creature recipe.
- [ ] Validate the result through `procedural-creature-body-kit`.
- [ ] Bind one accepted profile fingerprint to creature descriptor and collision.
- [ ] Reject malformed or incompatible profiles with a typed fallback result.
- [ ] Expose the accepted profile revision/fingerprint through `PrehistoricRushHost`.

### Phase 4: preview and frame parity

- [ ] Replace or supplement the CSS silhouette with the actual procedural descriptor preview.
- [ ] Use the same profile-to-descriptor adapter in creator and game.
- [ ] Correlate profile revision, creature descriptor hash, collision revision and frame ID.
- [ ] Prove creator preview and game frame consume the same committed profile.

### Phase 5: preserve existing runtime gates

- [ ] Implement acknowledged patch prepare/commit/rollback after route/profile P0.
- [ ] Add module graph and visual-policy fingerprints.
- [ ] Add run/session, stream, profile, camera and resource epochs.
- [ ] Retain RAF/listener/Worker/resource ownership and ordered disposal.

## Candidate kits

```txt
route-manifest-kit
page-artifact-admission-kit
player-profile-schema-kit
player-profile-fingerprint-kit
profile-load-result-kit
profile-write-command-kit
profile-write-result-kit
profile-revision-authority-kit
profile-conflict-resolution-kit
creator-draft-transaction-kit
profile-cross-context-sync-kit
game-profile-admission-kit
profile-to-creature-descriptor-kit
profile-to-collision-binding-kit
profile-render-binding-result-kit
profile-frame-receipt-kit
profile-observation-kit
profile-lifecycle-kit
route-profile-fixture-kit
```

## Acceptance conditions

```txt
all menu links resolve in source and deployed Pages
creator and game hosts load without 404 or module errors
rapid cross-group edits persist one complete candidate snapshot
concurrent tabs produce ordered commits or explicit conflict results
game creature recipe equals the committed profile
Rapier collision names the same accepted profile fingerprint
creator preview and game frame name the same descriptor revision
host readback is detached, bounded and JSON-safe
old page/session callbacks cannot overwrite a newer profile epoch
```

## Future fixture commands

```bash
node scripts/prehistoric-rush-page-manifest-fixture.mjs
node scripts/prehistoric-rush-profile-store-fixture.mjs
node scripts/prehistoric-rush-profile-conflict-fixture.mjs
node scripts/prehistoric-rush-profile-game-binding-fixture.mjs
node scripts/prehistoric-rush-profile-frame-receipt-fixture.mjs
node scripts/prehistoric-rush-patch-activation-fixture.mjs
```

## Overall order

```txt
1. Route manifest and page artifact integrity.
2. Durable profile identity and typed storage results.
3. Complete creator draft commit and conflict handling.
4. Game profile admission and creature/collision binding.
5. Preview/frame parity.
6. Patch activation, visual identity and lifecycle gates.
```

## Do not do next

Do not add more character sliders, create another creature generator, hide missing routes with untested redirects, or treat the local revision integer as sufficient profile authority.
