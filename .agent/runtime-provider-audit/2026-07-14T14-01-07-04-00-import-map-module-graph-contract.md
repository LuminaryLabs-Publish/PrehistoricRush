# Import Map and Module Graph Contract

**Timestamp:** `2026-07-14T14-01-07-04-00`

## Summary

`game.html` and `charactercreator.html` map `nexusengine` to `cf2fe3d...`, while `runtime-versions.js` directly imports `682c9fa...`. Stable kits and ProtoKit core use the bare specifier, so the current module graph is not revision-converged.

## Plan ledger

**Goal:** derive every route dependency and bare-specifier resolution from one immutable provider manifest.

- [x] Record direct and mapped NexusEngine revisions.
- [x] Verify transitive bare imports.
- [x] Define canonical manifest and compatibility receipts.
- [x] Define rollback and public readback requirements.
- [ ] Replace the duplicated source of truth later.

## Current identity conflict

```txt
runtime-versions.js NEXUS_COMMIT:
  682c9fa697a36a6bf6262762a6e647ffc3a5e289

HTML import-map nexusengine:
  cf2fe3d77ffa1562fdf0ff7f6dfefc6464cfceb1

verified bare consumers:
  NexusEngine-Kits seed-kit
  NexusEngine-Kits procedural-creature-body-kit
  NexusEngine-ProtoKits protokit-core
```

## Canonical manifest

```txt
RouteProviderManifest
  schemaVersion
  manifestRevision
  routeId
  nexusEngineUrl
  nexusEngineCommit
  stableKitsCommit
  protoKitsCommit
  threeVersion
  rapierVersion
  importMap
  expectedCapabilities
  compatibilityPolicy
```

## Contract

1. One manifest owns the direct runtime URL and the `nexusengine` import-map entry.
2. Every stable kit and ProtoKit dependency receipt must resolve to the same NexusEngine commit.
3. A kit may receive injected runtime helpers, but the receipt must state whether imported or injected helpers were used.
4. Composition must reject unknown or mixed provider identities before engine state, physics, Workers, listeners, or rendering start.
5. Public diagnostics must report resolved identities, not only configured constants.
6. Source, built output, and Pages must publish equivalent provider manifests.

## Minimal implementation direction

```txt
single provider manifest module
  -> generate route import map or checked-out build alias
  -> load all route modules
  -> expose provider revision markers
  -> compare root and transitive dependency receipts
  -> compose only after convergence
```

This audit does not require a NexusEngine restructuring. It requires PrehistoricRush to consume one provider revision consistently.
