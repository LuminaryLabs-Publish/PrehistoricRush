# PrehistoricRush Visual Upgrade Ledger

Run: `2026-08-09-prehistoric-headless-visual-upgrade`

## State model

`REQUESTED → IMPLEMENTED → OBSERVED → NEEDS-ADJUSTMENT → PASS`

## Iteration 1 — measured but visually incomplete

| Item | State | Evidence / decision |
| --- | --- | --- |
| 12-species deterministic growth | PASS | Node contracts and 256-seed sweep passed. |
| Fixed browser scenes | PASS | Eight scenes rendered with no browser errors. |
| Production game boot | PASS | `PrehistoricRushHost` + canvas present. |
| Fidelity packages | PASS | Live package count 12; 384 decoded capture frames. |
| Foliage capacity | PASS | Live overflow 0. |
| Canopy foliage quantity | PASS | Canopy Lab 708 → 1794 cards. |
| Tree Lab foliage quantity | PASS | 682 → 1893 cards. |
| Racing-Line foliage quantity | PASS | 810 → 2131 cards. |
| Canopy visual mass | NEEDS-ADJUSTMENT | Direct screenshot review: still too open/sparse; Core fallback terminal placement did not express authored core/shell/fringe spatial intent. |
| Trunk continuity | NEEDS-ADJUSTMENT | Direct Root/Tree Lab review: visible horizontal joints between organic Core growth segments. |
| Ground-cover lighting | NEEDS-ADJUSTMENT | Direct production-game review: foreground alpha foliage crushed to black/near-black under shadows. |
| Jungle roof / racing enclosure | NEEDS-ADJUSTMENT | Direct Racing-Line/game review: too much open sky and isolated tree crowns. |
| GitHub Pages validation-lab deployment | NEEDS-ADJUSTMENT | Game URL served; new `/validation/forest-lab.html` remained 404 until an explicit Pages rebuild is requested. |
| Physical MacBook Air performance | EXTERNAL HARDWARE | CI SwiftShader is retained only as a regression proxy; it is not target-hardware proof. |

## Iteration 2 — current implementation under validation

### Implemented

- Core Tree skeleton remains authoritative.
- PrehistoricRush Foliage descriptor clusters are now admitted into the growth plan as the product-authored canopy:
  - canopy core
  - canopy shell
  - canopy fringe / hanging edge
  - radial fronds
  - crown tiers
- Near forms keep authored cluster extents and crossed-plane volume.
- Medium forms deterministically downsample the same authored spatial recipe.
- Growth-plan metrics are recomputed from the admitted authored foliage.
- Validation rejects any species/quality that does not carry `productAuthoredCanopy: true`.
- Organic growth segments overlap slightly at joints to hide open seams.
- Bark variation now uses species/tree-space height for cross-segment continuity.
- Ground cover receives stronger species-colored ambient/emissive lift and no hard received shadow.
- Pages validation explicitly requests a rebuild from the latest `main` revision before smoke tests.

### Required observation before PASS

- Render all eight fixed scenes again.
- Directly inspect Tree, Root, Canopy, Backlight, Racing-Line and production-game screenshots.
- Confirm crowns form readable masses rather than isolated tiny cards.
- Confirm trunk seams are no longer visible at normal validation-camera distance.
- Confirm foreground ground cover remains colored/readable rather than black.
- Confirm production live foliage overflow remains 0.
- Confirm all 12 Fidelity packages remain admitted.
- Confirm Pages serves both `game.html` and `validation/forest-lab.html`.
- Run the real NexusEngine-Editor nine-stage Headless lifecycle only after all gates above pass.

## Completion rule

The run cannot close from numeric density alone. Every visual item must have a rendered observation and either `PASS` or an explicitly documented external-hardware exclusion.
