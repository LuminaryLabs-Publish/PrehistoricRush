# Architecture Audit: Browser Input and Core Input Adoption DSK Map

**Timestamp:** `2026-07-13T03-12-30-04-00`

## Summary

Core Input is installed as a capability but the browser host bypasses it. A product-level coordinating authority is required between DOM input, Core Input, run commands, product `InputState`, diagnostics and visible presentation.

## Plan ledger

**Goal:** preserve bounded ownership while making Core Input the sole admitted browser-action boundary.

- [x] Keep browser event capture in the browser host.
- [x] Keep action/binding state in Core Input.
- [x] Keep run simulation and jump consumption in `prehistoric-rush-domain-kit`.
- [x] Keep run lifecycle reset/restart ownership in the retained run-lifecycle authority.
- [x] Keep rendering and HUD projection in the Three.js host.
- [x] Define one coordinating input-admission parent domain.
- [ ] Implement and prove the boundary later.

## Parent domain

```txt
prehistoric-rush-browser-input-core-adoption-authority-domain
```

## Ownership

```txt
owns:
  input session and game-surface identity
  focus and lifecycle generations
  DOM sample envelopes
  editable-target and source policy
  repeat classification
  held versus edge-command semantics
  command identity and sequence
  Core Input admission result
  stale and duplicate rejection
  input clear/fence result
  consumer receipts
  first visible input-frame acknowledgement

coordinates:
  browser-input-adapter
  core-input-kit
  prehistoric-rush-domain-kit
  run lifecycle authority
  UI button adapter
  Core Scene
  Core Simulation
  public diagnostics
  Three.js/HUD presentation

does not own:
  movement integration
  route or surface classification
  Rapier physics
  collision, pickup or goal resolution
  patch streaming
  creature articulation
  camera-follow semantics
```

## Current dependency map

```txt
window keydown/keyup/blur
  -> host-local input object
  -> game.setInput()
  -> product InputState
  -> run system

button onclick
  -> game.setInput({ jump: true })
     or game.start()

core-input-kit
  -> installed with actions/bindings
  -> not used by either path
```

## Required dependency map

```txt
DOM keyboard/button sample
  -> browser sample envelope
  -> focus/source/repeat/generation admission
  -> Core Input action or axis submission
  -> CoreInputAdmissionResult
  -> product consumer adapter
  -> RunCommandResult / JumpCommandResult / HeldInputResult
  -> simulation and presentation
  -> FirstInputFrameAck
```

## Candidate kits

```txt
input-session-id-kit
game-input-surface-kit
input-focus-generation-kit
keyboard-event-envelope-kit
button-input-envelope-kit
input-source-policy-kit
editable-target-exclusion-kit
key-repeat-policy-kit
held-action-state-kit
edge-action-command-kit
core-input-action-mapping-kit
core-input-admission-result-kit
input-sequence-kit
input-generation-fence-kit
duplicate-input-command-kit
stale-input-command-kit
run-command-admission-kit
jump-command-admission-kit
input-clear-result-kit
input-consumer-receipt-kit
input-observation-journal-kit
first-input-frame-ack-kit
midrun-enter-rejection-fixture-kit
key-repeat-jump-fixture-kit
blur-visibility-generation-fixture-kit
editable-target-fixture-kit
button-keyboard-parity-fixture-kit
pages-input-smoke-kit
```

## Required result chain

```txt
BrowserInputSample
  -> CoreInputAdmissionResult
  -> ProductInputConsumptionReceipt
  -> SimulationCommitRevision
  -> RenderFrameRevision
  -> FirstInputFrameAck
```

## Non-claim

This audit defines the DSK boundary only. No Core Input integration, listener replacement, command policy or runtime result was implemented.