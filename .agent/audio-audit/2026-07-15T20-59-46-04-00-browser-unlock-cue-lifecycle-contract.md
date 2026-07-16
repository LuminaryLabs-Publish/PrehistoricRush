# Browser Unlock and Cue Lifecycle Contract

**Timestamp:** `2026-07-15T20-59-46-04-00`  
**Status:** `game-audio-event-projection-authority-audited`

## Summary

PrehistoricRush needs explicit browser-audio admission, context ownership, cue lifecycle, and retirement before sound can be considered reliable.

## Plan ledger

**Goal:** prevent blocked playback, duplicate cues, leaked loops, and unbounded voices across run and document lifecycles.

- [x] Define user-gesture unlock admission.
- [x] Define context suspend/resume/close ownership.
- [x] Define one-shot and continuous cue lifecycles.
- [x] Define preferences, buses, and budgets.
- [x] Define pause, blur, visibility, route, and replacement settlement.
- [ ] Implement and validate in browsers.

## Contract

```txt
capability observe
  -> user gesture admission
  -> AudioContext creation/resume
  -> audio policy adoption
  -> committed-event cue projection
  -> pooled effect execution
  -> effect receipt
```

## Buses

```txt
master
ui
movement
pickups
impacts
outcomes
ambience
```

## Continuous-loop lifecycle

```txt
prepare -> start -> update -> suspend -> resume -> stop -> retire
```

Movement, boost, and ambience loops must be keyed by run and projection generation. A new run, route exit, hidden document, runtime replacement, or closed context must retire obsolete loops and release nodes.

## Deduplication key

```txt
runId + semanticEventId + cueDescriptorId + audioPolicyRevision
```

## Budget rule

One-shots use bounded pools and priorities. Repeated pickup or input bursts must not exceed the declared voice limit or starve collision and outcome cues.
