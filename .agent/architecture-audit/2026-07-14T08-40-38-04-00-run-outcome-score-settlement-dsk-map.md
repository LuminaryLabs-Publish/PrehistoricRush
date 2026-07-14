# Run Outcome and Score Settlement DSK Map

## Summary

The existing product domain owns deterministic per-tick outcome resolution, but no domain owns durable run-result settlement across simulation, scene, score, UI, retry and persistence consumers.

## Plan ledger

**Goal:** add one coordinating parent without replacing the existing run, resolution, scene, renderer or profile kits.

- [x] Preserve current Core and product ownership.
- [x] Identify the terminal evidence split.
- [x] Define required commands, artifacts, results and receipts.
- [ ] Implement only after source changes are separately approved.

## Existing ownership

```txt
prehistoric-rush-domain-kit
  run state, route, surfaces, product input, pose, score label and public API

prehistoric-rush-resolution-policy
  proposal/observation resolution, collision priority, pickups, goal, events and transition

core-simulation-kit
  committed proposal/observation/result frame

core-scene-kit
  game -> run-over/win transition

core-player/core-character
  control and terminal suspension

game-page-entry + three-patch-stream-adapter
  input, HUD, camera, world and renderer submission
```

## Missing parent

```txt
prehistoric-rush-run-outcome-score-settlement-authority-domain
```

## Planned coordinating surfaces

```txt
run-outcome-settlement-command-kit
run-outcome-id-kit
terminal-step-admission-kit
run-input-fingerprint-kit
score-policy-kit
score-policy-revision-kit
run-outcome-artifact-kit
run-outcome-settlement-result-kit
run-outcome-journal-kit
terminal-event-deduplication-kit
terminal-scene-binding-kit
terminal-ui-projection-kit
terminal-frame-ack-kit
run-retry-command-kit
retry-lineage-kit
run-retry-settlement-result-kit
predecessor-result-retention-kit
late-terminal-work-rejection-kit
run-result-persistence-adapter-kit
run-result-diagnostics-kit
run-result-fixture-kit
```

## Required contract

```txt
RunOutcomeSettlementCommand
  -> admit one terminal simulation result for RunId
  -> bind runtime/config/profile/body/route/score-policy fingerprints
  -> derive immutable score and terminal facts
  -> atomically publish artifact, journal entry, scene/UI projection and diagnostics
  -> wait for FirstVisibleTerminalFrameAck

RunRetryCommand
  -> cite accepted predecessor artifact
  -> allocate successor RunId and lineage
  -> reset mandatory participants atomically
  -> preserve predecessor evidence
```

## Boundary

This audit changes documentation only. The planned surfaces are not counted as implemented kits.