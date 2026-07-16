# START HERE: PrehistoricRush

**Last aligned:** `2026-07-16T06-39-16-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed pre-audit repository head:** `5a4d179c09ee9fad4e11a44f42671606a4a6254d`  
**Reviewed runtime source revision:** `4808f05cff438ff5a9d013cd7ddec5127bbcf213`  
**Status:** `webgl-context-gpu-resource-recovery-authority-audited`

## Summary

PrehistoricRush was selected by the oldest synchronized eligible-repository rule. The current audit isolates WebGL context and GPU-resource recovery: the game creates a substantial Three.js resource graph and recursively renders it, but owns no context-loss/restoration transaction, replacement renderer generation, reconstruction graph, retry/fallback policy or first recovered frame proof.

## Plan ledger

**Goal:** recover one coherent streamed-world frame after WebGL context loss without moving simulation or gameplay truth into browser event handlers.

- [x] Compare all 11 accessible Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Select only PrehistoricRush by the oldest synchronized timestamp.
- [x] Trace renderer, terrain LOD, textures, instances, player, lights, shadows and RAF.
- [x] Preserve all 66 implemented kits, adapters and proof surfaces.
- [x] Define one recovery parent authority with 21 coordinating surfaces.
- [x] Add the `2026-07-16T06-39-16-04-00` audit family.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Implement and execute forced-loss, restoration, rehydration, fallback, artifact and Pages fixtures.

## Main finding

```txt
WebGLRenderer creation: present
renderer canvas mounted into the game host: present
recursive RAF render submission: present
terrain and LOD geometry buffers: present
normal and roughness textures: present
instanced tree, grass and pickup resources: present
player creature mesh and material resources: present
shadow-map resources: present
ordinary terrain LOD disposal: present

webglcontextlost listener: absent
webglcontextrestored listener: absent
render-context generation identity: absent
loss admission result: absent
explicit presentation suspension: absent
simulation/input policy during loss: absent
complete GPU-resource registry: absent
dependency-ordered reconstruction: absent
base-adapter disposal: absent
host adapter disposal call: absent
stale recovery work rejection: absent
recovery deadline/retry budget: absent
fallback result: absent
RenderLossResult: absent
RenderRecoveryResult: absent
FirstRecoveredFrameAck: absent
forced context-loss fixture: absent
```

## Current audit family

```txt
.agent/trackers/2026-07-16T06-39-16-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-16T06-39-16-04-00.md
.agent/architecture-audit/2026-07-16T06-39-16-04-00-webgl-context-gpu-resource-recovery-dsk-map.md
.agent/render-audit/2026-07-16T06-39-16-04-00-lost-context-visible-world-frame-gap.md
.agent/gameplay-audit/2026-07-16T06-39-16-04-00-render-loss-active-run-loop.md
.agent/interaction-audit/2026-07-16T06-39-16-04-00-render-recovery-command-result-map.md
.agent/renderer-recovery-audit/2026-07-16T06-39-16-04-00-gpu-resource-rehydration-contract.md
.agent/deploy-audit/2026-07-16T06-39-16-04-00-context-loss-browser-fixture-gate.md
.agent/central-sync-audit/2026-07-16T06-39-16-04-00-oldest-selection-renderer-recovery-reconciliation.md
```

## Required authority

`prehistoric-rush-webgl-context-gpu-resource-recovery-authority-domain`

## Kit census

```txt
Nexus Engine root/subdomain kits: 22
official NexusEngine-Kits: 5
product/page/Worker kits: 17
external/host/render adapters: 14
proof kits: 8
total implemented surfaces: 66
planned WebGL recovery surfaces: 21
```

## Next safe ledge

Add context event admission and immutable render generations, register every GPU resource family, reconstruct from accepted CPU descriptors in dependency order, reject stale recovery work, apply bounded retry/fallback policy and acknowledge the first coherent recovered frame.

## Claim boundary

Documentation only. No context recovery, resource rehydration, fallback, artifact parity, Pages parity or production readiness is claimed.
