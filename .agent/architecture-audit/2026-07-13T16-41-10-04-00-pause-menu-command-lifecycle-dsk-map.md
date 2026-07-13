# Pause Menu Command Lifecycle DSK Map

**Timestamp:** `2026-07-13T16-41-10-04-00`

## Summary

PrehistoricRush correctly places pause-menu semantics in a renderer-agnostic child DSK under the product domain and uses Core UI plus Core Presentation descriptors. The missing parent authority is not another visual widget kit. It is a command/lifecycle coordinator spanning input admission, semantic state, DOM projection, continued gameplay policy, exit settlement and host retirement.

## Plan ledger

**Goal:** define the minimum domain boundary needed to make menu commands and browser consequences revisioned, terminal and observable.

- [x] Preserve `n:prehistoric-rush:pause-menu` as semantic state/command owner.
- [x] Preserve Core UI as menu-descriptor owner.
- [x] Preserve Core Presentation as renderer-neutral overlay policy owner.
- [x] Keep simulation non-blocking by authored policy.
- [ ] Add command identity, expected sequence and typed terminal results.
- [ ] Add browser-host generation and projection receipts.
- [ ] Add explicit gameplay-input policy while the overlay is visible.
- [ ] Add exit settlement and terminal host retirement.
- [ ] Add visible-frame and deployed parity proof.

## Existing domain graph

```txt
n:core-ui
  -> menu descriptors

n:presentation
  -> n:presentation:output
  -> n:presentation:ui-scale
  -> n:presentation:camera-framing
  -> overlay policy configuration

n:prehistoric-rush
  -> run, route, score, outcome, pose and player authority
  -> n:prehistoric-rush:pause-menu
       -> open/view/selectedAction/sequence
       -> open/close/toggle/showSettings/requestExit
       -> snapshot/reset and semantic events

browser pause host
  -> Escape admission
  -> DOM overlay construction
  -> Settings and Exit click handling
  -> immediate navigation
  -> independent synchronization RAF
```

## Ownership correction

```txt
prehistoric-rush-pause-menu-command-lifecycle-authority-domain
  owns:
    command IDs and generations
    expected menu and host revisions
    typed command results
    overlay projection admission
    non-blocking gameplay-input policy
    exit settlement
    host retirement receipts
    first matching visible-frame acknowledgement

  does not own:
    simulation rules
    route or score
    Three.js world rendering
    Core UI descriptor semantics
    Core Presentation viewport/framing math
    browser implementation details beyond adapters
```

## Planned coordinating surfaces

```txt
prehistoric-rush-pause-menu-command-lifecycle-authority-domain
pause-menu-command-kit
pause-menu-command-generation-kit
pause-menu-expected-sequence-kit
pause-menu-command-result-kit
pause-menu-host-generation-kit
pause-overlay-projection-candidate-kit
pause-overlay-projection-result-kit
non-blocking-gameplay-input-policy-kit
pause-visible-frame-ack-kit
exit-intent-kit
exit-navigation-candidate-kit
exit-runtime-retirement-request-kit
exit-retirement-receipt-kit
exit-settlement-result-kit
pause-command-journal-kit
pause-menu-browser-fixture-kit
pause-menu-pages-parity-kit
```

## Required transaction

```txt
PauseMenuCommand
  -> bind runtime, menu, overlay and host generations
  -> validate command ID and expected sequence
  -> classify command and input source
  -> commit or reject semantic state
  -> prepare one overlay projection
  -> apply explicit retained-input policy
  -> publish PauseMenuCommandResult
  -> acknowledge the matching visible overlay frame

accepted RequestExit
  -> freeze new menu commands
  -> prepare navigation target
  -> retire attach poll, sync RAF, DOM listeners and overlay
  -> request Worker, render and runtime cleanup
  -> collect mandatory receipts
  -> publish ExitSettlementResult
  -> navigate under accepted completion or explicit timeout policy
```

## Dependency rule

The authority should consume the product pause-menu API and renderer-neutral Core descriptors. It should not move DOM, `location.href`, Three.js or browser event objects into Core domains.