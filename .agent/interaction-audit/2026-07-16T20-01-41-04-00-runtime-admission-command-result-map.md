# Interaction Audit: Runtime Admission Command/Result Map

**Timestamp:** `2026-07-16T20-01-41-04-00`

## Goal

Make route entry an explicit command/result transaction before the player can interact with the creator or game.

## Command map

```txt
RouteRuntimeAdmissionCommand
  routeId
  documentGeneration
  manifestRevision
  importMapEntries
  requestedModuleUrls
  expectedRuntimeDigest

RuntimeModuleAdmissionResult
  accepted | rejected
  runtimeGeneration
  normalizedModules
  kitProvenance
  providerProvenance
  mismatchReasons

CreatorEntryCommand
  requires accepted RuntimeModuleAdmissionResult
  -> creator engine and preview
  -> FirstSingleRuntimeCreatorFrameAck

GameEntryCommand
  requires accepted RuntimeModuleAdmissionResult
  -> asset preparation and game engine
  -> FirstSingleRuntimeGameFrameAck
```

## Rejection cases

```txt
route import-map runtime differs from manifest
kit-linked runtime differs from host runtime
descriptor primitive differs from accepted generation
provider or Worker generation is stale
duplicate runtime namespaces enter one composition
cached generation does not match deployment manifest
```

## Current gap

The current routes execute imports directly and use capability checks after loading. They do not publish a typed identity result or reject a composition because its factories originate from another Nexus Engine generation.

## Boundary

This audit does not change route navigation, controls, gameplay commands or visual behavior.