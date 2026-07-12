# Current Audit: PrehistoricRush Active Content Materialization Authority

**Updated:** `2026-07-12T07-09-49-04-00`

## Summary

The active browser host performs mutation-first materialization. Any released patch set triggers a full tree flush and complete grass, shard, pickup and collider rebuild. Every activated ready patch then performs the same complete work again. There is no aggregate patch delta, bounded work plan, active-content revision, atomic cross-consumer commit or visible-frame proof.

## Plan ledger

**Goal:** make one authority responsible for coalescing patch membership changes, budgeting work, preparing every consumer, atomically committing one active-content revision and correlating it with physics, gameplay, rendering and public readback.

- [x] Trace controller membership and delivery.
- [x] Trace terrain, tree, grass, shard, pickup and collider materialization.
- [x] Confirm release and activation can each cause a complete rebuild in one frame.
- [x] Quantify source-level descriptor and collider work bounds.
- [x] Inventory interaction loops, domains, kits and services.
- [x] Define parent domain, candidate kits and fixture gate.
- [ ] Implement and execute the materialization transaction.

## Complete interaction loop

```txt
menu/profile -> creator or game
creator -> profile draft -> procedural preview -> persistence

game startup
  -> pinned modules -> engine graph -> Worker/fallback generator
  -> patch controller -> physics -> camera -> Three renderer
  -> game.start -> synchronous center prime -> camera reset

frame
  -> browser input and engine tick
  -> controller focus/update
  -> take released patch IDs
  -> hide terrain and release tree cells
  -> flush all tree batches
  -> rebuild all active grass, shards, pickups and colliders
  -> replace all fixed physics colliders
  -> pump generation
  -> take at most one ready patch
  -> upload terrain and replace tree cells
  -> flush all tree batches again
  -> rebuild all active grass, shards, pickups and colliders again
  -> replace all fixed physics colliders again
  -> physics, fallback collision, shard scan, render and HUD
```

## Source-backed findings

```txt
active radius: 2
maximum active patches: 25
maximum trees generated per patch: 7
maximum grass descriptors generated per patch: 70
maximum shards generated per patch: 2

one complete active-set upper bound:
  25 patch scans
  1,750 grass descriptor visits
  50 shard descriptor visits
  175 tree trunks and 175 crowns
  175 fixed colliders

release plus activation upper bound in one frame:
  3,500 grass descriptor visits
  100 shard descriptor visits
  two all-tree-batch flushes
  two complete fixed-collider replacements
```

The bound excludes terrain attribute uploads, matrix-buffer uploads, bounds recomputation and Rapier work.

## Missing authority

```txt
active-content revision
aggregate release/activation delta
materialization command and idempotency
elapsed-time and work-unit budget
terrain/tree/grass/shard/collider prepare results
atomic commit and predecessor rollback
stale runtime/run/stream/content rejection
controller/render/physics parity digest
materialization duration and work diagnostics
first visible-frame acknowledgement
```

## Domains in use

```txt
page routing and profile lifecycle
creator draft, preview, persistence and transition
runtime source identity, import maps and module loading
Nexus Engine composition and core capabilities
browser input and lifecycle observation
product run, movement, jump, route, surface, score, shards and outcomes
Worker/fallback patch generation and request correlation
patch controller focus, membership, queue, cache and delivery
active patch set and terrain slot ownership
tree-cell batch replacement, release, flush and overflow
grass instance materialization and bounds
shard/pickup projection and collection filtering
fixed-collider materialization and Rapier replacement
height sampling, collision and outcome admission
camera follow and Three rendering
HUD, transitions and public host observation
runtime graph, input, surface, profile, creator, streaming, shard,
  collision, cadence, readiness, outcome, frame, host, reset and lifecycle authorities
validation, static deployment and Pages
active-content coalescing, budget, revision, commit, rollback and frame authority: missing
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
  browser input adapter, creature/camera/render host adapters
```

Detailed services are retained in `.agent/kit-registry.json` and the timestamped tracker.

## Required domain

```txt
prehistoric-rush-active-content-materialization-authority-domain
```

```txt
controller membership observation
  -> aggregate release and activation delta
  -> runtime/run/stream/content revision admission
  -> deterministic per-consumer plans
  -> elapsed-time and work-unit budget admission
  -> detached prepare results
  -> atomic commit or predecessor rollback
  -> exact resource retirement
  -> controller/render/physics parity digest
  -> visible-frame acknowledgement
  -> detached observation and bounded journal
```

## Required invariants

```txt
release and activation in one frame produce one materialization commit
all required consumers cite one active-content revision and patch digest
no partial terrain/tree/grass/shard/collider state becomes public
work admission is independent of display refresh rate
failed required consumers preserve the predecessor revision
stale runtime, run, stream or content plans cannot commit
physics and fallback collision consume the committed collider revision
rendering and HUD cite the committed content revision
one visible frame acknowledges each successful commit
```

## Ordered safe ledges

```txt
0 runtime module graph admission
0a browser input command authority
0b render-surface resolution/frame correlation
1 route/profile proof
2 creator authority
3 patch activation/release authority
3a active-content materialization/coalescing authority
3b shard identity/collection/visible removal authority
4 collider replacement/admission
5 run-step outcome authority
6 stream cadence/time budget
7 world readiness
8 committed frame/read model
8a public host gateway
9 coordinated reset epochs
10 lifecycle/disposal
```

No runtime behavior changed and no materialization-correctness, performance or deployment-readiness claim is made.