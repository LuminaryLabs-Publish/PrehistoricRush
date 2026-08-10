# PrehistoricRush Headless Visual Upgrade — Validation

Run: `2026-08-09-prehistoric-headless-visual-upgrade`

## Validation authority

Required order:

```text
npm test
  ↓
fixed Nexus/Three render labs
  ↓
before/after screenshots + metrics
  ↓
live production game startup
  ↓
live start / boost / steer / jump probe
  ↓
12-package Fidelity + zero-overflow checks
  ↓
GitHub Pages deploy from validated main SHA
  ↓
live game + validation-lab smoke
  ↓
NexusEngine-Editor nine-stage Headless lifecycle
  ↓
final ledger/report
```

No required visual claim is PASS from source inspection alone.

## Fixed render scenes

All scenes use the repository validation runtime, fixed viewport `1440×900`, deterministic species inputs, and the real Nexus Object Vegetation + Tree/Foliage + Core Compute growth path.

```text
Tree Lab
Root Lab
Foliage Lab
Canopy Lab
LOD Lab
Backlight Lab
Racing-Line Lab
Full Game Seed
```

Evidence paths:

```text
.agent/evidence/2026-08-09-prehistoric-headless-visual-upgrade/
├── tree-lab/
├── root-lab/
├── foliage-lab/
├── canopy-lab/
├── lod-lab/
├── backlight-lab/
├── racing-line/
├── game/
├── before/
└── after/
```

## Node gates

`npm test` must pass completely.

Required contracts include:

- syntax/import health;
- all 12 tree species;
- near + medium deterministic growth plans;
- product-authored canopy admission;
- crown coverage minimums;
- crown top reaches at least 96% of nominal tree height;
- crown silhouette reaches at least 82% of declared crown radius;
- natural-growth single visual authority;
- Fidelity package construction and frame addressing;
- player composition, pose and articulation;
- pause/menu authority;
- terrain LOD and patch ownership;
- deterministic 256-seed forest sweep;
- zero deterministic mismatch / invalid placement / impossible route-block contract failures;
- gameplay resolution policy: continue, win, fatal collision, collision-over-goal precedence, pickup handling and fallback collision.

## Browser / live game gates

The current-main production game must:

```text
PrehistoricRushHost present          PASS required
canvas present                        PASS required
browser errors                        0
shader/runtime errors                 0
start input → game                    PASS required
boost advances distance               PASS required
boost raises speed                    PASS required
steer changes yaw                     PASS required
jump raises jumpHeight                PASS required
jump sets grounded=false              PASS required
Fidelity package count                12
lush foliage overflow                 0
exact impostor frame acknowledgement  present
```

Software Chromium may take substantially longer than hardware WebGL to prepare all captured Fidelity assets. CI therefore allows up to six minutes for the production host-ready state; this changes only the evidence harness, not game startup behavior.

## Visual acceptance gates

Direct screenshot review is mandatory for:

- **Tree Lab:** recognizable species silhouettes; crowns sit at the tree top rather than below continuing bare trunk.
- **Root Lab:** grounded root flare/buttresses, no floating trunks, no obvious segment seams at validation distance.
- **Foliage Lab:** cards read as crown volume, not isolated flat planes.
- **Canopy Lab:** crown interiors are filled and overlapping crowns produce a continuous upper mass.
- **LOD Lab:** near/medium identity is preserved with no obvious collapse.
- **Backlight Lab:** deep green interiors + warm transmitted edges; no neon or black foliage.
- **Racing-Line Lab:** forest encloses the route while the playable corridor remains immediately readable.
- **Production Game:** no black ground cover, no unavoidable visual collision walls, route remains readable at boost speed.

## Fidelity / streaming gates

Required live observations:

```text
all tree Fidelity packages admitted   12
runtime impostor images decoded       12 atlases / expected frames
near / medium / far / horizon forms   structurally present for every species
foliage batch overflow                 0
startup simulation patches            all required ready
startup visual patches                all required ready
collision readiness                    true
renderer readiness                     true
streaming holes                        0 observed
```

A horizon instance count of zero in a particular camera frame is not a failure; the horizon **form/package** must exist for every species.

## Pages deployment gate

The workflow must deploy the validated `main` source using the GitHub Pages artifact path, then verify both:

```text
https://luminarylabs-publish.github.io/PrehistoricRush/game.html
https://luminarylabs-publish.github.io/PrehistoricRush/validation/forest-lab.html
```

Both URLs must return successfully and contain their expected page markers.

## Final Headless lifecycle

Pinned NexusEngine-Editor commit:

`2c87650436c332324f6c74d87f774a152e3aa8a2`

Required lifecycle:

```text
read
→ capture-before
→ plan
→ validate
→ submit
→ observe
→ verify
→ capture-after
→ observed-differences
```

All nine stages must pass only after browser evidence and Pages smoke pass.

## Performance interpretation

GitHub Actions SwiftShader timing is recorded only as a repeatable CI regression proxy. It is **not** physical MacBook Air performance evidence.

Physical MacBook Air performance remains an external-hardware validation requirement unless an actual target Mac run is supplied. It must not be silently promoted to PASS from CI software rendering.

## Current status

Source head under validation at the time this file was written: `c2208aa80bd18975c3d32c1e56800649ed298351`.

The final result must be read from:

```text
.agent/evidence/2026-08-09-prehistoric-headless-visual-upgrade/after/workflow-result.json
.agent/evidence/2026-08-09-prehistoric-headless-visual-upgrade/after/deployment-pass.json
```

The ledger and final report may close only when the current source SHA has fresh browser evidence, Pages PASS, Headless PASS, and direct screenshot review has no unresolved visual requirement.
