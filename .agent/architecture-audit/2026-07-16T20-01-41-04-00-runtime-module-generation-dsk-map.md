# Architecture Audit: Runtime Module Generation DSK Map

**Timestamp:** `2026-07-16T20-01-41-04-00`

## Goal

Make one accepted runtime generation the prerequisite for every route, kit, provider, Worker, engine composition and frame.

## Current ownership map

```txt
runtime-versions.js
  -> owns shared dynamic-import URLs

game.html
  -> independently owns game bare-specifier mapping

charactercreator.html
  -> independently owns creator bare-specifier mapping

NexusEngine-Kits modules
  -> import bare nexusengine
  -> create kit descriptors and object primitives

game/creator hosts
  -> dynamically import another Nexus Engine namespace
  -> create engines and compose external kit results
```

## Domain breakdown

```txt
browser module-resolution domain
  import maps, URL resolution, module cache and document generation

runtime dependency domain
  Nexus Engine, NexusEngine-Kits, ProtoKits, Three.js and Rapier revisions

composition domain
  core domains, official kits, product kits, asset runtime and provider installation

presentation domain
  creator preview, game viewport and first-frame acknowledgements

deployment domain
  source, static build, CDN and Pages module identity
```

## Required parent DSK

`prehistoric-rush-runtime-module-generation-identity-authority-domain`

## Required services

```txt
manifest admission
URL normalization
commit and package identity extraction
module namespace provenance
kit-linked runtime provenance
descriptor and object-factory provenance
provider and Worker provenance
mixed-generation rejection
stale generation retirement
route parity
admission results
creator/game first-frame acknowledgements
source/browser/build/Pages proof
```

## Planned DSK family

```txt
runtime-module-manifest-kit
document-import-map-inspection-kit
runtime-url-normalization-kit
runtime-commit-identity-kit
runtime-module-generation-digest-kit
kit-linked-runtime-provenance-kit
module-namespace-identity-kit
descriptor-factory-provenance-kit
object-descriptor-provenance-kit
physics-provider-provenance-kit
worker-runtime-provenance-kit
mixed-runtime-generation-rejection-kit
stale-module-generation-retirement-kit
cross-route-runtime-parity-kit
runtime-module-admission-result-kit
first-single-runtime-creator-frame-ack-kit
first-single-runtime-game-frame-ack-kit
runtime-module-source-fixture-kit
runtime-module-browser-fixture-kit
runtime-module-build-pages-parity-fixture-kit
```

## Boundary

This authority does not own gameplay, simulation semantics, renderer implementation, tree fidelity, physics behavior or CDN operation. It owns admission and proof that all those consumers bind to one exact runtime generation.