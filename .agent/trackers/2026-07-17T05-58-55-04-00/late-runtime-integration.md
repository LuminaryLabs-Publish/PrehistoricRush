# Late Runtime Integration Addendum

**Timestamp:** `2026-07-17T05-58-55-04-00`  
**Supersedes the runtime-adoption statements in:** `project-breakdown.md`  
**Reviewed runtime head:** `9eea125435e51ab0c492a071e5a9f70301f52cd6`  
**Previous documentation head:** `e7c5d238d7ba406ecf02b8d91416161f03201147`

## Summary

A third runtime commit landed after the initial two-file review and before this run completed. The complete runtime delta is now three commits across three files with `+608/-23`.

The late commit imports the foliage-card recipe module into `prehistoric-vegetation-domain.js`, registers card-backed foliage descriptors for all ten tree species, registers six ground-cover species/foliage/object bridges, and publishes ground-cover catalogs plus atlas revision through the product vegetation runtime and generator options.

This changes the finding from **unadopted source** to **partial semantic catalog adoption**. The patch generator still consumes only tree selection and returns legacy `trees`, `grass`, `pickups`, and `colliders`; it does not consume the published ground-cover arrays or emit card/ground-cover instance payloads. The atmosphere helper remains unconsumed. No atlas asset/material generation, GPU card batch, scene-lifecycle result, or matching frame acknowledgement is present.

## Corrected selection comparison

```txt
accessible Publish repositories: 11
eligible after Cavalry exclusion: 10
central ledger entries: 10
root .agent states: 10
new or ledger-missing: 0
root-agent-missing: 0
undocumented repositories: 0
selected: LuminaryLabs-Publish/PrehistoricRush
selection reason: runtime commits ahead of documented head
previous documentation head: e7c5d238d7ba406ecf02b8d91416161f03201147
reviewed runtime head: 9eea125435e51ab0c492a071e5a9f70301f52cd6
runtime delta: 3 commits / 3 files / +608 / -23
excluded: LuminaryLabs-Publish/TheCavalryOfRome
```

## Corrected interaction loop

```txt
foliage source catalogs
  -> imported by prehistoric-vegetation-domain.js
  -> ten tree species receive card-family, cluster, atlas, wind and fidelity descriptors
  -> six ground-cover species receive foliage and object-bridge descriptors
  -> createPrehistoricVegetationRuntime exposes tree and ground-cover selectors
  -> createPrehistoricVegetationGeneratorOptions publishes ground-cover catalogs and atlas revision

production patch generation
  -> accepts treeTypes and vegetation placement API
  -> selects only tree species
  -> emits trunk/crown matrices, legacy grass, pickups and colliders
  -> does not consume groundCoverSpecies or groundCoverArchetypes
  -> does not emit foliage-card or ground-cover instance payloads

rendering
  -> existing patch/tree-fidelity path remains the visible projection
  -> no atlas texture/material binding is proved
  -> lush-jungle-atmosphere.js remains outside the changed consumer graph
  -> no accepted jungle presentation frame exists
```

## Corrected source-backed finding

```txt
semantic tree foliage registration: present
semantic ground-cover registration: present
generator-option publication: present
actual patch consumption of ground cover: absent
actual patch emission of foliage cards: absent
actual patch emission of ground cover: absent
atlas asset/material binding: absent
GPU card-batch projection: absent
atmosphere consumer/lifecycle: absent
actual runtime-construction fixture: absent
matching visible-frame acknowledgement: absent
```

## Inventory correction

The complete kit/service inventory in `project-breakdown.md` remains valid at 93 active named surfaces. The late commit expands the services of existing surfaces rather than adding another named kit:

```txt
prehistoric-vegetation-catalog-registration-kit
  + card-backed tree foliage registration
  + six ground-cover species/foliage/object registrations
  + atlas revision publication

prehistoric-vegetation-runtime-composition-kit
  + ground-cover species selector
  + card and ground-cover catalog snapshots

prehistoric-vegetation-generator-options-kit
  + groundCoverSpecies
  + groundCoverArchetypes
  + foliageAtlasRevision
```

## Required authority

`prehistoric-rush-jungle-foliage-atmosphere-runtime-adoption-authority-domain`

The remaining authority must carry the now-registered semantic catalogs through patch/Worker generation, atlas/material and GPU projection, atmosphere lifecycle, resource retirement, and the exact presented frame.

## Claim boundary

Semantic registration is source-backed. Patch adoption, Worker parity, visible card/ground-cover rendering, atmosphere adoption, GPU lifecycle correctness, browser parity, artifact parity, Pages parity, and production readiness remain unproven.
