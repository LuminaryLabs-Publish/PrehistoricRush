# Startup Failure Command / Result Map

**Timestamp:** `2026-07-18T02-39-16-04-00`

## Current map

```txt
page import
  -> Promise.allSettled(required modules)
  -> success: import ../game.js
  -> failure: body text + console.error + throw

prepareTreeAssetsBeforeGame()
  -> launch startup
  -> track required bundle
  -> add runtime-image preparation
  -> hydrate images
  -> success: ready + unregister provider + publish runtime
  -> failure: report failed + throw
```

## Missing interaction settlement

The user receives no semantic action surface after the required tree path fails. There is no command identity for Retry, Return to Menu, Copy Diagnostic or Stop; no attempt budget; no stale-action rejection; and no result that confirms cleanup or navigation.

## Proposed command/result flow

```txt
StartupFailureResult
  -> RetryStartupCommand
      -> StartupRecoveryResult(retrying | rejected | failed | ready)
  -> ReturnToMenuCommand
      -> StartupNavigationResult
  -> CopyStartupDiagnosticCommand
      -> DiagnosticCopyResult

StartupRecoveryResult(ready)
  -> StartupProjectionCommitCommand
  -> FirstRecoveredGameFrameAck
```

## Admission rules

- Retry only the currently failed generation.
- Ignore duplicate retry commands after settlement.
- Bound attempts and backoff.
- Disable controls while one retry is active.
- Reject completion from older generations.
- Retire temporary providers, images and partial runtimes before replacement.
- Keep the public message concise; retain detailed evidence in diagnostics.

## Boundary

These interactions are proposed. No runtime input or UI behavior changed.