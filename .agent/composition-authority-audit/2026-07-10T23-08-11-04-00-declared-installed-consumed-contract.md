# Composition Authority Audit: Declared / Installed / Consumed Contract

**Timestamp:** `2026-07-10T23-08-11-04-00`

## Problem statement

The new runtime correctly centralizes gameplay state inside one parent domain and declares a broad Nexus Engine core-kit graph. The graph currently lacks the evidence needed to distinguish three different facts:

```txt
kit is declared in createPrehistoricRushKitGraph()
kit installed successfully into the engine
kit services are consumed by the active runtime
```

These facts are not equivalent.

## Current graph

```txt
core-input-kit
core-spatial-kit
core-scene-kit
core-physics-kit
core-motion-kit
core-camera-kit
core-animation-kit
core-graphics-kit
core-skybox-kit
core-ui-kit
core-diagnostics-kit
core-composition-kit
prehistoric-rush-domain-kit
  drunk-route-generator
  procedural-dino-body
```

## Current evidence matrix

| Kit | Declared | Install implied | Direct active use visible | Active replacement |
|---|---:|---:|---:|---|
| core-input | yes | yes | no | browser input + game InputState |
| core-spatial | yes | yes | no | raw coordinates + Three transforms |
| core-scene | yes | yes | yes | none |
| core-physics | yes | yes | no | external Rapier adapter |
| core-motion | yes | yes | no | game-domain simulation system |
| core-camera | yes | yes | no | inline Three camera |
| core-animation | yes | yes | no | direct procedural pose |
| core-graphics | yes | yes | no | direct Three renderer |
| core-skybox | yes | yes | no | inline scene background/fog |
| core-ui | yes | yes | no | direct DOM/HUD projection |
| core-diagnostics | yes | yes | no | custom global host |
| core-composition | yes | yes | partial | `engine.gameComposer` reference |

## Required composition row

Each declared kit should emit or be represented by one immutable row:

```json
{
  "kitId": "core-input-kit",
  "requestedVersion": "resolved-from-engine-source",
  "declared": true,
  "installed": true,
  "apiAvailable": true,
  "required": true,
  "consumed": true,
  "replaced": false,
  "unused": false,
  "consumerId": "browser-input-core-adapter-kit",
  "services": ["actions", "bindings", "input-state"],
  "sourceRevision": "immutable-sha",
  "installRevision": 1,
  "reason": "browser events normalized through core-input"
}
```

## Admission rules

```txt
required + unavailable
  -> reject startup

declared + installed + consumed
  -> valid

declared + installed + replaced + named replacement
  -> valid when policy allows replacement

declared + installed + unused
  -> fail fixture or remove kit

declared + install failure
  -> reject startup with typed source/install result
```

## Source authority

The composition manifest must include immutable revisions for:

```txt
NexusEngine
Three.js
Rapier
rapier-physics-domain-kit
repo runtime source
parent domain
nested kits
```

Mutable `@main` resolution is not sufficient proof. The requested URL, resolved commit and content fingerprint should be independently observable.

## Adapter registry

A second immutable registry should map runtime adapters to the services they consume or replace:

```txt
browser-input-core-adapter-kit
rapier-core-physics-adapter-kit
three-spatial-adapter-kit
three-camera-adapter-kit
procedural-animation-adapter-kit
three-graphics-adapter-kit
scene-background-skybox-adapter-kit
dom-ui-adapter-kit
host-diagnostics-adapter-kit
```

Each adapter should expose:

```txt
adapter id
consumed core kit/service
input contract
output/result contract
lifecycle owner
source revision
state revision
last result
```

## Host readback target

```js
PrehistoricRushHost.getCompositionState()
```

Should return JSON-safe values only:

```txt
composition revision
composition fingerprint
source revisions
kit rows
adapter rows
required-service admission result
unconsumed declarations
replacement policy
startup result
```

## Fixture gate

```txt
1. import pinned NexusEngine revision
2. create the kit graph
3. create the engine headlessly
4. enumerate installed APIs and resources
5. compare against the manifest
6. apply adapter consumption declarations
7. reject unclassified or unused required kits
8. snapshot and fingerprint the final composition
9. repeat and prove deterministic equality
```

## Decision

The next safe implementation is not another domain or visual subsystem. It is a truthful composition contract that either wires the declared core kits into the active runtime or removes declarations that are not part of the product.