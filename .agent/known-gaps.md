# PrehistoricRush Known Gaps

**Audit:** `2026-07-16T14-39-29-04-00`  
**Status:** `tree-impostor-elevation-row-continuity-authority-audited`

## Summary

Exact impostor azimuth/elevation addressing, exact UV rectangles, adjacent-azimuth blending, and exact-frame receipts are implemented. Temporal continuity between captured elevation rows and rendered proof remain incomplete.

## Intent

Keep the nearest-row behavior explicitly provisional until each elevation transition settles through a versioned continuity result.

## What needs to happen

### Elevation identity gaps

```txt
sorted elevation-band identity: implicit only
lower/upper row bracket result: absent
row-transition identity: absent
continuity policy revision: absent
prior accepted row state: absent
```

### Weighting gaps

```txt
adjacent azimuth weighting: present
elevation weighting: absent
combined azimuth/elevation weighting: absent
four-frame normalized binding budget: absent
form-fade × continuity-weight contract: absent
```

### Temporal gaps

```txt
row midpoint deadband: absent
row interpolation: absent
camera-bob chatter prevention: absent
stale transition rejection: absent
camera reset/jump settlement: absent
far/horizon continuity composition: absent
```

### Result and proof gaps

```txt
TreeImpostorViewContinuityResult: absent
FirstContinuousImpostorFrameAck: absent
elevation-transition diagnostics: absent
elevation-boundary source fixture: absent
browser rendered sweep: absent
artifact and Pages continuity parity: absent
```

## Current risk boundary

The renderer selects the nearest elevation row on every frame. This proves a continuity ownership gap; it does not prove a visible pop, flicker, or production defect on a particular browser or camera trace.

## Retained gaps

WebGL recovery, Worker liveness, game audio, accessibility, host-clock pacing, terrain ownership and LOD, creator settlement, feedback, route progress, provider convergence, outcome settlement, profile revision, patch ownership, pause lifecycle, character composition, terrain IK, PlayerPose, collision convergence, Core Input, viewport, articulation, run restart, browser lifecycle, and prior tree-fidelity histories remain separate retained families.

## Do not claim

Do not claim elevation-row continuity, transition stability, browser pixel correctness, artifact parity, Pages parity, or production readiness until the authority and fixtures are implemented.