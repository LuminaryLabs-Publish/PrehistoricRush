# START HERE: PrehistoricRush

**Last aligned:** `2026-07-13T03-12-30-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Branch:** `main`  
**Status:** `browser-input-core-input-adoption-central-reconciled`  
**Technical audit:** `browser-input-core-input-adoption-authority-audited`  
**Retained audits:** `game-viewport-render-surface-central-reconciled`, `articulated-pose-presentation-authority-audited`, `run-start-restart-central-reconciled`

## Summary

PrehistoricRush installs Core Input with steering, boost, jump, start and retry capabilities, but the active browser host bypasses it. Window-global listeners, a host-local held-state object and the visible button write directly into product input or run lifecycle operations without focus ownership, repeat policy, command identity, generation fencing, typed results or visible-frame correlation.

## Plan ledger

**Goal:** route every browser gameplay action through one focus-owned, generation-bound Core Input admission path before it can affect a run.

- [x] Compare all ten accessible Publish repositories.
- [x] Exclude `TheCavalryOfRome`.
- [x] Confirm all nine eligible repositories have central-ledger and root `.agent` coverage.
- [x] Select only `PrehistoricRush`, the oldest eligible central entry.
- [x] Preserve the complete 45-surface kit/service inventory.
- [x] Trace Core Input installation, keyboard/button capture, held state, one-shot actions, blur, RAF consumption and visible projection.
- [x] Add the `03-12-30` tracker and audit family.
- [x] Synchronize root routing, machine state and central tracking.
- [x] Push only to `main`; create no branch or pull request.
- [ ] Runtime Core Input adoption and executable browser fixtures remain future work.

## Current audit family

```txt
.agent/trackers/2026-07-13T03-12-30-04-00/project-breakdown.md
.agent/turn-ledger/2026-07-13T03-12-30-04-00.md
.agent/architecture-audit/2026-07-13T03-12-30-04-00-browser-input-core-adoption-dsk-map.md
.agent/render-audit/2026-07-13T03-12-30-04-00-input-result-visible-frame-gap.md
.agent/gameplay-audit/2026-07-13T03-12-30-04-00-global-key-repeat-midrun-reset-loop.md
.agent/interaction-audit/2026-07-13T03-12-30-04-00-browser-sample-core-input-result-map.md
.agent/input-system-audit/2026-07-13T03-12-30-04-00-focus-repeat-generation-core-input-contract.md
.agent/deploy-audit/2026-07-13T03-12-30-04-00-browser-input-fixture-gate.md
```

## Current input loop

```txt
Core Input actions/bindings are installed
  -> browser host does not submit through Core Input
  -> window keydown/keyup/blur and button callbacks mutate host/product state directly
  -> RAF copies held steer/boost into product InputState
  -> run system consumes input and clears jump
  -> simulation, streaming, render and HUD update
  -> no input result or visible-frame acknowledgement
```

## Main findings

```txt
Core Input installed: yes
Core Input used by active browser adapter: no
window-global listeners: yes
focus/editable-target admission: no
key-repeat policy: no
Enter can restart active run: yes
Space repeat can re-arm jump: yes
button/keyboard shared command result: no
input session/generation/sequence: no
stale/duplicate rejection: no
visibility/page lifecycle fence: no
input diagnostics and first-frame acknowledgement: no
```

## Required parent domain

```txt
prehistoric-rush-browser-input-core-adoption-authority-domain
```

```txt
BrowserInputSample
  -> session/surface/focus/lifecycle admission
  -> target and repeat policy
  -> held or edge-action classification
  -> Core Input action/binding submission
  -> typed admission result
  -> product consumer receipt
  -> simulation and render correlation
  -> first visible input-frame acknowledgement
```

## Kit census

```txt
Nexus Engine root/subdomain kits: 15
official NexusEngine-Kits:         5
product/page/Worker kits:         14
external/host adapters:            9
proof kits:                        2
total surfaces:                   45
```

## Retained audit families

The viewport, articulation, run-lifecycle and runtime-lifecycle audits remain valid and unresolved. This input audit does not replace their ownership boundaries.

## Validation boundary

Documentation only. Runtime input, Core Input, simulation, physics, streaming, articulation, rendering, package scripts, dependencies and deployment are unchanged. No browser-input fixture was run.