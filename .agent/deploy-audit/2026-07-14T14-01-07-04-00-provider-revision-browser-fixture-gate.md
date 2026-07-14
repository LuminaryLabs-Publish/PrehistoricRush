# Provider Revision Browser Fixture Gate

**Timestamp:** `2026-07-14T14-01-07-04-00`

## Summary

Current Node tests inspect local source and do not execute the browser import map, CDN module graph, stable-kit bare imports, ProtoKit bare imports, route composition, or a visible frame. Provider convergence therefore requires a real-browser fixture across source, built output, and GitHub Pages.

## Plan ledger

**Goal:** prevent deployment promotion until every delivery surface proves one accepted NexusEngine revision and one matching first frame.

- [x] Identify the current Node-only proof boundary.
- [x] Define source-route provider checks.
- [x] Define built-output and Pages parity checks.
- [x] Define split-revision fault injection.
- [ ] Implement and execute the fixtures later.

## Required fixtures

```txt
source game route
  -> capture configured manifest
  -> capture resolved import-map nexusengine URL
  -> capture root runtime revision
  -> capture stable-kit and ProtoKit provider receipts
  -> assert one NexusEngine revision
  -> assert RouteProviderAdmissionResult.accepted
  -> assert FirstProviderConvergedFrameAck

source creator route
  -> repeat the same provider assertions
  -> assert preview composition and first frame

split-revision fault injection
  -> intentionally map nexusengine to a different revision
  -> assert startup rejects before run, Worker, physics, or RAF admission
  -> assert DOM fallback and diagnostic result

built output
  -> repeat game and creator assertions

GitHub Pages
  -> repeat game and creator assertions against the public artifact
  -> compare provider manifest and accepted graph with source/build expectations
```

## Promotion gate

```txt
provider graph converged: required
configured and resolved identities match: required
composition receipt: required
candidate rollback on rejection: required
first provider-converged frame: required
source/build/Pages parity: required
```

## Validation not performed

```txt
npm test
browser module-graph capture
split-revision fault injection
built-output smoke
GitHub Pages smoke
```
