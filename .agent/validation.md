# PrehistoricRush Validation

**Audit timestamp:** `2026-07-13T03-12-30-04-00`  
**Scope:** documentation-only browser input and Core Input adoption reconciliation

## Summary

This run compared the current Publish inventory with central tracking, selected PrehistoricRush through the oldest eligible fallback, inspected the browser input and product input paths, preserved the complete 45-surface inventory and added a timestamped input-authority audit family. It changed documentation only.

## Plan ledger

**Goal:** record exactly what was inspected, changed, preserved and not executed.

- [x] Verify `LuminaryLabs-Publish/PrehistoricRush` and `main`.
- [x] Compare ten Publish repositories and exclude `TheCavalryOfRome`.
- [x] Confirm nine eligible central-ledger/root-agent rows.
- [x] Inspect `src/game.js`, the product DSK, root `.agent` files and kit registry.
- [x] Trace Core Input installation, global keyboard listeners, the visible button, blur, RAF input copying and run-system jump consumption.
- [x] Preserve all domains, 45 kit/service surfaces and retained audit families.
- [x] Add the `03-12-30` tracker and audit family.
- [x] Refresh every required root `.agent` document and registry.
- [x] Change no runtime or deployment source.
- [x] Create no branch or pull request.
- [ ] Execute browser-input fixtures after implementation exists.

## Documentation changes

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-13T03-12-30-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T03-12-30-04-00.md
.agent/architecture-audit/2026-07-13T03-12-30-04-00-browser-input-core-adoption-dsk-map.md
.agent/render-audit/2026-07-13T03-12-30-04-00-input-result-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T03-12-30-04-00-global-key-repeat-midrun-reset-loop.md
.agent/interaction-audit/2026-07-13T03-12-30-04-00-browser-sample-core-input-result-map.md
.agent/input-system-audit/2026-07-13T03-12-30-04-00-focus-repeat-generation-core-input-contract.md
.agent/deploy-audit/2026-07-13T03-12-30-04-00-browser-input-fixture-gate.md
```

## Change boundary

```txt
runtime source changed: no
browser input/Core Input behavior changed: no
run lifecycle or gameplay changed: no
simulation/motion/physics changed: no
streaming/articulation changed: no
renderer source changed: no
package scripts/dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
```

## Commands not run

```txt
npm test
browser keyboard/focus smoke
Enter repeat and mid-run restart fixture
Space repeat and landing fixture
blur/visibility/page lifecycle fixture
button/keyboard parity fixture
Core Input adoption fixture
built-output input smoke
GitHub Pages input smoke
```

## Existing coverage limitations

The current `npm test` command covers resolution policy and player articulation. It does not instantiate browser listeners, focus targets, key repeat, page lifecycle, Core Input browser submission, visible buttons, the RAF input path or first-visible-frame acknowledgements.

## Non-claims

No claim is made for Core Input adoption, focus ownership, editable-target safety, repeat determinism, mid-run restart prevention, jump exactly-once behavior, lifecycle generation fencing, stale/duplicate rejection, button/keyboard parity, public input provenance or first-visible-input-frame proof.