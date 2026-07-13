# Deploy Audit: Player Pose Fixture Gate

**Timestamp:** `2026-07-13T06-39-10-04-00`

## Summary

The new static authority test is present and included in `npm test`, but production readiness requires executable solve, restart, presentation and deployed-origin proof.

## Plan ledger

**Goal:** prevent a source-marker test from being mistaken for complete authoritative-pose proof.

- [x] Record the current static test and package wiring.
- [x] Identify unexecuted runtime and browser cases.
- [x] Define build and Pages parity gates.
- [ ] Execute after fixtures are implemented and a runnable checkout is available.

## Existing source test

`tests/player-pose-authority.mjs` checks:

```txt
PlayerPose resource declaration
pose replacement marker in run system
clone-safe getPlayerPose marker
snapshot playerPose marker
damped renderer import and consumption marker
absence of game.createPlayerPose() in game.js
tick-before-render source ordering
```

`package.json` includes the test after resolution-policy and player-articulation coverage.

## Coverage limits

The test reads source text and applies regular expressions. It does not:

```txt
instantiate the engine or domain
execute resolvePlayerPose()
prove articulated frame metadata retention
prove one pose replacement per tick
prove clone isolation by mutation
exercise start/restart generations
measure visible Three.js bones
compare refresh rates or large dt
run built output
run GitHub Pages
```

## Required fixture gate

### Pure domain

- [ ] Initial, start and tick pose frames carry identities and revisions.
- [ ] Pose output changes deterministically with speed, steer, jump and resistance.
- [ ] Returned/snapshotted clones cannot mutate the resource.
- [ ] Failed or stale solve preserves the accepted predecessor.

### Presentation

- [ ] Renderer consumes only committed pose frames.
- [ ] Damping cites the source frame and policy revision.
- [ ] Restart applies the authored snap/transition policy.
- [ ] 30, 60, 120 and 144 Hz converge within declared tolerance.
- [ ] Large frame gaps produce a bounded typed result.

### Integration

- [ ] `npm test` passes from a clean checkout.
- [ ] Static build contains the authoritative resource path.
- [ ] Browser smoke proves tick, pose, render ordering.
- [ ] Public host exposes target and visible pose evidence without mutable capabilities.
- [ ] GitHub Pages smoke matches source behavior.

## Current validation result

```txt
source inspection: completed
new static test present: yes
package test wiring present: yes
npm test independently run: no
browser pose smoke: no
built-output smoke: no
Pages pose smoke: no
```

A local clone attempt failed because the execution environment could not resolve `github.com`. This is an environment limitation, not a test result.

## Non-claims

No claim is made for passing tests, deterministic solve execution, clone isolation, restart safety, render-rate parity, visible-pose correlation or deployed parity.