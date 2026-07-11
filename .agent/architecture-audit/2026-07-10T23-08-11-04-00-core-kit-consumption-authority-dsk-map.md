# Architecture Audit: Core-Kit Consumption Authority DSK Map

**Timestamp:** `2026-07-10T23-08-11-04-00`

## Architecture shape

```txt
src/game.js
  -> createPrehistoricRushKitGraph(NexusEngine, config)
     -> 12 Nexus Engine core kits
     -> prehistoric-rush-domain-kit
        -> drunk-route-generator
        -> procedural-dino-body
  -> createRealtimeGame({ kits })
  -> external browser/Rapier/Three adapter
```

This is a better composition shape than the prior six-domain browser assembly, but the current graph is primarily an installation declaration. Runtime service consumption remains concentrated in `src/game.js`.

## DSK map

| DSK / kit | Declared responsibility | Actual runtime consumer | Current authority |
|---|---|---|---|
| `core-input-kit` | actions, bindings, input state | none visible | local browser input + game-domain InputState |
| `core-spatial-kit` | spatial/transform capability | none visible | Three objects + raw run coordinates |
| `core-scene-kit` | scenes and transitions | game domain + host readback | core scene |
| `core-physics-kit` | physics provider contract | none visible | external Rapier adapter |
| `core-motion-kit` | motion capability | none visible | `PrehistoricRushRunSystem` |
| `core-camera-kit` | camera capability | none visible | inline Three camera |
| `core-animation-kit` | animation capability | none visible | direct dino-body pose call |
| `core-graphics-kit` | frame/render capability | none visible | direct Three renderer |
| `core-skybox-kit` | sky descriptor | none visible | scene background/fog only |
| `core-ui-kit` | UI/view projection | none visible | direct DOM/HUD mutation |
| `core-diagnostics-kit` | diagnostics/readback | none visible | custom global host |
| `core-composition-kit` | composition graph | `engine.gameComposer` reference | partial / unproven |
| `prehistoric-rush-domain-kit` | run/route/surface/score/outcome | engine simulate phase + host adapter | authoritative game mutation |
| `drunk-route-generator` | route plan/query | game domain and render adapter | shared route service |
| `procedural-dino-body` | body/pose/snapshot | render adapter | character visual service |

## Parent-domain services

```txt
resources:
  prehistoric-rush.run-state
  prehistoric-rush.input-state

events:
  prehistoric-rush.run-started
  prehistoric-rush.run-failed
  prehistoric-rush.run-won
  prehistoric-rush.shard-collected

system:
  PrehistoricRushRunSystem / simulate phase

API:
  route
  dinoBody
  config
  setHeightSampler()
  setInput()
  start()
  fail()
  collectShard()
  getState()
  getInput()
  snapshot()
```

## Ownership mismatch

The parent domain owns run mutation but depends on callbacks and side effects from the host:

```txt
host provides heightSampler
host provides browser input
host provides collision evidence
host provides shard-overlap evidence
host provides external physics state
host performs render and HUD projection
host owns frame timing and lifecycle
```

The game domain therefore does not represent a complete game transaction. It is a simulation state owner embedded inside a larger untyped host transaction.

## Composition authority contract

The next composition manifest should produce immutable rows such as:

```json
{
  "kitId": "core-physics-kit",
  "declared": true,
  "installed": true,
  "apiAvailable": true,
  "consumed": false,
  "replaced": true,
  "consumerId": "rapier-host-adapter-kit",
  "reason": "external adapter owns active physics path"
}
```

Required classifications:

```txt
declared
installed
api available
consumed
replaced
unused
required
consumer owner
source revision
install result
```

## Corrected target composition

```txt
PrehistoricRushDomain
  -> RunState / commands / results / events
  -> drunk-route-generator
  -> procedural-dino-body
  -> core-scene adapter
  -> core-input adapter
  -> core-physics provider adapter
  -> core-motion ownership or explicit domain replacement
  -> core-camera adapter or explicit Three replacement
  -> core-animation adapter or explicit dino-body replacement
  -> core-graphics adapter or explicit Three replacement
  -> core-ui adapter or explicit DOM replacement
  -> core-diagnostics projection
  -> core-composition manifest and ledger
```

Unused capabilities should be removed instead of retained as decorative dependencies.

## Next safe ledge

```txt
PrehistoricRush Core-Kit Consumption Authority
+ Kit-Graph / Thin-Adapter Fixture Gate
```

The gate passes only when installation, service availability and runtime consumption are independently observable and reconcile exactly.