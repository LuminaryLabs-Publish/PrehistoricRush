# External Kit Audit: CDN Module Admission and Provenance Contract

Timestamp: `2026-07-10T18-01-03-04-00`

## Live external sources

```txt
Three.js
  https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js

Rapier
  https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.15.0/rapier.es.js

physics kit
  https://cdn.jsdelivr.net/gh/LuminaryLabs-Agents/NexusRealtime-ProtoKits@main/protokits/rapier-physics-domain-kit/index.js
```

## Provenance assessment

```txt
Three.js: package version pinned, no integrity/fingerprint readback
Rapier: package version pinned, no integrity/fingerprint readback
physics kit: mutable branch ref, legacy repo identity, no commit pin, no export/version readback
```

The physics-kit source can change without any commit in `PrehistoricRush`. A future CDN refresh can therefore alter contact, actor, collider, or snapshot behavior while the product repository remains unchanged.

## Current admission behavior

`load(url)` catches all import failures, warns, and returns `null`.

Consequences:

```txt
network failure and export mismatch are indistinguishable
required and optional dependencies are not classified
Three.js failure is not rejected before setup
Rapier and kit failure silently produce fallback behavior
no source or capability row reaches host diagnostics
no source fingerprint is available for replay or bug reports
```

## Required policy

| Dependency | Policy | Failure result |
|---|---|---|
| Three.js | required | boot rejected with typed reason |
| Rapier | optional only if fallback is approved | fallback admitted with reason |
| rapier-physics-domain-kit | required for Rapier mode, optional for explicit fallback | fallback or boot rejection per policy |

## Required admission row

```txt
RuntimeDependencyResult
  id
  requestedUrl
  requestedVersionOrRef
  resolvedRevision
  expectedExports
  observedExports
  capabilities
  status
  reason
  errorClass
```

## Source rule

Replace mutable branch references with immutable commit references. If Nexus Engine or ProtoKit source is intentionally live-tracked, that must be an explicit development mode and never the production Pages default.

## Fixture matrix

```txt
all dependencies admitted
Three.js unavailable
Rapier unavailable
physics kit unavailable
physics kit missing createRapierPhysicsKit export
Rapier init rejection
physics configure rejection
fallback collision path selected
same pinned inputs produce same source fingerprint
```

## Host readback

Expose bounded immutable rows only. Do not expose imported module objects.

```txt
requested
admitted
rejected
fallbacks
capabilityFingerprint
sourceFingerprint
bootStatus
```