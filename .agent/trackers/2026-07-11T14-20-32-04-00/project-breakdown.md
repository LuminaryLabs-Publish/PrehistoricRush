# Project Breakdown: PrehistoricRush Fixed Collider Retirement

**Timestamp:** `2026-07-11T14-20-32-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

Selected `PrehistoricRush` as the oldest eligible documented Publish repository. The audit traces a stale fixed-collider path from released streamed patches through the pinned Rapier ProtoKit into fatal gameplay contacts.

## Plan ledger

**Goal:** document the complete interaction loop, domains, kits, services and the smallest correct authority boundary for collider replacement and collision admission.

- [x] Compare the complete Publish inventory against central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select one repository only.
- [x] Read current root `.agent` state.
- [x] Read patch generator, browser adapter, game domain and pinned Rapier ProtoKit.
- [x] Identify interaction loop.
- [x] Identify all domains.
- [x] Identify all kits and services.
- [x] Identify stale fixed-collider retention.
- [x] Define DSK/domain boundary and fixtures.
- [x] Update root and timestamped documentation.
- [ ] Runtime implementation remains future work.

## Selection comparison

```txt
PrehistoricRush       12:39:53 selected
MyCozyIsland          12:58:06
TheOpenAbove          13:10:35
HorrorCorridor        13:20:45
PhantomCommand        13:28:37
ZombieOrchard         13:41:23
TheUnmappedHouse      13:49:30
AetherVale            14:00:01
IntoTheMeadow         14:08:51
TheCavalryOfRome      excluded
```

## Interaction loop

```txt
patch generation
  -> current active patch set
  -> visual tree/collider projection
  -> Rapier fixed-collider submission
  -> physics step
  -> contact observation
  -> fallback overlap
  -> run failure
  -> terminal render

patch release
  -> visual membership shrinks
  -> serialized physics membership shrinks
  -> live Rapier membership does not shrink
  -> stale contact remains possible
```

## Domains

```txt
routing/profile
product run
route/surface
procedural creature
world patch generation/streaming
render consumer membership
physics fixed-collider membership
contact collection
collision admission
terminal outcome
camera/render/HUD/host
validation/deployment
```

## Main finding

`setFixedColliders()` is named like authoritative replacement but only creates or updates submitted collider IDs. It replaces serializable state while retaining removed live Rapier objects. This creates a split-brain membership that the product converts into fatal invisible collisions.

## Required change family

```txt
Patch Activation/Release Authority
  -> Fixed Collider Membership and Retirement
  -> Contact Observation and Admission
  -> Single Run Failure Transaction
  -> Render/Host Correlation
```

## Output files

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/known-gaps.md
.agent/next-steps.md
.agent/validation.md
.agent/kit-registry.json
.agent/turn-ledger/2026-07-11T14-20-32-04-00.md
.agent/architecture-audit/2026-07-11T14-20-32-04-00-fixed-collider-retirement-dsk-map.md
.agent/render-audit/2026-07-11T14-20-32-04-00-visual-collider-membership-parity-gap.md
.agent/gameplay-audit/2026-07-11T14-20-32-04-00-released-patch-invisible-tree-failure-loop.md
.agent/interaction-audit/2026-07-11T14-20-32-04-00-contact-to-run-failure-admission-map.md
.agent/collision-authority-audit/2026-07-11T14-20-32-04-00-fixed-collider-membership-retirement-contract.md
.agent/deploy-audit/2026-07-11T14-20-32-04-00-stale-collider-parity-fixture-gate.md
```
