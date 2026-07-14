# Patch Generation and Adoption Contract

**Timestamp:** `2026-07-13T21-38-52-04-00`

## Summary

Generation, cache membership and renderer adoption are separate stages. The controller already exposes a deterministic patch key, but the adapter drops it and records only the patch ID and payload.

## Plan ledger

**Goal:** retain patch provenance from generation request through cache, activation, consumer commit, release and stale-result rejection.

- [x] Trace patch request identity and cache key.
- [x] Trace ready and release queues.
- [x] Trace adapter ownership and public diagnostics.
- [x] Define required generation and adoption revisions.
- [ ] Implement provenance and stale-result fencing later.

## Existing provenance

```txt
controller requestId
patchId
cacheKey
worldSeed
generatorVersion
terrainSettingsHash
vegetationSettingsHash
reason and priority
```

`takeReadyPatches()` exposes `id`, `key`, coordinates and patch payload. The product adapter records the patch payload by `patch.id` but does not retain the controller key, request identity or controller revision.

## Required provenance

```txt
PatchGenerationReceipt {
  requestId
  patchId
  patchKey
  controllerGeneration
  worldSeed
  generatorVersion
  settingsHashes
  payloadFingerprint
}

PatchAdoptionReceipt {
  activationId
  patchId
  patchKey
  controllerRevision
  adapterGeneration
  consumerRevisions
  status
}
```

## Stale-result rules

```txt
reject Worker results from retired runtime sessions
reject payloads whose patch key no longer matches current settings
reject ready candidates no longer in desired active membership
reject duplicate activation for an already accepted patch key
reject release from a predecessor adapter generation
reject render callbacks citing retired activation IDs
```

## Snapshot gap

The patch-controller snapshot records active IDs and a cache digest. Adapter diagnostics record ownership counts. Neither snapshot records accepted patch keys, per-consumer revisions or activation results, so cross-domain parity cannot be reconstructed.

## Completion gate

A patch visible or queryable in gameplay must be traceable to one generation receipt and one accepted adoption receipt. Reset, restart, settings changes and Worker latency must not allow predecessor payloads to re-enter active consumers.
