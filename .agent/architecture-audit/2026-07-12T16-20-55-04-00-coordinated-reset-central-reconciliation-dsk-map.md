# Architecture Audit: Coordinated Reset Central Reconciliation

**Timestamp:** `2026-07-12T16-20-55-04-00`

## Summary

The current repo-local parent-domain design is valid and remains unimplemented. This audit maps the domain boundary while reconciling its authoritative documentation state with the central ledger.

## Plan ledger

**Goal:** keep participant ownership local while introducing one parent authority for restart admission, generation, atomic commit, rollback and frame proof.

- [x] Preserve existing Core and product domain ownership.
- [x] Identify required reset participants.
- [x] Keep runtime disposal separate from reusable restart.
- [x] Preserve the schema-79 kit/service inventory.
- [x] Record the repo-local-to-central reconciliation boundary.
- [ ] Implement the parent authority and participant adapters.

## Parent domain

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
```

## Domain composition

```txt
restart command and source admission
  -> expected run identity and phase policy
  -> reset transaction ID and next run generation
  -> required/optional participant registry
  -> prepare phase
       product run/input
       Core Simulation
       Core Motion
       Core Physics
       articulated motion/dynamics
       patch controller and Worker barrier
       active content and colliders
       camera and renderer policy
       public projection
  -> atomic commit or rollback
  -> stale input/Worker/frame rejection
  -> coherent RunRestartResult
  -> first-visible-run-frame acknowledgement
```

Participant domains retain their own reset mechanics. The parent domain owns only orchestration, identity, admission, cross-participant invariants and terminal results.

## Required invariants

```txt
one admitted command creates at most one reset transaction
all required prepare results cite one next run generation
no public participant commits before prepare succeeds
commit failure rolls back or produces an explicit terminal fault
predecessor async work cannot mutate the committed successor generation
public readback never labels mixed generations as committed
first visible frame cites the committed RunRestartResult
```

## Documentation authority

```txt
technical source: 16-11-48 coordinated-reset audit family
machine source: .agent/kit-registry.json schema 79
reconciliation source: 16-20-55 tracker and central-sync audit
central target: LuminaryLabs-Dev/LuminaryLabs repo ledger
```

No runtime domain or kit was added in this documentation pass.