# Next Steps: PrehistoricRush

**Updated:** `2026-07-10T23-08-11-04-00`

## Immediate safe ledge

```txt
PrehistoricRush Core-Kit Consumption Authority
+ Kit-Graph / Thin-Adapter Fixture Gate
```

## Goal

Make the new one-domain architecture truthful, deterministic and observable. Every declared Nexus Engine core kit must be either consumed through an explicit adapter, intentionally replaced with a named owner, or removed from the graph. A fixture must prove the exact kit graph and runtime service wiring before further gameplay or visual expansion.

## Plan ledger

### Phase 0: freeze the composition contract

- [ ] Add a versioned `prehistoric-rush-composition-manifest`.
- [ ] Record the parent game domain, nested kits, core kits, external modules and host adapters.
- [ ] Record requested and resolved source revisions for NexusEngine and the Rapier ProtoKit.
- [ ] Pin immutable revisions instead of mutable `@main` URLs.
- [ ] Compute a stable composition fingerprint.

### Phase 1: classify every core kit

- [ ] Produce one row per core kit with `declared`, `installed`, `apiAvailable`, `consumed`, `replaced`, `unused`, `consumerId` and `reason`.
- [ ] Prove `core-scene` transition consumption.
- [ ] Route browser input through a named input adapter or remove the unused core-input declaration.
- [ ] Route Rapier through a named core-physics provider adapter or remove the unused core-physics declaration.
- [ ] Decide whether motion, camera, animation, graphics, skybox, UI, diagnostics and spatial are real dependencies or declared placeholders.
- [ ] Reject graph startup when a required consumed service is unavailable.

### Phase 2: thin the browser host

- [ ] Split `createAdapter()` into explicit terrain, population, renderer, camera, animation and physics adapters.
- [ ] Give each adapter a narrow input/output contract.
- [ ] Return typed prepare/update/render/dispose results.
- [ ] Keep game-domain mutation inside the game domain.
- [ ] Keep external platform state behind adapter snapshots.
- [ ] Remove direct live object exposure from the public host.

### Phase 3: normalize commands and transitions

- [ ] Add typed `StartRun`, `SetRunInput`, `FailRun`, `CollectShard` and `CompleteRun` command results.
- [ ] Correlate scene-transition requests and results with `runId` and command IDs.
- [ ] Preserve one ordered command/event/transition journal.
- [ ] Ensure configured menu/game/run-over/win scenes match observable run status.
- [ ] Decide whether boot should remain in menu or intentionally auto-start.

### Phase 4: restore population capacity authority

- [ ] Store immutable allocation capacity separately from active draw count.
- [ ] Never use `InstancedMesh.count` as the next generation ceiling.
- [ ] Build detached tree, grass and shard population plans.
- [ ] Produce requested/admitted/rejected/truncated rows.
- [ ] Validate render/collider/pickup parity before commit.
- [ ] Commit matrices, counts, colliders, pickups and physics rows atomically.
- [ ] Preserve the prior generation if validation fails.

### Phase 5: observation and lifecycle

- [ ] Add a JSON-safe `getCompositionState()`.
- [ ] Add source, kit, adapter, command, transition, physics, population and frame revisions.
- [ ] Retain the RAF ID and listener ownership.
- [ ] Add idempotent stop/dispose/remount behavior.
- [ ] Tie game, physics, population, render and HUD observations to one committed frame ID.

### Phase 6: fixture gates

- [ ] Add a DOM-free kit-graph installation fixture using the pinned NexusEngine revision.
- [ ] Prove all required APIs install and the game domain starts/ticks/fails/retries deterministically.
- [ ] Prove declared and consumed kit rows reconcile exactly.
- [ ] Add a browser adapter-consumption smoke.
- [ ] Add immutable-capacity and repeated-window population fixtures.
- [ ] Add a deployed Pages source-revision smoke.

## Candidate kits

```txt
prehistoric-rush-composition-manifest-kit
core-kit-consumption-ledger-kit
core-service-adapter-registry-kit
runtime-source-admission-kit
composition-fingerprint-kit
browser-input-core-adapter-kit
rapier-core-physics-adapter-kit
three-core-graphics-adapter-kit
camera-core-adapter-kit
animation-core-adapter-kit
run-command-result-kit
run-transition-journal-kit
population-capacity-owner-kit
population-plan-commit-kit
prehistoric-rush-host-snapshot-kit
kit-graph-fixture-kit
browser-adapter-smoke-kit
```

Update the current parent domain and existing adapters first. Add a new kit only where no current owner can absorb the responsibility without becoming broader or less coherent.

## Required fixture gate

```bash
node scripts/prehistoric-rush-kit-graph-fixture.mjs
node scripts/prehistoric-rush-core-consumption-fixture.mjs
node scripts/prehistoric-rush-source-admission-fixture.mjs
node scripts/prehistoric-rush-adapter-contract-fixture.mjs
node scripts/prehistoric-rush-population-capacity-fixture.mjs
```

After the DOM-free fixtures pass, run a browser smoke that proves input, physics, scene transitions, camera, animation, graphics, UI and diagnostics are either consumed through named adapters or explicitly classified as replaced.

## Follow-on order

```txt
committed-frame observation authority
restart/result/persistence transaction
full lifecycle/disposal authority
camera-relative lighting and shadow ownership
visual and content expansion
```

## Do not do next

Do not add more core-kit declarations, visuals, vegetation, pickups, colliders or inline host logic. Do not treat graph installation as proof of service use. Do not retain mutable `@main` imports as the production source contract.