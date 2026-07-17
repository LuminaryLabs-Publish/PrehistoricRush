# PrehistoricRush Known Gaps

**Audit:** `2026-07-17T05-58-55-04-00`  
**Status:** `jungle-foliage-atmosphere-runtime-adoption-authority-audited`

## Summary

Card-backed tree foliage and six ground-cover species are now registered through the product Core Vegetation composition. Generator options publish those catalogs and the atlas revision. The production patch generator still does not consume or emit foliage-card or ground-cover instances, and the atmosphere helper remains unadopted.

## Intent

Keep visible jungle-presentation conformance unsupported until semantic registration reaches deterministic patch/Worker payloads, atlas materials, GPU batches, atmosphere lifecycle, and the exact presented frame.

## Checklist

- [x] Confirm the three-commit delta and late semantic integration.
- [x] Confirm ten tree and six ground-cover registrations.
- [x] Confirm generator-option publication.
- [x] Preserve the complete 93-surface census.
- [ ] Implement and prove patch, Worker, render, atmosphere, and frame adoption.

## Completed source adoption

```txt
foliage recipe import: present
card-backed tree foliage descriptors: present
six ground-cover species/foliage/object bridges: present
atlas metadata and UV rectangles: present
ground-cover selector: present
generator-option publication: present
```

## Patch and Worker gaps

```txt
patch generator consumes groundCoverSpecies: no
patch generator consumes groundCoverArchetypes: no
patch output includes foliage-card instances: no
patch output includes ground-cover instances: no
tree-instance identity bound into card placement: no
near/medium/far/culled budget result: absent
production Worker foliage payload parity: absent
FirstJunglePatchAck: absent
```

## Render and lifecycle gaps

```txt
atlas asset decode/material generation: absent
card instance-batch ownership: absent
patch-owned card/ground-cover release: absent
atmosphere production consumer: absent
atmosphere apply-once generation: absent
duplicate fill/bounce prevention: absent
predecessor scene-state snapshot: absent
quality-aware shadow budget: absent
scene replacement/disposal result: absent
JunglePresentationProjectionResult: absent
FirstJunglePresentationFrameAck: absent
```

## Test and deployment gaps

```txt
actual runtime-construction fixture: absent
expanded 16-species registration assertion: absent
new module syntax checks: absent
main-thread/Worker projection fixture: absent
browser source-frame fixture: absent
built-output frame fixture: absent
Pages-subpath frame fixture: absent
```

## Source observations

- Local tree-card recipes use archetype, quality, and index; global patch publication still needs patch/tree-instance identity.
- Only the exact `medium` token reduces card counts; an outer policy must explicitly handle far and culled tiers.
- `PREHISTORIC_GROUND_COVER_BY_ID` remains an exported mutable `Map`.
- The atmosphere helper adds fill and ambient lights on every call and provides no restore/dispose command.
- Existing scene and renderer state is overwritten without a predecessor receipt.

## Current risk boundary

No current crash or visible regression was reproduced. Semantic catalogs can exist successfully while the shipped patch and frame remain visually unchanged or later adopt the capabilities without bounded lifecycle ownership.

## Claim boundary

Do not claim visible foliage cards, ground cover, atmosphere adoption, Worker parity, GPU lifecycle correctness, artifact parity, Pages parity, or production readiness until executable fixtures pass.
