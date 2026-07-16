# Silent Audiovisual Frame Gap

**Timestamp:** `2026-07-15T20-59-46-04-00`  
**Status:** `game-audio-event-projection-authority-audited`

## Summary

The accepted simulation revision is projected through Three.js and DOM, but no audio revision is bound to the same visible frame.

## Plan ledger

**Goal:** prove that visible and audible projections describe the same accepted gameplay result.

- [x] Trace committed simulation state into rendering and DOM status.
- [x] Trace accepted run and pickup events.
- [x] Record missing audio frame identity and acknowledgement.
- [ ] Implement audiovisual convergence fixtures.

## Current frame path

```txt
engine tick
  -> committed run state and events
  -> patch and creature refresh
  -> Three.js render
  -> DOM status/action update
  -> next RAF
```

## Gap

```txt
audio projection revision: absent
cue event identity: absent
listener camera revision: absent
source world revision: absent
audible effect receipt: absent
visible/audible convergence receipt: absent
FirstAudibleCueAck: absent
FirstAudioVisualConvergenceAck: absent
```

## Required frame contract

```txt
AudioVisualFrameDescriptor
  committedFrameRevision
  runId
  eventIds
  cameraRevision
  listenerRevision
  cueProjectionRevision
  visibleFrameRevision

FirstAudioVisualConvergenceAck
  committedFrameRevision
  visibleFrameRevision
  audioProjectionRevision
  admittedCueIds
  audibleCueIds
```

No audible or convergence behavior was implemented or executed.
