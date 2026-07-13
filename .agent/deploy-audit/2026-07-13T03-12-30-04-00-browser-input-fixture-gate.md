# Deploy Audit: Browser Input Fixture Gate

**Timestamp:** `2026-07-13T03-12-30-04-00`

## Summary

The existing Node tests prove resolution policy and articulation adaptation only. They do not execute browser focus, key repeat, lifecycle loss, button parity, Core Input adoption or first-visible-frame behavior.

## Plan ledger

**Goal:** require equivalent input-admission evidence in source, built output and deployed GitHub Pages before the authority is promoted.

- [x] Record the current test boundary.
- [x] Define browser and Pages fixture rows.
- [x] Keep runtime and deployment source unchanged.
- [ ] Add and execute the fixture matrix after implementation.

## Existing proof

```txt
npm test
  -> prehistoric-rush-resolution-policy.mjs
  -> player-articulation.mjs

browser input fixtures: absent
Core Input adoption fixtures: absent
Pages input smoke: absent
```

## Required fixture matrix

```txt
source browser
  focus ownership and editable-target exclusion
  A/D/W and arrow held-state parity
  keyup retirement
  Enter mid-run rejection
  Enter repeat rejection
  Space repeat produces one edge command
  blur generation fence
  visibility/page lifecycle generation fence
  button/keyboard result parity
  stale and duplicate zero-mutation results
  Core Input snapshot/public diagnostics
  first visible input-frame acknowledgement

built output
  same rows
  built commit identity

GitHub Pages
  same rows
  deployed commit identity
  browser-default suppression only for admitted game controls
```

## Promotion gate

Do not mark the input authority implemented until browser samples enter through Core Input, one-shot repeats are deterministic, lifecycle boundaries retire predecessor input, rejected samples have zero effects, button and keyboard actions share terminal results, and the first visible frame cites the accepted result.

## Validation

No test, build, browser smoke, Pages smoke or input fixture was run in this documentation-only pass.