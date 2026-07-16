# Game Audio Browser Fixture Gate

**Timestamp:** `2026-07-15T20-59-46-04-00`  
**Status:** `game-audio-event-projection-authority-audited`

## Summary

Static source review cannot prove browser unlock, audibility, cue timing, lifecycle settlement, or deployed-origin parity.

## Plan ledger

**Goal:** require executable browser and deployed-origin evidence before claiming reliable game audio.

- [x] Define source-level audio gaps.
- [x] Define browser fixture rows.
- [x] Define artifact and Pages parity requirements.
- [ ] Execute the fixtures.

## Required fixture rows

```txt
Chrome desktop: gesture unlock, start, jump, landing, pickup, fail, win
Firefox desktop: unlock and lifecycle parity
Safari desktop/mobile: unlock and context resume policy
hidden/visible: suspend and resume loops without duplication
pause/unpause: authored loop and ambience policy
rapid pickups: bounded voices and no duplicate cues
restart/run replacement: old loops and cues retired
mute/volume: persisted preference and bus application
camera movement: listener revision follows accepted camera
source vs built output vs Pages: matching cue registry and behavior
```

## Required evidence

```txt
browser name and version
origin and artifact commit
run and committed-frame revisions
semantic event IDs
accepted/rejected cue IDs
context state transitions
voice budget snapshots
audible acknowledgement
visible/audio convergence acknowledgement
screenshots or logs where applicable
```

No fixture, build, artifact, or Pages audio smoke was executed in this documentation turn.
