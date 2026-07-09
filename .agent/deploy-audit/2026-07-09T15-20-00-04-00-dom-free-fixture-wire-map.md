# Deploy Audit: DOM-Free Fixture Wire Map

**Timestamp:** `2026-07-09T15-20-00-04-00`

## Current deploy posture

`PrehistoricRush` is a static browser repo. The README says GitHub Pages deploys from `main` and uploads the static repository root.

No runtime source or workflow files changed in this pass.

## Current validation posture

The next implementation still needs a DOM-free fixture before it can claim source/consumer proof.

The planned fixture is:

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Fixture should prove

```txt
RunnerSourceState serializes.
RunnerStepDelta is deterministic.
RunnerMovedEvent matches dino-pose-domain-kit payload requirements.
dino pose output can be recorded as DinoPoseFrame.
CameraFrameRequest serializes without Three.js.
HudFrameRequest serializes without DOM.
ContactResultSnapshot covers no-op, pickup, and collision.
SceneDispatchResult covers menu, game, run-over, and win.
RenderReadback captures consumption facts without WebGL.
PresentationFrameRecord bundles one stable proof frame.
PresentationJournalSnapshot stays bounded.
HostPresentationSnapshot is additive and preserves legacy fields.
```

## Deployment rule

Do not make the fixture a deployment blocker until the script exists and has at least one local pass.

Do not invent a package workflow unless the implementation pass deliberately adds package metadata.

## Main branch rule

```txt
write target: main
branch created: no
pull request created: no
```
