# PrehistoricRush Presentation Authority Audit

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Created:** `2026-07-08T06:51:12-04:00`

## Purpose

This audit captures the next authority seam after the latest source read.

`src/game.js` now installs `camera-domain-kit` and `hud-domain-kit`, but the live presentation pass still directly mutates camera position, HUD DOM, dino stride, and renderer output from `globalThis.PrehistoricRushHost.app`.

The next safe pass should not replace the visible game.

It should make camera, HUD, runner movement, and dino pose facts fixture-readable before more rendering polish.

## Source-backed seam

```txt
src/game.js
  -> installs dino form/pose/material domains
  -> installs camera-domain-kit
  -> installs hud-domain-kit
  -> exposes PrehistoricRushComposition.snapshot()
  -> imports runtime-terrain-v6.mjs
  -> starts presentation pass
  -> reads PrehistoricRushHost.app
  -> mutates HUD DOM, camera, dino stride, and renderer frame directly
```

```txt
src/runtime-terrain-v6.mjs
  -> owns live app.state
  -> owns input flags
  -> owns terrain sampling/rebuild
  -> owns Rapier actor transform and contact checks
  -> owns hazard/pickup/win scene mutation
  -> owns PrehistoricRushHost.getState()
```

## New domain kits observed

```txt
camera-domain-kit
  path: src/domains/camera/camera-domain-kit.js
  descriptor: close-third-person-v1
  services:
    - install({ eventBus })
    - getDescriptor()
    - snapshot()
    - camera.preset.ready event

hud-domain-kit
  path: src/domains/hud/hud-domain-kit.js
  descriptor: readability-hud-v1
  services:
    - install({ eventBus })
    - render(snapshot)
    - getDescriptor()
    - snapshot()
    - hud.ready event
```

## Main issue

The descriptors exist, but the live render route does not yet consume them as authority.

Current live authority still flows through direct functions:

```txt
applyCloseCamera(app, THREE, dt)
renderHud(app)
applyReadableStride(app)
app.view.renderer.render(app.view.scene, app.view.camera)
```

Those functions should become consumers of fixture-readable domain records, not the source of truth.

## Required fixture matrix

| Fixture | Input | Expected record | Reason |
| --- | --- | --- | --- |
| `camera.preset.ready` | composition bootstrap | close-third-person descriptor | Proves camera domain is installed. |
| `hud.ready` | composition bootstrap | readability HUD descriptor | Proves HUD domain is installed. |
| `runner.moved` | current live runner state | speed, turn, jump, time, position | Lets dino pose consume runner facts. |
| `dino.pose.changed` | `runner.moved` payload | pose descriptor | Proves pose bridge is live. |
| `camera.frame.requested` | runner source state + camera preset | camera target/lookAt descriptor | Separates camera policy from camera mutation. |
| `hud.frame.requested` | runner source state + HUD descriptor | title/progress/metric/debug payload | Separates UI projection from DOM mutation. |
| `render.frame.presented` | scene/camera/HUD descriptors | frame metadata | Allows smoke proof without comparing pixels. |
| `host.presentation.snapshot` | host diagnostics | latest presentation records | Gives external debug without reading DOM. |

## Descriptor ownership target

```txt
runtime-terrain-v6.mjs
  -> may keep visual implementation temporarily
  -> must emit runner source facts
  -> must not be the only readable authority for camera/HUD/dino presentation

camera-domain-kit
  -> owns camera preset descriptor
  -> should produce camera frame descriptors from runner facts

hud-domain-kit
  -> owns HUD layout descriptor
  -> should produce HUD frame descriptors from runner facts

dino-pose-domain-kit
  -> owns pose descriptor
  -> should consume runner.moved facts
```

## Next implementation ledge

```txt
PrehistoricRush Presentation Descriptor Fixture Gate
```

Build only the proof layer first:

```txt
1. Preserve index.html, src/runtime.mjs, src/game.js, and visible runtime route.
2. Emit runner.moved from the live movement step.
3. Feed runner.moved into dino-pose-domain-kit.
4. Add camera.frame.requested records from camera-domain-kit descriptor + runner source state.
5. Add hud.frame.requested records from hud-domain-kit descriptor + runner source state.
6. Expose latest presentation records through PrehistoricRushHost.getState() or a non-breaking nested diagnostics field.
7. Add a DOM-free fixture that verifies camera, HUD, and dino pose descriptors are produced from the same runner source facts.
```

## Stop condition

Stop when a fixture can prove this chain without browser DOM assertions:

```txt
runner source state
  -> runner.moved
  -> dino.pose.changed
  -> camera.frame.requested
  -> hud.frame.requested
  -> host presentation snapshot
```

Do not start renderer replacement until that chain is stable.
