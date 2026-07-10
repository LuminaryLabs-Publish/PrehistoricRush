# Architecture Audit: Runner Source Event Readback DSK Map

**Timestamp:** `2026-07-10T13-30-15-04-00`

## Current architecture

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> event-bus-kit / domain-host-kit / tick-scheduler-kit
  -> dino, camera, and HUD domain kits
  -> src/runtime-terrain-v6.mjs
  -> Three.js + Rapier + rapier-physics-domain-kit
  -> inline runner state mutation
  -> inline presentation mutation
  -> aggregate PrehistoricRushHost.getState()
```

## DSK map

| Layer | Current kits | Gap |
| --- | --- | --- |
| Composition | event bus, domain host, scheduler | Live runner does not feed source events back into composition history. |
| Dino | form, pose, material | Pose kit waits for `runner.moved`, but runtime does not emit stable moved records. |
| Camera/HUD | camera preset, HUD model | Runtime and presentation pass write camera/HUD directly without source frame ids. |
| Physics | Rapier bridge kit | Contact rows remain aggregate and are not tied to runner movement results. |
| Runtime | terrain, input, runner motion, pickup, scene, best-distance implied kits | These are still inline in `runtime-terrain-v6.mjs`. |
| Host | PrehistoricRushHost aggregate object | No serializable presentation/source proof block. |

## Domains that need source rows

```txt
keyboard-input
runner-motion
runner-turn-yaw
runner-jump-gravity
runner-contact
runner-pickup
runner-scene-dispatch
best-distance-storage
dino-pose-frame
camera-frame-request
hud-frame-request
render-readback
host-presentation-snapshot
```

## Required proof shape

Each frame should be able to expose a shared source frame id across:

```txt
input result
movement result
runner.moved event
contact result
pickup result
scene dispatch result
best-distance result
dino pose frame
camera frame request
HUD frame request
render readback
host presentation snapshot
```

## Main finding

The repo does not need a new renderer or terrain rewrite first. It needs additive source-event rows that make the existing DSK wrapper authoritative enough for fixtures.
