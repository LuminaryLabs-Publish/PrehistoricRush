# Known Gaps: PrehistoricRush

**Updated:** `2026-07-11T10-58-10-04-00`

## Summary

The published entry route now presents a menu and character customization feature, but the menu targets missing HTML artifacts and the game ignores the saved profile. Route integrity and profile handoff are now P0; patch activation, visual identity and lifecycle remain open behind it.

## Plan ledger

**Goal:** keep every route, profile, storage, synchronization, descriptor, collision, render and lifecycle risk explicit before adding more customization.

- [x] Record missing page artifacts.
- [x] Record the creator-to-game consumption gap.
- [x] Record debounce, revision, storage and synchronization gaps.
- [x] Preserve previous patch, visual and lifecycle gaps.
- [ ] Close gaps with typed commands/results, canonical identity and fixtures.

## Route gaps

```txt
- index.html now loads the menu instead of the game
- menu Start Run points to ./game.html, which is absent
- menu Character Creator points to ./charactercreator.html, which is absent
- src/pages/game.js exists without an HTML host
- src/pages/character-creator.js exists without an HTML host
- no page manifest or route admission result exists
- no source/deployed route fixture exists
```

## Profile consumption gaps

```txt
- src/game.js does not import the profile store
- game construction still uses player-raptor-preset-kit
- creator claim that the game reads the latest profile is not true in source
- no profile admission before domain construction
- no profile-to-creature descriptor result
- no profile-to-collision binding result
- no fallback/rejection policy for incompatible profiles
```

## Persistence and revision gaps

```txt
- localStorage setItem has no typed success/failure result
- no transaction ID or writer identity
- concurrent tabs can emit the same revision with different payloads
- revision is not paired with a canonical profile fingerprint
- no compare-and-swap or conflict result
- no recovery journal
- updatedAt uses local wall-clock time without authority
```

## Creator draft gaps

```txt
- draft projection can advance before durable commit
- debounce timer persists only its captured final patch
- rapid edits across different groups can lose earlier unsaved changes
- no dirty/saving/committed/conflicted state machine
- storage failure has no rollback or user-facing error result
- remote updates can replace an active local draft without rebase policy
```

## Synchronization and lifecycle gaps

```txt
- storage and BroadcastChannel can report one logical update twice
- no event transaction ID or deduplication
- menu subscription is never released
- creator subscription is never released
- BroadcastChannel close is not called by page runtimes
- pending save timer is not terminally flushed or cancelled on page exit
- no profile epoch rejects stale callbacks
```

## Preview, collision and render gaps

```txt
- creator preview is CSS, not the procedural creature descriptor
- preview does not validate topology, skinning or collision
- game player descriptor does not name profile revision/fingerprint
- Rapier actor does not name profile revision/fingerprint
- pose and camera revisions remain absent
- renderer emits no product frame receipt
- host readback cannot prove which profile produced a visible frame
```

## Existing patch-streaming gaps

```txt
- controller marks ready patches active before consumer commit
- release evidence clears before retirement acknowledgement
- terrain, trees, grass, pickups, colliders and height mutate sequentially
- no detached prepare plan, shared revision, rollback or acknowledgement
```

## Existing visual and lifecycle gaps

```txt
- module graph and visual policy lack canonical fingerprints
- creature exact geometry hash is incomplete
- grass and shadow policies remain host literals
- runSessionId and shared epochs are absent
- RAF ID and listener leases are not retained
- Worker and Three/Rapier resources lack ordered terminal disposal
- public host exposure has no release lease
```

## Missing proof matrix

```txt
source and deployed page-manifest integrity
menu-to-creator and menu-to-game navigation
full draft persistence across rapid cross-group edits
storage failure result and recovery
concurrent-tab conflict ordering
profile fingerprint sensitivity
profile-to-creature recipe parity
profile-to-collision parity
creator preview/game descriptor parity
profile/frame receipt correlation
patch controller/consumer parity
restart, stale callback rejection and ordered disposal
```

## Priority

```txt
1. route artifact integrity and page admission
2. profile commit, conflict and cross-context synchronization
3. game profile consumption and creature/collision binding
4. creator preview and rendered-frame parity
5. patch activation transaction
6. visual-policy identity and lifecycle ownership
```

## Do not do next

```txt
- do not work on TheCavalryOfRome
- do not create a branch
- do not add more profile controls before route/profile P0
- do not duplicate procedural-creature-body-kit
- do not treat revision alone as profile identity
- do not claim customization reaches gameplay without executable proof
```
