# Next Steps: PrehistoricRush

**Updated:** `2026-07-12T12-08-05-04-00`

## Plan ledger

**Goal:** connect the installed motion, physics, articulation and rendering capabilities through one product-owned result without moving rendering responsibilities into Nexus Engine core.

### Gate 0: preserve current behavior
- [ ] Keep movement and outcome arbitration in the current product and Core Simulation boundary.
- [ ] Preserve collision, goal and pickup precedence.
- [ ] Keep the streamed-content parity audit active as a separate dependency.
- [ ] Keep Core Motion and articulated motion renderer-neutral.

### Gate 1: establish shared identity
- [ ] Add one motion-source revision for each admitted run step.
- [ ] Record input sequence, run generation and actor identity.
- [ ] Add the authorizing Core Motion frame ID to each Core Physics motion request.
- [ ] Return a physics-consumption result containing request and physics-frame IDs.

### Gate 2: declare presentation policy
- [ ] Add a versioned player motion and presentation profile.
- [ ] Declare the gameplay pose mode.
- [ ] Declare a comparable creator pose mode.
- [ ] Represent legacy procedural posing as an explicit fallback result.
- [ ] Include creature-profile, skeleton and rig fingerprints.

### Gate 3: consume articulated results
- [ ] Adopt the player rig through one revisioned receipt.
- [ ] Build pose targets from committed gameplay and terrain state.
- [ ] Run articulated solving against the admitted motion revision.
- [ ] Return a typed articulated pose result.
- [ ] Reject results from an earlier run, profile or rig generation.
- [ ] Keep physical articulation inactive until joints or motors are configured.

### Gate 4: prove renderer consumption
- [ ] Select exactly one pose result for each player frame.
- [ ] Apply only that result to the Three.js skeleton.
- [ ] Record applied, missing and rejected bone IDs.
- [ ] Commit a renderer pose-application receipt.
- [ ] Publish a first-visible-frame acknowledgement containing run, motion, physics, pose and renderer IDs.
- [ ] Project the detached parity result through the public host.

### Gate 5: align creator and game
- [ ] Publish comparable motion-profile descriptors in both surfaces.
- [ ] Prove both surfaces use the same profile, skeleton and rig fingerprints.
- [ ] Separate preview-only turntable motion from gameplay locomotion.
- [ ] Retire prior preview work after profile replacement or teardown.

### Gate 6: reset and lifecycle
- [ ] Retire predecessor input, motion-frame and pose results on restart.
- [ ] Reset Core Motion, articulated motion and optional articulated dynamics together.
- [ ] Revoke pose consumers before replacing the player mesh.
- [ ] Prove creator teardown stops preview animation and pose consumers.

### Gate 7: executable proof
- [ ] Add pinned-module admission fixtures.
- [ ] Add a composed Core Motion and Core Physics tick fixture.
- [ ] Add explicit fallback and articulated-result selection fixtures.
- [ ] Add earlier-generation result rejection fixtures.
- [ ] Add Three.js bone-application and first-visible-frame fixtures.
- [ ] Add browser and deployed Pages parity smokes.

## Candidate kit order

```txt
prehistoric-rush-motion-presentation-parity-authority-domain
motion-source-policy-kit
run-motion-revision-kit
motion-intent-sequence-kit
motion-frame-reference-kit
physics-request-motion-link-kit
player-rig-generation-kit
player-pose-profile-kit
creator-pose-profile-kit
articulated-solve-command-kit
articulated-solve-admission-kit
articulated-solve-result-kit
legacy-pose-fallback-policy-kit
pose-source-selection-kit
pose-result-generation-admission-kit
renderer-pose-application-command-kit
renderer-bone-application-result-kit
motion-pose-observation-kit
motion-pose-journal-kit
visible-pose-frame-ack-kit
motion-presentation-parity-fixture-kit
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
fixture:articulated-result-consumption
fixture:prior-generation-pose-rejection
fixture:creator-game-motion-profile-parity
fixture:renderer-bone-application
fixture:first-visible-motion-pose-frame
browser game/creator matrix
Pages game/creator smoke
```

Keep the legacy pose path until articulated presentation has equivalent or better deterministic, visual and reset proof.