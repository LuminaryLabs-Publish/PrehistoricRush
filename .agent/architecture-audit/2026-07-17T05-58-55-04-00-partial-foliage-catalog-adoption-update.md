# Partial Foliage Catalog Adoption Update

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Reviewed runtime head:** `9eea125435e51ab0c492a071e5a9f70301f52cd6`

## Corrected architecture state

```txt
foliage recipes
  -> imported by prehistoric-vegetation-domain.js
  -> registered through Core Vegetation Foliage and Object Bridge
  -> ten tree foliage descriptors
  -> six ground-cover species, foliage descriptors and object descriptors
  -> generator options publish catalogs and atlas revision

patch generator
  -> accepts treeTypes and vegetation placement API
  -> selects tree species only
  -> does not consume published ground-cover catalogs
  -> emits legacy trunks/crowns and grass, not card/ground-cover payloads

render host
  -> no accepted foliage atlas material generation
  -> no card instance batch projection
  -> no card/ground-cover matching-frame result

atmosphere helper
  -> remains outside production composition
  -> no apply-once or retirement authority
```

## Authority boundary

Core Vegetation now owns the semantic catalog registration. The missing parent authority begins after registration: patch/Worker adoption, GPU projection, atmosphere lifecycle and frame settlement.

## Required results

```txt
FoliageCatalogRegistrationResult
FoliagePatchProjectionResult
MainWorkerFoliageParityResult
FoliageAtlasMaterialResult
JungleAtmosphereProjectionResult
JunglePresentationRetirementResult
JunglePresentationProjectionResult
FirstJunglePatchAck
FirstJunglePresentationFrameAck
```

## Boundary

This update supersedes the earlier statement that no production module imported the foliage recipes. Semantic registration is present; runtime patch and visible-frame adoption remain absent.
