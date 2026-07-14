# PrehistoricRush Known Gaps

**Audit:** `2026-07-14T14-01-07-04-00`  
**Status:** `runtime-provider-revision-convergence-authority-central-reconciled`

## Summary

The browser route can admit two NexusEngine revisions through direct imports and transitive bare imports. Provider identity, compatibility, rollback, diagnostics, and first-frame convergence are not settled as one result.

## Plan ledger

**Goal:** keep every provider-manifest, module-graph, composition, presentation, and proof gap explicit.

### Provider identity

- [ ] No single canonical `RouteProviderManifest`.
- [ ] Direct NexusEngine revision is `682c9fa...` while the import map binds `nexusengine` to `cf2fe3d...`.
- [ ] Import-map entries are not derived from `runtime-versions.js`.
- [ ] No stable module identity or provider dependency receipt.
- [ ] No explicit imported-versus-injected runtime-helper record.

### Compatibility and composition

- [ ] No split-provider rejection policy.
- [ ] Factory shape checks do not prove revision compatibility.
- [ ] No typed `RouteProviderAdmissionResult`.
- [ ] No atomic engine, kit, physics, Worker, renderer, and listener adoption.
- [ ] No complete candidate rollback receipt.
- [ ] No stale or superseded startup-attempt rejection.

### Diagnostics

- [ ] `PrehistoricRushHost.versions` reports configured direct commits only.
- [ ] No public resolved module-graph manifest.
- [ ] No transitive `nexusengine` URL readback.
- [ ] No accepted provider-attempt identity.
- [ ] No rejected provider graph retained for diagnosis.

### Presentation

- [ ] Render submissions do not cite a provider graph.
- [ ] No first provider-converged game frame acknowledgement.
- [ ] No first provider-converged creator frame acknowledgement.
- [ ] A visually correct frame can mask mixed provider revisions.

### Tests and deployment

- [ ] Existing `npm test` was not run in this audit.
- [ ] Existing tests do not execute the browser import map or CDN module graph.
- [ ] No same-revision browser admission fixture.
- [ ] No split-revision fault-injection fixture.
- [ ] No built-output provider parity fixture.
- [ ] No GitHub Pages provider parity fixture.

## Retained gaps

Run outcome settlement, player-profile admission, patch adoption, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run-start/restart, and browser-runtime retirement remain separate.
