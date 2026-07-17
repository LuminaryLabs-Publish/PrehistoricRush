# Runtime Module Audit: Route Import-Map Identity Contract

**Timestamp:** `2026-07-16T20-01-41-04-00`

## Goal

Generate every route binding from one manifest and make bare-specifier resolution equal the dynamically imported host runtime.

## Observed declarations

```txt
runtime-versions.js
  Nexus Engine: 80146b8947e0877e26b851563bd17f5cdfcbf38a

game.html
  nexusengine: 06375f213b9fcd96257c0cf6980d65ec7ca2f3d3

charactercreator.html
  nexusengine: cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1
```

## Observed linkage

```txt
seed-kit
  imports defineDomainServiceKit and seed primitives from bare nexusengine

procedural-creature-body-kit
  imports createObjectDescriptor from bare nexusengine

creator and game hosts
  import Nexus Engine from RUNTIME_URLS.nexus
  call official kit factories
  install returned kits into the dynamically imported host engine
```

## Required invariant

```txt
normalize(importMap.nexusengine)
  == normalize(runtimeManifest.nexus)
  == kitLinkedRuntimeUrl
  == engineNamespaceRuntimeUrl
  == descriptorFactoryRuntimeUrl
```

## Required runtime result

```txt
RuntimeModuleAdmissionResult {
  accepted,
  routeId,
  documentGeneration,
  manifestRevision,
  runtimeGeneration,
  runtimeDigest,
  modules,
  provenance,
  mismatches
}
```

## Required rejection policy

Reject before asset preparation or engine creation when any required module cannot prove the accepted generation. Do not fall back to best-effort mixed composition.

## Migration path

```txt
1. add runtime/runtime-manifest.json
2. generate runtime-versions.js and route import maps
3. add provenance exports or sentinels to official kits
4. admit module identity before createRealtimeGame
5. bind digest into startup and first-frame receipts
6. prove source/build/Pages parity
```

## Boundary

The current declarations are source-proven. Their runtime impact remains unproven until browser module-graph fixtures execute.