# Project Breakdown: PrehistoricRush

Timestamp: `2026-07-10T18-01-03-04-00`

## Goal

Refresh the internal project breakdown after comparing the complete `LuminaryLabs-Publish` inventory against the central ledger, then identify the next source-owned architectural ledge without changing runtime behavior.

## Selection ledger

```txt
PrehistoricRush     selected / prior 2026-07-10T16-28-47-04-00
AetherVale          tracked / 2026-07-10T16-40-44-04-00
IntoTheMeadow       tracked / 2026-07-10T16-51-37-04-00
HorrorCorridor      tracked / 2026-07-10T17-00-54-04-00
PhantomCommand      tracked / 2026-07-10T17-08-36-04-00
ZombieOrchard       tracked / 2026-07-10T17-18-47-04-00
TheUnmappedHouse    tracked / 2026-07-10T17-29-23-04-00
MyCozyIsland        tracked / 2026-07-10T17-38-35-04-00
TheOpenAbove        tracked / 2026-07-10T17-51-35-04-00
TheCavalryOfRome    excluded by rule
```

All nine eligible repositories were already tracked and had root `.agent` state. The oldest documented-selection fallback therefore applied.

## Interaction loop

```txt
browser shell
  -> composition bootstrap
  -> repo-local domain installation
  -> runtime CDN dependency loading
  -> shell / scene / renderer / physics mount
  -> menu Start
  -> primary gameplay and render RAF
  -> secondary presentation and render RAF
  -> contact or distance terminal state
  -> scene-only Retry / Run Again
  -> mutable host readback
```

## Domains identified

The route uses browser/runtime entry, composition, event bus, domain host, scheduler, dino form/pose/material, camera, HUD, external module resolution, dependency admission, source provenance, Three.js, Rapier, physics bridge, scene state, session lifecycle, input, movement, terrain, spawn, collision, pickup, scoring, storage, presentation, render, host projection, manifest/source contract, deployment, and central-ledger domains.

## Kits identified

Implemented repo-local kits:

```txt
event-bus-kit
domain-host-kit
tick-scheduler-kit
dino-form-domain-kit
dino-pose-domain-kit
dino-material-domain-kit
dino-domain-bundle-kit
camera-domain-kit
hud-domain-kit
```

Live external kit/module surfaces:

```txt
three@0.179.1
@dimforge/rapier3d-compat@0.15.0
rapier-physics-domain-kit from NexusRealtime-ProtoKits@main
```

Runtime-implied kits include shell/entry, module loading, dependency admission, provenance, fallback policy, runner input/simulation, terrain/spawn, contacts, pickups, session/restart, listener/RAF ownership, graphics/physics disposal, presentation, render submission, host projection, and fixtures.

## Services identified

Services cover event subscription/emission, domain installation/ticking/snapshots, RAF scheduling, dino descriptors and pose projection, camera/HUD descriptors, dynamic import, fallback module selection, Rapier world/actor/collider/contact bridging, deterministic terrain sampling, instanced population, input mutation, movement/jump/contact/pickup/score mutation, best-distance persistence, scene/HUD/render projection, and browser host readback.

## Main finding

The existing split-frame and restart gaps are compounded by runtime dependency admission and lifecycle ownership. The external physics kit is loaded from a mutable `@main` URL, import failures are collapsed to `null`, fallback is not typed, and no source provenance reaches the host. Global listeners, both RAF chains, renderer assets, physics assets, and subscriptions have no shared dispose/remount contract.

## Next safe ledge

```txt
PrehistoricRush Runtime Dependency Admission + Single-Owner Session Lifecycle Fixture Gate
```

## Validation

Documentation-only. Runtime source, dependencies, routes, and deployment were unchanged. No branch or pull request was created. Runtime/browser fixtures were unavailable and not run.