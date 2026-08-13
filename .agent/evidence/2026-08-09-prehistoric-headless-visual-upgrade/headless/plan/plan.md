# Headless Editor Plan

Goal: # PrehistoricRush Headless Visual Upgrade Target

Run: `2026-08-09-prehistoric-headless-visual-upgrade`

## Goal

Upgrade the production forest to a chunky stylized prehistoric canopy while preserving deterministic NexusEngine ownership, route readability, collision clarity, streaming stability, and playable performance.

## Architectural constraints

- Reuse NexusEngine Object Vegetation, Tree, Foliage, Compute, Shape, Fidelity, Capture, Placement, and Graphics semantics.
- Keep authored species, visual tuning, route rules, and gameplay composition in PrehistoricRush.
- Do not create a second tree engine or a parallel Fidelity system.
- Keep tree collision trunk-authoritative; decorative roots/buttresses must not silently expand lethal collision.
- Validate source changes through the real production modules and reproducible browser scenes.

## Visual target

- Dense upper canopy with reduced empty sky and overlapping crowns.
- Bold readable species silhouettes at 26-31 m/s.
- Organic trunks with visible taper, curvature, base flare, and grounded roots.
- Stylized bark with broad stable variation rather than noisy photoreal detail.
- Foliage with dark interior mass, readable midtones, and warm edge transmission.
- Near detail high; medium preserves mass; far/horizon preserve species identity without obvious popping.
- Track corridor remains immediately readable at maximum boost.

## Quantitative acceptance

- 12/12 tree archetypes produce valid deterministic near and medium growth plans.
- Near foliage targets: 64-96 authored placements depending on species.
- Medium foliage target: approximately 35% of near density, never below 22 placements for the current 12 species.
- Non-radial near crown coverage minimum: 0.42.
- Non-radial medium crown coverage minimum: 0.24.
- Radial-frond near crown coverage minimum: 0.34.
- Radial-frond medium crown coverage minimum: 0.18.
- Near minimum foliage clusters: radial 18, non-radial 28.
- Medium minimum foliage clusters: radial 10, non-radial 14.
- Deterministic seed validation reports zero identity mismatches, invalid growth plans, malformed placement data, or non-finite bounds.
- Normal target-density browser runs report zero foliage batch overflow.
- Browser validation reports zero page errors, shader errors, or unhandled exceptions.
- Production `game.html` boots, exposes `PrehistoricRushHost`, renders a canvas, starts a run, and remains responsive during representative input.

## Required visual evidence

Fixed scenes:

1. Tree Lab
2. Root Lab
3. Foliage Lab
4. Canopy Lab
5. LOD Lab
6. Backlight Lab
7. Racing-Line Lab
8. Full Game Seed

Each fixed scene uses deterministic seeds, fixed camera, fixed lighting, fixed viewport, and the real Nexus/Three tree-growth path.

## Definition of done

- All 12 species pass structure, foliage, material, near, medium, far, horizon, and screenshot checks.
- Forest composition, route readability, placement/collision, determinism, streaming, browser startup, and batch capacity pass.
- Before/after evidence is retained by the Headless/CI workflow.
- The final ledger contains only `PASS` or explicitly documented external hardware exclusions.
- Main remains playable and the deployed GitHub Pages game is reachable from the `main` revision.


- validation.determinism.verify
- validation.continuity.verify
- validation.gameplay.verify
- validation.deployment.verify
