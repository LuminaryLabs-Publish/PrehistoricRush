# Card Family Reference Closure Contract

**Timestamp:** `2026-07-17T16-40-37-04-00`

## Summary

Tree foliage descriptors are now closed over every card family used by their generated clusters. The repair prevents a descriptor from declaring only its primary family while a cluster references an undeclared secondary family.

## Canonical family set

```txt
broadleaf-spray
palm-frond
fern-frond
needle-spray
ginkgo-fan
hanging-vine
bush-cluster
horsetail-whorl
```

## Implemented contract

For each tree archetype:

```txt
primaryFamily = foliageFamilyIdForArchetype(archetype)
placements = createTreeFoliageCardPlacements(archetype, "near")
requiredFamilies = unique(primaryFamily + placements[*].familyId)
cardFamilies = resolve every required family through the canonical catalog
clusters = project each placement with its familyId
```

Registration fails when any required family cannot be resolved. The source fixture verifies every cluster reference is present in `descriptor.cardFamilies`; broad-canopy specifically verifies `broadleaf-spray` and `hanging-vine`.

## Current strengths

```txt
family IDs are canonical: yes
family atlas cells are unique: yes
family lookup is centralized: yes
deterministic placement generation: yes
secondary-family closure: yes
unknown-family rejection: yes
atlas revision advanced for descriptor change: yes
all tree archetypes covered by source assertion: yes
```

## Remaining gaps

```txt
canonical sorted family-reference manifest: absent
stable descriptor closure digest: absent
near and medium closure compared independently: absent
Worker digest echo: absent
patch revision binding: absent
descriptor-driven renderer fixture: absent
atlas cell content hash: absent
runtime replacement/migration policy between atlas revisions: absent
```

Near placements currently establish the descriptor family set. The present generators use the same family classes for near and medium forms, but that invariant is implicit. Future recipe changes could introduce a medium-only family unless closure is computed from all supported forms or validated across every form.

## Proposed invariant

```txt
for each archetype and supported form:
  referenced family IDs must be a subset of descriptor.cardFamilies

for each descriptor family:
  family must exist in the accepted atlas manifest

for each patch and rendered frame:
  atlas revision and family digest must match the accepted runtime generation
```

## Boundary

This document records the implemented source repair and proposes stronger proof. It does not change the catalog, placements, renderer or gameplay.