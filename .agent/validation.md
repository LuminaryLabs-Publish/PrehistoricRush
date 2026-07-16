# PrehistoricRush Validation

**Audit timestamp:** `2026-07-16T06-39-16-04-00`  
**Scope:** WebGL context loss, GPU-resource reconstruction, recovery policy and first recovered frame evidence

## Summary

Source review confirms one Three.js renderer, recursive RAF submission and a broad GPU-resource graph. The host does not observe WebGL loss/restoration or publish recovery results. The LOD layer can ordinarily dispose its own resources, but the base adapter has no complete disposal/reconstruction contract and the host does not execute one.

## Plan ledger

**Goal:** distinguish verified source behavior from recovery behavior that was not executed.

- [x] Compare all 11 Publish repositories and select the oldest synchronized eligible repository.
- [x] Inspect renderer construction and canvas mounting.
- [x] Inspect frame submission, resize and host listeners.
- [x] Inspect terrain, LOD, texture, instance, creature, light and shadow resources.
- [x] Inspect disposal and test coverage.
- [x] Preserve the complete 66-surface inventory.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Execute context-loss and deployment fixtures later.

## Verified source findings

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

## Source-derived failure boundary

```txt
context is lost
  -> no product result or render generation retirement
  -> RAF remains owned by the same host
  -> no explicit resource reconstruction transaction
  -> no bounded retry or fallback
  -> no matching recovered frame acknowledgement
```

This proves a missing product-owned recovery authority. It does not prove a specific browser-visible defect or negate Three.js internal recovery behavior.

## Change boundary

```txt
documentation changed: yes
runtime JavaScript changed: no
HTML CSS shaders or assets changed: no
gameplay simulation input rendering or physics changed: no
dependencies or package scripts changed: no
tests or workflows changed: no
deployment changed: no
branch created: no
pull request created: no
```

## Checks not completed

```txt
npm test
forced WEBGL_lose_context fixture
context restoration fixture
resource reconstruction fixture
stale-generation fixture
double-loss fixture
retry and fallback fixture
route/page retirement fixture
first recovered frame fixture
built-output smoke
GitHub Pages smoke
```

## Non-claims

No context-loss recovery, resource rehydration, stale-generation rejection, fallback correctness, first-recovered-frame convergence, artifact parity, Pages parity or production readiness is claimed.
