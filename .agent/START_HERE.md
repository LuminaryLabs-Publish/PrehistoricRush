# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T12-01-04-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

PrehistoricRush now composes the full Core Motion and Core Physics domains. Gameplay records Core Motion intent and frames, sends kinematic requests to Core Physics, registers an articulated raptor rig and exposes articulated solving.

The visible game and creator raptors still use the legacy procedural pose path. Neither renderer consumes the articulated-motion result, and physics requests do not cite the Core Motion frame that authorized them. The current audit defines the missing motion/articulation/presentation parity boundary.

## Plan ledger

**Goal:** make simulation movement, physical motion, articulated solving and the first visible raptor frame cite one authoritative motion/presentation revision.

- [x] Compare the complete Publish inventory with central tracking.
- [x] Exclude `TheCavalryOfRome`.
- [x] Select only `PrehistoricRush` because new motion/physics architecture landed after its previous audit.
- [x] Review the final Core Motion runtime pin and compatibility fix.
- [x] Trace game and creator pose paths, Core Motion, Core Physics and articulated subdomains.
- [x] Identify all interaction loops, domains, 45 implemented/adapted/proof surfaces and services.
- [x] Add a fresh tracker and complete architecture/system audit family.
- [x] Refresh required root `.agent` state and the machine registry.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime consumption and executable parity fixtures remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T12-01-04-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T12-01-04-04-00-motion-presentation-parity-dsk-map.md
.agent/render-audit/2026-07-12T12-01-04-04-00-legacy-pose-articulated-frame-gap.md
.agent/gameplay-audit/2026-07-12T12-01-04-04-00-run-motion-physics-pose-loop.md
.agent/interaction-audit/2026-07-12T12-01-04-04-00-motion-intent-pose-frame-result-map.md
.agent/motion-system-audit/2026-07-12T12-01-04-04-00-core-motion-articulation-consumption-contract.md
.agent/deploy-audit/2026-07-12T12-01-04-04-00-motion-presentation-fixture-gate.md
.agent/turn-ledger/2026-07-12T12-01-04-04-00.md
.agent/kit-registry.json
```

## Current interaction loop

```txt
creator
  -> install seed and procedural-creature kits
  -> create legacy procedural pose
  -> damp/morph Three mesh
  -> render preview

game boot
  -> compose Core Physics + articulated dynamics
  -> compose Core Motion + articulated motion
  -> register player rig
  -> install Rapier and stream world

game tick
  -> integrate run state
  -> submit Core Motion intent
  -> commit Core Motion frame
  -> submit raw motion request to Core Physics
  -> resolve simulation outcome

game render
  -> derive legacy pose from run state again
  -> apply legacy pose to Three skeleton
  -> render without articulated-frame consumption receipt
```

## Main finding

```txt
Core Motion frame: present
Core Physics request: present
articulated rig: present
articulated solver API: present
articulated dynamics domain: present

physics request -> Core Motion frame reference: absent
articulated solve in game frame: absent
articulated solve in creator frame: absent
selected pose result: absent
renderer bone-application result: absent
visible pose-frame acknowledgement: absent
```

`solvePlayerArticulatedPose()` is implemented but unused by the game and creator render paths. The visible raptor is still driven by `createPlayerPose()` or `creatureApi.createPose()`.

## Domains and kit groups

```txt
routes, profile and creator
runtime source identity, import maps and module admission
15 Nexus Engine root/subdomain kits
5 official NexusEngine-Kits
14 product/page/Worker kits
9 external/host adapters
2 proof kits
Core Motion and articulated motion
Core Physics and articulated dynamics
product run/simulation/outcome
Rapier, streaming, Three rendering and HUD
motion/articulation/presentation parity authority: missing
```

## Required parent domain

```txt
prehistoric-rush-motion-presentation-parity-authority-domain
```

It coordinates motion source revision, intent sequence, Core Motion frame provenance, physics linkage, articulated solve admission, explicit legacy fallback, creator/game motion profiles, renderer bone-application receipts, stale-result rejection and first-visible-frame acknowledgement.

## Ordered implementation queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Browser Input Command Admission and Edge/Hold Authority
0b. Render Surface Resolution and Frame Correlation
1. Route Artifact and Game Profile Handoff Proof
2. Character Creator Draft, Commit and Preview Frame Authority
2a. Motion / Articulation / Presentation Parity Authority
3. Patch Activation and Release Commit Authority
3a. Active Content Materialization and Coalescing Authority
3b. Streamed Content / Outcome Observation Parity Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration and Committed Frames
6. Stream Cadence and World Readiness
7. Public Host Capability Gateway
8. Coordinated Run/Stream/Motion/Physics/Frame Reset
9. Runtime Lifecycle and Ordered Disposal
```

Do not treat domain installation or snapshot visibility as proof that the visible raptor consumes articulated motion. Completion requires typed consumption results and real browser/Pages evidence.