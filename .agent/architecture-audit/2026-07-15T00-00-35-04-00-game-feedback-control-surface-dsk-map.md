# Architecture Audit: Game Feedback and Control Surface DSK Map

**Timestamp:** `2026-07-15T00-00-35-04-00`  
**Status:** `game-feedback-control-surface-admission-authority-audited`

## Summary

Feedback ownership is split between the runtime shell and a wrapper that removes DOM by semantic tag. The product has no coordinating domain that admits one explicit low-UI, accessible, actionable presentation strategy.

## Plan ledger

**Goal:** define the smallest domain boundary that owns feedback-surface identity, suppression, replacement, action routing, and first-frame proof.

- [x] Map the page preflight and wrapper.
- [x] Map runtime shell and frame updates.
- [x] Map Core UI and Presentation dependencies.
- [x] Map browser input and pause overlay.
- [x] Define candidate, admission, adoption, rollback, and acknowledgement surfaces.
- [ ] Implement the domain later.

## Current ownership map

```txt
src/pages/game.js
  owns dependency preflight and game entry

src/game.js
  owns broad aside removal
  owns MutationObserver lifecycle
  owns pause-overlay DOM host
  does not publish a feedback retirement result

src/game-runtime.js
  owns status/action node creation
  owns status/progress/diagnostic updates
  owns primary Jump/Retry/Run Again action
  owns WebGL host and gameplay loop
  cannot confirm that its feedback nodes remain connected

Core UI / Presentation
  contain descriptors and overlay configuration
  do not settle browser feedback-node ownership

browser input
  continues keyboard commands
  does not provide pointer/touch replacement after panel removal
```

## Proposed DSK family

```txt
n:prehistoric-rush:feedback-surface
  feedback-policy-kit
  feedback-surface-registry-kit
  feedback-surface-admission-kit
  semantic-status-projection-kit
  gameplay-action-surface-kit
  feedback-surface-retirement-kit
  feedback-surface-publication-kit
  feedback-frame-ack-kit
```

## Services

```txt
registerSurfaceDescriptor
registerFeedbackPolicy
resolveSurfaceStrategy
admitFeedbackGeneration
retireOwnedSurface
projectSemanticStatus
routeGameplayAction
getFeedbackSnapshot
getFeedbackResult
acknowledgeFirstFrame
reset
```

## Command and result

```txt
FeedbackSurfaceAdmissionCommand
  routeId
  runId
  commandId
  expectedPresentationRevision
  expectedFeedbackPolicyRevision
  viewportRevision
  candidateSurfaces
  requestedStrategy

FeedbackSurfaceAdmissionResult
  status: accepted | rejected | rolled-back | superseded
  feedbackGeneration
  visibleSurfaceIds
  hiddenSurfaceIds
  replacedSurfaceIds
  retiredSurfaceIds
  semanticStatusSurfaceId
  actionSurfaceIds
  keyboardCoverage
  pointerCoverage
  touchCoverage
  participantReceipts
```

## Adoption rule

No selector-wide DOM removal is authoritative. A surface may be retired only by stable identity, and an accepted low-UI strategy must still provide semantic state plus all required active and terminal actions.
