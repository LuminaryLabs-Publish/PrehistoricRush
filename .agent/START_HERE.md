# START HERE: PrehistoricRush Production Forest Retirement

**Last aligned:** `2026-07-18T05-40-17-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed prior documentation head:** `a4238e98222f3a3b5f4aaeb52e7f2e747ec1cdab`  
**Reviewed runtime head:** `9462a74d747286d937d5dbfb2b245a2e7ae8371b`  
**Reviewed Nexus Engine revision:** `d41992636de2752f1ad9047b80701e6313f19b87`  
**Status:** `production-forest-legacy-vegetation-work-retirement-authority-audited`

## Summary

PrehistoricRush was the only runtime-ahead eligible Publish repository. Eleven commits add a production forest presentation layer, clustered production vegetation, six grass variants, procedural bark/branch/canopy records, ground-surface details, cache identity updates and source-policy tests.

The new layer hides the three legacy grass meshes, but the base patch adapter still owns their instance batches, replaces and releases their patch cells, flushes their GPU matrices when membership changes, and updates their time/wind uniforms each frame. Visual replacement is implemented; legacy work and resource retirement are not settled as one authority.

## Intent

Make production forest admission explicitly retire superseded vegetation work, preserve required gameplay/collision data, expose capacity and overflow settlement, and prove the first frame rendered by one accepted production-forest generation.

## Checklist

- [x] Compare all 11 Publish repositories with the central ledger.
- [x] Exclude Cavalry of Rome.
- [x] Select and modify only PrehistoricRush.
- [x] Reconcile the 11-commit production-forest runtime delta.
- [x] Document the complete interaction loop, domains, kits and offered services.
- [x] Expand the implemented census from 97 to 99 named surfaces.
- [x] Add the `2026-07-18T05-40-17-04-00` tracker and focused audit family.
- [ ] Add an admitted legacy-grass retirement path instead of visibility-only suppression.
- [ ] Bind production capacities, overflow and patch membership to one generation digest.
- [ ] Execute source, browser, artifact and Pages retirement/convergence fixtures.

## Read this pass first

```txt
.agent/trackers/2026-07-18T05-40-17-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-18T05-40-17-04-00.md
.agent/architecture-audit/2026-07-18T05-40-17-04-00-production-forest-retirement-dsk-map.md
.agent/render-audit/2026-07-18T05-40-17-04-00-hidden-legacy-grass-work-gap.md
.agent/gameplay-audit/2026-07-18T05-40-17-04-00-streamed-production-forest-gameplay-loop.md
.agent/interaction-audit/2026-07-18T05-40-17-04-00-production-forest-command-result-map.md
.agent/production-forest-system-audit/2026-07-18T05-40-17-04-00-legacy-work-retirement-contract.md
.agent/deploy-audit/2026-07-18T05-40-17-04-00-production-forest-browser-pages-gate.md
.agent/central-sync-audit/2026-07-18T05-40-17-04-00-runtime-ahead-production-forest-reconciliation.md
.agent/validation.md
```

## Required authority

`prehistoric-rush-production-forest-legacy-vegetation-work-retirement-authority-domain`

## Census

```txt
implemented named surfaces: 99
new production forest render adapter: 1
new production forest proof kit: 1
proposed production-forest retirement surfaces: 20
retained proposed startup recovery surfaces: 20
retained proposed foliage convergence surfaces: 20
retained proposed provider-admission surfaces: 20
retained proposed pause-arbitration surfaces: 19
retained proposed render-host-retirement surfaces: 19
```

## Claim boundary

The production forest layer, source tests, patch cache revision, clustered placement and visible-frame counters are implemented. Full legacy-work retirement, measured cost reduction, capacity admission, overflow correctness, generation-bound patch convergence and deployed-origin proof remain proposed.