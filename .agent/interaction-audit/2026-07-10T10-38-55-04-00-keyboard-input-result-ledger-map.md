# Interaction Audit: Keyboard Input Result Ledger Map

Timestamp: 2026-07-10T10-38-55-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Current interaction path

```txt
keydown / keyup
  -> app.input.left / right / boost / jump flags
  -> frame loop consumes flags
  -> movement, jump, boost, scene, camera, HUD, render
```

## Gap

Keyboard interaction mutates flags directly. The system does not record accepted, rejected, no-op, clamped, or scene-routed input rows.

## Required result vocabulary

```txt
accepted_start
accepted_left_down
accepted_right_down
accepted_boost_down
accepted_jump_start
rejected_jump_airborne
no_change_key_repeat
accepted_key_up
accepted_menu_space_start
accepted_enter_start
ignored_unknown_key
```

## Next interaction proof

- Add `InputResultRow` builder.
- Add stable frame ids.
- Tie input rows to `RunnerStepDelta` and `RunnerMovedEvent` rows.
- Expose recent rows through `PrehistoricRushHost.getState().presentation`.
- Prove rows through a DOM-free runner event fixture.

## Not next

- control redesign
- movement tuning
- camera feel changes
