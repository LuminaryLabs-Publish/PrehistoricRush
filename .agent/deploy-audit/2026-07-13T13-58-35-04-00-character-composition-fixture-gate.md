# Deploy Audit: Character Composition Fixture Gate

**Timestamp:** `2026-07-13T13-58-35-04-00`

## Goal

Define the tests required before the Core Player/Character/Creature composition and creator transition can be considered production-safe in source, built output and GitHub Pages.

## Existing coverage

```txt
tests/player-character-composition.mjs
  successful composition
  local unscaled bounds
  support descriptors
  controlled-character resolution
  clone safety
  identical idempotence
  changed creature replacement
  preview without player possession

tests/character-creator-authority.mjs
  shared composition source markers
  support-anchor placement markers
  bounds framing markers
  articulated solve markers
```

Both tests are wired into `npm test`.

## Missing unit fixtures

- typed duplicate and replacement outcomes
- no error-message parsing
- expected predecessor revisions
- changed-rig pose compatibility/reset
- missing support bone and invalid support pose
- unequal left/right support anchor policy
- invalid local bounds and scale
- participant rollback after each failure point
- player control-generation preservation on duplicate composition

## Missing integration fixtures

- compose through the pinned real Core Creature/Character/Player runtime
- inject failure after rig preparation
- inject failure after creature preparation
- inject failure after character preparation
- inject failure during possession
- inject mesh creation failure after registry preparation
- inject framing failure after mesh preparation
- verify complete predecessor fingerprints after every rejection
- verify accepted participant revisions advance together

## Missing browser fixtures

- rapid slider edits with stale composition retirement
- topology-compatible morph and topology-changing crossfade
- reset during pending persistence and crossfade
- external profile update during local draft
- unload during transition
- registry readback versus visible mesh fingerprint
- support grounding and camera framing at minimum/maximum body and leg scales
- first visible composed-character acknowledgement

## Deployment parity

```txt
source modules
  -> npm test
  -> static build artifact
  -> local HTTP browser smoke
  -> GitHub Pages origin
```

Every layer must report the same pinned runtime, composition result status, profile revision, support/bounds fingerprint and first-visible-frame acknowledgement.

## Current gate

```txt
npm test: not executed in this documentation run
combined commit statuses: none reported
browser composition fixtures: unavailable / not run
built-output composition smoke: not run
GitHub Pages composition smoke: not run
```

## Completion gate

Do not mark deployment parity complete until the failure matrix passes against the real pinned runtime and the deployed creator proves registry, persistence and visible-preview convergence.