# Next Steps: PrehistoricRush

**Updated:** `2026-07-10T21-00-16-04-00`

## Immediate safe ledge

```txt
PrehistoricRush Instance Pool Capacity Authority
+ Deterministic Population Fixture Gate
```

This remains first. Do not place another abstraction in front of the current `populate()` path until writes and active draw counts are bounded.

## Goal

Make the runtime's population and deployed source contract deterministic, bounded, observable, and honest. A successful deployment must identify which files and revisions actually control the live route.

## Plan ledger

### Phase 0: complete the current population gate

- [ ] Add immutable capacity to every instance-pool wrapper.
- [ ] Separate active draw count from allocation capacity.
- [ ] Preflight matrix writes.
- [ ] Produce requested, admitted, truncated, rejected, and overflow rows.
- [ ] Add `windowKey` and `generationId`.
- [ ] Correlate tree render rows with collider rows.
- [ ] Correlate shard render rows with pickup rows.
- [ ] Add dense, sparse, and repeated-generation fixtures.

### Phase 1: establish one runtime source contract

- [ ] Decide whether existing root JSON files are runtime inputs or archival planning files.
- [ ] Create one versioned `runtime-source-manifest.json`.
- [ ] Record the exact entrypoint, active local kits, external modules, and configuration sources.
- [ ] Add a schema/version field and deterministic fingerprint.
- [ ] Reject duplicate authority for the same tuning or transition field.
- [ ] If `runner-tuning.json` remains authoritative, load and validate it before constructing the route.
- [ ] If tuning remains in JavaScript, stop deploying the JSON as an active configuration artifact.
- [ ] If `game-scenes.json` remains authoritative, route scene changes through its transition table.
- [ ] Otherwise label the scene files archival and remove them from the live artifact.
- [ ] Reconcile `kit-composition.json` with the six active local domain kits.
- [ ] Replace mutable `@main` dependency coordinates in the source manifest with immutable revisions.
- [ ] Expose requested and resolved source rows through `PrehistoricRushHost.getState()`.

### Phase 2: add source-contract validation

- [ ] Add `scripts/prehistoric-rush-source-contract-fixture.mjs`.
- [ ] Assert every deployed authoritative file is consumed.
- [ ] Assert every consumed runtime file is declared.
- [ ] Assert declared tuning equals resolved runtime tuning.
- [ ] Assert declared scene transitions equal runtime transitions.
- [ ] Assert declared active kit IDs equal imported active kit IDs.
- [ ] Assert source fingerprint is stable for identical inputs.
- [ ] Fail Pages staging when an authoritative-looking file is copied but unconsumed.
- [ ] Add a browser smoke that reads the host source fingerprint.

## Existing owners to update first

```txt
src/game.js
runner-tuning.json
game-scenes.json
kit-composition.json
kit-cutover-inventory.json
.github/workflows/deploy-pages.yml
PrehistoricRushHost.getState()
```

## New capability only where justified

```txt
src/domains/source/runtime-source-manifest-kit.js
src/domains/source/source-contract-validator-kit.js
src/domains/source/source-fingerprint-kit.js
src/domains/source/source-observation-kit.js
scripts/prehistoric-rush-source-contract-fixture.mjs
```

## Follow-on work

```txt
restart/result/persistence transaction
route-progress and goal authority
best-distance writeback
immutable external dependency admission
mount/dispose/remount lifecycle
camera-relative lighting and shadow frustum
```

## Stop conditions

Do not add more visual content, new pickup families, new configuration files, another scene framework, or another kit inventory until the population and source-contract fixtures identify one runtime authority.
