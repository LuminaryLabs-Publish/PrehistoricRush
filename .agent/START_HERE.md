# START HERE: PrehistoricRush

**Last aligned:** `2026-07-12T14-10-22-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`

## Summary

PrehistoricRush composes Core Motion, Core Physics, articulated motion and articulated dynamics, while its creator and game renderers share a Three.js procedural-creature adapter.

A new runtime commit added quaternion pose application and damping to that adapter. The adapter now accepts Euler rotations, quaternion arrays and quaternion objects, but it has no pose schema, coordinate-space declaration, rig binding, full-versus-partial semantics, finite-value admission or typed application result. The game still submits legacy procedural poses, so the new articulated-compatible format support is capability without production consumption proof.

## Plan ledger

**Goal:** make every pose applied to a Three.js creature an admitted, revisioned transform contract bound to the intended rig, bone set, coordinate convention and visible frame.

- [x] Compare the full Publish repository inventory with the central ledger.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories remain tracked and root-documented.
- [x] Select only `PrehistoricRush` because a new renderer-format runtime commit landed after its central audit.
- [x] Trace game, creator, procedural-pose, articulated-pose and Three.js bone-application paths.
- [x] Identify the interaction loop, all active domains, all 45 implemented/adapted/proof surfaces and their services.
- [x] Define the missing pose-contract and rig-binding authority.
- [x] Add a new timestamped tracker, turn ledger and system-audit family.
- [x] Refresh required root `.agent` state and the machine registry.
- [x] Synchronize the central ledger and internal change log.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime pose admission, renderer receipts and executable browser proof remain future work.

## Read this first

```txt
.agent/trackers/2026-07-12T14-10-22-04-00/project-breakdown.md
.agent/current-audit.md
.agent/next-steps.md
.agent/known-gaps.md
.agent/validation.md
.agent/architecture-audit/2026-07-12T14-10-22-04-00-pose-contract-rig-binding-dsk-map.md
.agent/render-audit/2026-07-12T14-10-22-04-00-quaternion-pose-visible-bone-gap.md
.agent/gameplay-audit/2026-07-12T14-10-22-04-00-legacy-articulated-pose-format-loop.md
.agent/interaction-audit/2026-07-12T14-10-22-04-00-pose-submit-admit-apply-result-map.md
.agent/pose-system-audit/2026-07-12T14-10-22-04-00-schema-space-rig-application-contract.md
.agent/deploy-audit/2026-07-12T14-10-22-04-00-pose-contract-browser-fixture-gate.md
.agent/turn-ledger/2026-07-12T14-10-22-04-00.md
.agent/kit-registry.json
```

## Current interaction loop

```txt
creator
  -> install seed and procedural-creature kits
  -> create legacy procedural pose
  -> adapter accepts position arrays and Euler rotation
  -> damp transforms into Three.js bones
  -> render preview

game boot
  -> compose Core Motion and Core Physics parent/subdomains
  -> register articulated player rig
  -> install Rapier, streaming, camera and renderer

game tick
  -> integrate run state
  -> submit Core Motion intent and frame
  -> submit kinematic request to Core Physics
  -> resolve simulation outcome

game render
  -> call game.createPlayerPose()
  -> pass legacy pose to applyCreaturePose()
  -> adapter can now also decode quaternion arrays or objects
  -> silently skip unknown bones and preserve omitted bone state
  -> return no application result
  -> render without pose-schema, rig or visible-frame acknowledgement

optional API
  -> solvePlayerArticulatedPose() can emit quaternion transforms
  -> no production game or creator renderer calls it
```

## Main finding

```txt
quaternion transform support: present
Euler fallback support: present
array/object position support: present
articulated solve API: present

pose schema/version: absent
coordinate space and quaternion convention: absent
full-pose versus partial-pose mode: absent
finite and unit-quaternion admission result: absent
pose-to-rig fingerprint binding: absent
bone membership/completeness policy: absent
rest-pose reconstruction policy: absent
typed applied/missing/rejected bone result: absent
first visible pose-frame acknowledgement: absent
production articulated-pose call site: absent
```

Unknown bone IDs are ignored. Omitted bones retain their prior transform. Quaternion objects default missing components to identity-like values before normalization. None of those decisions is represented as a typed result.

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
procedural and articulated pose construction
pose schema, coordinate-space and rig binding
Three.js bone application, damping and visible-frame projection
Rapier, streaming, terrain, vegetation, pickups and HUD
pose-contract/rig-binding authority: missing
```

## Required parent domain

```txt
prehistoric-rush-pose-contract-rig-binding-authority-domain
```

It coordinates pose identity, schema version, absolute/partial mode, coordinate convention, rig and bone-set fingerprints, quaternion admission, missing/unknown bone policy, rest-pose reconstruction, application plans, typed application results, stale-result rejection and first-visible-frame acknowledgement.

## Ordered implementation queue

```txt
0. Runtime Module Graph Admission and Source Provenance
0a. Browser Input Command Admission and Edge/Hold Authority
0b. Render Surface Resolution and Frame Correlation
1. Route Artifact and Game Profile Handoff Proof
2. Character Creator Draft, Commit and Preview Frame Authority
2a. Motion / Articulation / Presentation Parity Authority
2b. Pose Contract and Rig Binding Authority
3. Patch Activation and Release Commit Authority
3a. Active Content Materialization and Coalescing Authority
3b. Streamed Content / Outcome Observation Parity Authority
4. Exact Collider Replacement and Collision Admission
5. Run-Step Outcome Arbitration and Committed Frames
6. Stream Cadence and World Readiness
7. Public Host Capability Gateway
8. Coordinated Run/Stream/Motion/Physics/Pose/Frame Reset
9. Runtime Lifecycle and Ordered Disposal
```

Do not treat quaternion-compatible adapter code as proof that articulated motion drives visible bones. Completion requires admitted pose contracts, explicit application results and browser/Pages evidence.