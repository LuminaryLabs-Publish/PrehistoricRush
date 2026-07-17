# PrehistoricRush Known Gaps

**Audit:** `2026-07-17T05-58-55-04-00`  
**Status:** `jungle-runtime-integrated-render-host-retirement-authority-audited`

## Summary

The foliage-card, ground-cover, Worker, fidelity, atlas, render-layer, atmosphere, diagnostics, startup-frame, syntax, and source contract paths are integrated. The current focused gap is complete retirement of the parent Three.js host generation.

## Intent

Keep restart, remount, and WebGL-recovery safety unsupported until all base and jungle-specific resources settle through one idempotent retirement result.

## Checklist

- [x] Confirm end-to-end jungle runtime composition.
- [x] Confirm source syntax and foliage contract gates.
- [x] Confirm child foliage/ground-cover/terrain/fidelity/atlas disposal services.
- [x] Confirm the base adapter exposes no disposal service.
- [x] Confirm atmosphere exposes no restoration/removal service.
- [x] Preserve the complete 97-surface census.
- [ ] Implement and prove parent render-host retirement.

## Completed jungle integration and source proof

```txt
semantic card-backed tree and ground-cover registration: present
main-thread and Worker ecological ground-cover generation: present
foliage-card tree packages and captures: present
procedural atlas generation: present
lush tree-card and ground-cover layers: present
atmosphere composition: present
lush frame acknowledgement and startup revision check: present
all new jungle modules in test:syntax: present
foliage-card-system test: present
expanded tree fidelity, variation, import, and LOD fixtures: present
```

## Parent retirement gaps

```txt
base adapter dispose(): absent
render admission latch: absent
active patch settlement before disposal: absent
base renderer/context disposal: absent
canvas host detachment: absent
base terrain/tree/grass/shard/player resource disposal: absent
base light/target removal: absent
atmosphere fill/bounce removal: absent
background/fog/exposure/shadow restoration: absent
stale RAF/render callback rejection: absent
RenderHostRetirementResult: absent
FirstRetiredRenderHostAck: absent
```

## Remaining validation gaps

```txt
npm test execution by this audit: not run
construct-render-retire-reconstruct fixture: absent
run-restart cleanup fixture: absent
route-remount cleanup fixture: absent
WebGL recovery fixture: absent
pixel-level browser jungle fixture: absent
built-artifact origin fixture: absent
Pages-origin runtime fixture: absent
```

## Current risk boundary

No leak, duplicate canvas, duplicate light, stale frame, or recovery incident was reproduced. The source-backed risk is that child layers retire while base renderer and atmosphere ownership remain indeterminate.

## Claim boundary

Do not claim complete cleanup, restart/remount safety, WebGL recovery, pixel parity, artifact parity, Pages parity, or production readiness until parent-generation retirement fixtures pass.
