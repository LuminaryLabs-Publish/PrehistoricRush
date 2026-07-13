# PrehistoricRush Known Gaps

**Audit:** `2026-07-12T22-18-39-04-00`  
**Status:** `articulated-pose-presentation-authority-audited`

## Summary

The visible player skeleton is driven by a direct legacy-pose branch rather than one committed articulated pose result. Motion, physics, articulation, dynamics, skeleton application, public readback, and visible-frame evidence remain disconnected.

## Plan ledger

**Goal:** keep every unresolved pose-presentation risk explicit until executable proof exists.

### Admission gaps

- [ ] No pose command ID, pose revision, or predecessor check.
- [ ] No run generation or tick admission.
- [ ] No player body, profile, rig, or skeleton revision agreement.
- [ ] No duplicate or stale pose rejection.

### Motion and articulation gaps

- [ ] Active render does not bind the committed Core Motion frame.
- [ ] Active render does not bind the committed Physics frame.
- [ ] `solvePlayerArticulatedPose()` is not used by the active game renderer.
- [ ] Articulated dynamics has no visible pose provenance.
- [ ] Target-set identity and solve result are absent.
- [ ] Legacy fallback is implicit rather than typed.

### Skeleton application gaps

- [ ] No finite-transform validation before bone mutation.
- [ ] Unknown bones are skipped without a typed coverage result.
- [ ] No required-bone policy.
- [ ] No applied/skipped bone receipt.
- [ ] No protection against partial application failure.

### Observation gaps

- [ ] No pose fingerprint or source policy in `PrehistoricRushHost`.
- [ ] Independent motion, physics, articulation, and render snapshots do not prove one compatible frame.
- [ ] No first visible articulated-pose frame acknowledgement.
- [ ] No bounded pose presentation journal.

### Test gaps

- [ ] Articulated solve reaches active Three.js skeleton.
- [ ] Hind-leg IK visible effect.
- [ ] Missing optional and required bone fixtures.
- [ ] Non-finite transform fixture.
- [ ] Solver failure and typed fallback fixtures.
- [ ] Stale predecessor-run pose fixture.
- [ ] Public readback and visible-frame parity.
- [ ] Source/build/Pages parity.

## Retained run-start gaps

The `22-19-11` reconciliation remains valid: Enter repeat, active-run restart, participant reset/preserve receipts, stale Worker fencing, and first run-generation frame proof are still unresolved.

## Non-claims

The current code does not prove that visible articulation reflects committed motion or dynamics, that fallback is explicit, that bone application is complete, or that public readback identifies the pose shown.