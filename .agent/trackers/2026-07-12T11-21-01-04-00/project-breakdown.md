# Project Breakdown: PrehistoricRush Streamed Content / Outcome Parity

**Timestamp:** `2026-07-12T11-21-01-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Runtime source reviewed through:** `6430c623d4e1fa5afb7ed460d5d1624799fbe65d`  
**Documentation head observed:** `057785f0d492e5f57d234017b532e88fd55a309c`

## Summary

PrehistoricRush now resolves movement, Rapier/fallback collision, pickup admission, goal evaluation, state changes, events and terminal transitions through Nexus Engine `core-simulation`.

The next authority gap is streamed-content parity. The engine tick samples the previous host-frame pickup and collider set. After the tick commits, the browser can release or activate patches, rebuild visible content, replace physics colliders and render a different set. No content revision, patch digest, collider digest, pickup digest or visible-frame acknowledgement proves that simulation and rendering used the same world snapshot.

This run also repairs incomplete audit publication. Root `.agent` files had advanced to the streamed-content audit but referenced timestamped tracker and audit files that were not present. The complete audit family is now added and central tracking is synchronized.

## Plan ledger

**Goal:** make each committed continue, pickup, failure or win result cite the exact active patch, collider, pickup and visible-content revision used for simulation and the first visible frame.

- [x] Enumerate all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Compare the nine eligible repositories against `LuminaryLabs-Dev/LuminaryLabs` ledger entries.
- [x] Confirm all nine eligible repositories have central ledger entries and root `.agent` state.
- [x] Select only `LuminaryLabs-Publish/PrehistoricRush` because it had the oldest eligible central timestamp and newer repo-local streamed-content documentation.
- [x] Detect that the repo-local root docs referenced a missing timestamped audit family.
- [x] Trace boot, run start, input, engine tick, proposal/observation resolution, streaming, materialization, collider replacement, rendering, HUD and public readback.
- [x] Identify the complete interaction loop.
- [x] Identify all active domains and missing authority boundaries.
- [x] Inventory all 41 implemented, adapted and proof kit surfaces and their services.
- [x] Add architecture, render, gameplay, interaction, streaming-authority and deploy audits.
- [x] Refresh all required root `.agent` documents and machine registry.
- [x] Push only to `main` and create no branch or pull request.
- [x] Synchronize the central repository ledger and internal change log.
- [ ] Runtime authority implementation and executable stream/outcome parity fixtures remain future work.

## Repository comparison

```txt
accessible Publish repositories: 10
eligible non-Cavalry repositories: 9
new eligible repositories: 0
central-ledger-missing eligible repositories: 0
root-.agent-missing eligible repositories: 0
repo-local audit family incomplete: PrehistoricRush
selected repository: LuminaryLabs-Publish/PrehistoricRush
excluded repository: LuminaryLabs-Publish/TheCavalryOfRome
```

Only `LuminaryLabs-Publish/PrehistoricRush` was modified in the Publish organization.

## Interaction loop

```txt
menu/profile
  -> load persisted creature profile
  -> route to creator or game

creator
  -> edit normalized creature draft
  -> persist profile revision
  -> build procedural Three.js preview
  -> animate preview through RAF
  -> route to gameplay

runtime boot
  -> import commit-pinned Nexus Engine, Kits, ProtoKits, Three and Rapier modules
  -> compose 13 core kits, 5 official kits and product/page/Worker kits
  -> install Rapier provider, player body, patch controller, camera follow and Three adapter
  -> direct game.start()
  -> generate/activate center patch
  -> build visible content and colliders
  -> reset camera

browser frame
  -> patch held browser input into product input state
  -> engine.tick(dt)
     -> derive movement and next run state
     -> sample pickups from adapter.view.pickups
     -> submit kinematic motion request
     -> step Rapier against the currently installed collider set
     -> sample fallback collision from adapter.view.colliders
     -> resolve collision, pickups and goal through the product policy
     -> commit state, events and optional transition
  -> read committed run state
  -> rebuild visible content when pickups were accepted
  -> update patch-controller focus
  -> release patches and rebuild content/colliders
  -> pump Worker or fallback generation
  -> activate ready patch and rebuild content/colliders
  -> render the resulting Three.js scene
  -> update HUD and public host readback
  -> request next RAF

