# Render Audit: Elevation-Row Visible Transition Gap

**Timestamp:** `2026-07-16T14-39-29-04-00`

## Summary

Far and horizon impostors now bind exact captured frames and UV rectangles. Azimuth changes can blend between neighboring frames, but elevation changes select one nearest row with no transition policy.

## Current render path

```txt
camera position + tree bounds
  -> azimuth and elevation
  -> nearest capture elevation row
  -> one or two adjacent azimuth frames
  -> exact frameRect attributes
  -> weighted fidelityFade instances
  -> shared atlas sampling
  -> exact frame-binding digest
```

## Gap

When view elevation crosses the midpoint between two captured rows, the complete selected row can switch in one frame. The existing LOD form hysteresis does not govern capture-row selection, and the exact-frame acknowledgement proves identity rather than temporal continuity.

```txt
exact UV rectangle binding: present
adjacent azimuth blending: present
form dither crossfade: present
exact frame acknowledgement: present

elevation row interpolation: absent
elevation row deadband: absent
row-transition retained state: absent
continuity result: absent
rendered elevation sweep: absent
```

## Required proof

- Sweep camera elevation slowly through every row midpoint.
- Repeat with camera bob, terrain height changes, and abrupt camera movement.
- Verify normalized frame weights, bounded instance counts, stable generation identity, and no alternating row selection.
- Compare source, built artifact, and deployed Pages pixels.
- Publish `FirstContinuousImpostorFrameAck` only after the accepted continuity result is rendered.

No visible pop was reproduced during this documentation audit.