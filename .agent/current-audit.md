# Current Audit: PrehistoricRush Shard Collection Authority

**Updated:** `2026-07-12T03-51-15-04-00`

## Summary

The current shard loop trusts a mutable browser-side pickup projection and passes only a shard ID into `collectShard()`. The service checks duplicate ID membership but does not validate gameplay phase, run identity, active patch membership, descriptor provenance, spatial evidence or state revision. Gameplay mutation, event publication, instance removal and HUD projection have no shared result or visible-frame receipt.

## Plan ledger

**Goal:** make one shard authority responsible for canonical identity, active membership, 3D evidence, exactly-once state/event commit and visible presentation proof.

- [x] Trace shard descriptors from patch generation through active presentation.
- [x] Trace proximity detection, `collectShard`, event, refresh, render and HUD ordering.
- [x] Inventory interaction loops, domains, kits and services.
- [x] Define parent domain, candidate kits and fixture gate.
- [ ] Implement and execute the shard transaction.

## Complete interaction loop

```txt
menu/profile -> creator or game
creator -> profile draft -> procedural preview -> commit and synchronization

game startup
  -> pinned runtime graph -> engine -> Worker/fallback generator
  -> patch controller -> physics -> camera -> Three renderer
  -> initial patch activation -> RAF

frame
  -> input -> engine tick -> movement and possible terminal outcome
  -> patch focus/release/generation/activation
  -> active-content rebuild creates mutable view.pickups and shard instances
  -> physics/fallback hazard test
  -> XZ-only shard overlap test
  -> collectShard(id) boolean mutation and event
  -> full active-content rebuild
  -> world render -> HUD -> public host observation
```

## Source-backed findings

```txt
shard descriptor ID: `${chunkX}:${chunkZ}:${index}`
identity source fingerprint: absent
active shard set revision: absent
collection command ID: absent
run/status admission inside collectShard: absent
known active descriptor lookup: absent
expected state revision: absent
horizontal evidence: browser-side mutable values
vertical evidence: absent
unknown ID rejection: absent
accepted duplicate receipt: absent
collection result: boolean only
state/event revision: absent
projection result: absent
first visible-frame acknowledgement: absent
```

`collectShard()` can accept any first-time value because it only tests `collectedShardIds.includes(shardId)`. The normal browser loop gates on `status === "game"`, but the service itself does not, and the raw engine remains exposed through `PrehistoricRushHost`.

Patch release and activation happen before collection detection in the same RAF. The detector consumes the resulting mutable `view.pickups` array without capturing a patch activation or shard-set revision. The overlap test uses XZ distance only, so jump height and shard Y do not contribute.

## Domains in use

```txt
page routing and profile lifecycle
creator draft, procedural preview and persistence
runtime source identity, import maps and CDN loading
Nexus Engine composition and 12 core kits
five official NexusEngine-Kits
run, route, movement, surface, score, shards and outcomes
Worker patch generation, queue, cache and membership
terrain, trees, grass, shard descriptors, colliders and height
active-content projection and instance rebuilding
Rapier and fallback collision
camera follow and Three rendering
HUD, transitions and public host observation
runtime graph, surface, outcome, frame, host, reset and lifecycle authorities
validation, static deployment and Pages
shard identity, evidence, commit and frame correlation: missing
```

## Complete kit groups

```txt
Core: core-input, core-spatial, core-scene, core-physics, core-motion,
  core-camera, core-animation, core-graphics, core-skybox, core-ui,
  core-diagnostics, core-composition

Official: seed-kit, procedural-creature-body-kit, instanced-render-batch-kit,
  seeded-world-patch-controller-kit, camera-smooth-follow-kit

Product/page/Worker: prehistoric-rush-domain-kit, player-character-schema-kit,
  player-character-profile-store-kit, menu-page-kit, character-creator-page-kit,
  character-preview-transition-kit, three-procedural-creature-adapter-kit,
  game-page-entry-kit, drunk-route-generator, player-raptor-preset-kit,
  prehistoric-patch-generator, prehistoric-patch-worker

External/host: Three, rapier-physics-domain-kit, Rapier, message Worker executor,
  active-content consumer, creator viewport framing, creator persistence scheduler,
  creature/camera/render host adapters
```

Detailed services are retained in `.agent/kit-registry.json` and the timestamped tracker.

## Required domain

```txt
prehistoric-rush-shard-collection-authority-domain
```

```txt
committed patch activation
  -> canonical active shard index and set revision
  -> shard command admission against run phase and state revision
  -> canonical descriptor/source lookup
  -> authoritative player/shard transform capture
  -> 3D spatial policy
  -> command and identity idempotency
  -> atomic collected-ledger, count, revision and event commit
  -> shard and HUD projection results
  -> first visible-frame acknowledgement
  -> detached observation and bounded journal
```

## Required invariants

```txt
unknown, stale or inactive IDs never award
collection is closed outside active gameplay
one identity awards once per run
same command returns the same receipt
vertical collection policy is explicit
patch/source provenance is verifiable
state, event and result share one revision
shard disappearance and HUD count share one collection/frame receipt
```

## Ordered safe ledges

```txt
0 runtime module graph admission
0a render-surface resolution/frame correlation
1 route/profile proof
2 creator authority
3 patch activation/release
3a shard identity/collection/visible removal
4 collider replacement/admission
5 run-step outcome authority
6 stream cadence/time budget
7 world readiness
8 committed frame/read model
8a public host gateway
9 coordinated epochs/reset
10 lifecycle/disposal
```

No runtime behavior changed and no shard-correctness, visible-removal or deployment-readiness claim is made.