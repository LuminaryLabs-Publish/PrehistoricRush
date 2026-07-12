# Current Audit: PrehistoricRush Browser Input Command Authority

**Updated:** `2026-07-12T05-21-52-04-00`

## Summary

The active browser game bypasses the installed `core-input-kit` capability. Global listeners mutate a host-side held-state object, call `game.start()` or `game.setInput()` directly, and copy steering/boost into the product domain every RAF. Enter is not phase-gated, browser repeat is not classified, and Space mixes press-edge and repeated pulse semantics.

## Plan ledger

**Goal:** make one input authority responsible for normalized observation, edge/hold state, phase/run admission, duplicate handling, lifecycle retirement, simulation-step consumption and visible-frame proof.

- [x] Trace button, keydown, keyup and blur ingress.
- [x] Trace host-side state and product `InputState` mutation.
- [x] Confirm active-run Enter replacement and repeat gaps.
- [x] Confirm the installed core input capability is not the browser owner.
- [x] Inventory interaction loops, domains, kits and services.
- [x] Define parent domain, candidate kits and fixture gate.
- [ ] Implement and execute the input transaction.

## Complete interaction loop

```txt
menu/profile -> creator or game
creator -> profile draft -> procedural preview -> persistence

game startup
  -> pinned modules -> engine graph -> Worker/fallback generator
  -> patch controller -> physics -> camera -> Three renderer
  -> game.start -> stream prime -> camera reset

button
  -> game status: jump
  -> non-game status: start

keyboard
  -> Enter: start in every phase
  -> Space: jump during game, start otherwise
  -> A/D/arrows/W: mutate host held flags
  -> keyup: clear held flags
  -> blur: clear host and product input

frame
  -> copy host steer/boost to product InputState
  -> engine tick consumes steer/boost/jump
  -> product system clears jump pulse
  -> streaming, collision, shards, render, HUD and host readback
```

## Source-backed findings

```txt
core-input-kit installed: yes
browser input routed through core input: no
parallel host held-state owner: yes
button/keyboard policy parity: no
Enter active-game admission: absent
explicit restart command: absent
browser repeat inspection: absent
physical press/release edge state: absent
input command ID: absent
input revision: absent
run/state revision admission: absent
simulation-step consumption result: absent
first visible-frame acknowledgement: absent
```

The button path checks status before choosing jump or start. The Enter path calls `start()` unconditionally, so it can replace an active run. `start()` increments `runId`, replaces run and input resources, emits `RunStarted`, primes streaming and resets the camera.

The product simulation clears `input.jump` after consumption. Because key repeat is not rejected and no physical edge state exists, a later Space repeat can set jump again without a release.

## Domains in use

```txt
page routing and profile lifecycle
creator draft, preview, transition and persistence
runtime source identity, import maps and module loading
Nexus Engine composition and core capabilities
browser keyboard, button, focus and resize observation
host-side held input state
product run, input, movement, jump, shards and outcomes
Worker patch generation, queue, cache and membership
terrain, vegetation, colliders, shards and height
Rapier and fallback collision
camera follow and Three rendering
HUD, transitions and public host observation
runtime graph, surface, shard, outcome, frame, host, reset and lifecycle authorities
validation, static deployment and Pages
input command, edge/hold, retirement, step and frame authority: missing
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
prehistoric-rush-input-command-authority-domain
```

```txt
browser observation
  -> normalized sample with source/code/repeat evidence
  -> edge or hold classification
  -> runtime/run/phase/revision admission
  -> command identity and idempotency
  -> authoritative core input state
  -> focus/visibility/reset/disposal retirement
  -> immutable simulation-step input snapshot
  -> consumption result
  -> visible-frame acknowledgement
  -> detached observation and bounded journal
```

## Required invariants

```txt
Enter cannot replace an active run without explicit restart admission
one physical press produces at most one edge action
browser repeat never creates a new edge
held controls retire on release, blur, visibility loss, reset and disposal
button and keyboard adapters use the same semantic policy
core-input-kit is the engine-facing input owner
one simulation step consumes one immutable input revision
visible readback cites the input revision and command IDs consumed
```

## Ordered safe ledges

```txt
0 runtime module graph admission
0a browser input command admission and edge/hold authority
0b render-surface resolution/frame correlation
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

No runtime behavior changed and no input-correctness, gameplay or deployment-readiness claim is made.