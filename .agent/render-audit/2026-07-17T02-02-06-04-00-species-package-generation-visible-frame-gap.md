# Species / Package Generation Visible-Frame Gap

**Timestamp:** `2026-07-17T02-02-06-04-00`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Render path

```txt
patch species selection
  -> species metadata typeIndex
  -> trunk/crown render bucket
  -> tree fidelity package at the same typeIndex
  -> near/medium/far/horizon form selection
  -> exact package-generation frame acknowledgement
```

## Confirmed strength

The renderer already validates that the presented tree-fidelity generation digest matches the startup package generation and requires an exact impostor frame acknowledgement.

## Gap

The render binding is package-centric, not semantic-species-centric.

```txt
speciesId-to-package generation table: absent
species contentHash in package generation: absent
tree structure hash in package generation: absent
foliage hash in package generation: absent
vegetation object hash in package generation: absent
semantic fidelity profile registration proof: absent
typeIndex/species/package mismatch rejection: absent
FirstDomainBoundTreeFrameAck: absent
```

The startup receipt includes `vegetationCatalogDigest` and `treeFidelityGenerationDigest`, but the renderer checks only the fidelity digest. A frame can therefore be exact for the loaded package set without proving that the packages were derived from the semantic catalog used to generate the visible instances.

## Required projection contract

```txt
VegetationTreeProjectionCommand
  -> require accepted VegetationGeneration
  -> resolve speciesId to one package generation
  -> validate typeIndex as derived metadata, not primary identity
  -> reject stale or unmapped instances
  -> render forms and transitions
  -> publish TreeProjectionResult
  -> publish FirstDomainBoundTreeFrameAck
```

## Claim boundary

No visible species/package mismatch was reproduced. Current archetype sources are shared, so the missing binding can remain invisible until one semantic or package revision changes independently.
