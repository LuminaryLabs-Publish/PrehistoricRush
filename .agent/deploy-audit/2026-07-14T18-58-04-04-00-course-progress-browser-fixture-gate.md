# Deploy Audit: Course Progress Browser Fixture Gate

**Timestamp:** `2026-07-14T18-58-04-04-00`

## Summary

Current tests validate the resolution policy with a caller-supplied goal boolean. They do not execute route traversal or prove that source, built output, and GitHub Pages reject reverse, repeated, circular, or off-route movement as course completion.

## Plan ledger

**Goal:** require executable course-progress and finish-frame evidence before claiming route-completion correctness in deployed output.

- [x] Inspect the current test script and outcome-policy test.
- [x] Identify source and browser fixture gaps.
- [x] Define the deployment gate.
- [ ] Implement and run fixtures later.

## Required source fixtures

```txt
route manifest stability
forward checkpoint order
reverse progress rejection
repeated checkpoint rejection
checkpoint skip rejection
off-route lateral rejection
movement telemetry independent from accepted course distance
goal eligibility requires terminal checkpoint
collision wins at finish
retry rejects predecessor progress results
```

## Required browser fixtures

```txt
start game at fixed seed
capture accepted progress revision
circle near start beyond 3600 movement units
assert active run and incomplete course
move off-route beyond 3600 movement units
assert active run and incomplete course
traverse ordered checkpoints forward
assert one CourseCompletionResult
assert HUD cites same progress revision
assert FirstEligibleFinishFrameAck
```

## Artifact gates

```txt
source result fingerprint
built-output result fingerprint
GitHub Pages result fingerprint
course manifest parity
checkpoint identity parity
terminal frame revision parity
```

## Current proof boundary

```txt
npm test: not run
route traversal fixture: unavailable
reverse/circle/off-route fixture: unavailable
browser finish-frame fixture: unavailable
built-output inspection: not run
GitHub Pages smoke: not run
combined commit statuses before audit: none
```

## Validation boundary

No test, package script, build process, workflow, deployment artifact, or Pages configuration changed.