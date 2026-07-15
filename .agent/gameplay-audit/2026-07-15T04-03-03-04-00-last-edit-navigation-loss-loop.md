# Gameplay Audit: Last Edit Navigation Loss Loop

**Timestamp:** `2026-07-15T04-03-03-04-00`

## Summary

The creator can show a final body or color edit that the immediately launched game does not use. The discrepancy is timing-dependent and silent because the creator updates first and persists later.

## Plan ledger

**Goal:** make Play mean “start with the character currently shown,” not “start with the most recent profile whose debounce happened to finish.”

- [x] Confirm live draft and preview update on every input event.
- [x] Confirm delayed 160 ms profile patch.
- [x] Confirm Play and Menu are normal anchors.
- [x] Confirm unload cleanup does not flush the pending patch.
- [x] Confirm game startup loads storage once before composition.
- [ ] Gate Play and Menu on accepted profile settlement.
- [ ] Preserve draft and explain failures when settlement is rejected.
- [ ] Prove game character equality after navigation.

## Reproduction contract

```txt
1. Open charactercreator.html.
2. Change Size, Body, Tail, Legs, Skin, or Belly.
3. Activate Play within 160 ms of the last input event.
4. Creator preview already shows the new draft.
5. Navigation can occur before patchPlayerCharacterProfile executes.
6. game-runtime loads the previous localStorage profile.
7. The run can begin with the previous raptor.
```

The same risk applies to Menu navigation. Reset is not affected by this exact path because reset writes immediately.

## Gameplay impact

```txt
player intent: use the character visibly shown at Play activation
accepted creator draft: not represented by a typed result
stored profile: may remain predecessor
run composition: consumes stored predecessor
visible outcome: character can appear to revert
error feedback: none
retry or recovery contract: none
```

## Required gameplay invariant

```txt
PlayAccepted
  => creator draft is clean
  => CreatorProfileCommitResult.status == accepted
  => destination expectedProfileRevision == stored profile revision
  => run character profile revision == expected profile revision
  => creature content hash matches the accepted payload
  => first visible run frame acknowledges the same artifact
```

No gameplay code was changed by this audit.