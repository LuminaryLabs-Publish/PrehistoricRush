# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-12T00-30-49-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with a persisted procedural creature, Three.js creator and game renderers, deterministic Worker patch streaming, Rapier/fallback collision, pickups, terminal transitions, HUD projection and Pages deployment.

The current audit isolates **runtime module graph admission**. Source pins and browser import maps were recently updated, but the previous `.agent` registry still recorded older Nexus Engine and NexusEngine-Kits commits. Startup checks module presence and selected factories, but does not publish one graph-wide compatibility result, active physics-provider decision or first-frame source fingerprint.

The prior run-step outcome, public-host, creator, streaming, collision, cadence, readiness, frame, reset and lifecycle audits remain active dependencies.

## Plan ledger

**Goal:** require one canonical and observable runtime module graph before engine composition, optional physics selection, rendering or public readiness.

- [x] Compare the full Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` as the oldest eligible ledger entry.
- [x] Reconcile current pins and import maps with internal documentation.
- [x] Identify interaction loops, domains, kits and offered services.
- [x] Add timestamped architecture and system audits.
- [x] Update documentation on `main`; create no branch or pull request.
- [ ] Implement runtime graph admission and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-12T00-30-49-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T00-30-49-04-00-runtime-module-graph-admission-dsk-map.md
.agent/render-audit/2026-07-12T00-30-49-04-00-first-frame-source-graph-provenance-gap.md
.agent/interaction-audit/2026-07-12T00-30-49-04-00-import-map-loader-provider-admission-map.md
.agent/runtime-source-graph-audit/2026-07-12T00-30-49-04-00-version-import-map-capability-contract.md
.agent/deploy-audit/2026-07-12T00-30-49-04-00-runtime-source-graph-fixture-gate.md
.agent/turn-ledger/2026-07-12T00-30-49-04-00.md
.agent/kit-registry.json
```

## Current source graph

```txt
Nexus Engine:          d86188c66692d9c24815aa2b29612c70df8fde4e
NexusEngine-Kits:      9673594de5669b4691737b91a9d56fa282e74370
NexusEngine-ProtoKits: 11d245913ba4d30f3ce950eb5a17e1cc6e4aa1f5
Three:                 0.179.1
Rapier:                0.15.0
```

## Main findings

```txt
HTML import maps and runtime constants currently agree on the Nexus commit
previous internal sourceGraph records were stale
required imports are admitted mainly by object presence
Nexus/Kits receive selected factory checks, but no graph-wide result exists
Rapier can degrade to null and fallback collision without a typed provider decision
host version constants do not prove the modules actually loaded
rendered frames carry no sourceGraphFingerprint
```

## Domains and kit groups

```txt
routes/profile/creator
runtime module graph and import maps
12 Nexus Engine core kits
5 official NexusEngine-Kits
12 product/page/Worker kits
8 external and host adapter boundaries
run, streaming, physics, camera, Three render, HUD and host readback
outcome, frame, host capability, reset, lifecycle, validation and deployment
```

See the tracker and kit registry for every kit and service.

## Required parent domain

```txt
prehistoric-rush-runtime-module-graph-admission-domain
```

It coordinates canonical module entries, import-map parity, load results, export contracts, compatibility policy, optional capabilities, physics-provider selection, graph fingerprint, observation, journal and fixtures.

## Ordered implementation queue

```txt
0. Runtime Module Graph Admission and Source Provenance
1. Route Artifact and Game Profile Handoff proof
2. Character Creator Draft, Commit and Preview Frame Authority
3. Patch Activation and Release Commit Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration and Terminal Frame Authority
6. Stream Cadence and Time Budget Authority
7. World Readiness and Movement Admission
8. Committed Gameplay Frame and Read Model
8a. Public Host Capability Gateway
9. Coordinated Run/Stream/Worker/Collider/Frame Reset
10. Runtime Lifecycle and Ordered Disposal
```

Do not add another loader, engine instance, physics world, run-state store or render loop. Extend startup admission and existing owners.