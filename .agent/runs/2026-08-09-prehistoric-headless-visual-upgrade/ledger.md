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

## Iteration 2 — authored canopy + material/grounding repair

### Implemented

- Core Tree skeleton remains authoritative.
- PrehistoricRush Foliage descriptor clusters are admitted into the growth plan as the product-authored canopy:
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
- Bark variation uses species/tree-space height for cross-segment continuity.
- Ground cover receives stronger species-colored ambient/emissive lift and no hard received shadow.
- Main validation deploys an explicit Pages artifact before smoke tests.

### Observed result

- Deterministic Node/growth contracts remained PASS.
- A successful post-authored-canopy browser run admitted all 12 Fidelity packages and reported foliage overflow `0`.
- Direct screenshot review still found a structural canopy defect: crown card centers were authored too low relative to the trunk top, and radial/tiered recipes used only about half of their declared horizontal crown reach.
- The production game could exceed the original 180-second host-ready timeout under GitHub Actions software Chromium even though an earlier identical product build completed successfully.

## Iteration 3 — current crown-roof + live-mechanics validation

Source validation head: `c2208aa80bd18975c3d32c1e56800649ed298351`.

### Implemented

- Radial foliage now uses approximately 88% of its sampled crown radius instead of 48%.
- Tiered crowns now use approximately 82% of their tier radius instead of 52%.
- Broad/core-shell-fringe crowns are anchored from the actual tree top instead of `averageHeight × 0.72`.
- Tiered crowns begin from `averageHeight - crownHeight × 0.9` and reach the top tier near nominal tree height.
- Palm crowns pivot near `averageHeight - crownHeight × 0.16`.
- Fern/cycad crowns pivot near `averageHeight - crownHeight × 0.14`.
- Core/shell/fringe card extents were enlarged modestly without increasing card count.
- Headless visual contracts now require every species to:
  - visually reach at least 96% of nominal tree height;
  - occupy at least 82% of declared crown radius.
- Software-Chromium evidence timeout increased to six minutes for the full 12-package Fidelity startup; game startup behavior itself was not changed.
- The live browser probe now validates actual game state through:
  - Start → active `game` state;
  - Boost → distance increases and speed rises;
  - Steer → yaw changes;
  - Jump → positive jump height and `grounded=false`.
- Resolution-policy Node tests remain the outcome authority for:
  - continue;
  - win;
  - fatal tree collision;
  - collision-over-goal precedence;
  - pickup acceptance/rejection;
  - fallback collision.

### Current states

| Item | State | Required next evidence |
| --- | --- | --- |
| Crown top alignment | IMPLEMENTED | Fresh Tree/Canopy/LOD screenshots from `c2208aa…`. |
| Crown silhouette width | IMPLEMENTED | Fresh Tree/Canopy/Racing-Line screenshots. |
| Canopy visual mass | NEEDS-ADJUSTMENT | Must visually read as a chunky crown, not only pass numeric extent. |
| Jungle roof / racing enclosure | NEEDS-ADJUSTMENT | Must show materially reduced open sky while retaining clear playable corridor. |
| Trunk continuity | OBSERVED | Recheck in fresh Tree/Root screenshots before PASS. |
| Ground-cover lighting | OBSERVED | Recheck production-game screenshot before PASS. |
| Live start/boost/steer/jump | IMPLEMENTED | Current browser run must pass all state assertions. |
| Fidelity packages | OBSERVED | Current browser run must still report 12. |
| Foliage capacity | OBSERVED | Current browser run must still report overflow 0. |
| Pages deployment from main | IMPLEMENTED | Current source SHA must deploy and both smoke URLs must pass. |
| Final Headless lifecycle | REQUESTED | Runs only after browser + Pages gates pass. |
| Physical MacBook Air performance | EXTERNAL HARDWARE | Requires an actual target Mac run; CI SwiftShader cannot substitute. |

## Completion rule

The run cannot close from numeric density alone. Every visual item must have a rendered observation and either `PASS` or an explicitly documented external-hardware exclusion. The final `report.md` is created only after the current source SHA passes browser evidence, Pages deployment/smoke, and the real nine-stage NexusEngine-Editor Headless lifecycle.
