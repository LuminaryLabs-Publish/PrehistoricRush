# Required Asset Preparation Failure / Retry Contract

**Timestamp:** `2026-07-18T02-39-16-04-00`

## Scope

Required module preflight, tree-fidelity bundle preparation, runtime-image hydration, temporary provider ownership, retry settlement and transition into one active gameplay runtime.

## Failure stages

```txt
module-import
runtime-composition
tree-bundle-request
tree-package-generation
atlas-fetch
atlas-decode
atlas-dimensions
canvas-context
alpha-readback
runtime-image-binding
runtime-import
```

## Required result schema

```txt
StartupFailureResult
  generationId
  stage
  code
  retryable
  publicMessage
  diagnosticMessage
  attempt
  partialOwnership
  cleanupRequired
  occurredAt
```

## Retry contract

- A retry creates a new startup generation.
- Only one generation may own progress projection.
- The failed generation must stop publishing progress.
- Temporary asset providers must be unregistered or explicitly transferred.
- Decoded `ImageBitmap` resources should be closed when retired where supported.
- A partially constructed engine/runtime must not become globally discoverable.
- The gameplay runtime may import only after every required preparation settles ready.
- Retry attempts must be bounded and observable.
- Exhaustion must expose a stable menu-return path.

## Success contract

```txt
required preparations ready
  -> temporary provider retirement settled
  -> runtime publication settled
  -> LOD runtime import settled
  -> gameplay host admitted once
  -> FirstRecoveredGameFrameAck when applicable
```

## Evidence gap

Existing source tests do not execute forced startup failures, retry, stale generation rejection, provider cleanup, runtime cleanup, or recovered-frame acknowledgement.