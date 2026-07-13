# Pause Overlay Visible-Frame Gap

**Timestamp:** `2026-07-13T16-41-10-04-00`

## Summary

The pause DSK publishes clone-safe semantic state, but the browser host independently destroys and recreates overlay DOM. A command can return accepted state before layout, paint or a visible frame proves that the matching overlay revision is on screen.

## Plan ledger

**Goal:** correlate each accepted pause-menu revision with one terminal DOM projection and visible-frame receipt without blocking the Three.js world loop.

- [x] Identify semantic sequence as the current change detector.
- [x] Confirm overlay reconstruction occurs outside the DSK.
- [x] Confirm simulation and world rendering continue while open.
- [ ] Bind overlay projection to menu and host generations.
- [ ] Return prepared, committed, stale, failed or retired projection results.
- [ ] Acknowledge the first painted frame matching the accepted menu sequence.
- [ ] Preserve or recover the last complete overlay after projection failure.
- [ ] Retire stale DOM nodes and callbacks exactly once.

## Current projection path

```txt
pauseMenu.toggle/showSettings/requestExit
  -> semantic sequence increments
  -> host.sync reads state
  -> predecessor overlay is removed
  -> successor section, panel and buttons are created
  -> overlay is appended
  -> command path returns without paint evidence
```

## Missing evidence

```txt
PauseMenuCommandId
PauseMenuGeneration
DOMHostGeneration
OverlayProjectionRevision
OverlayNodeIdentity
LayoutResult
PaintFrameId
FirstPauseOverlayFrameAck
stale projection rejection
partial projection recovery
retirement receipt
```

## Required presentation envelope

```txt
PauseOverlayFrameEnvelope
  commandId
  menuGeneration
  menuSequence
  hostGeneration
  descriptorId
  overlayPolicyRevision
  view
  selectedAction
  gameplayInputPolicyRevision
  projectionFingerprint
```

## Completion rule

An open, settings, close or exit-selection command is not visibly complete until the browser adapter publishes a projection result and the next admitted animation frame confirms that the DOM state matches the accepted envelope. This acknowledgement must not imply that gameplay simulation is paused; non-blocking behavior remains a separate explicit policy.