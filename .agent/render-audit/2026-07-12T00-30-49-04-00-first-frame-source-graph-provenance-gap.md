# Render Audit: First-Frame Source Graph Provenance Gap

**Timestamp:** `2026-07-12T00-30-49-04-00`

## Plan ledger

**Goal:** make the first and every committed frame identify the admitted runtime graph and active physics/render providers.

- [x] Trace module loading into Three renderer creation.
- [x] Trace declared version constants into the public host.
- [x] Confirm rendered frames carry no graph fingerprint.
- [ ] Add frame-correlated graph provenance.

## Finding

`renderer.render(scene, camera)` and HUD projection can succeed without a receipt linking pixels to the module graph that created the engine, procedural creature, streaming controller, camera service, Three renderer and physics path. `PrehistoricRushHost.versions` repeats constants but does not prove actual import-map resolution, loaded exports or active Rapier/fallback selection.

## Required receipt

```txt
RuntimeFrameSourceReceipt {
  frameId
  runtimeSessionId
  sourceGraphFingerprint
  nexusCommit
  kitsCommit
  protoKitsCommit
  threeVersion
  rapierVersion
  physicsProvider
  rendererId
  committedAt
}
```

A visible frame cannot be called runtime-verified until its receipt references an accepted `RuntimeGraphAdmissionResult`.