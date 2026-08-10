# PrehistoricRush Headless Visual Upgrade Report

Run: `2026-08-09-prehistoric-headless-visual-upgrade`

Status: **IN PROGRESS — NO FINAL PASS CLAIM**

## Target

Upgrade PrehistoricRush from a technically strong streaming-world dinosaur runner into a visually readable **chunky stylized prehistoric jungle** while preserving Nexus ownership, deterministic generation, four-level tree Fidelity, route readability, collision clarity, streaming health and browser playability.

Primary art outcomes:

- bold species silhouettes at gameplay speed;
- high, overlapping canopy roof with substantially less open sky;
- organic trunks, visible root flare/buttresses and stable bark response;
- dense crown core + shell + fringe rather than hollow card rings;
- deep green interiors with warm transmitted edge light;
- clear racing corridor at normal and maximum boost speed;
- near / medium / far / horizon identity preservation.

## Core changes

**No Nexus Core repository changes.**

PrehistoricRush continues to use the pinned Nexus capabilities as authority:

- Object Vegetation / Tree / Foliage;
- Core Compute;
- Object Shape;
- Core Capture;
- Object Fidelity;
- Core Assets / startup;
- Core Scene / Player / Physics / Simulation / Motion;
- Headless Editor lifecycle for final proof.

Product-specific art intent is supplied as PrehistoricRush descriptors and renderer presentation, rather than duplicating Core responsibilities.

## Kit changes

**No NexusEngine-Kits repository changes.**

Existing Kits remain the runtime composition layer for seeded world patches, procedural creature body, instanced rendering, smooth camera follow and seed authority.

## PrehistoricRush changes

### Art-direction contract

- Added `src/shared/prehistoric-tree-art-direction.js`.
- Centralized 12-species near/medium foliage budgets, canopy zone ratios, trunk shaping and visual validation policy.

### Canopy generation

- `src/shared/prehistoric-foliage-card-recipes.js`
  - explicit canopy core / shell / fringe;
  - species-appropriate radial fronds, hanging foliage and tiered crowns;
  - current crown-roof repair moves crowns to nominal tree-top height;
  - radial/tiered silhouettes now occupy substantially more of declared crown radius;
  - no latest-pass card-count increase.

### Nexus growth admission

- `src/shared/prehistoric-vegetation-domain.js`
  - PrehistoricRush root/trunk/canopy intent feeds existing Nexus vegetation descriptors.
- `src/shared/prehistoric-tree-growth-compute.js`
  - Core skeleton remains authoritative;
  - product-authored canopy clusters are admitted into near/medium growth plans;
  - deterministic medium downsampling;
  - crown coverage and authored-canopy validation;
  - packed branch/foliage/shading buffers remain Core Compute output.

### Tree realization

- `src/render/prehistoric-natural-tree-geometry.js`
  - organic multi-ring growth-segment realization replaces stock segment-cylinder appearance;
  - taper, irregularity, flare, grounding and tree-space bark coloring;
  - segment overlap reduces visible joint seams.

### Foliage / ground presentation

- `src/render/three-lush-foliage-layer.js`
  - deeper crown interiors and warm transmitted edge light.
- `src/render/three-ground-cover-layer.js`
  - improved ambient/emissive readability and reduced hard shadow crushing.

### Validation runtime

- Added fixed `validation/forest-lab.html` + `validation/forest-lab.js` scenes:
  - Tree Lab
  - Root Lab
  - Foliage Lab
  - Canopy Lab
  - LOD Lab
  - Backlight Lab
  - Racing-Line Lab
  - Full Game Seed
- Added browser evidence runner and before/after comparator.
- Browser lab and production game now use separate browser contexts so Tree-Lab WebGL resources are released before the full 12-package Fidelity startup.
- CI-only SwiftShader timing sample reduced to 30 frames; physical game behavior is unchanged.

### Deployment / Headless workflow

- Main validation workflow now gates:
  - `npm test`;
  - fixed browser evidence;
  - current live gameplay probe;
  - before/after comparison;
  - GitHub Pages artifact deployment from validated main source;
  - live Pages smoke checks;
  - pinned NexusEngine-Editor nine-stage Headless lifecycle;
  - persisted pass/failure evidence under `.agent/evidence/...`.

## Tests

### Deterministic / structural

Current Node suite includes:

- syntax/import/module contracts;
- all 12 species;
- near + medium growth-plan validation;
- authored-canopy authority;
- crown coverage;
- crown-top and crown-radius silhouette contracts;
- natural-growth visual authority;
- Fidelity package generation/frame addressing;
- player composition / pose / articulation;
- terrain LOD / streaming ownership;
- 256-seed forest sweep;
- route-placement / determinism checks;
- gameplay resolution policy.

