# Interaction Audit: Keyboard Input Result Reason Map

Timestamp: 2026-07-10T07-50-29-04-00
Repo: LuminaryLabs-Publish/PrehistoricRush

## Current interaction surface

- Start button starts the game.
- Enter starts the game.
- Space starts the game from menu or attempts jump in game.
- A / ArrowLeft set left input.
- D / ArrowRight set right input.
- W / ArrowUp set boost input.
- Keyup clears directional and boost flags.

## Gap

Keyboard input mutates `app.input` and scene state directly. The runner has no accepted/rejected/no-change input row and no stable reason code.

## Required rows

```txt
InputResultRow
  frameId
  inputType
  action
  before
  after
  status
  reason
  linkedMovementRowId
```

## Required reasons

```txt
accepted_start
accepted_left_on
accepted_left_off
accepted_right_on
accepted_right_off
accepted_boost_on
accepted_boost_off
accepted_jump
rejected_jump_airborne
no_change_same_scene
no_change_key_unmapped
```

## Next safe ledge

```txt
PrehistoricRush Runner Event Journal Readback Catch-up + DOM-Free Presentation Gate
```
