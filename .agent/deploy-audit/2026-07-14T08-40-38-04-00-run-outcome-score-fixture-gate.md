# Run Outcome and Score Fixture Gate

## Summary

The existing Node policy test proves local resolution decisions. It does not prove engine event publication, scene transition, terminal presentation, retry lineage, result persistence or deployment parity.

## Plan ledger

**Goal:** require executable evidence before claiming authoritative run results.

- [x] Inventory current test coverage.
- [x] Identify missing fixture layers.
- [x] Define source, browser, build and Pages gates.
- [ ] Execute fixtures after implementation.

## Existing coverage

```txt
continue outcome
win outcome and transition target
physics collision failure
collision priority over goal
collision rejection of pickups
goal-frame pickup acceptance
duplicate pickup suppression
fallback collision failure
structured-clone serializability
```

## Required fixture matrix

```txt
headless engine
  events and committed StepId
  exactly-one outcome per RunId
  score-policy derivation
  outcome journal retention
  late-event rejection

retry
  predecessor citation
  successor RunId allocation
  participant settlement
  predecessor retention
  duplicate retry rejection

browser
  terminal HUD/overlay cites OutcomeId
  first visible terminal frame receipt
  retry blocked until terminal acknowledgement
  successor frame cites retry lineage

artifact/deploy
  source and built result parity
  Pages result parity
  immutable provider/config fingerprints
```

## Commands not run

```txt
npm test
browser terminal-result fixture
build fixture
GitHub Pages fixture
```

## Non-claim

No durable score, result history, retry lineage, visible terminal-frame or deployment-parity claim is made.