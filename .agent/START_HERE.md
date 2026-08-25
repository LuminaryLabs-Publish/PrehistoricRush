# START HERE: PrehistoricRush Race and Streamed-World Verification

**Last aligned:** `2026-08-25`
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed runtime:** `src/game-runtime-semantic-v2.js`
**Status:** `playable-race-streamed-world-verification`

## Summary

The current product result is `game.html`: a selected dinosaur runs on a procedural prehistoric track. The renderer already maintains local terrain and forest patch plans, but the verification boundary must also prove that Nexus World focus updates as the player crosses streaming cells.

## Intent

Make streamed-world updates observable and verifiable without creating a second world manager.

## Checklist

- [x] Make `game.html` the primary playable result.
- [x] Keep the character card limited to selection.
- [x] Add the deterministic world-update contract.
- [x] Add world and race framebuffer capture requirements.
- [x] Update the active route and deployment documentation.
- [ ] Verify Nexus World focus updates during traversal in CI.
- [ ] Verify terrain/forest patch continuity and no streaming holes in CI.
- [ ] Complete Pages and Headless Editor proof for the current source SHA.

## Read this pass first

```txt
.agent/runs/2026-08-25-prehistoric-race-world-update-verification/change-spec.md
.agent/runs/2026-08-25-prehistoric-race-world-update-verification/implementation-graph.md
.agent/runs/2026-08-25-prehistoric-race-world-update-verification/validation.md
.agent/target.md
.agent/runs/2026-08-09-prehistoric-headless-visual-upgrade/report.md (historical)
```

## Claim boundary

The current race, player, camera, HUD, terrain, vegetation, and browser evidence paths exist. World-focus traversal proof, fresh screenshot review, deployed-origin proof, and physical target-hardware performance remain validation requirements.

## Racer controller note

The active Player export now delegates to the shared data-driven racer controller documented in:

```txt
.agent/runs/2026-08-25-racer-controller-foundation/README.md
```

Keep gameplay `RacerProfile` data separate from the cosmetic procedural character profile. Do not mark another racer `playable` until its body, rig, collision, pose, and camera presentation pass the live route.
