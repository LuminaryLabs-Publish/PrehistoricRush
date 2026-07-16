# Architecture Audit: Tree Impostor Elevation Continuity DSK Map

**Timestamp:** `2026-07-16T14-39-29-04-00`  
**Status:** `tree-impostor-elevation-row-continuity-authority-audited`

## Current ownership

```txt
Core Assets / Startup / Object / Shape / Capture / Fidelity
  -> exact generation packages, decoded shared atlases, frame records

seeded patch generation
  -> ten-species ecology, stable tree IDs, variation, bounds, colliders

three-tree-fidelity-layer
  -> projected-size form selection
  -> form hysteresis and dither crossfade
  -> camera azimuth/elevation derivation
  -> nearest elevation-row selection
  -> adjacent-azimuth blending
  -> exact UV rectangle binding
  -> frame-binding digest and exact-frame acknowledgement
```

## Gap

The renderer has exact spatial addressing but no temporal authority for moving between captured elevation rows. Row choice is recalculated statelessly from nearest elevation every frame.

## Required parent domain

`prehistoric-rush-tree-impostor-elevation-row-continuity-authority-domain`

```txt
TreeImpostorViewContinuityCommand
  -> bind package generation, tree, camera, frame-set, form, and render revisions
  -> resolve lower/upper elevation rows
  -> apply deadband or interpolation policy
  -> combine row weights with circular azimuth weights
  -> normalize and capacity-bound exact frame bindings
  -> reject stale generations
  -> publish TreeImpostorViewContinuityResult

TreeImpostorContinuityProjectionCommand
  -> bind accepted exact frames and UV rectangles
  -> preserve form-transition fade
  -> submit one coherent billboard set
  -> publish FirstContinuousImpostorFrameAck
```

## Proposed coordinating surfaces

```txt
tree-impostor-elevation-band-index-kit
tree-impostor-elevation-bracket-resolution-kit
tree-impostor-elevation-deadband-kit
tree-impostor-view-continuity-state-kit
tree-impostor-bilinear-frame-weight-kit
tree-impostor-azimuth-elevation-binding-kit
tree-impostor-frame-weight-normalization-kit
tree-impostor-frame-capacity-budget-kit
tree-impostor-elevation-transition-stale-rejection-kit
tree-impostor-continuity-generation-binding-kit
tree-impostor-view-continuity-result-kit
tree-impostor-continuity-diagnostics-kit
first-continuous-impostor-frame-ack-kit
```

## Constraints

Preserve the current exact package generation, shared atlas, UV rectangles, ten archetypes, seeded ecology, stable collision authority, four fidelity forms, form hysteresis, dither crossfade, and adjacent-azimuth interpolation.