Latest crown-repair source has passed Node validation.

### Mechanics authority

Node resolution-policy coverage includes:

- continue;
- goal → win;
- fatal tree collision → run-over;
- fatal collision beats simultaneous goal;
- pickup acceptance/rejection;
- duplicate pickup handling;
- fallback collision.

Current browser evidence additionally checks live:

- start → active game state;
- boost → distance advances and speed rises;
- steer → yaw changes;
- jump → positive jump height and airborne state.

## Screenshots

Evidence directories contain fixed before/after images for all validation scenes and production game captures when a browser run completes.

Previous direct screenshot review found:

- root/trunk grounding materially improved;
- canopy quantities materially increased;
- foreground ground-cover readability improved;
- crowns were still authored too low and too narrow;
- racing corridor retained too much open sky.

Those crown-height/radius failures drove the current iteration. Fresh screenshots from the current crown-roof source are still required before those items can be promoted to PASS.

## Metrics

Previously observed successful authored-canopy browser evidence showed:

```text
Fidelity package count      12
Foliage batch overflow       0
Decoded tree atlases         12
Decoded impostor frames     384
Browser errors                0
Game browser errors           0
```

Earlier before/after foliage-mass evidence showed large gains in Tree, Canopy and Racing-Line labs, but numeric card density alone is explicitly insufficient for final visual PASS.

## Before / after differences

### Demonstrated improvements

- much higher authored foliage mass;
- deterministic species-specific canopy zones;
- richer organic trunk/root geometry;
- stronger ground-cover readability;
- live 12-species Fidelity remains the presentation authority;
- no observed foliage batch overflow in successful target-density runs.

### Current iteration under observation

- crown centers raised to tree-top range;
- radial and tiered crown width expanded;
- core/shell/fringe cards moderately enlarged without increasing card count;
- explicit numeric silhouette regressions now fail Node validation.

## Performance

GitHub Actions software Chromium / SwiftShader is a **CI regression proxy only**.

It is not a physical MacBook Air benchmark. Full captured-Fidelity startup is extremely expensive under software rendering and has previously taken multiple minutes; browser evidence has therefore been isolated from validation-lab WebGL resources and given a larger CI startup allowance.

**Physical MacBook Air performance remains an external-hardware validation requirement.** It must not be reported as PASS from CI timing.

## Remaining risks / unresolved gates

At the time of this report revision:

- fresh current-iteration screenshot review is pending;
- canopy roof / jungle enclosure is not yet visually PASS;
- trunk joint continuity requires fresh screenshot recheck;
- ground-cover lighting requires fresh production screenshot recheck;
- live start/boost/steer/jump browser assertions require a completed current run;
- Pages deployment/smoke must pass for the current validated source SHA;
- final NexusEngine-Editor nine-stage lifecycle must run after those gates;
- physical MacBook Air performance remains external hardware.

## Final PASS matrix

| Requirement | State |
| --- | --- |
| All 12 species structural contracts | PASS |
| Near growth / authored canopy | PASS |
| Medium growth / authored canopy | PASS |
| Far Fidelity form structurally present | PASS in prior package validation; current source re-observation pending |
| Horizon Fidelity form structurally present | PASS in prior package validation; current source re-observation pending |
| Canopy visual mass | NEEDS-ADJUSTMENT / fresh crown-roof observation pending |
| Forest composition | NEEDS-ADJUSTMENT / fresh observation pending |
| Route readability | OBSERVED previously; fresh crown-roof observation pending |
| Placement / collision deterministic contracts | PASS |
| Determinism | PASS |
| Streaming structural contracts | PASS; fresh live observation pending |
| Foliage capacity | PASS in prior live evidence; current source re-observation pending |
| Browser startup | Current isolated-context evidence run pending |
| Live movement mechanics | Browser assertions implemented; observation pending |
| Win/fail mechanics | PASS in deterministic resolution-policy tests |
| Pages deployment from validated main | PENDING |
| Final nine-stage Headless lifecycle | PENDING |
| Physical MacBook Air performance | EXTERNAL HARDWARE |
| Before/after screenshots complete for final source | PENDING |
| No unverified required claims | NOT YET — run remains open |

## Definition-of-done status

**NOT COMPLETE.**

The report becomes final only when the current source SHA has fresh browser evidence, direct screenshot review resolves every required visual item, Pages deploy/smoke passes, and the real pinned NexusEngine-Editor lifecycle reports all nine stages successful. Physical MacBook Air performance remains explicitly outside CI proof unless target-hardware evidence is supplied.
