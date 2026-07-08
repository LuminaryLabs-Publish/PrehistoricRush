# PrehistoricRush DSK Cutover Map

## Goal

PrehistoricRush should become a thin game composition host, not a monolithic runtime.

`src/runtime-terrain-v6.mjs` is frozen as the current working visual reference.

New work should move systems into small conceptual Domain Service Kits.

## Core language

```txt
Domain
  A boundary of meaning.

Kit
  An installable service that controls a domain.

Entity
  Any addressable thing controlled by a domain service.
  This can be an object, descriptor, subsystem, rule, stream, or even another kit.

Subdomain
  A smaller domain inside a larger domain.

Descriptor
  Data emitted by one domain so another domain or adapter can consume it.

Adapter
  A domain that translates descriptors into an external runtime such as Three.js.

Event
  A deterministic message that connects domains without direct ownership.
```

## Composition rule

```txt
game.js
|
|-- installs conceptual domain kits
|-- wires event flow
|-- starts the tick loop
|-- exposes debug state
`-- does not own deep gameplay or render rules
```

## Visual ownership split

```txt
Visual Quality
|
|-- Dino quality
|   |-- dino-form-domain-kit
|   |-- dino-pose-domain-kit
|   |-- dino-material-domain-kit
|   `-- three-dino-adapter
|
|-- Terrain quality
|   |-- terrain-height-domain-kit
|   |-- terrain-color-domain-kit
|   |-- terrain-mesh-domain-kit
|   `-- three-terrain-adapter
|
|-- Prop quality
|   |-- tree-form-domain-kit
|   |-- rock-form-domain-kit
|   |-- shard-form-domain-kit
|   `-- three-prop-adapter
|
`-- Camera quality
    |-- camera-domain-kit
    `-- three-camera-adapter
```

## First cutover scope

This pass creates the composition skeleton and the first extracted dino domains.

```txt
src/game.js
src/domain-runtime/event-bus.js
src/domain-runtime/domain-host.js
src/domain-runtime/tick-scheduler.js
src/domains/dino/dino-form-domain-kit.js
src/domains/dino/dino-pose-domain-kit.js
src/domains/dino/dino-material-domain-kit.js
src/domains/dino/index.js
src/adapters/three-dino-adapter.js
```

## Active runtime strategy

For this pass, `game.js` still delegates to the legacy visual runtime so the live page remains playable.

The new domain files are intentionally small, idempotent, and descriptor-based so later passes can replace legacy internals one domain at a time.
