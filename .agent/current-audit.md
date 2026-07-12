# Current Audit: PrehistoricRush Render Surface Authority

**Updated:** `2026-07-12T02-21-55-04-00`

## Summary

The gameplay renderer and camera use global window dimensions, while the character creator uses a local preview-container `ResizeObserver`. Both sample device pixel ratio only during renderer construction. Neither path emits an authoritative surface result, physical-buffer receipt, surface revision or first-frame acknowledgement.

## Plan ledger

**Goal:** make one render-surface policy and transaction the authority for creator and gameplay size, DPR, camera projection, renderer buffer, diagnostics and visible-frame correlation.

- [x] Trace creator and gameplay surface construction and resize ingress.
- [x] Compare CSS-size, DPR and camera/renderer commit policies.
- [x] Inventory interaction loops, domains, kits and services.
- [x] Define parent domain, candidate kits and fixture gate.
- [ ] Implement and execute the surface transaction.

## Complete interaction loop

```txt
menu/profile -> creator or game
creator -> pinned modules -> local renderer/camera -> container ResizeObserver
        -> profile edits -> procedural preview -> RAF
game -> runtime graph -> engine/Worker/physics -> window-sized renderer/camera
     -> global keyboard/blur/resize listeners
resize -> direct renderer/camera mutation without a result
RAF -> input -> simulation -> streaming -> collision -> pickups -> render -> HUD
host -> subsystem snapshots without surface provenance
```

## Source-backed findings

```txt
gameplay CSS dimensions: innerWidth / innerHeight
gameplay startup DPR: min(devicePixelRatio, 2)
gameplay DPR resampling: absent
gameplay container observation: absent
creator CSS dimensions: preview.clientWidth / preview.clientHeight
creator ResizeObserver: present
creator startup DPR: min(devicePixelRatio, 2)
creator DPR resampling: absent
shared quality/pixel policy: absent
surface ID/revision: absent
actual physical-buffer readback: absent
first post-resize frame acknowledgement: absent
public surface observation: absent
```

## Domains in use

```txt
page routing and profile lifecycle
creator draft, procedural preview and persistence
runtime source identity, import maps and CDN loading
Nexus Engine composition and 12 core kits
five official NexusEngine-Kits
run, route, movement, surface, score, pickups and outcomes
Worker patch generation, queue, cache and membership
terrain, trees, grass, pickups, colliders and height
Rapier and fallback collision
camera follow and Three rendering
HUD, transitions and public host observation
runtime graph, outcome, frame, host, reset and lifecycle authorities
validation, build and Pages deployment
render-surface resolution and frame correlation: missing
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
prehistoric-rush-render-surface-authority-domain
```

```txt
surface observation
  -> generation and revision admission
  -> coherent CSS-size and DPR sample
  -> quality and physical-pixel policy
  -> renderer and camera commit
  -> actual-value readback
  -> SurfaceCommitResult
  -> first visible frame acknowledgement
  -> detached public observation
```

## Ordered safe ledges

```txt
0 runtime module graph admission
0a render-surface resolution/frame correlation
1 route/profile proof
2 creator authority
3 patch activation/release
4 collider replacement/admission
5 run-step outcome authority
6 stream cadence/time budget
7 world readiness
8 committed frame/read model
8a public host gateway
9 coordinated epochs/reset
10 lifecycle/disposal
```

No runtime behavior changed and no render-surface, cross-page parity or deployment-readiness claim is made.