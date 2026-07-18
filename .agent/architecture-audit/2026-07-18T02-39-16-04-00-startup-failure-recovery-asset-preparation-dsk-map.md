# Startup Failure Recovery / Asset Preparation DSK Map

**Timestamp:** `2026-07-18T02-39-16-04-00`  
**Status:** `proposed-authority-not-implemented`

## Current ownership map

```txt
game-page-entry-kit
  -> required module URL manifest
  -> Promise.allSettled preflight
  -> text failure projection
  -> import of src/game.js

core-assets-kit
  -> provider, asset and bundle registration
  -> required bundle request and progress
  -> receipt/value ownership

core-startup-kit
  -> launch generation
  -> required preparation state
  -> progress, ready and failed reports

 tree-fidelity-runtime-composition-kit
  -> isolated engine and vegetation composition
  -> temporary provider replacement
  -> package and bundle registration

 tree-fidelity-route-preparation-kit
  -> required tree bundle preparation
  -> successful provider unregister
  -> startup receipt publication

 tree-fidelity-runtime-image-hydration-kit
  -> atlas source discovery
  -> fetch/Image/createImageBitmap decode
  -> Canvas2D alpha readback
  -> runtime image and crop binding
  -> thrown decode/readback failures
```

## Current gap

The existing domains expose enough primitives to observe progress and mark a required preparation failed, but no product authority owns the complete transition from partial startup generation to an operable recovery result. Module preflight and tree preparation also project failure differently, and only the successful tree path explicitly unregisters the temporary provider.

## Proposed authority

`prehistoric-rush-required-startup-asset-failure-recovery-authority-domain`

```txt
StartupGenerationAdmissionCommand
  -> StartupGenerationResult

RequiredStartupPreparationCommand
  -> RequiredStartupPreparationResult

StartupFailureSettlementCommand
  -> StartupFailureResult

StartupRecoveryCommand
  -> StartupRecoveryResult

StartupProjectionCommitCommand
  -> StartupFrameDigest
  -> FirstRecoveredGameFrameAck
```

## Proposed DSK surfaces

```txt
startup-generation-manifest-kit
required-module-preflight-result-kit
required-asset-preparation-result-kit
tree-fidelity-bundle-admission-kit
runtime-image-hydration-result-kit
startup-failure-classification-kit
startup-failure-redaction-kit
startup-retry-policy-kit
startup-retry-budget-kit
startup-recovery-command-kit
startup-recovery-settlement-kit
startup-provider-retirement-kit
startup-runtime-retirement-kit
startup-navigation-fallback-kit
startup-status-projection-kit
startup-accessible-error-surface-kit
startup-source-failure-fixture-kit
startup-browser-retry-fixture-kit
startup-artifact-pages-failure-fixture-kit
first-recovered-game-frame-ack-kit
```

## Smallest implementation boundary

Keep Core Assets and Core Startup unchanged unless a missing generic settlement primitive is proven. Add product-level orchestration around `src/pages/game.js` and `prepareTreeAssetsBeforeGame()` that classifies failure, owns cleanup, exposes retry or menu return, and rejects stale recovery completions by startup generation.