# Visual-Only Status and Progress Frame Gap

**Timestamp:** `2026-07-15T16-00-32-04-00`  
**Status:** `accessible-gameplay-projection-focus-authority-audited`

## Summary

The renderer submits the Three.js frame and then replaces a visual status block with state, distance, shards, speed, terrain, patch and LOD text. The progress strip is nested styled `div` markup. Neither surface identifies the accepted game revision semantically or exposes stable status/progress roles.

## Plan ledger

**Goal:** bind every meaningful visible gameplay update to an equivalent semantic projection without announcing every RAF sample.

- [x] Trace accepted game state into visual DOM output.
- [x] Identify the visual progress and terminal label paths.
- [x] Record missing semantic frame identity.
- [ ] Implement and verify semantic/visual convergence.

## Current frame path

```txt
engine tick
  -> accepted game state
  -> Three.js render
  -> status.innerHTML replacement
  -> styled progress width replacement
  -> primary button label replacement
  -> next RAF
```

## Gap

```txt
stable status node identity: container exists, content replaced each frame
role=status: absent
aria-live policy: absent
aria-atomic policy: absent
progressbar role: absent
aria-valuemin: absent
aria-valuemax: absent
aria-valuenow: absent
accessible value text: absent
terminal transition announcement revision: absent
visual/semantic frame acknowledgement: absent
```

## Required render contract

```txt
SemanticFrameDescriptor
  gameRevision
  outcomeRevision
  statusLabel
  progressMinimum
  progressMaximum
  progressCurrent
  progressValueText
  announcementId
  announcementPriority
  pauseDialogRevision
  focusRevision

FirstAccessibleGameplayFrameAck
  visibleFrameRevision
  semanticFrameRevision
  gameRevision
  outcomeRevision
  pauseRevision
```

High-frequency values such as speed, region and patch diagnostics should remain visual unless an authored announcement policy explicitly admits them. Distance progress should update semantically without producing constant speech.

## Boundary

No DOM roles, attributes, live regions or frame acknowledgements were added.