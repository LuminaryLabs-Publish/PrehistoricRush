# PrehistoricRush Known Gaps

**Audit:** `2026-07-16T02-03-42-04-00`  
**Status:** `patch-worker-request-liveness-recovery-authority-audited`

## Summary

Patch identity and generation requests exist, but Worker readiness, request lifetime, failure settlement, restart, fallback and retirement are not owned as one recoverable authority.

## Plan ledger

**Goal:** keep Worker liveness and recovery gaps explicit until every admitted request has a bounded terminal result.

### Worker admission

- [ ] No immutable Worker-generation identity exists.
- [ ] The host does not consume `patch-worker-ready`.
- [ ] No readiness deadline or start-failure result exists.
- [ ] Dispatch eligibility is inferred from Worker object presence.

### Request settlement

- [ ] No request deadline exists.
- [ ] No timeout result exists.
- [ ] No cancellation owner exists.
- [ ] No Worker `error` observer settles pending requests.
- [ ] No Worker `messageerror` observer settles pending requests.
- [ ] No synchronous `postMessage` failure result exists.
- [ ] No stale or duplicate response rejection by Worker generation exists.

### Controller recovery

- [ ] An unresolved executor promise can retain a patch as inflight indefinitely.
- [ ] No typed inflight release or requeue result exists.
- [ ] No bounded retry attempt is recorded.
- [ ] No active-ring coverage policy reacts to unresolved generation.

### Restart and fallback

- [ ] No Worker crash retirement result exists.
- [ ] No bounded Worker restart budget exists.
- [ ] No replacement readiness admission exists.
- [ ] No live transition to deferred synchronous generation exists.
- [ ] No fallback failure policy protects gameplay from unsafe world coverage.

### Lifecycle and proof

- [ ] The host does not call executor `dispose()`.
- [ ] The host does not terminate the Worker on route or document retirement.
- [ ] Pending timers, requests and listeners have no lifecycle settlement.
- [ ] No `WorkerHealthSnapshot` exists.
- [ ] No `PatchWorkerResult` exists.
- [ ] No `FirstWorkerReadyAck` exists.
- [ ] No `FirstRecoveredPatchAck` exists.
- [ ] No Worker fault, artifact or Pages fixture exists.

## Retained gaps

Game audio, accessibility projection, host-clock pacing, terrain ownership, terrain LOD, creator profile settlement, feedback surfaces, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart and general browser-runtime retirement remain separate retained audit families.