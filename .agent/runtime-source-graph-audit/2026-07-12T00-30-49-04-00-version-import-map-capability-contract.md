# Runtime Source Graph Audit: Version, Import Map and Capability Contract

**Timestamp:** `2026-07-12T00-30-49-04-00`

## Plan ledger

**Goal:** define the canonical runtime graph and prevent declared pins, resolved imports, loaded exports and active providers from diverging.

- [x] Record current source pins.
- [x] Record previous internal-document drift.
- [x] Define parity and provider invariants.
- [ ] Add runtime enforcement and fixtures.

## Canonical current graph

```txt
Nexus Engine:       d86188c66692d9c24815aa2b29612c70df8fde4e
NexusEngine-Kits:   9673594de5669b4691737b91a9d56fa282e74370
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three:              0.179.1
Rapier:             0.15.0
```

## Contract

```txt
RuntimeModuleManifest {
  schemaVersion
  policyVersion
  entries[]
  requiredCapabilities[]
  optionalCapabilities[]
}

RuntimeGraphAdmissionResult {
  status: admitted | admitted-degraded | rejected
  sourceGraphFingerprint
  importMapParity
  moduleResults[]
  exportContractResults[]
  activeCapabilities[]
  rejectedCapabilities[]
  physicsProvider
}
```

## Invariants

```txt
HTML import-map nexus commit equals manifest Nexus commit
loaded required modules satisfy explicit export contracts
one compatibility policy covers the complete graph
fallback physics is an explicit admitted capability, not an implicit null path
public diagnostics expose the admission result, not only declared constants
first visible frame cites sourceGraphFingerprint
```

## Current gap

Factory presence checks are useful local evidence but do not produce one graph-wide result. The current physics adapter can collapse to `null`, changing collision behavior without a typed capability transition.