# PrehistoricRush Current Audit

**Timestamp:** `2026-07-16T12-47-00-04-00`  
**Repository:** `LuminaryLabs-Publish/PrehistoricRush`  
**Status:** `tree-impostor-view-frame-addressing-authority-audited`

## Summary

The runtime now binds exact tree generations to patch identity, retains near/medium/far/horizon form state, crossfades with hysteresis, waits for atlas decoding, and rejects undecoded atlas rendering. Far impostors still collapse a multi-elevation capture set into one elevation row and select frames by azimuth count rather than exact frame metadata.

## Intent

Make impostor frame selection a deterministic projection from camera pose, package generation, and captured frame records.

## What needs to happen

```txt
accepted package generation
  -> exact camera-to-tree view vector
  -> normalized azimuth and elevation
  -> nearest or blended captured frame record
  -> validated atlas rectangle
  -> render batch assignment
  -> exact-frame result and visible acknowledgement
```

## Checklist

- [x] Inspect generation, patch/cache identity, form retention, horizon, hysteresis, crossfade, image decode, texture admission, tests, and workflow.
- [x] Compare capture descriptors with runtime material/frame selection.
- [x] Confirm far capture requests eight azimuths across two elevations.
- [x] Confirm runtime only groups the first elevation and assumes one atlas row.
- [x] Define the remaining authority and proof boundary.
- [ ] Implement and execute the authority.

## Interaction loop

```txt
menu -> background tree bundle preparation
entry -> required package load/capture -> decode far/horizon atlases
boot -> validate generation -> bind patch/cache identity -> create fidelity layer
frame -> select retained form -> select azimuth-only impostor material -> render
startup -> publish generation and form counts
```

## Domains in use

```txt
browser route/module/DOM/canvas/RAF lifecycle
Core Assets, Core Startup, Core Object, Object Shape, Core Capture and Object Fidelity
IndexedDB cache, runtime image decoding and Three.js texture admission
PrehistoricRush run, patch streaming, terrain LOD, physics, player and camera
four-form tree fidelity, hysteresis, crossfade, billboard view selection and atlas addressing
tests, Pages deployment, repo-local audit state and central tracking
```

## Current gap

```txt
capture frame records: present
azimuthDegrees metadata: present
elevationDegrees metadata: present
atlas metadata: present
camera azimuth selection: present
camera elevation selection: absent
exact frame identity in selection state: absent
frame rectangle/row adoption: absent
frame result and visible acknowledgement: absent
```

## Required authority

`prehistoric-rush-tree-impostor-view-frame-addressing-authority-domain`

## Boundary

Documentation only. Runtime source, gameplay, rendering, tests, and deployment were not changed by this audit.