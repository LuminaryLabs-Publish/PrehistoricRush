# START HERE: PrehistoricRush

**Last aligned:** `2026-07-10T23-08-11-04-00`

**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

**Branch:** `main`

## Current implementation gate

```txt
PrehistoricRush Core-Kit Consumption Authority
+ Kit-Graph / Thin-Adapter Fixture Gate
```

The runtime was refactored after the prior audit. It now installs one `prehistoric-rush-domain-kit`, two nested specialized kits, and twelve Nexus Engine core kits, but the browser host still directly owns input capture, Rapier setup, terrain, population, camera, animation calls, rendering, HUD, frame scheduling, and diagnostics. Only scene transitions are visibly routed through a composed core service.

## Selection

The accessible `LuminaryLabs-Publish` installation contains ten repositories. `TheCavalryOfRome` remains excluded. All nine eligible repositories have a central ledger and root `.agent` state.

`PrehistoricRush` was selected before the oldest-document fallback because its runtime changed after its latest central audit:

```txt
central ledger last updated: 2026-07-10T22-42-00-04-00
runtime refactor completed: 2026-07-10T23-02-57-04-00
selection reason: current architecture and kit graph were undocumented
```

## Active interaction loop

```txt
index.html
  -> src/runtime.mjs
  -> src/game.js
  -> import NexusEngine@main, Three.js, Rapier, and rapier-physics-domain-kit@main
  -> createPrehistoricRushKitGraph()
  -> install 12 core kits + prehistoric-rush-domain-kit
  -> create inline browser/Rapier/Three adapter
  -> start run and populate current 7 x 7 chunk window
  -> browser input mutates local input state and calls game.setInput()
  -> engine.tick(dt) advances the game-domain run system
  -> adapter updates terrain/population/physics contacts/pickups
  -> adapter projects dino pose, camera, HUD, and render frame
  -> requestAnimationFrame schedules the next frame
  -> PrehistoricRushHost exposes live engine/physics/adapter references and aggregate snapshots
```

## Main finding

The composition graph is declared, but service consumption is not authoritative or observable.

```txt
core-input        installed, browser listeners bypass it
core-physics      installed, external Rapier bridge lives outside it
core-motion       installed, run movement is custom domain mutation
core-camera       installed, Three camera is updated inline
core-animation    installed, dino pose is applied inline
core-graphics     installed, Three renderer is called inline
core-skybox       installed, no core skybox consumer is visible
core-ui           installed, DOM/HUD are inline
core-diagnostics  installed, host readback is custom and incomplete
core-composition  installed, graph exists but consumption rows are absent
core-scene        installed and directly used for transitions
core-spatial      installed with no visible runtime consumer
```

The refactor also retained the streamed-population mutation path. Tree, grass, and shard pools use mutable `InstancedMesh.count` as the next population ceiling after overwriting it with the previous active count, so population capacity can shrink between windows.

## Read first

```txt
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-10T23-08-11-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-10T23-08-11-04-00.md
.agent/architecture-audit/2026-07-10T23-08-11-04-00-core-kit-consumption-authority-dsk-map.md
.agent/render-audit/2026-07-10T23-08-11-04-00-thin-render-adapter-consumption-gap.md
.agent/gameplay-audit/2026-07-10T23-08-11-04-00-domain-run-adapter-contact-loop.md
.agent/interaction-audit/2026-07-10T23-08-11-04-00-browser-input-core-action-bypass-map.md
.agent/composition-authority-audit/2026-07-10T23-08-11-04-00-declared-installed-consumed-contract.md
.agent/deploy-audit/2026-07-10T23-08-11-04-00-kit-graph-adapter-fixture-gate.md
```

## Safe order

```txt
1. Freeze and expose a composition manifest.
2. Record declared, installed, available, consumed, replaced, and unused status per kit.
3. Route browser input and Rapier through explicit adapters with typed results.
4. Remove unused core kits or make their service consumption real.
5. Pin NexusEngine and ProtoKit source revisions.
6. Add a DOM-free kit-graph fixture.
7. Add a browser adapter-consumption smoke.
8. Return to population admission using immutable allocation capacities.
```

Documentation only. This pass did not alter runtime source, dependencies, rendering, physics, routes, or deployment behavior.