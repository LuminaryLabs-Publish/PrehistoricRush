# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T00-30-49-04-00`

## Summary

Admit and fingerprint one runtime module graph before continuing the existing route, creator, streaming, collider, outcome, frame, host, reset and lifecycle work.

## Plan ledger

**Goal:** prevent source pins, import maps, loaded exports, provider selection and visible-frame provenance from diverging.

- [ ] Define a canonical runtime module manifest from `runtime-versions.js`.
- [ ] Verify `game.html` and `charactercreator.html` import-map parity.
- [ ] Return typed load results instead of null-only failure collapse.
- [ ] Validate required export contracts for every required provider.
- [ ] Version the Nexus/Kits/ProtoKits/Three/Rapier compatibility policy.
- [ ] Make Rapier or fallback selection an explicit capability decision.
- [ ] Compute and retain `sourceGraphFingerprint`.
- [ ] Gate engine, Worker, renderer, RAF and public-host creation on admission.
- [ ] Correlate the first visible frame and public read model to the fingerprint.
- [ ] Execute local and Pages fixture gates.

## Required result

```txt
RuntimeGraphAdmissionResult {
  status
  policyVersion
  sourceGraphFingerprint
  importMapParity
  moduleResults
  exportContractResults
  activeCapabilities
  rejectedCapabilities
  physicsProvider
}
```

## Ordered queue

```txt
0. Runtime Module Graph Admission and Source Provenance
1. Route/Profile artifact proof
2. Creator draft/commit/preview authority
3. Patch activation/release
4. Collider replacement/admission
5. Run-step outcome and terminal frame
6. Stream cadence/time budget
7. World readiness
8. Committed frame/read model
8a. Public host gateway
9. Coordinated reset epochs
10. Lifecycle/disposal
```

## Required fixtures

```txt
manifest canonicalization/fingerprint
HTML import-map parity
required module unavailable
required export missing
incompatible graph rejection
Rapier admitted
explicit fallback admitted
rejected startup leaves no resources or recurring work
first-frame graph parity
public read-model detachment
Pages source-graph smoke
```

Do not add another loader or engine instance. Extend the current runtime constants, startup path and existing lifecycle owner.