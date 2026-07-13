# Architecture Audit: Player Pose Frame Provenance DSK Map

**Timestamp:** `2026-07-13T06-39-10-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`

## Summary

The new `PlayerPose` resource correctly moves pose target ownership into the game domain. The missing architectural boundary is a revisioned pose-frame contract connecting the articulated solve, stored resource, render-time damping and visible frame.

## Plan ledger

**Goal:** keep simulation target-pose authority separate from presentation smoothing while giving both an explicit, inspectable evidence chain.

- [x] Identify the current source and consumer ownership.
- [x] Preserve Core Motion and articulated-motion responsibilities.
- [x] Keep Three.js damping presentation-only.
- [x] Define missing parent domain and candidate kits.
- [ ] Implement only after runtime API design is accepted.

## Current ownership

```txt
procedural-creature-body-kit
  -> produces legacy procedural pose

player-articulation-adapter-kit
  -> converts legacy bones into articulated rig pose

articulated-motion-domain-kit
  -> solves articulated frame under tickId/frame

prehistoric-rush-domain-kit
  -> stores only articulatedFrame.pose in PlayerPose

three-procedural-creature-adapter-kit
  -> damps Three.js bones toward PlayerPose using render dt
```

## Required parent domain

```txt
prehistoric-rush-player-pose-frame-provenance-authority-domain
```

This domain does not replace articulated motion or rendering. It governs identity, publication, derivation, discontinuities and proof between them.

## Candidate DSK family

| Kit | Responsibility |
|---|---|
| `player-pose-session-id-kit` | runtime and player-pose session identity |
| `player-pose-run-generation-kit` | run/restart generation fencing |
| `player-rig-revision-kit` | immutable rig identity and revision |
| `player-pose-solve-command-kit` | admitted solve command with run/tick/frame/input/state bindings |
| `player-pose-source-state-kit` | immutable speed/time/turn/jump/resistance source values |
| `legacy-pose-result-kit` | typed procedural source-pose result |
| `articulated-pose-adaptation-result-kit` | typed rig-space conversion result |
| `articulated-pose-solve-result-kit` | typed solve result retaining frame metadata |
| `player-pose-frame-kit` | immutable resource envelope containing ID, revision and pose |
| `player-pose-frame-commit-kit` | atomic predecessor/successor replacement result |
| `stale-player-pose-rejection-kit` | stale run, tick, frame or rig rejection |
| `duplicate-player-pose-result-kit` | idempotent duplicate classification |
| `player-pose-public-readback-kit` | bounded clone-safe target-pose observation |
| `presentation-pose-generation-kit` | renderer-side generation and lifecycle identity |
| `presentation-pose-policy-kit` | snap, damp, interpolate and discontinuity policy |
| `presentation-pose-frame-kit` | visible-target derivation with source PlayerPoseFrame ID |
| `presentation-pose-reset-result-kit` | exact restart/reset retirement and replacement result |
| `visible-player-pose-frame-ack-kit` | first submitted frame citing source and presentation IDs |
| `player-pose-observation-journal-kit` | bounded solve/commit/presentation/error evidence |
| `player-pose-fixture-kit` | source/runtime/build/Pages contract fixtures |

## Required transaction

```txt
PlayerPoseSolveCommand
  -> validate session, run generation, tickId, frame and rig revision
  -> capture immutable source-state values
  -> create LegacyPoseResult
  -> create ArticulatedPoseAdaptationResult
  -> execute articulated solve
  -> preserve solve frame identity in ArticulatedPoseSolveResult
  -> atomically publish PlayerPoseFrame
  -> renderer admits PlayerPoseFrame under presentation generation
  -> apply explicit snap/damp policy
  -> publish PresentationPoseFrame
  -> submit Three.js frame
  -> publish VisiblePlayerPoseFrameAck
```

## Domain boundaries

```txt
Core Simulation owns tick admission and committed run state.
Core Motion owns movement intents and motion frames.
Articulated Motion owns rig solve semantics.
PrehistoricRush owns which solved pose is authoritative for the player.
Three.js owns presentation resources and optional smoothing.
Pose Frame Provenance owns identity and evidence across those boundaries.
```

## Non-goals

```txt
no renderer implementation in the simulation domain
no Three.js bone objects in PlayerPoseFrame
no physical ragdoll activation
no foot IK activation in this documentation pass
no replacement of the legacy-pose compatibility API yet
```

## Completion gate

Do not mark pose-frame provenance complete until every stored pose frame identifies its run/tick/frame/rig revision, presentation smoothing cites one source frame, restart retires predecessor presentation state, and the first matching visible skeleton frame is observable.