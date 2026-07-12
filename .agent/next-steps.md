# Next Steps: PrehistoricRush

**Updated:** `2026-07-11T22-29-24-04-00`

## Summary

Continue the existing route, creator, streaming, collision, cadence, readiness and committed-frame work. Once a committed gameplay frame exists, use it as the only public read source and quarantine every raw runtime owner behind a typed command gateway.

## Plan ledger

**Goal:** expose useful diagnostics and automation without allowing scripts to bypass gameplay, stream, physics, camera, render or lifecycle authority.

- [ ] Complete route and deployed-page artifact proof.
- [ ] Implement creator draft, profile commit and preview-frame authority.
- [ ] Implement patch activation/release and exact collider authority.
- [ ] Implement cadence and world-readiness gates.
- [ ] Commit one coherent gameplay-frame record.
- [ ] Add host session and capability descriptors.
- [ ] Replace raw owner fields with immutable observations.
- [ ] Add typed public command admission and epoch fences.
- [ ] Add host isolation, coherence and stale-command fixtures.
- [ ] Complete coordinated reset and ordered disposal afterward.

## Ordered implementation queue

```txt
1. Route Artifact + Game Profile Handoff Final Proof
2. Character Creator Draft + Commit + Preview Frame Authority
3. Patch Activation / Release Commit Authority
4. Exact Collider Replacement + Collision Admission
5. Stream Cadence + Time Budget Authority
6. World Readiness + Movement Admission
7. Committed Gameplay Frame Authority
7a. Public Host Capability Gateway + Committed Read Model
8. Run / Stream / Collider / Worker / Frame Epoch Reset
9. Runtime Lifecycle + Ordered Disposal
```

## Host implementation sequence

### 1. Define the public API

```txt
PrehistoricRushHost {
  version
  capabilities
  getCommittedState()
  getJournal()
  submit(command)
}
```

No field may reference engine, physics, Three, patch-controller, Worker or camera-follow owners.

### 2. Create a committed read model

- [ ] Source it from the committed gameplay-frame authority.
- [ ] Include runtime session, host generation and run identity.
- [ ] Include run, stream, Worker, collider and frame epochs.
- [ ] Include profile, player-body and world-content fingerprints.
- [ ] Include render and HUD results.
- [ ] Deep-clone and freeze the returned value.

### 3. Define command capabilities

```txt
HostCommand {
  commandId
  capability
  expectedRunSessionId
  expectedRunEpoch
  expectedStreamEpoch
  expectedColliderEpoch
  payload
}
```

- [ ] Validate schema and supported capability.
- [ ] Validate lifecycle and work budget.
- [ ] Reject stale epochs with zero mutation.
- [ ] Route accepted commands to existing domain owners.
- [ ] Preserve typed owner results.
- [ ] Make duplicate commands idempotent.

### 4. Quarantine owners

- [ ] Remove `engine`, `physics`, `adapter`, `patchController` and `cameraFollow` from the public object.
- [ ] Do not expose Three scene, renderer, camera, player or material references.
- [ ] Do not expose Worker or executor references.
- [ ] Make legacy `getState()` return the committed read model only.

### 5. Add fixtures

```bash
node scripts/prehistoric-rush-host-owner-isolation-fixture.mjs
node scripts/prehistoric-rush-host-command-admission-fixture.mjs
node scripts/prehistoric-rush-host-stale-epoch-fixture.mjs
node scripts/prehistoric-rush-host-read-model-coherence-fixture.mjs
node scripts/prehistoric-rush-host-read-model-immutability-fixture.mjs
node scripts/prehistoric-rush-host-browser-smoke.mjs
node scripts/prehistoric-rush-host-pages-smoke.mjs
```

## Acceptance conditions

```txt
no public owner reference or mutating bypass is reachable
unsupported and stale commands cause zero mutation
duplicates return stable prior results
public state comes from one committed frame
all subsystem observations share one correlation set
returned state is detached and immutable
commands do not imply visible-frame success until a later frame commits
browser and Pages fixtures pass
```

## Do not do next

Do not add a second host with the same raw owners. Do not use shallow wrappers as quarantine. Do not route host commands around existing domain ownership. Do not independently sample mutable owners for public state.