retry
  -> direct game.start()
  -> rebuild dynamic content
  -> update/prime streaming
  -> reset camera
  -> wait for the next engine tick
```

## Main finding

```txt
simulation observation set: previous host-frame content
post-tick rendered set: newly released/activated content
shared active-content revision: absent
active patch-set digest: absent
collider-set digest: absent
pickup-set digest: absent
stream/materialization generation on outcome: absent
visible-frame acknowledgement: absent
```

### False positive path

```txt
tick observes collider C
  -> collision commits failure
  -> post-tick streaming releases C's patch
  -> collider set is replaced
  -> visible frame no longer contains C
```

### False negative path

```txt
tick resolves without ready patch P
  -> post-tick streaming activates P
  -> tree collider or pickup becomes visible
  -> that collider or pickup was not admitted to the committed tick
```

## Domains in use

```txt
page routing and profile lifecycle
character-creator draft, preview, persistence and transition
runtime source identity, import preflight and pinned module graph
core input, spatial, scene, physics, simulation, motion, camera, animation, graphics, skybox, UI, diagnostics and composition
deterministic seed, procedural creature, instanced batching, patch control and camera follow
product run, input, movement, surface, proposal, observation, resolution, event and transition
Worker/fallback patch generation, request correlation, queue, cache, release and activation
terrain slots, tree cells, grass instances, shards, pickups and colliders
Rapier provider, body, motion request, step, contacts and fallback collision
Three.js scene, creature pose, camera, lighting, rendering and HUD
public host tick, simulation, physics, stream, camera and composition readback
Node policy proof, static build and Pages deployment
repo-local and central documentation tracking
streamed-content/outcome parity authority: missing
```

## Implemented kits and offered services

### Nexus Engine core kits: 13

```txt
core-input-kit
  actions, bindings, input state
core-spatial-kit
  transforms, spatial queries
core-scene-kit
  scene registry, transitions, host descriptor
core-physics-kit
  provider, bodies, colliders, motion requests, step, frame
core-simulation-kit
  TickContext, proposals, observations, resolution policy, state/event/transition commit, committed frame
core-motion-kit
  motion capability
core-camera-kit
  camera capability
core-animation-kit
  animation capability
core-graphics-kit
  graphics and frame capability
core-skybox-kit
  sky descriptor
core-ui-kit
  UI capability and projection
core-diagnostics-kit
  diagnostics and readback
core-composition-kit
  composition metadata and capability graph
```

### Official NexusEngine-Kits: 5

```txt
seed-kit
  deterministic seed and random streams
procedural-creature-body-kit
  descriptor, geometry, skeleton, skinning, collision, pose and snapshot
instanced-render-batch-kit
  cell replacement/release, flush, overflow, bounds and statistics
seeded-world-patch-controller-kit
  focus, membership, queue, cache, generation, delivery, eviction and snapshot
camera-smooth-follow-kit
  damping, reset, teleport handling and snapshot
```

### Product, page and Worker kits: 13

```txt
prehistoric-rush-domain-kit
  run resources, input, movement proposals, observations, events, transitions and snapshots
prehistoric-rush-resolution-policy
  collision/pickup/goal precedence, state patch, events and transition
player-character-schema-kit
  defaults, normalization, clamps and merge
player-character-profile-store-kit
  load, save, patch, reset, revision and storage synchronization
menu-page-kit
  menu shell, profile projection and routes
character-creator-page-kit
  controls, draft, persistence, preview and RAF
character-preview-transition-kit
  morph, crossfade, pose damping, revision and disposal
three-procedural-creature-adapter-kit
  skinned mesh, materials, pose and disposal
game-page-entry-kit
  module preflight, first failure projection and game import
drunk-route-generator
  samples, nearest point, progress, classification and snapshot
player-raptor-preset-kit
  creature recipe and collision capsule
