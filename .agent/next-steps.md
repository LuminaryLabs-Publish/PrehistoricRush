# Next Steps: PrehistoricRush Coordinated Run Reset

**Updated:** `2026-07-12T16-11-48-04-00`

## Plan ledger

**Goal:** replace the browser-composed partial restart with one admitted reset transaction that advances every required participant to the same run generation or commits nothing.

### Gate 0: preserve current gameplay

- [ ] Preserve deterministic route, profile, creature descriptor and outcome policy behavior.
- [ ] Keep normal jump, steering, boost, collision, pickup and stream behavior unchanged.
- [ ] Declare whether immutable patch cache is preserved or cleared on restart.
- [ ] Keep terminal runtime disposal separate from reusable run reset.

### Gate 1: define restart commands and phase policy

- [ ] Add `RunRestartCommand` with command ID, source, sequence and expected run identity.
- [ ] Admit start from menu, retry from run-over and run-again from win.
- [ ] Reject active-run Enter restart by default.
- [ ] Treat intentional quick restart as a distinct product command.
- [ ] Return typed zero-mutation rejection results.
- [ ] Deduplicate browser key repeat and repeated activation.

### Gate 2: establish reset identity

- [ ] Add `resetTransactionId`.
- [ ] Add cross-domain `runGeneration` separate from product `runId`.
- [ ] Add participant revision and fingerprint fields.
- [ ] Add reset lifecycle states: admitting, preparing, committing, rolling back and awaiting visible frame.
- [ ] Mark public readback `reset-in-progress` until all required participants align.

### Gate 3: define participant protocol

- [ ] Register required and optional reset participants.
- [ ] Add `prepareReset`, `commitReset` and `rollbackReset` contracts.
- [ ] Require every result to cite the same reset transaction and run generation.
- [ ] Reject commit when any required prepare result fails.
- [ ] Produce an explicit terminal fault if rollback cannot restore parity.

### Gate 4: reset simulation, motion, physics and articulation

- [ ] Prepare and commit product RunState and InputState together.
- [ ] Reset Core Simulation resolution and committed-frame generation.
- [ ] Clear or rebind Core Motion intents, trajectories and frame history.
- [ ] Reset the player physics body to the admitted origin.
- [ ] Clear predecessor motion requests and physics-frame provenance.
- [ ] Reset or rebind articulated-motion pose/target state.
- [ ] Reset or rebind articulated-dynamics joint/body state.
- [ ] Reject predecessor tick, frame and request results.

### Gate 5: reset streaming, Worker and active content

- [ ] Choose `clear-all`, `preserve-cache-clear-active` or generation-fenced preservation.
- [ ] Apply the selected policy through a typed patch-controller result.
- [ ] Attach runtime session and run generation to Worker requests and responses.
- [ ] Reject or explicitly cache predecessor-generation Worker results.
- [ ] Rebuild terrain, trees, grass, shards, pickups and colliders from one committed active-content revision.
- [ ] Return content and collider parity digests.

### Gate 6: reset input, camera, renderer and public projection

- [ ] Clear browser key state under the reset transaction.
- [ ] Reject stale browser events from the predecessor run.
- [ ] Bind camera reset to the same transaction and generation.
- [ ] Declare whether renderer animation time resets or is preserved.
- [ ] Publish one immutable `RunRestartResult`.
- [ ] Prevent raw public readback from combining participant generations.
- [ ] Publish the first visible new-run frame acknowledgement.

### Gate 7: rollback and failure handling

- [ ] Add participant prepare-failure fixtures.
- [ ] Add commit-failure rollback fixtures.
- [ ] Verify zero public mutation before successful commit.
- [ ] Verify no stale Worker, motion, physics or input result crosses rollback.
- [ ] Record bounded observations and a reset journal.

### Gate 8: terminal lifecycle remains separate

- [ ] Cancel RAF on page stop.
- [ ] Remove browser listeners.
- [ ] Dispose the Worker executor and terminate its Worker.
- [ ] Dispose Three.js geometry, materials and renderer resources.
- [ ] Release engine/provider ownership.
- [ ] Remove `PrehistoricRushHost` during terminal disposal.

### Gate 9: executable proof

- [ ] Add active-run Enter rejection fixture.
- [ ] Add terminal retry and run-again admission fixtures.
- [ ] Add rapid-repeat idempotency fixture.
- [ ] Add simulation/motion/physics/articulation reset parity fixture.
- [ ] Add stale Worker completion after reset fixture.
- [ ] Add active-content/collider reset parity fixture.
- [ ] Add failed-prepare zero-commit fixture.
- [ ] Add rollback fixture.
- [ ] Add coherent public-readback fixture.
- [ ] Add browser and deployed Pages first-visible-frame smokes.

## Candidate kit order

```txt
prehistoric-rush-coordinated-run-reset-authority-domain
run-restart-command-kit
run-restart-admission-kit
run-generation-kit
reset-transaction-id-kit
reset-participant-registry-kit
reset-prepare-result-kit
reset-commit-result-kit
reset-rollback-kit
stale-run-command-rejection-kit
core-simulation-reset-participant-kit
core-motion-reset-participant-kit
core-physics-reset-participant-kit
articulated-motion-reset-participant-kit
articulated-dynamics-reset-participant-kit
patch-controller-reset-participant-kit
active-content-reset-participant-kit
worker-generation-barrier-kit
camera-reset-participant-kit
renderer-reset-participant-kit
input-reset-participant-kit
public-host-reset-receipt-kit
first-visible-run-frame-ack-kit
run-reset-observation-kit
run-reset-journal-kit
mid-run-enter-restart-fixture-kit
stale-worker-after-reset-fixture-kit
browser-pages-reset-parity-smoke-kit
```

## Validation order

```txt
npm test
fixture:active-run-enter-rejection
fixture:terminal-restart-admission
fixture:rapid-restart-idempotency
fixture:simulation-motion-physics-articulation-reset-parity
fixture:patch-controller-reset-policy
fixture:stale-worker-generation-rejection
fixture:active-content-collider-reset-parity
fixture:prepare-failure-zero-commit
fixture:commit-failure-rollback
fixture:public-readback-single-generation
fixture:first-visible-new-run-frame
browser restart matrix
Pages restart matrix
```

Do not remove current restart behavior until the replacement proves equivalent gameplay, explicit cache policy, stale-work rejection and first-visible-frame parity.