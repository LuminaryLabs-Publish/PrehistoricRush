# Deploy Audit: Character Creator Fixture Gate

**Timestamp:** `2026-07-11T21-00-00-04-00`

## Summary

The repository has no root package manifest and the current audit could not execute browser or Pages proof. Deployment should not be treated as creator-correct until edit persistence, preview state, viewport framing and game handoff fixtures run against the deployed artifact.

## Plan ledger

**Goal:** define the minimum automated gate for creator changes before Pages is considered trustworthy.

- [x] Identify route and runtime artifacts.
- [x] Define source-level fixtures.
- [x] Define browser viewport and interaction fixtures.
- [x] Define deployed Pages checks.
- [ ] Add scripts and workflow wiring.
- [ ] Execute the gate.

## Required static route gate

```txt
index.html exists and routes to menu runtime
menu.html exists
charactercreator.html exists and imports src/pages/character-creator.js
game.html exists and imports src/pages/game.js
all pinned runtime URLs resolve to declared commits/versions
creator and game import the shared Three creature adapter
```

## Required Node fixtures

```bash
node scripts/prehistoric-rush-creator-rapid-multigroup-edit-fixture.mjs
node scripts/prehistoric-rush-creator-debounce-flush-fixture.mjs
node scripts/prehistoric-rush-profile-write-conflict-fixture.mjs
node scripts/prehistoric-rush-preview-revision-state-fixture.mjs
node scripts/prehistoric-rush-preview-topology-crossfade-fixture.mjs
node scripts/prehistoric-rush-creator-game-profile-parity-fixture.mjs
```

## Required browser fixtures

```txt
open creator at portrait, square and wide dimensions
set Size then Skin inside one debounce interval
wait for Saved + Ready
reload creator
confirm both edits remain
open game
confirm admitted profile fingerprint and descriptor match creator
exercise minimum and maximum visible slider values
resize during active morph
verify creature remains inside declared screen margins
trigger reset and confirm creator/game default parity
```

## Required Pages smoke

```txt
load deployed menu
open deployed creator
verify pinned modules load
verify real SkinnedMesh appears
perform rapid multi-group edit
verify durable reload parity
verify Saved + Ready frame receipt
open deployed game
verify same profile fingerprint
verify no 404 route or module error
```

## Required failure injections

```txt
localStorage unavailable
localStorage write throws
BroadcastChannel unavailable
remote profile revision advances during dirty local draft
creature module import fails
Three import fails
ResizeObserver fires during disposal
topology transition interrupted by another target
navigation occurs while flush is pending
```

## Deployment admission result

```txt
CharacterCreatorDeployGateResult {
  commitSha
  routeGate
  nodeFixtures
  browserFixtures
  pagesSmoke
  profileParity
  viewportFit
  failures
  accepted
}
```

## Current status

```txt
root package.json: absent
creator Node fixtures: absent
browser automation: not run
Pages smoke: not run
profile parity proof: absent
viewport margin proof: absent
deployment configuration changed by this audit: no
```