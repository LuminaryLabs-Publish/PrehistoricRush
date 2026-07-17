# Pinned Provider Source, Browser and Pages Fixture Gate

**Timestamp:** `2026-07-17T14-40-21-04-00`

## Release concern

The repaired provider is consumed through a pinned jsDelivr URL in both the browser main realm and a module Worker. Node syntax and local product-module tests do not execute that deployed module graph.

## Required gates

### Source

- Import the exact pinned Nexus Engine URL or an exact checked-out equivalent.
- Construct Core Object Vegetation.
- Assert `vegetationFoliage.createPlacementRecipe` is callable.
- Register the full product catalog and verify counts/digest.

### Browser main realm

- Load through the production import URL.
- Publish observed provider revision and module identity.
- Construct the product Vegetation runtime.
- Generate and activate one synchronous patch.
- Observe the first provider-bound vegetation frame.

### Browser Worker realm

- Initialize the production module Worker.
- Echo provider revision, catalog digest and binding digest.
- Generate one patch and verify transfer settlement.
- Reject stale Worker generations.

### Artifact and Pages

- Repeat the main/Worker fixture against built artifact origin.
- Repeat against GitHub Pages origin.
- Verify CDN cache resolves the intended commit.
- Record provider URL, observed revision, catalog digest, patch digest and frame acknowledgement.

## Gate result

```txt
ProviderFixtureGateResult
  sourceProbe
  browserMainProbe
  browserWorkerProbe
  artifactProbe
  pagesProbe
  providerRevision
  catalogDigest
  patchDigest
  firstFrameAck
  accepted
```

## Current state

```txt
source exact-provider fixture: absent
browser main fixture: absent
browser Worker fixture: absent
artifact fixture: absent
Pages fixture: absent
```

No release readiness is claimed by this audit.