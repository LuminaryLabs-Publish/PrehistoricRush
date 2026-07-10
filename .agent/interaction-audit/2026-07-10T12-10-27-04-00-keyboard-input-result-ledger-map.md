# Interaction Audit: Keyboard Input Result Ledger Map

**Timestamp:** `2026-07-10T12-10-27-04-00`

## Current interaction path

```txt
click Start Rush
  -> start()
  -> app.scene = game

keydown Enter
  -> start()

keydown Space
  -> if game: app.input.jump = true
  -> else: start()

keydown A / ArrowLeft
  -> app.input.left = true

keydown D / ArrowRight
  -> app.input.right = true

keydown W / ArrowUp
  -> app.input.boost = true

keyup A/D/W/arrows
  -> corresponding input flag false
```

## Missing input result rows

```txt
no input event id
no scene-at-input field
no accepted/rejected/no-op field
no reason code for Space starting game vs jumping
no reason code for jump ignored while airborne
no reason code for left/right simultaneous input
no link from input row to movement result row
no link from movement result row to runner.moved event
```

## Required row contract

```txt
InputResultRow {
  inputId
  frameId
  source
  code
  sceneBefore
  sceneAfter
  accepted
  action
  reason
  flagsBefore
  flagsAfter
}
```

## Recommendation

Add input rows before changing controls. This will let the DOM-free fixture prove that keyboard, scene transition, jump, boost, and turn commands are preserved while the presentation source ledger is introduced.
