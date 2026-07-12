# Current Audit: PrehistoricRush Runtime Module Graph Admission

**Updated:** `2026-07-12T00-30-49-04-00`

## Summary

Current browser source pins Nexus Engine `d86188c66692d9c24815aa2b29612c70df8fde4e`, NexusEngine-Kits `9673594de5669b4691737b91a9d56fa282e74370`, ProtoKits `11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5`, Three `0.179.1` and Rapier `0.15.0`. The prior internal registry still recorded older Nexus and Kits commits.

HTML import maps are aligned with the current Nexus pin, but startup has no single source-graph manifest admission, graph fingerprint, graph-wide compatibility result, typed optional-provider decision or frame-correlated source provenance.

## Plan ledger

**Goal:** make one admitted runtime graph the prerequisite for engine, streaming, physics, camera, renderer, diagnostics and first-frame authority.

- [x] Reconcile current runtime source with internal docs.
- [x] Trace import maps, dynamic imports, factory checks and fallback physics.
- [x] Inventory all interaction loops, domains, kits and services.
- [x] Define parent domain, candidate kits and fixture gate.
- [ ] Implement and execute graph admission.

## Complete interaction loop

```txt
menu/profile -> creator or game
creator -> import map + pinned modules -> preview -> profile commit
game -> seven CDN imports -> presence checks -> selected factory checks
     -> Rapier admitted or null fallback
     -> engine/Worker/renderer/camera construction
RAF  -> input -> simulation -> streaming -> collision -> pickups -> render -> HUD
host -> declared version constants and mutable subsystem snapshots
```

## Source-backed findings

```txt
current HTML/runtime Nexus pin parity: yes
previous .agent sourceGraph parity: no, now reconciled
required module object presence check: yes
selected Nexus/Kits factory checks: yes
graph-wide compatibility result: no
sourceGraphFingerprint: no
explicit Rapier/fallback capability result: no
first-frame source provenance: no
public admission read model: no
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
outcome, frame, host capability, reset and lifecycle authorities
validation, build and Pages deployment
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
prehistoric-rush-runtime-module-graph-admission-domain
```

```txt
canonical manifest
  -> import-map parity
  -> candidate load results
  -> export-contract results
  -> compatibility and optional-capability policy
  -> active physics-provider decision
  -> sourceGraphFingerprint
  -> atomic admission
  -> engine composition
  -> first-frame receipt and immutable observation
```

## Ordered safe ledges

```txt
0 runtime module graph admission
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

No runtime behavior changed and no module-compatibility or deployment-readiness claim is made.