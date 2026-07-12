# Deploy Audit: Stream / Outcome Parity Fixture Gate

**Timestamp:** `2026-07-12T11-21-01-04-00`

## Summary

Static build and Pages deployment do not prove that simulation, physics, streamed content and visible rendering share one revision. Deployment readiness requires browser fixtures that exercise release, activation, pickup, collision, Worker delay and participant failure ordering.

## Plan ledger

**Goal:** block stream/outcome parity claims until local browser and deployed Pages fixtures produce matching revisioned receipts.

- [x] Identify current proof surfaces.
- [x] Identify missing browser and deployed fixtures.
- [x] Define the minimum deployment gate.
- [ ] Implement and run the gate.

## Existing proof

```txt
npm test command exists
pure outcome-policy tests exist
static build/deploy surface exists
runtime module preflight reports first import failure
```

## Missing fixture matrix

```txt
released collider cannot cause an invisible failure
activated collider cannot render before collision admission
activated pickup cannot render before pickup admission
accepted pickup removal cites committed outcome and content revision
mixed physics/pickup/content revisions are rejected
content participant failure rolls back every participant
stale Worker result is rejected
initial boot and retry establish a valid content revision
first visible frame cites tick, simulation and content revisions
browser and GitHub Pages receipts match
```

## Required artifacts

```txt
fixture input manifest
command/result transcript
content parity journal
participant prepare/commit/rollback receipts
committed outcome provenance
first visible frame receipt
browser screenshot or pixel assertion where relevant
Pages run URL and matching receipt hashes
```

## Gate

Do not claim stream/outcome parity, collision/pickup correctness, rollback safety or deployment readiness until the full matrix passes against both the local browser host and deployed Pages build.
