# Interaction Audit: Start Command Status and Generation Map

**Timestamp:** `2026-07-12T21-51-38-04-00`

## Summary

Start interaction policy is split between the UI wrapper and the domain API. Button and Space inspect status, Enter does not, and domain `start()` accepts every caller. One command envelope must replace these inconsistent gates.

## Plan ledger

**Goal:** map every start ingress to one status-, scene-, repeat-, and generation-bound result.

- [x] Map button, Space, Enter, blur, and public access.
- [x] Map Core Scene exits and direct transitions.
- [x] Define command envelope and rejection codes.
- [x] Define exactly-once delivery.
- [ ] Implement later.

## Current admission map

| Ingress | Current guard | Gap |
|---|---|---|
| UI button | game means Jump, otherwise Start | no command ID/generation |
| Space | game means Jump, otherwise Start | no repeat/duplicate result |
| Enter | none | active-run and repeat restart |
| domain `start()` | none | scene/status/stale/duplicate admission absent |
| public engine | capability access | bypasses host interaction policy |

## Required command

```txt
RunStartCommand {
  commandId
  sequence
  intent: start | retry | run-again
  runtimeSessionId
  expectedSceneId
  expectedStatus
  expectedRunGeneration
  inputEventId
  repeat
}
```

## Required rejection codes

```txt
start-not-allowed
active-run-restart-rejected
key-repeat-rejected
duplicate-start-command
stale-run-generation
stale-scene
out-of-order-command
runtime-retiring
participant-preparation-failed
participant-rollback-failed
```

## Required flow

```txt
browser/public intent
  -> normalize to RunStartCommand
  -> validate scene/status and intent
  -> reject repeat/duplicate/stale evidence
  -> reserve command ID
  -> close predecessor input/async admission
  -> prepare participants
  -> commit one result
  -> duplicate delivery returns sealed result
  -> acknowledge first visible frame
```

## Required invariants

```txt
all ingress surfaces share one command path
UI policy cannot disagree with domain policy
rejected commands preserve run state and participants
one input event cannot create multiple run generations
public capabilities enforce the same admission contract
```

## Missing fixtures

- [ ] Every ingress in menu/game/run-over/win.
- [ ] Key repeat and duplicate event ID.
- [ ] Stale scene/run generation.
- [ ] Public capability parity.
- [ ] Rejected command zero-effect proof.

## Validation boundary

Documentation only. No interaction, scene, input, or runtime behavior changed.