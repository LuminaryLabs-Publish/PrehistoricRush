# PrehistoricRush Known Gaps

**Audit:** `2026-07-17T02-02-06-04-00`  
**Status:** `semantic-vegetation-fidelity-generation-authority-audited`

## Summary

Object Vegetation now owns species, deterministic variation, ecology, tree structures, foliage descriptors, and Core Object bridges. The asset runtime, game host, and patch Worker still reconstruct that semantic state independently, while portable fidelity packages are built from a duplicated local profile and carry no semantic vegetation descriptor hashes.

## Intent

Keep semantic vegetation/fidelity generation coherence explicitly unsupported until one admitted generation binds asset preparation, caches, Worker patches, package selection, and rendered frames.

## Checklist

- [x] Confirm domain-backed species selection and variation.
- [x] Confirm three independently created vegetation runtimes.
- [x] Confirm semantic profiles are derived but not used by the package provider.
- [x] Confirm Worker readiness omits catalog identity.
- [x] Confirm the frame receipt records catalog and package digests separately.
- [ ] Implement and prove one composite generation.

## Generation gaps

```txt
canonical semantic generation manifest: absent
composite VegetationGeneration digest: absent
archetype source revision binding: absent
species descriptor hash set: partial host-only digest
tree structure hash binding: absent
foliage descriptor hash binding: absent
vegetation object hash binding: absent
semantic fidelity profile registration proof: absent
```

## Package and cache gaps

```txt
semantic descriptor hashes in package generation: absent
speciesId-to-package generation binding: absent
typeIndex mismatch rejection: absent
composite generation in bundle identity: absent
composite generation in IndexedDB cache identity: absent
stale semantic cache retirement: absent
```

## Worker and patch gaps

```txt
expected generation in Worker init: absent
Worker catalog digest response: absent
Worker generation mismatch rejection: absent
patch request generation binding: absent
patch result generation receipt: absent
main-thread/Worker generation parity result: absent
```

## Projection and proof gaps

```txt
VegetationGenerationAdmissionResult: absent
FirstDomainBoundMenuAssetAck: absent
FirstDomainBoundGameAssetAck: absent
FirstDomainBoundPatchAck: absent
FirstDomainBoundTreeFrameAck: absent
source/browser/build/Pages generation parity: absent
```

## Current risk boundary

The source proves that semantic catalogs, package generations, and Worker state are not joined by one contract. It does not prove a current visible failure. All contexts currently derive from the same checked-in archetype source, which can mask the gap until a semantic descriptor, package, cache, or Worker revision changes independently.

## Retained gaps

Runtime-module identity, tree elevation continuity, tree form transitions, WebGL recovery, Worker liveness, game audio, accessibility, fixed-step pacing, terrain ownership and LOD, creator settlement, feedback, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart, and browser lifecycle remain separate retained audit families.

## Claim boundary

Do not claim semantic profile adoption, composite generation authority, Worker equality, cache invalidation correctness, species-package convergence, artifact parity, Pages parity, or production readiness until executable fixtures pass.
