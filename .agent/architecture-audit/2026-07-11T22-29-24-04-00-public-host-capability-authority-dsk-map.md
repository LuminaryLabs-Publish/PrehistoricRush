# Public Host Capability Authority DSK Map

**Timestamp:** `2026-07-11T22-29-24-04-00`

## Current composition

```txt
globalThis.PrehistoricRushHost
  -> engine
  -> physics
  -> adapter
  -> patchController
  -> cameraFollow
  -> versions
  -> getState()
```

The first five fields are live mutable runtime owners. `getState()` separately samples gameplay, patch streaming, camera, composition, scene, profile and creature data.

## Required parent domain

```txt
prehistoric-rush-public-host-capability-authority-domain
```

## DSK breakdown

```txt
host-session-identity-kit
  runtimeSessionId, hostGeneration, publicApiVersion

host-capability-descriptor-kit
  named read and command capabilities, budgets and ownership

host-read-capability-kit
  immutable last-committed read access only

host-command-capability-kit
  explicit command names and owning-domain routes

host-command-envelope-kit
  commandId, expectedRunId, expectedEpochs, payload and requested capability

host-command-admission-kit
  schema, capability, lifecycle, epoch, duplicate and budget checks

host-run-epoch-fence-kit
  reject commands and observations from predecessor runs

host-owner-handle-quarantine-kit
  prevent engine, physics, adapter, controller and camera object leakage

host-committed-read-model-kit
  one immutable record from the last committed gameplay frame

host-frame-provenance-kit
  run, stream, collider, Worker and frame epochs plus fingerprints

host-command-result-kit
  accepted, rejected, stale, duplicate, failed and applied receipts

host-observation-journal-kit
  bounded command and read-model transition rows

legacy-host-compatibility-adapter-kit
  temporary safe getters without returning raw owners

host-mutation-isolation-fixture-kit
host-read-model-coherence-fixture-kit
host-stale-command-fixture-kit
```

## Ownership rule

The host domain owns public exposure, admission, correlation and observation. It does not become the authority for gameplay, streaming, physics, camera or rendering. Commands must route to the existing owner and return its typed result.

## Required public shape

```txt
PrehistoricRushHost {
  version
  capabilities
  getCommittedState()
  getJournal()
  submit(command)
}
```

No public field may contain a mutable runtime owner or a closure that bypasses command admission.