# Render Audit: Deployed Render Source Authority Gap

**Timestamp:** `2026-07-10T21-00-16-04-00`

## Current render surface

The active route creates one Three.js scene, perspective camera, WebGL renderer, fog, hemisphere light, directional light, streamed terrain meshes, instanced forest/grass/rock/shard pools, and one procedural skinned raptor. The same RAF updates presentation and submits the frame.

## Render authority mismatch

The public artifact includes scene descriptors and composition manifests, but the active renderer reads only JavaScript-owned values from `src/game.js`.

```txt
declared scene source:
  game-scenes.json
  scenes/menu.json
  scenes/game.json
  scenes/run-over.json
  scenes/win.json

actual scene source:
  state.scene string
  createShell()
  inline Three.js construction
  inline HUD template
```

No render row records which scene/config file supplied the current camera, fog, light, terrain, forest, grass, or HUD values.

## Fixed shadow coverage gap

The directional light and orthographic shadow camera are configured once near the initial origin:

```txt
sun position: -25, 45, -20
shadow bounds: -48 to +48
runner goal distance: 3600
```

The shadow camera is not repositioned around the runner or view. The product can therefore leave the useful shadow volume early in a run, while host readback provides no shadow center, extent, receiver count, or coverage status.

## HUD authority gap

The HUD displays travel distance divided by `goalDistance`. It does not render an explicit route-progress result. The visual progress bar therefore inherits gameplay authority from cumulative movement rather than a monotonic route-completion contract.

## Required render observations

```txt
render source fingerprint
active scene source
resolved camera configuration
resolved fog/light configuration
shadow center and extent
player inside shadow coverage
HUD progress source
population generation ID
rendered/admitted pool counts
```

## Safe boundary

Do not rewrite the renderer. Add source and coverage observations first. After the population and source-contract fixtures pass, move the directional-light target and shadow volume through a camera/player-relative lighting service.
