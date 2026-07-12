# Architecture Audit: Streamed Content / Outcome Parity DSK Map

**Timestamp:** `2026-07-12T11-11-34-04-00`

## Parent domain

```txt
prehistoric-rush-streamed-content-outcome-parity-authority-domain
```

## Plan ledger

**Goal:** replace implicit host-frame ordering with one explicit content snapshot admitted by simulation, physics and rendering.

- [x] Map current owners.
- [x] Identify the missing revision and transaction contracts.
- [x] Define the parent domain and candidate kits.
- [ ] Implement the domain and retire browser-host outcome evidence ownership.

## Current ownership split

```txt
Nexus Engine core-simulation
  owns proposal/observation collection, product policy invocation and committed simulation frame

seeded-world-patch-controller
  owns desired membership, queue, cache, generation, release and ready delivery

browser Three adapter
  owns activePatches, terrain slots, tree cells, grass instances, shard instances, pickups and collider descriptors

core-physics plus Rapier provider
  owns the currently synchronized body/collider set and physics frame

browser frame loop
  orders engine tick, accepted-pickup removal, stream release/activation, collider replacement, render, HUD and readback
```

No owner creates an immutable content snapshot spanning those systems.

## Missing DSK/domain boundaries

```txt
active content identity and monotonic revision
active patch-set fingerprint
collider-set and pickup-set fingerprints
stream/controller generation identity
content preparation plan
typed participant preparation result
one admitted observation context
mixed-revision rejection
atomic content and physics commit
rollback and predecessor preservation
stale Worker/result rejection
outcome provenance projection
bounded parity observations and journal
first visible content-frame acknowledgement
browser and deployed fixture gates
```

## Candidate composition

```txt
prehistoric-rush-streamed-content-outcome-parity-authority-domain
  -> active-content-revision-kit
  -> active-patch-set-digest-kit
  -> collider-set-digest-kit
  -> pickup-set-digest-kit
  -> stream-generation-kit
  -> active-content-snapshot-kit
  -> stream-delta-command-kit
  -> stream-delta-admission-kit
  -> content-prepare-plan-kit
  -> content-participant-result-kit
  -> content-observation-context-kit
  -> physics-content-observation-kit
  -> fallback-content-observation-kit
  -> pickup-content-observation-kit
  -> mixed-content-revision-rejection-kit
  -> outcome-content-provenance-kit
  -> content-physics-commit-kit
  -> content-physics-rollback-kit
  -> stale-worker-content-rejection-kit
  -> content-parity-observation-kit
  -> content-parity-journal-kit
  -> visible-content-frame-ack-kit
  -> released-collider-false-positive-fixture-kit
  -> activated-content-false-negative-fixture-kit
  -> browser-stream-outcome-parity-smoke-kit
```

## Required transaction

```txt
observe player focus and predecessor content revision
  -> calculate release, activation and accepted-pickup deltas
  -> reject stale patch/Worker results
  -> prepare terrain, tree, grass, shard, pickup and collider candidate state
  -> calculate patch/collider/pickup digests
  -> collect typed participant results
  -> atomically commit one ActiveContentSnapshot or preserve predecessor
  -> submit movement, pickup and goal proposals citing that snapshot
  -> step physics and fallback collision against the same snapshot
  -> reject any mixed-revision observation
  -> resolve product outcome with content provenance
  -> render committed content
  -> publish visible frame receipt with simulation and content revisions
```

## Boundary rule

The browser host may adapt committed descriptors into Three.js and browser input/output surfaces. It must not independently choose the authoritative content set used for collision, pickup admission or outcome resolution.
