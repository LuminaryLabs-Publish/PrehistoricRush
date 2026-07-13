# Deploy Audit: Terrain IK Fixture Gate

**Timestamp:** `2026-07-13T08-39-12-04-00`

## Summary

The repository contains deterministic unit/static coverage for target math and source wiring, but no executable gate proves streamed terrain revisions, authoritative solve output and visible Three.js terrain/skeleton parity across source, build and GitHub Pages.

## Plan ledger

**Goal:** define the minimum fixture matrix required before terrain-aware hind-leg IK can be treated as deployment-proven.

- [x] Record present test wiring.
- [x] Separate source-shape coverage from runtime/browser proof.
- [x] Define pure-domain, streaming, renderer and deployed-origin gates.
- [ ] Execute the matrix after implementation support exists.

## Present coverage

```txt
npm test
  -> prehistoric-rush-resolution-policy.mjs
  -> player-articulation.mjs
  -> player-pose-authority.mjs
```

Present assertions cover deterministic target math, raised/swing/airborne behavior, duplicate input equality, FK/target/solve source markers, height-sampler enablement, runtime pinning and tick-before-render ordering.

## Missing fixture matrix

### Pure target fixtures

- [x] Flat exact height.
- [x] Raised height.
- [x] Swing-foot weight reduction.
- [x] Airborne zero weight.
- [x] Deterministic duplicate inputs.
- [ ] Non-finite sampler output.
- [ ] Missing chain/end bone.
- [ ] Unreachable target and solver clamp result.
- [ ] Maximum correction policy.

### Patch-stream fixtures

- [ ] Exact active-patch sample includes patch/content identity.
- [ ] Fallback sample is explicitly classified.
- [ ] Worker patch becomes ready between simulation and render.
- [ ] Patch release occurs near a contacting foot.
- [ ] Patch-controller reset retires old sample results.
- [ ] Sampler replacement increments generation.

### Domain fixtures

- [ ] Instantiate the composed engine and execute an active tick.
- [ ] Prove target-frame commit and PlayerPoseFrame linkage.
- [ ] Prove stale sample/target predecessor preservation.
- [ ] Prove restart generation isolation.
- [ ] Prove public snapshot clone isolation.

### Browser/render fixtures

- [ ] Inspect visible terrain height beneath each foot.
- [ ] Inspect visible bone fingerprint after damping.
- [ ] Correlate target, pose, presentation and terrain revisions.
- [ ] Compare fallback-to-exact patch transition.
- [ ] Compare 30/60/120/144 Hz presentation.
- [ ] Exercise WebGL context loss and host restart interactions.

### Build/deploy fixtures

- [ ] Clean-checkout `npm test`.
- [ ] Static build/import validation.
- [ ] Built-output browser smoke.
- [ ] GitHub Pages smoke at the deployed origin.
- [ ] Verify pinned Nexus commit and terrain-IK API parity.
- [ ] Verify source/build/Pages frame receipts agree.

## Release gate

Do not claim deployment-proven terrain IK until:

```txt
all mandatory sample/target results are typed
patch activation/release is revision-fenced
articulated solve cites an accepted target frame
visible terrain and skeleton cite one coherent frame family
clean source, built output and Pages fixtures pass
```

## Current validation result

```txt
reviewed source head: 666ab306b94c9fefcd8bb4230b61854f121dab86
npm test independently run: no
combined commit statuses reported: none
browser terrain-IK smoke: not run
build smoke: not run
Pages smoke: not run
```

No production-readiness claim is made.