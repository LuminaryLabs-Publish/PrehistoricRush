# Deploy Audit: DOM-Free Runner Event Fixture Gate

**Run:** `2026-07-10T06-21-03-04-00`

## Current deploy / validation state

```txt
static browser app: yes
root package.json: not found
branch created: no
pull request created: no
runtime source changed: no
```

## Current validation gap

The repo has no root package validation surface and no DOM-free runner event fixture.

A browser smoke could prove that the scene loads, but it would not prove the required rows:

```txt
RunnerSourceState
RunnerStepDelta
RunnerMovedEvent
MovementResultRow
PresentationFrameRecord
HostPresentationSnapshot
RenderReadback
```

## Required fixture

```txt
scripts/prehistoric-rush-runner-event-fixture.mjs
```

The fixture should run without DOM/WebGL and verify:

```txt
legacy host-compatible snapshot shape
straight movement row
left/right turn row
boost row
jump accepted row
jump rejected/no-op row
contact row
pickup row
win row
best-distance row
runner.moved event payload
presentation frame record
render readback row shape
```

## Future command

After the fixture exists:

```txt
node scripts/prehistoric-rush-runner-event-fixture.mjs
```

If a root package file is introduced later:

```txt
npm run check
```

## Do not gate on first

```txt
visual smoke only
renderer extraction
terrain rewrite
new pickup content
GitHub Pages-only visual pass
```
