# Deploy Audit: Impostor Elevation Sweep Fixture Gate

**Timestamp:** `2026-07-16T14-39-29-04-00`

## Required release evidence

```txt
source generation
  -> npm test
  -> deterministic elevation sweep
  -> rendered continuity capture
  -> built artifact smoke
  -> deployed Pages smoke
  -> source/artifact/Pages binding-digest parity
```

## Fixture matrix

- Exact row elevation selects the expected row and frame IDs.
- Positions immediately below, at, and above every row midpoint settle predictably.
- Slow elevation sweep has monotonic normalized row weights.
- Repeated camera bob around a midpoint does not chatter under the accepted policy.
- Abrupt jump/reset rejects stale transition work and converges to the new view.
- Far and horizon forms preserve independent frame-set semantics.
- Form crossfade and elevation continuity remain capacity bounded.
- Same package generation and camera trace reproduce the same binding digest.
- Missing, duplicate, stale, or invalid frame metadata blocks or produces an explicit fallback result.
- Source, Vite artifact, and Pages return matching continuity diagnostics and pixels.

## Current gate state

```txt
exact frame source fixture: present
seeded tree diversity fixture: present
npm test chain includes both: present
browser elevation-boundary fixture: absent
rendered pixel fixture: absent
artifact continuity fixture: absent
Pages continuity fixture: absent
FirstContinuousImpostorFrameAck fixture: absent
```

No artifact or deployment changes were made, and no fixture was run during this audit.