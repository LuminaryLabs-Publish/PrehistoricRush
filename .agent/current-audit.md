# PrehistoricRush Current Audit

**Timestamp:** `2026-07-15T20-59-46-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `game-audio-event-projection-authority-audited`

## Summary

The product domain publishes accepted run-start, shard, failure, and victory events. The browser host renders accepted state through Three.js and DOM, but no domain owns browser-audio admission, cue resolution, playback lifecycle, preferences, deduplication, spatial projection, budgets, or acknowledgements.

## Plan ledger

**Goal:** centralize audible presentation around accepted semantic results and explicit browser lifecycle ownership.

- [x] Inspect game boot and loaded providers.
- [x] Inspect semantic run events and accepted resolution results.
- [x] Inspect RAF visual projection and public host snapshots.
- [x] Inspect pause, blur, route, and runtime lifecycle boundaries.
- [x] Define the audio authority and fixture boundary.
- [ ] Implement and execute the authority.

## Current interaction loop

```txt
intent
  -> PrehistoricRush proposals
  -> Core Physics observations
  -> resolution policy
  -> committed state and events
  -> Three.js and DOM projection
  -> no semantic audio projection
```

## Domains in use

```txt
browser document lifecycle, gesture admission, keyboard, blur, RAF, resize, Worker, storage, and navigation
Core input, spatial, scene, creature, character, player, physics, simulation, motion, camera, animation, graphics, skybox, UI, diagnostics, composition, and presentation
PrehistoricRush run, route, surface, score, outcome, pause, character composition, pose, and terrain IK
semantic audio events, cue descriptors, context lifecycle, listener/source projection, preferences, deduplication, budgets, and audiovisual convergence
patch streaming, terrain LOD, Three.js, Rapier, validation, Pages, and central tracking
```

## Current gaps

```txt
AudioContext/HTMLAudio owner: absent
user-gesture unlock admission: absent
semantic cue registry: absent
accepted-event projector: absent
movement, jump, landing, surface, pickup, collision, and win cues: absent
ambience lifecycle: absent
listener/source projection: absent
master/category volume and mute preferences: absent
snapshot/event deduplication: absent
voice pooling and budgets: absent
pause/blur/visibility/route retirement settlement: absent
AudioProjectionResult: absent
FirstAudibleCueAck: absent
FirstAudioVisualConvergenceAck: absent
```

## Required authority

`prehistoric-rush-game-audio-event-projection-authority-domain`

## Boundary

Documentation only. Runtime source, gameplay, rendering, audio behavior, tests, and deployment remain unchanged.
