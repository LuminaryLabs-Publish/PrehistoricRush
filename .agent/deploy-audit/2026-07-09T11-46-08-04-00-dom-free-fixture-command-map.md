# PrehistoricRush Deploy Audit: DOM-Free Fixture Command Map

**Generated:** `2026-07-09T11-46-08-04-00`

## Current deploy/runtime posture

`PrehistoricRush` is a static browser route.

The current docs pass did not find or introduce a root package validation command.

## Validation gap

The next implementation should add a DOM-free fixture script only when it is ready to assert the host-presentation event ledger.

```txt
scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

## Fixture command target

Preferred command once package metadata exists:

```txt
node scripts/prehistoric-rush-presentation-frame-fixture.mjs
```

If a root `package.json` is introduced in the implementation pass, add an explicit script such as:

```txt
npm run check:presentation-fixture
```

## Fixture assertions

```txt
runner source records are deterministic
runner step delta matches expected movement input
runner.moved event is emitted
existing dino pose kit consumes runner.moved
camera frame request shape is stable
HUD frame request shape is stable
contact result rows are explicit
scene dispatch rows are explicit
render readback rows are explicit
host legacy fields stay unchanged
host presentation snapshot exists
```

## Do not do next

```txt
Do not create a branch.
Do not add PR-only validation.
Do not make fixture depend on WebGL.
Do not require a browser for the first proof gate.
Do not rewrite the deploy path before proof exists.
```

## Deployment risk

Low for this docs-only pass.

Future implementation risk is moderate because `src/game.js` currently performs a second render pass and any proof layer must not add a third render loop or shift the current route timing.
