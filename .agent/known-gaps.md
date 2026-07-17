# PrehistoricRush Known Gaps

**Audit:** `2026-07-16T20-01-41-04-00`  
**Status:** `runtime-module-generation-identity-authority-audited`

## Summary

The shared runtime URL table and the two visual route import maps declare three different Nexus Engine commits. Official NexusEngine-Kits import the bare `nexusengine` specifier, so their factories can bind to the route import-map generation while the host engine binds to the shared dynamic-import generation.

## Goal

Keep mixed-generation composition explicitly unsupported until one manifest, one admission result, and matching creator/game frame acknowledgements exist.

## Plan ledger

- [x] Identify the three current Nexus Engine declarations.
- [x] Confirm official seed and creature kits import `nexusengine` directly.
- [x] Confirm the product composes those kit factories into a separately imported Nexus Engine host.
- [ ] Unify declarations and prove one generation at runtime.

## Identity gaps

```txt
canonical runtime manifest: absent
manifest digest: absent
route import-map generation: absent
normalized module identity: absent
kit-linked runtime identity: absent
descriptor factory provenance: absent
object descriptor provenance: absent
physics provider provenance: absent
Worker runtime provenance: absent
```

## Admission gaps

```txt
shared URL/import-map equality check: absent
mixed generation rejection: absent
duplicate module namespace rejection: absent
stale cache generation rejection: absent
route navigation generation retirement: absent
RuntimeModuleAdmissionResult: absent
```

## Projection and proof gaps

```txt
creator startup receipt runtime digest: absent
game startup receipt runtime digest: absent
FirstSingleRuntimeCreatorFrameAck: absent
FirstSingleRuntimeGameFrameAck: absent
creator/game parity receipt: absent
browser module graph fixture: absent
built-output module graph fixture: absent
Pages module graph fixture: absent
```

## Current risk boundary

The source proves that different URLs are declared and that official kit modules use the bare specifier. It does not prove that the current browser build visibly fails. Plain descriptor compatibility and module-cache behavior can mask the mismatch until a factory, symbol, validation rule, or descriptor contract changes between commits.

## Retained gaps

Tree elevation continuity, tree form transitions, WebGL recovery, Worker liveness, game audio, accessibility, fixed-step pacing, terrain ownership and LOD, creator settlement, feedback, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart, and browser lifecycle remain separate retained families.

## Claim boundary

Do not claim a current production defect, single-generation composition, cache coherence, cross-route parity, browser correctness, artifact parity, Pages parity, or production readiness until executable fixtures pass.