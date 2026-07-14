# Route Bootstrap Provider Result Map

**Timestamp:** `2026-07-14T14-01-07-04-00`

## Summary

Route startup currently converts dependency failures into generic page text, but successful startup has no typed provider-admission result. The game and creator need the same command/result contract for canonical provider resolution, compatibility, composition, rollback, public readback, and first-frame evidence.

## Plan ledger

**Goal:** make route bootstrap an explicit interaction with terminal accepted or rejected results.

- [x] Map game dependency preflight.
- [x] Map creator dependency loading.
- [x] Map current generic failure projection.
- [x] Define command and result classes.
- [ ] Add retry and stale-attempt fixtures later.

## Command map

```txt
RouteProviderAdmissionCommand
  routeId
  attemptId
  expectedManifestRevision
  sourceRevision
  buildRevision

ProviderManifestCandidate
  nexusEngine
  stableKits
  protoKits
  three
  rapier
  importMap

RouteProviderAdmissionResult
  status: accepted | rejected | superseded
  attemptId
  moduleGraphManifestId
  providerRevisions
  capabilityReceipts
  compositionReceipt
  rollbackReceipt
  diagnostics
```

## Result flow

```txt
command
  -> resolve canonical URLs
  -> load candidate modules
  -> collect transitive provider identities
  -> compare direct and bare-specifier NexusEngine revisions
  -> probe required factories
  -> compose candidate route participants
  -> accept or dispose all candidates
  -> publish result
  -> enable run/preview only after acceptance
```

## Rejection classes

```txt
split-provider-revision
unknown-provider-identity
missing-capability
incompatible-factory
module-load-failure
composition-failure
stale-attempt
superseded-attempt
first-frame-timeout
```
