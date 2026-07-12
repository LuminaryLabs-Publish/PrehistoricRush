# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T12-01-04-04-00`

## Plan ledger

**Goal:** turn the installed Core Motion, articulated-motion, Core Physics and articulated-dynamics domains into one consumed, revisioned player-motion result without moving renderer ownership into the engine core.

### Gate 0: preserve existing authorities
- [ ] Keep run movement and outcome arbitration inside the current product/Core Simulation boundary.
- [ ] Preserve collision-over-goal precedence and duplicate-pickup rejection.
- [ ] Preserve the current streamed-content parity work as an independent active dependency.
- [ ] Keep Core Motion and articulated motion renderer-neutral.

### Gate 1: motion identity and physics linkage
- [ ] Add monotonic `motionSourceRevision` per admitted run step.
- [ ] Add browser input sequence and run-generation identity.
- [ ] Include `coreMotionFrameId` on every product physics motion request.
- [ ] Return a typed physics-consumption result with request and physics-frame IDs.
- [ ] Reject physics requests that cite a retired or unknown Core Motion frame.

### Gate 2: explicit presentation policy
- [ ] Add a versioned player motion/presentation profile.
- [ ] Declare gameplay pose mode: `articulated-motion` or `legacy-procedural`.
- [ ] Declare creator pose mode independently but comparably.
- [ ] Convert legacy use into a typed fallback result with a reason.
- [ ] Include creature profile, skeleton and rig fingerprints.

### Gate 3: articulated result consumption
- [ ] Adopt the player rig through one revisioned receipt.
- [ ] Build a target plan from committed gameplay and terrain state.
- [ ] Call articulated solving against the admitted motion revision.
- [ ] Return typed articulated pose/frame results.
- [ ] Reject results from a predecessor run, profile or rig generation.
- [ ] Keep articulated dynamics explicitly inactive until physical joints/motors are configured.

### Gate 4: renderer and visible-frame proof
- [ ] Select exactly one pose result per player frame.
- [ ] Apply only the selected result to the Three.js skeleton.
- [ ] Record applied, missing and rejected bone IDs.
- [ ] Commit a renderer bone-application receipt.
- [ ] Add first-visible-frame acknowledgement containing run, motion, physics, pose and renderer IDs.
- [ ] Project a detached parity result through the public host.

### Gate 5: creator/game parity
- [ ] Install or explicitly emulate the same motion profile in the creator.
- [ ] Prove creator and game use the same profile, skeleton and rig fingerprints.
- [ ] Separate preview-only turntable motion from gameplay locomotion semantics.
- [ ] Reject stale preview pose work after profile replacement or teardown.

### Gate 6: reset and lifecycle
- [ ] Retire predecessor input, intent, motion-frame and pose results on run restart.
- [ ] Reset Core Motion, articulated motion and optional articulated dynamics in one transaction.
- [ ] Revoke renderer consumers before disposing or replacing the player mesh.
- [ ] Prove creator teardown retires preview RAF and pose consumers.

### Gate 7: executable proof
- [ ] Add exact pinned-module admission fixtures.
- [ ] Add headless composed-tick motion/physics linkage fixture.
- [ ] Add legacy fallback and articulated solve selection fixtures.
- [ ] Add stale run/profile pose rejection fixtures.
- [ ] Add Three bone-application and first-visible-frame fixtures.
- [ ] Add browser and deployed Pages parity smokes.

## Candidate kit order

```txt
prehistoric-rush-motion-presentation-parity-authority-domain
motion-source-revision-kit
motion-intent-sequence-kit
motion-frame-provenance-kit
physics-motion-request-link-kit
articulated-rig-adoption-kit
articulated-target-plan-kit
articulated-pose-result-kit
presentation-pose-selection-kit
legacy-pose-fallback-policy-kit
creator-motion-profile-kit
game-motion-profile-kit
creator-game-motion-parity-kit
renderer-bone-application-result-kit
motion-presentation-frame-ack-kit
stale-pose-result-rejection-kit
motion-presentation-observation-kit
motion-presentation-journal-kit
game-core-motion-to-render-fixture-kit
articulated-solve-consumption-fixture-kit
creator-game-pose-parity-fixture-kit
physics-motion-frame-parity-fixture-kit
browser-motion-presentation-smoke-kit
pages-motion-presentation-smoke-kit
```

## Validation order

```txt
npm test
fixture:pinned-core-motion-source
fixture:composed-motion-physics-tick
fixture:physics-motion-frame-link
fixture:typed-legacy-pose-fallback
fixture:articulated-zero-target-consumption
fixture:stale-run-pose-rejection
fixture:creator-game-motion-profile-parity
fixture:renderer-bone-application
fixture:first-visible-motion-pose-frame
browser game/creator matrix
Pages game/creator smoke
```

Do not remove the legacy pose path until an explicit articulated result has equivalent or better deterministic, visual and reset proof.