# PrehistoricRush Known Gaps

**Audit:** `2026-07-17T05-58-55-04-00`  
**Status:** `jungle-runtime-integrated-render-host-retirement-authority-audited`

## Summary

The foliage-card, ground-cover, Worker, fidelity, atlas, render-layer, atmosphere, diagnostics, and startup-frame paths are now integrated. The current focused gap is complete retirement of the parent Three.js host generation.

## Intent

Keep restart, remount, and WebGL-recovery safety unsupported until all base and jungle-specific resources settle through one idempotent retirement result.

## Checklist

- [x] Confirm end-to-end jungle runtime composition.
- [x] Confirm child foliage/ground-cover/terrain/fidelity/atlas disposal services.
- [x] Confirm the base adapter exposes no disposal service.
- [x] Confirm atmosphere exposes no restoration/removal service.
- [x] Preserve the complete 96-surface census.
- [ ] Implement and prove parent render-host retirement.

## Completed jungle integration

```txt
semantic card-backed tree and ground-cover registration: present
main-thread and Worker ecological ground-cover generation: present
foliage-card tree packages and captures: present
procedural atlas generation: present
lush tree-card layer: present
ground-cover layer: present
atmosphere composition: present
patch ownership and child release: present
lush frame acknowledgement and startup revision check: present
```

## Parent retirement gaps

```txt
base adapter dispose(): absent
render admission latch: absent
active patch settlement before disposal: absent
base renderer/context disposal: absent
canvas host detachment: absent
base terrain geometry/material disposal: absent
legacy tree geometry/material disposal: absent
grass/shard resource disposal: absent
player render-resource disposal: absent
base light/target removal: absent
atmosphere fill/bounce removal: absent
background/fog/exposure/shadow restoration: absent
stale RAF/render callback rejection: absent
RenderHostRetirementResult: absent
FirstRetiredRenderHostAck: absent
```

## Validation gaps

```txt
new render-module syntax/import fixture: absent
actual product runtime fixture: absent
main-thread/Worker lush parity fixture: absent
construct-render-retire-reconstruct fixture: absent
run-restart cleanup fixture: absent
route-remount cleanup fixture: absent
WebGL recovery fixture: absent
source/artifact/Pages cleanup parity: absent
```

## Current risk boundary

No leak, duplicate canvas, duplicate light, stale frame, or recovery incident was reproduced. The source-backed risk is that child layers retire while base renderer and atmosphere ownership remain indeterminate.

## Claim boundary

Do not claim complete cleanup, restart/remount safety, WebGL recovery, artifact parity, Pages parity, or production readiness until parent-generation retirement fixtures pass.
