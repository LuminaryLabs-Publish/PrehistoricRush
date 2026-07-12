# Validation: PrehistoricRush

**Updated:** `2026-07-11T21-00-00-04-00`

## Summary

This was a documentation-only audit. Source was inspected through the GitHub connector. No runtime, dependency, profile, route, rendering, physics, Worker or deployment behavior was changed.

## Plan ledger

**Goal:** record exactly what source analysis proves about creator draft persistence, preview transition state and viewport framing, and separate that from unexecuted runtime proof.

- [x] Confirm selected repository and `main` branch.
- [x] Confirm no branch or pull request was created.
- [x] Read the current creator page, profile schema/store, preview transition and shared Three adapter.
- [x] Read `game.html`, `charactercreator.html`, runtime versions and game profile admission.
- [x] Confirm the current routes and saved-profile handoff exist.
- [x] Trace rapid multi-group edit behavior through the debounce closure.
- [x] Trace preview revision state and Ready projection.
- [x] Trace local bounds and camera-distance calculation.
- [x] Identify interaction loops, domains, kits and services.
- [ ] Execute browser or Pages tests.
- [ ] Implement creator authority and fixtures.

## Source-backed findings

```txt
creator persistence:
  each input merges into local draft
  each input cancels the prior timer
  each new timer captures only that input's partial patch
  timer commit reloads storage and merges only the captured patch
  returned stored profile replaces local draft

preview state:
  unsaved draft retains stored profile revision
  setTargetProfile assigns that unchanged revision to targetRevision
  compatible geometry still damps over subsequent frames
  getState can report settled from revision equality before convergence

framing:
  mesh.geometry.computeBoundingBox runs each frame
  local center and size are multiplied by mesh scale
  desired distance is max dimension times 1.9, clamped to 4.4..11
  horizontal FOV, viewport aspect and skinned pose bounds are not used

handoff:
  game.html and charactercreator.html exist
  game loads saved profile
  profile.creature enters the product kit graph
  creator and game use the same pinned generator and Three adapter
```

## Static reasoning proof: rapid edit loss

```txt
1. storage contains old proportions and old material
2. proportions edit updates only local draft and schedules proportions patch
3. material edit arrives before 160 ms and cancels first timer
4. second timer contains only material patch
5. store reloads old profile and merges only material patch
6. returned profile overwrites local draft
7. proportions edit is absent from durable state and UI reverts
```

This conclusion follows directly from the current closure capture and store reload order. It was not measured in a browser during this audit.

## Static reasoning proof: premature Ready

```txt
1. appliedRevision equals current stored profile revision
2. local draft descriptor changes without revision increment
3. targetRevision remains equal to appliedRevision
4. mesh damping still has nonzero geometric difference
5. getState compares revisions and may return settled
6. DOM maps settled to Ready
```

## Validation performed

```txt
GitHub organization inventory comparison
central ledger and repo-local audit comparison
recent commit inspection
root .agent presence confirmation
HTML route inspection
creator source inspection
profile schema and storage inspection
preview transition inspection
shared Three adapter inspection
game profile admission inspection
interaction/domain/kit/service inventory
contract and fixture derivation
documentation consistency review
```

## Validation not performed

```txt
local clone, blocked by container DNS resolution
npm install
Node fixtures
browser automation
rapid-slider input execution
cross-tab profile conflict execution
SkinnedMesh posed-bound measurement
portrait/square/wide viewport screenshots
Three render smoke
Rapier execution
GitHub Pages smoke
deployment workflow run
```

## Change classification

```txt
runtime source changed: no
dependencies changed: no
profile implementation changed: no
route files changed: no
render behavior changed: no
physics behavior changed: no
Worker behavior changed: no
deployment configuration changed: no
branch created: no
pull request created: no
target branch: main
```

## Missing executable gates

```txt
rapid multi-group edit persistence fixture
full-draft debounce flush fixture
profile conflict fixture
preview revision/convergence fixture
topology-crossfade bounds fixture
portrait viewport-fit fixture
square viewport-fit fixture
wide viewport-fit fixture
Saved/Ready visible-frame receipt fixture
creator/game profile fingerprint parity fixture
creator browser smoke
creator Pages smoke
```

## Claim boundary

This audit proves the current source order and identifies deterministic failure paths. It does not claim that every browser reproduces the same visual clipping, that the deployed Pages site currently fails, or that the proposed authority has been implemented.