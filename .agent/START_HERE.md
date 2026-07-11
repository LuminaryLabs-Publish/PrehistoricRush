# START HERE: PrehistoricRush

## Last aligned

```txt
2026-07-11T15-59-12-04-00
```

## Summary

`PrehistoricRush` is a multi-page Nexus Engine browser runner with profile persistence, a procedural raptor, deterministic route generation, streamed terrain patches, Rapier collision, Three.js rendering, HUD projection and Pages deployment.

The current audit establishes the missing **run, stream, collider and frame epoch reset authority**. `game.start()` replaces only the run and input resources. The patch controller, Worker, active patch map, pickup projection, Rapier world, fixed colliders, browser input booleans, RAF and public host remain process-lifetime objects.

A retry can therefore begin with state retained from the previous run. Most visibly, collected pickup projection is rebuilt only when patch membership changes. Retrying at the same location with the same active set can keep previously collected shards absent even though the new run has an empty collected-shard ledger.

## Plan ledger

**Goal:** make Start, Retry and Run Again one atomic authority transfer that either commits a fresh run across gameplay, streaming, colliders, pickups, camera and frame observation or leaves the prior terminal run unchanged.

- [x] Compare all ten accessible `LuminaryLabs-Publish` repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central ledger and root `.agent` state.
- [x] Avoid `IntoTheMeadow` because same-window documentation commits were still landing.
- [x] Select only `PrehistoricRush` as the oldest stable eligible repository.
- [x] Trace `game.start()`, host `start()`, patch-controller reuse, Worker reuse, active-content projection, physics reuse, camera reset and RAF continuation.
- [x] Identify the complete interaction loop, domains, kits and services.
- [x] Define run/reset, stream, collider, Worker and frame epoch contracts.
- [x] Add timestamped architecture and system audits.
- [x] Change documentation only.
- [x] Push directly to `main` with no branch or pull request.
- [ ] Implement the reset transaction and executable fixtures.

## Read this first

```txt
.agent/trackers/2026-07-11T15-59-12-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-11T15-59-12-04-00-run-stream-epoch-reset-dsk-map.md
.agent/render-audit/2026-07-11T15-59-12-04-00-retry-visible-state-membership-gap.md
.agent/gameplay-audit/2026-07-11T15-59-12-04-00-retry-pickup-stream-state-loop.md
.agent/interaction-audit/2026-07-11T15-59-12-04-00-start-retry-epoch-admission-map.md
.agent/run-session-audit/2026-07-11T15-59-12-04-00-run-stream-collider-frame-epoch-contract.md
.agent/deploy-audit/2026-07-11T15-59-12-04-00-retry-reset-epoch-fixture-gate.md
.agent/turn-ledger/2026-07-11T15-59-12-04-00.md
.agent/kit-registry.json
```

## Interaction loop

```txt
terminal or menu state
  -> Start / Retry / Run Again
  -> game.start()
     -> replace RunState
     -> increment numeric runId
     -> replace InputState
     -> emit RunStarted
     -> request scene transition
  -> updateStreaming(newState, true)
     -> reuse existing controller, queue, cache and Worker
     -> consume any released/ready rows
     -> rebuild consumers only if membership changed
  -> reset camera against numeric runId
  -> existing RAF continues
  -> existing physics, colliders, patch maps, pickups and host remain
```

## Main finding

```txt
fresh gameplay state: yes
fresh streaming session: no
fresh Worker generation: no
fresh active patch membership: no
fresh pickup projection: conditional
fresh Rapier world/actor/colliders: no
fresh external keyboard state: no
fresh RAF generation: no
fresh host lease/read model: no
```

The camera alone has a local run-change check. It does not create a shared epoch for streaming, physics, collision, pickups, Worker results or frame receipts.

## Domains in use

```txt
page routing and profile persistence
pinned module/dependency identity
Nexus Engine composition and scene routing
run lifecycle, input, route, movement, score and outcomes
procedural creature generation, skinning and poses
deterministic route and terrain classification
patch generation, Worker execution, cache, queue and membership
terrain, tree, grass, pickup, collider and height consumers
Rapier actor, fixed colliders, step and contacts
collision, pickup and terminal admission
camera smoothing and run-change reset
Three rendering, HUD projection and public host
runtime/run/stream/collider/frame epoch authority: missing
atomic reset and stale-work rejection: missing
validation and Pages deployment
```

## Implemented kits

```txt
12 Nexus Engine core kits
5 official NexusEngine-Kits
10 product/page/worker kits
8 external or host adapter boundaries
```

See `.agent/current-audit.md` and `.agent/kit-registry.json` for every kit and service.

## Required parent domain

```txt
prehistoric-rush-run-stream-epoch-authority-domain
```

It must coordinate:

```txt
runtimeSessionId
runSessionId and runEpoch
streamEpoch
colliderEpoch
workerGeneration
frameEpoch
reset command/result
input reset
patch membership policy
pickup reprojection
physics replacement/reset
camera acknowledgement
stale callback/contact/frame rejection
first committed frame acknowledgement
```

## Next safe ledge

```txt
PrehistoricRush Run / Stream / Collider / Frame Epoch Authority
+ Atomic Retry Reset and First-Frame Parity Fixture Gate
```

This remains downstream of route/profile P0 and should reuse the patch, collision and committed-frame result contracts rather than create parallel owners.
