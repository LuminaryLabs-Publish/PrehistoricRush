# Startup Failure Browser / Pages Fixture Gate

**Timestamp:** `2026-07-18T02-39-16-04-00`

## Current proof boundary

`npm test` performs syntax checks and source-level domain/authority fixtures. It does not load the real game route, force CDN/module failure, force tree atlas failure, exercise retry, or confirm cleanup and recovery at the built or deployed origin.

## Required fixture matrix

```txt
source browser
  module rejection
  bundle rejection
  atlas HTTP rejection
  atlas decode rejection
  unreadable Canvas2D context
  retry success
  retry exhaustion
  return to menu

built artifact
  same route and failure controls
  exact runtime URL and asset-origin evidence

GitHub Pages
  exact deployed URLs
  cache behavior
  retry generation identity
  first recovered frame acknowledgement
```

## Gate evidence

```txt
StartupFailureResult
StartupRecoveryResult
StartupNavigationResult
retired provider/runtime identities
startup generation digest
first recovered frame digest
artifact revision
Pages revision and URL
```

## Pass criteria

- Failure is visible and accessible without relying on the console.
- Public error text does not expose unnecessary internal detail.
- Retry is bounded and does not duplicate the gameplay host.
- Old-generation progress and completions are rejected.
- Partial resources are retired or explicitly transferred.
- Menu fallback remains usable after exhaustion.
- A successful retry reaches one matching gameplay frame.

## Status

Proposed fixture gate. No browser, artifact or Pages failure fixture ran during this documentation audit.