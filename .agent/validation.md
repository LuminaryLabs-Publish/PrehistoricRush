# PrehistoricRush Validation

**Audit timestamp:** `2026-07-16T14-39-29-04-00`  
**Scope:** runtime-ahead tree reconciliation, exact frame addressing, ecological variation, elevation-row continuity, and visible proof

## Summary

Source inspection confirms that the prior exact-frame plan is implemented: camera azimuth and elevation are derived, exact frame records and UV rectangles are bound, adjacent azimuth frames blend, and an exact frame-binding digest and acknowledgement are published. It also confirms that only the single nearest captured elevation row is admitted per frame.

## Intent

Separate verified tree-fidelity implementation from the remaining elevation-row continuity and executable visual-proof work.

## Checklist

- [x] Compare all 11 Publish repositories and exclude Cavalry.
- [x] Confirm ten eligible central ledgers and root `.agent` states.
- [x] Select the older runtime-ahead repository only.
- [x] Compare `36bd09e2..d427de44`.
- [x] Inspect tree archetypes, patch generation, runtime image hydration, fidelity rendering, tests, package scripts, and CI fixes.
- [x] Add and route the timestamped audit family on `main`.
- [ ] Execute source, browser, artifact, and Pages continuity fixtures.

## Confirmed by inspection

```txt
reviewed pre-audit repository head: d427de443aea28b256c92a760a8d1c6f6a396efb
previous documentation head: 36bd09e2f6abc0862dc94955bef55268d0ebf7b6
runtime ahead by: 14 commits
changed files: 12
ten authored tree species: present
deterministic ecological selection: present
seeded per-tree variation: present
stable collision proxy: present
shared atlas decode/crop: present
camera azimuth and elevation derivation: present
exact frame record and UV binding: present
adjacent azimuth blending: present
frame-binding digest and exact-frame acknowledgement: present
source tests for exact addressing and spawn variation: present

elevation lower/upper bracket: absent
elevation interpolation/deadband: absent
retained row-transition state: absent
TreeImpostorViewContinuityResult: absent
FirstContinuousImpostorFrameAck: absent
browser elevation-boundary fixture: absent
```

## Source inspection performed

```txt
LuminaryLabs-Publish organization inventory
LuminaryLabs-Dev/LuminaryLabs Publish ledgers
compare 36bd09e2..d427de44
src/shared/tree-archetype-catalog.js
src/world/prehistoric-patch-generator.js
src/shared/tree-fidelity-assets.js
src/shared/tree-fidelity-runtime-images.js
src/render/three-tree-fidelity-layer.js
tests/tree-fidelity-assets.mjs
tests/tree-fidelity-frame-addressing.mjs
tests/tree-spawn-variation.mjs
package.json
```

## What is not proven

```txt
that a visible row-switch pop currently occurs
that an elevation-interpolation policy is correct
npm test success at the final documentation head
browser rendered continuity
built artifact parity
GitHub Pages parity
production readiness
```

## Required fixtures

```txt
below/at/above every elevation midpoint
slow elevation sweep
camera bob around midpoint
jump, landing, camera reset, and terrain-height changes
stale package/camera/tree/form transition rejection
far/horizon and LOD-crossfade composition
same-trace binding-digest reproducibility
source/build/Pages rendered parity
FirstContinuousImpostorFrameAck
```

## Change scope

```txt
documentation changed: yes
runtime JavaScript changed by audit: no
assets or tree content changed by audit: no
gameplay, rendering, physics, and camera changed by audit: no
tests or package scripts changed by audit: no
workflow or deployment changed by audit: no
branch created: no
pull request created: no

npm test: not run
browser fixtures: not run
built-output smoke: not run
Pages smoke: not run
```

No elevation-row continuity, rendered transition correctness, artifact parity, Pages parity, or production readiness is claimed.