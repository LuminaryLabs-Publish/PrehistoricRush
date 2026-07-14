# Split Provider First-Frame Gap

**Timestamp:** `2026-07-14T14-01-07-04-00`

## Summary

The game and creator can render a visually correct Three.js frame even when the composed module graph contains two NexusEngine revisions. Current render submissions identify game state, patch statistics, and configured dependency commits, but they do not identify the transitive provider graph that created the engine, kit descriptors, physics provider, or procedural character.

## Plan ledger

**Goal:** require the first accepted game or creator frame to cite one admitted provider graph.

- [x] Trace renderer creation and first RAF submission.
- [x] Trace public `PrehistoricRushHost.versions` readback.
- [x] Compare configured direct revisions with transitive bare imports.
- [x] Identify the missing provider-bound frame acknowledgement.
- [ ] Add browser capture and built/Pages parity later.

## Current render path

```txt
mixed module graph
  -> compose engine and kits
  -> create Three.js scene and renderer
  -> create procedural character and patch resources
  -> submit RAF frame
  -> expose configured versions only
```

## Missing evidence

```txt
accepted ModuleGraphManifest ID
canonical NexusEngine revision
resolved bare-specifier URL
kit-to-provider dependency receipts
composition result ID
renderer generation
route generation
first frame timestamp and viewport
FirstProviderConvergedFrameAck
```

## Required frame acknowledgement

```txt
FirstProviderConvergedFrameAck
  routeId
  routeProviderAttemptId
  moduleGraphManifestId
  nexusEngineRevision
  stableKitsRevision
  protoKitsRevision
  rendererGeneration
  frameNumber
  viewportRevision
  presentedAt
```

A successful WebGL frame proves presentation happened. It does not prove that one compatible provider revision owned every factory and descriptor used to produce it.
