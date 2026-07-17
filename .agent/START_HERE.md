# START HERE: PrehistoricRush Jungle Runtime and Render-Host Retirement

**Last aligned:** `2026-07-17T05-58-55-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Reviewed runtime head:** `4b2e1842dc6f8e47fe537260e4282518e09537e2`  
**Previous documentation head:** `e7c5d238d7ba406ecf02b8d91416161f03201147`  
**Status:** `jungle-runtime-integrated-render-host-retirement-authority-audited`

## Summary

PrehistoricRush was selected through runtime-ahead priority. During this run the jungle work progressed from source catalogs to full runtime composition: semantic tree and ground-cover registration, Worker-backed ecological patch output, foliage-card tree packages, procedural atlas generation, lush foliage and ground-cover render layers, atmosphere composition, diagnostics, and a generation-bound startup frame acknowledgement.

The focused remaining gap is complete render-host retirement. The LOD adapter disposes its added layers, but the base adapter exposes no disposal service, atmosphere mutations are not restored, and base renderer/canvas/scene resources are not settled.

## Intent

Make one render-host generation own and retire every base and jungle-specific browser, scene, GPU, patch, atmosphere, and frame resource exactly once.

## Checklist

- [x] Compare all 11 Publish repositories.
- [x] Exclude `LuminaryLabs-Publish/TheCavalryOfRome`.
- [x] Work only on PrehistoricRush.
- [x] Reconcile runtime changes through head `4b2e184…`.
- [x] Identify the complete interaction loop and active domains.
- [x] Document all 96 active kits/adapters/fixtures and their services.
- [x] Add the timestamped tracker and focused audit family.
- [x] Confirm the jungle presentation is now integrated source-to-frame.
- [ ] Add complete render-host generation retirement.
- [ ] Execute repeated-mount, restart, WebGL recovery, artifact, and Pages fixtures.

## Read this pass first

```txt
.agent/trackers/2026-07-17T05-58-55-04-00/project-breakdown.md
.agent/trackers/2026-07-17T05-58-55-04-00/final-runtime-reconciliation.md
.agent/architecture-audit/2026-07-17T05-58-55-04-00-render-host-retirement-dsk-update.md
.agent/render-audit/2026-07-17T05-58-55-04-00-jungle-render-host-retirement-gap.md
.agent/validation.md
```

The final runtime reconciliation supersedes the earlier intermediate adoption findings from this run.

## Required parent domain

`prehistoric-rush-render-host-generation-retirement-authority-domain`

## Census

```txt
Nexus Engine root/subdomain kits: 29
official NexusEngine-Kits: 5
product/page/asset/Worker kits: 28
external/host/capture/render adapters: 21
proof kits and fixtures: 13
active named surfaces: 96
planned render-host-retirement surfaces: 19
```

## Claim boundary

Jungle runtime integration is confirmed by source inspection. Complete host retirement, repeated-mount safety, WebGL recovery, executable browser behavior, artifact parity, Pages parity, and production readiness are not claimed.
