# Implementation Graph

```text
player movement
  → player world position
  → streaming cell boundary
  → Nexus World focus update
  → terrain and forest patch plan
  → renderer patch retention
  → framebuffer evidence
  → Headless Editor verification
  → GitHub Pages smoke test
```

## Ownership

| Concern | Owner |
|---|---|
| World recipe and revision | `world-recipes.js` |
| World focus and Foundation sampling | `world-implementation.js` + Nexus World |
| Route and track | `course-implementation.js` |
| Player movement | `player-implementation.js` |
| Terrain and forest patch presentation | `rendering-implementation.js` |
| Browser evidence | `tests/browser-visual-validation.mjs` |
| Headless evidence | `tests/headless-editor-evidence.mjs` |
| Deployment | `.github/workflows/deploy.yml` |
