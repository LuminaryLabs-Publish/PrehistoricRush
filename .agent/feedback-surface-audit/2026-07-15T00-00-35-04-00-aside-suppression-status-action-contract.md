# Feedback Surface Audit: Aside Suppression, Status, and Action Contract

**Timestamp:** `2026-07-15T00-00-35-04-00`  
**Status:** `game-feedback-control-surface-admission-authority-audited`

## Summary

The wrapper uses `aside` as a deletion selector, while the runtime uses `aside` as the authored feedback container. Stable ownership identities are absent, so intentional low-UI suppression and accidental control removal are indistinguishable.

## Plan ledger

**Goal:** define an explicit contract for retaining, replacing, visually hiding, or retiring each feedback surface.

- [x] Identify the suppression selector.
- [x] Identify the removed runtime surface.
- [x] Identify lost status and action capabilities.
- [x] Define stable descriptors and policy states.
- [x] Define accessibility and device-coverage predicates.
- [ ] Implement later.

## Required descriptors

```txt
FeedbackSurfaceDescriptor
  id
  kind: status | progress | diagnostics | action | terminal
  owner
  semanticRole
  requiredStates
  inputSources
  visibilityPolicy
  replacementSurfaceId

FeedbackPolicyDescriptor
  id
  revision
  mode: full | minimal | visually-hidden | replacement
  allowedRetirements
  requiredSemanticSurfaces
  requiredActiveActions
  requiredTerminalActions
  requiredInputSources
```

## Policy rule

```txt
retire surface
  -> target stable surface ID
  -> require owning generation
  -> require replacement when capability is mandatory
  -> preserve semantic status
  -> preserve active and terminal action coverage
  -> publish retirement receipt

never:
  querySelectorAll("aside") as ownership authority
```

## Current capability loss

```txt
visible status: removed
visible progress: removed
visible shard count: removed
visible streaming diagnostics: removed
pointer/touch Jump: removed
pointer/touch Retry: removed
pointer/touch Run Again: removed
keyboard gameplay: retained
pause overlay: retained
```
