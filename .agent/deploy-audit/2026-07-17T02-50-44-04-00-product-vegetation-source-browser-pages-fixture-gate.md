# Product Vegetation Source, Browser, and Pages Fixture Gate

**Timestamp:** `2026-07-17T02-50-44-04-00`

## Current gate

`npm test` now performs syntax checks, imports the local product vegetation modules, and runs deterministic patch fixtures. It does not build or launch a browser surface.

## Required release gate

```txt
source gate
  -> npm test
  -> actual product runtime construction fixture
  -> semantic catalog registration fixture
  -> main-thread/Worker deterministic parity

browser gate
  -> load the exact import map and pinned CDN modules
  -> enter menu and game asset preparation
  -> stream one semantic tree patch
  -> bind one exact tree fidelity frame
  -> publish FirstProductVegetationFrameAck

artifact gate
  -> serve the built/static output
  -> repeat module, Worker, patch, collision, and frame checks

Pages gate
  -> load from the deployed repository subpath
  -> verify module, Worker, cache, and asset URLs
  -> repeat the accepted frame acknowledgement
```

## Fail-closed conditions

- Product runtime constructor throws.
- Catalog registration is incomplete.
- Worker cannot import or initializes a different revision.
- Main-thread and Worker patches diverge.
- Instance or collider contracts differ.
- Package/frame binding is absent.
- Source, artifact, and Pages revisions differ.

## Boundary

No source test, browser fixture, artifact smoke, or Pages smoke was executed by this documentation pass.