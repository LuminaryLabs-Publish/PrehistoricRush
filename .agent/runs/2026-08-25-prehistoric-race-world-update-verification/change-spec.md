# Change Spec — Playable Race and Streamed-World Verification

## Goal

Prove that the actual `game.html` race is live and that the procedural Nexus World updates as the dinosaur advances.

## Allowed changes

- Update Nexus World focus at streaming-cell boundaries.
- Expose world-update and patch diagnostics through `PrehistoricRushHost.getState()`.
- Add deterministic, browser, framebuffer, and Headless Editor checks.
- Correct README, workflow, `.agent` documentation, and target records.

## Excluded changes

- No second world manager.
- No duplicate track implementation.
- No character-card redesign in the race scene.
- No unrelated visual redesign.
- No new deployment workflow.

## Source authority

```text
menu.html
→ game.html
→ src/pages/game.js
→ src/game-runtime-semantic-v2.js
→ Nexus World + Course + Player + Renderer
```

## Required evidence

- `world-before.png`
- `race-before.png`
- `race-after.png`
- `world-after-movement.png`
- before/after world-update metrics
- Headless Editor nine-stage result
- Pages deployment and smoke result
