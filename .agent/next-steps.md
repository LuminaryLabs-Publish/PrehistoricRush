# PrehistoricRush Next Steps

**Audit:** `2026-07-16T02-03-42-04-00`  
**Authority:** `prehistoric-rush-patch-worker-request-liveness-recovery-authority-domain`

## Summary

Add one bounded Worker-generation authority around the existing patch controller and deterministic generator.

## Plan ledger

**Goal:** ensure every patch request settles, failed Worker generations recover, and controller inflight ownership cannot become permanent.

### Phase 1: Generation and readiness

- [ ] Add immutable Worker-generation identity.
- [ ] Add capability and module-load observation.
- [ ] Require a matching `PatchWorkerReadyResult` before asynchronous dispatch.
- [ ] Expose Worker state through `WorkerHealthSnapshot`.

### Phase 2: Request settlement

- [ ] Add `PatchWorkerAdmissionCommand` and `PatchWorkerResult`.
- [ ] Bind controller, Worker, request, patch, cache-key and attempt identities.
- [ ] Add deadlines and timeout settlement.
- [ ] Add cancellation ownership.
- [ ] Observe `error`, `messageerror` and synchronous `postMessage` failure.
- [ ] Guarantee exactly one terminal result per admitted request.

### Phase 3: Controller recovery

- [ ] Release controller inflight ownership for every non-success result.
- [ ] Requeue unresolved active-ring work with bounded attempts.
- [ ] Reject late or duplicate responses from retired Worker generations.
- [ ] Preserve deterministic patch identity and cache keys across retries.

### Phase 4: Restart and fallback

- [ ] Add a bounded Worker restart budget.
- [ ] Retire listeners, pending requests and process state before replacement.
- [ ] Admit replacement only after readiness.
- [ ] Switch the controller to deferred synchronous generation when restart is exhausted.
- [ ] Publish `PatchWorkerFallbackResult` and degraded-stream diagnostics.

### Phase 5: Lifecycle and proof

- [ ] Dispose the executor on pagehide, route exit and runtime replacement.
- [ ] Terminate the Worker and clear deadlines/cancellation registrations.
- [ ] Publish `FirstWorkerReadyAck`.
- [ ] Publish `FirstRecoveredPatchAck` and a matching visible-frame acknowledgement.
- [ ] Add pending age, failures, restarts and fallback state to public diagnostics.

### Phase 6: Fixtures

- [ ] Test readiness gating.
- [ ] Test generator error, Worker error and messageerror.
- [ ] Test timeout, cancellation and late-response rejection.
- [ ] Test restart success and restart-budget exhaustion.
- [ ] Test synchronous fallback and active-ring recovery.
- [ ] Test pagehide and route retirement with pending requests.
- [ ] Run `npm test`.
- [ ] Run source, artifact and Pages parity fixtures.