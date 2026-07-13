# PrehistoricRush Current Audit

**Timestamp:** `2026-07-13T03-12-30-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `browser-input-core-input-adoption-central-reconciled`  
**Technical status:** `browser-input-core-input-adoption-authority-audited`

## Summary

Core Input is installed with `jump`, `boost`, `start`, `retry` and `steer`, but the active browser host bypasses it. Window-global listeners and the visible action button mutate host-local or product input state directly, so focus ownership, repeat policy, command identity, generation fencing, typed terminal results and visible-frame correlation are absent.

## Plan ledger

**Goal:** preserve one source-backed record from browser sample capture through Core Input admission, gameplay consumption and first visible effect.

- [x] Reconcile the current Publish inventory and central ledger.
- [x] Select only PrehistoricRush through the oldest eligible fallback.
- [x] Preserve all domains, 45 surfaces and offered services.
- [x] Trace keyboard, button, blur, held state, one-shot action, RAF and run-system paths.
- [x] Define focus, repeat, generation, result and frame-proof requirements.
- [x] Add the `03-12-30` audit family.
- [x] Preserve viewport, articulation, run-lifecycle and runtime-lifecycle audits.
- [ ] Implement and execute later.

## Complete interaction loop

```txt
boot
  -> install Core Input actions/bindings
  -> install product domain and browser host

browser input
  -> window keydown/keyup/blur or button click
  -> mutate host-local held state, product InputState or call start()
  -> bypass Core Input admission

RAF
  -> copy held steer/boost to product InputState
  -> engine tick and run-system consumption
  -> jump flag cleared after consumption
  -> simulation, physics, streaming, pose, camera, render and HUD
  -> no input result or visible-frame acknowledgement
```

## Main findings

```txt
Core Input configured but bypassed
window-global listeners without canvas/focus ownership
no editable-target exclusion
no event.repeat policy
Enter restarts even during active run
Enter repeat can start multiple successor runs
Space repeat can re-arm jump after tick consumption
button and keyboard paths have no shared command/result
blur neutralizes values but retires no generation
no visibility/page lifecycle fence
no command ID, sequence, duplicate or stale result
public diagnostics omit input authority state
no first visible input-frame acknowledgement
```

## Domains in use

```txt
browser page, module admission, keyboard, button, focus, blur and lifecycle
player-profile schema, persistence and boot binding
Core Input, Spatial, Scene, Simulation, Motion, Physics, Camera, Animation, Graphics, Skybox, UI, Diagnostics and Composition
articulated motion and articulated dynamics
Rapier provider, bodies, colliders, requests, steps and frames
procedural creature descriptor, geometry, skeleton, pose and rig adaptation
seeded route, patch Worker, queue, cache, activation and release
terrain, vegetation, pickups, collisions and height sampling
run lifecycle, movement, jump, surface, score, failure and win
Three.js camera, rendering, lighting, instancing, HUD and public diagnostics
input session, focus generation, repeat policy, Core Input admission, consumer receipts and frame proof
validation, build and Pages deployment
```

## Required authority

```txt
prehistoric-rush-browser-input-core-adoption-authority-domain
```

```txt
BrowserInputSample
  -> validate session, route, surface, focus and lifecycle generation
  -> exclude non-game/editable targets
  -> classify held or one-shot action
  -> apply repeat policy
  -> submit through Core Input
  -> return typed accepted/rejected/duplicate/stale/clear result
  -> obtain product consumer receipt
  -> correlate simulation and render revisions
  -> publish FirstInputFrameAck
```

## Current output

See `.agent/trackers/2026-07-13T03-12-30-04-00/project-breakdown.md` and its linked audit family.

## Validation

Documentation only. No runtime input, Core Input, gameplay, rendering or deployment behavior changed and no input fixture was run.