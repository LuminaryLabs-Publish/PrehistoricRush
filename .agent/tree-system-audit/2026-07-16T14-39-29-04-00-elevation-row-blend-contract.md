# Tree System Audit: Elevation-Row Blend Contract

**Timestamp:** `2026-07-16T14-39-29-04-00`

## Existing guarantees

- Exact tree package generations and shared decoded atlases.
- Ten deterministic species with stable tree and collider identities.
- Exact azimuth/elevation frame records and UV rectangles.
- Adjacent-azimuth blending inside one selected elevation row.
- Near/medium/far/horizon form retention, hysteresis, and dither crossfade.
- Exact frame-binding digest and acknowledgement.

## Missing contract

```txt
ElevationRows(frames)
  -> sorted unique row identities

Bracket(viewElevation)
  -> lower row
  -> upper row
  -> normalized elevation amount

ContinuityPolicy(previous, bracket, amount)
  -> retained row under deadband
  -> or explicit two-row interpolation
  -> stable transition identity

FrameWeights(rows, azimuth)
  -> one/two azimuth frames per admitted row
  -> up to four exact frames
  -> normalized total weight = 1
```

## Invariants

- Frame records must belong to the accepted package generation.
- Every bound frame must have a valid UV rectangle inside the decoded atlas.
- Weights must be finite, non-negative, normalized, and capacity bounded.
- The same seed, package, camera trace, and policy revision must produce the same binding digest.
- Form transition fade and view-continuity weights must compose without exceeding one per logical tree projection.
- A missing row must settle through an explicit fallback result rather than silently changing coordinate policy.
- Retired patches, trees, forms, packages, or camera generations cannot publish acknowledgements.

## Recommended default

Use two-row interpolation when both rows exist, with a small stateful deadband near exact rows to prevent numeric chatter. Use a single row only at the frame-set boundary or through an explicit fallback result.

The final implementation policy remains proposed; this audit changes no runtime behavior.