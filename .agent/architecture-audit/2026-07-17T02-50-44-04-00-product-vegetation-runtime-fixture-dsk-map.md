# Product Vegetation Runtime Fixture DSK Map

**Timestamp:** `2026-07-17T02-50-44-04-00`

## Intent

Define the domain boundary required to prove that PrehistoricRush product modules operate against the actual pinned Nexus Engine runtime rather than only against local import and test-double fixtures.

## Current composition

```txt
product source
  prehistoric-vegetation-domain
  prehistoric-tree-fidelity-runtime
  vegetation-tree-fidelity-provider
  prehistoric-patch-generator
  prehistoric-patch-worker

source proof
  syntax checks
  product export import fixture
  test-owned placement fixture
  dense deterministic spawn fixture

production boundary not executed by source proof
  pinned Nexus Engine module
  Core Object and Core Vegetation installation
  semantic catalog registration
  Worker initialization
  browser/CDN import graph
  Three.js tree frame
```

## Existing domains

```txt
Core Object
Core Object Shape
Core Object Fidelity
Core Assets
Core Startup
Core Capture
Core Vegetation
Vegetation Ecology
Vegetation Tree
Vegetation Foliage
Vegetation Object Bridge
PrehistoricRush world/patch/tree/collision/render domains
Worker execution
browser module delivery
```

## Required parent domain

`prehistoric-rush-product-vegetation-runtime-fixture-authority-domain`

## Proposed DSK split

```txt
product-vegetation-fixture-manifest-kit
  source, engine, Worker, browser, package, and frame revisions

pinned-engine-module-loader-fixture-kit
  exact engine URL/ref loading and export validation

actual-vegetation-runtime-construction-fixture-kit
  createCoreObjectDomain composition and runtime creation

semantic-catalog-registration-fixture-kit
  ten species, tree, foliage, and object registrations

product-placement-api-fixture-kit
  actual selectSpecies and createInstanceDescriptor calls

main-thread-patch-contract-fixture-kit
  product generator execution with actual placement API

worker-patch-contract-fixture-kit
  production Worker initialization and request settlement

main-worker-instance-parity-fixture-kit
  deterministic instance, matrix, and collider comparison

browser-cdn-module-graph-fixture-kit
  browser origin loading and startup settlement

pages-origin-module-graph-fixture-kit
  deployed-origin loading and asset parity

product-vegetation-fixture-result-kit
  typed result, evidence digest, and failure classification

first-product-vegetation-patch-ack-kit
first-product-vegetation-frame-ack-kit
```

## Ownership rule

A test double may validate deterministic patch mechanics, but it must not satisfy product-runtime, Worker-runtime, browser-module, or rendered-frame conformance gates.