prehistoric-patch-generator
  terrain, trees, grass, shards, colliders, bounds and transferables
prehistoric-patch-worker
  initialization, generation, request/error protocol and transfer
```

### External and host adapters: 9

```txt
three-runtime-module
  scene, geometry, materials, instancing, camera, lighting and rendering
rapier-physics-domain-kit
  Nexus provider bridge
rapier-runtime-module
  bodies, colliders, queries and world step
message-worker-executor-adapter-kit
  request correlation and asynchronous generation
active-content-consumer-adapter
  terrain, trees, grass, shards, pickups, colliders and height sampling
creator-viewport-framing-adapter
  bounds, target and camera distance
creator-persistence-scheduler
  timer replacement and profile commit
browser-input-adapter
  keyboard, buttons, keyup, blur and product input patching
creature-camera-render-host-adapters
  pose, collision sample, pickup scan, camera, HUD and public readback
```

### Proof kit: 1

```txt
prehistoric-rush-resolution-policy-test-kit
  continue, win, collision precedence, pickup idempotency, fallback and serialization proof
```

## Required parent domain

```txt
prehistoric-rush-streamed-content-outcome-parity-authority-domain
```

It coordinates active-content identity, deterministic patch/collider/pickup digests, stream-delta admission, immutable observation context, mixed-revision rejection, atomic content/physics commit, rollback, stale Worker rejection, outcome provenance, public readback and first-visible-frame acknowledgement.

## Candidate kit family

```txt
active-content-revision-kit
active-patch-set-digest-kit
collider-set-digest-kit
pickup-set-digest-kit
stream-generation-kit
active-content-snapshot-kit
stream-delta-command-kit
stream-delta-admission-kit
content-prepare-plan-kit
content-participant-result-kit
content-observation-context-kit
physics-content-observation-kit
fallback-content-observation-kit
pickup-content-observation-kit
mixed-content-revision-rejection-kit
outcome-content-provenance-kit
content-physics-commit-kit
content-physics-rollback-kit
stale-worker-content-rejection-kit
content-parity-observation-kit
content-parity-journal-kit
visible-content-frame-ack-kit
released-collider-false-positive-fixture-kit
activated-content-false-negative-fixture-kit
browser-stream-outcome-parity-smoke-kit
```

## Required invariant

```txt
One simulation step admits exactly one immutable active-content revision.
Physics, fallback collision and pickup sampling cite that revision.
Release or activation cannot silently change the content set between observation and visible proof.
Outcome state, events and transition cite patch, collider and pickup digests.
Failed content or collider preparation preserves the predecessor revision.
Stale Worker or patch results cannot attach to a newer revision.
The first visible frame cites the same simulation and active-content revisions.
Public readback cannot combine a committed outcome with unrelated content state.
```

## Documentation output

```txt
.agent/START_HERE.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/kit-registry.json
.agent/trackers/2026-07-12T11-21-01-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-12T11-21-01-04-00.md
.agent/architecture-audit/2026-07-12T11-21-01-04-00-streamed-content-outcome-parity-dsk-map.md
.agent/render-audit/2026-07-12T11-21-01-04-00-post-tick-stream-visible-content-gap.md
.agent/gameplay-audit/2026-07-12T11-21-01-04-00-stale-collider-pickup-resolution-loop.md
.agent/interaction-audit/2026-07-12T11-21-01-04-00-stream-revision-outcome-result-map.md
.agent/streaming-authority-audit/2026-07-12T11-21-01-04-00-content-revision-observation-commit-contract.md
.agent/deploy-audit/2026-07-12T11-21-01-04-00-stream-outcome-parity-fixture-gate.md
```

## Validation boundary

```txt
runtime source changed: no
gameplay behavior changed: no
physics behavior changed: no
streaming behavior changed: no
render behavior changed: no
package/dependencies changed: no
deployment changed: no
branch created: no
pull request created: no
npm test: not run
browser smoke: not run
Pages smoke: not run
stream/outcome parity fixtures: unavailable
```

No runtime stream/outcome parity, collider/pickup correctness, rollback, visible-frame correlation or deployment-readiness claim is made.