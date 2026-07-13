# PrehistoricRush Known Gaps

**Audit:** `2026-07-13T13-58-35-04-00`  
**Status:** `player-character-composition-transition-authority-central-reconciled`  
**Technical status:** `player-character-composition-transition-authority-audited`

## Summary

Core Creature/Character/Player composition is now source-backed and shared by the game and creator, but registry mutation, support evaluation, preview preparation, profile persistence and visible adoption do not share one atomic composition result.

## Plan ledger

**Goal:** keep every unresolved participant, transition, persistence and proof gap explicit while preserving the new bounded Core architecture.

### Composition identity gaps

- [ ] No composition attempt ID or generation.
- [ ] No accepted composition revision or predecessor identity.
- [ ] No expected body, rig, creature, character or player revisions.
- [ ] No aggregate composition fingerprint.
- [ ] No typed stale or superseded result.

### Preparation and conflict gaps

- [ ] Body and rig are not prepared as detached candidates.
- [ ] Creature and character candidates publish separately.
- [ ] Player registration/possession is not part of an aggregate receipt.
- [ ] Replacement policy depends on exception text containing `different data`.
- [ ] Duplicate, Replace and Conflict are not typed terminal outcomes.
- [ ] Changed-rig compatibility with the preserved character pose ID is not proven.

### Atomicity and rollback gaps

- [ ] Rig registration can succeed before creature adoption fails.
- [ ] Creature replacement can succeed before character adoption fails.
- [ ] Character replacement can succeed before possession fails.
- [ ] No all-participant prepare/commit boundary exists.
- [ ] No aggregate rollback result exists.
- [ ] No bounded attempt/failure journal exists.

### Support and presentation gaps

- [ ] Support-local Y is transition-local rather than a revisioned result.
- [ ] Support anchor evaluation cites no rig or pose revision.
- [ ] Local bounds cite body geometry but no composition revision.
- [ ] Mesh preparation follows live registry mutation.
- [ ] Camera framing combines live registry data with a potentially predecessor mesh.
- [ ] Crossfade generation and stale retirement are implicit.
- [ ] No visible mesh/camera fingerprint exists.
- [ ] No first composed-character frame acknowledgement exists.

### Profile and lifecycle gaps

- [ ] Draft, durable profile and composition revisions are not distinguished in transition results.
- [ ] One input invokes immediate composition and a second post-save composition.
- [ ] Reset does not retire save/composition/crossfade generations as one transaction.
- [ ] External profile updates have no stale/duplicate admission result.
- [ ] Unload has no terminal cancellation/cleanup result for pending composition.

### Test gaps

- [ ] Current tests were not independently executed in this run.
- [ ] No real pinned-runtime composition execution fixture.
- [ ] No participant failure-injection matrix.
- [ ] No replacement-conflict result fixture.
- [ ] No changed-rig pose compatibility fixture.
- [ ] No rapid edit/reset/external-update fixture.
- [ ] No registry/persistence/visible-preview correlation fixture.
- [ ] No built-output or Pages composition parity fixture.

## Retained gaps

Terrain sample/target coherence, PlayerPose provenance, collision-source convergence, Core Input adoption, viewport authority, articulated presentation and browser-runtime retirement remain unresolved independent boundaries.

## Non-claims

The current code proves successful composition, idempotent identical input, changed creature replacement, support descriptors, local bounds and static creator path markers. It does not prove atomic participant adoption, rollback, typed conflicts, pose compatibility, stale-generation isolation, visible-preview coherence, runtime test passage or deployed parity.