# Deploy Audit: DOM-Free Source Event Fixture Gate

**Timestamp:** `2026-07-10T13-30-15-04-00`

## Current validation state

```txt
root package.json found: no
npm validation: not run
browser smoke: not run
DOM-free runner source event fixture: missing
runtime source changed in this pass: no
```

## Gate before deploy-sensitive changes

Create and run a DOM-free fixture before any deploy-sensitive or visual work:

```txt
scripts/prehistoric-rush-runner-source-event-fixture.mjs
```

The fixture should prove:

```txt
legacy host shape preserved
source frame id is stable across rows
runner.moved emits on movement frames
jump accepted and rejected rows exist
contact, pickup, scene, best-distance rows exist
render readback row shape exists
presentation pass does not erase source ids
```

## Stop conditions

Do not start deploy, visual, or movement changes until source-event fixture coverage exists.
