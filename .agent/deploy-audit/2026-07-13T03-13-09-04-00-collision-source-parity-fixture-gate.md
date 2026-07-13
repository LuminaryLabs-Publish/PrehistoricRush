# Deploy Audit: Collision Source Parity Fixture Gate

**Timestamp:** `2026-07-13T03-13-09-04-00`

## Summary

The current Node test covers physics-only and fallback-only collision outcomes, but deployment proof does not compare the two sources against one collider revision or visible failure frame.

## Plan ledger

**Goal:** require source, built output and GitHub Pages to prove identical collision-source policy and outcome provenance.

- [x] Record current Node coverage.
- [x] Record missing browser/provider/fallback parity fixtures.
- [x] Keep runtime and deployment workflows unchanged.
- [ ] Execute the fixture matrix after implementation.

## Existing proof

```txt
npm test
  physics collision -> fail
  fallback collision -> fail
  collision beats pickup and goal
  no simultaneous-source comparison
  no streamed collider lifecycle
  no browser or visible-frame proof
```

## Required fixture matrix

```txt
Node/domain
  both-source agreement
  both-source disagreement
  stale and duplicate evidence
  released collider revision
  provider unavailable degradation

source browser
  deterministic tree hit
  jump-threshold edge
  patch activation/release race
  public collision readback
  first visible run-over frame

built output
  same rows

GitHub Pages
  same rows
  deployed commit identity
```

## Promotion gate

Do not mark collision convergence implemented until every accepted decision cites one collider-set revision, disagreements follow an explicit policy, stale evidence has zero effects and the first visible run-over frame cites the same decision ID.

## Validation

No test, browser smoke, built-output smoke or Pages smoke was run in this documentation-only audit.