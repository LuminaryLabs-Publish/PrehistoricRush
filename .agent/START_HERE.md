# START HERE: PrehistoricRush

**Last aligned:** `2026-07-16T02-03-42-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed current repository head:** `07963fd0ebfea6e9abcd6aa595fc91b5b7cd1389`  
**Reviewed runtime source revision:** `4808f05cff438ff5a9d013cd7ddec5127bbcf213`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

PrehistoricRush was selected by the oldest synchronized eligible-repository rule after the complete Publish inventory was compared with central tracking. The current audit isolates patch Worker liveness: unresolved Worker requests can retain controller inflight ownership indefinitely because readiness, Worker error channels, deadlines, cancellation, restart, fallback, stale-generation rejection, and retirement are not owned by the active host.

## Plan ledger

**Goal:** guarantee that every admitted patch-generation request reaches one terminal result and that failed Worker generations recover without silently stalling world streaming.

- [x] Compare all 11 accessible Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Select only PrehistoricRush by the oldest synchronized timestamp.
- [x] Trace Worker creation, readiness, request dispatch, controller inflight state, patch activation and retirement.
- [x] Preserve all 66 implemented kits, adapters and proof surfaces.
- [x] Define one patch-worker parent authority with 21 coordinating surfaces.
- [x] Add the `2026-07-16T02-03-42-04-00` audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement and execute Worker fault, recovery, artifact and Pages fixtures.

## Main finding

```txt
patch request
  -> controller marks patch inflight
  -> executor stores pending promise
  -> Worker normally returns patch-generated or patch-error

Worker crash, hang, message failure or lost response
  -> no pending-promise settlement
  -> no controller inflight release
  -> duplicate generation remains suppressed
  -> no restart or synchronous fallback
  -> no recovered-patch acknowledgement
```

## Current audit family

```txt
.agent/trackers/2026-07-16T02-03-42-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-16T02-03-42-04-00.md
.agent/architecture-audit/2026-07-16T02-03-42-04-00-patch-worker-liveness-recovery-dsk-map.md
.agent/render-audit/2026-07-16T02-03-42-04-00-stalled-patch-visible-world-gap.md
.agent/gameplay-audit/2026-07-16T02-03-42-04-00-worker-failure-streaming-stall-loop.md
.agent/interaction-audit/2026-07-16T02-03-42-04-00-patch-worker-command-result-map.md
.agent/worker-runtime-audit/2026-07-16T02-03-42-04-00-worker-readiness-timeout-restart-contract.md
.agent/deploy-audit/2026-07-16T02-03-42-04-00-worker-fault-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-16T02-03-42-04-00-oldest-selection-worker-liveness-reconciliation.md
```

## Required authority

`prehistoric-rush-patch-worker-request-liveness-recovery-authority-domain`

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits: 5
product/page/Worker kits: 17
external/host/render adapters: 14
proof kits: 8
total implemented surfaces: 66
planned patch-worker surfaces: 21
```

## Next safe ledge

Admit a Worker generation only after `patch-worker-ready`, bind every request to a deadline and cancellation owner, settle Worker `error` and `messageerror`, release or requeue controller inflight ownership, apply bounded restart, switch to synchronous generation when recovery is exhausted, and retire all pending work on document exit.

## Claim boundary

Documentation only. No Worker readiness, timeout, cancellation, restart, fallback, inflight recovery, lifecycle retirement, artifact parity, Pages parity, or production readiness is claimed.