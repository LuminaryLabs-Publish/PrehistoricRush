# Pinned Vegetation Provider Admission DSK Map

**Timestamp:** `2026-07-17T14-40-21-04-00`  
**Parent authority:** `prehistoric-rush-pinned-vegetation-provider-admission-browser-worker-parity-authority-domain`

## Existing composition

```txt
runtime-versions.js
  -> RUNTIME_URLS.nexus at d4199263

browser main realm
  -> game-runtime-lod.js
  -> import pinned Nexus Engine
  -> createPrehistoricVegetationRuntime()
  -> createCoreObjectDomain({ shape:false, fidelity:false })
  -> Vegetation + Ecology + Tree + Foliage + Object Bridge
  -> register product catalog
  -> create patch generator

Worker realm
  -> prehistoric-patch-worker.js
  -> import same pinned Nexus Engine
  -> create same Vegetation runtime and catalog
  -> publish worker-ready counts
  -> generate transferable patches
```

## Current authority split

```txt
product pin ownership: runtime-versions.js
provider implementation ownership: LuminaryLabs-Dev/NexusEngine
main provider import: game-runtime-lod.js
Worker provider import: prehistoric-patch-worker.js
catalog registration: prehistoric-vegetation-domain.js
stream admission: seeded-world-patch-controller-kit
render adoption: Three.js vegetation and ground-cover layers
proof ownership: local source tests only
```

## Gap

The product pin is shared, but no DSK settles exact provider identity, Foliage placement-service construction, catalog digest and main/Worker parity before world streaming is admitted. The existing local import test does not load the pinned provider.

## Proposed DSK family

```txt
prehistoric-rush-pinned-vegetation-provider-admission-browser-worker-parity-authority-domain
├─ provider-revision-manifest-kit
├─ provider-url-admission-kit
├─ provider-module-identity-kit
├─ core-object-domain-construction-probe-kit
├─ foliage-service-binding-probe-kit
├─ vegetation-catalog-registration-probe-kit
├─ catalog-digest-kit
├─ main-realm-provider-ready-result-kit
├─ worker-realm-provider-ready-result-kit
├─ worker-provider-revision-echo-kit
├─ provider-realm-parity-settlement-kit
├─ stale-provider-result-rejection-kit
├─ startup-failure-classification-kit
├─ provider-fallback-policy-kit
├─ source-provider-import-fixture-kit
├─ browser-main-provider-fixture-kit
├─ browser-worker-provider-fixture-kit
├─ artifact-pages-provider-fixture-kit
├─ first-vegetation-runtime-ready-ack-kit
└─ first-provider-bound-vegetation-frame-ack-kit
```

## Command/result flow

```txt
ProviderRevisionAdmissionCommand
  -> ProviderRevisionAdmissionResult

VegetationProviderProbeCommand
  -> VegetationProviderProbeResult

WorkerProviderAdmissionCommand
  -> WorkerProviderAdmissionResult

ProviderRealmParityCommand
  -> ProviderRealmParityResult

VegetationStartupCommitCommand
  -> FirstVegetationRuntimeReadyAck
  -> FirstWorkerPatchAck
  -> FirstProviderBoundVegetationFrameAck
```

## Compatibility boundary

This is proposed documentation. Preserve the current pin, catalog descriptors, patch schema, deterministic generation, rendering and gameplay behavior.