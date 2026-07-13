# PrehistoricRush Validation

**Audit timestamp:** `2026-07-13T13-58-35-04-00`  
**Scope:** Core Player/Character/Creature composition and creator-transition documentation reconciliation

## Summary

This run compared the full Publish inventory with central tracking, selected PrehistoricRush by oldest documented timestamp and newer runtime state, inspected 18 composition/creator source and test commits, then refreshed the required `.agent` projections. No runtime source was changed by this documentation pass.

## Plan ledger

**Goal:** record exactly what was verified, changed and left unproven.

- [x] Verify `LuminaryLabs-Publish/PrehistoricRush` and default branch `main`.
- [x] Enumerate ten Publish repositories and exclude `TheCavalryOfRome`.
- [x] Verify nine eligible central-ledger and root-agent states.
- [x] Compare documented runtime `666ab306...` with current runtime `0c181c30...`.
- [x] Inspect Core Creature, Core Character and Core Player pinned contracts.
- [x] Inspect player-character composition ordering and idempotence logic.
- [x] Inspect game-domain controlled-character adoption and pose binding.
- [x] Inspect creator composition, support placement, bounds framing, morph/crossfade and persistence scheduling.
- [x] Inspect both new composition/creator tests and `npm test` wiring.
- [x] Correct the complete inventory to 52 kit/adapter/proof surfaces.
- [x] Add the timestamped audit family and refresh required root files.
- [x] Change no runtime, renderer, package or deployment source.
- [x] Create no branch or pull request.
- [ ] Execute runtime/browser/build/Pages composition fixtures later.

## Documentation changes

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-13T13-58-35-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T13-58-35-04-00.md
.agent/architecture-audit/2026-07-13T13-58-35-04-00-player-character-composition-transition-dsk-map.md
.agent/render-audit/2026-07-13T13-58-35-04-00-composition-visible-preview-coherence-gap.md
.agent/gameplay-audit/2026-07-13T13-58-35-04-00-core-player-character-composition-loop.md
.agent/interaction-audit/2026-07-13T13-58-35-04-00-profile-composition-transition-result-map.md
.agent/character-composition-audit/2026-07-13T13-58-35-04-00-registry-support-preview-atomicity-contract.md
.agent/deploy-audit/2026-07-13T13-58-35-04-00-character-composition-fixture-gate.md
.agent/central-sync-audit/2026-07-13T13-58-35-04-00-player-character-composition-runtime-reconciliation.md
```

## Source findings verified

```txt
Core Creature installed in game graph: yes
Core Character installed in game graph: yes
Core Player installed in game graph: yes
composition creates body and rig: yes
composition registers/replaces creature: yes
composition creates/replaces character: yes
composition optionally registers/possesses player: yes
game resolves controlled character: yes
creator uses shared composition with includePlayer false: yes
support bone IDs published: yes
support pose evaluated for placement: yes
local unscaled bounds published: yes
camera framing uses composed bounds: yes
identical composition idempotence test: yes
changed embodiment replacement test: yes
creator authority source test: yes
all five tests wired into npm test: yes
```

## Authority findings verified

```txt
aggregate CompositionAttemptId: absent
expected participant revisions: absent
detached all-participant candidate: absent
typed duplicate/replace/conflict result: absent
replacement uses error-message substring: yes
atomic participant adoption: absent
aggregate rollback result: absent
rig-change pose compatibility result: absent
support/bounds composition revision: absent
mesh/framing preparation before registry mutation: absent
registry-visible profile correlation: absent
first composed frame acknowledgement: absent
```

## Change boundary

```txt
runtime source changed by this pass: no
gameplay changed by this pass: no
creator or renderer behavior changed by this pass: no
package scripts or dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
```

## Commands and fixtures not completed

```txt
npm test
real pinned-runtime composition execution
participant failure injection
rapid creator edit/reset/external update fixtures
registry/persistence/visible-preview readback
built-output smoke
GitHub Pages smoke
```

## External status

The reviewed runtime commit had no combined status checks reported through GitHub. This is not a pass or failure result.

## Existing coverage limitation

`tests/player-character-composition.mjs` uses in-memory mock registries and covers successful/idempotent/replacement paths. `tests/character-creator-authority.mjs` checks source markers. Neither injects participant failures, executes the browser crossfade/framing path or proves the real pinned runtime can roll back a partial composition.

## Non-claims

No claim is made for independently passing tests, atomic registry adoption, rollback safety, typed conflict policy, changed-rig pose compatibility, stale-generation isolation, visible-preview equivalence or deployed parity.