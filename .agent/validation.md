# PrehistoricRush Validation

**Audit timestamp:** `2026-07-16T12-47-00-04-00`  
**Scope:** tree generation reconciliation, atlas decoding, decoded-texture admission, view-angle selection, atlas frame addressing, and visible proof

## Summary

Source review confirms exact generation identity, generation-bound patch/cache identity, four-form retained state, horizon selection, hysteresis, dither crossfade, required atlas decoding, decoded-image renderer admission, and source checks. It also confirms that far impostors ignore camera elevation and derive texture offsets from inferred atlas layout instead of exact selected frame records.

## Intent

Separate verified fidelity implementation from the remaining frame-addressing and executable visual-proof work.

## What needs to happen

- [x] Compare all 11 Publish repositories and select runtime-ahead PrehistoricRush.
- [x] Inspect the post-ledger delta through `9c62bc402451aea7588373f760883517281b9a39`.
- [x] Inspect package generation, patch/cache binding, retained forms, horizon, hysteresis, and crossfade.
- [x] Inspect runtime image decoding and decoded-texture admission.
- [x] Compare capture frame metadata with runtime frame/material selection.
- [x] Change documentation only on `main`; create no branch or pull request.
- [ ] Execute functional browser, artifact, and Pages fixtures.

## Verified source findings

```txt
exact package generation IDs: present
generation digest in vegetation identity: present
near/medium/far/horizon forms: present
retained form state: present
hysteresis: present
dither crossfade: present
required runtime image decoding: present
undecoded render rejection: present
source checks before Pages deploy: present

camera elevation frame selection: absent
exact frame-record batch identity: absent
frame rectangle adoption: absent
exact selected-frame receipt: absent
functional rendered-angle fixture: absent
```

## Source-derived boundary

```txt
capture emits azimuth/elevation frame records
  -> hydration decodes atlas images
  -> renderer admits decoded images
  -> renderer filters frames to one base elevation
  -> azimuth chooses a material index
  -> texture Y offset is inferred from atlas rows
```

This proves a remaining view-selection and atlas-addressing gap. It does not prove a visible defect on a particular browser or camera position.

## Change boundary

```txt
documentation changed by audit: yes
runtime JavaScript changed by audit: no
packages/tests/assets changed by audit: no
gameplay/rendering/physics changed by audit: no
workflow/deployment changed by audit: no
branch created: no
pull request created: no
```

## Checks not completed

```txt
npm test
browser azimuth sweep
browser elevation sweep
atlas rectangle and row addressing
far/horizon transition visual fixture
built-output smoke
GitHub Pages smoke
```

## Non-claims

No exact multi-elevation frame selection, atlas-addressing correctness, rendered-angle parity, artifact parity, Pages parity, or production readiness is claimed.